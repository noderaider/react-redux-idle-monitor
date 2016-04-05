'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.defineAction = undefined;

var _validate = require('./validate');

var _defaults = require('./defaults');

var _context = require('./context');

var _context2 = _interopRequireDefault(_context);

var _reducer = require('./reducer');

var _reducer2 = _interopRequireDefault(_reducer);

var _actions = require('./actions');

var _actions2 = _interopRequireDefault(_actions);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var configure = function configure() {
  var _ref = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];

  var _ref$actions = _ref.actions;
  var actions = _ref$actions === undefined ? (0, _defaults.getActions)() : _ref$actions;
  var _ref$activeEvents = _ref.activeEvents;
  var activeEvents = _ref$activeEvents === undefined ? (0, _defaults.getActiveEvents)() : _ref$activeEvents;
  var _ref$useFastState = _ref.useFastState;
  var useFastState = _ref$useFastState === undefined ? (0, _defaults.getUseFastState)() : _ref$useFastState;
  var _ref$useLocalState = _ref.useLocalState;
  var useLocalState = _ref$useLocalState === undefined ? (0, _defaults.getUseLocalState)() : _ref$useLocalState;
  var _ref$thresholds = _ref.thresholds;
  var thresholds = _ref$thresholds === undefined ? (0, _defaults.getThresholds)() : _ref$thresholds;
  var _ref$level = _ref.level;
  var level = _ref$level === undefined ? (0, _defaults.getLevel)() : _ref$level;

  var opts = { actions: actions, activeEvents: activeEvents, useFastState: useFastState, useLocalState: useLocalState, thresholds: thresholds, level: level };
  if (process.env.NODE_ENV !== 'production') (0, _validate.validateOpts)(opts);
  var context = (0, _context2.default)(opts);
  return { reducer: (0, _reducer2.default)(context),
    actions: (0, _actions2.default)(context)
  };
};
exports.default = configure;
exports.defineAction = _actions.defineAction;