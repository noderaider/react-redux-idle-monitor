'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getLevel = exports.getThresholds = exports.getUseLocalState = exports.getUseFastState = exports.getActiveEvents = exports.getActions = undefined;

var _actions = require('./actions');

var getTimeStamp = function getTimeStamp() {
  return new Date().toTimeString();
};
var defaultActiveAction = function defaultActiveAction() {
  return (0, _actions.defineAction)('ACTIVE', function (dispatch, getState, _ref) {
    var log = _ref.log;
    return log.info('USER ACTIVE AT ' + getTimeStamp());
  }, 0);
};
var defaultInactiveAction = function defaultInactiveAction() {
  return (0, _actions.defineAction)('INACTIVE', function (dispatch, getState, _ref2) {
    var log = _ref2.log;
    return log.info('USER INACTIVE AT ' + getTimeStamp());
  }, 5000);
};
var defaultIdleAction = function defaultIdleAction() {
  return (0, _actions.defineAction)('IDLE', function (dispatch, getState, _ref3) {
    var log = _ref3.log;
    return log.info('USER IDLE AT ' + getTimeStamp());
  }, 5000);
};
var defaultExpiredAction = function defaultExpiredAction() {
  return (0, _actions.defineAction)('EXPIRED', function (dispatch, getState, _ref4) {
    var log = _ref4.log;

    log.info('USER EXPIRED AT ' + getTimeStamp());
  }, 15000);
};

var getActions = exports.getActions = function getActions() {
  return [defaultActiveAction(), defaultInactiveAction(), defaultIdleAction(), defaultExpiredAction()];
};

var getActiveEvents = exports.getActiveEvents = function getActiveEvents() {
  return ['mousemove', 'keydown', 'wheel', 'DOMMouseScroll', 'mouseWheel', 'mousedown', 'touchstart', 'touchmove', 'MSPointerDown', 'MSPointerMove'];
};

var getUseFastState = exports.getUseFastState = function getUseFastState() {
  return true;
};
var getUseLocalState = exports.getUseLocalState = function getUseLocalState() {
  return true;
};

var getThresholds = exports.getThresholds = function getThresholds() {
  var _ref5 = arguments.length <= 0 || arguments[0] === undefined ? { mouse: 10, elapsedMS: 1000 } : arguments[0];

  var _ref5$mouse = _ref5.mouse;
  var mouse = _ref5$mouse === undefined ? 10 : _ref5$mouse;
  var _ref5$elapsedMS = _ref5.elapsedMS;
  var elapsedMS = _ref5$elapsedMS === undefined ? 1000 : _ref5$elapsedMS;
  return { mouse: mouse, elapsedMS: elapsedMS };
};

var getLevel = exports.getLevel = function getLevel() {
  return 'trace';
};