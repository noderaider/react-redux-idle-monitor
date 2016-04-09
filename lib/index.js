'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _reactRedux = require('react-redux');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var IdleMonitor = function (_Component) {
  _inherits(IdleMonitor, _Component);

  function IdleMonitor() {
    _classCallCheck(this, IdleMonitor);

    return _possibleConstructorReturn(this, Object.getPrototypeOf(IdleMonitor).apply(this, arguments));
  }

  return IdleMonitor;
}(_react.Component);

IdleMonitor.propTypes = { actionName: PropTypes.string.isRequired,
  actionOrdinal: PropTypes.string.isRequired,
  actionNames: PropTypes.arrayOf(PropTypes.string).isRequired,
  usingFastState: PropTypes.bool.isRequired,
  usingLocalState: PropTypes.bool.isRequired,
  usingWebRTCState: PropTypes.bool.isRequired,
  usingWebSocketsState: PropTypes.bool.isRequired
};


var mapIdleStateToProps = function mapIdleStateToProps(state, ownProps) {
  var idle = state.idle;


  if (process.env.NODE_ENV !== 'production') validateState(idle);

  return { actionName: idle.current,
    actionOrdinal: idle.actionNames.indexOf(idle.current),
    usingFastState: idle.useFastStore,
    usingLocalState: idle.useLocalStore,
    usingWebRTCState: false,
    usingWebSocketsState: false
  };
};

var validateState = function validateState(idle) {
  assert.ok(idle, 'idle state must exist in redux (should import configured reducers from redux-idle-monitor into combineReducers as a top-level \'idle\' node)');
  var current = idle.current;
  var actionNames = idle.actionNames;

  assert.ok(current, 'state requires current property.');
};

exports.default = (0, _reactRedux.connect)(mapStateToProps)(IdleMonitor);