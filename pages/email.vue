<template>
    <div class="lite-layout">
        <div class="lite-body">
            <Row type="flex" justify="center">
                <i-col span=10 offset=4 class="lite-col">
                    <p class="info-header">First, let's confirm your email address.</p>
                    <div class="lite-container-row">
                        Business Email
                        <Form ref="email_form" :model="emailForm" :rules="validation_rules" @submit.native.prevent>
                            <FormItem prop="email">
                                <i-input class="email-input" v-model="input_email" placeholder="Enter your business email" v-on:on-keydown="key_handler" ></i-input>
                            </FormItem> 
                        </Form>
                    </div>
                    <div > 
                        <button :disabled="!!loading" v-bind:class="{button_disabled: loading}" 
                            class="button-style-1 button-dimensions" 
                            @click="handleValidateEmail()">
                            <span v-bind:class="{hideOnLoading: loading}">Next</span>
                            <span v-bind:class="{showOnLoading: loading, hideOnLoading: !loading}">
                                <img class="spinner-image" src="../assets/images/blue-spinner.gif" />
                            </span>
                        </button>
                    </div>
                </i-col>
            </Row>
        </div>
        <symphony-footer is-absolute/>
    </div>        
</template>
<script>
    const axios = require('axios')
    import SymphonyFooter from '~/components/SymphonyFooter.vue'

    export default {
        data() {
            const validateFreemail = (rule, value, callback) => {
                if (value !== '' && value !== 'kevinmcgr@gmail.com')
                {
                    var re = '[a-zA-Z_\\.-]+@((hotmail)|(yahoo)|(gmail))\\.[a-z]{2,4}';
                    if (value.toLowerCase().match(re))
                    {
                        this.loading = false
                        callback(new Error('Business domain email addresses only.'));    
                        
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
                        { required: true, message: 'Required', trigger: 'blur'},
                        { type: 'email', message: 'Invalid email format', trigger: 'blur'},
                        { type: 'string', 'min': 1, 'max': 100, message: 'Email address must be less than 50 characters.', trigger: 'blur'},
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
            key_handler(key_event) {               
                if (key_event.keyCode === 32) {                    
                    event.preventDefault()
                }
                else if (key_event.keyCode === 13) {
                    if (!this.loading) {
                        this.handleValidateEmail()
                    }
                }
            },
            domain_check() {
                let retval = false
                let check_code = this.$store.dispatch('domainCheck', this.input_email)

                if (check_code === 0) { 
                    retval = true 
                } else if (check_code === -1) {
                    this.$Notice.error({
                        title: 'Error Verifying Email Address',
                        desc: 'Business domain email addresses only.',
                        duration: 6
                    })
                } else {
                    this.$Notice.error({
                        title: 'Error Verifying Email Address',
                        desc: 'There was a problem verifying your email. Try again later.',
                        duration: 6
                    })
                }

                return retval
            },
            validate_sfdc() {
                let retval = false
                let resp = this.$store.dispatch('verifyEmailSFDC')

                if (resp.success) {
                    if (resp.vcode === 'ver01') {
                        this.$router.push({ name: 'email-thankyou' })
                    }
                    else if (resp.vcode === 'ver02') {
                        // Re-verification sent. Include the 'cd' param to tell the 
                        // thank you page that it's a re-verification
                        this.$router.push({name: "email-thankyou", query:{cd: '1086453', em: response.data.encoded}})
                    }
                    else {
                        this.loading = false
                        this.$Notice.error({
                            title: 'Error Verifying Email Address',
                            desc: 'There was a problem verifying your email. Try again later.',
                            duration: 6
                        })
                    }
                }
                else {
                    this.$Notice.error({
                        title: 'Error Verifying Email Address',
                        desc: resp.message,
                        duration: 6
                    })
                }
            },
            handleValidateEmail() {
                this.loading = true
                console.log('handleValidateEmail')                
                let is_domain_valid = false

                this.$refs['email_form'].validate((is_valid) => {
                    console.log('validator: ' + is_valid)                   

                    if (is_valid)
                    {
                        console.log('Form valid')
                        is_domain_valid = this.domain_check()

                        if (is_domain_valid) {
                            this.validate_sfdc()
                        }
                    } else {
                        console.log('Form INVALID')
                    }
                })

                this.loading = false
            }
        },
        computed: {
            input_email: {
                get () {                    
                    return this.$store.state.email.email_address                    
                },
                set (value) {
                    this.emailForm.email = value
                    this.$store.commit('SET_EMAIL', value)
                }
            }
        },
        components: {
            SymphonyFooter
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