'use strict'

const TTABLE = require('../ttable')
const expect = require('chai').expect

describe('TTABLE', () => {
  describe('"creation of instance "', () => {

    it('should export a object', () => {
        const ttable = new TTABLE()
        expect(ttable).to.be.a('object')
    })

  })
})