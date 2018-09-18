'use strict'

import Vue from 'vue'
import Vuex, {Payload, Store} from 'vuex'
import createPersistedState from 'vuex-persistedstate'
import axios from 'axios'

const moment = require('moment')

Vue.use(Vuex)

let priorState = null



const store = () => new Vuex.Store({
	//strict: process.env.NODE_ENV !== 'production',	
	//Establishing the fields for the store
	state: {
		status: {
			guid: '',
			current: false,
			test_flag: false,
			submit_in_progress: false
		},
		email: {
			email_address: '',
			is_verified: false
		},
		user: {
			firstname: '',
			lastname: '',
			phone: '',
			country_code: 'us',
			phone_isvalid: false
		},
		company: {
			name: '',
			industry: ''
		},
		service: {
			seats: 25,
			vanity_name: '',
			promo_code: ''
		},
		legal: {
			terms_accepted: false
		},
		billing: {
			card_fullname: '',
			payment_type: '',
			address1: '',
			address2: '',
			city: '',
			billing_state: '',
			zip_code: '',
			country: '',
			stripe_token: {}
		},
		pricing: {
			onetime_fees: 500,
			pupm: 20,
			minimum_seats: 25		
		},
		error: {
			is_error_status: false,
			code: '',
			message: ''
		},
		page_state: [
			{ index: 0, name: "contact", started: false, completed: false },
			{ index: 1, name: "company", started: false, completed: false },
			{ index: 2, name: "billing", started: false, completed: false },
			{ index: 3, name: "summary", started: false, completed: false },
			{ index: 4, name: "thank", started: false, completed: false }
		]
	},
	
	//Creating properties for updating the fields
	mutations: {
		SET_FLAG(state, flag) {
			state.status.test_flag = flag
		},
		SET_GUID(state, guid) {
			state.status.guid = guid
		},
		SET_SUBMIT_IN_PROGRESS(state, in_progress) {
			state.status.submit_in_progress = in_progress
		},
		SET_EMAIL(state, email) {
			state.email.email_address = email
		},
		SET_VERIFIED(state, is_verified) {
			state.email.is_verified = is_verified
		},
		SET_FNAME(state, firstname) {
			state.user.firstname = firstname
		},
		SET_LNAME(state, lastname) {
			state.user.lastname = lastname
		},
		SET_PHONE(state, phone) {
			state.user.phone = phone
		},
		SET_PHONE_ISVALID(state, is_valid) {
			state.user.phone_isvalid = is_valid
		},
		SET_COUNTRYCODE(state, country_code) {
			state.user.country_code = country_code
		},
		SET_COMPANY(state, company) {
			state.company.name = company
		},
		SET_INDUSTRY(state, industry) {
			state.company.industry = industry
		},
		SET_SEATS(state, seats) {
			state.service.seats = seats
		},
		SET_VANITYNAME(state, vanity_name) {
			state.service.vanity_name = vanity_name
		},
		SET_PROMOCODE(state, promo_code) {
			state.service.promo_code = promo_code
		},
		SET_TANDC(state, terms_accepted) {
			state.legal.terms_accepted = terms_accepted
		},
		SET_CARD_FULLNAME(state, fullname) {
			state.billing.card_fullname = fullname
		},
		SET_ADD1(state, address1) {
			state.billing.address1 = address1
		},
		SET_ADD2(state, address2) {
			state.billing.address2 = address2
		},
		SET_CITY(state, city) {
			state.billing.city = city
		},
		SET_BILLING_STATE(state, billing_state) {
			state.billing.billing_state = billing_state
		},
		SET_ZIP(state, zip_code) {
			state.billing.zip_code = zip_code
		},
		SET_BILLING_COUNTRY(state, country) {
			state.billing.country = country
		},
		SET_STRIPE_TOKEN(state, tokenObj) {
			state.billing.stripe_token = tokenObj
		},
		SET_ERROR_STATUS(state, error_status) {
			state.error.is_error_status = error_status
		},
		SET_ERROR_MESSAGE(state, error_message) {			
			state.error.message = error_message
		},
		SET_ERROR_CODE(state, error_code) {
			state.error.code = error_code
		},
		SET_PAGE_COMPLETE(state, page_name) {
			state.page_state.find(page => page.name === page_name).completed = true
		},
		SET_PAGE_STARTED(state, page_name) {
			state.page_state.find(page => page.name === page_name).started = true
		}

	},
	getters: {
		// Use this to encapsulate computed values for later use. 
		// https://vuex.vuejs.org/en/getters.html
		// (x) => (y) => {} is called "curried" notation
		// https://en.wikipedia.org/wiki/Currying
		// 
		isInterviewComplete: (state, getters) => {
			
			let contact_comp = getters.getPageState('contact')			
			let company_comp = getters.getPageState('company')			
			let billing_comp = getters.getPageState('billing')			
            let retval = contact_comp && company_comp && billing_comp
            
			return retval
		},
		getPageState: (state) => (page_name) => {
			let retval = state.page_state.find(page => page.name === page_name).completed
			
			return retval
		},
		getEmailDomain: (state) => {

			if (state.email.email_address && state.email.email_address.indexOf('@') !== -1) {
				let index1 = state.email.email_address.indexOf('@') + 1
				let sub1 = state.email.email_address.substring(index1)

				if (sub1 && sub1.indexOf('.')) {
					let index2 = sub1.indexOf('.')

					return sub1.substring(0, index2)
				} 
				else {
					return ''
				}
			}
			else {
				return ''
			}
			
		},
		getPaymentLast4: (state) => {
			if (state.billing.stripe_token && state.billing.stripe_token.card && state.billing.stripe_token.card.last4) {
					return state.billing.stripe_token.card.last4
			}

			return '1234'
		},
		getPaymentBrand: (state) => {
			if (state.billing.stripe_token && state.billing.stripe_token.card && state.billing.stripe_token.card.brand) {
					return state.billing.stripe_token.card.brand
				}
			
			return 'visa'
		},
		getPaymentExpMon: (state) => {
			if (state.billing.stripe_token && state.billing.stripe_token.card && state.billing.stripe_token.card.exp_month) {
					return state.billing.stripe_token.card.exp_month
				}
			
			return '01'
		}, 
		getPaymentExpYear: (state) => {
			if (state.billing.stripe_token && state.billing.stripe_token.card && state.billing.stripe_token.card.exp_year) {
					return state.billing.stripe_token.card.exp_year
				}
			
			return '30'
		},
		baseAppURL: (state) => {
			if (process.env.NODE_ENV !== 'production')
				return process.env.DEV_BASE_URL || 'http://localhost:8080'
			else
				return process.env.BASE_URL
		},
		baseSFDCURL: (state) => {
			if (process.env.NODE_ENV !== 'production')
				return process.env.SFDC_DEV_URL || 'https://dev-symphonyinc.cs4.force.com/services/apexrest/symphony/'
			else
				return process.env.SFDC_BASE_URL
		},
		getPriorState: (state) => {
			return priorState
		}

	},	
	actions: {
		async nuxtServerInit({ commit, store }, { req, res }) {

			// The nuxtServerInit method is called before rendering the THE FIRST PAGE
			// for a new request coming in to the server. It is NEVER called again.
			// { commit } is "argument destructuring" of the context object,
			// extracting the context.commit method.

			console.log('_____________------------**********nuxtServerInit**********------------_____________')

			
		},
		resetErrorState({ commit }) {			
			//commit('SET_ERROR_MESSAGE', '')
			//commit('SET_ERROR_CODE', '')
			commit('SET_ERROR_STATUS', false)
		},
		setErrorState({ commit, state }, user_message, user_code) {		
			commit('SET_ERROR_STATUS', true)
			commit('SET_ERROR_MESSAGE', user_message)
			commit('SET_ERROR_CODE', user_code)			
		},
		sendErrorReport({ getters }, error) {
			// REMEMBER: you need to tell the actions to give you the getters if you are
			// deconstructing the store arguments
			const error_path = getters.baseAppURL + '/api/error'
			let err_obj = CreateErrorObject(error, state.status.guid)

			axios.post( error_path, err_obj ).then(function(response) {
				console.log('Error submitted to Salesforce')
				//console.log(error_obj)
			})
			.catch((error) => {
				if (error.response)
				{
					console.error('Error response from Express...')
					console.error('Response Code: ' + error.response.status)
					console.error('Response Text: ' + error.response.statusText)
					console.error('Response Body: ' + error.response.data)
				}
				else if (error.request)
				{
					// Request was made but no response was received
					console.error('Failed to receive resonse from error handler...')
					console.error(error.request)

				}
				else
				{
					console.error('Unknown Error: ' + error.message)
				}
			})
					
		},
		async submitPurchase({ commit, dispatch })
		{
			if (!state.status.in_progress)
			{
				await axios.post('/api/purchase-submit', state)
				.then(function(response) {
					commit('SET_IN_PROGRESS', false)
					commit('SET_PAGE_COMPLETE', 'summary')

					//Clear the local storage
					if (process.browser)
					{
						console.log('Removing locally saved state')
						//window.localStorage.removeItem('vuex')
					}
				})
				.catch(function(error) {
					commit('SET_IN_PROGRESS', false)

					err_msg = {
						message: 'There was a problem submitting your request.',
						code: 'SUM-01'
					}

					dispatch('sendErrorReport', error)
					dispatch('setErrorState', err_msg)
				}) 
			}			
		},
		async testDispatch(context) {
			let val = 'waiting'
			console.log(SetLog('Testing async exeuction - Start'))
			val = await testPromise()
			console.log(SetLog('Testing async exeuction - End'))

			return val;
		},
		async loadTestData({ commit, getters }, code) {
			// this might be executing before the store loads the getters
			const endpoint = getters.baseAppURL + '/api/test-code' 
			const body = { test_code: code }
			let success = false

			await axios.post(endpoint, body)
			.then(function(response) {
				if (response.data.valid) {
					console.log('Loading test data to store...')
					commit('SET_GUID', 'abaf9368-16a3-c59e-9d70-72916f97fba2')
					commit('SET_FNAME', 'Kevin')
					commit('SET_LNAME', 'McGrath')
					commit('SET_EMAIL', 'kevinmcgr@gmail.com')
					commit('SET_PHONE', '+1 610-328-9985')
					commit('SET_PHONE_ISVALID', true)
					commit('SET_COUNTRYCODE', 'US')
					commit('SET_COMPANY', 'Test Co. Inc.')
					commit('SET_INDUSTRY', 'Other')
					commit('SET_SEATS', 50)
					commit('SET_CARD_FULLNAME', 'Homer J. Simpson')
					commit('SET_ADD1', '123 Evergreen Terrace')
					commit('SET_ADD2', 'First Bedroom')
					commit('SET_CITY', 'Springfield')
					commit('SET_BILLING_STATE', 'PA')
					commit('SET_ZIP', '19064')
					commit('SET_BILLING_COUNTRY', 'United States')

					success = true
				}
			})
			.catch(function(error) {
				let err_msg = error.response.status + ' - ' + error.response.statusText + ' | ' + error.response.data.message
				console.error(err_msg)				
			})

			return success
		}
    },
    plugins: process.browser ? [createPersistedState()] : []
	//plugins: process.browser ? [vuexPersist.plugin] : []

})

function testPromise() {
	return new Promise(resolve => {
		console.log(Date.now() + ' - Starting countdown')
		setTimeout(() => {
			console.log(Date.now() + ' - Ending countdown')
			resolve('DONE!')
		}, 10000)		
	})
}

function SetLog(logActivity)
{
	const processExe = 'Running on: ' + (process.server ? 'Server-side' : 'Client-side')
	console.log(moment().format('MM-DD-YYYY HH:mm:ss.SSS Z') + ' | ' + logActivity + ' | ' + processExe)
}

function CreateErrorObject(error, guid)
{
	error_obj = {
		guid: guid,
		type: 90,
		message: '',
		response: {
			status: '',
			message: '',
			data: {}
		}
	}

	if (error)
	{
		if (error.response)
		{
			error_obj.type = 91,
			error_obj.message = (error.message ? error.message : 'HTTP error')
			error_obj.response.status = error.response.status
			error_obj.response.message = error.response.message
			error_obj.response.data = error.response.data
		}
		else if (error.request)
		{
			error_obj.type = 92
			error_obj.message = error.message
			error_obj.response.message = 'Request was sent but no response was received.'
			error_obj.response.data = error.request
		}
		else
		{
			error_obj.type = 93
			error_obj.message = (error.message ? error.message : 'Unknown error')
		}
	}
	else
	{
		error_obj.type = 99
		error_obj.message = 'Error was dispatched but the error object was null.'
	}

	return error_obj
}

//DON'T FORGET THIS PART
export default store