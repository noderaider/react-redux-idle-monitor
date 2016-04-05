'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _constants = require('./constants');

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var configureReducer = function configureReducer(opts) {
  var log = opts.log;
  var initialState = opts.initialState;
  var actionNames = opts.actionNames;
  var useExternalState = opts.useExternalState;

  return function () {
    var _Object$assign2;

    var state = arguments.length <= 0 || arguments[0] === undefined ? initialState : arguments[0];
    var action = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];

    if (!actionNames.includes(action.type)) return state;

    var type = action.type;
    var payload = action.payload;

    if (type === _constants.IDLEMONITOR_ACTIVITY) {
      var _Object$assign;

      if (useExternalState) return state;
      return Object.assign({}, state, (_Object$assign = {}, _defineProperty(_Object$assign, _constants.LAST_ACTIVE_KEY, payload[_constants.LAST_ACTIVE_KEY]), _defineProperty(_Object$assign, _constants.LAST_EVENT_KEY, payload[_constants.LAST_EVENT_KEY]), _defineProperty(_Object$assign, _constants.TIMEOUT_ID_KEY, payload[_constants.TIMEOUT_ID_KEY]), _Object$assign));
    }

    return Object.assign({}, state, (_Object$assign2 = {}, _defineProperty(_Object$assign2, _constants.CURRENT_KEY, payload[_constants.CURRENT_KEY]), _defineProperty(_Object$assign2, _constants.IS_IDLE_KEY, payload[_constants.IS_IDLE_KEY]), _defineProperty(_Object$assign2, _constants.IS_PAUSED_KEY, payload[_constants.IS_PAUSED_KEY]), _Object$assign2));
  };
};

exports.default = configureReducer;