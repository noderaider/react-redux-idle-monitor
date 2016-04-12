import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'
import { assert } from 'chai'
import { ROOT_STATE_KEY, IDLESTATUS_ACTIVE } from 'redux-idle-monitor/lib/constants'
import getStyle from './style'


const GenericIdleMonitor = props => {
  const { panel, title, ulIdle, ulActive, li, activeStyle, idleStyle, trueStyle, falseStyle } = getStyle(props)
  const { idleStatus, isIdle, isPaused, isDetectionRunning, lastActive, lastEvent, children } = props
  const { type, x, y } = lastEvent
  const lastDate = new Date(lastActive)
  return (
    <div style={panel}>
      <ul style={isIdle ? ulIdle : ulActive}>
        <li style={li}><h6 style={title}>idleMonitor</h6></li>
        <li style={li}>idleStatus <span style={idleStatus === IDLESTATUS_ACTIVE ? activeStyle : idleStyle}>[{idleStatus}]</span></li>
        <li style={li}>{isIdle === true ? <span style={trueStyle}>Idle</span> : <span style={falseStyle}>Not Idle</span>}</li>
        <li style={li}>isPaused: {isPaused === true ? <span style={trueStyle}>Paused</span> : <span style={falseStyle}>Not Paused</span>}</li>
        <li style={li}>isDetectionRunning: {isDetectionRunning === true ? <span style={trueStyle}>Detecting</span> : <span style={falseStyle}>Not Detecting</span>}</li>
        <li style={li}>lastActive: {lastDate.getHours()}:{lastDate.getMinutes()}:{lastDate.getSeconds()}</li>
        <li style={li}>lastEvent: {type} ({x}, {y})</li>
      </ul>
      <div>
        <children {...props} />
      </div>
    </div>
  )
}

class IdleMonitor extends Component {
  static propTypes =  { showStatus: PropTypes.bool.isRequired
                      , showControls: PropTypes.bool.isRequired
                      , idleStatus: PropTypes.string.isRequired
                      , isIdle: PropTypes.bool.isRequired
                      , isPaused: PropTypes.bool.isRequired
                      , isDetectionRunning: PropTypes.bool.isRequired
                      , lastActive: PropTypes.number.isRequired
                      , lastEvent: PropTypes.object.isRequired
                      };
  static defaultProps = { showStatus: true
                        , showControls: true
                        , scheme: 'solarized'
                        };
  render() {
    const { showStatus, children } = this.props
    return showStatus ? <GenericIdleMonitor {...this.props} /> : <children {...this.props} />
  }
}

export const mapIdleStateToProps = (state, ownProps) => {
  const { idleStatus, isIdle, isPaused, isDetectionRunning, lastActive, lastEvent } = bisectState(state)

  return  { idleStatus
          , isIdle
          , isPaused
          , isDetectionRunning
          , lastActive
          , lastEvent
          }
}

const bisectState = state => {
  if(process.env.NODE_ENV !== 'production') {
    assert.ok(state, 'state is required')
    assert.ok(state[ROOT_STATE_KEY], `'${ROOT_STATE_KEY}' state must exist in redux (should import configured reducers from redux-idle-monitor into combineReducers as a top-level 'idle' node)`)
  }
  return state[ROOT_STATE_KEY]
}

export const connectIdleMonitor = ReactComponent => connect(mapIdleStateToProps)(ReactComponent)

export default connectIdleMonitor(IdleMonitor)
