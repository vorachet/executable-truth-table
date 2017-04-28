# Executable Truth Table for Node.js (TTABLE)

You can use TTABLE to model I/O behavior and function of a Node.js software using Truth Table technique. TTABLE provides built-in Truth Table specification and runtime statistic data generator. You can generate the documents anytime from the TTABLE objects that used to develop your software  check that everything in your definition of program conditions, states and decision are covered and

TTABLE makes the defition of conditions, states, and decisions more easily by providing felxible methods to define states and callback functions for decision.


# Climate Controller Truth Table Example


```javascript
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
ttable
    .setCondition({state: "Hot", equation: "tempSensor > DESIRED_TEMP"})
    .setCondition({state: "Dry", equation: "humiditySensor < DESIRED_HUMIDITY"})
    .setDecision({run: [HeatOn],          if: [{state: "Dry", is: true}, {state: "Hot", is: false}]})
    .setDecision({run: [HumidOn, CoolOn], if: [{state: "Dry", is: true}, {state: "Hot", is: true}]})
    .setDecision({run: [CoolOn],          if: [{state: "Hot", is: true}, {state: "Dry", is: false}]})
    .setDecision({run: [HeatOn, HumidOn], if: [{state: "Hot", is: false}, {state: "Dry", is: false}]})

fs.writeFileSync(__dirname + '/climate-controller_spec.html', ttable.exportSpecAsHTML(), 'utf-8')

ttable.read({DESIRED_TEMP: 70, DESIRED_HUMIDITY: 40, tempSensor: 40, humiditySensor: 80 })
ttable.read({DESIRED_TEMP: 70, DESIRED_HUMIDITY: 40, tempSensor: 80, humiditySensor: 20})
ttable.read({DESIRED_TEMP: 70, DESIRED_HUMIDITY: 40, tempSensor: 100, humiditySensor: 50})
ttable.read({DESIRED_TEMP: 70, DESIRED_HUMIDITY: 40, tempSensor: 10, humiditySensor: 10})

fs.writeFileSync(__dirname + '/climate-controller_statistics.html', ttable.exportStatAsHTML(), 'utf-8')
fs.writeFileSync(__dirname + '/climate-controller_statistics.json', JSON.stringify(ttable.statistics, null, 2), 'utf-8')


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


## Exporting TruthTable statistic data

```javascript
console.log(ttable.statistics)
```

Output

```javacript
{
  "decisions": [
    {
      "decisions": [
        "HeatOn()"
      ],
      "if": [
        {
          "state": "Dry",
          "is": true
        },
        {
          "state": "Hot",
          "is": false
        }
      ]
    },
    {
      "decisions": [
        "HumidOn()",
        "CoolOn()"
      ],
      "if": [
        {
          "state": "Dry",
          "is": true
        },
        {
          "state": "Hot",
          "is": true
        }
      ]
    },
    {
      "decisions": [
        "CoolOn()"
      ],
      "if": [
        {
          "state": "Hot",
          "is": true
        },
        {
          "state": "Dry",
          "is": false
        }
      ]
    },
    {
      "decisions": [
        "HeatOn()",
        "HumidOn()"
      ],
      "if": [
        {
          "state": "Hot",
          "is": false
        },
        {
          "state": "Dry",
          "is": false
        }
      ]
    }
  ],
  "conditions": [
    {
      "state": "Hot",
      "equation": "tempSensor > DESIRED_TEMP"
    },
    {
      "state": "Dry",
      "equation": "humiditySensor < DESIRED_HUMIDITY"
    }
  ],
  "performed": [
    {
      "inputs": {
        "DESIRED_TEMP": 70,
        "DESIRED_HUMIDITY": 40,
        "tempSensor": 40,
        "humiditySensor": 80
      },
      "performedOn": "2017-04-28T15:16:02.969Z",
      "performedDecisions": [
        "HeatOn()",
        "HumidOn()"
      ],
      "eval": "FF",
      "states": [
        "Hot (F)",
        "Dry (F)"
      ]
    },
    {
      "inputs": {
        "DESIRED_TEMP": 70,
        "DESIRED_HUMIDITY": 40,
        "tempSensor": 80,
        "humiditySensor": 20
      },
      "performedOn": "2017-04-28T15:16:03.105Z",
      "performedDecisions": [
        "HumidOn()",
        "CoolOn()"
      ],
      "eval": "TT",
      "states": [
        "Hot (T)",
        "Dry (T)"
      ]
    },
    {
      "inputs": {
        "DESIRED_TEMP": 70,
        "DESIRED_HUMIDITY": 40,
        "tempSensor": 100,
        "humiditySensor": 50
      },
      "performedOn": "2017-04-28T15:16:03.114Z",
      "performedDecisions": [
        "CoolOn()"
      ],
      "eval": "FT",
      "states": [
        "Hot (T)",
        "Dry (F)"
      ]
    },
    {
      "inputs": {
        "DESIRED_TEMP": 70,
        "DESIRED_HUMIDITY": 40,
        "tempSensor": 10,
        "humiditySensor": 10
      },
      "performedOn": "2017-04-28T15:16:03.116Z",
      "performedDecisions": [
        "HeatOn()"
      ],
      "eval": "TF",
      "states": [
        "Hot (F)",
        "Dry (T)"
      ]
    }
  ]
}
```
# Other examples

## Colors Truth Table Example

```javascript
"use strict"

process.env.DEBUG = '*'

const debug = require('debug')('Simple')
const fs = require('fs')
const TTABLE = require('../ttable')

function YELLOW()  { debug('YELLOW()'  )}
function CYAN()    { debug('CYAN()'    )}
function MAGENTA() { debug('MAGENTA()' )}
function WHITE()   { debug('WHITE()'   )}
function RED()     { debug('RED()'     )}
function GREEN()   { debug('GREEN()'   )}
function BLUE()    { debug('BLUE()'    )}
function BLACK()   { debug('BLACK()'   )}

const ttable = new TTABLE()
ttable
  .setCondition({state: "YELLOW",  equation: "(r==1)(g==1)(b==0)"})
  .setCondition({state: "CYAN",    equation: "(r==0)(g==1)(b==1)"})
  .setCondition({state: "MAGENTA", equation: "(r==1)(g==0)(b==1)"})
  .setCondition({state: "WHITE",   equation: "(r==1)(g==1)(b==1)"})
  .setCondition({state: "RED",     equation: "(r==1)(g==0)(b==0)"})
  .setCondition({state: "GREEN",   equation: "(r==0)(g==1)(b==0)"})
  .setCondition({state: "BLUE",    equation: "(r==0)(g==0)(b==1)"})
  .setCondition({state: "BLACK",   equation: "(r==0)(g==0)(b==0)"})
  .setDecision({run: [YELLOW],  if: [{state: "YELLOW",    is: true}]})
  .setDecision({run: [CYAN],    if: [{state: "CYAN",    is: true}]})
  .setDecision({run: [MAGENTA], if: [{state: "MAGENTA",    is: true}]})
  .setDecision({run: [RED],     if: [{state: "RED",    is: true}]})
  .setDecision({run: [GREEN],   if: [{state: "GREEN",    is: true}]})
  .setDecision({run: [BLUE],    if: [{state: "BLUE",    is: true}]})
  .setDecision({run: [BLACK],   if: [{state: "BLACK",    is: true}]})
  .setDecision({run: [WHITE],   if: [{state: "WHITE",    is: true}]})

fs.writeFileSync(__dirname + '/colors_spec.html', ttable.exportSpecAsHTML(), 'utf-8');
function random () { return Math.floor(Math.random() * 2) }

for (let i = 0; i < 50; i++) {
  ttable.read({r: random(), g: random(), b: random()});
}

fs.writeFileSync(__dirname + '/colors_statistics.html', ttable.exportStatAsHTML(), 'utf-8');
fs.writeFileSync(__dirname + '/colors_statistics.json', JSON.stringify(ttable.statistics, null, 2), 'utf-8')

```

## Wired Truth Table Example


```javascript
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
```