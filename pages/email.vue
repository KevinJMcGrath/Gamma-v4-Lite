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
        methods: {
            handleValidateEmail(name) {
                this.$refs[name].validate((valid) => {
                    if (valid && this.emailForm.email != 'kevinmcgr@gmail.com')
                    {
                        this.loading = true
                        axios.post('/api/verify', { email_address: this.emailForm.email }).then(function(response) {

                            this.$store.commit('SET_EMAIL', this.emailForm.email)
                            this.$router.push({name: "email-thankyou", query:{qid: response.data.encoded}})

                        }.bind(this)).catch(function (error) {
                            //console.error(error);
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
                        axios.post('/api/encode64', { message: this.emailForm.email }).then(function(response) {

                            this.$store.commit('SET_EMAIL', this.emailForm.email)

                            this.$router.push({name: "email-thankyou", query:{qid: response.data.encoded}})


                        }.bind(this)).catch(function (error) {
                            if (error.response) {
                                console.log(error.response.data)
                                console.log(error.response.status)
                                console.log(error.response.headers)
                            }
                            else if (error.request) {
                                console.log(error.request)
                            }
                            else {
                                console.log('Error: ' + error.message)
                            }
                        })
                    }
                    else
                    {
                        this.$Message.error()
                    }
                })                
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
</style>