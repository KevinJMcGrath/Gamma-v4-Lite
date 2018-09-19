<template>
    <div class="lite-layout">
        <div class="lite-body">
            <Row type="flex" justify="center" >
                <i-col span=10 offset=4 class="lite-col">
                    <Row>                        
                        <i-col span=6>
                            <img src="../assets/images/big-green-check.png" height="60px" />
                        </i-col>
                        <i-col span=16>
                            <p class="info-header">Please check your inbox for next steps.</p>
                            <div class="lite-container-row">
                                We sent a confirmation email to: <b>{{ input_email }}</b>
                            </div>
                            <div class="lite-container-row">
                                <a class="lite-link-button" @click="handleResendEmail()">Resend email</a>
                                <br/><br/>
                                <a class="lite-link-button" @click="handleChangeEmail()">Enter new email address</a>
                            </div>
                        </i-col>                    
                    </Row>
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

            return {
                page_title: 'Symphony - Thank You',
                error_state: false,
                emailAddress: ''
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
        asyncData({ store }) {
            // Really only need this when I need to capture errors that occur in 
            // fetch() AND when it's likely the user could come to the page
            // first (since the vuex store will not have been instantiated yet)
            return {
                error_state: store.state.error.is_error_status
            }
        },
        async fetch({ store, params, query, redirect, env }) {                     
            if(!store.state.email.email_address)
            {
                // A test bypass in case I need it
                if (env.is_dev && query.hasOwnProperty('t') && query.t)
                {
                    let success = await store.dispatch('loadTestData', query.t)

                    if (!success)
                    {                        
                        err_msg = {
                            message: 'You did not supply a correct test code. Contact Biz Ops.',
                            code: 'CONT-03'
                        }
                                                
                        store.dispatch('setErrorState', err_msg.message, err_msg.code)
                    }
                }
                else if (query.hasOwnProperty('em') && query.em.length !== 0)
                {
                    if (process.browser) {
                        store.commit('SET_EMAIL', atob(query.em.replace(/-/g, '=')))
                    }
                    else {
                        let buff = new Buffer(query.em.replace(/-/g, '='), 'base64')
                        store.commit('SET_EMAIL', buff.toString('ascii'))                        
                    }
                }
            }            
        },
        mounted: function() {
            if (this.$store.state.error.is_error_status)
            {                
                this.$router.push({ name: "error"})
            }
            
            // ***To access the query parameters on the client side, use this.$route.query
            if (this.$route.query.cd && this.$route.query.cd === '1086453') {
                this.$Notice.success({
                    title: 'Email verification Re-sent',
                    desc: 'Email verification re-sent to: <br/><p style="margin:10px 0;font-weight:bold;">' + this.input_email + '</p>Click Change Email to use a different address.',
                    duration: 6
                });
            }
        },
        methods: {
            handleResendEmail() {
                axios.post('/api/verify', { email_address: this.input_email, resend: true}).then(function(response) {
                    this.$Notice.success({
                        title: 'Email verification Re-sent',
                        desc: 'Email verification re-sent to: <br/><p style="margin:10px 0;font-weight:bold;">' + this.input_email + '</p>Click Change Email to use a different address.',
                        duration: 6
                    });

                }.bind(this)).catch(function (error) {
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
            },
            handleChangeEmail() {
                this.$store.commit('SET_EMAIL', '')
                this.$router.push({ name: "email" })
            }
        },
        computed: {
            input_email: {
                get () {
                    return this.$store.state.email.email_address
                },
                set (value) {
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
</style>