'use strict'

const TTABLE = require('../ttable')
const expect = require('chai').expect

describe('TTABLE', () => {
  describe('"decision parameters validation"', () => {

    it('should throw "decision input cannot be null" when call setDecision() with null', () => {
        const ttable = new TTABLE()
        expect(function (){
            ttable.setDecision()
        }).to.throw('decision input cannot be null')
    })

    it('should throw "decision must be object" when call setDecision() with number', () => {
        const ttable = new TTABLE()
        expect(function (){
            ttable.setDecision(1)
        }).to.throw('decision must be object')
    })

    it('should throw "decision must be object" when call setDecision() with string', () => {
        const ttable = new TTABLE()
        expect(function (){
            ttable.setDecision('a')
        }).to.throw('decision must be object')
    })

    it('should throw "decision.run must be array" when give non-array', () => {
        const ttable = new TTABLE()
        expect(function (){
            ttable.setDecision({})
        }).to.throw('decision.run must be array')
    })

    it('should throw "decision.run must be array" when have given run attribute as empty array', () => {
        const ttable = new TTABLE()
        expect(function (){
            ttable.setDecision({run: []})
        }).to.throw('decision.run cannot be empty array')
    })

    it('should throw "decision.if must be array" when missing if attribute', () => {
        const ttable = new TTABLE()
        expect(function (){
            ttable.setDecision({run: [function () {}]})
        }).to.throw('decision.if must be array')
    })

    it('should throw "decision.if must be array" when give if attribute as string', () => {
        const ttable = new TTABLE()
        expect(function (){
            ttable.setDecision({run: [function () {}], if: 'if'})
        }).to.throw('decision.if must be array')
    })

  })
})