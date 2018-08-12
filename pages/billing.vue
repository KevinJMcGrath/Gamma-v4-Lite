<template>
    <div class="lite-layout">
        <div class="lite-body">
            <Row>
                <i-col span=4></i-col>
                <i-col span=10 type="flex" justify="center" class="lite-col" style="border-right: 1px solid lightgray;">
                    <Timeline>
                        <TimelineItem>
                            <p style="color: #0395a1;">Your Information</p>
                        </TimelineItem>
                        <TimelineItem>
                            <p style="color: #006caf;font-size:1.6em;">Company Information</p>
                            <div class="timeline-content" style="height:280px;">
                            <Form ref="billingForm" :model="billingForm" :rules="validation_rules">
                                <div class="lite-container-row"> 
                                    Company Legal Name<br/>
                                    <FormItem prop="phone"> 
                                        <i-input v-model="input_phone"></i-input>
                                    </FormItem>
                                </div>
                                <div class="lite-container-row" style="height:60px;"> 
                                    <Row :gutter="4">
                                        <i-col span=12>
                                            First Name<br/>
                                            <FormItem prop="firstname"> 
                                                <i-input v-model="input_firstname"></i-input>
                                            </FormItem>
                                        </i-col>
                                        <i-col span=12>
                                            Last Name<br/>
                                            <FormItem prop="lastname"> 
                                                <i-input v-model="input_lastname"></i-input>
                                            </FormItem>
                                        </i-col>                                    
                                    </Row>
                                </div>
                                <div class="lite-container-row" style="height:70px;"> 
                                    Daytime Phone Number<br/>
                                    <FormItem prop="phone"> 
                                        <!--<i-input v-model="input_phone"></i-input>-->
                                        <!--<input id="phone-input" v-el:phone-input type="tel" v-model="input_phone">-->
                                        <!--<vue-tel-input v-model="input_phone" @onInput="handlePhoneValidation" style="height:30px;width:50%;"></vue-tel-input>-->
                                    </FormItem>
                                </div>
                                <div>
                                    <button class="button-style-1" style="height: 32px; width: 100px;" @click="handleGotoBilling()">Next</button>
                                </div>
                            </Form>
                            </div>
                        </TimelineItem>
                        <TimelineItem>
                            <p>Billing</p>
                        </TimelineItem>
                        <TimelineItem>
                            <p>Review</p>
                        </TimelineItem>

                    </Timeline>
                </i-col>
                <i-col span=8 type="flex" justify="center"  class="lite-col">
                    <symphony-edge/>
                </i-col>
                <i-col span=2></i-col>
            </Row>
        </div>       
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