# [react-redux-idle-monitor](https://npmjs.com/packages/react-redux-idle-monitor)

React Redux higher order component for idle state monitoring.

`npm i -S react-redux-idle-monitor`

Works in tandem with [redux-idle-monitor](https://npmjs.com/packages/redux-idle-monitor) to connect information about a users activity / idle state into your React components.

This project also includes an optional React IdleMonitor component that can be imported and used standalone or as a wrapper for your components (auto-connects to your redux store and pulls out the idle state information for you).  When developing, you may set the "showStatus" prop to true on the IdleMonitor component, which will add a docked element to your page that shows the current active / idle state of the user and additional information.



#### Usage


```js
import React, { Component, PropTypes } from 'react'
import { connectIdleMonitor } from 'react-redux-idle-monitor'

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
