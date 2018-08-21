const { Router } = require('express')
const axios = require('axios')
const crypto = require('crypto')
const domain_search = require('../lib/domain.js')


//Add logic for storing API keys here

const router = Router()

//const baseURL = 'https://dev-symphonyinc.cs4.force.com/services/apexrest/symphony/'
let baseURL = process.env.SFDC_BASE_URL
//const baseURL = process.env.SFDC_BASE_URL

function log_response(resp, isError)
{
	if (isError)
	{
		console.error('HTTP error')
		console.error('Response Code: ' + resp.status)
		console.error('Response Text: ' + resp.statusText)
		console.error('Response Body: ' + resp.data)

	}
	else
	{
		if (process.env.GAMMA_DEBUG)
		{
			console.log('Success!')
			console.log('Response Code: ' + resp.status)
			console.log('Response Text: ' + resp.statusText)
			//console.log('Response Body: ' + resp.data)
		}		
	}
	
}

function axios_error(error)
{
	let err_obj = {}

	if (error.response)
	{
		log_response(error.response, true)

		err_obj.status = error.respose.status
		err_obj.message = error.response.statusText
		err_obj.data = error.response.data
	}
	else if (error.request)
	{
		// Request was made but no response was received
		console.error('Request was sent but received no response')
		console.error(error.request)

		err_obj.status = 500
		err_obj.message = 'No response from Salesforce'		
	}
	else
	{
		console.error('Unknown Error: ' + error.message)

		err_obj.status = 500
		err_obj.message = 'Unkown error'
		err_obj.data = ''
	}

	return err_obj
}

router.post('/domain-check', function(req, res, next) {

	let email_address = req.body.email_address
	domain_search.isForbiddenDomain(email_address).then((result) => {
		if (result) {
			let domain = domain_search.getDomain(email_address)
			res.json( { success: false, message: 'Invalid Email', server_code: 11, domain_name: domain })	
		}
		else
		{
			res.json( { success: true })
		}

	}).catch((error) => {
		console.error(error.message)
		res.json( { success: false, message: 'Problem verifying email'})
	})
})

router.post('/verify', function(req, res, next) {

	console.log('Entering /verify')
	let email_address = req.body.email_address	
	
	const payload = { 
		emailAddress: email_address,
		resend: req.body.hasOwnProperty('resend') ? req.body.resend : false
	}
	
	const config = {
		baseURL: process.env.SFDC_BASE_URL,
		headers: {
			'X-SYM-APIKEY': process.env.SFDC_GAMMA_KEY 
		}
	}

	axios.post('/email-verification', payload, config)
	.then((response) => {		
		log_response(response)

		// btoa is not available server side 
		//let encoded_email = btoa(email_address).replace(/=/g, '-')
		let encoded_email = Buffer.from(email_address).toString('base64').replace(/=/g, '-')
		res.json( { success: true, message: response.data, encoded: encoded_email })
	})
	.catch((error) => {
		//let err_obj = axios_error(error)
		//res.status(err_obj.status).json( { success: false, message: err_obj.message, data: err_obj.data })

		console.log(error.response.data)
		//console.log(error.message)
		res.status(500).json({success: false, message: error.message, error_data: error.response.data})
	})
})

router.post('/confirm', function(req, res, next) {
	console.log('Entering /confirm')
	//let email_address = req.body.email_address
	let guid = req.body.guid	
	
	const payload = { 
		//email_address: email_address,
		guid: guid		
	}
	
	const config = {
		baseURL: process.env.SFDC_BASE_URL,
		headers: {
			'X-SYM-APIKEY': process.env.SFDC_GAMMA_KEY 
		}
	}

	axios.post('/guid-verification', payload, config)
	.then((response) => {
		log_response(response)
		//console.log(response.data)
		res.json( { success: true, message: 'verified', user_email: response.data.user_state.user.email })
	})
	.catch((error) => {		
		let err_obj = axios_error(error)
		res.status(err_obj.status).json( { success: false, message: err_obj.message, data: err_obj.data })
	})
})

router.post('/test-post', function(req, res, next) {
	console.log('server reports: test succeeded')
	res.json({ success: true })
})

router.post('/purchase-submit', function(req, res, next) {
	
	const payload = req.body
	const config = {
		baseURL: process.env.SFDC_BASE_URL,
		headers: {
			'X-SYM-APIKEY': process.env.SFDC_GAMMA_KEY 
		}
	}

	axios.post('/selfservice-submit', payload, config)
	.then((response) => {
		log_response(response)
		res.json( { success: true, message: response.data })
	})
	.catch((error) => {		
		let err_obj = axios_error(error)
		res.status(err_obj.status).json( { success: false, message: err_obj.message, data: err_obj.data })
	})
})

module.exports = router