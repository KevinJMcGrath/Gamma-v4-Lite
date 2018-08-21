<template>
    <div class="lite-layout">        
        <div class="lite-body">
            <Row type="flex" justify="center">
                <i-col span=10 offset="4" class="lite-col" style="border-right: 1px solid lightgray;">
                    <Timeline>
                        <TimelineItem class="completed-icon">
                            <ion-icon name="checkmark-circle" slot="dot"></ion-icon>
                            <p class="timeline-completed-label">Your Information</p>
                            <div class="timeline-spacer"></div>
                        </TimelineItem>
                        <TimelineItem>
                            <p class="timeline-current-label">Company Information</p>
                            <div class="timeline-spacer"></div>   
                            <div class="timeline-content" style="height:280px;">
                                <Form ref="company_form" :model="companyForm" :rules="validation_rules" @submit.native.prevent>
                                    <div class="lite-container-row"> 
                                        Company Legal Name<br/>
                                        <FormItem prop="companyname"> 
                                            <i-input v-model="input_company"></i-input>
                                        </FormItem>
                                    </div>
                                    <div class="lite-container-row"> 
                                        Industry<br/>
                                        <FormItem prop="industry">
                                            <Select v-model="input_industry" placeholder="Select">
                                                <Option v-for="industry in industry_list" v-bind:value="industry.value" :key="industry.id">{{industry.label}}</Option>
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
        mounted: function() {
            console.log('loaded company.vue')
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
            handleGotoBilling () {
                this.$refs['company_form'].validate((valid) => {
                    if (valid) 
                    {
                        this.$store.commit('SET_PAGE_COMPLETE', 'company')
                        this.$router.push({name: "billing", query: { sseid: this.$store.state.status.guid }});        
                    }
                    else
                    {
                        this.$Message.error();
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
            SymphonyBilling
        }
    }
</script>
<style >
    
</style>