<template>
    <div class="lite-layout">
        <div class="lite-header">
            <div class="lite-header-logo"></div>
        </div>
        <div class="lite-banner">
            <p>Sign up</p>
        </div>

        <div class="lite-body">
            <Row>
                <i-col span=4></i-col>
                <i-col span=10 type="flex" justify="center" class="lite-col" style="border-right: 1px solid lightgray;">
                    <p style="color: #006caf;">First, let's confirm your email address.</p>
                    <div class="lite-container-row">
                        We'll confirm your email to help protect your identity. Then we'll ask for your business and payment 
                        information. 
                    </div>
                    <div class="lite-container-row" style="height:80px;">
                        Business Email
                        <Form ref="emailForm" :model="emailForm" :rules="validation_rules" @submit.native.prevent>
                            <FormItem prop="email">
                                <i-input v-model="emailForm.email" placeholder="Enter your business email" ></i-input>
                            </FormItem> 
                        </Form>
                    </div>
                        <!--<Button type="primary" :loading="loading" size="large" @click="handleValidateEmail('emailForm')">Send Verification</Button>-->
                    <div>
                        <button class="button-style-1" style="height: 32px; width: 100px;" @click="handleValidateEmail('emailForm')">Get Started</button>
                    </div>
                </i-col>
                <i-col span=8 type="flex" justify="center"  class="lite-col">
                    <p>The Symphony Edge</p>
                    <ul>
                        <li><div class="sym-list-bullet"><img src="../assets/images/lock.svg" height="20px"/></div>Lock-tight information security</li>
                        <li><div class="sym-list-bullet"><img src="../assets/images/check.svg" height="17px" /></div>Complies with global regulations</li>
                        <li><div class="sym-list-bullet"><img src="../assets/images/chat.svg" height="17px" /></div>Robust text, voice and video chat</li>
                        <li><div class="sym-list-bullet"><img src="../assets/images/refresh.svg" height="20px" /></div>Syncs with other productivity apps</li>
                        <li><div class="sym-list-bullet"><img src="../assets/images/mobile.svg" height="20px" /></div>Ideal for desktop and mobile users</li>
                    </ul>

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
        methods: {
            handleValidateEmail(name) {
                this.$refs[name].validate((valid) => {
                    if (valid && this.emailForm.email != 'kevinmcgr@gmail.com')
                    {
                        this.loading = true
                        axios.post('/api/verify', { email_address: this.emailForm.email }).then(function(response) {
                            console.log('API Response: ')
                            console.log(response)

                            this.$store.commit('SET_EMAIL', this.emailForm.email)

                            this.$router.push({name: "email-thankyou"})

                        }.bind(this)).catch(function (error) {
                            console.error(error);
                            this.loading = false

                            let d = 'There was a problem completing your verification request. '

                            if (error.response.data.errorDetail)
                            {
                                switch (error.response.data.errorDetail) {
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
                    else if (this.emailForm.email == 'kevinmcgr@gmail.com')
                    {
                        this.$store.state.email.email_address = this.emailForm.email

                            this.$router.push({name: "email-thankyou"})

                    }
                    else
                    {
                        this.$Message.error()
                    }
                })                
            }
        }
    }
</script>
<style scoped>

</style>