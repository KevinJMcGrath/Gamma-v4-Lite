<template>
    <div class="lite-layout">
        <div class="lite-body">
            <Row type="flex" justify="center">
                <i-col span=7 class="lite-col" style="border-right: 1px solid lightgray;">
                    <Timeline>
                        <TimelineItem class="completed-icon">
                            <ion-icon name="checkmark-circle" slot="dot"></ion-icon>
                            <p class="timeline-completed-label">Your Information  <a @click="handleGotoContact()"><ion-icon name="create"></ion-icon>Edit</a></p>
                            <div class="timeline-spacer"></div>
                        </TimelineItem>
                        <TimelineItem class="completed-icon">
                            <ion-icon name="checkmark-circle" slot="dot"></ion-icon>
                            <p class="timeline-completed-label">Company Information  <a @click="handleGotoCompany()"><ion-icon name="create"></ion-icon>Edit</a></p>
                            <div class="timeline-spacer"></div>
                        </TimelineItem>
                        <TimelineItem color="#00557F">
                            <p class="timeline-current-label">Billing</p>
                            <div class="timeline-spacer"></div> 
                            <div class="timeline-content" v-bind:class="{height_override: !$store.state.billing.same_billing_address_flag}">
                                <p class="timeline-billing-subgroup">Card Info</p>
                                <Form ref="billing_form" :model="billingForm" :rules="validation_rules" @submit.native.prevent>
                                    <div class="lite-container-row"> 
                                        Name on Card<br/>
                                        <FormItem prop="fullname"> 
                                            <i-input v-model="input_fullname"></i-input>
                                        </FormItem>
                                    </div>

                                    <div v-bind:class="{hide_stripe: has_stripe_token}">
                                    <p style="color: #ED3F14; font-size: 0.9em;">{{billingForm.stripeError.message}}</p>                                    
                                    <Row :gutter=6>
                                        <i-col span=20>
                                            <div class="lite-container-row stripe-container"> 
                                                Card Number<br/>
                                                <div ref="vue_stripe_card_number" id="stripe-card-number" class="field empty"></div>                                            
                                            </div>
                                        </i-col>
                                        <i-col span=3>
                                            <div class="helper-image"><img src="../assets/images/cc-front.png" /></div>
                                        </i-col>
                                    </Row>

                                    <div class="lite-container-row stripe-container"> 
                                        <Row :gutter=6>
                                            <i-col span="10">
                                                Expiration Date<br/>
                                                <div ref="vue_stripe_card_exp" id="stripe-card-exp" class="field empty"></div>
                                            </i-col>
                                            <i-col span="10">
                                                Security Code<br/>
                                                <div ref="vue_stripe_card_cvc" id="stripe-card-cvc" class="field empty"></div>
                                            </i-col>
                                            <i-col span=3 >
                                                <div class="helper-image"><img src="../assets/images/cc-back.png" /></div>
                                            </i-col>   
                                        </Row>
                                    </div>
                                    </div>

                                    <div style="font-weight:bold; margin-bottom: 15px;" v-bind:class="{hide_stripe: !has_stripe_token}">
                                        <p>Credit card information securely stored. Use this link to reset the entry fields.</p>
                                        <a @click="ResetStripePanel()">Change Card Details</a>
                                    </div>

                                    <p class="timeline-billing-subgroup">Billing Address</p>

                                    <div class="lite-container-row" style="height: 20px; margin-bottom: 10px;">
                                        <label for="bill_addr" style="height:25px">
                                            <input ref="bill_addr" type="checkbox" v-model="input_billing_addr" name="billing_addr_check" @change="handleBillingAddr"/>
                                            <span> Use Company Address</span>
                                        </label>
                                    </div>

                                    <div v-bind:class="{hide_billing: $store.state.billing.same_billing_address_flag}">

                                        <div class="lite-container-row"> 
                                            Address Line 1<br/>
                                            <FormItem prop="address1"> 
                                                <i-input v-model="input_add1" placeholder="123 Main Street"></i-input>
                                            </FormItem>
                                        </div>
                                        <div class="lite-container-row"> 
                                            Address Line 2<br/>
                                            <FormItem prop="address2"> 
                                                <i-input v-model="input_add2" placeholder="Apt, Office, Suite"></i-input>
                                            </FormItem>
                                        </div>
                                        <div class="lite-container-row2">
                                            Country<br/>
                                            <FormItem prop="country">                                                         
                                                <country-dropdown v-bind:selected_country="input_country" v-on:country-changed="handleCountryComponentChanged"/> 
                                            </FormItem>
                                        </div>

                                        <div class="lite-container-row"> 
                                            <Row :gutter="8">                                                
                                                <i-col span=12>
                                                    City<br/>
                                                    <FormItem prop="city"> 
                                                        <i-input v-model="input_city"></i-input>
                                                    </FormItem>
                                                </i-col>
                                                <i-col span=12>
                                                    {{state_label}}<br/>
                                                    <FormItem prop="state"> 
                                                        <state-dropdown v-bind:selected_state="input_state" v-bind:selected_country="input_country" 
                                                            v-on:state-changed="handleStateComponentChanged"></state-dropdown>
                                                    </FormItem>
                                                </i-col>
                                            </Row>
                                        </div>

                                        <div class="lite-container-row"> 
                                            <Row :gutter="8">                                            
                                                <i-col span=12>
                                                    {{zip_label}}<br/>
                                                    <FormItem prop="zip_code"> 
                                                        <i-input v-model="input_zip"></i-input>
                                                    </FormItem>
                                                </i-col>                                                
                                            </Row>
                                        </div>
                                    </div>
                                    <div>
                                        <button :disabled="!!loading" v-bind:class="{button_disabled: loading}" 
                                            class="button-style-1" style="height: 32px; width: 100px;" @click="handleGotoReview()">Next</button>
                                    </div>                                   
                                </Form>
                            </div>
                        </TimelineItem>
                        <TimelineItem color="gray">
                            <p>Review</p>
                        </TimelineItem>

                    </Timeline>
                </i-col>
                <i-col span=7 class="lite-col">
                    <symphony-billing />
                </i-col>                
            </Row>
        </div>
        <symphony-footer v-bind:is-absolute="false"/>
    </div>  
</template>
<script>
    import SymphonyBilling from '~/components/SymphonyBilling.vue'
    import SymphonyFooter from '~/components/SymphonyFooter.vue'    
    import CountryDropdown from '~/components/CountryDropdown.vue'
    import StateDropdown from '~/components/StateDropdown.vue'    

    const htmlRe = new RegExp(String.raw`</?\w+((\s+\w+(\s*=\s*(?:".*?"|'.*?'|[\^'">\s]+))?)+\s*|\s*)/?>`)

    // Moved these declarations to the global scope to avoid problems later. 
    // May not be necessary. Then again, it may not be necessary to keep 
    // stuff off the data object. 
    let stripe = undefined
    let stripe_elements = undefined
    
    let cardNumber = undefined
    let cardExp = undefined
    let cardCVC = undefined

    export default {
        
        data() {
            const validateReqIfUs = (rule, value, callback) => {
                if(this.is_country_us && !value.replace(/\s+/,'').length) {
                    callback(new Error('Required'))
                }
                else {
                    callback()
                }
            }

            const validateIfDiffAddr = (rule, value, callback) => {
                if (!this.$store.state.billing.same_billing_address_flag && !value)
                {
                    callback(new Error('Required'))
                }
                else {
                    callback()
                }
            }
            
            const validateNoHTML = (rule, value, callback) => {
                if (htmlRe.test(value) === true) {
                    callback(new Error('Invalid format.'))
                }
                else {
                    callback()
                }
            }

            return {
                loading: false,
                page_title: 'Symphony - Billing Details',
                billingForm: {
                    fullname: '',
                    address1: '',
                    address2: '',
                    city: '',
                    state: '',
                    zip_code: '',
                    country: '',                    
                    stripeError: ''
                },
                validation_rules: {
                    fullname: [
                        { required: true, message: 'Required', trigger: 'blur' },
                        { type: 'string', 'min': 1, 'max': 150, message: 'Full Name must be less than 150 characters.', trigger: 'blur'},
                        { validator: validateNoHTML, trigger: 'blur' }
                    ],
                    address1: [                        
                        { validator: validateIfDiffAddr, trigger: 'blur' },
                        { type: 'string', 'min': 1, 'max': 100, message: 'Address 1 must be less than 100 characters.', trigger: 'blur'},
                        { validator: validateNoHTML, trigger: 'blur' }
                    ],
                    address2: [
                        { validator: validateNoHTML, trigger: 'blur' },
                        { type: 'string', 'min': 1, 'max': 50, message: 'Address 2 must be less than 50 characters.', trigger: 'blur'},
                    ],
                    city: [
                        { validator: validateIfDiffAddr, trigger: 'blur' },
                        { type: 'string', 'min': 1, 'max': 50, message: 'City must be less than 50 characters.', trigger: 'blur'},
                        { validator: validateNoHTML, trigger: 'blur' }
                    ],
                    state: [
                        { validator: validateIfDiffAddr, trigger: 'blur' },
                        { type: 'string', 'min': 1, 'max': 50, message: 'State must be less than 50 characters.', trigger: 'blur'},
                        { validator: validateNoHTML, trigger: 'blur' }
                    ],
                    zip_code: [
                        { validator: validateIfDiffAddr, trigger: 'blur' },
                        { type: 'string', 'min': 1, 'max': 25, message: 'Postal Code must be less than 25 characters.', trigger: 'blur'},
                        { validator: validateNoHTML, trigger: 'blur' }
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
        fetch({ store }) {
            store.commit('SET_PAGE_STARTED', 'billing')
        },
        mounted: function() {

            if (!this.input_fullname)
                this.input_fullname = this.$store.state.user.firstname + ' ' + this.$store.state.user.lastname

            this.billingForm.fullname = this.input_fullname

            this.billingForm.address1 = this.$store.state.billing.address1
            this.billingForm.address2 = this.$store.state.billing.address2
            this.billingForm.city = this.$store.state.billing.city
            this.billingForm.state = this.$store.state.billing.billing_state
            this.billingForm.zip_code = this.$store.state.billing.zip_code
            this.billingForm.country = this.$store.state.billing.country            

            stripe = Stripe(process.env.stripe_public_key);

            stripe_elements = stripe.elements({
                fonts: [
                    {cssSrc: 'https://fonts.googleapis.com/css?family=Lato'}
                ]
            });

            this.MountStripeElements();

            if (!this.$store.getters.getPageState('contact'))
            {
                this.$Modal.error({
                    title: 'Missing Information',
                    content: 'We need more of Your Information. Click Ok to go back to that page.',
                    onOk: () => {                        
                        this.prior_page_Ok('contact')
                    }, 
                    okText: 'Ok'
                })
                
            }
            else if (!this.$store.getters.getPageState('company'))
            {
                this.$Modal.error({
                    title: 'Missing Information',
                    content: 'We need more information about your Company. Click Ok to go back to that page.',
                    onOk: () => {
                        this.prior_page_Ok('company')
                    }, 
                    okText: 'Ok'
                })
            }
        },
        computed: {
            is_country_us: {
                get () {                    
                    return this.$store.state.user.country_code.toLowerCase() === 'us'
                }
            },
            state_label: {
                get () {                    
                    return (this.is_country_us ? 'State' : 'State/Provice')
                }
            },
            zip_label: {
                get () {
                    return (this.is_country_us ? 'Zip Code' : 'Postal Code')
                }
            },
            has_stripe_token: {
                get () {
                    return this.$store.state.billing.stripe_token !== '' &&
                        this.$store.state.billing.stripe_token !== {} &&
                        this.$store.state.billing.stripe_token.hasOwnProperty('id')
                }
                
            },
            input_fullname: {
                get () {
                    return this.$store.state.billing.card_fullname
                },
                set (value) {
                    this.billingForm.fullname = value
                    this.$store.commit('SET_CARD_FULLNAME', value)
                }
            },
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
            },
            input_country: {
                get () {
                    return this.$store.state.billing.country
                },
                set (value)
                {                    
                    this.billingForm.country = value
                    this.$store.commit('SET_BILLING_COUNTRY', value)
                }
            },
            input_billing_addr: {
                get () {
                    return this.$store.state.billing.same_billing_address_flag
                },
                set (value)
                {
                    this.$store.commit('SET_SAME_BILLING_ADDRESS', value)
                }
            }
        },
        methods: {
            handleBillingAddr(event) {
                // Hooking into the check event, not used at present.
                if (event.srcElement.checked)
                {

                }
            },
            handleCountryComponentChanged(event_output) {
                // v-bind on custom components doesn't call the setter for the v-model on the parent page
                // Instead, we listen to the on-change event (or whatever event is emitted by the component)
                // and explicityly call the property
                this.input_country = event_output                
            },
            handleStateComponentChanged(event_output) {
                this.input_state = event_output
            },
            prior_page_Ok(page_name) {
                this.$router.push({name: page_name, query: { sseid: this.$store.state.status.guid }})
            },
            ResetStripePanel() { 
                this.$store.commit('SET_STRIPE_TOKEN', '')
            },
            handleGotoContact() {
                this.$router.push({ name: "contact", query: { sseid: this.$store.state.status.guid }})
            },
            handleGotoCompany() {
                this.$router.push({ name: "company", query: { sseid: this.$store.state.status.guid }})
            },
            handleGotoReview () {
                this.$refs['billing_form'].validate((valid) => {
                    this.billingForm.stripeError = '';

                    if (valid && this.has_stripe_token)
                    {
                        this.$store.commit('SET_PAGE_COMPLETE', 'billing')
                        this.$router.push({name: "summary", query: { sseid: this.$store.state.status.guid }});  
                    }
                    else if (valid)
                    {
                        this.loading = true
                        // The create token call takes a single element. You can apparently
                        // just submit one element of the collection and it will obtain the 
                        // the others automatically.
                        stripe.createToken(cardNumber).then(function(result) { 
                            console.log('string token submitted')
                            if (result.token)
                            {
                                this.$store.commit('SET_STRIPE_TOKEN', result.token)

                                this.$store.commit('SET_PAGE_COMPLETE', 'billing')
                                this.$router.push({name: "summary", query: { sseid: this.$store.state.status.guid }});  
                            }
                            else if (result.error) {
                                this.billingForm.stripeError = result.error;
                                this.loading = false
                            } else {
                                this.billingForm.stripeError = 'Unable to validate your credit card info. Please contact Symphony.'
                                this.loading = false
                            }                   

                        //Needed to bind "this" in order to get this promise declaration to 
                        //have the correct scope. Inside the promise, this becomes undefined. We
                        //need it to keep attached to the Vue instance
                        //https://stackoverflow.com/questions/39196501/vuejs-async-component-data-and-promises
                        }.bind(this)).catch(function (err) {
                            this.loading = false
                            console.error(err);
                        }.bind(this));
                    }
                })

                                              
            },
            MountStripeElements() {               
                // Build the styles collection. The elements constructor takes an object 
                // as a parameter that includes a fonts property for passing information
                // about what fonts you wish to use. 
                var elementStyles = {
                    base: {
                        color: '#32325D',
                        fontWeight: 500,
                        fontFamily: 'Lato, Consolas, Menlo, monospace',
                        fontSize: '16px',
                        fontSmoothing: 'antialiased',
                        '::placeholder': { color: '#CFD7DF' },
                        ':-webkit-autofill': { color: '#e39f48' },
                        //':focus': { border: '2px solid #0395a1' }
                    },
                    invalid: {
                        color: '#E25950',
                        '::placeholder': { color: '#FFCCA5' },
                    },
                };

                // I guess this just gives the names of the classes the elements use. Whatevs
                var elementClasses = {
                    focus: 'focused',
                    empty: 'empty',
                    invalid: 'invalid',
                };

                // Now we build each individual element. 
                // Here, I'm breaking out the three card elements into individual "mounts"
                // so they can be styled and organized better. 
                // In prior iterations, I used the combo element that just emitted
                // all three fields in the iframe.

                // Note that the objects are created from the elements collection
                // and that each object has a mount method that takes the
                // class id of a div on the page as it's target. 
                cardNumber = stripe_elements.create('cardNumber', {
                    style: elementStyles,
                    classes: elementClasses
                })
                cardNumber.mount(this.$refs.vue_stripe_card_number)

                cardExp = stripe_elements.create('cardExpiry', {
                    style: elementStyles,
                    classes: elementClasses
                })
                cardExp.mount(this.$refs.vue_stripe_card_exp)

                cardCVC = stripe_elements.create('cardCvc', {
                    style: elementStyles,
                    classes: elementClasses
                })
                cardCVC.mount(this.$refs.vue_stripe_card_cvc)
                
            }
        },
        components: {
            SymphonyBilling,
            SymphonyFooter,
            CountryDropdown,
            StateDropdown
        }
    }

    function BuildElements() {

    }
</script>
<style scoped>

    .timeline-billing-subgroup {
        font-weight: bold;
        border-bottom: 1px solid lightgray;
        padding-bottom: 5px;
        margin-bottom: 15px;
    }

    .stripe-container .field {
        border-radius: 4px;
        padding: 8px 20px;
        border: 1px solid #a3a3a3;
    }

    .helper-image {
        padding-top: 25px;
    }
 
    /*.stripe-container .field.focus,
    .stripe-container .field:focus {
        border: 2px solid #0395a1;
    }*/

    .hide_stripe {
        display: none;
    }

    .show_stripe {
        display: block;
    }

    .hide_billing {
        display: none;
    }

    .show_billing {
        display: block;
    }

    .height_override {
        height: 800px;
    }
</style>

