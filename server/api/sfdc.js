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
		//console.error('Response Body: ' + JSON.stringify(resp.data))

	}
	else
	{
		if (process.env.GAMMA_DEBUG)
		{
			console.log('Success!')
			console.log('Response Code: ' + resp.status)
			console.log('Response Text: ' + resp.statusText)
			//console.log('Response Body: ' + JSON.stringify(resp.data))
		}		
	}
	
}

function axios_error(error)
{
	let err_obj = {}

	if (error.response)
	{
		log_response(error.response, true)

		err_obj.status = error.status
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

	let email_address = req.body.email_address.toLowerCase()
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

	console.log('Sending verification request to Salesforce')
	axios.post('/email-verification', payload, config)
	.then((response) => {	
		try
		{
			
			log_response(response)			
			// btoa is not available server side 
			//let encoded_email = btoa(email_address).replace(/=/g, '-')
			let encoded_email = Buffer.from(email_address).toString('base64').replace(/=/g, '-')
			let r_vcode = (response.data && response.data.vcode ? response.data.vcode : 'ver99')
			let r_msg = (response.data && response.data.message ? response.data.message : 'Could not find message')

			console.log('VCode: ' + r_vcode)
			console.log('Msg: ' + r_msg)


			res.json( { success: true, message: r_msg, encoded: encoded_email, vcode: r_vcode })
		}
		catch (err) {			
			console.log(error.message)
			res.status(err.response.status).json({success: false, message: error.message})
		}
		
	})
	.catch((error) => {
		//let err_obj = axios_error(error)
				
		let msg = (error.message ? error.message : 'Unknown error message')
		let err_data = (error.response && error.response.data ? error.response.data : {})
		
		res.status(error.response.status).json({success: false, message: msg, error_data: err_data})
	})
})

router.post('/confirm', function(req, res, next) {
	let guid = req.body.guid	
	
	const payload = { 
		guid: guid		
	}
	
	const config = {
		baseURL: process.env.SFDC_BASE_URL,
		headers: {
			'X-SYM-APIKEY': process.env.SFDC_GAMMA_KEY 
		}
	}
	/*	Salesforce guid-verification codes:
	*	Number - Desc - Success/Fail
	*	0 - Email previously verified - Success
	*	1 - Email verification successful - Success
	*	-1 - GUID is valid but verification link is expired - Fail
	*	-2 - GUID is invalid - Fail
	*	-3 - GUID is blocked, too many attempts - Fail
	* 	-4 - GUID is missing or null - Fail
	*	-5 - Payload is missing from POST - Fail
	* 	-6 - API Key is invalid - Fail
	* 	-7 - Unknown server error; see logs - Fail
	*/

	axios.post('/guid-verification', payload, config)
	.then((response) => {
		log_response(response)

		let r_vcode = response.data.code
		let u_email = response.data.user_state.user.email

		res.json( { success: true, message: 'verified', user_email: u_email, vcode: r_vcode })
	})
	.catch((error) => {		
		//let err_obj = axios_error(error)
		
		let err_msg = (error.response ? error.response.message : error.message)
		let err_data = (error.response ? error.response.data : {})
		let err_code = (error.response ? error.response.data.code : -99)

		//error.response.status IS CORRECT. Verified 09/20/2018. 
		res.status(error.response.status).json( { success: false, message: err_msg, vcode: err_code, data: err_data })
	})
})

router.post('/error', function(req, res, next) {
	const payload = res.body
	
	const config = {
		baseURL: process.env.SFDC_BASE_URL,
		headers: {
			'X-SYM-APIKEY': process.env.SFDC_GAMMA_KEY 
		}
	}

	axios.post('/symphony/sse-error', payload, config)
	.then((response) => {
		res.status(204).send(null)
	})
	.catch((error) => {		
		console.log(error.response.data)

		res.status(500).json({success: false, message: error.message, error_data: error.response.data})
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

		res.json( { success: true, message: response.data.message, code: response.data.code })
	})
	.catch((error) => {		
		let err_obj = axios_error(error)

		let err_code = -99

		if (error.response && error.response.code) {
			err_code = error.response.code
		}

		res.status(err_obj.status).json( { success: false, message: err_obj.message, code: err_code})
	})
})

module.exports = router