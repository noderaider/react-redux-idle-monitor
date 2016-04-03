
import { validateOpts } from './validate'
import { getActions, getActiveEvents, getUseFastState, getUseLocalState, getThresholds, getLevel } from './defaults'
import createContext from './context'

import configureReducer from './reducer'
import configureActions, { defineAction } from './actions'

const configure = ( { actions = getActions()
                    , activeEvents = getActiveEvents()
                    , useFastState = getUseFastState()
                    , useLocalState = getUseLocalState()
                    , thresholds = getThresholds()
                    , level = getLevel()
                    } = {} ) => {
  const opts = { actions, activeEvents, useFastState, useLocalState, thresholds, level }
  if(process.env.NODE_ENV !== 'production')
    validateOpts(opts)
  const context = createContext(opts)
  return  { reducer: configureReducer(context)
          , actions: configureActions(context)
          }
}
export default configure
export { defineAction }
