import Enzyme, {shallow, mount} from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
Enzyme.configure({ adapter: new Adapter() });

import React from 'react'
import {PeopleTable} from './PeopleTable'


function generateList(length) {
    const arr = []
    for(let i = 0; i < length; i++) {
        arr.push({
            firstName: Math.random().toString(),
            lastName: Math.random().toString(),
            email: Math.random().toString()
        })
    }

    return arr
}

it('should render all items from short list', () => {
    const shortList = generateList(5)

    const container = mount(<PeopleTable people = {shortList}/>)
    const rows = container.find('.test--people-list__row')
 
    expect(rows.length).toEqual(shortList.length + 1)
})

it('should render a part of long list', () => {
    const longList = generateList(200)

    const container = mount(<PeopleTable people = {longList}/>)
    const rows = container.find('.test--people-list__row')

    expect(rows.length).toEqual(10)
})

it('should request fetching', (done)=>{
    mount(<PeopleTable people = {[]} fetchAllPeople = {done}/>)
})