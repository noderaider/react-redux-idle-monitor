'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.createConnector = exports.mapIdleStateToProps = undefined;

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var _reduxMux = require('redux-mux');

var _chai = require('chai');

var _constants = require('redux-idle-monitor/lib/constants');

var _style = require('./style');

var _style2 = _interopRequireDefault(_style);

var _propTypes = require('prop-types');

var _propTypes2 = _interopRequireDefault(_propTypes);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _objectWithoutProperties(obj, keys) { var target = {}; for (var i in obj) { if (keys.indexOf(i) >= 0) continue; if (!Object.prototype.hasOwnProperty.call(obj, i)) continue; target[i] = obj[i]; } return target; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var IS_DEV = process.env.NODE_ENV !== 'production';
var IS_BROWSER = (typeof window === 'undefined' ? 'undefined' : _typeof(window)) === 'object';

var selectState = (0, _reduxMux.createStateSelector)(_constants.ROOT_STATE_KEY);

var mapIdleStateToProps = exports.mapIdleStateToProps = function mapIdleStateToProps(state, ownProps) {
  var _selectState = selectState(state),
      idleStatus = _selectState.idleStatus,
      isRunning = _selectState.isRunning,
      isDetectionRunning = _selectState.isDetectionRunning,
      isIdle = _selectState.isIdle,
      lastActive = _selectState.lastActive,
      lastEvent = _selectState.lastEvent;

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
  var React = _ref2.React,
      connect = _ref2.connect;

  if (IS_DEV) {
    _chai.assert.ok(React, 'react-redux-idle-monitor requires React as a dependency.');
    _chai.assert.typeOf(React, 'object');
    _chai.assert.ok(connect, 'react-redux-idle-monitor requires connect (react-redux) as a dependency.');
    _chai.assert.typeOf(connect, 'function');
  }
  var Component = React.Component,
      Children = React.Children,
      cloneElement = React.cloneElement;

  var connectIdleMonitor = createConnector({ connect: connect });
  var IdleMonitorView = function IdleMonitorView(props) {
    var showControls = props.showControls,
        idleTitle = props.idleTitle,
        idleStatus = props.idleStatus,
        isRunning = props.isRunning,
        isDetectionRunning = props.isDetectionRunning,
        isIdle = props.isIdle,
        lastActive = props.lastActive,
        lastEvent = props.lastEvent,
        children = props.children,
        mounted = props.mounted;

    var _getStyle = (0, _style2.default)(props),
        panel = _getStyle.panel,
        inner = _getStyle.inner,
        title = _getStyle.title,
        ul = _getStyle.ul,
        li = _getStyle.li,
        activeStyle = _getStyle.activeStyle,
        infoStyle = _getStyle.infoStyle,
        idleStyle = _getStyle.idleStyle,
        stopStyle = _getStyle.stopStyle,
        eventStyle = _getStyle.eventStyle;

    var type = lastEvent.type,
        x = lastEvent.x,
        y = lastEvent.y;

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

  var monitorStyleShape = _propTypes2.default.shape({ backgroundColor: _propTypes2.default.string.isRequired,
    color: _propTypes2.default.string.isRequired,
    activeColor: _propTypes2.default.string.isRequired,
    idleColor: _propTypes2.default.string.isRequired,
    stopColor: _propTypes2.default.string.isRequired
  });

  var IdleMonitor = function (_Component) {
    _inherits(IdleMonitor, _Component);

    function IdleMonitor(props) {
      _classCallCheck(this, IdleMonitor);

      var _this = _possibleConstructorReturn(this, (IdleMonitor.__proto__ || Object.getPrototypeOf(IdleMonitor)).call(this, props));

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
        var _props = this.props,
            children = _props.children,
            showStatus = _props.showStatus,
            showControls = _props.showControls,
            idleTitle = _props.idleTitle,
            idleTheme = _props.idleTheme,
            invertTheme = _props.invertTheme,
            dockTo = _props.dockTo,
            opacity = _props.opacity,
            paletteMap = _props.paletteMap,
            idleProps = _objectWithoutProperties(_props, ['children', 'showStatus', 'showControls', 'idleTitle', 'idleTheme', 'invertTheme', 'dockTo', 'opacity', 'paletteMap']);

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

  IdleMonitor.propTypes = { showStatus: _propTypes2.default.bool.isRequired,
    showControls: _propTypes2.default.bool.isRequired,
    idleTitle: _propTypes2.default.string.isRequired,
    idleTheme: _propTypes2.default.string.isRequired,
    invertTheme: _propTypes2.default.bool.isRequired,
    dockTo: _propTypes2.default.oneOf(['top', 'bottom']),
    opacity: _propTypes2.default.number.isRequired,
    paletteMap: _propTypes2.default.object.isRequired,
    idleStatus: _propTypes2.default.string.isRequired,
    isRunning: _propTypes2.default.bool.isRequired,
    isIdle: _propTypes2.default.bool.isRequired,
    isDetectionRunning: _propTypes2.default.bool.isRequired,
    lastActive: _propTypes2.default.number.isRequired,
    lastEvent: _propTypes2.default.object.isRequired
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