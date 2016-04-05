'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
/** Lib Constants */
var LIB_NAME = exports.LIB_NAME = 'redux-idle-monitor';

/** Redux state root level key */
var ROOT_STATE_KEY = exports.ROOT_STATE_KEY = 'idle';

/** State Constants */
var CURRENT_KEY = exports.CURRENT_KEY = 'current';
var LAST_ACTIVE_KEY = exports.LAST_ACTIVE_KEY = 'lastActive';
var LAST_EVENT_KEY = exports.LAST_EVENT_KEY = 'lastEvent';
var IS_IDLE_KEY = exports.IS_IDLE_KEY = 'isIdle';
var IS_PAUSED_KEY = exports.IS_PAUSED_KEY = 'isPaused';
var TIMEOUT_ID_KEY = exports.TIMEOUT_ID_KEY = 'timeoutID';

/** Redux Action Type Constants */
var ACTION_PREFIX = 'IDLEMONITOR';
var IDLEMONITOR_ACTIVITY = exports.IDLEMONITOR_ACTIVITY = ACTION_PREFIX + '_ACTIVITY';
var IDLEMONITOR_PAUSE = exports.IDLEMONITOR_PAUSE = ACTION_PREFIX + '_PAUSE';
var createActionName = exports.createActionName = function createActionName(rawName) {
  return ACTION_PREFIX + '_' + rawName.toUpperCase().replace(/-+\s+/, '_');
};