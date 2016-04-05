'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _constants = require('./constants');

var _actions = require('./actions');

var configureMiddleware = function configureMiddleware(opts) {
  var log = opts.log;

  var getStateFromRoot = function getStateFromRoot(stateRaw) {
    return getStateAccessor(opts)(selectRootState(rootState));
  };
  var subscribedActions = [_constants.IDLE_ACTION];

  return function (store) {
    return function (next) {
      return function (action) {
        if (!subscribedActions.includes(action.type)) return next(action);

        var dispatch = store.dispatch;

        var getState = function getState() {
          return getStateFromRoot(store.getState());
        };
        var context = { opts: opts, getState: getState };
        var startIdleState = configureStartIdleState(context);
        var stopIdleState = configureStopIdleState(context);
        var resetIdleState = configureResetIdleState(context);
        var storeContext = { context: context, dispatch: dispatch, resetIdleState: resetIdleState };
        switch (action.type) {
          //case IDLE_STATE:
          //return _idleStateMiddleware(context)(next)(action)
          case _constants.IDLE_ACTION:
            var _action$payload = action.payload;
            var actionName = _action$payload.actionName;
            var lastEvent = _action$payload.lastEvent;

            log.warn(actionName);
            switch (actionName) {
              case _constants.START_ACTION:
                return startIdleState(dispatch);
              case _constants.STOP_ACTION:
                return stopIdleState(dispatch);
              case _constants.RESET_ACTION:
                return resetIdleState(dispatch, lastEvent);
              default:
                log.error('unknown action event => ' + actionName);
                throw new Error('Error in redux-idle-monitor middleware.');
            }
        }
        return next(action);
      };
    };
  };
};

exports.default = configureMiddleware;