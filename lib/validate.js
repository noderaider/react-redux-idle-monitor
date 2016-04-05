'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.validateOpts = undefined;

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol ? "symbol" : typeof obj; };

var _chai = require('chai');

var validateOpts = exports.validateOpts = function validateOpts(opts) {
  var actions = opts.actions;
  var activeEvents = opts.activeEvents;
  var useFastState = opts.useFastState;
  var useLocalState = opts.useLocalState;
  var thresholds = opts.thresholds;

  _chai.assert.ok(actions, 'actions must exist');
  (0, _chai.assert)(Array.isArray(actions), 'actions must be an array');
  (0, _chai.assert)(actions.every(function (x) {
    return Array.isArray(x);
  }), 'actions must be an array of an array');
  (0, _chai.assert)(actions.every(function (x) {
    return x.length === 2;
  }), 'every actions must have length 2');
  (0, _chai.assert)(actions.every(function (x) {
    return typeof x[0] === 'string';
  }), 'every action must have first ordinal type string event name');
  (0, _chai.assert)(actions.every(function (x) {
    return _typeof(x[1]) === 'object';
  }), 'every action must have second ordinal type object');
  (0, _chai.assert)(actions.every(function (x) {
    return typeof x[1].action !== 'undefined';
  }), 'every action must have second ordinal action function defined');
  (0, _chai.assert)(actions.every(function (x) {
    var type = _typeof(x[1].timeoutMS);
    return type === 'number' || type === 'function';
  }), 'every action must have second ordinal timeoutMS number or function defined');
  _chai.assert.ok(activeEvents, 'active events must exist');
};