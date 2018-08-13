<template>
    <div class="lite-layout">
        <div class="lite-body">
            <Row type="flex" justify="center" >
                <i-col span=10 offset=4 class="lite-col" style="border-right: 1px solid lightgray;">
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

            return {
                page_title: 'Symphony - Thank You',
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
        fetch({ store, params, query, redirect }) {
            console.log('email from vuex: ' + store.state.email.email_address)
            if(!store.state.email.email_address)
            {
                //Load query parameters
                if (query.qid)
                {
                    // If you reload the page, the page is rendered serverside. The axios call on the server
                    // requires the base url to be explicitly set. 
                    // NOTE: Make sure to check this to ensure process.env.HOST/PORT are being set properly
                    // on GCP
                    let options = {}
                    if (process.server) {
                        options.baseURL = `http://${process.env.HOST || 'localhost'}:${process.env.PORT || 8080}`                        
                    }
                                        
                    //http://localhost:8080
                    return axios.post('/api/decode64', { message: query.qid }, options).then(function(response) {

                        let email_decoded = response.data.decoded  
                        
                        // This is wrong. Either I don't have access to the computed functions 
                        // or you have to call them differently from the fetch() method
                        // this.input_email = email_decoded

                        // Correct way to update the store
                        store.commit('SET_EMAIL', email_decoded)
                        //console.log('email from store: ' + store.state.email.email_address)

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
                    //I might need to return an error here instead.
                    redirect('/email')
                }
            }
            
        },
        mounted: function() {
                console.log('running mounted function')

                // I'm going to leave this here as a reminder. I'm pretty sure I was screwing up the flow
                // by trying to set this value here after the fetch() method ran. Since I have the computed property
                // defined, after the fetch() is called and the store is updated, the getter correctly populates the
                // email address in the component body. 
                //this.input_email = this.$store.state.email.email_address
        },
        methods: {
            handleResendEmail() {
               this.$Notice.success({
                title: 'Email verification Re-sent',
                desc: 'Email verification re-sent to: <br/><p style="margin:10px 0;font-weight:bold;">' + this.input_email + '</p>Click Change Email to use a different address.',
                duration: 6
               });
            },
            handleChangeEmail() {
                this.$store.commit('SET_EMAIL', '')
                this.$router.push({ name: "email" });
            }
        },
        components: {
            SymphonyEdge
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