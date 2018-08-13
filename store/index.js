'use strict'

import Vue from 'vue'
import Vuex from 'vuex'
//import { stat } from 'fs';

//const fs = (process.server ? require('fs') : null)
const moment = require('moment')

Vue.use(Vuex)

const store = () => new Vuex.Store({
	strict: true,
	//Establishing the fields for the store
	state: {
		status: {
			guid: ''
		},
		email: {
			email_address: '',
			is_verified: false
		},
		user: {
			firstname: '',
			lastname: '',
			phone: '',
			country_code: 'us'
		},
		company: {
			name: '',
			industry: ''
		},
		service: {
			seats: 10,
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
		page_state: [
			{ index: 0, name: "contact", completed: false },
			{ index: 1, name: "company", completed: false },
			{ index: 2, name: "service", completed: false },
			{ index: 3, name: "legal", completed: false },
			{ index: 4, name: "billing", completed: false },
			{ index: 5, name: "summary", completed: false },
			{ index: 6, name: "thank", completed: false }
		]
	},
	//Creating properties for updating the fields
	mutations: {
		SET_GUID(state, guid) {
			state.status.guid = guid
		},
		SET_EMAIL(state, email) {
			state.email.email_address = email
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
		SET_COUNTRY(state, country) {
			state.billing.country = country
		},
		SET_STRIPE_TOKEN(state, tokenObj) {
			state.billing.stripe_token = tokenObj
		},
		SET_PAGE_COMPLETE(state, page_name) {
			state.page_state.find(page => page.name === page_name).completed = true
		}

	},
	getters: {
		// Use this to encapsulate computed values for later use. 
		// https://vuex.vuejs.org/en/getters.html
		// (x) => (y) => {} is called "curried" notation
		// https://en.wikipedia.org/wiki/Currying
		// 
		getPageState: (state) => (page_name) => {
			return state.page_state.find(page => page.name === page_name)
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
		}

	},	
	actions: {
		async nuxtServerInit({ commit }, { req, res }) {

			// The nuxtServerInit method is called before rendering the THE FIRST PAGE
			// for a new request coming in to the server. It is NEVER called again.
			// { commit } is "argument destructuring" of the context object,
			// extracting the context.commit method.

			console.log('_____________------------**********nuxtServerInit**********------------_____________')			
			
		}

		
	}

})

function SetLog(logActivity)
{
	const processExe = (process.server ? 'Server-side' : 'Client-side')
	console.log(moment().format('MM-DD-YYYY HH:mm:ss.SSS Z') + ' | ' + logActivity + ' | ' + processExe)
}

/*function testFunc2() {
	return new Promise((resolve, reject) => {
		console.log('Executing timeout')
		setTimeout(() => {
			let vnum = Math.floor(Math.random()*20000) + new Date().getTime()
			resolve(vnum)
		}, 5000)
	})
}*/

/*function getData() {
	return new Promise(function(resolve, reject) {
		const fs = (process.server ? require('fs') : null)
		let fileName = './static/index.txt'
		let type = 'UTF-8'

		if (fs)
		{
			SetLog('Loading File')
			fs.readFile(fileName, type, (err, data) => {
				err ? reject(err) : resolve(data)
			})
		}
		else
		{
			SetLog('Failed to load fs')
			//console.log('fs is not available client side')
			resolve('shrug')
		}
	})
}*/

//DON'T FORGET THIS PART
export default store