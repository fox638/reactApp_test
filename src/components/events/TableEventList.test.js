import Enzyme, {shallow, mount} from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
Enzyme.configure({ adapter: new Adapter() });

import React from 'react'
import events from '../../mocks/conferences'
import {EventList} from './EventList'
import Loader from '../common/Loader'
import {EventRecord} from '../../ducks/events'

const testEvents = events.map(event => new EventRecord({...event, uid: Math.random().toString()}))

it('should render loader', () => {
    const container = shallow(<EventList loading fetchAll = {()=>({})} />)

    expect(container.contains(<Loader />))
})

it('should render event list', ()=>{
    const container = shallow(<EventList events = {testEvents} fetchAll = {()=>({})}/>)
    const rows = container.find('.test--event-list__row')
    expect(rows.length).toEqual(testEvents.length)
})

it('shold request fetch data', (done)=>{
    mount(<EventList events = {[]} fetchAll={done}/>)
})

it('should select event', () => {
    let selected = null
    const selectEvent = (uid) => selected = uid

    const container = mount(<EventList
            events = {testEvents}
            fetchAll = {() => {}}
            selectEvent = {selectEvent}
        />)

    container.find('.test--event-list__row').first().simulate('click')

    expect(selected).toEqual(testEvents[0].uid)
})