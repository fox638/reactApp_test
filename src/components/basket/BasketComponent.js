import React, { Component } from 'react'
import {connect} from 'react-redux'
import { DropTarget } from 'react-dnd'



class BasketComponent extends Component {
    render() {
        const {connectDropTarget} = this.props
        return connectDropTarget(
            <div style={{
                position:'fixed',
                right:'50px',
                width:'100px',
                height:'100px',

            }}>
                <img style={{width:'100%'}} src='data:image/png;base64,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'/>
            </div>
        )
    }
}

const basketTarget = {
    drop(props){
        
    }
}

function collect(connect, monitior) {
    return {
        connectDropTarget: connect.dropTarget(),
    }
}


export default DropTarget('event', basketTarget, collect)(BasketComponent)