import React, { Component, PropTypes, Children, cloneElement } from 'react'
import { connect } from 'react-redux'
import { createStateSelector } from 'redux-mux'
import { assert } from 'chai'
import { ROOT_STATE_KEY, IDLESTATUS_ACTIVE } from 'redux-idle-monitor/lib/constants'
import getStyle from './style'

const IS_DEV = process.env.NODE_ENV !== 'production'

const IdleMonitorView = props => {
  const { showControls, idleTitle, idleStatus, isRunning, isDetectionRunning, isIdle, lastActive, lastEvent, children, mounted } = props
  const { panel, inner, title, ul, li, activeStyle, infoStyle, idleStyle, stopStyle, eventStyle } = getStyle(props)
  const { type, x, y } = lastEvent
  const lastDate = new Date(lastActive)

  return (
    <div>
      <div style={panel}>
        <div style={inner}>
          <ul style={ul}>
            <li style={title}>{idleTitle}</li>
            <li style={li}>{isRunning === true ? <span style={activeStyle}>ON</span> : <span style={stopStyle}>OFF</span>}</li>
            {isRunning === true ? <li style={li}><span style={idleStatus === IDLESTATUS_ACTIVE ? activeStyle : idleStyle}>{idleStatus}</span></li> : null}
            {isRunning === true ? <li style={li}>{isDetectionRunning ? <span style={infoStyle}>DETECTING</span> : <span style={idleStyle}>SLEEPING</span>}</li> : null}
            {isIdle === true ? <li style={li}><span style={idleStyle}>IDLE</span></li> : null}
            {mounted === true ? <li style={li}>{lastDate.toJSON().substr(11, 8)}{type ? ` [${type}]` : null}{x >= 0 && y >= 0 ? ` (${x}, ${y})` : null}</li> : null}
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
                      , idleTitle: PropTypes.string.isRequired
                      , idleTheme: PropTypes.string.isRequired
                      , invertTheme: PropTypes.bool.isRequired
                      , dockTo: PropTypes.oneOf(['top', 'bottom'])
                      , opacity: PropTypes.number.isRequired
                      , paletteMap: PropTypes.object.isRequired
                      , idleStatus: PropTypes.string.isRequired
                      , isRunning: PropTypes.bool.isRequired
                      , isIdle: PropTypes.bool.isRequired
                      , isDetectionRunning: PropTypes.bool.isRequired
                      , lastActive: PropTypes.number.isRequired
                      , lastEvent: PropTypes.object.isRequired
                      };
  static defaultProps = { showStatus: IS_DEV
                        , showControls: false
                        , idleTitle: 'IDLEMONITOR'
                        , idleTheme: 'solarized'
                        , invertTheme: false
                        , opacity: 1
                        , dockTo: 'bottom'
                        , paletteMap: { background: ['base00', 'base01']
                                      , content: ['base04', 'base02', 'base05']
                                      , accent: ['base0D', 'base0E', 'base0C']
                                      }
                        };
  constructor(props) {
    super(props)
    this.state = { mounted: false }
  }
  componentDidMount() { this.setState({ mounted: true }) }
  render() {
    const { children, showStatus, showControls, idleTitle, idleTheme, invertTheme, dockTo, opacity, paletteMap, ...idleProps } = this.props
    return (
      <div className="idle-monitor">
        {children ? Children.map(children, x => cloneElement(x, { ...idleProps })) : null}
        {showStatus ? <IdleMonitorView {...this.props} mounted={this.state.mounted} /> : null}
      </div>
    )
  }
}

const selectState = createStateSelector(ROOT_STATE_KEY)

export const mapIdleStateToProps = (state, ownProps) => {
  const { idleStatus, isRunning, isDetectionRunning, isIdle, lastActive, lastEvent } = selectState(state)
  return  { idleStatus
          , isRunning
          , isDetectionRunning
          , isIdle
          , lastActive
          , lastEvent
          }
}

export const connectIdleMonitor = ReactComponent => connect(mapIdleStateToProps)(ReactComponent)
export default connectIdleMonitor(IdleMonitor)
