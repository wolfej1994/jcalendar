
'use strict'

/**
 * events module.
 * @module events
 */

const sync = require('sync-request')

/**
 * @function getFor
 * @description Returns all events on given day for given location
 * @param {string} town - the location where the events are
 * @param {string} date - the date that the events are held on
 * @returns {Array<object>} - Event objects found on given date for given town.
 */
exports.getFor = (town, date) => new Promise((resolve, reject) => {
	const eventList = []
	apiCall(town, date, function(err, allEvents) {
		if(err) reject(err)
		allEvents.forEach(function(event) {
			const eventItem = {name: event.name.text, description: event.description.text, dateTime: event.start.local, url: event.url}
			eventList.push(eventItem)
		})
		resolve(eventList)
	})
})

/**
 * @function apiCall
 * @param {string} town - the location to search for events
 * @param {string} date - the date to search for events
 * @param {apiCallback} callback - the callback run when api call is completed
 * @returns {apiCallback} - callback containing error & array of events
 */
function apiCall(town, date, callback) {
	const startDate = new Date(date)
	const endDate = new Date(date.setDate(date.getDate()+1))
	let url = 'https://www.eventbriteapi.com/v3/events/search/?location.address='
	url = url+town+'&start_date.range_start='+startDate.toISOString().substr(0, 19)+'&start_date.range_end='+endDate.toISOString().substr(0, 19)+'&token=C5P7GDUFXHJ2ZNMFFEDV'
	const res = sync('GET', url)
	if(res.statusCode === 400) callback('EventBrite Error: There are errors with your arguments: location.address - INVALID', null)
	const data = JSON.parse(res.getBody().toString('utf8'))
	const eventList = data.events
	return callback(null, eventList)
}
