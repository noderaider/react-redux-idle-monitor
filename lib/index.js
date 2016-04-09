'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.connectIdleMonitor = exports.mapIdleStateToProps = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _reactRedux = require('react-redux');

var _chai = require('chai');

var _constants = require('redux-idle-monitor/lib/constants');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var badgeStyle = { fontSize: '0.95em'
};

var panelStyle = { fontSize: '0.75em',
  maxWidth: 720,
  maxHeight: 70,
  paddingTop: 5,
  paddingLeft: 5,
  paddingBottom: 5,
  paddingRight: 5,
  marginLeft: 'auto',
  marginRight: 'auto',
  textAlign: 'center'
};
var ulStyle = { listStyle: 'none',
  maxWidth: 720,
  width: 720,
  textAlign: 'center',
  marginLeft: 'auto',
  marginRight: 'auto',
  border: '1px solid rgb(120, 120, 120)',
  borderBottom: 0,
  borderTopLeftRadius: 3,
  borderTopRightRadius: 3,
  padding: 5,
  bottom: 0,
  marginBottom: 0,
  position: 'fixed',
  zIndex: 99999999,
  opacity: 0.9
};
var ulActive = _extends({}, ulStyle, { backgroundColor: 'rgb(230, 240, 230)'
});
var ulIdle = _extends({}, ulStyle, { backgroundColor: 'rgb(240, 230, 230)'
});
var liStyle = { display: 'inline',
  marginLeft: 4,
  marginRight: 4
};

var activeStyle = _extends({}, badgeStyle, { color: 'rgb(20, 200, 50)'
});
var idleStyle = _extends({}, badgeStyle, { color: 'rgb(230, 100, 100)'
});
var trueStyle = _extends({}, badgeStyle, { color: 'rgb(50, 200, 200)'
});
var falseStyle = _extends({}, badgeStyle, { color: 'rgb(200, 50, 50)'
});

var titleStyle = { display: 'inline' };

var GenericIdleMonitor = function GenericIdleMonitor(props) {
  var idleStatus = props.idleStatus;
  var isIdle = props.isIdle;
  var isPaused = props.isPaused;
  var isDetectionRunning = props.isDetectionRunning;
  var lastActive = props.lastActive;
  var lastEvent = props.lastEvent;
  var children = props.children;
  var x = lastEvent.x;
  var y = lastEvent.y;

  return _react2.default.createElement(
    'div',
    { style: panelStyle },
    _react2.default.createElement(
      'ul',
      { style: isIdle ? ulIdle : ulActive },
      _react2.default.createElement(
        'li',
        { style: liStyle },
        _react2.default.createElement(
          'h6',
          { style: titleStyle },
          'idleMonitor'
        )
      ),
      _react2.default.createElement(
        'li',
        { style: liStyle },
        'idleStatus ',
        _react2.default.createElement(
          'span',
          { style: idleStatus === _constants.IDLESTATUS_ACTIVE ? activeStyle : idleStyle },
          '[',
          idleStatus,
          ']'
        )
      ),
      _react2.default.createElement(
        'li',
        { style: liStyle },
        'isIdle: ',
        isIdle === true ? _react2.default.createElement(
          'span',
          { style: trueStyle },
          '[true]'
        ) : _react2.default.createElement(
          'span',
          { style: falseStyle },
          '[false]'
        )
      ),
      _react2.default.createElement(
        'li',
        { style: liStyle },
        'isPaused: ',
        isPaused === true ? _react2.default.createElement(
          'span',
          { style: trueStyle },
          '[true]'
        ) : _react2.default.createElement(
          'span',
          { style: falseStyle },
          '[false]'
        )
      ),
      _react2.default.createElement(
        'li',
        { style: liStyle },
        'isDetectionRunning: ',
        isDetectionRunning === true ? _react2.default.createElement(
          'span',
          { style: trueStyle },
          '[true]'
        ) : _react2.default.createElement(
          'span',
          { style: falseStyle },
          '[false]'
        )
      ),
      _react2.default.createElement(
        'li',
        { style: liStyle },
        'lastActive: ',
        lastActive
      ),
      _react2.default.createElement(
        'li',
        { style: liStyle },
        'lastEvent: (',
        x,
        ', ',
        y,
        ')'
      )
    ),
    _react2.default.createElement(
      'div',
      null,
      _react2.default.createElement('children', props)
    )
  );
};

var IdleMonitor = function (_Component) {
  _inherits(IdleMonitor, _Component);

  function IdleMonitor() {
    _classCallCheck(this, IdleMonitor);

    return _possibleConstructorReturn(this, Object.getPrototypeOf(IdleMonitor).apply(this, arguments));
  }

  _createClass(IdleMonitor, [{
    key: 'render',
    value: function render() {
      var _props = this.props;
      var showStatus = _props.showStatus;
      var children = _props.children;

      return showStatus ? _react2.default.createElement(GenericIdleMonitor, this.props) : _react2.default.createElement('children', this.props);
    }
  }]);

  return IdleMonitor;
}(_react.Component);

IdleMonitor.propTypes = { showStatus: _react.PropTypes.bool.isRequired,
  idleStatus: _react.PropTypes.string.isRequired,
  isIdle: _react.PropTypes.bool.isRequired,
  isPaused: _react.PropTypes.bool.isRequired,
  isDetectionRunning: _react.PropTypes.bool.isRequired,
  lastActive: _react.PropTypes.number.isRequired,
  lastEvent: _react.PropTypes.object.isRequired
};
IdleMonitor.defaultProps = { showStatus: true };
var mapIdleStateToProps = exports.mapIdleStateToProps = function mapIdleStateToProps(state, ownProps) {
  var _bisectState = bisectState(state);

  var idleStatus = _bisectState.idleStatus;
  var isIdle = _bisectState.isIdle;
  var isPaused = _bisectState.isPaused;
  var isDetectionRunning = _bisectState.isDetectionRunning;
  var lastActive = _bisectState.lastActive;
  var lastEvent = _bisectState.lastEvent;


  return { idleStatus: idleStatus,
    isIdle: isIdle,
    isPaused: isPaused,
    isDetectionRunning: isDetectionRunning,
    lastActive: lastActive,
    lastEvent: lastEvent
  };
};

var bisectState = function bisectState(state) {
  if (process.env.NODE_ENV !== 'production') {
    _chai.assert.ok(state, 'state is required');
    _chai.assert.ok(state[_constants.ROOT_STATE_KEY], '\'' + _constants.ROOT_STATE_KEY + '\' state must exist in redux (should import configured reducers from redux-idle-monitor into combineReducers as a top-level \'idle\' node)');
  }
  return state[_constants.ROOT_STATE_KEY];
};

var connectIdleMonitor = exports.connectIdleMonitor = function connectIdleMonitor(ReactComponent) {
  return (0, _reactRedux.connect)(mapIdleStateToProps)(ReactComponent);
};

exports.default = connectIdleMonitor(IdleMonitor);