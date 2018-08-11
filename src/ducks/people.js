import {appName} from '../config'
import {Record,  OrderedMap} from 'immutable'
import {put, call , takeEvery, all, select, fork, spawn, cancel, cancelled, race} from 'redux-saga/effects'
import {delay} from 'redux-saga'
import {fbDataToEntities} from './utils'
import {reset} from 'redux-form'
import {createSelector} from 'reselect'
import firebase from 'firebase'

// delay создает задержку
// fork позволяет выполнить фоновую задачу он запускает сагу не блокирующим способом 
// spawn аналогичен fork но не валит все саги в случаии ошибки

export const moduleName = 'people'
const prefix = `${appName}/${moduleName}`

export const FETCH_ALL_REQUEST = `${prefix}/FETCH_ALL_REQUEST`
export const FETCH_ALL_SUCCESS = `${prefix}/FETCH_ALL_SUCCESS`
export const FETCH_ALL_ERROR = `${prefix}/FETCH_ALL_ERROR`
export const ADD_PERSON_REQUEST = `${prefix}/ADD_PERSON_REQUEST`
export const ADD_PERSON_SUCCESS = `${prefix}/ADD_PERSON_SUCCESS`
export const ADD_PERSON_ERROR = `${prefix}/ADD_PERSON_ERROR`
export const ADD_EVENT_REQUEST = `${prefix}/ADD_EVENT_REQUEST`
export const ADD_EVENT_SUCCESS = `${prefix}/ADD_EVENT_SUCCESS`


const ReducerState = Record({
    entities: new OrderedMap({}),
    loading: false

})

const PersonRecord = Record({
    firstName: null,
    lastName:null,
    email:null,
    uid:null,
    events:[]
})


export default function reducer(state = new ReducerState(), action) {
    const {type, payload} = action

    switch (type) {
        case FETCH_ALL_REQUEST:
        case ADD_PERSON_REQUEST:
            return state.set('loading', true)

        case ADD_PERSON_SUCCESS:
            return state
                .set('loading', false)
                .setIn(['entities', payload.uid], new PersonRecord(payload))

        case FETCH_ALL_SUCCESS:
            return state
                .set('loading', false)
                .set('entities', fbDataToEntities(payload, PersonRecord))

        case ADD_EVENT_SUCCESS:
            return state.setIn(['entities', payload.personUid, 'events'], payload.events)

        default:
            return state
    }
}

/**
 * Selector
 */
export const stateSelector = state => state[moduleName]
export const entitiesSelector = createSelector(stateSelector, state => state.entities)
export const idSelector = (_, props) => props.uid
export const peopleListSelector = createSelector(entitiesSelector, entities => {
    return  entities.valueSeq().toArray()
 }
)
export const personSelector = createSelector(entitiesSelector, idSelector, (entities, id)=> entities.get(id))

/**
 * Action Creator
 */

export function peopleAdd({email, firstName, lastName}) {
    return {
        type: ADD_PERSON_REQUEST,
        payload:{
            email, firstName, lastName
        }
    }
}

export function fetchAllPeople() {
    return {
        type: FETCH_ALL_REQUEST
    }
}

export function addEventToPerson(eventUid, personUid){
    return {
        type: ADD_EVENT_REQUEST,
        payload: { eventUid, personUid }
    }
}




export const addPersonSaga = function * (action) {
    //const id = generateId()


    const personRef = firebase.database().ref('people')
    try {
       const rezult = yield call([personRef, personRef.push], action.payload)
       yield put({
            type: ADD_PERSON_SUCCESS,
            payload: {...action.payload, uid:rezult.key}
        })
        yield put(reset('people'))
    } catch (error) {
        console.log('Error ed in firebase', error)
        yield put({
            type: ADD_PERSON_ERROR,
            error
        })
    }



}

export const fetchAllPersonSaga = function * (action) {
    const ref = firebase.database().ref('people')

    const data = yield call([ref, ref.once], 'value')

    yield put({
        type: FETCH_ALL_SUCCESS,
        payload: data.val()
    })
}

export const addEventSaga = function * (action) {
    const { eventUid, personUid } = action.payload
    const eventsRef = firebase.database().ref(`people/${personUid}/events`)

    const state = yield select(stateSelector)
    const events = state.getIn(['entities', personUid, 'events']).concat(eventUid)

    try{
        yield call([eventsRef, eventsRef.set], events)

        yield put({
            type: ADD_EVENT_SUCCESS,
            payload:{
                personUid,
                events
            }
        })
    } catch (error) {

    }

}

export const backgroundSyncSaga = function * () {
  try { //перехватываем остановку задачи 
    while(true){
        yield call(fetchAllPersonSaga)
        yield delay(2000)
        
      }
  } finally {
      if(yield cancelled()) { // эффект проверяет действительно ли сага была остановлена 
          console.log('----', 'cancel sync saga')
      }
  }
   
}

export const cancelllabeleSync = function * (){
    yield race({ // этот эффект ждет одну сагу и остальные отменяет 
        sync: backgroundSyncSaga(),
        delay: delay(6000) // Как только эта сага закончиться остальные будут отменены но запущены будут все 
    })

    //const task = yield fork(backgroundSyncSaga)
   // yield delay(6000)
    //yield cancel(task) // здесь происходит отмена задачи обновления данных в фоне 
}

// export function peopleAdd({email, firstName, lastName}) {

//     return {
//         type:ADD_PERSON,
//         payload:{
//             email, firstName, lastName
//         },
//         generateId: true
//     }
//     // return dispatch => {
//     //     dispatch({
//     //         type:ADD_PERSON,
//     //         payload:{
//     //             email, firstName, lastName, id: Date.now()
//     //         }

//     //     })
//     // }
// }

export const saga = function  * () {
    yield spawn(cancelllabeleSync)// Эта задача будет запущенна отдельно в фоне 
    yield all([
        takeEvery(ADD_PERSON_REQUEST, addPersonSaga),
        takeEvery(FETCH_ALL_REQUEST, fetchAllPersonSaga),
        takeEvery(ADD_EVENT_REQUEST, addEventSaga)
    ])
}
