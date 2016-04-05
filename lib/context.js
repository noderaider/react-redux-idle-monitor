'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = createContext;

var _chai = require('chai');

var _constants = require('./constants');

var _actions = require('./actions');

var _log = require('./log');

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var noop = function noop() {};
var sanitizeActions = function sanitizeActions(actions) {
  return actions.map(function (x) {
    return [(0, _constants.createActionName)(x[0]), x[1]];
  });
};

function createContext(opts) {
  var actions = sanitizeActions(opts.actions);
  var activeEvents = opts.activeEvents;
  var useFastState = opts.useFastState;
  var useLocalState = opts.useLocalState;
  var thresholds = opts.thresholds;
  var level = opts.level;

  var log = (0, _log.createLogger)({ level: level });

  var actionMap = new Map(actions);

  var initialActionName = actions[0][0];
  var initialAction = actions[0][1].action;
  var initialTimeoutMS = actions[0][1].timeoutMS;
  var initialLastEvent = { x: 0, y: 0 };

  var createInitialState = function createInitialState() {
    var _ref2;

    var _ref = arguments.length <= 0 || arguments[0] === undefined ? { isIdle: false, isPaused: false } : arguments[0];

    var lastEvent = _ref.lastEvent;
    var timeoutID = _ref.timeoutID;
    var _ref$isIdle = _ref.isIdle;
    var isIdle = _ref$isIdle === undefined ? false : _ref$isIdle;
    var _ref$isPaused = _ref.isPaused;
    var isPaused = _ref$isPaused === undefined ? false : _ref$isPaused;

    return _ref2 = {}, _defineProperty(_ref2, _constants.CURRENT_KEY, initialActionName), _defineProperty(_ref2, _constants.IS_IDLE_KEY, isIdle), _defineProperty(_ref2, _constants.IS_PAUSED_KEY, isPaused), _defineProperty(_ref2, _constants.LAST_ACTIVE_KEY, +new Date()), _defineProperty(_ref2, _constants.LAST_EVENT_KEY, lastEvent), _defineProperty(_ref2, _constants.TIMEOUT_ID_KEY, timeoutID), _ref2;
  };

  var getNextActionName = function getNextActionName(current) {
    var hitCurrent = false;
    var _iteratorNormalCompletion = true;
    var _didIteratorError = false;
    var _iteratorError = undefined;

    try {
      for (var _iterator = actions.map(function (x) {
        return x[0];
      })[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
        var stateName = _step.value;

        if (hitCurrent) return stateName;
        if (stateName === current) hitCurrent = true;
      }
    } catch (err) {
      _didIteratorError = true;
      _iteratorError = err;
    } finally {
      try {
        if (!_iteratorNormalCompletion && _iterator.return) {
          _iterator.return();
        }
      } finally {
        if (_didIteratorError) {
          throw _iteratorError;
        }
      }
    }
  };
  return { log: log,
    get initialState() {
      return createInitialState();
    },
    getNextActionName: getNextActionName,
    initialActionName: initialActionName,
    initialAction: initialAction,
    initialTimeoutMS: initialTimeoutMS,
    initialLastEvent: initialLastEvent,
    activeEvents: activeEvents,
    get actionNames() {
      return actions.map(function (x) {
        return x[0];
      });
    },
    getAction: function getAction(actionName) {
      return actionMap.get(actionName).action;
    },
    getTimeoutMS: function getTimeoutMS(actionName) {
      return actionMap.get(actionName).timeoutMS;
    },
    get useFastState() {
      return useFastState;
    },
    get useLocalState() {
      return useLocalState;
    },
    get thresholds() {
      return thresholds;
    }
  };
}