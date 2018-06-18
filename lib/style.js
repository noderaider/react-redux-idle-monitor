'use strict';

Object.defineProperty(exports, "__esModule", {
              value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

exports.default = getStyle;

var _reduxDevtoolsThemes = require('redux-devtools-themes');

var themes = _interopRequireWildcard(_reduxDevtoolsThemes);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var noop = function noop() {};

function getStyle(props) {
              var _panel, _ul;

              var idleTheme = props.idleTheme,
                  invertTheme = props.invertTheme,
                  paletteMap = props.paletteMap,
                  dockTo = props.dockTo,
                  opacity = props.opacity,
                  isRunning = props.isRunning,
                  isDetectionRunning = props.isDetectionRunning,
                  isIdle = props.isIdle,
                  style = props.style;

              var palette = palettize(paletteMap)(idleTheme)(invertTheme);

              var panel = (_panel = { position: 'fixed',
                            zIndex: 9999999,
                            width: '100%'
              }, _defineProperty(_panel, dockTo, 0), _defineProperty(_panel, 'pointerEvents', 'none'), _panel);
              var inner = { display: 'flex',
                            padding: 0,
                            margin: 0
              };

              var title = { color: palette.accent[0],
                            backgroundColor: palette.background[1],
                            lineHeight: 2,
                            paddingLeft: 4,
                            paddingRight: 6,
                            fontWeight: 'bold'
              };

              var ul = (_ul = { fontSize: 10,
                            display: 'flex',
                            alignItems: 'stretch',
                            padding: 0,
                            marginTop: 0,
                            marginBottom: 0,
                            marginLeft: 'auto',
                            marginRight: 'auto',
                            listStyle: 'none',
                            border: '1px solid ' + palette.content[0]
              }, _defineProperty(_ul, 'border' + (dockTo === 'top' ? 'Top' : 'Bottom'), 0), _defineProperty(_ul, 'border' + (dockTo === 'top' ? 'Bottom' : 'Top') + 'LeftRadius', 3), _defineProperty(_ul, 'border' + (dockTo === 'top' ? 'Bottom' : 'Top') + 'RightRadius', 3), _defineProperty(_ul, 'opacity', opacity), _defineProperty(_ul, 'backgroundColor', palette.background[0]), _defineProperty(_ul, 'color', palette.content[0]), _ul);
              var li = { display: 'inline',
                            marginLeft: 5,
                            marginRight: 5,
                            lineHeight: 2,
                            fontWeight: 'bold'
              };

              var eventStyle = _extends({}, li, { fontSize: 8 });
              return { title: title,
                            panel: panel,
                            inner: inner,
                            ul: ul,
                            li: li,
                            activeStyle: { color: palette.bool(true) //activeColor }
                            }, infoStyle: { color: palette.accent[2] },
                            idleStyle: { color: palette.accent[1] },
                            stopStyle: { color: palette.bool(false) },
                            eventStyle: eventStyle
              };
}

//** TODO: NPM MODULE */
var palettize = function palettize(paletteMap) {
              return function (theme) {
                            return function (invertTheme) {
                                          var scheme = invertTheme ? invertColors(themes[theme]) : themes[theme];
                                          var basePalette = Object.keys(paletteMap).reduce(function (palette, key) {
                                                        palette[key] = paletteMap[key].map(function (x) {
                                                                      return scheme[x];
                                                        });
                                                        return palette;
                                          }, {});
                                          return _extends({}, basePalette, { bool: function bool(condition) {
                                                                      return condition ? scheme['base0B'] : scheme['base08'];
                                                        }
                                          });
                            };
              };
};

var invertColors = function invertColors(theme) {
              return _extends({}, theme, { base00: theme.base07,
                            base01: theme.base06,
                            base02: theme.base05,
                            base03: theme.base04,
                            base04: theme.base03,
                            base05: theme.base02,
                            base06: theme.base01,
                            base07: theme.base00
              });
};