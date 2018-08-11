import React, {Component} from 'react'
import AddPeopleFrom from '../people/AddPeopleForm'
import PeopleList from '../people/PeopleList'
import PeopleTable from '../people/PeopleTable'
import {connect} from 'react-redux'
import {Route, NavLink} from 'react-router-dom'
import {peopleAdd, moduleName} from '../../ducks/people'
import Loader from '../common/Loader'

class PeoplePage extends Component {
    render() {
        const {loading} = this.props
        return (
            <div>
                <PeopleList/>
                <h1>Add new Pperson</h1>
                <NavLink to="/people/add" activeStyle={{color: 'red'}}>AppUser</NavLink>
                <NavLink to="/people/show" activeStyle={{color: 'red'}}>AppUser</NavLink>

                {/* <Route path='/people/add' render={()=> <AddPeopleFrom onSubmit = {this.handleAddPeople}/>}/>*/}
                {loading
                    ? <Loader />
                    : <AddPeopleFrom onSubmit = {this.handleAddPeople}/>
                }
                <Route path='/people/show' render={()=> <PeopleTable/>}/>
                
            </div>
        )
    }

    handleAddPeople = ({firstName, lastName, email}) => this.props.peopleAdd({firstName, lastName, email})
}

export default connect(state => ({
    loading: state[moduleName].loading
}), {peopleAdd})(PeoplePage)