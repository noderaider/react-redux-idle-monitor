import React, { Component, propTypes } from 'react'
import { connect } from 'react-redux'


class IdleMonitor extends Component {
  static propTypes =  { actionName: PropTypes.string.isRequired
                      , actionOrdinal: PropTypes.string.isRequired
                      , actionNames: PropTypes.arrayOf(PropTypes.string).isRequired
                      , usingFastState: PropTypes.bool.isRequired
                      , usingLocalState: PropTypes.bool.isRequired
                      , usingWebRTCState: PropTypes.bool.isRequired
                      , usingWebSocketsState: PropTypes.bool.isRequired
                      }

}



const mapIdleStateToProps = (state, ownProps) => {
  const { idle } = state

  if(process.env.NODE_ENV !== 'production')
    validateState(idle)

  return  { actionName: idle.current
          , actionOrdinal: idle.actionNames.indexOf(idle.current)
          , usingFastState: idle.useFastStore
          , usingLocalState: idle.useLocalStore
          , usingWebRTCState: false
          , usingWebSocketsState: false
          }
}

const validateState = idle => {
  assert.ok(idle, `idle state must exist in redux (should import configured reducers from redux-idle-monitor into combineReducers as a top-level 'idle' node)`)
  const { current, actionNames } = idle
  assert.ok(current, 'state requires current property.')
}

export default connect(mapStateToProps)(IdleMonitor)
