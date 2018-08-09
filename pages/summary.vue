<template>
    <div class="sym-layout">
        <Layout>
            <Header class="headerClass"></Header>
            <Layout class="layoutClass">
                <Sider hide-trigger class="sidebarClass">
                    <Steps :current="5" direction="vertical">
                        <Step title="Profile" content="Your contact information"></Step>
                        <Step title="Organization" content="Some details about your company"></Step>
                        <Step title="Settings" content="Choose the right Symphony settings for your team"></Step>
                        <Step title="Terms of Service" content="Symphony terms and conditions"></Step>
                        <Step title="Billing" content="Enter your payment information"></Step>
                        <Step title="Confirmation" content="Review and confirm your information"></Step>
                        <Step title="Get Started!" content=""></Step>
                    </Steps>
                </Sider>
                <Content class="contentClass">
                    <Layout class="invisibleLayout">
                        <Row type="flex" justify="center" class="logoRow">
                            <i-col span=2 >
                                <img src="../assets/images/Purchase-Icon.png" height=75/>
                            </i-col>
                        </Row>
                        <Row type="flex" justify="center" class="standardRow">
                            <i-col :xs=24 :sm=18 :md=10 :lg=8>
                                <p class="p2">Confirmation</p>
                            </i-col>
                        </Row>
                        <Row type="flex" justify="center" class="standardRow">
                            <i-col :xs=24 :sm=20 :md=18 :lg=16>
                                <p  class="p4">
                                    Please review your Symphony details below before completing your purchase.<br/>
                                    When you are happy with your information, click "Purchase Now".
                                </p>
                            </i-col>
                        </Row>
                        <Row type="flex" justify="center" class="standardRow">
                            <i-col span=16>
                                <Card>
                                    <p slot="title">Your Symphony Details</p>
                                    <p>
                                        <!-- Contact -->
                                        <Row :gutter=16>
                                            <i-col span=6 style="text-align:right;font-weight:bold;">Name:</i-col> <!--border:1px solid green;-->
                                            <i-col span=6 style="text-align:left;">{{ $store.state.user.firstname }} {{ $store.state.user.lastname }}</i-col> <!--border:1px solid orange;-->

                                            <!-- Spacer Element -->
                                            <!--<i-col span=2 style="text-align:center;border: 1px solid purple;">_@_</i-col>-->

                                            <i-col span=4 style="text-align:right;font-weight:bold;">Email:</i-col>
                                            <i-col span=8 style="text-align:left;">{{ $store.state.email.email_address }}</i-col>
                                        </Row>
                                        <!-- Company -->
                                        <Row :gutter=16>
                                            <i-col span=6 style="text-align:right;font-weight:bold;">Company:</i-col>
                                            <i-col span=6 style="text-align:left;">{{ $store.state.company.name }}</i-col>

                                            <i-col span=4 style="text-align:right;font-weight:bold;">Industry:</i-col>
                                            <i-col span=6 style="text-align:left;">{{ $store.state.company.industry }}</i-col>
                                        </Row>
                                        <!-- Service -->
                                        <Row :gutter=16>
                                            <i-col span=6 style="text-align:right;font-weight:bold;">Vanity Name:</i-col>
                                            <i-col span=6 style="text-align:left;">{{ $store.state.service.vanity_name }}</i-col>                                            

                                            <i-col span=4 style="text-align:right;font-weight:bold;">User Licenses:</i-col>
                                            <i-col span=4 style="text-align:left;">{{ $store.state.service.seats }}</i-col>
                                        </Row>
                                        <!-- Billing -->
                                        <Row :gutter=16 style="margin-top:20px;">
                                            <i-col span=6 style="text-align:right;font-weight:bold;">Billing Street:</i-col>
                                            <i-col span=10 style="text-align:left;">{{ $store.state.billing.address1 }}</i-col>
                                        </Row>
                                        <Row :gutter=16>
                                            <i-col span=6 style="text-align:right;font-weight:bold;">City:</i-col>
                                            <i-col span=6 style="text-align:left;">{{ $store.state.billing.city }}</i-col>                                            

                                            <i-col span=4 style="text-align:right;font-weight:bold;">State:</i-col>
                                            <i-col span=4 style="text-align:left;">{{ $store.state.billing.billing_state }}</i-col>
                                        </Row>
                                        <Row :gutter=16 style="margin-bottom:20px;">
                                            <i-col span=6 style="text-align:right;font-weight:bold;">Postal Code:</i-col>
                                            <i-col span=10 style="text-align:left;">{{ $store.state.billing.zip_code }}</i-col>
                                        </Row>

                                        <Row :gutter=16 style="margin-top: 20px;margin-bottom: 20px;">
                                            <i-col span=6 style="text-align:right;font-weight:bold;">Card:</i-col>
                                            <i-col span=6 style="text-align:left;">****-****-****-{{ user_credit_last4 }} ({{ user_credit_brand }})</i-col>

                                            <i-col span=4 style="text-align:right;font-weight:bold;">Expires:</i-col>
                                            <i-col span=6 style="text-align:left;">{{ user_credit_exp_mon }}/{{ user_credit_exp_year }}</i-col>
                                        </Row>

                                        <!-- Pricing -->
                                        <Row :gutter=16>
                                            <i-col span=6 style="text-align:right;font-weight:bold;">Setup Fee:</i-col>
                                            <i-col span=4 style="text-align:left;">${{ $store.state.pricing.onetime_fees}}.00</i-col>

                                            
                                            <i-col span=6 style="text-align:right;font-weight:bold">Annual Subscription:</i-col>
                                            <i-col span=6 style="text-align:left;">${{ annual_subscription }}.00</i-col>

                                        </Row>
                                        <Row type="flex" justify="start" class="standardRow">
                                            <i-col span=2></i-col>
                                            <i-col span=18>
                                                <p style="font-size:0.8em;">Your subscription will be for <b>12 months</b> from the date of delivery. The setup fee will be charged only once. 
                                                <br/><br/>
                                                Your card will automatically be charged for your subscription yearly on your anniversary date. </p>
                                            </i-col>
                                        </Row>
                                    </p>
                                </Card>
                               
                               
                            </i-col>
                        </Row>
                        <Row type="flex" justify="center" class="standardRow">
                            <i-col :xs=24 :sm=20 :md=18 :lg=16>
                                <Alert show-icon>
                                    Your credit card will <b>not</b> be charged until your instance is complete and you are provided with login credentials.
                                </Alert>
                            </i-col>
                        </Row>
                        <Row type="flex" justify="center" class="alertRow">
                            <i-col :xs=24 :sm=20 :md=18 :lg=16>
                                <Alert show-icon>
                                    Your instance is created at time of purchase. It may take up to <b style="color: Firebrick;">2 hours</b> to receive your login details.
                                </Alert>
                            </i-col>
                        </Row>
                        <Row type="flex" justify="center" class="buttonRow">
                            <i-col :xs=5 :sm=4 :md=3 :lg=2 class-name="backButtonCol">
                                <Button type="primary" size="large" @click="handleGotoBilling">Back</Button>
                            </i-col>
                            <i-col :xs=6 :sm=5 :md=4 :lg=3 class-name="nextButtonCol">
                                <Button type="primary" :loading="loading" size="large" @click="handleGotoThankyou">Purchase Now</Button>
                            </i-col>
                        </Row>
                    </Layout>
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
            return {
                loading: false,
                page_title: 'Symphony - Review Your Purchase',
                accordionPanel: ['servicePanel','pricePanel'],
                serviceSummary: {
                    directoryname: '',
                    subdomain: '',
                    seats: 0,
                    region: '',
                    support_tier: '',
                    promocode: '',
                    onetime_fees: 0

                }
            }
        },
        head() {
            return {
                title: this.page_title,
                meta: [
                    { hid: 'description', name: 'description', content: 'Review your purchase details.' }
                ]
                
            }
        },
        mounted: function() {

        },
        computed: {            
            user_credit_last4: () => (this.$store ? this.$store.state.billing.stripe_token.card.last4 : '1234'),
            user_credit_brand: () => (this.$store ? this.$store.state.billing.stripe_token.card.brand : 'VISA'),
            user_credit_exp_mon: () => (this.$store ? this.$store.state.billing.stripe_token.card.exp_month : '01'),
            user_credit_exp_year: () => (this.$store ? this.$store.state.billing.stripe_token.card.exp_year : '20'),
            annual_subscription: function() {
                return (this.$store ? this.$store.state.service.seats * this.$store.state.pricing.pupm * 12 : 0);
            }
        },
        methods: {
            handleGotoThankyou() {
                this.loading = true
                //NOTE: You cannot rebind "arrow functions"
                console.log(JSON.stringify(this.$store.state))
                axios.post('/api/purchase-submit', this.$store.state)
                .then(function(response) {

                    console.log('Success (Summary Page)')
                    console.log('Response Code: ' + response.status)

                    this.$store.commit('SET_PAGE_COMPLETE', 'summary')
                    //this.$router.push({name: "thankyou"}); 


                }.bind(this))
                .catch(function(error) {
                    this.loading = false

                    console.error('Failed to POST')
                    console.error(error)

                    if (error.response)
                    {
                        console.error('Response Code: ' + error.response.status)
                        console.error('Response Text: ' + error.response.statusText)
                        console.error('Response Body: ' + error.response.data)
                        console.error('Response Headers: ' + error.response.headers)

                        res.json( { success: false, message: 'HTTP Error' })
                    }
                    else if (error.request)
                    {
                        // Request was made but no response was received
                        console.error(error.request)

                        res.json( { success: false, message: 'System Error' })
                    }
                    else
                    {
                        console.error('Unknown Error: ' + error.message)

                        res.json( { success: false, message: 'Unknown Error' })
                    }


                }.bind(this))                               
            },
            handleGotoBilling() {
                this.$router.push({name: "billing"})
            }
        }
    }
</script>
<style scoped>


</style>