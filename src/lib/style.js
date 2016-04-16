import * as themes from 'redux-devtools-themes'

const noop = () => {}

export default function getStyle(props) {
  const { theme, invertTheme, paletteMap, dockTo, opacity, isRunning, isDetectionRunning, isIdle, style } = props
  const palette = palettize(paletteMap)(theme)(invertTheme)

  const panel = { position: 'fixed'
                , zIndex: 9999999
                , width: '100%'
                , [dockTo]: 0
                , pointerEvents: 'none'
                }
  const inner = { display: 'flex'
                , padding: 0
                , margin: 0
                }

  const title = { color: palette.accent[0]
                , backgroundColor: palette.background[1]
                , lineHeight:2
                , paddingLeft: 4
                , paddingRight: 6
                , fontWeight: 'bold'
                }

  const ul =  { fontSize: 10
              , display: 'flex'
              , alignItems: 'stretch'
              , padding: 0
              , marginTop: 0
              , marginBottom: 0
              , marginLeft: 'auto'
              , marginRight: 'auto'
              , listStyle: 'none'
              , border: `1px solid ${palette.content[0]}`
              , [`border${dockTo === 'top' ? 'Top' : 'Bottom'}`] : 0
              , [`border${dockTo === 'top' ? 'Bottom' : 'Top'}LeftRadius`]: 3
              , [`border${dockTo === 'top' ? 'Bottom' : 'Top'}RightRadius`]: 3
              , opacity
              , backgroundColor: palette.background[0]
              , color: palette.content[0]
              }
  const li = { display: 'inline'
             , marginLeft: 5
             , marginRight:5
             , lineHeight: 2
             , fontWeight: 'bold'
             }

  const eventStyle = { ...li, fontSize: 8 }
  return  { title
          , panel
          , inner
          , ul
          , li
          , activeStyle: { color: palette.bool(true) } //activeColor }
          , infoStyle: { color: palette.accent[2] }
          , idleStyle: { color: palette.accent[1] }
          , stopStyle: { color: palette.bool(false) }
          , eventStyle
          }
}




//** TODO: NPM MODULE */
const palettize = paletteMap => theme => invertTheme => {
  const scheme = invertTheme ? invertColors(themes[theme]) : themes[theme]
  const basePalette = Object.keys(paletteMap).reduce((palette, key) => {
    palette[key] = paletteMap[key].map(x => scheme[x])
    return palette
  }, {})
  return  {...basePalette
          , bool: condition => condition ? scheme['base0B'] : scheme['base08']
          }
}

const invertColors = theme => ( { ...theme
                                , base00: theme.base07
                                , base01: theme.base06
                                , base02: theme.base05
                                , base03: theme.base04
                                , base04: theme.base03
                                , base05: theme.base02
                                , base06: theme.base01
                                , base07: theme.base00
                                } )
