'use strict'

/**
 * data module.
 * @module data
 */

const schema = require('../schema/schema')
const rand = require('csprng')

/**
 * @function validateApppointment
 * @description Validates appointment objects before usage.
 * @param {data} appointment - The appointment to be validated.
 * @returns {boolean} - Whether or not json is valid.
 */
function validateAppointment(appointment) {
	if(typeof appointment.name !== 'string') {
		console.log('name not a string')
		return false
	}
	if(typeof appointment.date !== 'string') {
		console.log('date is not a string')
		return false
	}
  	if(typeof appointment.address !== 'string') {
      	console.log('address is not a string')
      	return false
  	}
  	if(typeof appointment.towncity !== 'string') {
    	console.log('towncity is not a string')
     	return false
	}
	if(typeof appointment.postcode !== 'string') {
		console.log('postcode is not a string')
		return false
	}
	return true
}

/**
 * @function addUser
 * @description Adds a user to the database.
 * @param {object} body - An object that contains the user details: username and password.
 * @returns {object} - A response that includes the users information for use at a later date.
 */
exports.addUser = (body) => new Promise((resolve, reject) => {
	if(typeof body.username !== 'string' || typeof body.password !== 'string'){
		reject({code: 400 ,contentType: 'application/json', response: { status: 'error', message: 'username/password are not strings'}})
	}
	const newUser = new schema.User({
		username: body.username,
		password: body.password
	})
	newUser.save(function(err) {
  		if(err) reject(err)
		resolve(body)
	})
})

/**
 * @function getUserInfo
 * @description Verifies whether a user exists based on username.
 * @param {object} details - An object that contains the user details: username and password.
 * @returns {object} - A HTTP response containing HTTP code and message.
 */
exports.getUserInfo = (details) => new Promise((resolve, reject) => {
	schema.User.find({username: details.username}, function(err, docs) {
		if(err) reject(err)
		if(docs.length) resolve(docs)
		reject({code: 204, contentType: 'application/json', response: { status: 'error', message: 'user does not exist'}})
	})
})

/**
 * @function appointmentsCount
 * @description Returns the number of documents present in the 'appointments' collection.
 * @param {string} username - A string that contains the username linked to the appointment models.
 * @returns {number} - The number of items in the collection.
 */
exports.appointmentsCount = (username) => new Promise((resolve, reject) => {
	schema.Appointment.find({userID: username}).count(function(err, length) {
		/* istanbul ignore next */
  		if(err) reject(err)
  		resolve(length)
	})
})

/**
 * @function appointmentsClear
 * @description Deletes all documents in the 'appointments' collection.
 * @param {string} username - A string that contains the username linked to the appointment models.
 * @returns {object} - A HTTP response containing HTTP code and message.
 */
exports.appointmentsClear = (username) => new Promise((resolve, reject) => {
	schema.Appointment.find({userID: username}).remove(function(err) {
		/* istanbul ignore next */
  		if(err) reject(err)
  		resolve({code: 200, contentType: 'json', response: { status: 'ok', message: 'all appointments removed'}})
	})
})

/**
 * @function addAppointment
 * @description Adds a new appointment document to the 'appointments' collection.
 * @param {object} body - All data used to create a new schema and save it to the 'appointments' collection.
 * @returns {object} - The new appointment that has been added to the appointments collection.
 */
exports.addAppointment = (body, username) => new Promise((resolve, reject) => {
  	const valid = validateAppointment(body)
  	if(valid === false) {
    	reject({code: 400 ,contentType: 'application/json', response: { status: 'error', message: 'JSON data missing in request body'}})
  	} else{
		const date = new Date(body.date)
	  	const newId = rand(160, 36)
		const newAppointment = new schema.Appointment({
			userID: username,
			id: newId,
			name: body.name,
			date: date,
			address: body.address,
			towncity: body.towncity,
			postcode: body.postcode
		})
		newAppointment.save(function(err) {
  			if(err) reject(err)
			resolve(newAppointment)
		})
	}
})

/**
 * @function getAllAppointments
 * @description Gets all appointment documents from the 'appointments' collection.
 * @param {string} username - A string that contains the username linked to the appointment models.
 * @returns {Array.<object>} - All appointment documents found in the collection.
 */
exports.getAllAppointments = (username) => new Promise((resolve, reject) => {
	schema.Appointment.find({userID: username}, function(err, appointments) {
		/* istanbul ignore next */
  		if(err) reject(err)
  		resolve(appointments)
	})
})

/**
 * @function removeAppointment
 * @description Removes an appointment document from the 'appointments' collection.
 * @param {string} findId - The ID used to identify the appointment that is being removed.
 * @param {string} username - The username used to only delete a certain user's appointment.
 * @returns {object} - Response containing HTTP status and message.
 */
exports.removeAppointment = (findId, username) => new Promise((resolve, reject) => {
	schema.Appointment.findOneAndRemove({id: findId, userID: username}, function(err, foundApp) {
		/* istanbul ignore next */
		if(err) reject(err)
		if(!foundApp) reject({code: 204, contentType: 'application/json', response: { status: 'error', message: 'no appointment found'}})
		resolve({code: 200, contentType: 'json', response: { status: 'ok', message: 'appointment has been deleted'}})
	})
})

/**
 * @function updateAppointment
 * @description Updates an appointment document in the 'appointments' collection.
 * @param {string} findId - The ID used to identify the appointment that is being updated.
 * @param {object} body - All data used to create a new schema and save it to the 'appointmens' collection.
 * @param {string} username - The username used to only update a certain user's appointment.
 * @returns {object} - Response containing HTTP status and message.
 */
exports.updateAppointment = (findId, body, username) => new Promise((resolve, reject) => {
  	const valid = validateAppointment(body)
  	if(valid === false) {
    	reject({code: 400 ,contentType: 'application/json', response: { status: 'error', message: 'JSON data missing in request body'}})
  	}
	const date = new Date(body.date)
	schema.Appointment.findOneAndUpdate({id: findId, userID: username}, { $set: {userID: username, id: findId, name: body.name, date: date, address: body.address, towncity: body.towncity, postcode: body.postcode}}, { new: true }, function(err, updatedApp) {
  		/* istanbul ignore next */
		if(err) reject(err)
		if(!updatedApp) reject({code: 204, contentType: 'application/json', response: { status: 'error', message: 'no appointment found'}})
  		resolve({code: 200, contentType: 'json', response: {status: 'ok', message: `${findId} has been updated`}})
	})
})

/**
 * @function getAppointmentByDate
 * @description Gets all appointments on given date.
 * @param {date} findDate - The date used to identify appointments in the collection.
 * @param {string} username - The username used to only get a certain user's appointment.
 * @returns {Array<object>} - Appointment objects found on given date.
 */
exports.getAppointmentsByDate = (findDate, username) => new Promise((resolve, reject) => {
	if(typeof findDate !== 'string') {
		reject({code: 400, contentType: 'json', response: {status: 'ok', message: 'date is the incorrect format'}})
	}
	const date = new Date(findDate)
	const lowDate = new Date(`${date.getFullYear()}-${date.getMonth()+1}-${date.getDate()} 00:00`)
	const highDate = new Date(`${lowDate.getFullYear()}-${lowDate.getMonth()+1}-${lowDate.getDate()+1} 00:00`)
	schema.Appointment.find({userID: username, date: {'$gte': lowDate, '$lt': highDate}}, function(err, foundAppointments) {
		/* istanbul ignore next */
		if(err) reject(err)
		if(foundAppointments === undefined || foundAppointments.length === 0) reject({code: 204, contentType: 'application/json', response: { status: 'error', message: 'no appointments on given date/time'}})
		resolve(foundAppointments)
	})
})

/**
 * @function getAppointmentById
 * @description Gets all appointments on given date.
 * @param {date} findId - The id used to identify appointments in the collection.
 * @param {string} username - The username used to only get a certain user's appointment.
 * @returns {Array<object>} - Appointment objects found on given date.
 */
exports.getAppointmentById = (findId, username) => new Promise((resolve, reject) => {
	schema.Appointment.findOne({id: findId, userID: username}, function(err, foundApp) {
		/* istanbul ignore next */
		if(err) reject(err)
		if(!foundApp) reject({code: 204, contentType: 'application/json', response: { status: 'error', message: 'no appointment found'}})
	    resolve(foundApp)
	})
})
