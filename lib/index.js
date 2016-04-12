'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.connectIdleMonitor = exports.mapIdleStateToProps = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _reactRedux = require('react-redux');

var _chai = require('chai');

var _constants = require('redux-idle-monitor/lib/constants');

var _style = require('./style');

var _style2 = _interopRequireDefault(_style);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var GenericIdleMonitor = function GenericIdleMonitor(props) {
  var _getStyle = (0, _style2.default)(props);

  var panel = _getStyle.panel;
  var title = _getStyle.title;
  var ulIdle = _getStyle.ulIdle;
  var ulActive = _getStyle.ulActive;
  var li = _getStyle.li;
  var activeStyle = _getStyle.activeStyle;
  var idleStyle = _getStyle.idleStyle;
  var trueStyle = _getStyle.trueStyle;
  var falseStyle = _getStyle.falseStyle;
  var idleStatus = props.idleStatus;
  var isIdle = props.isIdle;
  var isPaused = props.isPaused;
  var isDetectionRunning = props.isDetectionRunning;
  var lastActive = props.lastActive;
  var lastEvent = props.lastEvent;
  var children = props.children;
  var type = lastEvent.type;
  var x = lastEvent.x;
  var y = lastEvent.y;

  var lastDate = new Date(lastActive);
  return _react2.default.createElement(
    'div',
    { style: panel },
    _react2.default.createElement(
      'ul',
      { style: isIdle ? ulIdle : ulActive },
      _react2.default.createElement(
        'li',
        { style: li },
        _react2.default.createElement(
          'h6',
          { style: title },
          'idleMonitor'
        )
      ),
      _react2.default.createElement(
        'li',
        { style: li },
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
        { style: li },
        isIdle === true ? _react2.default.createElement(
          'span',
          { style: trueStyle },
          'Idle'
        ) : _react2.default.createElement(
          'span',
          { style: falseStyle },
          'Not Idle'
        )
      ),
      _react2.default.createElement(
        'li',
        { style: li },
        'isPaused: ',
        isPaused === true ? _react2.default.createElement(
          'span',
          { style: trueStyle },
          'Paused'
        ) : _react2.default.createElement(
          'span',
          { style: falseStyle },
          'Not Paused'
        )
      ),
      _react2.default.createElement(
        'li',
        { style: li },
        'isDetectionRunning: ',
        isDetectionRunning === true ? _react2.default.createElement(
          'span',
          { style: trueStyle },
          'Detecting'
        ) : _react2.default.createElement(
          'span',
          { style: falseStyle },
          'Not Detecting'
        )
      ),
      _react2.default.createElement(
        'li',
        { style: li },
        'lastActive: ',
        lastDate.getHours(),
        ':',
        lastDate.getMinutes(),
        ':',
        lastDate.getSeconds()
      ),
      _react2.default.createElement(
        'li',
        { style: li },
        'lastEvent: ',
        type,
        ' (',
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
  showControls: _react.PropTypes.bool.isRequired,
  idleStatus: _react.PropTypes.string.isRequired,
  isIdle: _react.PropTypes.bool.isRequired,
  isPaused: _react.PropTypes.bool.isRequired,
  isDetectionRunning: _react.PropTypes.bool.isRequired,
  lastActive: _react.PropTypes.number.isRequired,
  lastEvent: _react.PropTypes.object.isRequired
};
IdleMonitor.defaultProps = { showStatus: true,
  showControls: true,
  scheme: 'solarized'
};
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