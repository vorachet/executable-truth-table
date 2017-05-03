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
ttable.conjunctionMode()
ttable
  .setCondition({state: "YELLOW",  equation: "(r==1)(g==1)(b==0)"})
  .setCondition({state: "CYAN",    equation: "(r==0)(g==1)(b==1)"})
  .setCondition({state: "MAGENTA", equation: "(r==1)(g==0)(b==1)"})
  .setCondition({state: "WHITE",   equation: "(r==1)(g==1)(b==1)"})
  .setCondition({state: "RED",     equation: "(r==1)(g==0)(b==0)"})
  .setCondition({state: "GREEN",   equation: "(r==0)(g==1)(b==0)"})
  .setCondition({state: "BLUE",    equation: "(r==0)(g==0)(b==1)"})
  .setCondition({state: "BLACK",   equation: "(r==0)(g==0)(b==0)"})
  .setDecision({run: [YELLOW],  if: ["YELLOW"]})
  .setDecision({run: [CYAN],    if: ["CYAN"]})
  .setDecision({run: [MAGENTA], if: ["MAGENTA"]})
  .setDecision({run: [RED],     if: ["RED"]})
  .setDecision({run: [GREEN],   if: ["GREEN"]})
  .setDecision({run: [BLUE],    if: ["BLUE"]})
  .setDecision({run: [BLACK],   if: ["BLACK"]})
  .setDecision({run: [WHITE],   if: ["WHITE"]})

fs.writeFileSync(__dirname + '/colors_spec.html', ttable.exportSpecAsHTML(), 'utf-8');

function random () { return Math.floor(Math.random() * 2) }

for (let i = 0; i < 10; i++) {
  ttable.eval({r: random(), g: random(), b: random()});
}

fs.writeFileSync(__dirname + '/colors_statistics.html', ttable.exportStatAsHTML(), 'utf-8');

fs.writeFileSync(__dirname + '/colors_statistics.json', JSON.stringify(ttable.statistics, null, 2), 'utf-8')
