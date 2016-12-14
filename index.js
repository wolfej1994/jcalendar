'use strict'

const restify = require('restify')
const server = restify.createServer()

server.use(restify.fullResponse())
server.use(restify.bodyParser())
server.use(restify.queryParser())
server.use(restify.authorizationParser())

const calendar = require('./calendar.js')
const status = {
	ok: 200,
	added: 201,
	badRequest: 400
}
const defaultPort = 8080

server.get('/', (req, res, next) => {
	res.redirect('/appointments', next)
})

/**
 */
server.get('/appointments', (req, res) => {
    res.setHeader('content-type', 'application/json')
	res.setHeader('accepts', 'GET, POST')
	calendar.getAllAppointments(req)
	.then(response => {
		res.send(status.ok, response)
	})
	.catch(err => {
		res.send(status.badRequest, {error: err.message})
	})
})

server.get('/appointments/:id', (req, res) => {
    res.setHeader('content-type', 'application/json')
	res.setHeader('accepts', 'GET, POST, DELETE, PUT')
	req.body = {id: req.params.id}
	calendar.getAppointment(req)
	.then(response => {
		res.send(status.ok, response)
	})
	.catch(err => {
		res.send(status.badRequest, {error: err.message})
	})
})

server.get('/appointments/:dateStr', (req, res) => {
	res.setHeader('content-type', 'application/json')
	res.setHeader('accepts', 'GET, POST')
	req.body = {date: req.params.dateStr}
	calendar.getAppointmentByDate(req)
	.then(response => {
		res.send(status.ok, response)
	})
	.catch(err => {
		res.send(status.badRequest, err)
	})
})

server.post('/appointments', (req, res) => {
    res.setHeader('content-type', 'application/json')
	res.setHeader('accepts', 'GET, POST')
	calendar.createAppointment(req)
    .then(response => {
        res.send(status.added, {appointment: response})
    })
    .catch(err => {
        res.send(status.badRequest, {error: err.message})
    })
})

server.post('/accounts', (req, res) => {
    res.setHeader('content-type', 'application/json')
	res.setHeader('accepts', 'GET, POST')
	calendar.createUser(req)
    .then(response => {
        res.send(status.added, {user: response})
    })
    .catch(err => {
        res.send(status.badRequest, {error: err.message})
    })
})

server.get('/accounts', (req, res) => {
	res.setHeader('content-type', 'application/json')
	res.setHeader('accepts', 'GET, POST')
	calendar.authLogin(req)
	.then(response => {
		res.send(status.ok, {valid: response})
	})
	.catch(err => {
		res.send(status.badRequest, {valid: err})
	})
})

server.get(':id/:lat/:long/directions', (req, res) => {
	res.setHeader('content-type', 'application/json')
	res.setHeader('accepts', 'GET, POST')
	req.body = {
		id: req.params.id,
		currentLocation: `${req.params.lat}, ${req.params.long}`}
	calendar.getDirections(req)
	.then(response => {
		res.send(status.ok, {directions: response})
	})
	.catch(err => {
		res.send(status.badRequest, {error: err.message})
	})
})

server.del('appointments/:id', (req, res) => {
	res.setHeader('content-type', 'application/json')
	res.setHeader('accepts', 'GET, POST, DELETE, PUT')
	req.body = {id: req.params.id}
	console.log(req.body)
	calendar.deleteAppointment(req)
	.then(response => {
		res.send(status.ok, {response: response.response.message})
	})
	.catch(err => {
		res.send(status.badRequest, {error: err.message})
	})
})

server.put('appointments/:id', (req, res) => {
	res.setHeader('content-type', 'application/json')
	res.setHeader('accepts', 'GET, POST, DELETE, PUT')
	req.body.id = req.params.id
	calendar.updateAppointment(req)
	.then(response => {
		res.send(status.ok, {response: response})
	})
	.then(err => {
		res.send(status.badRequest, {error: err.message})
	})
})

server.get(':id/events', (req, res) => {
	res.setHeader('content-type', 'application/json')
	res.setHeader('accepts', 'GET, POST')
	req.body = {id: req.params.id}
	calendar.getEvents(req)
	.then(response => {
		res.send(status.ok, {events: response})
	})
	.catch(err => {
		res.send(status.badRequest, {error: err.message})
	})
})

const port = process.env.PORT || defaultPort

server.listen(port, err => {
	if (err) {
		console.error(err)
	} else {
		console.log('App is ready at : ' + port)
	}
})
