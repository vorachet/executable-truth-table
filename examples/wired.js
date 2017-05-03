"use strict";

process.env.DEBUG = '*';

const debug = require('debug')('wired')
const fs = require('fs')
const TTABLE = require('../ttable')

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
    function WelcomeSMS (ttable) {
      if (ttable.type === 'vip') debug('SMS: Thank you for visiting our shoppingmall. Visit our mall next time get 2 Hours Free Parking')
      else debug('SMS: Thank you for visiting our shoppingmall')
    }]
  })
  .setDecision({if: ["VisitSometime"], run: [
    function WelcomeGoodCustomer (ttable) {
      if (ttable.type === 'vip') debug('SMS: You Got 2 Hours Free Parking Today')
      else debug('SMS: Shop $100 Get Free Membership. More Info @ 5th floor')
    }]
  })
  .setDecision({if: ["VisitOften"], run: [
    function WelcomeBestCustomer (ttable) {
      if (ttable.type === 'vip') debug('SMS: You Got 5 Hours Free Parking Today. Enjoy!')
      else debug('SMS: Discount Starbuck 10% Code 98VC23')
    }]
  })
  .setDecision({if: ["VisitedFoodCourtToday"], run: [
    function IntroduceFoodCourtEvent (ttable) {
      if (ttable.type === 'vip') debug('SMS: Thank you for visiting our food court. You got free drink today. Code DR344')
      else debug('SMS: Thank you for visiting our food court')
    }]
  })
  .setDecision({if: ["VisitedFashionStoreToday"], run: [
    function IntroduceFashionStoreEvent (ttable) {
      if (ttable.type === 'vip') debug('SMS: Thank you for visiting our shop. Redeem your 100 points for free shoes today')
      else debug('SMS: Thank you for visiting our shop. Clearance Shoes, Clothing, Accessories & More Next week!')
    }]
  })
  .setDecision({if: ["VisitedElectronicStoreToday"], run: [
    function IntroduceElectronicStoreEvent (ttable) {
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
