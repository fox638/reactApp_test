import React, { Component } from 'react'
import {connect} from 'react-redux'
import {moduleName, fetchAll, fetchLazy, eventListSelector, selectEvent} from '../../ducks/events'
import Loader from '../common/Loader'
import {Table, Column, InfiniteLoader, defaultTableRowRenderer} from 'react-virtualized'
import { DragSource } from 'react-dnd'
//import { DragSource } from 'react-dnd'
import TableRow from './TableRow'
import 'react-virtualized/styles.css'
import Trash from './Trash'



export class EventList extends Component {

    componentDidMount(){
        //this.props.fetchAll()
        this.props.fetchLazy()
    }
  render() {
      const {loaded, events, connectDragSource} = this.props
     // if (loading) return <Loader />
    return (
        <div>
            <Trash/>
            <InfiniteLoader
                isRowLoaded={this.isRowLoaded}
                rowCount={loaded ? events.length : events.length + 1}
                loadMoreRows={this.loadMoreRows}
            >
                {({onRowsRendered, registerChild})=>
                    <Table
                        ref={registerChild}
                        rowCount={events.length}
                        rowGetter={this.rowGetter}
                        rowHeight={40}
                        headerHeight={50}
                        overscanRowCount={5} // здесь указываеться сколько строк рендерить вверху и внизу 
                        width={700}
                        height={300}
                        onRowClick={this.handleRowClick}
                        onRowsRendered={onRowsRendered}
                        rowRenderer = {this.getRowRenderer}
                        
                    >
                        
                        <Column
                            label='title'
                            dataKey='title'
                            width={300}
                        />
                        <Column
                            label='where'
                            dataKey='where'
                            width={250}
                        />
                        <Column
                            label='when'
                            dataKey='month'
                            width={150}
                        />
                
                    </Table>
                }
                
            </InfiniteLoader>
        </div>
    )
  }

  getRowRenderer = (rowCtx) => <TableRow {...rowCtx} />

loadMoreRows = () => {
    console.log('---', 'load more')
    this.props.fetchLazy()
}

  isRowLoaded = ({index}) => index < this.props.events.length

  rowGetter = ({ index }) => {
      return this.props.events[index]
  }

  handleRowClick = ({rowData}) => {
      
      const {selectEvent} = this.props
      selectEvent && selectEvent(rowData.uid)
  }
}

const elementSource = {
    beginDrag(props) {
        console.log('beginDrag')
        return {}
    }
}
function collect(connect, monitor) {
    return {
        connectDragSource: connect.dragSource(),
        isDragging:monitor.isDragging()
    }
}


export default connect(state => ({
    events: eventListSelector(state),
    loading: state[moduleName].loading
}), {fetchAll, fetchLazy, selectEvent})(EventList)