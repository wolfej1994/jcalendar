'use strict'

/**
 * calendar module.
 * @module calendar
 */

const directions = require('./modules/directions')
const events = require('./modules/events')
const mongo = require('./modules/data')
const auth = require('./modules/auth')


exports.createUser = (request) => new Promise((resolve, reject) => {
	mongo.addUser(request.body)
	.then(response => resolve(response))
	.catch(err => {
		reject(err)
	})
})

exports.authLogin = (request) => new Promise((resolve, reject) => {
	validateAuth(request)
	.then(response => resolve(response))
	.catch(err => {
		console.log(err)
		reject(err)
	})
})

/**
 * @function createAppointment
 * @description Creates a new appointment and stores it in the databse.
 * @param {object} request - The data passed to the function that is used to define an appointment.
 * @return {object} - The new appointment that has been added to the appointments collection.
 */
exports.createAppointment = (request) => new Promise((resolve, reject) => {
	validateAuth(request)
	.then(() => mongo.addAppointment(request.body, request.authorization.basic.username))
	.then(result => resolve(result))
	.catch(err => {
		console.log(err)
		reject(err)
	})
})

/**
 * @function clearAllAppointments
 * @description Clears all appointments from the calendar.
 * @param {object} request - The data passed to the function that is verify the user's credentials and delete only their appointments.
 * @return {object} -  A HTTP response containing HTTP code and message.
 */
exports.clearAllAppointments = (request) => new Promise((resolve, reject) => {
	validateAuth(request)
	.then(() => mongo.appointmentsClear(request.authorization.basic.username))
	.then(result => resolve(result))
	.catch(err => {
		console.log(err)
		reject(err)
	})
})

/**
 * @function getAllAppointments
 * @description Gets all appointments from the calendar.
 * @param {object} request - The data passed to the function that is verify the user's credentials and get only their appointments.
 * @return {object} -  A HTTP response containing HTTP code and message.
 */
exports.getAllAppointments = (request) => new Promise((resolve, reject) => {
	validateAuth(request)
	.then(() => mongo.getAllAppointments(request.authorization.basic.username))
	.then(result => resolve(result))
	.catch(err => {
		console.log(err)
		reject(err)
	})
})

/**
 * @function getAppointment
 * @description Gets an appointment from the calendar, based on user ID and Appointment ID.
 * @param {object} request - The data passed to the function that is verify the user's credentials and get only their appointment.
 * @return {object} -  A HTTP response containing HTTP code and message.
 */
exports.getAppointment = (request) => new Promise((resolve, reject) => {
	validateAuth(request)
	.then(() => mongo.getAppointmentById(request.body.id, request.authorization.basic.username))
	.then(result => resolve(result))
	.catch(err => {
		console.log(err)
		reject(err)
	})
})


/**
 * @function getAppointmentByDate
 * @description Gets all appointments stored on a certain date.
 * @param {object} request - The data passed to the function that is verify the user's credentials and get only their appointments.
 * @return {object} -  A HTTP response containing HTTP code and message.
 */
exports.getAppointmentByDate = (request) => new Promise((resolve, reject) => {
	validateAuth(request)
	.then(() => mongo.getAppointmentsByDate(request.body.date, request.authorization.basic.username))
	.then(result => resolve(result))
	.catch(err => {
		console.log(err)
		reject(err)
	})
})

/**
 * @function updateAppointment
 * @description Update an appointment, identified by ID.
 * @param {object} request - The data passed to the function that is verify the user's credentials and get only their appointments.
 * @return {object} -  A HTTP response containing HTTP code and message.
 */
exports.updateAppointment = (request) => new Promise((resolve, reject) => {
	const username = request.authorization.basic.username
	console.log(username)
	validateAuth(request)
	.then(() => mongo.updateAppointment(request.body.id, request.body, username))
	.then(result => resolve(result))
	.catch(err => {
		console.log(err)
		reject(err)
	})
})

/**
 * @function deleteAppointment
 * @description Deletes an appointment, identified by ID.
 * @param {object} request - The data passed to the function that is verify the user's credentials and get only their appointments.
 * @return {object} -  A HTTP response containing HTTP code and message.
 */
exports.deleteAppointment = (request) => new Promise((resolve, reject) => {
	validateAuth(request)
	.then(() => mongo.removeAppointment(request.body.id, request.authorization.basic.username))
	.then(result => resolve(result))
	.catch(err => {
		console.log(err)
		reject(err)
	})
})


/**
 * @function getEvents
 * @description Gets a collection of event objects based on information stored in appointment.
 * @param {object} request - The data passed to the function that is verify the user's credentials and get only their appointments.
 * @returns {Array<object>} - Event objects found on given date in given town.
 */
exports.getEvents = (request) => new Promise((resolve,reject) => {
	validateAuth(request)
	.then(() => mongo.getAppointmentById(request.body.id, request.authorization.basic.username))
	.then(appointment => {
		console.log('getEventByID'+appointment.name)
		console.log('Appointments Returned')
		return events.getFor(appointment.towncity, appointment.date)
	})
	.then(eventList => resolve(eventList))
	.catch(err => {
		console.log(err)
		reject(err)
	})
})

/**
 * @function getDirections
 * @description Gets an array of direction objects from given location to appointment location.
 * @param {object} request - The data passed to the function that is verify the user's credentials and get only their appointments.
 * @returns {Array<object>} - Directions from current location to appointment.
 */
exports.getDirections = (request) => new Promise((resolve, reject) => {
	mongo.getAppointmentById(request.body.id, request.authorization.basic.username)
	.then(appointment => {
		const destination = `${appointment.address}, ${appointment.towncity}, ${appointment.postcode}`
		return directions.route(request.body.currentLocation, destination)
	})
	.then(route => resolve(route))
	.catch(err => {
		reject(err)
	})
})

/**
 * @function getDistance
 * @description Gets the distance of hourney from given location to appointment location.
 * @param {object} request - The data passed to the function that is verify the user's credentials and get only their appointments.
 * @returns {number} - Distance from current location to appointment.
 */
exports.getDistance = (request) => new Promise((resolve, reject) => {
	mongo.getAppointmentById(request.body.id, request.authorization.basic.username)
	.then(appointment => {
		const destination = `${appointment.address}, ${appointment.towncity}, ${appointment.postcode}`
		return directions.distance(request.body.currentLocation, destination)
	})
	.then(distance => resolve(distance))
	.catch(err => {
		reject(err)
	})
})

/**
 * @function getDuration
 * @description Gets the duration of journey from given location to appointment location.
 * @param {object} request - The data passed to the function that is verify the user's credentials and get only their appointments.
 * @returns {number} - Duration of journey from current location to appointment.
 */
exports.getDuration = (request) => new Promise((resolve, reject) => {
	mongo.getAppointmentById(request.body.id, request.authorization.basic.username)
	.then(appointment => {
		const destination = `${appointment.address}, ${appointment.towncity}, ${appointment.postcode}`
		return directions.duration(request.body.currentLocation, destination)
	})
	.then(duration => resolve(duration))
	.catch(err => {
		reject(err)
	})
})

// ------------------ UTILITY FUNCTIONS ------------------

/**
 * @function validateAuth
 * @description Validates the request passed to the function, based on the authorization header.
 * @param {object} request - The data passed to the function that contains the authorization header we're verifying'
 * @returns {bool} - A boolean value that represents whether the authorization header is valid or not.
 */
const validateAuth = (request) => new Promise((resolve, reject) => {
	auth.getHeaderCreds(request)
	.then(credentials => {
		this.username = credentials.username
		return auth.hashPass(credentials)
	})
	.then(credentials => {
		this.password = credentials.password
		return mongo.getUserInfo(credentials)
	})
	.then(account => {
		const hash = account[0].password
		return auth.checkPassword(hash, this.password)
	})
	.then(validated => resolve(validated))
	.catch(err => {
		console.log(err)
		reject(err)
	})
})
