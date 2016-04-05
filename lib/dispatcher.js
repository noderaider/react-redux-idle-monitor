'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

exports.default = createDispatcher;

var _chai = require('chai');

var _reduxActions = require('redux-actions');

var _constants = require('./constants');

var _actions = require('./actions');

var _actions2 = _interopRequireDefault(_actions);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _objectDestructuringEmpty(obj) { if (obj == null) throw new TypeError("Cannot destructure undefined"); }

function createDispatcher(context) {
  return function (dispatch, getState) {
    var stores = storesDispatcher(context)(dispatch, getState);
    var timeout = timeoutDispatcher(context, { stores: stores })(dispatch, getState);
    var detection = detectionDispatcher(context, { stores: stores })(dispatch, getState);
    var action = actionDispatcher(context, { timeout: timeout, stores: stores, detection: detection })(dispatch, getState);
    return { stores: stores, timeout: timeout, detection: detection, action: action };
  };
}

var storesDispatcher = function storesDispatcher(context) {
  return function (dispatch, getState) {
    var log = context.log;
    var getAction = context.getAction;
    var getTimeoutMS = context.getTimeoutMS;
    var useFastState = context.useFastState;
    var useLocalState = context.useLocalState;
    var initialLastEvent = context.initialLastEvent;


    var _shouldSetFastState = function _shouldSetFastState(newState) {
      if (!useFastState) return false;
      var lastActive = newState.lastActive;
      var lastEvent = newState.lastEvent;
      var timeoutID = newState.timeoutID;

      return typeof lastActive !== 'undefined' || lastEvent !== 'undefined' || typeof timeoutID !== 'undefined';
    };

    var _shouldSetLocalState = function _shouldSetLocalState(newState) {
      if (!useLocalState) return false;
      var lastActive = newState.lastActive;
      var lastEvent = newState.lastEvent;

      return typeof lastActive !== 'undefined' || lastEvent !== 'undefined';
    };

    var _shouldSetReduxState = function _shouldSetReduxState(newState) {
      var current = newState.current;
      var isIdle = newState.isIdle;
      var isPaused = newState.isPaused;

      return typeof current !== 'undefined' || typeof isIdle !== 'undefined' || typeof isPaused !== 'undefined';
    };

    var _filterState = function _filterState(newState, stateKeys) {
      return Object.keys(newState).reduce(function (state, key) {
        if (stateKeys.includes(key)) state[key] = newState[key];
        return state;
      }, {});
    };

    var fastStateKeys = ['lastActive', 'lastEvent', 'timeoutID', 'isDetectionRunning'];
    var createFastState = function createFastState() {
      var _ref = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];

      var _ref$lastEvent = _ref.lastEvent;
      var lastEvent = _ref$lastEvent === undefined ? initialLastEvent : _ref$lastEvent;
      var timeoutID = _ref.timeoutID;
      return { lastActive: +new Date(),
        lastEvent: lastEvent,
        timeoutID: timeoutID,
        isDetectionRunning: false
      };
    };
    var fastState = useFastState ? createFastState() : noop();
    var setFastState = function setFastState(newState) {
      fastState = Object.assign({}, fastState, _filterState(newState, fastStateKeys), { lastActive: +new Date() });
      if (process.env.NODE_ENV !== 'production') log.trace({ fastState: fastState }, 'fastState set');
    };

    var localStateKeys = ['lastActive'];
    var createLocalState = function createLocalState() {
      var _ref2 = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];

      _objectDestructuringEmpty(_ref2);

      return { lastActive: +new Date() };
    };
    if (useLocalState) localStorage[_constants.IDLEMONITOR_ACTIVITY] = createLocalState();
    var getLocalState = function getLocalState() {
      return localStateKeys.reduce(function (state, key) {
        state[key] = localStorage[_constants.IDLEMONITOR_ACTIVITY + '_' + key];
        return state;
      }, {});
    };
    var setLocalState = function setLocalState(newState) {
      localStorage[_constants.IDLEMONITOR_ACTIVITY + '_lastActive'] = +new Date();
      Object.keys(newState).filter(function (key) {
        return localStateKeys.includes(key);
      }).forEach(function (key) {
        return localStorage[_constants.IDLEMONITOR_ACTIVITY + '_' + key] = newState[key];
      });
      //localStorage[IDLEMONITOR_ACTIVITY] = Object.assign({}, localStorage[IDLEMONITOR_ACTIVITY], _filterState(newState, localStateKeys), { lastActive: +new Date() })
      if (process.env.NODE_ENV !== 'production') log.trace({ localState: getLocalState() }, 'localState set');
    };

    /** GETS THIS LIBS SLICE OF TOP LEVEL STATE FROM REDUX (supports immutable) */
    var getLibState = function getLibState() {
      var state = getState();
      return state.isMap && state.isMap() ? state.get(_constants.ROOT_STATE_KEY) : state[_constants.ROOT_STATE_KEY];
    };

    /** ABSTRACTS ACCESS TO STATE VIA GETTERS */
    var getLibStateAccessor = function getLibStateAccessor(libState) {
      /** The current state name */
      return { get current() {
          return libState.current;
        }
        /** Is in idle state (no more states to progress to) */
        , get isIdle() {
          return libState.isIdle;
        }
        /** State can be paused manually or via action dispatch or returning null/undefined from timeoutMS function */
        , get isPaused() {
          return libState.isPaused;
        }
        /** The epoch MS that the user was last active */
        , get lastActive() {
          return useFastState ? fastState.lastActive : libState.lastActive;
        }
        /** Event information captured on the last recorded user action */
        , get lastEvent() {
          return useFastState ? fastState.lastEvent : libState.lastEvent;
        }
        /** The timeoutID for the current scheduled next event if it exists */
        , get timeoutID() {
          return useFastState ? fastState.timeoutID : libState.timeoutID;
        }
      };
    };

    var getReduxState = function getReduxState() {
      var state = getLibStateAccessor(getLibState());

      return _extends({}, state, { get next() {
          var events = context.actionNames;
          var nextIndex = events.indexOf(state.current) + 1;
          return events[nextIndex]; /** MAY BE UNDEFINED */
        },
        get action() {
          return getAction(state.current);
        },
        get timeoutMS() {
          return getTimeoutMS(state.current);
        },
        get remainingMS() {
          if (state.isIdle) return 0;
          var remainingMS = getTimeoutMS(state.current) - (+new Date() - state.lastActive);
          return remainingMS > 0 ? remainingMS : 0;
        }
      });
    };

    return { get redux() {
        return getReduxState();
      }
      /** Without some way to track fast state (mousemove events), redux gets spammed with actions */
      , get fast() {
        return useFastState ? fastState : getReduxState();
      }
      /** Things that need to be synced across tabs (lastActive, lastEvent) */
      , get local() {
        return {};
      }
      /** All state update actions flow through this, has ability to bypass redux for fast state operations or dispatch to it */
      , setState: function setState(actionName, newState) {
        if (_shouldSetLocalState) setLocalState(newState);
        if (_shouldSetFastState(newState)) {
          setFastState(newState);
          if (!_shouldSetReduxState(newState)) return log.debug('bypassing redux state update');
        }
        log.debug({ newState: newState }, 'updating redux state');
        return dispatch((0, _reduxActions.createAction)(actionName)(newState));
      }
    };
  };
};

var timeoutDispatcher = function timeoutDispatcher(context, _ref3) {
  var stores = _ref3.stores;
  return function (dispatch, getState) {
    var getFastState = context.getFastState;
    var getTimeoutMS = context.getTimeoutMS;

    return { clear: function clear() {
        return clearTimeout(stores.fast.timeoutID);
      },
      timeoutMS: function timeoutMS(actionName) {
        var result = getTimeoutMS(actionName);
        return typeof result === 'function' ? result(dispatch, getState, _getChildContext(context)) : result;
      }
    };
  };
};

var detectionDispatcher = function detectionDispatcher(context, _ref4) {
  var stores = _ref4.stores;
  return function (dispatch, getState) {
    var log = context.log;
    var activeEvents = context.activeEvents;
    var initialActionName = context.initialActionName;
    var initialAction = context.initialAction;
    var thresholds = context.thresholds;
    var setState = stores.setState;

    /** Detects whether the activity should trigger a redux update */

    var _shouldActivityUpdate = function _shouldActivityUpdate(_ref5) {
      var type = _ref5.type;
      var pageX = _ref5.pageX;
      var pageY = _ref5.pageY;

      if (type !== 'mousemove') return true;

      var _stores$fast = stores.fast;
      var lastActive = _stores$fast.lastActive;
      var _stores$fast$lastEven = _stores$fast.lastEvent;
      var x = _stores$fast$lastEven.x;
      var y = _stores$fast$lastEven.y;

      if (typeof pageX === 'undefined' || typeof pageY === 'undefined') return false;
      if (Math.abs(pageX - x) < thresholds.mouse && Math.abs(pageY - y) < thresholds.mouse) return false;

      // SKIP UPDATE IF ITS UNDER THE THRESHOLD MS FROM THE LAST UPDATE
      var elapsedMS = +new Date() - lastActive;
      if (elapsedMS < thresholds.elapsedMS) return false;
      if (process.env.NODE_ENV !== 'production') log.trace('_shouldActivityUpdate: elapsed vs threshold => E[' + elapsedMS + '] >= T[' + thresholds.elapsedMS + '], lastActive => ' + lastActive);
      return true;
    };

    var _shouldRestart = function _shouldRestart() {
      return stores.redux.current !== initialActionName;
    };

    /** One of the event listeners triggered an activity occurrence event. This gets spammed */
    var onActivity = function onActivity(e) {
      if (!_shouldActivityUpdate(e)) return;
      if (_shouldRestart()) return dispatch((0, _actions.start)(context));
      /** THIS WILL BE ROUTED TO FAST OR LOCAL STATE IF ENABLED */
      setState(_constants.IDLEMONITOR_ACTIVITY, { lastActive: +new Date(), lastEvent: { x: e.pageX, y: e.pageY } });
    };

    return { get isRunning() {
        return stores.fast.isDetectionRunning;
      },
      start: function start() {
        if (process.env.NODE_ENV !== 'production') (0, _chai.assert)(stores.fast.isDetectionRunning === false, 'activity detection is already running');
        activeEvents.forEach(function (x) {
          return document.addEventListener(x, onActivity);
        });
        log.debug('activity detection started...');
        setState(_constants.IDLEMONITOR_ACTIVITY, { isDetectionRunning: true });
      },
      stop: function stop() {
        if (process.env.NODE_ENV !== 'production') (0, _chai.assert)(stores.fast.isDetectionRunning === true, 'activity detection is not running');
        activeEvents.forEach(function (x) {
          return document.removeEventListener(x, onActivity);
        });
        log.debug('activity detection stopped');
        setState(_constants.IDLEMONITOR_ACTIVITY, { isDetectionRunning: false });
      }
    };
  };
};

var actionDispatcher = function actionDispatcher(context, _ref6) {
  var timeout = _ref6.timeout;
  var stores = _ref6.stores;
  var detection = _ref6.detection;
  return function (dispatch, getState) {
    var log = context.log;
    var getTimeoutMS = context.getTimeoutMS;
    var getAction = context.getAction;
    var getNextActionName = context.getNextActionName;
    var useFastState = context.useFastState;
    var setFastState = context.setFastState;
    var setState = stores.setState;

    var _isPauseTriggered = function _isPauseTriggered(timeoutMS) {
      return timeoutMS === null || timeoutMS === false || typeof timeoutMS === 'undefined';
    };

    /** Responsible for clearing old timeout and scheduling new one or immediately executing, returns new timeoutID or undefined */
    var schedule = function schedule(actionName) {
      timeout.clear();
      var timeoutMS = timeout.timeoutMS(actionName);
      log.info({ actionName: actionName, timeoutMS: timeoutMS }, 'schedule');
      var args = { actionName: actionName, isPaused: _isPauseTriggered(timeoutMS) };
      if (timeoutMS > 0) return setTimeout(function () {
        return execute(args);
      }, timeoutMS);
      execute(args);
    };

    /** Responsible for executing an action */
    var execute = function execute(_ref7) {
      var actionName = _ref7.actionName;
      var isPaused = _ref7.isPaused;

      var nextActionName = getNextActionName(actionName);
      var wasPaused = stores.redux.isPaused;

      /** TODO: CHECK LOCAL STATE HERE AND IF ITS BEEN ACTIVE, POSTPONE THE ACTION ABOUT TO BE EXECUTED */

      /** SCHEDULE THE NEXT ACTION IF IT EXISTS */
      var timeoutID = nextActionName && !isPaused ? schedule(nextActionName) : null;

      if (isPaused && !wasPaused) {
        log.warn('pausing activity detection');
        detection.stop();
      }
      if (!isPaused && wasPaused) detection.start();

      /** UPDATE THE STATE OF THE APP */
      setState(actionName, { current: actionName,
        isIdle: typeof nextActionName === 'undefined',
        isPaused: isPaused,
        timeoutID: timeoutID
      });

      /** EXECUTE THE USER DEFINED ACTION WITH REDUX THUNK ARGS + CONTEXT (LOG, START/STOP/RESET DISPATCHABLE ACTIONS) */
      getAction(actionName)(dispatch, getState, _getChildContext(context));
    };
    return { schedule: schedule, execute: execute };
  };
};

var _getChildContext = function _getChildContext(context) {
  return _extends({}, context, { actions: (0, _actions2.default)(context) });
};