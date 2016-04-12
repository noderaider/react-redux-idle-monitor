'use strict';

Object.defineProperty(exports, "__esModule", {
                  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

exports.default = getStyle;
function getStyle(props) {
                  var badge = {};
                  var title = { display: 'inline' };

                  var panel = {/*fontSize: '0.75em'
                                       , maxWidth: 720
                                       , maxHeight: 70
                                       , paddingTop: 5
                                       , paddingLeft: 5
                                       , paddingBottom: 5
                                       , paddingRight: 5
                                       , marginLeft: 'auto'
                                       , marginRight: 'auto'
                                       , textAlign: 'center'
                                       */
                  };
                  var ul = { fontSize: '0.75em',
                                    textAlign: 'center',
                                    listStyle: 'none'
                                    //, maxWidth: 720
                                    , width: '50%',
                                    bottom: 0,
                                    left: '25%',
                                    padding: 5,
                                    marginLeft: 'auto',
                                    marginRight: 'auto',
                                    marginBottom: 0,
                                    border: '1px solid rgb(120, 120, 120)',
                                    borderBottom: 0,
                                    borderTopLeftRadius: 3,
                                    borderTopRightRadius: 3,
                                    position: 'fixed',
                                    zIndex: 99999999,
                                    opacity: 0.9
                  };
                  var ulActive = _extends({}, ul, { backgroundColor: 'rgb(230, 240, 230)'
                  });
                  var ulIdle = _extends({}, ul, { backgroundColor: 'rgb(240, 230, 230)'
                  });
                  var li = { display: 'inline',
                                    marginLeft: 4,
                                    marginRight: 4
                  };

                  var activeStyle = _extends({}, badge, { color: 'rgb(20, 200, 50)'
                  });
                  var idleStyle = _extends({}, badge, { color: 'rgb(230, 100, 100)'
                  });
                  var trueStyle = _extends({}, badge, { color: 'rgb(50, 200, 200)'
                  });
                  var falseStyle = _extends({}, badge, { color: 'rgb(200, 50, 50)'
                  });

                  return { badge: badge, title: title, panel: panel, ul: ul, ulActive: ulActive, ulIdle: ulIdle, li: li, activeStyle: activeStyle, idleStyle: idleStyle, trueStyle: trueStyle, falseStyle: falseStyle };
}