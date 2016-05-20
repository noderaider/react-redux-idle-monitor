'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.createConnector = exports.mapIdleStateToProps = undefined;

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol ? "symbol" : typeof obj; };

var _reduxMux = require('redux-mux');

var _chai = require('chai');

var _constants = require('redux-idle-monitor/lib/constants');

var _style = require('./style');

var _style2 = _interopRequireDefault(_style);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _objectWithoutProperties(obj, keys) { var target = {}; for (var i in obj) { if (keys.indexOf(i) >= 0) continue; if (!Object.prototype.hasOwnProperty.call(obj, i)) continue; target[i] = obj[i]; } return target; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var IS_DEV = process.env.NODE_ENV !== 'production';
var IS_BROWSER = (typeof window === 'undefined' ? 'undefined' : _typeof(window)) === 'object';

var selectState = (0, _reduxMux.createStateSelector)(_constants.ROOT_STATE_KEY);

var mapIdleStateToProps = exports.mapIdleStateToProps = function mapIdleStateToProps(state, ownProps) {
  var _selectState = selectState(state);

  var idleStatus = _selectState.idleStatus;
  var isRunning = _selectState.isRunning;
  var isDetectionRunning = _selectState.isDetectionRunning;
  var isIdle = _selectState.isIdle;
  var lastActive = _selectState.lastActive;
  var lastEvent = _selectState.lastEvent;

  return { idleStatus: idleStatus,
    isRunning: isRunning,
    isDetectionRunning: isDetectionRunning,
    isIdle: isIdle,
    lastActive: lastActive,
    lastEvent: lastEvent
  };
};

var createConnector = exports.createConnector = function createConnector(_ref) {
  var connect = _ref.connect;
  return function (ReactComponent) {
    return connect(mapIdleStateToProps)(ReactComponent);
  };
};

/** Exports a factory that creates the IdleMonitor component */

exports.default = function (_ref2) {
  var React = _ref2.React;
  var connect = _ref2.connect;

  if (IS_DEV) {
    _chai.assert.ok(React, 'react-redux-idle-monitor requires React as a dependency.');
    _chai.assert.typeOf(React, 'object');
    _chai.assert.ok(connect, 'react-redux-idle-monitor requires connect (react-redux) as a dependency.');
    _chai.assert.typeOf(connect, 'function');
  }
  var Component = React.Component;
  var PropTypes = React.PropTypes;
  var Children = React.Children;
  var cloneElement = React.cloneElement;

  var connectIdleMonitor = createConnector({ connect: connect });
  var IdleMonitorView = function IdleMonitorView(props) {
    var showControls = props.showControls;
    var idleTitle = props.idleTitle;
    var idleStatus = props.idleStatus;
    var isRunning = props.isRunning;
    var isDetectionRunning = props.isDetectionRunning;
    var isIdle = props.isIdle;
    var lastActive = props.lastActive;
    var lastEvent = props.lastEvent;
    var children = props.children;
    var mounted = props.mounted;

    var _getStyle = (0, _style2.default)(props);

    var panel = _getStyle.panel;
    var inner = _getStyle.inner;
    var title = _getStyle.title;
    var ul = _getStyle.ul;
    var li = _getStyle.li;
    var activeStyle = _getStyle.activeStyle;
    var infoStyle = _getStyle.infoStyle;
    var idleStyle = _getStyle.idleStyle;
    var stopStyle = _getStyle.stopStyle;
    var eventStyle = _getStyle.eventStyle;
    var type = lastEvent.type;
    var x = lastEvent.x;
    var y = lastEvent.y;

    var lastDate = new Date(lastActive);

    return React.createElement(
      'div',
      null,
      React.createElement(
        'div',
        { style: panel },
        React.createElement(
          'div',
          { style: inner },
          React.createElement(
            'ul',
            { style: ul },
            React.createElement(
              'li',
              { style: title },
              idleTitle
            ),
            React.createElement(
              'li',
              { style: li },
              isRunning === true ? React.createElement(
                'span',
                { style: activeStyle },
                'ON'
              ) : React.createElement(
                'span',
                { style: stopStyle },
                'OFF'
              )
            ),
            isRunning === true ? React.createElement(
              'li',
              { style: li },
              React.createElement(
                'span',
                { style: idleStatus === _constants.IDLESTATUS_ACTIVE ? activeStyle : idleStyle },
                idleStatus
              )
            ) : null,
            isRunning === true ? React.createElement(
              'li',
              { style: li },
              isDetectionRunning ? React.createElement(
                'span',
                { style: infoStyle },
                'DETECTING'
              ) : React.createElement(
                'span',
                { style: idleStyle },
                'SLEEPING'
              )
            ) : null,
            isIdle === true ? React.createElement(
              'li',
              { style: li },
              React.createElement(
                'span',
                { style: idleStyle },
                'IDLE'
              )
            ) : null,
            mounted === true ? React.createElement(
              'li',
              { style: li },
              lastDate.toJSON().substr(11, 8),
              type ? ' [' + type + ']' : null,
              x >= 0 && y >= 0 ? ' (' + x + ', ' + y + ')' : null
            ) : null
          )
        )
      )
    );
  };

  var monitorStyleShape = PropTypes.shape({ backgroundColor: PropTypes.string.isRequired,
    color: PropTypes.string.isRequired,
    activeColor: PropTypes.string.isRequired,
    idleColor: PropTypes.string.isRequired,
    stopColor: PropTypes.string.isRequired
  });

  var IdleMonitor = function (_Component) {
    _inherits(IdleMonitor, _Component);

    function IdleMonitor(props) {
      _classCallCheck(this, IdleMonitor);

      var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(IdleMonitor).call(this, props));

      _this.state = { mounted: false };
      return _this;
    }

    _createClass(IdleMonitor, [{
      key: 'componentDidMount',
      value: function componentDidMount() {
        this.setState({ mounted: true });
      }
    }, {
      key: 'render',
      value: function render() {
        var _props = this.props;
        var children = _props.children;
        var showStatus = _props.showStatus;
        var showControls = _props.showControls;
        var idleTitle = _props.idleTitle;
        var idleTheme = _props.idleTheme;
        var invertTheme = _props.invertTheme;
        var dockTo = _props.dockTo;
        var opacity = _props.opacity;
        var paletteMap = _props.paletteMap;

        var idleProps = _objectWithoutProperties(_props, ['children', 'showStatus', 'showControls', 'idleTitle', 'idleTheme', 'invertTheme', 'dockTo', 'opacity', 'paletteMap']);

        return React.createElement(
          'div',
          { className: 'idle-monitor' },
          children ? Children.map(children, function (x) {
            return cloneElement(x, _extends({}, idleProps));
          }) : null,
          showStatus ? React.createElement(IdleMonitorView, _extends({}, this.props, { mounted: this.state.mounted })) : null
        );
      }
    }]);

    return IdleMonitor;
  }(Component);

  IdleMonitor.propTypes = { showStatus: PropTypes.bool.isRequired,
    showControls: PropTypes.bool.isRequired,
    idleTitle: PropTypes.string.isRequired,
    idleTheme: PropTypes.string.isRequired,
    invertTheme: PropTypes.bool.isRequired,
    dockTo: PropTypes.oneOf(['top', 'bottom']),
    opacity: PropTypes.number.isRequired,
    paletteMap: PropTypes.object.isRequired,
    idleStatus: PropTypes.string.isRequired,
    isRunning: PropTypes.bool.isRequired,
    isIdle: PropTypes.bool.isRequired,
    isDetectionRunning: PropTypes.bool.isRequired,
    lastActive: PropTypes.number.isRequired,
    lastEvent: PropTypes.object.isRequired
  };
  IdleMonitor.defaultProps = { showStatus: IS_DEV,
    showControls: false,
    idleTitle: 'IDLEMONITOR',
    idleTheme: 'solarized',
    invertTheme: false,
    opacity: 1,
    dockTo: 'bottom',
    paletteMap: { background: ['base00', 'base01'],
      content: ['base04', 'base02', 'base05'],
      accent: ['base0D', 'base0E', 'base0C']
    }
  };

  return connectIdleMonitor(IdleMonitor);
};