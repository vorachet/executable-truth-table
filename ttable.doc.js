'use strict'

const _ = require('lodash')
const DEFAULT_HTML_TABLE_PROPS = 'BORDER=1 CELLSPACING=0 CELLPADDING=5'

function printBinaryColumnHeader (dimension) {
  const rows = Math.pow(2, dimension)
  let text = ''
  for (let i = 0; i < rows;) {
    text += `<th align="center"><small>Decision ${i + 1}</small></th>`
    i += 1
  }
  return text
}

function printBinaryColumn (dimension, row) {
  const rows = Math.pow(2, dimension)
  const offset = Math.pow(2, row)
  let countOffet = 0
  let bit = false
  let text = ''
  for (let i = 0; i < rows;) {
    if (countOffet === offset) {
      countOffet = 1
      bit = !bit
    } else countOffet += 1
    text += `<td align="center">${bit ? 'T' : 'F'}</td>`
    i += 1
  }
  return text
}

function printActionsMap (decisions, dimension) {
  const rows = Math.pow(2, dimension)
  const inputs = {
    0: 'F',
    1: 'T'
  }
  let text = ''
  for (let i = 0; i < rows;) {
    let bitString = padZero(Number(i).toString(2), dimension, '0')
    const re = new RegExp(Object.keys(inputs).join('|'), 'gi')
    bitString = bitString.replace(re, matched => inputs[matched])
    const ckeys = bitString.split('')
    bitString = ckeys.join('')
    const col = decisions[bitString]
      ? `<td align="center"><strong>${_.map(decisions[bitString], act => `${act.name}()<br>`).join('')}</strong></td>`
      : '<td align="center">-</td>'
    text += col
    i += 1
  }
  return text
}

function padZero (n, dimension, join) {
  return n.length >= dimension ? n : new Array((dimension - n.length) + 1).join(join) + n
}

module.exports = {
  exportSpecAsHTML: function (mode, conditions, decisions, tableCSSClass) {
    let prop = tableCSSClass ? '' : DEFAULT_HTML_TABLE_PROPS
    let html = ''
    html += `<table ${prop} style="white-space:nowrap;" class="${tableCSSClass}">`
    html += `<thead><tr><th align="center">CONDITION</th><th align="center">STATE</th>${
              printBinaryColumnHeader(conditions.length)}</tr></thead>`
    html += '<tbody>'
    html += _.map(conditions, (equation, index) => `${'<tr>' +
                      '<td align="center">'}${equation.equation}</td>` +
                      `<td align="center">${equation.state}</td>${
                      printBinaryColumn(conditions.length, index)
                  }</tr>`).join('')

    html += `<tr><td align="center">Truth Table Mode = ${mode}</td><td></td>${printActionsMap(decisions, conditions.length)}</tr>`
    html += '</tbody>'
    html += '</table>'
    return html
  },
  exportStatAsHTML: function (mode, statistics, tableCSSClass) {
    let prop = tableCSSClass ? '' : DEFAULT_HTML_TABLE_PROPS
    let html = ''
    html += `<table ${prop} style="white-space:nowrap;" class="${tableCSSClass}">`
    html += `<thead><tr>`
    html += `<th>PERFORMED INPUTS</th>`
    html += `<th>MATCHED STATES</th>`
    html += `<th>PERFORMED DECISIONS</th>`
    html += `</tr></thead>`
    html += '<tbody>'
    html += _.map(statistics.performed, (record, index) =>
          `<tr>` +
            `<td>${_.map(record.inputs, (v, k) => `${k} = ${v}`).join('<br>')}</td>` +
            `<td>${_.map(record.matchedStates, (state) => `${state}`).join('<br>')}</td>` +
            `<td>${_.map(record.performedDecisions, (act) => '<b>' + act + '()</b>').join('<br>')}</td>` +
          `</tr>`
        ).join('')
    html += '</tbody>'
    html += '</table>'
    return html
  },
  padZero: function (n, dimension, join) {
    return padZero(n, dimension, join)
  }
}
