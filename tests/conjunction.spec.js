'use strict'

const TTABLE = require('../ttable')
const expect = require('chai').expect

describe('TTABLE', () => {
  describe('"conjunction"', () => {

    it('conjunction', (done) => {
        function F1(ttable) {
            done('must not call F1')
        }

        function F2(ttable) {
            done('must not call F2')
        }

        function F3(ttable) {
            done('must not call F3')
        }

        const ttable = new TTABLE()
        ttable.conjunctionMode()
        ttable
            .setCondition({state: "S1", equation: "con <= 0"})
            .setCondition({state: "S2", equation: "con > 0"})
            .setCondition({state: "S3", equation: "con > 1"})
            .setDecision({run: [F1], if: ["S1"]})
            .setDecision({run: [F2], if: ["S2"]})
            .setDecision({run: [F3], if: ["S3"]})

        const options = {}
        function callback() {

        }
        function unmatchCallback() {
            done()
        }
        ttable.eval({con: 2}, options, callback, unmatchCallback)
    })



  })
})