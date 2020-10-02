const { Router } = require('express')
const axios = require('axios')
const crypto = require('crypto')
const domain_search = require('../lib/domain.js')
const santize = require('sanitize-html')

const router = Router()

function log_response(resp, isError)
{
	if (isError)
	{
		console.error('HTTP error')
		console.error('Response Code: ' + resp.status)
		console.error('Response Text: ' + resp.statusText)
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

function clean_input(input_val) {
	return santize(input_val, {allowedTags: [], allowedAttributes: []})
}

router.post('/private-check', function(req, res, next) {

	let key = req.body.phk
	let phk_check = process.env.USE_PHK == 'TRUE'

	if (phk_check)
	{
		console.log('Evaluating PHK QP...')
		if (key === process.env.PHK_CHECK_KEY) {
			res.json({ success: true })
		}
		else {
			res.json({ success: false })
		}
	} else {
		console.log('Skipping PHK Check...')
		res.json({ success: true })
	}
	
}) 

router.post('/domain-check', function(req, res, next) {

	let email_address = clean_input(req.body.email_address.toLowerCase())
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
		res.json( { success: false, message: 'Problem verifying email'})
	})
})

router.post('/verify', function(req, res, next) {	
	let email_address = clean_input(req.body.email_address.toLowerCase())
	
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

			res.json( { success: true, message: r_msg, encoded: encoded_email, vcode: r_vcode })
		}
		catch (err) {
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
	let guid = clean_input(req.body.guid.toLowerCase())
	
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
		let u_email = response.data.user_state

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
		res.status(500).json({success: false, message: error.message, error_data: error.response.data})
	})
})

router.post('/test-post', function(req, res, next) {
	console.log('server reports: test succeeded')
	res.json({ success: true })
})

router.post('/purchase-submit-test', function(req, res, next) {
	var input = req.body

	for (var property in input) {
		if (input.hasOwnProperty(property)) {
			input[property] = clean_input(input[property])
		}
	}

	res.json({input: input})
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

router.post('/validate-promo', function(req, res, next) {
	console.log('Validating promo code (server)')


	const payload = req.body
	const config = {
		baseURL: process.env.SFDC_BASE_URL,
		headers: {
			'X-SYM-APIKEY': process.env.SFDC_GAMMA_KEY 
		}
	}

	axios.post('/validate-promo', payload, config)
	.then((response) => {
		log_response(response)
		console.log('SFDC API Success')

		res.json({ 
			success: response.data.success, 
			promo_desc: response.data.promo_desc, 
			discount: response.data.discount,
			discount_flat: response.data.discount_flat,
			message: response.data.message
		})
	})
	.catch((error) => {
		console.log('SFDC API Fail')
		let err_obj = axios_error(error)
		let err_code = -99

		if (error.response && error.response.code) {
			err_code = error.response.code
		}

		res.status(500).json({ success: false, message: err_obj.message, code: err_code})
	})
})

module.exports = router