'use strict'

const directions = require('../modules/directions')
const origin = 'Coventry'
const destination = 'Nottingham'


describe('Directions Module', function() {

	describe('Get Directions Function', function() {

		it('should give us a list of directions from our start till our end point', function(done) {
			directions.route(origin, destination)
			.then(route => {
				const finalIndex = route.length-1
				expect(route.length).toBe(31)
				expect(route[0].start_location.lat).toBe(52.4068216)
				expect(route[0].start_location.lng).toBe(-1.519696)
				expect(route[finalIndex].end_location.lat).toBe(52.9547343)
				expect(route[finalIndex].end_location.lng).toBe(-1.1582607)
				done()
			})
			.catch(err => {
				console.log(err)
				expect(true).toBe(false)
				done()
			})
		})

		it('should throw an error due to incorrect origin/destination', function(done) {
			directions.route('herbaderbadoo', 'smerbaderbadoo')
			.then(route => {
				console.log(route)
				expect(true).toBe(false)
				done()
			})
			.catch(err => {
				expect(err).toBe('Google Maps Error: NOT_FOUND')
				done()
			})
		})

	})

	describe('Get Duration Function', function() {

		it('should give us the duration that our route will take from start till end', function(done) {
			directions.duration(origin, destination)
			.then(duration => {
				expect(duration).toBe(3915)
				done()
			})
			.catch(err => {
				console.log(err)
				expect(true).toBe(false)
				done()
			})
		})

		it('should throw an error due to incorrect origin/destination', function(done) {
			directions.distance('herbaderbadoo', 'smerbaderbadoo')
			.then(distance => {
				console.log(distance)
				expect(true).toBe(false)
				done()
			})
			.catch(err => {
				expect(err).toBe('Google Maps Error: NOT_FOUND')
				done()
			})
		})

	})

	describe('Get Distance Function', function() {

		it('should give us the route distance from our start point till our end point', function(done) {
			directions.distance(origin, destination)
			.then(distance => {
				expect(distance).toBe(88967)
				done()
			})
			.catch(err => {
				console.log(err)
				expect(true).toBe(false)
				done()
			})
		})

		it('should throw an error due to incorrect origin/destination', function(done) {
			directions.duration('herbaderbadoo', 'smerbaderbadoo')
			.then(duration => {
				console.log(duration)
				expect(true).toBe(false)
				done()
			})
			.catch(err => {
				expect(err).toBe('Google Maps Error: NOT_FOUND')
				done()
			})
		})

	})

})
