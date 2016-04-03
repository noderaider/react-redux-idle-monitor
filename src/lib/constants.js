/** Lib Constants */
export const LIB_NAME = 'redux-idle-monitor'

/** Redux state root level key */
export const ROOT_STATE_KEY = 'idle'

/** State Constants */
export const CURRENT_KEY = 'current'
export const LAST_ACTIVE_KEY = 'lastActive'
export const LAST_EVENT_KEY = 'lastEvent'
export const IS_IDLE_KEY = 'isIdle'
export const IS_PAUSED_KEY = 'isPaused'
export const TIMEOUT_ID_KEY='timeoutID'


/** Redux Action Type Constants */
const ACTION_PREFIX = 'IDLEMONITOR'
export const IDLEMONITOR_ACTIVITY = `${ACTION_PREFIX}_ACTIVITY`
export const IDLEMONITOR_PAUSE = `${ACTION_PREFIX}_PAUSE`
export const createActionName = rawName => `${ACTION_PREFIX}_${rawName.toUpperCase().replace(/-+\s+/, '_')}`
