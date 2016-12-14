'use strict'

const calendar = require('../calendar')
const userDetails = {username: 'jwolfe94', password: 'testpass'}


describe('Calendar Appointments Model', function() {

	beforeEach(function(done) {
		const request = {authorization: {
				basic: {
					username: userDetails.username,
					password: userDetails.password
				}
			},
				body: {
					userID: userDetails.username,
					name: 'New Appointment',
					date: '2016-11-16 00:00',
					address: 'The Lea, Westhorpe, Willoughby-on-the-Wolds',
					towncity: 'Loughborough',
					postcode: 'LE126TD'
				}
			}
			calendar.createAppointment(request)
			.then(response => {
				expect(response.name).toBe('New Appointment')
				expect(response.address).toBe('The Lea, Westhorpe, Willoughby-on-the-Wolds')
				done()
			})
			.catch(err => {
				console.log(err)
				expect(true).toBe(false)
				done()
			})
		})

	afterEach(function(done) {
		const request = {authorization: {
				basic: {
					username: userDetails.username,
					password: userDetails.password
				}
			}
		}
		calendar.clearAllAppointments(request)
		.then(response => {
			expect(response.code).toBe(200)
			expect(response.response.message).toBe('all appointments removed')
			done()
		})
		.catch(err => {
			console.log(err)
			expect(true).toBe(false)
			done()
		})
	})

	describe('Create User Function', function() {

		it('should create a new user for given data', function(done) {
			const request = {body: {
				username: 'NEWTESTUSER', password: 'NEWTESTPASS'}
			}
			calendar.createUser(request)
			.then(response => {
				expect(response.username).toBe('NEWTESTUSER')
				expect(response.password).toBe('NEWTESTPASS')
				done()
			})
			.catch(err => {
				console.log(err)
				expect(true).toBe(false)
				done()
			})
		})
	})

		it('should throw an error due to username/password not being the correct data type', function(done) {
			const request = { body: {
				username: 12, password: 42
				}
			}
			calendar.createUser(request)
			.then(response => {
				console.log(response)
				expect(true).toBe(false)
				done()
			})
			.catch(err => {
				expect(err.code).toBe(400)
				expect(err.response.message).toBe('username/password are not strings')
				done()
			})
		})

	describe('Create Appointments Function', function() {

		it('should create a new appointment for the given user', function(done){
			const request = {authorization: {
				basic: {
					username: userDetails.username,
					password: userDetails.password
				}
			},
				body: {
					userID: userDetails.username,
					name: 'Newer Appointment',
					date: '2016-01-01 00:00',
					address: '58 Far Gosford Street',
					towncity: 'Coventry',
					postcode: 'CV15DZ'
				}
			}
			calendar.createAppointment(request)
			.then(response => {
				expect(response.name).toBe('Newer Appointment')
				expect(response.address).toBe('58 Far Gosford Street')
				done()
			})
			.catch(err => {
				console.log(err)
				expect(true).toBe(false)
				done()
			})
		})

	})

	describe('Read Appointments Functions', function() {

		it('should get all appointments for user', function(done){
			const request = {authorization: {
				basic: {
					username: userDetails.username,
					password: userDetails.password
				}}}
			calendar.getAllAppointments(request)
			.then(response => {
				expect(response.length).toBe(1)
				done()
			})
			.catch(err => {
				console.log(err)
				expect(true).toBe(false)
				done()
			})
		})

		it('should get appointment by id', function(done){
			const request = {authorization: {
				basic: {
					username: userDetails.username,
					password: userDetails.password
				}
			},
				body: {
					id: 'anID'
				}
			}
			calendar.getAllAppointments(request)
			.then(response => {
				request.body.id = response[0].id
				return calendar.getAppointment(request)
			})
			.then(appointment => {
				expect(appointment.name).toBe('New Appointment')
				expect(appointment.address).toBe('The Lea, Westhorpe, Willoughby-on-the-Wolds')
				done()
			})
			.catch(err => {
				console.log(err)
				expect(true).toBe(false)
				done()
			})
		})

		it('should get appointments by date', function(done){
			const request = {authorization: {
				basic: {
					username: userDetails.username,
					password: userDetails.password
				}
			},
				body: {
					date: '2016-11-16 00:00'
				}
			}
			calendar.getAppointmentByDate(request)
			.then(response => {
				expect(response[0].name).toBe('New Appointment')
				expect(response[0].address).toBe('The Lea, Westhorpe, Willoughby-on-the-Wolds')
				done()
			})
			.catch(err => {
				console.log(err)
				expect(true).toBe(false)
				done()
			})
		})

	})

	describe('Update Appointment Function', function() {

		it('should update appointment', function(done){
			const request = {authorization: {
				basic: {
					username: userDetails.username,
					password: userDetails.password
				}
			},
				body: {
					userID: userDetails.username,
					id: 'anID',
					name: 'Newer Appointment',
					date: '2016-01-01 00:00',
					address: '58 Far Gosford Street',
					towncity: 'Coventry',
					postcode: 'CV15DZ'
				}
			}
			calendar.getAllAppointments(request)
			.then(appointments => {
				request.body.id = appointments[0].id
				return calendar.updateAppointment(request)
			})
			.then(response => {
				expect(response.code).toBe(200)
				expect(response.response.message).toBe(`${request.body.id} has been updated`)
				done()
			})
			.catch(err => {
				console.log(err)
				expect(true).toBe(false)
				done()
			})
		})

	})

	describe('Delete Appointment Function', function() {

		it('should delete appointment', function(done){
			const request = {authorization: {
				basic: {
					username: userDetails.username,
					password: userDetails.password
				}
			},
				body: {
					userID: userDetails.username,
					id: 'anID',
					name: 'Newer Appointment',
					date: '2016-01-01 00:00',
					address: '58 Far Gosford Street',
					towncity: 'Coventry',
					postcode: 'CV15DZ'
				}
			}
			calendar.getAllAppointments(request)
			.then(appointments => {
				request.body.id = appointments[0].id
				return calendar.deleteAppointment(request)
			})
			.then(response => {
				expect(response.code).toBe(200)
				expect(response.response.message).toBe('appointment has been deleted')
				done()
			})
			.catch(err => {
				console.log(err)
				expect(true).toBe(false)
				done()
			})
		})

	})

	describe('Get Events for Appointment Function', function() {

		it('should give us events happening on the appointment date/location', function(done) {
			const request = {authorization: {
				basic: {
					username: userDetails.username,
					password: userDetails.password
				}
			},
				body: {
					userID: userDetails.username,
					name: 'Newer Appointment',
					date: '2017-01-10 00:00',
					address: '58 Far Gosford Street',
					towncity: 'Coventry',
					postcode: 'CV15DZ'
				}
			}
			calendar.createAppointment(request)
			.then(response => {
				expect(response.name).toBe('Newer Appointment')
				expect(response.address).toBe('58 Far Gosford Street')
				return calendar.getAllAppointments(request)
			})
			.then(response => {
				expect(response.length).toBe(2)
				request.body.id = response[1].id
				console.log('EVENT APPOINTMENT'+response[1].name)
				return calendar.getEvents(request)
			})
			.then(eventsList => {
				expect(eventsList[0].name).toBe('B2B Expo 2017: 10th January 2017')
				done()
			})
			.catch(err => {
				console.log(err)
				expect(true).toBe(false)
				done()
			})
		})

		it('should throw errors getting events due to no appointments being stored under that ID', function(done) {
			const request = {authorization: {
				basic: {
					username: userDetails.username,
					password: userDetails.password
				}
			},
				body: {
					id: 'notAValidID',
					userID: userDetails.username,
					name: 'Newer Appointment',
					date: '2016-11-10 18:00',
					address: '58 Far Gosford Street',
					towncity: 'Coventry',
					postcode: 'CV15DZ'
				}
			}
			calendar.getEvents(request)
			.then(events => {
				console.log(events)
				expect(true).toBe(false)
				done()
			})
			.catch(err => {
				expect(err.code).toBe(204)
				expect(err.response.message).toBe('no appointment found')
				done()
			})
		})

		it('should throw error getting events due to the location stored in the appointment being invalid', function(done) {
			const request = {authorization: {
				basic: {
					username: userDetails.username,
					password: userDetails.password
				}
			},
				body: {
					userID: userDetails.username,
					name: 'Newest Appointment',
					date: '2016-11-10 18:00',
					address: 'NotAValidAddress',
					towncity: 'NotAValidTown',
					postcode: 'NotAValidPostcode'
				}
			}
			calendar.createAppointment(request)
			.then(response => {
				expect(response.name).toBe('Newest Appointment')
				expect(response.address).toBe('NotAValidAddress')
				return calendar.getAllAppointments(request)
			})
			.then(response => {
				expect(response.length).toBe(2)
				request.body.id = response[1].id
				return calendar.getEvents(request)
			})
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

	describe('Get Direction to Appointment Function', function() {

		it('should give us directions to the appointment location', function(done) {
			const request = {authorization: {
				basic: {
					username: userDetails.username,
					password: userDetails.password
				}
			},
				body: {
					date: '2016-11-16 00:00'
				}
			}
			calendar.getAppointmentByDate(request)
			.then(appointments => {
				expect(appointments[0].name).toBe('New Appointment')
				request.body.id = appointments[0].id
				request.body.currentLocation = '58 Far Gosford Street, Coventry, CV1 5DZ'
				return calendar.getDirections(request)
			})
			.then(directions => {
				const finalIndex = directions.length-1
				expect(directions.length).toBe(17)
				expect(directions[0].start_location.lat).toBe(52.4078548)
				expect(directions[0].start_location.lng).toBe(-1.4951875)
				expect(directions[finalIndex].end_location.lat).toBe(52.8204084)
				expect(directions[finalIndex].end_location.lng).toBe(-1.0653831)
				done()
			})
			.catch(err => {
				console.log(err)
				expect(true).toBe(false)
				done()
			})
		})

		it('should throw errors getting directions due to no appointments being stored under that ID', function(done) {
			const request = {authorization: {
				basic: {
					username: userDetails.username,
					password: userDetails.password
				}
			},
				body: {
					date: '2016-11-16 00:00'
				}
			}
			calendar.getAppointmentByDate(request)
			.then(appointments => {
				expect(appointments[0].name).toBe('New Appointment')
				request.body.id = 'InvalidID'
				request.body.currentLocation = '58 Far Gosford Street, Coventry, CV1 5DZ'
				return calendar.getDirections(request)
			})
			.then(directions => {
				console.log(directions)
				expect(true).toBe(false)
				done()
			})
			.catch(err => {
				expect(err.code).toBe(204)
				expect(err.response.message).toBe('no appointment found')
				done()
			})
		})

		it('should throw error getting directions due to the location stored in the appointment being invalid', function(done) {
			const request = {authorization: {
				basic: {
					username: userDetails.username,
					password: userDetails.password
				}
			},
				body: {
					userID: userDetails.username,
					name: 'Newest Appointment',
					date: '2016-11-10 18:00',
					address: 'NotAValidAddress',
					towncity: 'NotAValidTown',
					postcode: 'NotAValidPostcode'
				}
			}
			calendar.createAppointment(request)
			.then(response => {
				expect(response.name).toBe('Newest Appointment')
				expect(response.address).toBe('NotAValidAddress')
				return calendar.getAllAppointments(request)
			})
			.then(response => {
				expect(response.length).toBe(2)
				request.body.id = response[1].id
				return calendar.getDirections(request)
			})
			.then(directions => {
				console.log(directions)
				expect(true).toBe(false)
				done()
			})
			.catch(err => {
				expect(err).toBe('Google Maps Error: NOT_FOUND')
				done()
			})
		})

	})

	describe('Get Duration to Appointment Function', function() {

		it('should give us the duration to the appointment location', function(done) {
			const request = {authorization: {
				basic: {
					username: userDetails.username,
					password: userDetails.password
				}
			},
				body: {
					date: '2016-11-16 00:00'
				}
			}
			calendar.getAppointmentByDate(request)
			.then(appointments => {
				expect(appointments[0].name).toBe('New Appointment')
				request.body.id = appointments[0].id
				request.body.currentLocation = '58 Far Gosford Street, Coventry, CV1 5DZ'
				return calendar.getDuration(request)
			})
			.then(duration => {
				expect(duration).toBe(2802)
				done()
			})
			.catch(err => {
				console.log(err)
				expect(true).toBe(false)
				done()
			})
		})

		it('should throw errors getting duration due to no appointments being stored under that ID', function(done) {
			const request = {authorization: {
				basic: {
					username: userDetails.username,
					password: userDetails.password
				}
			},
				body: {
					date: '2016-11-16 00:00'
				}
			}
			calendar.getAppointmentByDate(request)
			.then(appointments => {
				expect(appointments[0].name).toBe('New Appointment')
				request.body.id = 'InvalidID'
				request.body.currentLocation = '58 Far Gosford Street, Coventry, CV1 5DZ'
				return calendar.getDuration(request)
			})
			.then(duration => {
				console.log(duration)
				expect(true).toBe(false)
				done()
			})
			.catch(err => {
				expect(err.code).toBe(204)
				expect(err.response.message).toBe('no appointment found')
				done()
			})
		})

		it('should throw error getting duration due to the location stored in the appointment being invalid', function(done) {
			const request = {authorization: {
				basic: {
					username: userDetails.username,
					password: userDetails.password
				}
			},
				body: {
					userID: userDetails.username,
					name: 'Newest Appointment',
					date: '2016-11-10 18:00',
					address: 'NotAValidAddress',
					towncity: 'NotAValidTown',
					postcode: 'NotAValidPostcode'
				}
			}
			calendar.createAppointment(request)
			.then(response => {
				expect(response.name).toBe('Newest Appointment')
				expect(response.address).toBe('NotAValidAddress')
				return calendar.getAllAppointments(request)
			})
			.then(response => {
				expect(response.length).toBe(2)
				request.body.id = response[1].id
				return calendar.getDuration(request)
			})
			.then(directions => {
				console.log(directions)
				expect(true).toBe(false)
				done()
			})
			.catch(err => {
				expect(err).toBe('Google Maps Error: NOT_FOUND')
				done()
			})
		})

	})

	describe('Get Distance to Appointment Function', function() {

		it('should give us the distance to the appointment location', function(done) {
			const request = {authorization: {
				basic: {
					username: userDetails.username,
					password: userDetails.password
				}
			},
				body: {
					date: '2016-11-16 00:00'
				}
			}
			calendar.getAppointmentByDate(request)
			.then(appointments => {
				expect(appointments[0].name).toBe('New Appointment')
				request.body.id = appointments[0].id
				request.body.currentLocation = '58 Far Gosford Street, Coventry, CV1 5DZ'
				return calendar.getDistance(request)
			})
			.then(distance => {
				expect(distance).toBe(64815)
				done()
			})
			.catch(err => {
				console.log(err)
				expect(true).toBe(false)
				done()
			})
		})

		it('should throw errors getting distance due to no appointments being stored under that ID', function(done) {
			const request = {authorization: {
				basic: {
					username: userDetails.username,
					password: userDetails.password
				}
			},
				body: {
					date: '2016-11-16 00:00'
				}
			}
			calendar.getAppointmentByDate(request)
			.then(appointments => {
				expect(appointments[0].name).toBe('New Appointment')
				request.body.id = 'InvalidID'
				request.body.currentLocation = '58 Far Gosford Street, Coventry, CV1 5DZ'
				return calendar.getDistance(request)
			})
			.then(distance => {
				console.log(distance)
				expect(true).toBe(false)
				done()
			})
			.catch(err => {
				expect(err.code).toBe(204)
				expect(err.response.message).toBe('no appointment found')
				done()
			})
		})

		it('should throw error getting distance due to the location stored in the appointment being invalid', function(done) {
			const request = {authorization: {
				basic: {
					username: userDetails.username,
					password: userDetails.password
				}
			},
				body: {
					userID: userDetails.username,
					name: 'Newest Appointment',
					date: '2016-11-10 18:00',
					address: 'NotAValidAddress',
					towncity: 'NotAValidTown',
					postcode: 'NotAValidPostcode'
				}
			}
			calendar.createAppointment(request)
			.then(response => {
				expect(response.name).toBe('Newest Appointment')
				expect(response.address).toBe('NotAValidAddress')
				return calendar.getAllAppointments(request)
			})
			.then(response => {
				expect(response.length).toBe(2)
				request.body.id = response[1].id
				return calendar.getDistance(request)
			})
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
})
