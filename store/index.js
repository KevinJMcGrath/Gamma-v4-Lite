'use strict'

import Vue from 'vue'
import Vuex, {Payload, Store} from 'vuex'
import axios from 'axios'

const moment = require('moment')


Vue.use(Vuex)

// The vuex constructor expects "state"  to reference a function
// that returns an object. I'm creating an initial_state implicit function
// to return the initial state so I can use it to reset the state later. 
const initial_state = () => ({
	global: {
		phk: ''
	},
    status: {
        guid: '',
        current: false,
        submit_in_progress: false,
        submit_completed: false,
		submit_completed_date: moment("1980-01-26")		
	},
	base: {
		seats: 10,
		pupm: 40
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
		industry: '',		
		address1: '',
        address2: '',
        city: '',
        company_state: '',
        postal_code: '',
		country: '',
		phone: ''
    },
    service: {
        seats: 10,
		vanity_name: '',
		show_promo_code: false,
		promo_code: '',
		promo_code_desc: '',
		promo_code_discount_percentage: 0,
		promo_code_discount_flat: 0		

    },
    legal: {
        terms_accepted: false
    },
    billing: {
        card_fullname: '',
		payment_type: '',
		same_billing_address_flag: true,
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
        pupm: 40,
        minimum_seats: 10		
    },
    error: {
        is_error_status: false,        
        message: ''
    },
    page_state: [
        { index: 0, name: "contact", started: false, completed: false },
        { index: 1, name: "company", started: false, completed: false },
        { index: 2, name: "billing", started: false, completed: false },
        { index: 3, name: "summary", started: false, completed: false },
        { index: 4, name: "thank", started: false, completed: false }
    ]
})

const store = () => new Vuex.Store({
	//strict: process.env.NODE_ENV !== 'production',	
	//Establishing the fields for the store
	state: initial_state(),
	
	//Creating properties for updating the fields
	mutations: {
		SET_GUID(state, guid) {
			state.status.guid = guid
        },
        SET_IN_PROGRESS(state, in_progress_flag) {
            state.status.submit_in_progress = in_progress_flag
        },
        SET_SUBMIT_COMPLETE(state, is_submit_complete) {
            state.status.submit_completed = is_submit_complete
        },
        SET_SUBMIT_COMPLETE_DATE(state, completed_date) {
            state.status.submit_completed_date = completed_date
        },
		SET_EMAIL(state, email) {
			state.email.email_address = email
		},
		SET_VERIFIED(state, is_verified) {
			state.email.is_verified = is_verified
		},
		SET_PHK(state, phk) {
			state.global.phk = phk
		},
		SET_FNAME(state, firstname) {
			state.user.firstname = firstname.trim().replace( /\s\s+/g, ' ')
		},
		SET_LNAME(state, lastname) {
			state.user.lastname = lastname.trim().replace( /\s\s+/g, ' ')
		},
		SET_PHONE(state, phone) {
			state.user.phone = phone.trim().replace( /\s\s+/g, ' ')
		},
		SET_PHONE_ISVALID(state, is_valid) {
			state.user.phone_isvalid = is_valid
		},
		SET_COUNTRYCODE(state, country_code) {
			state.user.country_code = country_code
		},
		SET_COMPANY(state, company) {
			state.company.name = company.trim().replace( /\s\s+/g, ' ')
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
		SET_PROMO_CODE(state, promo_code) {
			state.service.promo_code = promo_code
		},
		SET_PROMO_CODE_DESC(state, promo_code_desc) {
			state.service.promo_code_desc = promo_code_desc
		},
		SET_PROMO_CODE_DISCOUNT(state, promo_code_discount) {
			state.service.promo_code_discount_percentage = promo_code_discount
		},
		SET_PROMO_DISCOUNT_FLAT(state, promo_code_discount_flat) {
			state.service.promo_code_discount_flat = promo_code_discount_flat
		},
		SET_PROMO_CODE_SHOW(state, show_promo_code) {
			state.service.show_promo_code = show_promo_code
		},
		SET_TANDC(state, terms_accepted) {
			state.legal.terms_accepted = terms_accepted
		},
		SET_CARD_FULLNAME(state, fullname) {
			state.billing.card_fullname = fullname.trim().replace( /\s\s+/g, ' ')
		},
		SET_SAME_BILLING_ADDRESS(state, same_billing_address_flag) {
			state.billing.same_billing_address_flag = same_billing_address_flag
		},
		SET_ADD1(state, address1) {
			state.billing.address1 = address1.trim().replace( /\s\s+/g, ' ')
		},
		SET_ADD2(state, address2) {
			state.billing.address2 = address2.trim().replace( /\s\s+/g, ' ')
		},
		SET_CITY(state, city) {
			state.billing.city = city.trim().replace( /\s\s+/g, ' ')
		},
		SET_BILLING_STATE(state, billing_state) {	
			state.billing.billing_state = billing_state.trim().replace( /\s\s+/g, ' ')
		},
		SET_ZIP(state, zip_code) {
			state.billing.zip_code = zip_code
		},
		SET_BILLING_COUNTRY(state, country) {
			state.billing.country = country
		},
		SET_CO_ADD1(state, address1) {
			state.company.address1 = address1.trim().replace( /\s\s+/g, ' ')
		},
		SET_CO_ADD2(state, address2) {
			state.company.address2 = address2.trim().replace( /\s\s+/g, ' ')
		},
		SET_CO_CITY(state, city) {
			state.company.city = city.trim().replace( /\s\s+/g, ' ')
		},
		SET_CO_STATE(state, company_state) {				
			state.company.company_state = company_state.trim().replace( /\s\s+/g, ' ')
		},
		SET_CO_ZIP(state, zip_code) {
			state.company.postal_code = zip_code
		},
		SET_CO_COUNTRY(state, country) {
			state.company.country = country
		},
		SET_CO_PHONE(state, phone) {
			state.company.phone = phone.trim().replace( /\s\s+/g, ' ')
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
		SET_PAGE_COMPLETE(state, page_name) {
			state.page_state.find(page => page.name === page_name).completed = true
		},
		SET_PAGE_STARTED(state, page_name) {
			state.page_state.find(page => page.name === page_name).started = true
        },
        RESET_STATE(state) {
			console.log('RESETTING STATE!!!!')
            const reset_state = initial_state()
            Object.keys(reset_state).forEach(key => { state[key] = reset_state[key] })
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
		getPageCompleted: (state) => (page_name) => {
			return state.page_state.find(page => page.name === page_name).completed
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
			// The .env variables are not available client side. 
			// Variables that need to be exposed client side are
			// defined again in the nuxt.config.js
			return process.env.base_app_url				
		}

	},	
	actions: {
		async nuxtServerInit({ store }, { req, res }) {

			// The nuxtServerInit method is called before rendering the THE FIRST PAGE
			// for a new request coming in to the server. It is NEVER called again.
			// { commit } is "argument destructuring" of the context object,
			// extracting the context.commit method.

			console.log('_____________------------**********nuxtServerInit**********------------_____________')
			
			if (process.env.use_phk) {
				console.log('Bypassing PHK - nuxtServerInit')
			} else {
				console.log('PHK Enabled - nuxtServerInit')
			}

			if (process.env.is_dev)
			{
				console.log('Base URL: ' + process.env.base_app_url)
				console.log('SFDC Base URL: ' + process.env.SFDC_BASE_URL)
			}

			/*try {
				console.log('ENV list:')
				console.log('server side: ' + process.server)
				console.log('client side: ' + process.client)
				console.log(process.env.DEPLOY_TYPE)				
				console.log(process.env.SFDC_GAMMA_KEY)
				console.log(process.env.SFDC_BASE_URL)
				console.log(process.env.BASE_URL)
				console.log(process.env.STRIPE_PUBLIC_KEY)
				console.log(process.env.PHK_CHECK_KEY)
				console.log(process.env.USE_PHK)
				console.log(process.env.CSOON)
			} catch(error) {
				console.log(error)
			}*/
		},
		resetErrorState({ commit }) {
			commit('SET_ERROR_STATUS', false)
		},
		setErrorState({ commit, state }, user_message, user_code) {		
			commit('SET_ERROR_STATUS', true)
			commit('SET_ERROR_MESSAGE', user_message || 'unknown')
		},
		sendErrorReport({ getters }, error) {
			// REMEMBER: you need to tell the actions to give you the getters if you are
			// deconstructing the store arguments
			/*const error_path = getters.baseAppURL + '/api/error'
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
            })*/
            return
					
		},
		async verifyPHK({commit, getters}, phk) {
			let retVal = false

			try {
				console.log('Verifying PHK...')
				console.log('API Base URL: ' + getters.baseAppURL )
				let resp = await axios.post(getters.baseAppURL + '/api/private-check', { phk: phk })

				if (resp.data.success) {
					commit('SET_PHK', phk)
					retVal = true
				}
			}
			catch (error) {
                if (error.response) {                    
                    console.error('Axios error verifying PHK: ' + error.response.statusText)                    

                    let err_msg = 'Unable to verify.'
                    commit('SET_ERROR_STATUS', true)
                    commit('SET_ERROR_MESSAGE', err_msg)

                    retVal.success = false
                    retVal.message = err_msg
                    retVal.code = error.response.data.vcode
                }
                else {
                    console.error('Error without response: ' + error.message)
                    commit('SET_ERROR_STATUS', true)
                    commit('SET_ERROR_MESSAGE', error.message || 'Unknown error message')

                    retVal.success = false
                    retVal.message = error.message || 'Unknown error message'
                    retVal.code = -7
                }
			}
			finally {
				return retVal
			}
		},
        async verifyGUIDAA({ commit, dispatch, getters, state }, guid) {
            console.log('(a/a) Verifying GUID with Salesforce...')
            let retVal = {
                success: false,
                message: '',
                code: 0
            }

            try {
                let resp = await axios.post(getters.baseAppURL + '/api/confirm', { guid: guid })
				
                if (resp.data.success) {                    
                    commit('SET_EMAIL', resp.data.user_email)
					commit('SET_VERIFIED', true)

                    retVal.success = true
                    retVal.code = resp.data.vcode
                }
                else {
					// The expiration response is still HTTP200 but I send "false"
                    console.error('Verification failed (expiration)')
                    let err_msg = "Your verification link has expired. A new verification email has been issued - please check your inbox."
                    commit('SET_ERROR_STATUS', true)
                    commit('SET_ERROR_MESSAGE', err_msg)

                    retVal.success = false
                    retVal.message = err_msg
                    retVal.code = resp.data.vcode
                }
            }
            catch (error) {
                if (error.response) {                    
                    console.error('Axios error verifying GUID: ' + error.response.statusText)                    

                    let err_msg = 'There was a problem validating your unique Id. Contact Symphony sales.'
                    commit('SET_ERROR_STATUS', true)
                    commit('SET_ERROR_MESSAGE', err_msg)

                    retVal.success = false
                    retVal.message = err_msg
                    retVal.code = error.response.data.vcode
                }
                else {
                    console.error('Error without response: ' + error.message)
                    commit('SET_ERROR_STATUS', true)
                    commit('SET_ERROR_MESSAGE', error.message || 'Unknown error message')

                    retVal.success = false
                    retVal.message = error.message || 'Unknown error message'
                    retVal.code = -7
                }
            }
            finally {
                return retVal
            }
            
		},
		async validatePromoCode({commit, dispatch, state})
		{
			commit('SET_PROMO_CODE_SHOW', false)			

			let ret_obj = {
				code: 0,
				message: ''
			}

			try {
				let payload = {
					"promo_code": state.service.promo_code
				}

				let resp = await axios.post('/api/validate-promo', payload)

				if (resp && resp.status) {

					console.log('validate successful')

					if (Math.floor(resp.status / 100) == 2) {
						if (resp.data.success)
						{
							console.log('Discount: ' + resp.data.discount)
							commit('SET_PROMO_CODE_DESC', resp.data.promo_desc)
							commit('SET_PROMO_CODE_DISCOUNT', resp.data.discount / 100)
							commit('SET_PROMO_DISCOUNT_FLAT', resp.data.discount_flat)
							commit('SET_PROMO_CODE_SHOW', true)													
						}
						else
						{							
							ret_obj.code = -2
							ret_obj.message = resp.data.message	
						}
					}
					else {
						
						
						ret_obj.code = -1
						ret_obj.message = "Invalid Promo Code"						
					}
				}
				else {
					ret_obj.code = -101
					ret_obj.message = "Network Error"
				}
			}
			catch (error) {
				console.log('validate-store-error' + error)
				let err_msg = {
                    message: 'There was a problem validating your promo code.',
                    code: 'PRO-01'
                }

				ret_obj.code = -99
				ret_obj.message = "System error"
			}
			finally
			{
				return ret_obj
			}
		},
		async submitPurchase({ commit, dispatch, state })
		{
            if (state.status.submit_in_progress) { return -1}

            if (state.status.submit_completed) { return -2 }

            commit('SET_IN_PROGRESS', true)

            try {
                let resp = await axios.post('/api/purchase-submit', state)

                if (resp && resp.status){ 
                    if (Math.floor(resp.status / 100) == 2) { 
                        commit('SET_IN_PROGRESS', false)
                        commit('SET_PAGE_COMPLETE', 'summary')
                        commit('SET_SUBMIT_COMPLETE', true)
                        commit('SET_SUBMIT_COMPLETE_DATE', moment())

                        return 0
                    }
                    else {
                        commit('SET_IN_PROGRESS', false)
                        
                        return resp.data.code
                    }
                }
                else {
                    return -101
                }
            }
            catch (error)
            {
                commit('SET_IN_PROGRESS', false)

                err_msg = {
                    message: 'There was a problem submitting your request.',
                    code: 'SUM-01'
                }

                dispatch('sendErrorReport', error)
                dispatch('setErrorState', err_msg)

                if (error.response)
                    return error.response.code || -99
            }		
		}
    }
})

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