'use strict'

const events = require('../modules/events')

describe('Events Module', function() {

	describe('Get Events for Town and Date Function', function() {

		it('should give us an array of event objects for nearby events on given date', function(done) {
			events.getFor('Coventry', new Date(2016, 12, 10, 0, 0))
			.then(events => {
				expect(events[0].name).toBe('B2B Expo 2017: 10th January 2017')
				done()
			})
			.catch(err => {
				console.log(err)
				expect(true).toBe(false)
				done()
			})
		})

		it('should return an empty array of events', function(done) {
			events.getFor('Coventry', new Date(2040, 1, 1, 0, 0))
			.then(events => {
				expect(events.length).toBe(0)
				done()
			})
			.catch(err => {
				console.log(err)
				expect(true).toBe(false)
				done()
			})
		})

		it('should throw an error due to invalid location', function(done) {
			events.getFor('NotaTown', new Date(2040, 1, 1, 0, 0))
			.then(events => {
				console.log(events)
				expect(true).toBe(false)
				done()
			})
			.catch(err => {
				expect(err).toBe('EventBrite Error: There are errors with your arguments: location.address - INVALID')
				done()
			})
		})

	})

})
