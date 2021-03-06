# Truth Table (TTABLE)

TTABLE is Node.js Truth Table implementation. You can use Truth Table technique to model I/O behaviors and functions of your Node.js program. TTABLE provides methods to define conditions, states, and decisions, which is readiness. TTABLE is executable and each decision definition can call multiple javascript functions, so you can choose to use TTABLE as your decision logic. TTABLE provides built-in Truth Table specification and runtime statistic document generator. You can check that everything in your decision logic design is covered.

## Webapp integration examples

Webapp integration examples is available at [Executable Truth Table Webapp Examples](https://github.com/vorachet/executable-truth-table-webapp-examples)

# Install


```bash
$ npm install executable-truth-table@latest --save

```

# Usage


Create new TTABLE instance
```javascript
const TTABLE = require('executable-truth-table');
const ttable = new TTABLE()
```

Choose evaluation mode of truth table
```javascript
ttable.disjunctionMode() // Use OR operation in Truth Table
ttable.conjunctionMode() // Use AND operation in Truth Table
```

Set conditions
```javascript
ttable
    .setCondition({state: "Cold", equation: "tempSensor < DESIRED_TEMP"})
    .setCondition({state: "Hot", equation: "tempSensor > DESIRED_TEMP"})
    .setCondition({state: "Dry", equation: "humiditySensor < DESIRED_HUMIDITY"})
```

Set decisions
```javascript
ttable
    .setDecision({run: [CoolOn], if: ["Hot"]})
    .setDecision({run: [HeatOn], if: ["Cold"]})
    .setDecision({run: [HumidOn],if: ["Dry"]})
```

Evaluate results
```javascript
ttable.eval({DESIRED_TEMP: 70, DESIRED_HUMIDITY: 40, tempSensor: 40, humiditySensor: 80 })
ttable.eval({DESIRED_TEMP: 70, DESIRED_HUMIDITY: 40, tempSensor: 80, humiditySensor: 20})
ttable.eval({DESIRED_TEMP: 70, DESIRED_HUMIDITY: 40, tempSensor: 100, humiditySensor: 50})
ttable.eval({DESIRED_TEMP: 70, DESIRED_HUMIDITY: 40, tempSensor: 10, humiditySensor: 10})
```


# Climate Controller Truth Table Example


![generated_spec](https://github.com/vorachet/executable-truth-table/blob/master/images/climate-controller_concept.png)


```javascript
"use strict";

process.env.DEBUG = '*';

const debug = require('debug')('ClimateController');
const fs = require('fs')
const TTABLE = require('executable-truth-table');

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

```

Output

```bash
$ node climate-controller
  ttable setCondition(mode=Disjunction/OR): { state: 'Cold', equation: 'tempSensor < DESIRED_TEMP' } +0ms
  ttable setCondition(mode=Disjunction/OR): { state: 'Hot', equation: 'tempSensor > DESIRED_TEMP' } +6ms
  ttable setCondition(mode=Disjunction/OR): { state: 'Dry', equation: 'humiditySensor < DESIRED_HUMIDITY' } +2ms
  ttable setDecision(mode=Disjunction/OR): FTF run [ [Function: CoolOn] ] if Hot +2ms
  ttable setDecision(mode=Disjunction/OR): FFT run [ [Function: HeatOn] ] if Cold +61ms
  ttable setDecision(mode=Disjunction/OR): TFF run [ [Function: HumidOn] ] if Dry +1ms
  ttable eval() inputs {"DESIRED_TEMP":70,"DESIRED_HUMIDITY":40,"tempSensor":40,"humiditySensor":80} +4ms
  ttable  T[Cold], equation = tempSensor < DESIRED_TEMP +95ms
  ttable  F[Hot], equation = tempSensor > DESIRED_TEMP +8ms
  ttable  F[Dry], equation = humiditySensor < DESIRED_HUMIDITY +0ms
  ttable  matchedDecisions = [ [Function: HeatOn] ] +0ms
  ClimateController HeatOn() +1ms
  ClimateController    startHeater() +0ms
  ClimateController    stopCooler() +0ms
  ClimateController    stopHumidifier() +0ms
  ttable eval() inputs {"DESIRED_TEMP":70,"DESIRED_HUMIDITY":40,"tempSensor":80,"humiditySensor":20} +1ms
  ttable  F[Cold], equation = tempSensor < DESIRED_TEMP +0ms
  ttable  T[Hot], equation = tempSensor > DESIRED_TEMP +1ms
  ttable  T[Dry], equation = humiditySensor < DESIRED_HUMIDITY +0ms
  ttable  matchedDecisions = [ [Function: CoolOn], [Function: HumidOn] ] +0ms
  ClimateController CoolOn() +0ms
  ClimateController    startCooler() +0ms
  ClimateController    stopHeater() +0ms
  ClimateController    stopHumidifier() +0ms
  ClimateController HumidOn() +1ms
  ClimateController    startHumidifier() +0ms
  ttable eval() inputs {"DESIRED_TEMP":70,"DESIRED_HUMIDITY":40,"tempSensor":100,"humiditySensor":50} +0ms
  ttable  F[Cold], equation = tempSensor < DESIRED_TEMP +0ms
  ttable  T[Hot], equation = tempSensor > DESIRED_TEMP +1ms
  ttable  F[Dry], equation = humiditySensor < DESIRED_HUMIDITY +0ms
  ttable  matchedDecisions = [ [Function: CoolOn] ] +1ms
  ClimateController CoolOn() +0ms
  ClimateController    startCooler() +0ms
  ClimateController    stopHeater() +0ms
  ClimateController    stopHumidifier() +0ms
  ttable eval() inputs {"DESIRED_TEMP":70,"DESIRED_HUMIDITY":40,"tempSensor":10,"humiditySensor":10} +0ms
  ttable  T[Cold], equation = tempSensor < DESIRED_TEMP +0ms
  ttable  F[Hot], equation = tempSensor > DESIRED_TEMP +1ms
  ttable  T[Dry], equation = humiditySensor < DESIRED_HUMIDITY +0ms
  ttable  matchedDecisions = [ [Function: HeatOn], [Function: HumidOn] ] +0ms
  ClimateController HeatOn() +0ms
  ClimateController    startHeater() +0ms
  ClimateController    stopCooler() +0ms
  ClimateController    stopHumidifier() +0ms
  ClimateController HumidOn() +0ms
  ClimateController    startHumidifier() +0ms
```


[View specification table](https://htmlpreview.github.io/?https://github.com/vorachet/executable-truth-table/blob/master/examples/climate-controller_spec.html)

[View statistic table](https://htmlpreview.github.io/?https://github.com/vorachet/executable-truth-table/blob/master/examples/climate-controller_statistics.html)


# Smartcity Truth Table Example

![generated_spec](https://github.com/vorachet/executable-truth-table/blob/master/images/smartcity_concept.png)

```javascript
"use strict";

process.env.DEBUG = '*';

const debug = require('debug')('ClimateController');
const fs = require('fs')
const TTABLE = require('executable-truth-table');

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

```

Output

```bash
$ node smartcity
  ttable setCondition(mode=Disjunction/OR): { state: 'VETERAN', equation: 'isVeteran  > 0' } +0ms
  ttable setCondition(mode=Disjunction/OR): { state: 'POOR', equation: 'monthlyWage  <= 6000' } +5ms
  ttable setCondition(mode=Disjunction/OR): { state: 'MIDDLE_CLASS', equation: '(monthlyWage  > 6000)(monthlyWage < 15000)' } +2ms
  ttable setCondition(mode=Disjunction/OR): { state: 'UPPER_MIDDLE_CLASS', equation: 'monthlyWage  >= 15000' } +0ms
  ttable setDecision(mode=Disjunction/OR): FFFT run [ [Function: LifetimeFreeBusService] ] if VETERAN +3ms
  ttable setDecision(mode=Disjunction/OR): FFTF run [ [Function: DaytimeFreeBusService], [Function: FreeLunchSevice] ] if POOR +55ms
  ttable setDecision(mode=Disjunction/OR): FTFF run [ [Function: FiftyPercentDiscountBusServiceOnWeekend] ] if MIDDLE_CLASS +1ms
  ttable eval() inputs {"monthlyWage":5000,"isVeteran":1} +5ms
  ttable  T[VETERAN], equation = isVeteran  > 0 +84ms
  ttable  T[POOR], equation = monthlyWage  <= 6000 +7ms
  ttable  F[MIDDLE_CLASS], equation = (monthlyWage  > 6000)(monthlyWage < 15000) +9ms
  ttable  F[UPPER_MIDDLE_CLASS], equation = monthlyWage  >= 15000 +4ms
  ttable  matchedDecisions = [ [Function: LifetimeFreeBusService], [Function: DaytimeFreeBusService], [Function: FreeLunchSevice] ] +1ms
  ClimateController LifetimeFreeBusService() +0ms
  ClimateController DaytimeFreeBusService() +0ms
  ClimateController FreeLunchSevice() +0ms
  ttable eval() inputs {"monthlyWage":5000,"isVeteran":0} +0ms
  ttable  F[VETERAN], equation = isVeteran  > 0 +1ms
  ttable  T[POOR], equation = monthlyWage  <= 6000 +0ms
  ttable  F[MIDDLE_CLASS], equation = (monthlyWage  > 6000)(monthlyWage < 15000) +0ms
  ttable  F[UPPER_MIDDLE_CLASS], equation = monthlyWage  >= 15000 +1ms
  ttable  matchedDecisions = [ [Function: DaytimeFreeBusService], [Function: FreeLunchSevice] ] +0ms
  ClimateController DaytimeFreeBusService() +0ms
  ClimateController FreeLunchSevice() +0ms
  ttable eval() inputs {"monthlyWage":7000,"isVeteran":1} +1ms
  ttable  T[VETERAN], equation = isVeteran  > 0 +0ms
  ttable  F[POOR], equation = monthlyWage  <= 6000 +0ms
  ttable  T[MIDDLE_CLASS], equation = (monthlyWage  > 6000)(monthlyWage < 15000) +1ms
  ttable  F[UPPER_MIDDLE_CLASS], equation = monthlyWage  >= 15000 +0ms
  ttable  matchedDecisions = [ [Function: LifetimeFreeBusService], [Function: FiftyPercentDiscountBusServiceOnWeekend] ] +0ms
  ClimateController LifetimeFreeBusService() +1ms
  ClimateController FiftyPercentDiscountBusServiceOnWeekend() +0ms
  ttable eval() inputs {"monthlyWage":8000,"isVeteran":0} +0ms
  ttable  F[VETERAN], equation = isVeteran  > 0 +0ms
  ttable  F[POOR], equation = monthlyWage  <= 6000 +0ms
  ttable  T[MIDDLE_CLASS], equation = (monthlyWage  > 6000)(monthlyWage < 15000) +1ms
  ttable  F[UPPER_MIDDLE_CLASS], equation = monthlyWage  >= 15000 +0ms
  ttable  matchedDecisions = [ [Function: FiftyPercentDiscountBusServiceOnWeekend] ] +0ms
  ClimateController FiftyPercentDiscountBusServiceOnWeekend() +0ms
  ttable eval() inputs {"monthlyWage":15000,"isVeteran":0} +0ms
  ttable  F[VETERAN], equation = isVeteran  > 0 +0ms
  ttable  F[POOR], equation = monthlyWage  <= 6000 +1ms
  ttable  F[MIDDLE_CLASS], equation = (monthlyWage  > 6000)(monthlyWage < 15000) +0ms
  ttable  T[UPPER_MIDDLE_CLASS], equation = monthlyWage  >= 15000 +0ms
  ttable  matchedDecisions = undefined +0ms
  ttable eval() inputs {"monthlyWage":15000,"isVeteran":1} +1ms
  ttable  T[VETERAN], equation = isVeteran  > 0 +0ms
  ttable  F[POOR], equation = monthlyWage  <= 6000 +0ms
  ttable  F[MIDDLE_CLASS], equation = (monthlyWage  > 6000)(monthlyWage < 15000) +0ms
  ttable  T[UPPER_MIDDLE_CLASS], equation = monthlyWage  >= 15000 +0ms
  ttable  matchedDecisions = [ [Function: LifetimeFreeBusService] ] +1ms
  ClimateController LifetimeFreeBusService() +0ms
```

[View specification table](https://htmlpreview.github.io/?https://github.com/vorachet/executable-truth-table/blob/master/examples/smartcity_spec.html)

[View statistic table](https://htmlpreview.github.io/?https://github.com/vorachet/executable-truth-table/blob/master/examples/smartcity_statistics.html)


# Wired Truth Table Example

![generated_spec](https://github.com/vorachet/executable-truth-table/blob/master/images/wired_concept.png)


```javascript
"use strict";

process.env.DEBUG = '*';

const debug = require('debug')('wired')
const fs = require('fs')
const TTABLE = require('executable-truth-table')

const shoppingMallVisit = new TTABLE()
shoppingMallVisit.disjunctionMode()
shoppingMallVisit
  .setCondition({state: "VisitFirstTimet",             equation: "monthlyFacebooCheckin == 0"})
  .setCondition({state: "VisitSometime",               equation: "(monthlyFacebooCheckin > 0)(monthlyFacebooCheckin > 10)"})
  .setCondition({state: "VisitOften",                  equation: "monthlyFacebooCheckin >= 10"})
  .setCondition({state: "VisitedFoodCourtToday",       equation: "visitedFoodCourtToday >= 1"})
  .setCondition({state: "VisitedFashionStoreToday",    equation: "visitedFashionStoreToday >= 1"})
  .setCondition({state: "VisitedElectronicStoreToday", equation: "visitedElectronicStoreToday >= 1"})
  .setDecision({if: ["VisitFirstTimet"], run: [
    function SendWelcomeSMS (ttable) {
      if (ttable.type === 'vip') debug('SMS: Thank you for visiting our shoppingmall. Visit our mall next time get 2 Hours Free Parking')
      else debug('SMS: Thank you for visiting our shoppingmall')
    }]
  })
  .setDecision({if: ["VisitSometime"], run: [
    function SendMemershipInfoSMS (ttable) {
      if (ttable.type === 'vip') debug('SMS: You Got 2 Hours Free Parking Today')
      else debug('SMS: Shop $100 Get Free Membership. More Info @ 5th floor')
    }]
  })
  .setDecision({if: ["VisitOften"], run: [
    function SendPromotionSMS (ttable) {
      if (ttable.type === 'vip') debug('SMS: You Got 5 Hours Free Parking Today. Enjoy!')
      else debug('SMS: Discount Starbuck 10% Code 98VC23')
    }]
  })
  .setDecision({if: ["VisitedFoodCourtToday"], run: [
    function SendFoodCourtEventSMS (ttable) {
      if (ttable.type === 'vip') debug('SMS: Thank you for visiting our food court. You got free drink today. Code DR344')
      else debug('SMS: Thank you for visiting our food court')
    }]
  })
  .setDecision({if: ["VisitedFashionStoreToday"], run: [
    function SendFashionStoreEventSMS (ttable) {
      if (ttable.type === 'vip') debug('SMS: Thank you for visiting our shop. Redeem your 100 points for free shoes today')
      else debug('SMS: Thank you for visiting our shop. Clearance Shoes, Clothing, Accessories & More Next week!')
    }]
  })
  .setDecision({if: ["VisitedElectronicStoreToday"], run: [
    function SendElectronicStoreEventSMS (ttable) {
      if (ttable.type === 'vip') debug('SMS: Thank you for visiting our store. Discount iPhone 10% for VIP member')
      else debug('SMS: Thank you for visiting our store')
    }]
  })

const customerScreen = new TTABLE()
customerScreen.conjunctionMode()
customerScreen
  .setCondition({state: "Normal",   equation: "point < 100"})
  .setCondition({state: "VIP", equation: "point >= 100"})
  .setDecision({
    if: ["Normal"],
    run: [
      function NotifyEventSMS (ttable) {
        ttable.inputs.type = 'normal'
        shoppingMallVisit.eval(ttable.inputs)
      }]
  })
  .setDecision({
    if: ["VIP"],
    run: [
      function NotifyVIPEventSMS (ttable) {
        ttable.inputs.type = 'vip'
        shoppingMallVisit.eval(ttable.inputs)
      }]
  })

fs.writeFileSync(__dirname + '/wired_parent_spec.html', customerScreen.exportSpecAsHTML(),'utf-8')
fs.writeFileSync(__dirname + '/wired_child_spec.html', shoppingMallVisit.exportSpecAsHTML(),'utf-8')

customerScreen.eval({point: 50, monthlyFacebooCheckin: 0, visitedFoodCourtToday: 1, visitedFashionStoreToday: 0, visitedElectronicStoreToday: 0})
customerScreen.eval({point: 50, monthlyFacebooCheckin: 10, visitedFoodCourtToday: 1, visitedFashionStoreToday: 1, visitedElectronicStoreToday: 0})
customerScreen.eval({point: 50, monthlyFacebooCheckin: 30, visitedFoodCourtToday: 1, visitedFashionStoreToday: 2, visitedElectronicStoreToday: 0})
customerScreen.eval({point: 120, monthlyFacebooCheckin: 0, visitedFoodCourtToday: 1, visitedFashionStoreToday: 0, visitedElectronicStoreToday: 1})
customerScreen.eval({point: 120, monthlyFacebooCheckin: 6, visitedFoodCourtToday: 1, visitedFashionStoreToday: 1, visitedElectronicStoreToday: 1})
customerScreen.eval({point: 120, monthlyFacebooCheckin: 50, visitedFoodCourtToday: 1, visitedFashionStoreToday: 0, visitedElectronicStoreToday: 0})

fs.writeFileSync(__dirname + '/wired_parent_statistics.html', customerScreen.exportStatAsHTML(),'utf-8')
fs.writeFileSync(__dirname + '/wired_child_statistics.html', shoppingMallVisit.exportStatAsHTML(),'utf-8')

fs.writeFileSync(__dirname + '/wired_parent_statistics.json', JSON.stringify(customerScreen.statistics, null, 2), 'utf-8')
fs.writeFileSync(__dirname + '/wired_child_statistics.json', JSON.stringify(shoppingMallVisit.statistics, null, 2), 'utf-8')
```

Output

```bash
$ node wired
  ttable setCondition(mode=Disjunction/OR): { state: 'VisitFirstTimet', equation: 'monthlyFacebooCheckin == 0' } +0ms
  ttable setCondition(mode=Disjunction/OR): { state: 'VisitSometime', equation: '(monthlyFacebooCheckin > 0)(monthlyFacebooCheckin > 10)' } +5ms
  ttable setCondition(mode=Disjunction/OR): { state: 'VisitOften', equation: 'monthlyFacebooCheckin >= 10' } +2ms
  ttable setCondition(mode=Disjunction/OR): { state: 'VisitedFoodCourtToday', equation: 'visitedFoodCourtToday >= 1' } +0ms
  ttable setCondition(mode=Disjunction/OR): { state: 'VisitedFashionStoreToday', equation: 'visitedFashionStoreToday >= 1' } +0ms
  ttable setCondition(mode=Disjunction/OR): { state: 'VisitedElectronicStoreToday', equation: 'visitedElectronicStoreToday >= 1' } +0ms
  ttable setDecision(mode=Disjunction/OR): FFFFFT run [ [Function: WelcomeSMS] ] if VisitFirstTimet +2ms
  ttable setDecision(mode=Disjunction/OR): FFFFTF run [ [Function: WelcomeGoodCustomer] ] if VisitSometime +50ms
  ttable setDecision(mode=Disjunction/OR): FFFTFF run [ [Function: WelcomeBestCustomer] ] if VisitOften +1ms
  ttable setDecision(mode=Disjunction/OR): FFTFFF run [ [Function: IntroduceFoodCourtEvent] ] if VisitedFoodCourtToday +1ms
  ttable setDecision(mode=Disjunction/OR): FTFFFF run [ [Function: IntroduceFashionStoreEvent] ] if VisitedFashionStoreToday +2ms
  ttable setDecision(mode=Disjunction/OR): TFFFFF run [ [Function: IntroduceElectronicStoreEvent] ] if VisitedElectronicStoreToday +1ms
  ttable setCondition(mode=Conjunction/AND): { state: 'Normal', equation: 'point < 100' } +1ms
  ttable setCondition(mode=Conjunction/AND): { state: 'VIP', equation: 'point >= 100' } +0ms
  ttable setDecision(mode=Conjunction/AND): FT run [ [Function: NotifyEventSMS] ] if Normal +0ms
  ttable setDecision(mode=Conjunction/AND): TF run [ [Function: NotifyVIPEventSMS] ] if VIP +1ms
  ttable eval() inputs {"point":50,"monthlyFacebooCheckin":0,"visitedFoodCourtToday":1,"visitedFashionStoreToday":0,"visitedElectronicStoreToday":0} +7ms
  ttable  T[Normal], equation = point < 100 +88ms
  ttable  F[VIP], equation = point >= 100 +8ms
  ttable  matchedDecisions = [ [Function: NotifyEventSMS] ] +0ms
  ttable eval() inputs {"point":50,"monthlyFacebooCheckin":0,"visitedFoodCourtToday":1,"visitedFashionStoreToday":0,"visitedElectronicStoreToday":0,"type":"normal"} +1ms
  ttable  T[VisitFirstTimet], equation = monthlyFacebooCheckin == 0 +3ms
  ttable  F[VisitSometime], equation = (monthlyFacebooCheckin > 0)(monthlyFacebooCheckin > 10) +7ms
  ttable  F[VisitOften], equation = monthlyFacebooCheckin >= 10 +0ms
  ttable  T[VisitedFoodCourtToday], equation = visitedFoodCourtToday >= 1 +1ms
  ttable  F[VisitedFashionStoreToday], equation = visitedFashionStoreToday >= 1 +0ms
  ttable  F[VisitedElectronicStoreToday], equation = visitedElectronicStoreToday >= 1 +0ms
  ttable  matchedDecisions = [ [Function: WelcomeSMS], [Function: IntroduceFoodCourtEvent] ] +0ms
  wired SMS: Thank you for visiting our shoppingmall +1ms
  wired SMS: Thank you for visiting our food court +0ms
  ttable eval() inputs {"point":50,"monthlyFacebooCheckin":10,"visitedFoodCourtToday":1,"visitedFashionStoreToday":1,"visitedElectronicStoreToday":0} +0ms
  ttable  T[Normal], equation = point < 100 +0ms
  ttable  F[VIP], equation = point >= 100 +1ms
  ttable  matchedDecisions = [ [Function: NotifyEventSMS] ] +0ms
  ttable eval() inputs {"point":50,"monthlyFacebooCheckin":10,"visitedFoodCourtToday":1,"visitedFashionStoreToday":1,"visitedElectronicStoreToday":0,"type":"normal"} +0ms
  ttable  F[VisitFirstTimet], equation = monthlyFacebooCheckin == 0 +0ms
  ttable  F[VisitSometime], equation = (monthlyFacebooCheckin > 0)(monthlyFacebooCheckin > 10) +1ms
  ttable  T[VisitOften], equation = monthlyFacebooCheckin >= 10 +0ms
  ttable  T[VisitedFoodCourtToday], equation = visitedFoodCourtToday >= 1 +0ms
  ttable  T[VisitedFashionStoreToday], equation = visitedFashionStoreToday >= 1 +0ms
  ttable  F[VisitedElectronicStoreToday], equation = visitedElectronicStoreToday >= 1 +0ms
  ttable  matchedDecisions = [ [Function: WelcomeBestCustomer], [Function: IntroduceFoodCourtEvent], [Function: IntroduceFashionStoreEvent] ] +1ms
  wired SMS: Discount Starbuck 10% Code 98VC23 +0ms
  wired SMS: Thank you for visiting our food court +0ms
  wired SMS: Thank you for visiting our shop. Clearance Shoes, Clothing, Accessories & More Next week! +0ms
  ttable eval() inputs {"point":50,"monthlyFacebooCheckin":30,"visitedFoodCourtToday":1,"visitedFashionStoreToday":2,"visitedElectronicStoreToday":0} +0ms
  ttable  T[Normal], equation = point < 100 +0ms
  ttable  F[VIP], equation = point >= 100 +1ms
  ttable  matchedDecisions = [ [Function: NotifyEventSMS] ] +0ms
  ttable eval() inputs {"point":50,"monthlyFacebooCheckin":30,"visitedFoodCourtToday":1,"visitedFashionStoreToday":2,"visitedElectronicStoreToday":0,"type":"normal"} +0ms
  ttable  F[VisitFirstTimet], equation = monthlyFacebooCheckin == 0 +0ms
  ttable  T[VisitSometime], equation = (monthlyFacebooCheckin > 0)(monthlyFacebooCheckin > 10) +1ms
  ttable  T[VisitOften], equation = monthlyFacebooCheckin >= 10 +0ms
  ttable  T[VisitedFoodCourtToday], equation = visitedFoodCourtToday >= 1 +0ms
  ttable  T[VisitedFashionStoreToday], equation = visitedFashionStoreToday >= 1 +1ms
  ttable  F[VisitedElectronicStoreToday], equation = visitedElectronicStoreToday >= 1 +0ms
  ttable  matchedDecisions = [ [Function: WelcomeGoodCustomer], [Function: WelcomeBestCustomer], [Function: IntroduceFoodCourtEvent], [Function: IntroduceFashionStoreEvent] ] +0ms
  wired SMS: Shop $100 Get Free Membership. More Info @ 5th floor +0ms
  wired SMS: Discount Starbuck 10% Code 98VC23 +0ms
  wired SMS: Thank you for visiting our food court +0ms
  wired SMS: Thank you for visiting our shop. Clearance Shoes, Clothing, Accessories & More Next week! +1ms
  ttable eval() inputs {"point":120,"monthlyFacebooCheckin":0,"visitedFoodCourtToday":1,"visitedFashionStoreToday":0,"visitedElectronicStoreToday":1} +0ms
  ttable  F[Normal], equation = point < 100 +0ms
  ttable  T[VIP], equation = point >= 100 +0ms
  ttable  matchedDecisions = [ [Function: NotifyVIPEventSMS] ] +0ms
  ttable eval() inputs {"point":120,"monthlyFacebooCheckin":0,"visitedFoodCourtToday":1,"visitedFashionStoreToday":0,"visitedElectronicStoreToday":1,"type":"vip"} +1ms
  ttable  T[VisitFirstTimet], equation = monthlyFacebooCheckin == 0 +0ms
  ttable  F[VisitSometime], equation = (monthlyFacebooCheckin > 0)(monthlyFacebooCheckin > 10) +0ms
  ttable  F[VisitOften], equation = monthlyFacebooCheckin >= 10 +1ms
  ttable  T[VisitedFoodCourtToday], equation = visitedFoodCourtToday >= 1 +0ms
  ttable  F[VisitedFashionStoreToday], equation = visitedFashionStoreToday >= 1 +0ms
  ttable  T[VisitedElectronicStoreToday], equation = visitedElectronicStoreToday >= 1 +0ms
  ttable  matchedDecisions = [ [Function: WelcomeSMS], [Function: IntroduceFoodCourtEvent], [Function: IntroduceElectronicStoreEvent] ] +0ms
  wired SMS: Thank you for visiting our shoppingmall +0ms
  wired SMS: Thank you for visiting our food court +1ms
  wired SMS: Thank you for visiting our store +0ms
  ttable eval() inputs {"point":120,"monthlyFacebooCheckin":6,"visitedFoodCourtToday":1,"visitedFashionStoreToday":1,"visitedElectronicStoreToday":1} +0ms
  ttable  F[Normal], equation = point < 100 +0ms
  ttable  T[VIP], equation = point >= 100 +1ms
  ttable  matchedDecisions = [ [Function: NotifyVIPEventSMS] ] +0ms
  ttable eval() inputs {"point":120,"monthlyFacebooCheckin":6,"visitedFoodCourtToday":1,"visitedFashionStoreToday":1,"visitedElectronicStoreToday":1,"type":"vip"} +0ms
  ttable  F[VisitFirstTimet], equation = monthlyFacebooCheckin == 0 +0ms
  ttable  F[VisitSometime], equation = (monthlyFacebooCheckin > 0)(monthlyFacebooCheckin > 10) +1ms
  ttable  F[VisitOften], equation = monthlyFacebooCheckin >= 10 +0ms
  ttable  T[VisitedFoodCourtToday], equation = visitedFoodCourtToday >= 1 +0ms
  ttable  T[VisitedFashionStoreToday], equation = visitedFashionStoreToday >= 1 +0ms
  ttable  T[VisitedElectronicStoreToday], equation = visitedElectronicStoreToday >= 1 +0ms
  ttable  matchedDecisions = [ [Function: IntroduceFoodCourtEvent], [Function: IntroduceFashionStoreEvent], [Function: IntroduceElectronicStoreEvent] ] +0ms
  wired SMS: Thank you for visiting our food court +1ms
  wired SMS: Thank you for visiting our shop. Clearance Shoes, Clothing, Accessories & More Next week! +0ms
  wired SMS: Thank you for visiting our store +0ms
  ttable eval() inputs {"point":120,"monthlyFacebooCheckin":50,"visitedFoodCourtToday":1,"visitedFashionStoreToday":0,"visitedElectronicStoreToday":0} +0ms
  ttable  F[Normal], equation = point < 100 +0ms
  ttable  T[VIP], equation = point >= 100 +0ms
  ttable  matchedDecisions = [ [Function: NotifyVIPEventSMS] ] +0ms
  ttable eval() inputs {"point":120,"monthlyFacebooCheckin":50,"visitedFoodCourtToday":1,"visitedFashionStoreToday":0,"visitedElectronicStoreToday":0,"type":"vip"} +0ms
  ttable  F[VisitFirstTimet], equation = monthlyFacebooCheckin == 0 +1ms
  ttable  T[VisitSometime], equation = (monthlyFacebooCheckin > 0)(monthlyFacebooCheckin > 10) +0ms
  ttable  T[VisitOften], equation = monthlyFacebooCheckin >= 10 +0ms
  ttable  T[VisitedFoodCourtToday], equation = visitedFoodCourtToday >= 1 +1ms
  ttable  F[VisitedFashionStoreToday], equation = visitedFashionStoreToday >= 1 +0ms
  ttable  F[VisitedElectronicStoreToday], equation = visitedElectronicStoreToday >= 1 +0ms
  ttable  matchedDecisions = [ [Function: WelcomeGoodCustomer], [Function: WelcomeBestCustomer], [Function: IntroduceFoodCourtEvent] ] +0ms
  wired SMS: Shop $100 Get Free Membership. More Info @ 5th floor +0ms
  wired SMS: Discount Starbuck 10% Code 98VC23 +0ms
  wired SMS: Thank you for visiting our food court +0ms
```
[View parent specification table](https://htmlpreview.github.io/?https://github.com/vorachet/executable-truth-table/blob/master/examples/wired_parent_spec.html)

[View child specification table](https://htmlpreview.github.io/?https://github.com/vorachet/executable-truth-table/blob/master/examples/wired_child_spec.html)

[View parent statistic table](https://htmlpreview.github.io/?https://github.com/vorachet/executable-truth-table/blob/master/examples/wired_parent_statistics.html)

[View child statistic table](https://htmlpreview.github.io/?https://github.com/vorachet/executable-truth-table/blob/master/examples/wired_child_statistics.html)