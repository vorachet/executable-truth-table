# Executable Truth Table for Node.js (TTABLE)

You can use TTABLE to model I/O behavior and function of a Node.js software using Truth Table technique. TTABLE provides built-in Truth Table specification and runtime statistic data generator. You can generate the documents anytime from the TTABLE objects that used to develop your software  check that everything in your definition of program conditions, states and decision are covered and

TTABLE makes the defition of conditions, states, and decisions more easily by providing felxible methods to define states and callback functions for decision.


# Climate Controoler Truth Table Example


```javascript
"use strict";

const TTABLE = require('executable-truth-table')
const ttable = new TTABLE()

// Actions for
function startCooler() { debug('\t startCooler()') }
function stopCooler() { debug('\t stopCooler()') }
function startHumidifier() { debug('\t startHumidifier()') }
function stopHumidifier() { debug('\t stopHumidifier()') }
function startHeater() { debug('\t startHeater()') }
function stopHeater() { debug('\t stopHeater()') }

// Defition of callback functions for each decision
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

// Creating TTABLE object
const ttable = new TTABLE()

// Defining conditions and decisions
ttable
    .setCondition({state: "Hot", equation: "tempSensor > DESIRED_TEMP"})
    .setCondition({state: "Dry", equation: "humiditySensor < DESIRED_HUMIDITY"})
    .setDecision({run: [HeatOn],          if: [{state: "Dry", is: true}, {state: "Hot", is: false}]})
    .setDecision({run: [HumidOn, CoolOn], if: [{state: "Dry", is: true}, {state: "Hot", is: true}]})
    .setDecision({run: [CoolOn],          if: [{state: "Hot", is: true}, {state: "Dry", is: false}]})
    .setDecision({run: [HeatOn, HumidOn], if: [{state: "Hot", is: false}, {state: "Dry", is: false}]})

// Evaluating result from the given inputs

ttable.read({DESIRED_TEMP: 70, DESIRED_HUMIDITY: 40, tempSensor: 40, humiditySensor: 80 })
ttable.read({DESIRED_TEMP: 70, DESIRED_HUMIDITY: 40, tempSensor: 80, humiditySensor: 20})
ttable.read({DESIRED_TEMP: 70, DESIRED_HUMIDITY: 40, tempSensor: 100, humiditySensor: 50})
ttable.read({DESIRED_TEMP: 70, DESIRED_HUMIDITY: 40, tempSensor: 10, humiditySensor: 10})


```

## Generating TruthTable specification


```javascript
ttable.exportSpecAsHTML()
```

![generated_spec](https://github.com/vorachet/executable-truth-table/blob/master/images/generated_spec.png)

[View example specification table](https://htmlpreview.github.io/?https://github.com/vorachet/executable-truth-table/blob/master/examples/climate-controller_spec.html)


## Generating TruthTable statistic

```javascript
ttable.exportStatAsHTML()
```

![generated_statistic](https://github.com/vorachet/executable-truth-table/blob/master/images/generated_statistic.png)

[View example statistic table](https://htmlpreview.github.io/?https://github.com/vorachet/executable-truth-table/blob/master/examples/climate-controller_statistics.html)