'use strict'

const debug = require('debug')('ttable')
const _ = require('lodash')
const math = require('mathjs')
const ttableDoc = require('./ttable.doc')

function TTABLE () {
  this.mode = 'Disjunction/OR'
  this.conditions = []
  this.decisions = {}
  this.statistics = {
    decisions: [],
    conditions: [],
    performed: []
  }
  this.resources = {}
}

TTABLE.prototype.conjunctionMode = function (condition) {
  this.mode = 'Conjunction/AND'
}

TTABLE.prototype.disjunctionMode = function (condition) {
  this.mode = 'Disjunction/OR'
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
  debug('setCondition(%s): %o', 'mode=' + this.mode, condition)
  return this
}

TTABLE.prototype.performDisjunctionMode = function (decision, dimension, numOfUnsetStates, binPos) {
  const self = this
  const inputs = {0: 'F', 1: 'T'}
  const re = new RegExp(Object.keys(inputs).join('|'), 'gi')
  var decisionKey
  if (numOfUnsetStates === binPos || binPos === 0) {
    for (let i = 0; i < math.pow(2, numOfUnsetStates); i++) {
      const o = ttableDoc.padZero(i.toString(2), numOfUnsetStates, '0').replace(re, matched => inputs[matched])
      if (numOfUnsetStates === binPos) decisionKey = 'T' + o
      if (binPos === 0) decisionKey = o + 'T'
      decisionKey = decisionKey.split('').join('')
      if (!this.decisions[decisionKey]) this.decisions[decisionKey] = []
      _.each(decision.run, function (fn) {
        self.decisions[decisionKey].push(fn)
        self.decisions[decisionKey] = _.uniq(self.decisions[decisionKey])
      })
    }
  } else {
    const left = dimension - (binPos + 1)
    const right = binPos

    for (let i = 0; i < math.pow(2, left); i++) {
      const b1 = ttableDoc.padZero(i.toString(2), left, '0').replace(re, matched => inputs[matched]) + 'T'
      for (let j = 0; j < math.pow(2, right); j++) {
        const o = ttableDoc.padZero(j.toString(2), right, '0').replace(re, matched => inputs[matched])
        decisionKey = b1 + o
        decisionKey = decisionKey.split('').join('')

        if (!this.decisions[decisionKey]) this.decisions[decisionKey] = []
        _.each(decision.run, function (fn) {
          self.decisions[decisionKey].push(fn)
          self.decisions[decisionKey] = _.uniq(self.decisions[decisionKey])
        })
      }
    }
  }
}

TTABLE.prototype.setDecision = function (decision) {
  if (!decision) throw new Error('decision input cannot be null')
  if (typeof decision !== 'object') throw new Error('decision must be object')
  if (!Array.isArray(decision.run)) throw new Error('decision.run must be array')
  if (decision.run.length === 0) throw new Error('decision.run cannot be empty array')
  _.each(decision.run, function (decisionFunc) {
    if (typeof decisionFunc !== 'function') throw new Error('item in decision.run must be function')
  })

  if (!Array.isArray(decision.if)) throw new Error('decision.if must be array')
  if (decision.if.length === 0) throw new Error('decision.if cannot be empty array')
  _.each(decision.if, function (stateIfObject) {
    if (typeof stateIfObject !== 'string') throw new Error('item in decision.if must be string')
  })

  const self = this
  const dimension = self.conditions.length
  const inputs = {0: 'F', 1: 'T'}
  const re = new RegExp(Object.keys(inputs).join('|'), 'gi')
  var binPos = 0
  const binstr = _.map(decision.if, (it) => {
    let i
    let bin = '1'
    binPos = _.findIndex(self.conditions, condition => condition.state === it)
    for (i = 1; i < dimension - binPos; i++) bin = `0${bin}`
    for (i = 0; i < binPos; i++) bin = `${bin}0`
    return parseInt(bin, 2)
  })

  const sum = binstr.reduce((a, b) => a + b, 0)
  let bin = sum.toString(2)
  bin = ttableDoc.padZero(bin, dimension, '0')

  const decisionKey = bin.replace(re, matched => inputs[matched])

  if (!self.decisions[decisionKey]) self.decisions[decisionKey] = []
  _.each(decision.run, function (fn) {
    self.decisions[decisionKey].push(fn)
    self.decisions[decisionKey] = _.uniq(self.decisions[decisionKey])
  })

  debug('setDecision(%s): %s run %o if %s', 'mode=' + this.mode, decisionKey, decision.run, decision.if)

  const numOfUnsetStates = dimension - decision.if.length
  if (this.mode === 'Disjunction/OR') this.performDisjunctionMode(decision, dimension, numOfUnsetStates, binPos)

  return self
}

TTABLE.prototype.eval = function (userParameters, options, callback, unmatchCallback) {
  const self = this
  const _userParameters = _.clone(userParameters)
  const re = new RegExp(Object.keys(_userParameters).join('|'), 'gi')

  debug('eval() inputs', JSON.stringify(_userParameters))
  const stat = {
    inputs: _userParameters,
    performedOn: new Date(),
    performedDecisions: [],
    matchedStates: []
  }

  const states = []

  _.each(self.conditions, (condition, index) => {
    condition.parameterizedEq = condition.equation.replace(re, matched => _userParameters[matched])
    condition.evaluatedState = math.eval(condition.parameterizedEq) ? 'T' : 'F'
    if (condition.evaluatedState === 'T') stat.matchedStates.push(condition.state)
    states.push(condition.evaluatedState)

    debug(`\t${condition.evaluatedState}[${condition.state}], equation = %s`, condition.equation)

    const allConditionsAreEvaluated = (index + 1) === self.conditions.length
    if (allConditionsAreEvaluated) {
      const decisionKey = states.reverse().join('')
      const matchedDecisions = self.decisions[decisionKey]
      debug('\tmatchedDecisions = %o', matchedDecisions)
      if (matchedDecisions) {
        const performedDecisions = _.map(matchedDecisions, act => act.name)

        stat.performedDecisions = performedDecisions

        if (callback) callback(stat, options)
        _.each(matchedDecisions, (act) => act(stat, options))
      } else {
        if (unmatchCallback) unmatchCallback(stat, options)
      }

      self.statistics.performed.push(stat)
    }
  })
}

TTABLE.prototype.statistics = function () {
  return this.statistics
}

TTABLE.prototype.exportSpecAsHTML = function (tableCSSClass) {
  return ttableDoc.exportSpecAsHTML(this.mode, this.conditions, this.decisions, tableCSSClass)
}

TTABLE.prototype.exportStatAsHTML = function (tableCSSClass) {
  return ttableDoc.exportStatAsHTML(this.mode, this.statistics, tableCSSClass)
}

module.exports = TTABLE
