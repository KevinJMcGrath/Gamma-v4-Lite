<template>
    <div class="lite-layout">
        <div class="lite-body">
            <Row type="flex" justify="center">
                <i-col span=10 offset=4 class="lite-col" style="border-right: 1px solid lightgray;">
                    <p class="info-header">First, let's confirm your email address.</p>
                    <div class="lite-container-row">
                        We'll confirm your email to help protect your identity. Then we'll ask for your business and payment 
                        information. 
                    </div>
                    <div class="lite-container-row">
                        Business Email
                        <Form ref="emailForm" :model="emailForm" :rules="validation_rules" @submit.native.prevent> <!--@submit.native.prevent prevents Enter from submitting-->
                            <FormItem prop="email">
                                <i-input class="email-input" v-model="input_email" placeholder="Enter your business email" ></i-input>
                            </FormItem> 
                        </Form>
                    </div>
                    <div>
                        <button :disabled="!!loading" v-bind:class="{button_disabled: loading}" class="button-style-1" 
                            style="height: 32px; width: 100px;" @click="handleValidateEmail('emailForm')">Get Started</button>
                    </div>
                </i-col>
                <i-col span=8 class="lite-col">
                    <symphony-edge/>
                </i-col>
                <i-col span=2></i-col>
            </Row>
        </div>
    </div>        
</template>
<script>
    import SymphonyEdge from '~/components/SymphonyEdge.vue'
    const axios = require('axios')

    export default {
        data() {
            const validateFreemail = (rule, value, callback) => {
                if (value !== '' && value !== 'kevinmcgr@gmail.com')
                {
                    var re = '[a-zA-Z_\\.-]+@((hotmail)|(yahoo)|(gmail))\\.[a-z]{2,4}';
                    if (value.match(re))
                    {
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
                    email: 'kevinmcgr@gmail.com'
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

            if (query.hasOwnProperty('em') && query.em.length !== 0)
            {
                store.commit('SET_EMAIL', atob(query.em.replace(/-/g, '=')))
            }

            if (query.hasOwnProperty('tf') && query.tf === '1')
            {
                store.commit('SET_FLAG', true)
            }
        },
        mounted: function() {

        },
        methods: {
            toggleButtonActive() {

            },
            handleValidateEmail(name) {
                this.loading = true

                console.log('(handleValidateEmail) axios default baseURL: ' + axios.default.baseURL)

                this.$refs[name].validate((valid) => {
                    
                    if (this.test_flag)
                    {   
                        let enc = btoa(this.input_email).replace(/=/g, '-')
                        this.$router.push({name: "email-thankyou", query:{qid: enc}})
                    }
                    else if (valid)
                    {
                        let doVerify = false
                        
                        axios.post('/api/domain-check', { email_address: this.input_email }).then(function(response) {
                            console.log('email.vue - axios debugging')
                            console.log(response.data)
                            console.log(response.headers)
                            console.log(response.config)

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
                                    duration: 0
                                })
                            }                           

                        }.bind(this)).then(function(response) {
                            console.log('Starting SFDC verification...')
                            console.log('doVerify: ' + doVerify)
                            if (doVerify)
                            {
                                axios.post('/api/verify', { email_address: this.input_email }).then(function(response) {

                                    this.$router.push({name: "email-thankyou", query:{qid: response.data.encoded}})

                                }.bind(this)).catch(function (error) {
                                    console.error(error.response);
                                    this.loading = false

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

                                    this.$Notice.error({
                                        title: 'Error Verifying Email Address',
                                        desc: d,
                                        duration: 0
                                    })
                                }.bind(this))
                            }
                        }.bind(this)).catch(function (error) {
                            console.error(error)
                            console.error(error.response);
                            this.loading = false
                        }.bind(this))

                        
                        
                        
                    }                    
                    else
                    {
                        this.$Message.error()
                        this.loading = false
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
            },
            test_flag: {
                get () {
                    return this.$store.state.status.test_flag
                },
                set (value) {
                    this.$store.commit('SET_FLAG', value)
                }
            }
        },
        components: {
            SymphonyEdge
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