import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'
import { assert } from 'chai'
import { ROOT_STATE_KEY, IDLESTATUS_ACTIVE } from 'redux-idle-monitor/lib/constants'

const badgeStyle =  { fontSize: '0.95em'
                    }

const panelStyle =  { fontSize: '0.75em'
                    , maxWidth: 720
                    , maxHeight: 70
                    , paddingTop: 5
                    , paddingLeft: 5
                    , paddingBottom: 5
                    , paddingRight: 5
                    , marginLeft: 'auto'
                    , marginRight: 'auto'
                    , textAlign: 'center'
                    }
const ulStyle = { listStyle: 'none'
                , maxWidth: 720
                , width: 720
                , textAlign: 'center'
                , marginLeft: 'auto'
                , marginRight: 'auto'
                , border: '1px solid rgb(120, 120, 120)'
                , borderBottom: 0
                , borderTopLeftRadius: 3
                , borderTopRightRadius: 3
                , padding: 5
                , bottom: 0
                , marginBottom: 0
                , position: 'fixed'
                , zIndex: 99999999
                , opacity: 0.9
                }
const ulActive =  { ...ulStyle
                  , backgroundColor: 'rgb(230, 240, 230)'
                  }
const ulIdle=  { ...ulStyle
                  , backgroundColor: 'rgb(240, 230, 230)'
                  }
const liStyle = { display: 'inline'
                , marginLeft:4
                , marginRight:4
                }

const activeStyle = { ...badgeStyle
                    , color: 'rgb(20, 200, 50)'
                    }
const idleStyle = { ...badgeStyle
                  , color: 'rgb(230, 100, 100)'
                  }
const trueStyle = { ...badgeStyle
                  , color: 'rgb(50, 200, 200)'
                  }
const falseStyle =  { ...badgeStyle
                    , color: 'rgb(200, 50, 50)'
                    }

const titleStyle = { display: 'inline' }

const GenericIdleMonitor = props => {
  const { idleStatus, isIdle, isPaused, isDetectionRunning, lastActive, lastEvent, children } = props
  const { x, y } = lastEvent
  return (
    <div style={panelStyle}>
      <ul style={isIdle ? ulIdle : ulActive}>
        <li style={liStyle}><h6 style={titleStyle}>idleMonitor</h6></li>
        <li style={liStyle}>idleStatus <span style={idleStatus === IDLESTATUS_ACTIVE ? activeStyle : idleStyle}>[{idleStatus}]</span></li>
        <li style={liStyle}>isIdle: {isIdle === true ? <span style={trueStyle}>[true]</span> : <span style={falseStyle}>[false]</span>}</li>
        <li style={liStyle}>isPaused: {isPaused === true ? <span style={trueStyle}>[true]</span> : <span style={falseStyle}>[false]</span>}</li>
        <li style={liStyle}>isDetectionRunning: {isDetectionRunning === true ? <span style={trueStyle}>[true]</span> : <span style={falseStyle}>[false]</span>}</li>
        <li style={liStyle}>lastActive: {lastActive}</li>
        <li style={liStyle}>lastEvent: ({x}, {y})</li>
      </ul>
      <div>
        <children {...props} />
      </div>
    </div>
  )
}

class IdleMonitor extends Component {
  static propTypes =  { showStatus: PropTypes.bool.isRequired
                      , idleStatus: PropTypes.string.isRequired
                      , isIdle: PropTypes.bool.isRequired
                      , isPaused: PropTypes.bool.isRequired
                      , isDetectionRunning: PropTypes.bool.isRequired
                      , lastActive: PropTypes.number.isRequired
                      , lastEvent: PropTypes.object.isRequired
                      };
  static defaultProps = { showStatus: true };
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
