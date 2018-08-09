<template>
    <div class="sym-layout">
        <Layout>
            <Header class="headerClass"></Header>
            <Layout class="layoutClass">
                <Sider hide-trigger class="sidebarClass">
                    <Steps :current="1" direction="vertical">
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
                                <img src="../assets/images/Company-Icon.png" height=75/>
                            </i-col>
                        </Row>
                        <Row type="flex" justify="center" class="standardRow">
                            <i-col :xs=24 :sm=18 :md=10 :lg=8>
                                <p class="p2">Organization</p>
                            </i-col>
                        </Row>
                        <Row type="flex" justify="center" class="standardRow">
                            <i-col :xs=24 :sm=20 :md=18 :lg=16>
                                <p class="p4">
                                    Next, give us some details about your organization to help set up your Symphony experience.
                                </p>
                            </i-col>
                        </Row>
                        <Row type="flex" justify="center" class="standardRow">
                            <i-col :xs=20 :sm=20 :md=12 :lg=10>
                                <Form ref="companyForm" :model="companyForm" :label-width="150" :rules="validation_rules">
                                    <FormItem label="Company (Legal) Name" prop="companyname">                                        
                                        <Row :gutter=8>
                                            <i-col span=20>
                                                <i-input v-model="input_company"></i-input>       
                                            </i-col>
                                            <i-col span=2>
                                                <Tooltip placement="right">
                                                    <Icon type="help-circled" color="steelblue" size="15"></Icon>
                                                    <div slot="content">
                                                        <p>Please enter the legal entity name of <br/> <!-- Keep it to about 35 characters -->
                                                         your company or organization. </p>
                                                    </div>
                                                </Tooltip>
                                            </i-col>
                                        </Row>
                                    </FormItem>
                                    <FormItem label="Industry" prop="industry">
                                        <Row :gutter=8>
                                            <i-col span=20>
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
                                            </i-col>
                                            <i-col span=2></i-col>
                                        </Row>
                                    </FormItem>
                                </Form>
                            </i-col>
                        </Row>
                        <Row type="flex" justify="center" class="buttonRow">
                            <i-col :xs=5 :sm=4 :md=3 :lg=2 class-name="backButtonCol">
                                <Button type="primary" size="large" @click="handleGotoContact">Back</Button>
                            </i-col>
                            <i-col :xs=6 :sm=5 :md=4 :lg=3 class-name="nextButtonCol">
                                <Button type="primary" size="large" @click="handleGotoService">Continue</Button>
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

    export default {
        data() {
            return {
                page_title: 'Symphony - Company',
                companyForm: {
                    companyname: '',
                    industry: ''
                },
                validation_rules: {
                    companyname: [
                        {required: true, message: 'Please enter your company\'s legal name.', trigger: 'blur'}
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
            }
        }
    }
</script>
<style scoped>


</style>