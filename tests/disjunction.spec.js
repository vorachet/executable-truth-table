'use strict'

const TTABLE = require('../ttable')
const expect = require('chai').expect

describe('TTABLE', () => {
  describe('"disjunction"', () => {

    it('disjunction', (done) => {
        function F1(ttable) {
            done('must not call F1')
        }

        function F2(ttable) {
            if (!ttable) done('ttable not found in decision function')
        }

        function F3(ttable) {
            done()
        }

        const ttable = new TTABLE()
        ttable.disjunctionMode()
        ttable
            .setCondition({state: "S1", equation: "dis <= 0"})
            .setCondition({state: "S2", equation: "dis > 0"})
            .setCondition({state: "S3", equation: "dis > 1"})
            .setDecision({run: [F1], if: ["S1"]})
            .setDecision({run: [F2], if: ["S2"]})
            .setDecision({run: [F3], if: ["S3"]})

        ttable.eval({dis: 2})
    })

  })
})