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
            // console.log('email from vuex: ' + store.state.email.email_address)
            if(!store.state.email.email_address)
            {
                //Load query parameters
                if (query.hasOwnProperty('em') && query.em.length !== 0)
                {
                    store.commit('SET_EMAIL', atob(query.em.replace(/-/g, '=')))
                }
                else
                {
                    //I might need to return an error here instead.
                    redirect('/email')
                }
            }
            
        },
        mounted: function() {
                // I'm going to leave this here as a reminder. I'm pretty sure I was screwing up the flow
                // by trying to set this value here after the fetch() method ran. Since I have the computed property
                // defined, after the fetch() is called and the store is updated, the getter correctly populates the
                // email address in the component body. 
                //this.input_email = this.$store.state.email.email_address
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