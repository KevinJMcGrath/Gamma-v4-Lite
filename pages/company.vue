<template>
    <div class="lite-layout">        
        <div class="lite-body">
            <Row type="flex" justify="center">
                <i-col span=10 offset="4" class="lite-col" style="border-right: 1px solid lightgray;">
                    <Timeline>
                        <TimelineItem class="completed-icon" color="#0395a1">
                            <ion-icon name="checkmark-circle" slot="dot"></ion-icon>
                            <p class="timeline-completed-label">Your Information</p>
                            <div class="timeline-spacer"></div>
                        </TimelineItem>
                        <TimelineItem>
                            <p class="timeline-current-label">Company Information</p>
                            <div class="timeline-spacer"></div>   
                            <div class="timeline-content" style="height:280px;">
                                <Form :model="companyForm" :rules="validation_rules">
                                    <div class="lite-container-row"> 
                                        Company Legal Name<br/>
                                        <FormItem prop="phone"> 
                                            <i-input v-model="input_company"></i-input>
                                        </FormItem>
                                    </div>
                                    <div class="lite-container-row"> 
                                        Industry<br/>
                                        <FormItem prop="industry">
                                            <Select v-model="input_industry" placeholder="Select">
                                                <Option value="Agriculture-Mining">Agriculture &amp; Mining</Option>
                                                <Option value="Communications-Media-IT">Communications, Media, IT</Option>
                                                <Option value="Consulting-Services">Consulting Services</Option>
                                                <Option value="Consumer-Services">Consumer Services</Option>
                                                <Option value="eCommerce">eCommerce</Option>
                                                <Option value="Education">Education</Option>
                                                <Option value="Energy-Oil-Gas">Energy, Oil and Gas</Option>
                                                <Option value="Financial-Services">Financial Services</Option>
                                                <Option value="Food-Beverage">Food &amp; Beverage</Option>
                                                <Option value="Government">Government</Option>
                                                <Option value="Healthcare-Pharmaceuticals-Biotec">Healthcare, Pharma and Biotech</Option>
                                                <Option value="Insurance">Insurance</Option>
                                                <Option value="Manufacturing">Manufacturing</Option>
                                                <Option value="Media-Entertainment">Media &amp; Entertainment</Option>
                                                <Option value="Nonprofit">Nonprofit</Option>
                                                <Option value="Professional-Services">Professional Services</Option>
                                                <Option value="Public-Sector">Public Sector</Option>
                                                <Option value="RealEstate-Construction">Real Estate &amp; Construction</Option>
                                                <Option value="Restaurant-Hospitality">Restaurant &amp; Hospitality</Option>
                                                <Option value="Retail">Retail</Option>
                                                <Option value="Technology">Technology</Option>
                                                <Option value="Transportation-Storage">Transportation &amp; Storage</Option>
                                                <Option value="Wholesale-Distribution">Wholesale &amp; Distribution</Option>
                                                <Option value="Other">Other</Option>
                                            </Select>
                                        </FormItem>
                                    </div>

                                    <div class="lite-container-row2"> 
                                        Total Symphony Users<br/>
                                        <FormItem prop="seats" :show-message=true>
                                            <InputNumber :min="10" :step="1" v-model="input_seats"></InputNumber>
                                            <a href="#" @click="pricing_window = true" style="margin-left: 10px;">Pricing</a>
                                            <Modal v-model="pricing_window" title="Pricing" @on-ok="modal_ok" ok-text="Ok" cancel-text="Cancel">
                                                <p>
                                                    Standard business tier pricing: $240 per user, annually. <br/>
                                                    Additionally, new clients are charged a one-time setup fee of $500. <br/>
                                                    <br/>
                                                    Clients may provision users over their subscription amount; those additional users are billed as 'overage' at the standard rate, pro-rated for the number of days per month the client over their contracted user licenses. 
                                                </p>
                                            </Modal>
                                        </FormItem>
                                    </div>
                                    
                                    <div class="lite-button-row">
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
                <i-col span=6 class="lite-col">
                    <symphony-billing />
                </i-col>
                <i-col span=2></i-col>
            </Row>
        </div>
        
    </div>  
</template>
<script>
    import SymphonyBilling from '~/components/SymphonyBilling.vue'

    export default {
        data() {
            return {
                page_title: 'Symphony - Company',
                pricing_window: false,
                companyForm: {
                    companyname: '',
                    industry: '',
                    seats: 10
                },
                validation_rules: {
                    seats: [
                        //For some reason, I needed to specify the type for this rule to work consistently
                        { required: true, type: 'number', message: 'Please enter a non-zero number of seats.', trigger: 'change' }
                    ],
                    companyname: [
                        { required: true, message: 'Please enter your company\'s legal name.', trigger: 'blur' }
                    ],
                    industry: [
                        { required: true, message: 'Please select a primary industry from the dropdown.', trigger: 'blur'}
                    ]

                }
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
        mounted: function() {

            this.companyForm.companyname = this.$store.state.company.name
            this.companyForm.industry = this.$store.state.company.industry
            this.companyForm.seats = this.$store.state.service.seats
            
        },
        computed: {
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
                    return this.$store.state.company.industry
                },
                set (value) {
                    this.companyForm.industry = value
                    this.$store.commit('SET_INDUSTRY', value)
                }
            },
            input_seats: {
                get () {
                    return this.$store.state.service.seats
                },
                set (value) {
                    this.companyForm.seats = value;
                    this.$store.commit('SET_SEATS', value)
                }
            }
        },
        methods: {
            handleGotoService () {
                this.$refs['companyForm'].validate((valid) => {
                    if (valid) 
                    {
                        this.$store.commit('SET_PAGE_COMPLETE', 'company')
                        this.$router.push({name: "service"});        
                    }
                    else
                    {
                        this.$Message.error();
                    }
                })
                
                
            },
            handleGotoContact() {
                this.$router.push({name: "contact"})
            },
            modal_ok() {

            }
        },
        components: {
            SymphonyBilling
        }
    }
</script>
<style >
    
</style>