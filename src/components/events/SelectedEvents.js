import React, { Component } from 'react'
import {selectedEventsSelector} from '../../ducks/events'
import {connect} from 'react-redux'
import SelectedEventCard from './SelectedEventCard'
import {TransitionMotion, spring} from 'react-motion'

class SelectedEvents extends Component {
    render() {
        return <TransitionMotion
            styles={this.getStyles()}
            willLeave={this.willLeave}
            willEnter={this.willEnter}
        >
            {(interpolated)=> <div>
                {
                    interpolated.map(config => <div style = {config.style} key = {config.key}>
                        <SelectedEventCard event = {config.data}/>
                    </div>)
                }
            </div>}

        </TransitionMotion>
    }
    willLeave = () => ({
        opacity: spring(0, {stiffness: 100})
    })

    getStyles() {
        return this.props.events.map(event => ({
            style: {
                opacity: spring(1, {stiffness: 50})
            },
            key: event.uid,
            data: event
        }))
    }
    willEnter = () => ({
        opacity: 0
    })
}


/* render() {
    return (
        <div>
            {this.props.events.map(event => <SelectedEventCard event = {event} key = {event.uid}/>)}
        </div>
    )
} */
export default connect(state => ({
    events: selectedEventsSelector(state)
}))(SelectedEvents)