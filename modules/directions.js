'use strict'

/**
 * directions module.
 * @module directions
 */

const sync = require('sync-request')

/**
 * @function distance
 * @description Returns the distance between start and end.
 * @param {string} start - The starting location for the journey.
 * @param {string} end - The ending location for the journey.
 * @returns {number} - The distance from start to end.
 */
exports.distance = (start, end) => new Promise((resolve, reject) => {
	apiCall(start, end, function(err, data) {
		if(err) reject(err)
		resolve(data.routes[0].legs[0].distance.value)
	})
})

/**
 * @function duration
 * @description Returns the duration of a journey between start and end.
 * @param {string} start - The starting location for the journey.
 * @param {string} end - The ending location for the journey.
 * @returns {number} - The duration of a journey between start & end.
 */
exports.duration = (start, end) => new Promise((resolve, reject) => {
	apiCall(start, end, function(err, data) {
		if(err) reject(err)
		resolve(data.routes[0].legs[0].duration.value)
	})
})

/**
 * @function route
 * @description Returns the directions of a journey between start and end.
 * @param {string} start - The starting location for the journey.
 * @param {string} end - The ending location for the journey.
 * @returns {Array<object>} - The directions from start & end.
 */
exports.route = (start, end) => new Promise((resolve, reject) => {
	apiCall(start, end, function(err, data) {
		if(err) reject(err)
		resolve(data.routes[0].legs[0].steps)
	})
})

/**
 * @function apiCall
 * @param {string} start - the starting location for the journey
 * @param {string} end - the ending location for the journey
 * @param {apiCallback} callback - the callback run when api call is completed
 * @returns {apiCallback} callback - callback containing error & array of events
 */
function apiCall(start, end, callback) {
	let url = 'https://maps.googleapis.com/maps/api/directions/json?origin='
	url = url+start+'&destination='+end
	const res = sync('GET', url)
	const json = JSON.parse(res.getBody().toString('utf8'))
	if(json.status === 'NOT_FOUND') return callback('Google Maps Error: '+json.status)
	return callback(null, json)
}
