const { Router } = require('express')
const axios = require('axios')
const crypto = require('crypto')


//Add logic for storing API keys here

const router = Router()

const baseURL = 'https://dev-symphonyinc.cs4.force.com/services/apexrest/symphony/'

// Helper Methods

function encode64(plaintext) {

	//https://stackabuse.com/encoding-and-decoding-base64-strings-in-node-js/
	let buff = new Buffer(plaintext)

	// Replace the 64bit encode padding with hypens to avoid 
	// percent notation in URL encoding. 

	// /searchstring/g is how you do a global replace. Apparently 
	// javascript's string replace only replaces the first instance unless
	// you use the regex syntax. Because fuck you is why.
	return buff.toString('base64').replace(/=/g, '-')	
}

function decode64(encoded_string) {
	// replace the hypens with base64 padding chars
	let buff = new Buffer(encoded_string.replace(/-/g, '='), 'base64')
	return buff.toString('ascii')
}

router.post('/test', function(req, res, next) {
	console.log(req.body.email_address)

	res.json(req.body.email_address)
})

router.post('/encode64', function(req, res, next) {
	
	//console.log('encode64 output message: ' + str64)
	let strForEncode = encode64(req.body.message)
	res.json({encoded: strForEncode})
})

router.post('/decode64', function(req, res, next) {

	let strForDecode = decode64(req.body.message)
	console.log('decode64 output message: ' + strForDecode)

	res.json({decoded: strForDecode})
})

router.post('/encode', function(req, res, next) {
	const strForEncode = req.body.message

	console.log ('string for encode: ' + strForEncode)

	const secret = '1234567890abcdefghijklmnopqrstuv'

	//https://gist.github.com/yoavniran/c78a0991e0152b306c25
	getKeyAndIV(secret, function(data){
		var cipher = crypto.createCipheriv('aes256', data.key, data.iv)
		var enc = cipher.update(strForEncode, 'utf8', 'base64')
		enc += cipher.final('base64')

		console.log("Encrypted data: " + enc)

		res.json({enc_message: enc})
	})
})

function getKeyAndIV(key, callback) {

	crypto.pseudoRandomBytes(16, function (err, ivBuffer) {

		var keyBuffer  = (key instanceof Buffer) ? key : new Buffer(key) ;
		
		callback({
			iv: ivBuffer,
			key: keyBuffer
		});
	});
}

router.post('/verify', function(req, res, next) {

	const payload = { emailAddress: req.body.email_address }
	
	const config = {
		baseURL: baseURL,
		headers: {
			'X-SYM-APIKEY': '123456789KEVINabcdefgh'
		}
	}

	axios.post('/email-verification', payload, config)
	.then((response) => {
		console.log('Success!')
		console.log('Response Code: ' + response.status)
		console.log('Response Text: ' + response.statusText)
		console.log('Response Body: ' + response.data)

		let encoded_email = encode64(req.body.email_address)

		res.json( { success: true, message: response.data, encoded: encoded_email })
	})
	.catch((error) => {		
		console.error('Failure ;_;')

		if (error.response)
		{
			console.error('Response Code: ' + error.response.status)
			console.error('Response Text: ' + error.response.statusText)
			console.error('Response Body: ')
			console.error(error.response.data)
			//console.error('Response Headers: ' + error.response.headers)

			res.status(error.response.status).json(error.response.data)
		}
		else if (error.request)
		{
			// Request was made but no response was received
			console.error(error.request)

			res.json( { success: false, message: 'System Error' })
		}
		else
		{
			console.error('Unknown Error: ' + error.message)

			res.json( { success: false, message: 'Unknown Error' })
		}
	})
})

router.post('/purchase-test', function(req, res, next) {
	let ep = 'http://requestbin.fullcontact.com/1ebcgxn1'

	let payload = req.body
	let config = {}

	axios.post(ep, payload, config)
	.then((response) => {
		console.log('Success (API Server)')
		console.log('Response Code: ' + response.status)

		res.status(204)
	})
	.catch((error) => {
		console.error('Failed to POST')
		console.error(error)

		if (error.response)
		{
			console.error('Response Code: ' + error.response.status)
			console.error('Response Text: ' + error.response.statusText)
			console.error('Response Body: ' + error.response.data)
			console.error('Response Headers: ' + error.response.headers)

			res.json( { success: false, message: 'HTTP Error' })
		}
		else if (error.request)
		{
			// Request was made but no response was received
			console.error(error.request)

			res.json( { success: false, message: 'System Error' })
		}
		else
		{
			console.error('Unknown Error: ' + error.message)

			res.json( { success: false, message: 'Unknown Error' })
		}
	})
}) 


router.post('/purchase-submit', function(req, res, next) {
	
	const payload = req.body
	const config = {
		baseURL: baseURL,
		headers: {
			'X-SYM-APIKEY': '123456789KEVINabcdefgh'
		}
	}

	axios.post('/selfservice-submit', payload, config)
	.then((response) => {
		console.log('Success!')
		console.log('Response Code: ' + response.status)
		console.log('Response Text: ' + response.statusText)
		console.log('Response Body: ' + response.data)

		res.json( { success: true, message: response.data })
	})
	.catch((error) => {		
		console.error('Failure ;_;')

		if (error.response)
		{
			console.error('Response Code: ' + error.response.status)
			console.error('Response Text: ' + error.response.statusText)
			console.error('Response Body: ' + error.response.data)
			console.error('Response Headers: ' + error.response.headers)

			res.json( { success: false, message: 'HTTP Error' })
		}
		else if (error.request)
		{
			// Request was made but no response was received
			console.error(error.message)

			res.json( { success: false, message: 'System Error' })
		}
		else
		{
			console.error('Unknown Error: ' + error.message)

			res.json( { success: false, message: 'Unknown Error' })
		}
	})
})

module.exports = router