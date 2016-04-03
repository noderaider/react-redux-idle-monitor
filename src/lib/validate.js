import { assert } from 'chai'

export const validateOpts = opts => {
  const { actions, activeEvents, useFastState, useLocalState, thresholds } = opts
  assert.ok(actions, 'actions must exist')
  assert(Array.isArray(actions), 'actions must be an array')
  assert(actions.every(x => Array.isArray(x)), 'actions must be an array of an array')
  assert(actions.every(x => x.length === 2), 'every actions must have length 2')
  assert(actions.every(x => typeof x[0] === 'string'), 'every action must have first ordinal type string event name')
  assert(actions.every(x => typeof x[1] === 'object'), 'every action must have second ordinal type object')
  assert(actions.every(x => typeof x[1].action !== 'undefined'), 'every action must have second ordinal action function defined')
  assert(actions.every(x => {
    const type = typeof x[1].timeoutMS
    return type === 'number' || type === 'function'
  }), 'every action must have second ordinal timeoutMS number or function defined')
  assert.ok(activeEvents, 'active events must exist')
}
