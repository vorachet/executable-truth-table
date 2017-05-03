"use strict";

process.env.DEBUG = '*';

const debug = require('debug')('ClimateController');
const fs = require('fs')
const TTABLE = require('../ttable');

function LifetimeFreeBusService() {
    debug('LifetimeFreeBusService()')
}

function DaytimeFreeBusService() {
    debug('DaytimeFreeBusService()')
}

function FreeLunchSevice() {
    debug('FreeLunchSevice()')
}

function FiftyPercentDiscountBusServiceOnWeekend() {
    debug('FiftyPercentDiscountBusServiceOnWeekend()')
}

const ttable = new TTABLE()
ttable.disjunctionMode()
ttable
    .setCondition({state: "VETERAN", equation: "isVeteran  > 0"})
    .setCondition({state: "POOR", equation: "monthlyWage  <= 6000"})
    .setCondition({state: "MIDDLE_CLASS", equation: "(monthlyWage  > 6000)(monthlyWage < 15000)"})
    .setCondition({state: "UPPER_MIDDLE_CLASS", equation: "monthlyWage  >= 15000"})
    .setDecision({run: [LifetimeFreeBusService], if: ["VETERAN"]})
    .setDecision({run: [DaytimeFreeBusService, FreeLunchSevice], if: ["POOR"]})
    .setDecision({run: [FiftyPercentDiscountBusServiceOnWeekend], if: ["MIDDLE_CLASS"]})

fs.writeFileSync(__dirname + '/smartcity_spec.html', ttable.exportSpecAsHTML(), 'utf-8')

ttable.eval({monthlyWage: 5000, isVeteran: 1})
ttable.eval({monthlyWage: 5000, isVeteran: 0})
ttable.eval({monthlyWage: 7000, isVeteran: 1})
ttable.eval({monthlyWage: 8000, isVeteran: 0})
ttable.eval({monthlyWage: 15000, isVeteran: 0})
ttable.eval({monthlyWage: 15000, isVeteran: 1})

fs.writeFileSync(__dirname + '/smartcity_statistics.html', ttable.exportStatAsHTML(), 'utf-8')
fs.writeFileSync(__dirname + '/smartcity_statistics.json', JSON.stringify(ttable.statistics, null, 2), 'utf-8')
