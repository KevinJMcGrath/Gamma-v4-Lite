<template>
    <div class="lite-layout">        
        <div class="lite-body">
            <Row type="flex" justify="center">
                <i-col span=10 offset="4" class="lite-col" style="border-right: 1px solid lightgray;">
                    <Timeline>
                        <TimelineItem class="completed-icon">
                            <ion-icon name="checkmark-circle" slot="dot"></ion-icon>
                            <p class="timeline-completed-label">Your Information <a @click="handleGotoContact()"><ion-icon name="create"></ion-icon>Edit</a></p>
                            <div class="timeline-spacer"></div>
                        </TimelineItem>
                        <TimelineItem color="#00557F">
                            <p class="timeline-current-label">Company Information</p>
                            <div class="timeline-spacer"></div>   
                            <div class="timeline-content height-override">
                                <Form ref="company_form" :model="companyForm" :rules="validation_rules" @submit.native.prevent>
                                    <div> 
                                        Industry<br/>
                                        <FormItem prop="industry" >
                                            <i-select v-model="input_industry" placeholder="Select Industry" >
                                                <i-option v-for="industry in industry_list" v-bind:value="industry.value" :key="industry.id">{{industry.label}}</i-option>
                                            </i-select>
                                            <!--<v-select v-model="input_industry" :options="industry_list" ></v-select>-->
                                        </FormItem>
                                    </div>
                                    <div class="lite-container-row"> 
                                        Legal Name of Business<br/>
                                        <FormItem prop="companyname"> 
                                            <i-input v-model="input_company"></i-input>
                                        </FormItem>
                                    </div>                                    

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
                                                    <!-- I don't need the custom-event to trigger the reactivity changes -->
                                                    <state-dropdown v-model="input_state"></state-dropdown>
                                                </FormItem>
                                            </i-col>
                                        </Row>
                                    </div>

                                    <div class="lite-container-row"> 
                                        <Row :gutter="8">
                                            <i-col span=12>
                                                {{zip_label}}<br/>
                                                <FormItem prop="zip_code"> 
                                                    <i-input v-model="input_zip" ></i-input>
                                                </FormItem>
                                            </i-col> 
                                                                                                                          
                                        </Row>
                                    </div>                                    
                                    <div > 
                                        <Row :gutter="8">
                                            <i-col span=12>
                                                Country<br/>
                                                <FormItem prop="country">                                                     
                                                    <country-dropdown v-bind:selected_country="input_country" v-on:country-changed="handleCountryComponentChanged"/>
                                                </FormItem>
                                            </i-col> 
                                            <i-col span=12>
                                                Company Phone Number<br/>
                                                <FormItem prop="phone"> 
                                                    <vue-tel-input ref="vuetel" v-model="input_phone" @onInput="updatePhoneValidation" style="height:32px"
                                                        :preferredCountries="['US','GB','FR','DE']"></vue-tel-input>
                                                </FormItem>
                                            </i-col>
                                        </Row>                                        
                                    </div>
                                    <div class="lite-button-row">
                                        <button class="button-style-1" style="height: 32px; width: 100px;" @click="handleGotoBilling()">Next</button>
                                    </div>
                                </Form>
                            </div>
                        </TimelineItem>
                        <TimelineItem color="gray">
                            <p>Billing</p>
                        </TimelineItem>
                        <TimelineItem color="gray">
                            <p>Review</p>
                        </TimelineItem>
                    </Timeline>
                </i-col>
                <i-col span=8 class="lite-col">
                    <symphony-billing />
                </i-col>
                <i-col span=2></i-col>
            </Row>
        </div>
        <symphony-footer v-bind:is-absolute="false"/>
        <!--<symphony-footer is-absolute/>-->
    </div>  
</template>
<script>
    import SymphonyBilling from '~/components/SymphonyBilling.vue'
    import SymphonyFooter from '~/components/SymphonyFooter.vue'
    import CountryDropdown from '~/components/CountryDropdown.vue'
    import StateDropdown from '~/components/StateDropdown.vue'
    import vSelect from 'vue-select'

    const htmlRe = new RegExp(String.raw`</?\w+((\s+\w+(\s*=\s*(?:".*?"|'.*?'|[\^'">\s]+))?)+\s*|\s*)/?>`)

    export default {
        data() {
            /*const validateMinSeats = (rule, value, callback) => {
                if (this.input_seats < 0) {
                    callback(new Error('Please enter a valid value.'))
                }

                callback()
            }*/

            const validateCustomPhone = (rule, value, callback) => {
                if (this.$refs['vuetel'].phoneObject.isValid)
                {
                    callback('')
                }
                else
                {
                    callback(new Error('Invalid phone number format.'))
                }
            }  

            const validateReqIfUs = (rule, value, callback) => {
                if(this.is_country_us && !value.replace(/\s+/,'').length) {
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
                page_title: 'Symphony - Company',
                pricing_window: false,
                companyForm: {
                    companyname: '',
                    industry: '',
                    address1: '',
                    address2: '',
                    city: '',
                    state: '',
                    zip_code: '',
                    phone: '',
                    country: '',
                    country_detail: {
                        areaCodes: null,
                        dialCode: '',
                        iso2: '',
                        name: '',
                        is_valid: false,
                        number: ''
                    }
                },
                validation_rules: {
                    /*seats: [
                        //For some reason, I needed to specify the type for this rule to work consistently
                        { required: true, type: 'number', message: 'Required', trigger: 'change' },
                        { validator: validateMinSeats, trigger: 'change' } 
                    ],*/
                    companyname: [
                        { required: true, message: 'Required', trigger: 'blur' },
                        { type: 'string', 'min': 1, 'max': 100, message: 'Company Name must be less than 100 characters.', trigger: 'blur'},
                        { validator: validateNoHTML, trigger: 'blur' }
                    ],
                    /*industry: [
                        { required: true, message: 'Required', trigger: 'change'}
                    ],*/
                    address1: [
                        { required: true, message: 'Required', trigger: 'blur' },
                        { type: 'string', 'min': 1, 'max': 100, message: 'Address 1 must be less than 100 characters.', trigger: 'blur'},
                        { validator: validateNoHTML, trigger: 'blur' }
                    ],
                    address2: [
                        { validator: validateNoHTML, trigger: 'blur' },
                        { type: 'string', 'min': 1, 'max': 50, message: 'Address 2 must be less than 50 characters.', trigger: 'blur'},
                    ],
                    city: [
                        { required: true, message: 'Required', trigger: 'blur' },
                        { type: 'string', 'min': 1, 'max': 50, message: 'City must be less than 50 characters.', trigger: 'blur'},
                        { validator: validateNoHTML, trigger: 'blur' }
                    ],
                    state: [
                        { validator: validateReqIfUs, trigger: 'blur'},
                        { type: 'string', 'min': 1, 'max': 50, message: 'State must be less than 50 characters.', trigger: 'blur'},
                        { validator: validateNoHTML, trigger: 'blur' }
                    ],
                    zip_code: [
                        { validator: validateReqIfUs, trigger: 'blur'},
                        { type: 'string', 'min': 1, 'max': 25, message: 'Postal Code must be less than 25 characters.', trigger: 'blur'},
                        { validator: validateNoHTML, trigger: 'blur' }
                    ],
                    phone: [
                        { required: true, message: 'Required', trigger: 'blur'},
                        { validator: validateCustomPhone, trigger: 'change' }
                    ]

                },
                industry_list: [
                    { id: 1, value: "Agriculture-Mining", label: "Agriculture & Mining" },
                    { id: 2, value: "Communications-Media-IT", label: "Communications, Media, IT" },
                    { id: 3, value: "Consulting-Services", label: "Consulting Services" },
                    { id: 4, value: "Consumer-Services", label: "Consumer Services" },
                    { id: 5, value: "eCommerce", label: "eCommerce" },
                    { id: 6, value: "Education", label: "Education" },
                    { id: 7, value: "Energy-Oil-Gas", label: "Energy, Oil and Gas" },
                    { id: 8, value: "Financial-Services", label: "Financial Services" },
                    { id: 9, value: "Food-Beverage", label: "Food & Beverage" },
                    { id: 10, value: "Government", label: "Government" },
                    { id: 12, value: "Healthcare-Pharmaceuticals-Biotec", label: "Healthcare, Pharma and Biotech" },
                    { id: 13, value: "Insurance", label: "Insurance" },
                    { id: 14, value: "Manufacturing", label: "Manufacturing" },
                    { id: 15, value: "Media-Entertainment", label: "Media & Entertainment" },
                    { id: 16, value: "Nonprofit", label: "Nonprofit" },
                    { id: 17, value: "Professional-Services", label: "Professional Services" },
                    { id: 18, value: "Public-Sector", label: "Public Sector" },
                    { id: 19, value: "RealEstate-Construction", label: "Real Estate & Construction" },
                    { id: 20, value: "Restaurant-Hospitality", label: "Restaurant & Hospitality" },
                    { id: 21, value: "Retail", label: "Retail" },
                    { id: 22, value: "Technology", label: "Technology" },
                    { id: 23, value: "Transportation-Storage", label: "Transportation & Storage" },
                    { id: 24, value: "Wholesale-Distribution", label: "Wholesale & Distribution" },
                    { id: 25, value: "Other", label: "Other" }
                ]
            }
        },
        head() {
            return {
                title: this.page_title,
                meta: [
                    { hid: 'description', name: 'description', content: 'Use this page to enter details about your company.' }
                ]
                
            }
        },
        fetch({ store }) {
            store.commit('SET_PAGE_STARTED', 'company')
        },
        mounted: function() {

            this.companyForm.companyname = this.$store.state.company.name
            this.companyForm.industry = this.$store.state.company.industry            
            this.companyForm.address1 = this.$store.state.company.address1
            this.companyForm.address2 = this.$store.state.company.address2
            this.companyForm.city = this.$store.state.company.city
            this.companyForm.state = this.$store.state.company.company_state
            this.companyForm.zip_code = this.$store.state.company.postal_code
            this.companyForm.country = this.$store.state.company.country
            this.companyForm.phone = this.$store.state.company.phone
            
            // Check to make sure the contact page was completed first. 
            // This prevents people from using the URLs directly to skip through the flow.
            if (!this.$store.getters.getPageState('contact'))
            {
                this.$Modal.error({
                    title: 'Missing Information',
                    content: 'Required information is missing from the previous page. Click ok to go back.',
                    onOk: () => {
                        this.prior_page_Ok()
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
            seat_pricing_notice_class () {
                if (this.$store.state.service.seats >= 34 && this.$store.state.service.seats < 50) {
                    return 'alert-row-visible'
                }

                return 'alert-row-hidden'
            },
            input_company: {
                get () {
                    return this.$store.state.company.name
                },
                set (value) {
                    this.companyForm.companyname = value
                    this.$store.commit('SET_COMPANY', value)
                }
            },
            input_industry: {
                get () {
                    return this.getSelectOptionValueByLabel(this.$store.state.company.industry)
                },
                set (value) {
                    this.companyForm.industry = value 
                    this.$store.commit('SET_INDUSTRY', this.getSelectOptionLabelByValue(value))
                }
            },
            input_add1: {
                get () {
                    return this.$store.state.company.address1
                },
                set (value)
                {
                    this.companyForm.address1 = value
                    this.$store.commit('SET_CO_ADD1', value)
                }
            },
            input_add2: {
                get () {
                    return this.$store.state.company.address2
                },
                set (value)
                {
                    this.companyForm.address2 = value
                    this.$store.commit('SET_CO_ADD2', value)
                }
            },
            input_city: {
                get () {
                    return this.$store.state.company.city
                },
                set (value)
                {
                    this.companyForm.city = value
                    this.$store.commit('SET_CO_CITY', value)
                }
            },
            input_state: {
                get () {                    
                    return this.$store.state.company.company_state
                },
                set (value)
                {
                    this.companyForm.state = value
                    this.$store.commit('SET_CO_STATE', value)                    
                }
            },
            input_zip: {
                get () {
                    return this.$store.state.company.postal_code
                },
                set (value)
                {
                    this.companyForm.zip_code = value
                    this.$store.commit('SET_CO_ZIP', value)
                }
            },
            input_country: {
                get () {                    
                    return this.$store.state.company.country
                },
                set (value)
                {                    
                    this.companyForm.country = value
                    this.$store.commit('SET_CO_COUNTRY', value)
                    console.log('COMPANY:input_country:SET - ' + value)
                }
            },
            input_phone: {
                get () {
                    return this.$store.state.company.phone
                },
                set (value) {
                    this.companyForm.phone = value;
                    this.$store.commit('SET_CO_PHONE', value)
                }
            }
        },
        methods: {
            prior_page_Ok() {
                let sid = this.$store.state.status.guid || this.$route.query.sseid

                this.$router.push({name: "contact", query: { sseid: sid }});  
            },
            handleGotoContact() {
                this.$router.push({ name: "contact", query: { sseid: this.$store.state.status.guid }})
            },
            handleGotoBilling () {                
                this.$refs['company_form'].validate((valid) => {
                    if (valid) 
                    {
                        this.$store.commit('SET_PAGE_COMPLETE', 'company')
                        this.$router.push({name: "billing", query: { sseid: this.$store.state.status.guid }});        
                    }

                })                
            },
            handleCountryComponentChanged(event_output) {                
                // v-bind on custom components doesn't call the setter for the v-model on the parent page
                // Instead, we listen to the on-change event (or whatever event is emitted by the component)
                // and explicityly call the property
                this.input_country = event_output
            },            
            getSelectOptionLabelByValue(val) {
                if (this.industry_list && !!val) {
                    let ind_obj = this.industry_list.find(inds => inds.value === val)

                    if (ind_obj) {
                        return ind_obj.label
                    }
                    else {
                        return 'Other'
                    }
                } 
            },
            getSelectOptionValueByLabel(lbl) {
                if (this.industry_list && !!lbl) {
                    let ind_obj = this.industry_list.find(inds => inds.label === lbl)

                    if (ind_obj) {
                        return ind_obj.value
                    }
                    else {
                        return 'Other'
                    }
                } 
            },
            modal_ok() {

            },
            updatePhoneValidation(phone_validator_event) { //{number, isValid, country}
                //console.log(phone_validator_event)

                let number = phone_validator_event.number
                let isValid = phone_validator_event.isValid
                let country = phone_validator_event.country

                //console.log(number, isValid, country)
                this.companyForm.country_detail = {
                    areaCodes: country.areaCodes,
                    dialCode: country.dialCode,
                    iso2: country.iso2,
                    name: country.name,
                    is_valid: isValid,
                    number: number
                }

                // Forces a validation of the field on the form level, which will show the error message if it needs to. 
                this.$refs['company_form'].validateField('phone', (err_msg) => { })
                this.$store.commit('SET_COUNTRYCODE', country.iso2)
                //this.$store.commit('SET_PHONE_ISVALID', isValid)
                //this.$store.commit('SET_CO_COUNTRY', country.name)                
            }
        },
        components: {
            SymphonyBilling,
            SymphonyFooter,
            CountryDropdown,
            StateDropdown,
            vSelect
        }
    }
</script>
<style >
    .ivu-input-number-handler-wrap {
        opacity: 1 !important;
    }

    .alert-row-visible {
        display: block;
        width: 100%;
        height: 25px;
        margin-bottom: 30px;
        font-size: 1em;
    }

    .alert-row-hidden {
        display: none;
    }

    .height-override {
        height: 600px;        
    }
</style>