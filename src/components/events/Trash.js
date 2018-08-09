import React, { Component } from 'react'
import {DropTarget} from 'react-dnd'
// import {DropTarget} from 'react-dnd'
import {connect} from 'react-redux'
// import {connect} from 'react-redux'
import Loader from '../common/Loader'
import {stateSelector, deleteEvent} from '../../ducks/events'

class Trash extends Component {

    render() {
        const {connectDropTarget, isOver, loading} = this.props
        const style = {
            border: `1px solid ${isOver ? 'green' : 'black'}`,
            width: 100, height: 100,
            position:'fixed',
            top:0, right:0
        }
        return connectDropTarget(
            <div style={style}>
                Trash
                {loading && <Loader/>}
            </div>
        )
    }
}

const collect = (connect, monitior) => ({
    connectDropTarget: connect.dropTarget(),
    isOver: monitior.isOver()
})

const spec = {
    drop(props, monitor) {
        const item = monitor.getItem()
        props.deleteEvent(item.uid)
    }
}



export default connect(state => ({
    loading: stateSelector(state).loading
}), {deleteEvent})(DropTarget('event',spec, collect )(Trash))
