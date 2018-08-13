import firebase from 'firebase'
import {appName} from '../config'
import {Record} from 'immutable'
import {all, apply, call, take, put, cps, takeEvery, spawn} from 'redux-saga/effects'
import {eventChannel} from 'redux-saga'
import {push} from 'react-router-redux'
export const ReducerRecord = Record({
    user: null,
    error: null,
    loading: false
})


export const moduleName = 'auth'
export const SIGN_UP_REQUEST = `${appName}/${moduleName}/SIGN_UP_REQUEST`
export const SIGN_UP_SUCCESS = `${appName}/${moduleName}/SIGN_UP_SUCCESS`
export const SIGN_UP_ERROR = `${appName}/${moduleName}/SIGN_UP_ERROR`

export const SIGN_IN_REQUEST = `${appName}/${moduleName}/SIGN_IN_REQUEST`
export const SIGN_IN_SUCCESS = `${appName}/${moduleName}/SIGN_IN_SUCCESS`
export const SIGN_IN_ERROR = `${appName}/${moduleName}/SIGN_IN_ERROR`

export const SIGN_OUT_REQUEST = `${appName}/${moduleName}/SIGN_OUT_REQUEST`
export const SIGN_OUT_SUCCESS = `${appName}/${moduleName}/SIGN_OUT_SUCCESS`

export default function reducer(state = new ReducerRecord(), action) {
    const {type, payload, error} = action

    switch (type) {
        case SIGN_UP_REQUEST:
            return state.set('loading', true)
    
        /* case SIGN_UP_SUCCESS:
            return state
                    .set('loading', false)
                    .set('user', payload.user)
                    .set('error', null) */

        case SIGN_IN_SUCCESS:
            return state
                    .set('loading', false)
                    .set('user', payload.user)
                    .set('error', null)

        case SIGN_UP_ERROR:
            return state
                    .set('loading', false)
                    .set('error', error)
            
        case SIGN_OUT_SUCCESS:
            return new ReducerRecord()
                    
        default:
            return state
    }
}

export function signUp(email, password) {
    return {
        type: SIGN_UP_REQUEST,
        payload: {
            email, password
        }
    }
}

export function signIn(email, password) {
    return {
        type:SIGN_IN_REQUEST,
        payload:{
            email, password
        }
    }
}
export function signOut() {
    return {
        type: SIGN_OUT_REQUEST,

    }
}

export const signUpSaga = function * () {
    
    const auth = firebase.auth()

    while (true) { // для того что бы постоянно реагировать на запросы 
        const action = yield take(SIGN_UP_REQUEST) // указываем какие экшены брать если поставить * будет брать все здесь типа взять такое экшен

        try{
            const user = yield call(
                [auth, auth.createUserWithEmailAndPassword], 
                action.payload.email, action.payload.password
            )
        
            /* yield put({
                type: SIGN_UP_SUCCESS,
                payload: {user}
            }) */
        } catch (error){
            yield put({
                type: SIGN_UP_ERROR,
                error
                
            })
        }
    }
        
   
}

export const watchStatusChange = function * () { //ceйчас не используеться все переделано на каналы 
    const auth = firebase.auth()
        try {
            yield cps([auth, auth.onAuthStateChanged])

            //yield put(push('/auth/signin'))
        } catch (user) { // здесь костыл cps работает с функциями в стиле node js где первый аргумент ошибка но onAuthStateChanged возвращает первым аргументом usera 
    
            yield put({
                type: SIGN_IN_SUCCESS,
                payload: {user}
            })
        }
   
    
    
}


// export function signUp(email, password) {
//     return dispatch => {
//        dispatch({
//            type: SIGN_UP_REQUEST
//        })

//        firebase.auth().createUserWithEmailAndPassword(email, password)
//         .then(user => dispatch({
//             type: SIGN_UP_SUCCESS,
//             payload: {user}
//         }))
//         .catch(error => dispatch({
//             type: SIGN_UP_ERROR,
//             error
//         }))
//     }
// }

// firebase.auth().onAuthStateChanged(user=> {
//     const store = require('../redux').default

//     store.dispatch({
//         type: SIGN_IN_SUCCESS,
//         payload:{user}
//     })
// })


export const signOutSaga = function * () {
    const auth = firebase.auth()
    try {
        yield call([auth, auth.signOut])
        
        
    } catch (error) {
        
    }
    
}

export const signInSaga = function * () {
    
    const auth = firebase.auth()
    const action = yield take(SIGN_IN_REQUEST)
        try {
            
            const user = yield call(
                [auth, auth.signInWithEmailAndPassword],
                action.payload.email, action.payload.password
            )

            
        } catch (error) {
            yield put({
                type: SIGN_IN_ERROR,
                error
            })
        }
    
   
}

/* const createAuchSoket = () => eventChannel(emmit => {
    firebase.auth().onAuthStateChanged(user => emmit({ user }))
   //const auch = firebase.auth()
   // auch.onAuthStateChanged((user, error) => emmit({user, error}))
}) */
const createAuthChannel = () => eventChannel(emit => firebase.auth().onAuthStateChanged(user => emit({ user })))

export const realitmeSync = function * () {
    const chan = yield call(createAuthChannel)
    while (true) {
        const { user, error } = yield take(chan)
        
        if(user){
            console.log('----- Auch user')
            console.log(user)
            yield put({
                type: SIGN_IN_SUCCESS,
                payload: {user}
            })

        } else {
            yield put({
                type: SIGN_OUT_SUCCESS
            })
            yield put(push('/auth/signin'))
        }
    }
}

export const saga = function * () {
    yield spawn(realitmeSync)
    yield all([
        signUpSaga(),
      //  watchStatusChange(),
        takeEvery(SIGN_OUT_REQUEST, signOutSaga),
        takeEvery(SIGN_IN_REQUEST, signInSaga)
    ])
}