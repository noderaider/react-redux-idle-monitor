import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'
import { assert } from 'chai'
import { ROOT_STATE_KEY, IDLESTATUS_ACTIVE } from 'redux-idle-monitor/lib/constants'
import getStyle from './style'


const GenericIdleMonitor = props => {
  const { panel, inner, title, ul, li, activeStyle, infoStyle, idleStyle, stopStyle, eventStyle } = getStyle(props)
  const { showControls, idleStatus, isRunning, isDetectionRunning, isIdle, lastActive, lastEvent, children } = props
  const { type, x, y } = lastEvent
  const lastDate = new Date(lastActive)
  return (
    <div>
      <children {...props} />
      <div style={panel}>
        <div style={inner}>
          <ul style={ul}>
            <li style={title}>{props.title}</li>
            <li style={li}>{isRunning === true ? <span style={activeStyle}>ON</span> : <span style={stopStyle}>OFF</span>}</li>
            {isRunning === true ? <li style={li}><span style={idleStatus === IDLESTATUS_ACTIVE ? activeStyle : idleStyle}>{idleStatus}</span></li> : null}
            {isRunning === true ? <li style={li}>{isDetectionRunning ? <span style={infoStyle}>DETECTING</span> : <span style={idleStyle}>SLEEPING</span>}</li> : null}
            {isIdle === true ? <li style={li}><span style={idleStyle}>IDLE</span></li> : null}
            <li style={li}>{lastDate.toJSON().substr(11, 8)}{type ? ` [${type}]` : null}{x >= 0 && y >= 0 ? ` (${x}, ${y})` : null}</li>
          </ul>
        </div>
      </div>
    </div>
  )
}

const monitorStyleShape =  PropTypes.shape( { backgroundColor: PropTypes.string.isRequired
                                            , color: PropTypes.string.isRequired
                                            , activeColor: PropTypes.string.isRequired
                                            , idleColor: PropTypes.string.isRequired
                                            , stopColor: PropTypes.string.isRequired
                                            })

class IdleMonitor extends Component {
  static propTypes =  { showStatus: PropTypes.bool.isRequired
                      , showControls: PropTypes.bool.isRequired
                      , title: PropTypes.string.isRequired
                      , theme: PropTypes.string.isRequired
                      , invertTheme: PropTypes.bool.isRequired
                      , opacity: PropTypes.number.isRequired
                      , paletteMap: PropTypes.object.isRequired
                      , idleStatus: PropTypes.string.isRequired
                      , isRunning: PropTypes.bool.isRequired
                      , isIdle: PropTypes.bool.isRequired
                      , isDetectionRunning: PropTypes.bool.isRequired
                      , lastActive: PropTypes.number.isRequired
                      , lastEvent: PropTypes.object.isRequired
                      };
  static defaultProps = { showStatus: true
                        , showControls: true
                        , title: 'IDLEMONITOR'
                        , theme: 'solarized'
                        , invertTheme: false
                        , opacity: 1
                        , paletteMap: { background: ['base00', 'base01']
                                      , content: ['base04', 'base02', 'base05']
                                      , accent: ['base0D', 'base0E', 'base0C']
                                      }
                        };
  render() {
    const { showStatus, children } = this.props
    return showStatus ? <GenericIdleMonitor {...this.props} /> : <children {...this.props} />
  }
}

export const mapIdleStateToProps = (state, ownProps) => {
  const { idleStatus, isRunning, isDetectionRunning, isIdle, lastActive, lastEvent } = bisectState(state)

  return  { idleStatus
          , isRunning
          , isDetectionRunning
          , isIdle
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
