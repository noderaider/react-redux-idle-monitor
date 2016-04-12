export default function getStyle(props) {
  const badge =  { }
  const title = { display: 'inline' }

  const panel =  { /*fontSize: '0.75em'
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
                      }
  const ul = { fontSize: '0.75em'
                  , textAlign: 'center'
                  , listStyle: 'none'
                  //, maxWidth: 720
                  , width: '40%'
                  , bottom: 0
                  , left: '30%'
                  , padding: 5
                  , marginLeft: 'auto'
                  , marginRight: 'auto'
                  , marginBottom: 0
                  , border: '1px solid rgb(120, 120, 120)'
                  , borderBottom: 0
                  , borderTopLeftRadius: 3
                  , borderTopRightRadius: 3
                  , position: 'fixed'
                  , zIndex: 99999999
                  , opacity: 0.9
                  }
  const ulActive =  { ...ul
                    , backgroundColor: 'rgb(230, 240, 230)'
                    }
  const ulIdle =  { ...ul
                    , backgroundColor: 'rgb(240, 230, 230)'
                    }
  const li = { display: 'inline'
                  , marginLeft:4
                  , marginRight:4
                  }


  const activeStyle = { ...badge
                      , color: 'rgb(20, 200, 50)'
                      }
  const idleStyle = { ...badge
                    , color: 'rgb(230, 100, 100)'
                    }
  const trueStyle = { ...badge
                    , color: 'rgb(50, 200, 200)'
                    }
  const falseStyle =  { ...badge
                      , color: 'rgb(200, 50, 50)'
                      }

  return { badge, title, panel, ul, ulActive, ulIdle, li, activeStyle, idleStyle, trueStyle, falseStyle }
}
