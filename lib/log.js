'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.createLogger = undefined;

var _constants = require('./constants');

var _formatMessage = function _formatMessage(_ref) {
  var level = _ref.level;
  var message = _ref.message;
  var obj = _ref.obj;

  if (!message && typeof obj === 'string') {
    message = obj;
    obj = noop();
  }
  return _formatLog(obj ? level + ': \'' + message + '\' => ' + JSON.stringify(obj) : level + ': \'' + message + '\'');
};

var _formatLog = function _formatLog(message) {
  return _constants.LIB_NAME + ' | ' + message;
};
var noop = function noop() {};

var createLogger = exports.createLogger = function createLogger() {
  var _ref2 = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];

  var _ref2$level = _ref2.level;
  var level = _ref2$level === undefined ? 'info' : _ref2$level;
  return process.env.NODE_ENV !== 'production' ? { trace: function trace(obj, message) {
      return level === 'trace' ? console.trace(_formatMessage({ level: 'trace', message: message, obj: obj })) : noop();
    },
    debug: function debug(obj, message) {
      return ['trace', 'debug'].includes(level) ? console.log(_formatMessage({ level: 'debug', message: message, obj: obj })) : noop();
    },
    info: function info(obj, message) {
      return ['trace', 'debug', 'info'].includes(level) ? console.info(_formatMessage({ level: 'info', message: message, obj: obj })) : noop();
    },
    warn: function warn(obj, message) {
      return ['trace', 'debug', 'info', 'warn'].includes(level) ? console.warn(_formatMessage({ level: 'warn', message: message, obj: obj })) : noop();
    },
    error: function error(obj, message) {
      return ['trace', 'debug', 'info', 'warn', 'error'].includes(level) ? console.error(_formatMessage({ level: 'error', message: message, obj: obj })) : noop();
    }
  } : { trace: noop, debug: noop, info: noop, warn: noop, error: noop };
};