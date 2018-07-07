# [react-redux-idle-monitor](https://npmjs.com/packages/react-redux-idle-monitor)

[![NPM](https://nodei.co/npm/react-redux-idle-monitor.png?stars=true&downloads=true)](https://nodei.co/npm/react-redux-idle-monitor/)

React Redux higher order component for idle state monitoring.

`npm i -S react-redux-idle-monitor`


#### CHANGELOG

**0.3.x** *5/19/2016* => Less bundled dependencies and server side rendering

* In effort to allow freedom of build systems and keep bundles as small and least redundant as possible, this module now exports factories that take in heavy React / Redux dependencies and export the same functions as they used to expose. Documentation has been updated accordingly.

* Style loading moved to componentDidMount allowing server side rendering to work now.


#### Whats it do?

Works in tandem with [redux-idle-monitor](https://www.npmjs.com/package/redux-idle-monitor) to connect information about a users activity / idle state into your React components.


This project includes an optional React IdleMonitor component that can be imported and used standalone or as a wrapper for your components (auto-connects to your redux store and pulls out the idle state information for you).  When developing, you may set the "showStatus" prop to true on the IdleMonitor component, which will add a docked element to your page that shows the current active / idle state of the user, last event that triggered activity, and additional information.


![idle monitor](/src/public/assets/idle-monitor.gif)

See a working demo in a real project at [redux-webpack-boilerplate](https://redux-webpack-boilerplate.js.org/)

#### Usage


There are a couple of ways to use react-redux-idle-monitor.


### createConnector redux idle state connect factory


The simplest way to get idle props to your component is to wrap the component with the connector component. Import the `createConnector` factory from `react-redux-idle-monitor` and pass it the connect dependency from 'react-redux'.  This may seem unusual, but it ensures this library is as small as possible and works with all build systems.

Wrapping your component with the `connectIdleMonitor` function as depicted below will inject your component with the idle properties all of the idle properties.

```js
import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'
import { createConnector } from 'react-redux-idle-monitor'

const connectIdleMonitor = createConnector({ connect })

class MyMonitoringComponent extends Component {
  // connectIdleMonitor will tack these props from your redux 'idle' state
  static propTypes =  { idleStatus: PropTypes.string.isRequired       // 'ACTIVE' if user is active or one of your other configured idle states.
                      , isIdle: PropTypes.bool.isRequired             // false if user is active or idle if user is in one of your idle states.
                      , isPaused: PropTypes.bool.isRequired           // true if idle detection has been paused.
                      , isDetectionRunning: PropTypes.bool.isRequired // true if redux idle middleware is currently monitoring user mouse / keyboard activity.
                      , lastActive: PropTypes.number.isRequired       // the last time that the user was active (when detection is running).
                      , lastEvent: PropTypes.object.isRequired        // the last mouse event coordinates that were triggered (when detection is running).
                      };

  render() {
    const { idleStatus, isIdle, isPaused, isDetectionRunning, lastActive, lastEvent } = this.props
    return (
      <div style={{ color: isIdle ? '#f00' : '#0f0' }}>
        {idleStatus}
      </div>
    )
  }
}

export default connectIdleMonitor(MyMonitoringComponent)
```

___


### `createIdleMonitor` docked React component factory (recommended as dev tool)


Another option is to export the createIdleMonitor React component factory as shown below. This monitor has an option to `showStatus` which will add a docked bar to the page with realtime information on the users idle status and is useful during development. It is the same component from the example at [redux-webpack-boilerplate](http://redux-webpack-boilerplate.js.org).

```js
import React from 'react'
import { connect } from 'react-redux'
import createIdleMonitor from 'react-redux-idle-monitor'

const IdleMonitor = createIdleMonitor({ React, connect })

const MyComponent = props => (
  <IdleMonitor showStatus={true} />
)
```


#### IdleMonitor props

These props can be passed to the IdleMonitor React component to control the look and feel.

Name            | Description
-------------   | -------------
`showStatus`    | By default, set to `true`.
`showControls`  | By default, set to `false`
`idleTitle`     | By default, set to `IDLEMONITOR`
`idleTheme`     | By default, set to `solarized`
`invertTheme`   | By default, set to `false` (dark is the standard)
`dockTo`        | By default, set to 'bottom'. Supports 'top' and 'bottom'.
`opacity`       | By default, set to `1`
`paletteMap`    | Maps theme base16 colors to control. By default, set to `{ background: ['base00', 'base01'], content: ['base04', 'base02', 'base05'], accent: ['base0D', 'base0E', 'base0C'] }`
