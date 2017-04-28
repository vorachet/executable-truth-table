'use strict'

const debug = require('debug')('ttable')
const _ = require('lodash')
const math = require('mathjs')
const ttableDoc = require('./ttable.doc')

function TTABLE () {
  this.conditions = []
  this.decisions = {}
  this.statistics = {
    decisions: [],
    conditions: [],
    performed: []
  }
  this.resources = {}
}

TTABLE.prototype.setCondition = function (condition) {
  if (!condition) throw new Error('condition input cannot be null')
  if (typeof condition !== 'object') throw new Error('condition must be object')
  if (!condition.state) throw new Error('condition.state cannot be null')
  if (!condition.equation) throw new Error('condition.equation cannot be null')

  this.conditions.push(condition)
  this.statistics.conditions.push({
    state: condition.state,
    equation: condition.equation
  })
  debug('setCondition: %o', condition)
  return this
}

TTABLE.prototype.setDecision = function (decision) {
  const self = this
  const dimension = self.conditions.length
  const inputs = {
    0: 'F',
    1: 'T'
  }
  const re = new RegExp(Object.keys(inputs).join('|'), 'gi')
  var row = 0
  const arrayOfBin = _.map(decision.if, (it) => {
    row = _.findIndex(self.conditions, condition => condition.state === it.state)
    let digit = it.is ? '1' : '0'
    for (let i = 1; i < dimension - row;) {
      digit = `0${digit}`
      i += 1
    }
    for (let i = 0; i < row;) {
      digit = `${digit}0`
      i += 1
    }
    return parseInt(digit, 2)
  })

  const sum = arrayOfBin.reduce((a, b) => a + b, 0)
  let key = sum.toString(2)
  key = ttableDoc.padZero(key, dimension, '0')
  key = key.split('').reverse().join('')

  const decisionKey = key.replace(re, matched => inputs[matched])
  self.decisions[decisionKey] = decision.run
  self.statistics.decisions.push({
    decisions: _.map(decision.run, action => `${action.name}()`),
    if: decision.if
  })

  const numOfUnset = dimension - decision.if.length
  if (numOfUnset > 0) {
    debug('missing default %d row %d', numOfUnset, row)
  }

  debug('setDecision: %s run %o if %o', decisionKey, decision.run, decision.if)
  return self
}

TTABLE.prototype.read = function (inputs, options, callback) {
  const self = this
  const _inputs = _.clone(inputs)
  const re = new RegExp(Object.keys(_inputs).join('|'), 'gi')

  debug('eval() inputs', JSON.stringify(_inputs))
  const stat = {
    inputs: _inputs,
    performedOn: new Date(),
    performedDecisions: [],
    eval: '',
    states: []
  }

  const states = []
  _.each(self.conditions, (condition, index) => {
    condition.parameterizedEq =
      condition.equation.replace(re, matched => _inputs[matched])

    condition.evaluatedState = math.eval(condition.parameterizedEq) ? 'T' : 'F'

    stat.states.push(condition.state + ' (' + condition.evaluatedState + ')')

    debug(`\tstate[${condition.state}(${condition.evaluatedState})], eq[%s], parameterized[%s]`,
      condition.equation,
      condition.parameterizedEq)

    states.push(condition.evaluatedState)

    const evaluationFinished = (index + 1) === self.conditions.length
    if (evaluationFinished) {
      const statesString = states.join('') // states.reverse().join('')
      debug('\tmatchedDecisionState = %s', statesString)
      const ckeys = statesString.split('')
      const evalString = ckeys.reverse().join('')
      stat.eval = evalString
      const matchedDecisions = self.decisions[statesString]
      const performedDecisions = _.map(matchedDecisions, act => `${act.name}()`)
      if (matchedDecisions) {
        stat.performedDecisions = performedDecisions
        debug('\tmatchedDecisions = ', stat.performedDecisions)
        if (callback) callback(stat, options)
        _.each(matchedDecisions, (act) => act(stat, options))
      } else {
        if (callback) callback(stat, options)
      }

      self.statistics.performed.push(stat)
    }
  })
}

TTABLE.prototype.statistics = function () {
  return this.statistics
}

TTABLE.prototype.exportSpecAsHTML = function (tableCSSClass) {
  return ttableDoc.exportSpecAsHTML(this.conditions, this.decisions, tableCSSClass)
}

TTABLE.prototype.exportStatAsHTML = function (tableCSSClass) {
  return ttableDoc.exportStatAsHTML(this.statistics, tableCSSClass)
}

module.exports = TTABLE
