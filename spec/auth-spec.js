'use strict'

const auth = require('../modules/auth')


describe('Auth Module', function() {

	describe('Get Header Credentials Function', function() {

		it('should return an object with a username and password', function(done){
			const request = {
				authorization: {
					basic: {
						username: 'testUser',
						password: 'password'
					}
				}
			}
			auth.getHeaderCreds(request)
            .then(response => {
				expect(response.username).toBe(request.authorization.basic.username)
				expect(response.password).toBe(request.authorization.basic.password)
				done()
			})
            .catch(err => {
				console.log(err)
				expect(true).toBe(false)
				done()
			})
		})

		it('should throw error due to request missing authorization header', function(done){
			const request = {
                data: 'fakeData'
			}
			auth.getHeaderCreds(request)
            .then(response => {
				console.log(response)
				expect(true).toBe(false)
				done()
			})
			.catch(err => {
				expect(err.code).toBe(400)
                expect(err.response.message).toBe('authorization header missing')
				done()
			})
		})

		it('should throw error due to request missing username/password', function(done){
			const request = {
				authorization: {
					basic: 'fakeData'
				}
			}
			auth.getHeaderCreds(request)
            .then(response => {
				console.log(response)
				expect(true).toBe(false)
				done()
			})
			.catch(err => {
				expect(err.code).toBe(400)
				expect(err.response.message).toBe('missing username/password')
				done()
			})
		})

	})

    describe('Hashes Password/Check Password Functions', function() {

        it('should hash the password, then find that the credentials match the original request', function(done){
            const stored = {
                username: 'testUser',
                password: 'password'
            }
            auth.hashPass(stored)
            .then(response => {
				expect(response.username).toBe('testUser')
                return auth.checkPassword('password', response.password)
            })
            .then(matching => {
                expect(matching).toBe(true)
                done()
            })
            .catch(err => {
                console.log(err)
                expect(true).toBe(false)
                done()
            })
        })

        it('should reject due to the password being incorrect', function(done){
            const stored = {
                username: 'testUser',
                password: 'password'
            }
            auth.hashPass(stored)
            .then(response => {
				expect(response.username).toBe('testUser')
                return auth.checkPassword('notThePassword', response.password)
            })
            .then(matching => {
                console.log(matching)
                expect(true).toBe(false)
                done()
            })
            .catch(err => {
                expect(err).toBe(false)
                done()
            })
        })
    
    })
})


