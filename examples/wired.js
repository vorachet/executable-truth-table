"use strict";

process.env.DEBUG = '*';

const debug = require('debug')('wired')
const fs = require('fs')
const TTABLE = require('../ttable')

const child = new TTABLE()
child
  .setCondition({state: "ChildS1", equation: "a * c < 100"})
  .setCondition({state: "ChildS2", equation: "a * c > 100"})
  .setDecision({run: [function ChildDecision1 (ttable) {debug('performed decision ChildDecision1') }],
    if: [{state: "ChildS1", is: true}]})
  .setDecision({run: [function ChildDecision2 (ttable) {debug('performed decision ChildDecision2') }],
    if: [{state: "ChildS2", is: true}]})

const parent = new TTABLE()
parent
  .setCondition({state: "ParentS1", equation: "a < 10"})
  .setCondition({state: "ParentS2", equation: "a > 10"})
  .setDecision({run: [function ParentDecision1 (ttable) {
    debug('performed ParentDecision1')
    child.read(ttable.inputs)}], if: [{state: "ParentS1", is: true}]}) // call child
  .setDecision({run: [function StarterDecision2 (ttable) {
    debug('performed StarterDecision2')
    child.read(ttable.inputs)}], if: [{state: "ParentS2", is: true}]}) // call child

fs.writeFileSync(__dirname + '/wired_parent_spec.html', parent.exportSpecAsHTML(),'utf-8')
fs.writeFileSync(__dirname + '/wired_child_spec.html', child.exportSpecAsHTML(),'utf-8')

parent.read({a: 5, c: 1})
parent.read({a: 20, c: 1})
parent.read({a: 5, c: 100})
parent.read({a: 20, c: 100})

fs.writeFileSync(__dirname + '/wired_parent_statistics.html', parent.exportStatAsHTML(),'utf-8')
fs.writeFileSync(__dirname + '/wired_child_statistics.html', child.exportStatAsHTML(),'utf-8')

fs.writeFileSync(__dirname + '/wired_parent_statistics.json', JSON.stringify(parent.statistics, null, 2), 'utf-8')
fs.writeFileSync(__dirname + '/wired_child_statistics.json', JSON.stringify(child.statistics, null, 2), 'utf-8')
