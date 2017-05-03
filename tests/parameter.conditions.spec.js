'use strict'

const TTABLE = require('../ttable')
const expect = require('chai').expect

describe('TTABLE', () => {
  describe('"condition parameters validation"', () => {

    it('should throw "condition must be object" when call setCondition() with number', () => {
        const ttable = new TTABLE()
        expect(function (){
            ttable.setCondition(1)
        }).to.throw('condition must be object')
    })

    it('should throw "condition must be object" when call setCondition() with string', () => {
        const ttable = new TTABLE()
        expect(function (){
            ttable.setCondition('a')
        }).to.throw('condition must be object')
    })

    it('should throw "condition input cannot be null" when call setCondition() without input', () => {
        const ttable = new TTABLE()
        expect(function (){
            ttable.setCondition()
        }).to.throw('condition input cannot be null')
    })

    it('should throw "condition.state cannot be null" when missing both state and equation attributes', () => {
        const ttable = new TTABLE()
        expect(function (){
            ttable.setCondition({})
        }).to.throw('condition.state cannot be null')
    })

    it('should throw "condition.equation cannot be null" when have only state attribute', () => {
        const ttable = new TTABLE()
        expect(function (){
            ttable.setCondition({state: 'aState'})
        }).to.throw('condition.equation cannot be null')
    })

    it('should throw "condition.state cannot be null" when have only equation attribute', () => {
        const ttable = new TTABLE()
        expect(function (){
            ttable.setCondition({equation: 'a < 10'})
        }).to.throw('condition.state cannot be null')
    })

    it('should contain 1 array in conditions after successfully added one', () => {
        const ttable = new TTABLE()
        ttable.setCondition({state: 'aState', equation: 'a < 10'})
        expect(ttable.statistics.conditions.length).to.eql(1)
    })

    it('should store condition consistently', () => {
        const ttable = new TTABLE()
        const testCondition = {state: 'aState', equation: 'a < 10'}
        ttable.setCondition({state: 'aState', equation: 'a < 10'})
        expect(ttable.statistics.conditions[0]).to.eql(testCondition)
    })

  })
})