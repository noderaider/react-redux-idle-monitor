import { assert } from 'chai'
import { createAction } from 'redux-actions'
import  { ROOT_STATE_KEY
        , IDLEMONITOR_ACTIVITY
        , TIMEOUT_ID_KEY
        } from './constants'
import configureActions, { start } from './actions'

export default function createDispatcher(context) {
  return (dispatch, getState) => {
    const stores = storesDispatcher(context)(dispatch, getState)
    const timeout = timeoutDispatcher(context, { stores })(dispatch, getState)
    const detection = detectionDispatcher(context, { stores })(dispatch, getState)
    const action = actionDispatcher(context, { timeout, stores, detection })(dispatch, getState)
    return { stores, timeout, detection, action }
  }
}

const storesDispatcher = context => (dispatch, getState) => {
  const { log, getAction, getTimeoutMS, useFastState, useLocalState, initialLastEvent } = context

  const _shouldSetFastState = newState => {
    if(!useFastState) return false
    const { lastActive, lastEvent, timeoutID } = newState
    return typeof lastActive !== 'undefined' || lastEvent !== 'undefined' || typeof timeoutID !== 'undefined'
  }

  const _shouldSetLocalState = newState => {
    if(!useLocalState) return false
    const { lastActive, lastEvent } = newState
    return typeof lastActive !== 'undefined' || lastEvent !== 'undefined'
  }

  const _shouldSetReduxState = newState => {
    const { current, isIdle, isPaused } = newState
    return typeof current !== 'undefined' || typeof isIdle !== 'undefined' || typeof isPaused !== 'undefined'
  }

  const _filterState = (newState, stateKeys) => {
    return Object.keys(newState).reduce((state, key) => {
      if(stateKeys.includes(key))
        state[key] = newState[key]
      return state
    }, {})
  }

  const fastStateKeys = ['lastActive', 'lastEvent', 'timeoutID', 'isDetectionRunning']
  const createFastState = ( { lastEvent = initialLastEvent
                            , timeoutID } = {}) => ({ lastActive: +new Date()
                                                    , lastEvent
                                                    , timeoutID
                                                    , isDetectionRunning: false
                                                    })
  let fastState = useFastState ? createFastState() : noop()
  const setFastState = newState => {
    fastState = Object.assign({}, fastState, _filterState(newState, fastStateKeys), { lastActive: +new Date() })
    if(process.env.NODE_ENV !== 'production')
      log.trace({ fastState }, 'fastState set')
  }

  const localStateKeys = ['lastActive']
  const createLocalState = ({} = {}) => ({ lastActive: +new Date() })
  if(useLocalState)
    localStorage[IDLEMONITOR_ACTIVITY] = createLocalState()
  const getLocalState = () => {
    return localStateKeys.reduce((state, key) => {
      state[key] = localStorage[`${IDLEMONITOR_ACTIVITY}_${key}`]
      return state
    }, {})
  }
  const setLocalState = (newState) => {
    localStorage[`${IDLEMONITOR_ACTIVITY}_lastActive`] = +new Date()
    Object.keys(newState).filter(key => localStateKeys.includes(key)).forEach((key) => localStorage[`${IDLEMONITOR_ACTIVITY}_${key}`] = newState[key])
    //localStorage[IDLEMONITOR_ACTIVITY] = Object.assign({}, localStorage[IDLEMONITOR_ACTIVITY], _filterState(newState, localStateKeys), { lastActive: +new Date() })
    if(process.env.NODE_ENV !== 'production')
      log.trace({ localState: getLocalState() }, 'localState set')
  }

  /** GETS THIS LIBS SLICE OF TOP LEVEL STATE FROM REDUX (supports immutable) */
  const getLibState = () => {
    const state = getState()
    return state.isMap && state.isMap() ? state.get(ROOT_STATE_KEY) : state[ROOT_STATE_KEY]
  }

  /** ABSTRACTS ACCESS TO STATE VIA GETTERS */
  const getLibStateAccessor = libState => {
              /** The current state name */
    return  { get current() { return libState.current }
              /** Is in idle state (no more states to progress to) */
            , get isIdle() { return libState.isIdle }
              /** State can be paused manually or via action dispatch or returning null/undefined from timeoutMS function */
            , get isPaused() { return libState.isPaused }
              /** The epoch MS that the user was last active */
            , get lastActive() { return useFastState ? fastState.lastActive : libState.lastActive }
              /** Event information captured on the last recorded user action */
            , get lastEvent() { return useFastState ? fastState.lastEvent : libState.lastEvent }
              /** The timeoutID for the current scheduled next event if it exists */
            , get timeoutID() { return useFastState ? fastState.timeoutID : libState.timeoutID }
            }
  }

  const getReduxState = () => {
    const state = getLibStateAccessor(getLibState())

    return  { ...state
            , get next() {
                const events = context.actionNames
                const nextIndex = events.indexOf(state.current) + 1
                return events[nextIndex] /** MAY BE UNDEFINED */
              }
            , get action() { return getAction(state.current) }
            , get timeoutMS() { return getTimeoutMS(state.current) }
            , get remainingMS() {
                if(state.isIdle)
                  return 0
                const remainingMS = getTimeoutMS(state.current) - (+new Date() - state.lastActive)
                return remainingMS > 0 ? remainingMS : 0
              }
            }
  }


  return  { get redux() { return getReduxState() }
            /** Without some way to track fast state (mousemove events), redux gets spammed with actions */
          , get fast() { return useFastState ? fastState : getReduxState() }
            /** Things that need to be synced across tabs (lastActive, lastEvent) */
          , get local() { return {} }
            /** All state update actions flow through this, has ability to bypass redux for fast state operations or dispatch to it */
          , setState: (actionName, newState) => {
              if(_shouldSetLocalState)
                setLocalState(newState)
              if(_shouldSetFastState(newState)) {
                setFastState(newState)
                if(!_shouldSetReduxState(newState))
                  return log.debug('bypassing redux state update')
              }
              log.debug({ newState }, 'updating redux state')
              return dispatch(createAction(actionName)(newState))
            }
          }
}

const timeoutDispatcher = (context, { stores }) => (dispatch, getState) => {
  const { getFastState, getTimeoutMS } = context
  return  { clear: () => clearTimeout(stores.fast.timeoutID)
          , timeoutMS: actionName => {
              let result = getTimeoutMS(actionName)
              return typeof result === 'function' ? result(dispatch, getState, _getChildContext(context)) : result
            }
          }
}

const detectionDispatcher = (context, { stores }) => (dispatch, getState) => {
  const { log, activeEvents, initialActionName, initialAction, thresholds } = context
  const { setState } = stores


  /** Detects whether the activity should trigger a redux update */
  const _shouldActivityUpdate = ({ type, pageX, pageY }) => {
    if(type !== 'mousemove') return true

    const { lastActive, lastEvent: { x, y } } = stores.fast
    if (typeof pageX === 'undefined' || typeof pageY === 'undefined')
      return false
    if(Math.abs(pageX - x) < thresholds.mouse && Math.abs(pageY - y) < thresholds.mouse)
      return false

    // SKIP UPDATE IF ITS UNDER THE THRESHOLD MS FROM THE LAST UPDATE
    let elapsedMS = (+new Date()) - lastActive
    if (elapsedMS < thresholds.elapsedMS)
      return false
    if(process.env.NODE_ENV !== 'production')
      log.trace(`_shouldActivityUpdate: elapsed vs threshold => E[${elapsedMS}] >= T[${thresholds.elapsedMS}], lastActive => ${lastActive}`)
    return true
  }

  const _shouldRestart = () => stores.redux.current !== initialActionName

  /** One of the event listeners triggered an activity occurrence event. This gets spammed */
  const onActivity = e => {
    if (!_shouldActivityUpdate(e))
      return
    if(_shouldRestart())
      return dispatch(start(context))
    /** THIS WILL BE ROUTED TO FAST OR LOCAL STATE IF ENABLED */
    setState(IDLEMONITOR_ACTIVITY, { lastActive: +new Date(), lastEvent: { x: e.pageX, y: e.pageY } })
  }

  return  { get isRunning() { return stores.fast.isDetectionRunning }
          , start: () => {
              if(process.env.NODE_ENV !== 'production')
                assert(stores.fast.isDetectionRunning === false, 'activity detection is already running')
              activeEvents.forEach(x => document.addEventListener(x, onActivity))
              log.debug('activity detection started...')
              setState(IDLEMONITOR_ACTIVITY, { isDetectionRunning: true })
            }
          , stop: () => {
              if(process.env.NODE_ENV !== 'production')
                assert(stores.fast.isDetectionRunning === true, 'activity detection is not running')
              activeEvents.forEach(x => document.removeEventListener(x, onActivity))
              log.debug('activity detection stopped')
              setState(IDLEMONITOR_ACTIVITY, { isDetectionRunning: false })
            }
          }

}


const actionDispatcher = (context, { timeout, stores, detection }) => (dispatch, getState) => {
  const { log, getTimeoutMS, getAction, getNextActionName, useFastState, setFastState } = context
  const { setState } = stores
  const _isPauseTriggered = timeoutMS => timeoutMS === null || timeoutMS === false || typeof timeoutMS === 'undefined'

  /** Responsible for clearing old timeout and scheduling new one or immediately executing, returns new timeoutID or undefined */
  const schedule = actionName => {
    timeout.clear()
    const timeoutMS = timeout.timeoutMS(actionName)
    log.info({ actionName, timeoutMS }, 'schedule')
    const args = { actionName, isPaused: _isPauseTriggered(timeoutMS) }
    if(timeoutMS > 0)
      return setTimeout(() => execute(args), timeoutMS)
    execute(args)
  }

  /** Responsible for executing an action */
  const execute = ({ actionName, isPaused }) => {
    const nextActionName = getNextActionName(actionName)
    const wasPaused = stores.redux.isPaused

    /** TODO: CHECK LOCAL STATE HERE AND IF ITS BEEN ACTIVE, POSTPONE THE ACTION ABOUT TO BE EXECUTED */

    /** SCHEDULE THE NEXT ACTION IF IT EXISTS */
    let timeoutID = nextActionName && !isPaused ? schedule(nextActionName) : null

    if(isPaused && !wasPaused) {
      log.warn('pausing activity detection')
      detection.stop()
    }
    if(!isPaused && wasPaused)
      detection.start()

    /** UPDATE THE STATE OF THE APP */
    setState(actionName,  { current: actionName
                          , isIdle: typeof nextActionName === 'undefined'
                          , isPaused
                          , timeoutID
                          })

    /** EXECUTE THE USER DEFINED ACTION WITH REDUX THUNK ARGS + CONTEXT (LOG, START/STOP/RESET DISPATCHABLE ACTIONS) */
    getAction(actionName)(dispatch, getState, _getChildContext(context))
  }
  return { schedule, execute }
}

const _getChildContext = context => ({ ...context, actions: configureActions(context) })
