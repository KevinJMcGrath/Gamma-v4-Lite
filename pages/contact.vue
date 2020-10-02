<template>
    <div class="lite-layout">
        <div class="lite-body">
            <Row type="flex" justify="center">                
                <i-col span=7 class="lite-col" style="border-right: 1px solid lightgray;">
                    <Timeline>
                        <TimelineItem color="#00557F">
                            <p class="timeline-current-label">Your Information</p>
                            <div class="timeline-spacer"></div>
                            <div class="timeline-content" style="height:380px;">
                            <Form ref="contact_form_ref" :model="contactForm" :rules="validation_rules" @submit.native.prevent>
                                <div class="lite-container-row" style="height: 40px;"> 
                                    Email Address<br/>
                                    <b>{{ $store.state.email.email_address }}</b><br/>
                                </div>
                                <div class="lite-container-row"> 
                                    <Row :gutter="4">
                                        <i-col span=18>
                                            First Name<br/>
                                            <FormItem prop="firstname"> 
                                                <i-input v-model="input_firstname"></i-input>
                                            </FormItem>
                                        </i-col>
                                    </Row>
                                </div>
                                <div class="lite-container-row"> 
                                    <Row :gutter="4">
                                        <i-col span=18>
                                            Last Name<br/>
                                            <FormItem prop="lastname"> 
                                                <i-input v-model="input_lastname"></i-input>
                                            </FormItem>
                                        </i-col>                                    
                                    </Row>
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
                <i-col span=7 class="lite-col">
                    <symphony-billing />
                </i-col>

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
            
            if (store.state.page_state.find(page => page.name === 'contact').completed) {
                console.log('Verification completed.')
            }
            else if (query.sseid) {
                store.commit('SET_GUID', query.sseid)

                let resp = await store.dispatch('verifyGUIDAA', query.sseid)
 
                if (resp.success) {
                    console.log('verification successful (fetch)')
                    console.log('Email (SS2): ' + store.state.email.email_address)
                }
                else {
                    console.error('verification failed (fetch) - code: ' + resp.code)
                    console.error('Store Error Status: ' + store.state.error.is_error_status)                    
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
        },
        computed: {
            input_firstname: {
                get () {
                    return this.$store.state.user.firstname
                },
                set (value) {
                    this.$store.commit('SET_FNAME', value)
                }
            },
            input_lastname: {
                get () {
                    return this.$store.state.user.lastname
                },
                set (value) {
                    this.$store.commit('SET_LNAME', value)
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
            }
        },
        components: {
            SymphonyBilling,
            SymphonyFooter
        }
    }
</script>
<style>

</style>