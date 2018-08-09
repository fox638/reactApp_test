import React, { Component } from 'react'
import {Route} from 'react-router-dom'
import AdminPage from './routes/AdminPage'
import AuthPage from './routes/AuthPage'
import EventsPage from './routes/EventsPage'
import ProtectedRouter from './common/ProtectedRoute'
import PeoplePage from './routes/PeoplePage'
import {connect} from 'react-redux'
import {moduleName, signOut} from '../ducks/auth'
import {Link} from 'react-router-dom'
import history from '../history'
import CustomDragLayer from './CustomDragLayer'
//import Basket from './basket/BasketComponent'

 class Root extends Component {
  render() {
    const {signOut, signedIn} = this.props
    const btn = signedIn
          ? <button onClick={signOut}>Sign Out</button>
          : <Link to="/auth/signin">Sign In</Link>
    return (
      <div>
        {btn}
        <ul>
          <li><Link to="/admin">Admin</Link></li>
          <li><Link to="/people">People</Link></li>
          <li><Link to="/events">Events</Link></li>
        </ul>
        <button onClick={this.changeLocation}>Переход</button>
        <ProtectedRouter path='/admin' component={AdminPage} />
        <ProtectedRouter path='/people' component={PeoplePage}/>
        <ProtectedRouter path='/events' component={EventsPage}/>
        <Route path='/auth' component={AuthPage} />
        <CustomDragLayer/>

      </div>
    )


  }
  changeLocation = () => {
    history.push('/people')
  }
}

export default connect(state=>({
  signedIn: !!state[moduleName].user
}), {signOut})(Root)
