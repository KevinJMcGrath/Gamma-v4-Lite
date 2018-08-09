<template>
    <div class="sym-layout">
        <Layout>
            <Header class="header-bg-fix"></Header>
            <Layout class="layoutClassEmail">
                <Content class="contentClass">
                    <Row type="flex" justify="center" class="logoRow">
                        <i-col span=2 >
                            <img src="../assets/images/SymphonyLogo.png" height=75/>
                        </i-col>
                    </Row>
                    <Row type="flex" justify="center" class="standardRow">
                        <i-col :xs=24 :sm=18 :md=10 :lg=8>
                            <p class="p1">Verify your Email</p>
                        </i-col>
                    </Row>
                    <Row type="flex" justify="center" class="standardRow">
                        <i-col :xs=18 :sm=12 :md=10 :lg=10>
                            <p class="p3">
                                Enter your email to receive a verification code and continue your sign up. 
                            </p>
                        </i-col>
                    </Row>
                    <Form ref="emailForm" :model="emailForm" :rules="validation_rules" @submit.native.prevent>
                        <Row :gutter=16 type="flex" justify="center" class="standardRow">
                            <i-col span=8>
                                <FormItem prop="email">
                                    <i-input v-model="emailForm.email" placeholder="Enter your business email"></i-input>
                                </FormItem>                                 
                            </i-col>
                        </Row>
                    </Form>
                    <Row type="flex" justify="center" class="standardRow">
                        <i-col span=3>
                            <Button type="primary" :loading="loading" size="large" @click="handleValidateEmail('emailForm')">Send Verification</Button>
                        </i-col>
                    </Row>
                    <Row type="flex" justify="center" class="standardRow">
                        <i-col :xs=18 :sm=16 :md=14 :lg=10>
                            <p class="p4">
                                Symphony is not accepting sign ups from non-business emails at this time, including GMail, Yahoo and Outlook.
                            </p>
                        </i-col>
                    </Row>
                </Content>
            </Layout>
            <Footer></Footer>
        </Layout>
        
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
        methods: {
            handleValidateEmail(name) {
                this.$refs[name].validate((valid) => {
                    if (valid)
                    {
                        this.loading = true
                        axios.post('/api/verify', { email_address: this.emailForm.email }).then(function(response) {
                            console.log('API Response: ')
                            console.log(response)

                            this.$router.push({name: "email-thankyou"});

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