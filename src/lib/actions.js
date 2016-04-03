
import createDispatcher from './dispatcher'

/** Back to initial state */
export const start = context => (dispatch, getState) => {
  const { log, initialActionName } = context
  log.info('idle monitor started')
  const { detection, action } = createDispatcher(context)(dispatch, getState)
  //** MOVE DETECTION FURTHER IN, POSSIBLY MIDDLEWARE
  detection.start()
  return action.schedule(initialActionName)
}

export const stop = context => (dispatch, getState) => {
  const { log, activeEvents } = context
  log.info('idle monitor stopped')
  const { timeout, detection } = createDispatcher(context)(dispatch, getState)
  timeout.clear()
  detection.stop()
}

export const reset = context => (dispatch, getState) => {
  const { log } = context
  log.info('idle monitor resetting...')
  dispatch(stop(context))
  dispatch(start(context))
}

export const defineAction = (actionName, action, timeoutMS) => [ actionName, { action, timeoutMS } ]

export default function configureActions(context) {
  return { start: start(context), stop: stop(context), reset: reset(context) }
}

/*
const _updateState = context => actionName => args => {
  const { log, useExternalState, setFastState } = context
  const { current, isIdle, timeoutID, lastActive, lastEvent } = args
  if(useExternalState && (lastActive || lastEvent || timeoutID)) {
    log.warn(`UPDATING EXTERNAL STATE => ${JSON.stringify(args)}`)
    setExternalState(args)
    if(!(current || isIdle)) {
      log.warn('BYPASSING REDUX ACTION')
      return
    }
  }
  log.warn(`UPDATING REDUX STATE => ${JSON.stringify(args)}`)
  return createAction(actionName)(args)
}

const _updateActivity = context => _updateState(context)(IDLEMONITOR_ACTIVITY)
*/

/** Responsible for clearing old timeout and scheduling new one or immediately executing, returns new timeoutID or undefined */
/*
const _scheduleAction = (context, dispatcher) => actionName => (dispatch, getState) => {
  const { log, getTimeoutMS } = context
  const { timeout } = dispatcher
  timeout.clear()
  const timeoutMS = timeout.timeoutMS(actionName)
  const isPaused = timeoutMS ? false : true
  const execute = () => dispatch(_executeAction(context, dispatcher)({ actionName, isPaused }))
  if(timeoutMS > 0)
    return setTimeout(() => execute(), timeoutMS)
  else
    execute()
}
*/

/** Responsible for executing an action */
/*
const _executeAction = (context, dispatcher) => ({ actionName, isPaused }) => (dispatch, getState) => {
  const { log, getAction, getNextActionName } = context
  const { stateType, detection } = dispatcher
  const nextActionName = getNextActionName(actionName)
  const wasPaused = stateType.redux.isPaused

  let timeoutID = next && !isPaused ? dispatch(_scheduleAction(context)(nextActionName)) : null

  if(isPaused && !wasPaused)
    detection.stop()
  if(!isPaused && wasPaused)
    detection.start()

  const payload = { current: actionName, timeoutID, isIdle: typeof nextActionName === 'undefined', isPaused }
  dispatch(_updateState(context)(actionName)(payload))

  getAction(actionName)(dispatch, getState, { ...context, controls: configureActions(context) })
}
*/


/** One of the event listeners triggered an activity occurrence event */
/*
const _activityAction = context => e => (dispatch, getState) => {
  const { log, initialActionName, initialAction } = context
  const state = translateState(context, getState)
  if (_shouldActivityUpdate(context)(e, state)) {
    const action = (state.current === initialActionName
      ? _updateActivity(context)( { lastActive: +new Date()
                                  , lastEvent: { x: e.pageX, y: e.pageY }
                                  })
      : start(context))
    if(action)
      dispatch(action)
  }
}
*/

/** Detects whether the activity should trigger a redux update */
/*
const _shouldActivityUpdate = context => ({ type, pageX, pageY }, state) => {
  if(type !== 'mousemove')
    return true

  const { lastActive, lastEvent: { x, y } } = state
  if (typeof pageX === 'undefined' || typeof pageY === 'undefined')
    return false
  if(Math.abs(pageX - x) < thresholds.mouse && Math.abs(pageY - y) < thresholds.mouse)
    return false

  // SKIP UPDATE IF ITS UNDER THE THRESHOLD MS FROM THE LAST UPDATE
  let elapsedMS = (+new Date()) - lastActive
  if (elapsedMS < thresholds.elapsedMS)
    return false
  console.warn(`elapsedMS WAS ${elapsedMS}, lastActive=>${lastActive}`)
  return true
}

const thresholds =  { mouse: 15
                    , elapsedMS: 1000
                    }
                    */


