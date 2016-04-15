'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

exports.default = getStyle;

var _reduxDevtoolsThemes = require('redux-devtools-themes');

var themes = _interopRequireWildcard(_reduxDevtoolsThemes);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function getStyle(props) {
  var theme = props.theme;
  var invertTheme = props.invertTheme;
  var paletteMap = props.paletteMap;
  var opacity = props.opacity;
  var isRunning = props.isRunning;
  var isDetectionRunning = props.isDetectionRunning;
  var isIdle = props.isIdle;
  var style = props.style;

  var palette = palettize(paletteMap)(theme)(invertTheme);

  var panel = { position: 'fixed',
    zIndex: 9999999,
    width: '100%',
    bottom: 0,
    background: 'none',
    opacity: 0
  };
  var inner = { display: 'flex',
    padding: 0,
    margin: 0,
    background: 'none'
  };

  var title = { color: palette.accent[0],
    backgroundColor: palette.background[1],
    lineHeight: 2,
    paddingLeft: 4,
    paddingRight: 6,
    fontWeight: 'bold'
  };

  var ul = { fontSize: 10,
    display: 'flex',
    alignItems: 'stretch',
    padding: 0,
    marginBottom: 0,
    marginLeft: 'auto',
    marginRight: 'auto',
    listStyle: 'none',
    border: '1px solid ' + palette.content[0],
    borderTopLeftRadius: 3,
    borderTopRightRadius: 3,
    opacity: opacity,
    backgroundColor: palette.background[0],
    color: palette.content[0]
  };
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
    activeStyle: { color: palette.bool(true) } //activeColor }
    , infoStyle: { color: palette.accent[2] },
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