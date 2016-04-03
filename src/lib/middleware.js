import  { ROOT_STATE_KEY
        , IDLE_STATE
        , IDLE_EVENT
        , IDLE_ACTION
        , START_ACTION
        , STOP_ACTION
        , RESET_ACTION
        } from './constants'

import  { idleEvent
        } from './actions'



const configureMiddleware = opts =>  {
  const { log } = opts
  const getStateFromRoot = stateRaw => getStateAccessor(opts)(selectRootState(rootState))
  const subscribedActions = [IDLE_ACTION]

  return store => next => action => {
    if(!subscribedActions.includes(action.type))
      return next(action)

    const { dispatch } = store
    const getState = () => getStateFromRoot(store.getState())
    const context = { opts, getState }
    const startIdleState = configureStartIdleState(context)
    const stopIdleState = configureStopIdleState(context)
    const resetIdleState = configureResetIdleState(context)
    const storeContext = { context, dispatch, resetIdleState }
    switch(action.type) {
      //case IDLE_STATE:
        //return _idleStateMiddleware(context)(next)(action)
      case IDLE_ACTION:
        const { actionName, lastEvent } = action.payload
        log.warn(actionName)
        switch(actionName) {
          case START_ACTION:
            return startIdleState(dispatch)
          case STOP_ACTION:
            return stopIdleState(dispatch)
          case RESET_ACTION:
            return resetIdleState(dispatch, lastEvent)
          default:
            log.error(`unknown action event => ${actionName}`)
            throw new Error('Error in redux-idle-monitor middleware.')
        }
    }
    return next(action)
  }
}


export default configureMiddleware
