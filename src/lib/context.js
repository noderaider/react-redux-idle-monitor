import { assert } from 'chai'
import  { ROOT_STATE_KEY
        , CURRENT_KEY
        , LAST_ACTIVE_KEY
        , LAST_EVENT_KEY
        , IS_IDLE_KEY
        , IS_PAUSED_KEY
        , TIMEOUT_ID_KEY
        , createActionName
        } from './constants'

import { configureActivityEvent, configureStart, configureStop, configureReset } from './actions'
import  { createLogger } from './log'

const noop = () => {}
const sanitizeActions = actions => actions.map(x => [createActionName(x[0]), x[1]])

export default function createContext(opts) {
  const actions = sanitizeActions(opts.actions)
  const { activeEvents, useFastState, useLocalState, thresholds, level } = opts
  const log = createLogger({ level })

  const actionMap = new Map(actions)

  const initialActionName = actions[0][0]
  const initialAction = actions[0][1].action
  const initialTimeoutMS = actions[0][1].timeoutMS
  const initialLastEvent = { x: 0, y: 0 }

  const createInitialState = ({ lastEvent, timeoutID, isIdle = false, isPaused = false } = { isIdle: false, isPaused: false }) => {
    return  { [CURRENT_KEY]: initialActionName
            , [IS_IDLE_KEY]: isIdle
            , [IS_PAUSED_KEY]: isPaused
            , [LAST_ACTIVE_KEY]: +new Date()
            , [LAST_EVENT_KEY]: lastEvent
            , [TIMEOUT_ID_KEY]: timeoutID
            }
  }

  const getNextActionName = current => {
    let hitCurrent = false
    for(let stateName of actions.map(x => x[0])) {
      if(hitCurrent)
        return stateName
      if(stateName === current)
        hitCurrent = true
    }
  }
  return  { log
          , get initialState() { return createInitialState() }
          , getNextActionName
          , initialActionName
          , initialAction
          , initialTimeoutMS
          , initialLastEvent
          , activeEvents
          , get actionNames() { return actions.map(x => x[0]) }
          , getAction: actionName => actionMap.get(actionName).action
          , getTimeoutMS: actionName => actionMap.get(actionName).timeoutMS
          , get useFastState() { return useFastState }
          , get useLocalState() { return useLocalState }
          , get thresholds() { return thresholds }
          }
}




