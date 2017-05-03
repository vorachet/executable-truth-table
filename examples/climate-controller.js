"use strict";

process.env.DEBUG = '*';

const debug = require('debug')('ClimateController');
const fs = require('fs')
const TTABLE = require('../ttable');

function startCooler() { debug('\t startCooler()') }
function stopCooler() { debug('\t stopCooler()') }
function startHumidifier() { debug('\t startHumidifier()') }
function stopHumidifier() { debug('\t stopHumidifier()') }
function startHeater() { debug('\t startHeater()') }
function stopHeater() { debug('\t stopHeater()') }

function CoolOn() {
    debug('CoolOn()')
    startCooler()
    stopHeater()
    stopHumidifier()
}

function HumidOn() {
    debug('HumidOn()')
    startHumidifier()
}

function HeatOn() {
    debug('HeatOn()')
    startHeater()
    stopCooler()
    stopHumidifier()
}

const ttable = new TTABLE()
ttable.disjunctionMode()
ttable
    .setCondition({state: "Cold", equation: "tempSensor < DESIRED_TEMP"})
    .setCondition({state: "Hot", equation: "tempSensor > DESIRED_TEMP"})
    .setCondition({state: "Dry", equation: "humiditySensor < DESIRED_HUMIDITY"})
    .setDecision({run: [CoolOn], if: ["Hot"]})
    .setDecision({run: [HeatOn], if: ["Cold"]})
    .setDecision({run: [HumidOn],if: ["Dry"]})

fs.writeFileSync(__dirname + '/climate-controller_spec.html', ttable.exportSpecAsHTML(), 'utf-8')

ttable.eval({DESIRED_TEMP: 70, DESIRED_HUMIDITY: 40, tempSensor: 40, humiditySensor: 80 })
ttable.eval({DESIRED_TEMP: 70, DESIRED_HUMIDITY: 40, tempSensor: 80, humiditySensor: 20})
ttable.eval({DESIRED_TEMP: 70, DESIRED_HUMIDITY: 40, tempSensor: 100, humiditySensor: 50})
ttable.eval({DESIRED_TEMP: 70, DESIRED_HUMIDITY: 40, tempSensor: 10, humiditySensor: 10})

fs.writeFileSync(__dirname + '/climate-controller_statistics.html', ttable.exportStatAsHTML(), 'utf-8')

fs.writeFileSync(__dirname + '/climate-controller_statistics.json', JSON.stringify(ttable.statistics, null, 2), 'utf-8')
