'use strict'

const mongoose = require('mongoose')

const details = {
	user: 'apiUser',
	pass: 'secret1'
}

mongoose.connect(`mongodb://${details.user}:${details.pass}@ds119508.mlab.com:19508/calendar`)

const userSchema = mongoose.Schema({
	username: String,
	password: String
})

exports.User = mongoose.model('User', userSchema)

const appointmentSchema = mongoose.Schema({
	userID: String,
	id: String,
	name: String,
	date: Date,
	address: String,
	towncity: String,
	postcode: String
})

exports.Appointment = mongoose.model('Appointment', appointmentSchema)

process.on('SIGINT', function() {
  	mongoose.disconnect(function() {
    	console.log('Mongoose default connection disconnected through app termination')
    	process.exit(0)
  	})
})
