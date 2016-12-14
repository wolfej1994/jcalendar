'use strict'

/**
 * auth module.
 * @module auth
 */

const bcrypt = require('bcryptjs')

/**
 * @function getheaderCreds
 * @description Gets the authorization header from the request.
 * @param {object} request - The data passed to the function that should contain the authorization header.
 * @return {object} - Response data containing the username and password extracted from the header.
 */
exports.getHeaderCreds = (request) => new Promise((resolve, reject) => {
	if(request.authorization === undefined || request.authorization.basic === undefined) {
		reject({code: 400 ,contentType: 'application/json', response: { status: 'error', message: 'authorization header missing'}})
	}
	const auth = request.authorization.basic
	if(auth.username === undefined || auth.password === undefined) {
		reject({code: 400 ,contentType: 'application/json', response: { status: 'error', message: 'missing username/password'}})
	}
	resolve({username: auth.username, password: auth.password})
})

/**
 * @function hashPass
 * @description Encrypts the password of the username/password object passed to the function.
 * @param {object} credentials - Object contatining the username/password.
 * @return {object} - Reponse data containing the username and the newly encrypted password.
 */
exports.hashPass = (credentials) => new Promise((resolve) => {
	const salt = bcrypt.genSaltSync(10)
	credentials.password = bcrypt.hashSync(credentials.password, salt)
	resolve(credentials)
})

/**
 * @function checkPassword
 * @description Checks whether the encrypted password matches the unencrypted password passed to the function.
 * @param {string} provided - A password that is not encrypted.
 * @param {string} hash - An encrypted password, used to compare with the one provided.
 * @return {bool} - Response data detailing whether the provided password matches the hashed one.
 */
exports.checkPassword = (provided, hash) => new Promise((resolve, reject) => {
	if(!bcrypt.compareSync(provided, hash)) reject(false)
	resolve(true)
})
