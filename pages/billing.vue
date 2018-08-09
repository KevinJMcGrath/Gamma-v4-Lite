<template>
    <div class="sym-layout">
        <Layout>
            <Header class="headerClass"></Header>
            <Layout>
                <Sider hide-trigger class="sidebarClass">
                    <Steps :current="4" direction="vertical">
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
                                <img src="../assets/images/Billing-Icon.png" height=75/>
                            </i-col>
                        </Row>
                        <Row type="flex" justify="center" class="standardRow">
                            <i-col :xs=24 :sm=18 :md=10 :lg=8>
                                <p class="p2">Billing</p>
                            </i-col>
                        </Row>
                        <Row type="flex" justify="center" class="standardRow">
                            <i-col :xs=24 :sm=20 :md=18 :lg=16>
                                <p class="p4">
                                    Please provide  your payment information. Symphony uses <a href="#">Stripe</a> to process payments to provide you an easy, secure experience.  
                                </p>
                            </i-col>
                        </Row>

                        <Form ref="billingForm" :model="billingForm" :label-width="150" :rules="validation_rules">
                        <Row type="flex" justify="center"  class="standardRow">
                            <i-col :xs=20 :sm=20 :md=18 :lg=14>
                                <Card>
                                    <p slot="title">Payment Details</p>
                                    <p>
                                        <Row type="flex" justify="center">
                                            <i-col span=18>
                                                <div class="stripeBox">
                                                    <div id="card-element"></div>
                                                </div>
                                                <p style="color: #ED3F14; font-size: 0.9em;">{{billingForm.stripeError.message}}</p>
                                            </i-col>
                                        </Row>
                                        <Row>
                                            <i-col span=24>
                                                <FormItem :label-width=10 prop="address1">
                                                    <i-input v-model="input_add1" placeholder="Street Address"></i-input>
                                                </FormItem>
                                            </i-col>
                                        </Row>
                                        <Row>
                                            <i-col span=10>
                                                <FormItem :label-width=10 prop="city">
                                                    <i-input v-model="input_city" placeholder="City"></i-input>
                                                </FormItem>
                                            </i-col>
                                            <i-col span=6 >
                                                <FormItem :label-width=10 prop="state">
                                                    <i-input v-model="input_state" placeholder="State"></i-input>
                                                </FormItem>
                                            </i-col>
                                            <i-col span=8>
                                                <FormItem :label-width=10 prop="zip_code">
                                                    <i-input v-model="input_zip" placeholder="ZIP"></i-input>
                                                </FormItem>
                                            </i-col>
                                        </Row>
                                    </p>
                                </Card>
                            </i-col>
                        </Row>
                        </Form>

                        <Row type="flex" justify="center" class="standardRow">
                            <i-col :xs=24 :sm=20 :md=18 :lg=16>
                                <Alert show-icon>
                                    Your credit card will <b>not</b> be charged until you receive your login information.
                                </Alert>
                            </i-col>
                        </Row>

                        <Row type="flex" justify="center" class="buttonRow">
                            <i-col :xs=5 :sm=4 :md=3 :lg=2 class-name="backButtonCol">
                                <Button type="primary" size="large" @click="handleGotoLegal">Back</Button>
                            </i-col>
                            <i-col :xs=6 :sm=5 :md=4 :lg=3 class-name="nextButtonCol">
                                <Button type="primary" :loading="loading" size="large" @click="handleGotoSummary">Continue</Button>
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
    var stripe = Stripe('pk_test_gUJYd9BdGY6XdYL9RltHkmRe');
    var stripeElement;

    export default {
        data() {
            return {
                loading: false,
                page_title: 'Symphony - Billing Details',
                billingForm: {
                    address1: '',
                    address2: '',
                    city: '',
                    state: '',
                    zip_code: '',
                    stripeError: ''
                },
                validation_rules: {
                    address1: [
                        { required: true, message: 'Please provide your street address.', trigger: 'blur' }
                    ],
                    city: [
                        { required: true, message: 'Please provide your city or town.', trigger: 'blur' }
                    ],
                    state: [
                        { required: true, message: 'Please provide your state or province.', trigger: 'blur' }
                    ],
                    zip_code: [
                        { required: true, message: 'Please provide your zip or postal code.', trigger: 'blur' }
                    ]
                }
            }
        },
        head() {
            return {
                title: this.page_title,
                meta: [
                    { hid: 'description', name: 'description', content: 'Enter your billing information.' }
                ]
                
            }
        },
        mounted: function() {

            this.billingForm.address1 = this.$store.state.billing.address1
            this.billingForm.address2 = this.$store.state.billing.address2
            this.billingForm.city = this.$store.state.billing.city
            this.billingForm.state = this.$store.state.billing.billing_state
            this.billingForm.zip_code = this.$store.state.billing.zip_code

            stripeElement = MountStripeElements();
        },
        computed: {
            input_add1: {
                get () {
                    return this.$store.state.billing.address1
                },
                set (value)
                {
                    this.billingForm.address1 = value
                    this.$store.commit('SET_ADD1', value)
                }
            },
            input_add2: {
                get () {
                    return this.$store.state.billing.address2
                },
                set (value)
                {
                    this.billingForm.address2 = value
                    this.$store.commit('SET_ADD2', value)
                }
            },
            input_city: {
                get () {
                    return this.$store.state.billing.city
                },
                set (value)
                {
                    this.billingForm.city = value
                    this.$store.commit('SET_CITY', value)
                }
            },
            input_state: {
                get () {
                    return this.$store.state.billing.billing_state
                },
                set (value)
                {
                    this.billingForm.state = value
                    this.$store.commit('SET_BILLING_STATE', value)
                }
            },
            input_zip: {
                get () {
                    return this.$store.state.billing.zip_code
                },
                set (value)
                {
                    this.billingForm.zip_code = value
                    this.$store.commit('SET_ZIP', value)
                }
            }
        },
        methods: {            
            handleGotoSummary () {
                this.$refs['billingForm'].validate((valid) => {
                    this.billingForm.stripeError = '';
                    if (valid)
                    {
                        this.loading = true
                        stripe.createToken(stripeElement).then(function(result) {
                            if (result.token)
                            {
                                //globalState.billing.stripe_token = result.token;
                                this.$store.commit('SET_STRIPE_TOKEN', result.token)

                                this.$store.commit('SET_PAGE_COMPLETE', 'billing')
                                this.$router.push({name: "summary"});  
                            }
                            else if (result.error) {

                                this.billingForm.stripeError = result.error;
                                this.loading = false
                                //console.error(result.error);
                            } else {
                                this.billingForm.stripeError = 'Unable to validate your credit card info. Please contact Symphony.'
                                this.loading = false
                                //console.error('Failed to obtain token from Stripe.');
                            }                   

                        //Needed to bind "this" in order to get this promise declaration to 
                        //have the correct scope. Inside the promise, this becomes undefined. We
                        //need it to keep attached to the Vue instance
                        //https://stackoverflow.com/questions/39196501/vuejs-async-component-data-and-promises
                        }.bind(this)).catch(function (err) {
                            console.error(err);
                        });
                    }
                    else
                    {
                        this.$Message.error();
                    }
                })

                                              
            },
            handleGotoLegal() {
                this.$router.push({name: "legal"})
            }
        }
    }

    function MountStripeElements()
    {
        
        var elements = stripe.elements();
        
        var card = elements.create('card', {
          hidePostalCode: true,
          style: {
            base: {
              iconColor: '#F99A52',
              color: '#32315E',
              fontWeight: 400,
              fontFamily: '"Helvetica Neue", "Helvetica", sans-serif',
              fontSize: '15px',

              '::placeholder': {
                color: 'steelblue',
              }
            },
          }
        });
        card.mount('#card-element');

        return card;
    }
</script>
<style scoped>

    .stripeBox {
        border: 1px solid lightgray;
        padding: 10px;
        margin-bottom: 10px;
        border-radius: 20px;
    }

</style>