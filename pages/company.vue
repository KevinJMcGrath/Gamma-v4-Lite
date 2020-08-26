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
                            <div class="timeline-content" style="height:320px;">
                                <Form ref="company_form" :model="companyForm" :rules="validation_rules" @submit.native.prevent>
                                    <div class="lite-container-row"> 
                                        Legal Name of Business<br/>
                                        <FormItem prop="companyname"> 
                                            <i-input v-model="input_company"></i-input>
                                        </FormItem>
                                    </div>
                                    <div class="lite-container-row"> 
                                        Industry<br/>
                                        <FormItem prop="industry" >
                                            <i-select v-model="input_industry" placeholder="Select Industry" >
                                                <i-option v-for="industry in industry_list" v-bind:value="industry.value" :key="industry.id">{{industry.label}}</i-option>
                                            </i-select>
                                        </FormItem>
                                    </div>

                                    

                                    <!-- <div v-bind:class="seat_pricing_notice_class">
                                        <Alert show-icon>Your total cost will be lower if you purchase 50 licenses.</Alert>
                                    </div> -->
                                    
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
        <!--<symphony-footer v-bind:is-absolute="false"/>-->
        <symphony-footer is-absolute/>
    </div>  
</template>
<script>
    import SymphonyBilling from '~/components/SymphonyBilling.vue'
    import SymphonyFooter from '~/components/SymphonyFooter.vue'
    const htmlRe = new RegExp(String.raw`</?\w+((\s+\w+(\s*=\s*(?:".*?"|'.*?'|[\^'">\s]+))?)+\s*|\s*)/?>`)

    export default {
        data() {
            const validateMinSeats = (rule, value, callback) => {
                if (this.input_seats < 0) {
                    callback(new Error('Please enter a valid value.'))
                }

                callback()
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
                    seats: 100
                },
                validation_rules: {
                    seats: [
                        //For some reason, I needed to specify the type for this rule to work consistently
                        { required: true, type: 'number', message: 'Required', trigger: 'change' },
                        { validator: validateMinSeats, trigger: 'change' } 
                    ],
                    companyname: [
                        { required: true, message: 'Required', trigger: 'blur' },
                        { type: 'string', 'min': 1, 'max': 100, message: 'Company Name must be less than 100 characters.', trigger: 'blur'},
                        { validator: validateNoHTML, trigger: 'blur' }
                    ],
                    industry: [
                        { required: true, message: 'Required', trigger: 'change'}
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
            this.companyForm.seats = this.$store.state.service.seats         
            
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

            }
        },
        components: {
            SymphonyBilling,
            SymphonyFooter
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
</style>