<template>
    <div class="lite-layout">
        <div class="lite-body">
            <Row type="flex" justify="center">                
                <i-col span=10 offset=4 class="lite-col" style="border-right: 1px solid lightgray;">
                    <Timeline>
                        <TimelineItem color="#00557F">
                            <p class="timeline-current-label">Your Information</p>
                            <div class="timeline-spacer"></div>
                            <div class="timeline-content" style="height:380px;">
                            <Form ref="contact_form_ref" :model="contactForm" :rules="validation_rules" @submit.native.prevent>
                                <div class="lite-container-row" style="height: 40px;"> 
                                    Email Address<br/>
                                    <b>{{ input_email }}</b><br/>
                                </div>
                                <div class="lite-container-row"> 
                                    <Row :gutter="4">
                                        <i-col span=24>
                                            First Name<br/>
                                            <FormItem prop="firstname"> 
                                                <i-input v-model="input_firstname"></i-input>
                                            </FormItem>
                                        </i-col>
                                    </Row>
                                </div>
                                <div class="lite-container-row"> 
                                    <Row :gutter="4">
                                        <i-col span=24>
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
                                        <vue-tel-input ref="vuetel" v-model="input_phone" @onInput="updatePhoneValidation" style="height:30px;width:50%;"
                                            :preferredCountries="['US','GB','FR','DE']"></vue-tel-input>
                                    </FormItem>
                                </div>
                                <div>
                                    <button class="button-style-1" style="height: 32px; width: 100px;" @click="handleGotoCompany()">Next</button>
                                </div>
                            </Form>
                            </div>
                        </TimelineItem>
                        <TimelineItem color="gray">
                            <p>Company Information</p>
                        </TimelineItem>
                        <TimelineItem color="gray">
                            <p>Billing</p>
                        </TimelineItem>
                        <TimelineItem color="gray">
                            <p>Review</p>
                        </TimelineItem>
                    </Timeline>
                </i-col>
                <i-col span=8 class="lite-col">
                    <symphony-billing />
                </i-col>
                <i-col span=2></i-col>
            </Row>
        </div>
        <symphony-footer is-absolute/>
    </div>  
</template>
<script>    
    import SymphonyBilling from '~/components/SymphonyBilling.vue'
    import SymphonyFooter from '~/components/SymphonyFooter.vue'

    const axios = require('axios')    
    const htmlRe = new RegExp(String.raw`</?\w+((\s+\w+(\s*=\s*(?:".*?"|'.*?'|[\^'">\s]+))?)+\s*|\s*)/?>`)

    export default {
        data() {
            const validateCustomPhone = (rule, value, callback) => {
                if (this.$refs['vuetel'].phoneObject.isValid)
                {
                    callback('');
                }
                else
                {
                    callback(new Error('Invalid phone number format.'));
                }                
            };

            const validateNoHTML = (rule, value, callback) => {
                if (htmlRe.test(value) === true) {
                    callback(new Error('Invalid format.'))
                }
                else {
                    callback()
                }
            }

            return {
                page_title: 'Symphony - Contact',
                error_state: false,
                contactForm: {
                    firstname: '',
                    lastname: '',
                    phone: '',
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
                        { required: true, message: 'Required', trigger: 'blur'},
                        { type: 'string', 'min': 1, 'max': 50, message: 'First Name must be less than 50 characters.', trigger: 'blur'},
                        { validator: validateNoHTML, trigger: 'blur' }
                    ],
                    lastname: [
                        { required: true, message: 'Required', trigger: 'blur'},
                        { type: 'string', 'min': 1, 'max': 50, message: 'Last Name must be less than 50 characters.', trigger: 'blur'},
                        { validator: validateNoHTML, trigger: 'blur' }
                    ],
                    phone: [
                        { required: true, message: 'Required', trigger: 'blur'},
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
        async fetch({ store, params, query, redirect, env }) {

            // console.log('Is Page Completed: ' + store.getters.getPageState('contact'))
            // console.log('Company Name from Store: ' + store.state.company.name)
            
            if (store.state.page_state.find(page => page.name === 'contact').completed) {
                console.log('Verification completed.')
            }
            else if (query.sseid) {
                store.commit('SET_GUID', query.sseid)

                let resp = await store.dispatch('verifyGUIDAA', query.sseid)
                //resp => { success: (bool), message: (str), code: (int) }

                //console.log('Verification response from store: ' + JSON.stringify(resp))
                if (resp.success) {
                    console.log('verification successful (fetch)')
                    console.log('Email (SS2): ' + store.state.email.email_address)
                }
                else {
                    console.error('verification failed (fetch) - code: ' + resp.code)
                    console.error('Store Error Status: ' + store.state.error.is_error_status)
                    //redirect('/error')
                }
            }
            else
            {                    
                let msg = 'You must have a link provided by the email registration flow. If your link has expired, you can obtain a new link from the email, '
                msg += 'or you can re-register your email account.'

                store.dispatch('setErrorState', msg, 'CONT-01')
            }
            
        },
        mounted: function() {
            
            if (this.$store.state.error.is_error_status)
            {                
                this.$router.push({ name: "error"})
            }            

            //console.log('Email (CS): ' + this.$store.state.email.email_address)

            // Won't need this if the Properties tied to the Store work for validation
            //this.contactForm.firstname = this.$store.state.user.firstname
            this.input_firstname = this.$store.state.user.firstname
            this.contactForm.lastname = this.$store.state.user.lastname
            this.contactForm.phone = this.$store.state.user.phone
            // Using this to get around the inability to call the vue-tel-intl validation
            // method on pageload. Since the validation only runs after onInput or onBlur
            // the custom validator code won't work until an action is taken. This will
            // interfere with pre-loading the field from the store. 
            //this.contactForm.phone_isvalid = this.$store.state.user.phone_isvalid

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
            updatePhoneValidation(phone_validator_event) { //{number, isValid, country}
                //console.log(phone_validator_event)

                let number = phone_validator_event.number
                let isValid = phone_validator_event.isValid
                let country = phone_validator_event.country

                //console.log(number, isValid, country)
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

        },
        components: {
            SymphonyBilling,
            SymphonyFooter
        }
    }
</script>
<style>
    /*This is necessary to ensure the dropdown is positioned on top of the stuff under it*/
    .vue-tel-input ul {
        z-index: 100;
    }

</style>