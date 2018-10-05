<template>
    <div class="lite-layout">
        <div class="lite-body">
            <Row type="flex" justify="center">
                <i-col span=10 offset=4 class="lite-col">
                    <p class="info-header">First, let's confirm your email address.</p>
                    <!--<div class="lite-container-row">
                        We'll confirm your email to help protect your identity. Then we'll ask for your business and payment 
                        information. 
                    </div>-->
                    <div class="lite-container-row">
                        Business Email
                        <Form ref="email_form" :model="emailForm" :rules="validation_rules" @submit.native.prevent>
                            <FormItem prop="email">
                                <i-input class="email-input" v-model="input_email" placeholder="Enter your business email" ></i-input>
                            </FormItem> 
                        </Form>
                    </div>
                    <div>
                        <button :disabled="!!loading" v-bind:class="{button_disabled: loading}" class="button-style-1" 
                            style="height: 32px; width: 100px;" @click="handleValidateEmail()">Get Started</button>
                    </div>
                </i-col>
                <i-col span=8 class="lite-col">
                    
                </i-col>
                <i-col span=2></i-col>
            </Row>
        </div>
    </div>        
</template>
<script>
    const axios = require('axios')

    export default {
        data() {
            const validateFreemail = (rule, value, callback) => {
                if (value !== '' && value !== 'kevinmcgr@gmail.com')
                {
                    var re = '[a-zA-Z_\\.-]+@((hotmail)|(yahoo)|(gmail))\\.[a-z]{2,4}';
                    if (value.toLowerCase().match(re))
                    {
                        this.loading = false
                        callback(new Error('We are not accepting freemail addresses at this time.'));    
                        
                    }
                    else
                    {
                        callback();
                    }          

                }
                else
                {
                    // the required field validator will hopefully catch this.
                    callback();
                }
            };

            return {
                page_title: 'Symphony - Verify Email',
                loading: false,
                emailForm: {
                    email: ''
                },
                validation_rules: {
                    email: [
                        { required: true, message: 'Please provide your email address.', trigger: 'blur'},
                        { type: 'email', message: 'Incorrect email format', trigger: 'blur'},
                        { validator: validateFreemail, trigger: 'blur'}
                    ]
                }
            }
        },
        head() {
            return {
                title: this.page_title,
                meta: [
                    { hid: 'description', name: 'description', content: 'Please enter your email for verification.' }
                ]
                
            }
        },
        fetch({ store, params, query, redirect, env }) {
            store.commit('RESET_STATE')
            
        },
        mounted: function() {
            if (this.$route.query.em)
            {
                let email_addy = this.$route.query.em

                if (email_addy.indexOf('@') !== -1) {
                    store.commit('SET_EMAIL', email_addy)
                }
                else {
                    store.commit('SET_EMAIL', atob(query.em.replace(/-/g, '=')))
                }
                
            }

            this.emailForm.email = this.$store.state.email.email_address
        },
        methods: {
            toggleButtonActive() {

            },
            handleValidateEmail() {
                this.$refs['email_form'].validate((valid) => {
                    if (valid)
                    {
                        let doVerify = false

                        axios.post('/api/domain-check', { email_address: this.input_email }).then(function(response) {
                            doVerify = response.data.success

                            if (response.data.server_code && response.data.server_code === 11)
                            {
                                let domain = response.data.domain_name
                                let msg = 'We do not accept freemail domains '

                                if (domain)
                                    msg += '(' + domain + ')'

                                this.$Notice.error({
                                    title: 'Error Verifying Email Address',
                                    desc: msg,
                                    duration: 6
                                })
                            }

                        }.bind(this)).then(function(response) {
                            if (doVerify)
                            {
                                this.loading = true
                                axios.post('/api/verify', { email_address: this.input_email }).then(function(response) {
                                    if (response.data && response.data.vcode) {
                                        if (response.data.vcode === 'ver01') {
                                            // Initial verification successfully sent.
                                            this.$router.push({name: 'email-thankyou', query: {em: response.data.encoded}})
                                        }
                                        else if (response.data.vcode === 'ver02') {
                                            // Re-verification sent. Include the 'cd' param to tell the 
                                            // thank you page that it's a re-verification
                                            this.$router.push({name: "email-thankyou", query:{cd: '1086453', em: response.data.encoded}})
                                        }
                                        else {
                                            this.loading = false
                                            this.$Notice.error({
                                                title: 'Error Verifying Email Address',
                                                desc: 'There was an issue with this request. Error code: ' + response.data.vcode,
                                                duration: 6
                                            })
                                        }
                                    }
                                    else {
                                        this.loading = false
                                        this.$Notice.error({
                                            title: 'Error Verifying Email Address',
                                            desc: 'There was an issue with this request. VCode was not present.',
                                            duration: 6
                                        })
                                    }
                                    

                                }.bind(this)).catch(function (error) {

                                    let d = 'There was a problem completing your verification request. '

                                    if (error.response.data.error_data.errorDetail)
                                    {
                                        switch (error.response.data.error_data.errorDetail) {
                                            case '1':
                                                d += 'Your email was previously submitted and blocked as freemail.'
                                                break
                                            case '2':
                                                d += 'Your email was previously submitted and blocked - your company is already on Symphony.'
                                                break
                                            case '3':
                                                d += 'An account with this email address already exists.'
                                                break
                                            default:
                                                break
                                        }
                                    }                           

                                    this.loading = false
                                    this.$Notice.error({
                                        title: 'Error Verifying Email Address',
                                        desc: d,
                                        duration: 6
                                    })
                                }.bind(this))
                            }
                        }.bind(this)).catch(function (error) {
                            err_msg = {
                                message: 'There was a problem verifying your email.',
                                code: 'EMAIL-01'
                            }

                            store.dispatch('sendErrorReport', error)
                            store.dispatch('setErrorState', err_msg)


                            this.$router.push({ name: "error" })                            
                        }.bind(this))
                    }
                })                
            }
        },
        computed: {
            input_email: {
                get () {
                    return this.$store.state.email.email_address                    
                },
                set (value) {
                    // I'm intentionally adding side effects to make the validation rules work. Not ideal
                    this.emailForm.email = value;
                    this.$store.commit('SET_EMAIL', value)
                }
            }
        }
    }
</script>
<style scoped>
    .info-header {
        font-size: 1.6em;
        font-weight: bold;
        margin-bottom: 20px;
        color: #006caf;
    }

    .email-input {
        width: 50%;
    }
</style>