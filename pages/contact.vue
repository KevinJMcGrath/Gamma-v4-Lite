<template>
    <div class="lite-layout">
        <div class="lite-body">
            <Row type="flex" justify="center">                
                <i-col span=10 offset=4 class="lite-col" style="border-right: 1px solid lightgray;">
                    <Timeline>
                        <TimelineItem>
                            <p class="timeline-current-label">Your Information</p>
                            <div class="timeline-spacer"></div>
                            <div class="timeline-content" style="height:280px;">
                            <Form ref="contact_form_ref" :model="contactForm" :rules="validation_rules" @submit.native.prevent>
                                <div class="lite-container-row" style="height: 40px;"> 
                                    Email Address<br/>
                                    <b>{{ input_email }}</b><br/>
                                </div>
                                <div class="lite-container-row"> 
                                    <Row :gutter="4">
                                        <i-col span=12>
                                            First Name<br/>
                                            <FormItem prop="firstname"> 
                                                <i-input v-model="input_firstname"></i-input>
                                            </FormItem>
                                        </i-col>
                                        <i-col span=12>
                                            Last Name<br/>
                                            <FormItem prop="lastname"> 
                                                <i-input v-model="input_lastname"></i-input>
                                            </FormItem>
                                        </i-col>                                    
                                    </Row>
                                </div>
                                <div class="lite-container-row" > 
                                    Daytime Phone Number<br/>
                                    <FormItem prop="phone"> 
                                        <!--<i-input v-model="input_phone" style="width: 40%"></i-input>-->
                                        <!--<input id="phone-input" v-el:phone-input type="tel" v-model="input_phone">-->
                                        <vue-tel-input v-model="input_phone" @onInput="updatePhoneValidation" style="height:30px;width:50%;"
                                            :preferredCountries="['US','GB','FR','DE']"></vue-tel-input>
                                    </FormItem>
                                </div>
                                <div>
                                    <button class="button-style-1" style="height: 32px; width: 100px;" @click="handleGotoCompany()">Next</button>
                                </div>
                            </Form>
                            </div>
                        </TimelineItem>
                        <TimelineItem>
                            <p>Company Information</p>
                        </TimelineItem>
                        <TimelineItem>
                            <p>Billing</p>
                        </TimelineItem>
                        <TimelineItem>
                            <p>Review</p>
                        </TimelineItem>

                    </Timeline>
                </i-col>
                <i-col span=6 class="lite-col">
                   
                </i-col>
                <i-col span=2></i-col>
            </Row>
        </div>
    </div>  
</template>
<script>    
    const axios = require('axios')
    import 'vue-tel-input/dist/vue-tel-input.css'

    export default {
        data() {
            const validateCustomPhone = (rule, value, callback) => {
                if (this.contactForm.phone_isvalid === true)
                {
                    callback('');
                }
                else
                {
                    callback(new Error('Please ensure your phone number is in the proper format for your country.'));
                }                
            };

            return {
                page_title: 'Symphony - Contact',
                contactForm: {
                    firstname: '',
                    lastname: '',
                    phone: '',
                    phone_isvalid: false,
                    country_detail: {
                        areaCodes: null,
                        dialCode: '',
                        iso2: '',
                        name: '',
                        is_valid: false,
                        number: ''
                    }
                },
                validation_rules: { 
                    firstname: [
                        { required: true, message: 'Please enter your first name.', trigger: 'blur'}
                    ],
                    lastname: [
                        { required: true, message: 'Please enter your last name.', trigger: 'blur'}
                    ],
                    phone: [
                        { required: true, message: 'Please enter your daytime phone number.', trigger: 'blur'},
                        { validator: validateCustomPhone, trigger: 'change' }
                    ]

                }
            }
        },
        head() {
            return {
                title: this.page_title,
                meta: [
                    { hid: 'description', name: 'description', content: 'Use this page to enter contact details for the initial user.' }
                ]
                
            }
        },
        async fetch({ store, params, query, redirect }) {
            //return new Promise((resolve, reject) => {
                console.log('Loading Contact fetch method')
                if (query.hasOwnProperty('t') && !!query.t)
                {
                    store.dispatch('loadTestData')
                    //resolve(true)
                }
                else if(!store.state.status.guid)
                {
                    console.log('GUID missing from store')
                    //Load query parameters
                    if (query.hasOwnProperty('sseid') && query.sseid)
                    {
                        console.log('Getting GUID from query string: ' + query.sseid)
                        store.commit('SET_GUID', query.sseid)
                        await axios.post(store.getters.baseAppURL + '/api/confirm', { guid: query.sseid }).then(function(response) {

                            store.commit('SET_EMAIL', response.data.user_email)
                            store.commit('SET_VERIFIED', true)
                            //resolve(true)
                        })
                        .catch((error) => {
                            
                            err_msg = {
                                message: 'There was a problem validating your unique Id.',
                                code: 'CONT-02'
                            }

                            store.dispatch('sendErrorReport', error)
                            store.dispatch('setErrorState', err_msg)

                            //reject()
                            redirect('/error')
                        })
                    }
                    else
                    {
                        console.log('Could not find GUID in query parameter list')
                        let msg = 'You must have a link provided by the email registration flow. If your link has expired, you can obtain a new link from the email, '
                        msg += 'or you can re-register your email account.'

                        let err_msg = {
                            message: msg,
                            code: 'CONT-01'
                        }

                        store.dispatch('setErrorState', err_msg)

                        //reject()
                        redirect('/error')
                    }
                }
                /* else
                {
                    resolve(true)
                } */
            //})            
            
        },
        mounted: function() {
            
            // Won't need this if the Properties tied to the Store work for validation
            this.contactForm.firstname = this.$store.state.user.firstname
            this.contactForm.lastname = this.$store.state.user.lastname
            this.contactForm.phone = this.$store.state.user.phone
            // Using this to get around the inability to call the vue-tel-intl validation
            // method on pageload. Since the validation only runs after onInput or onBlur
            // the custom validator code won't work until an action is taken. This will
            // interfere with pre-loading the field from the store. 
            this.contactForm.phone_isvalid = this.$store.state.user.phone_isvalid
            
            
            // Clear page errors from the store
            this.$store.dispatch('resetErrorState')

            //this.$els.phone-input
        },
        computed: {
            // Using computed properties for two-way binding with Vuex
            input_firstname: {
                get () {
                    return this.$store.state.user.firstname
                },
                set (value) {
                    // I'm intentionally adding side effects to make the validation rules work. Not ideal
                    this.contactForm.firstname = value;
                    this.$store.commit('SET_FNAME', value)
                }
            },
            input_lastname: {
                get () {
                    return this.$store.state.user.lastname
                },
                set (value) {
                    this.contactForm.lastname = value;
                    this.$store.commit('SET_LNAME', value)
                }
            },
            input_phone: {
                get () {
                    return this.$store.state.user.phone
                },
                set (value) {
                    this.contactForm.phone = value;
                    this.$store.commit('SET_PHONE', value)
                }
            },
            input_email: {
                get() {
                    return this.$store.state.email.email_address
                }
            }
        },
        methods: {
            handleGotoCompany () {
                this.$refs['contact_form_ref'].validate((valid) => {
                    if (valid)
                    {
                        this.$store.commit('SET_PAGE_COMPLETE', 'contact')
                        this.$router.push({ name: "company", query: { sseid: this.$store.state.status.guid } });   
                    }


                })
            },
            updatePhoneValidation({number, isValid, country}) {
                console.log(number, isValid, country)
                this.contactForm.country_detail = {
                    areaCodes: country.areaCodes,
                    dialCode: country.dialCode,
                    iso2: country.iso2,
                    name: country.name,
                    is_valid: isValid,
                    number: number
                }

                // Forces a validation of the field on the form level, which will show the error message if it needs to. 
                this.$refs['contact_form_ref'].validateField('phone', (err_msg) => { })
                this.$store.commit('SET_COUNTRYCODE', country.iso2)
                this.$store.commit('SET_PHONE_ISVALID', isValid)
                this.$store.commit('SET_BILLING_COUNTRY', country.name)
            }

        }
    }
</script>
<style>
    .vue-tel-input ul {
        z-index: 100;
    }

</style>