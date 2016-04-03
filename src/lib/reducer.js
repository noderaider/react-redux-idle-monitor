import  { CURRENT_KEY
        , LAST_ACTIVE_KEY
        , LAST_EVENT_KEY
        , IS_IDLE_KEY
        , IS_PAUSED_KEY
        , TIMEOUT_ID_KEY
        , IDLEMONITOR_ACTIVITY
        } from './constants'

const configureReducer = opts => {
  const { log, initialState, actionNames, useExternalState } = opts
  return (state = initialState, action = {}) => {
    if(!actionNames.includes(action.type))
      return state

    const { type, payload } = action
    if(type === IDLEMONITOR_ACTIVITY) {
      if(useExternalState)
        return state
      return Object.assign({}, state, { [LAST_ACTIVE_KEY]: payload[LAST_ACTIVE_KEY]
                                      , [LAST_EVENT_KEY]: payload[LAST_EVENT_KEY]
                                      , [TIMEOUT_ID_KEY]: payload[TIMEOUT_ID_KEY]
                                      })
    }

    return Object.assign({}, state, { [CURRENT_KEY]: payload[CURRENT_KEY]
                                    , [IS_IDLE_KEY]: payload[IS_IDLE_KEY]
                                    , [IS_PAUSED_KEY]: payload[IS_PAUSED_KEY]
                                    })
  }
}

export default configureReducer
