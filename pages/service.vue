<template>
    <div class="sym-layout">
        <Layout>
            <Header class="headerClass"></Header>
            <Layout  class="layoutClass">
                <Sider hide-trigger class="sidebarClass">
                    <Steps :current="2" direction="vertical">
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
                                <img src="../assets/images/Service-Icon.png" height=75/>
                            </i-col>
                        </Row>
                        <Row type="flex" justify="center" class="standardRow">
                            <i-col  :xs=24 :sm=18 :md=10 :lg=8>
                                <p class="p2">Settings</p>
                            </i-col>
                        </Row>
                        <Row type="flex" justify="center" class="standardRow">
                            <i-col :xs=24 :sm=20 :md=18 :lg=16>
                                <p class="p4">
                                    Time to choose your Symphony settings, number of users, and company name.<br/>
                                    Note: Vanity Name is how your company will be shown in the Symphony Global Directory. e.g. David Gurle, CEO, <b>Symphony</b>
                                </p>
                            </i-col>
                        </Row>

                        <Form ref="serviceForm" :model="serviceForm" :label-width="150" :rules="validation_rules">
                        <Row type="flex" justify="center" class="standardRow">
                            <i-col :xs=20 :sm=20 :md=12 :lg=10> 
                                <FormItem label="Number of Symphony Users" prop="seats" :show-message=true>
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
                                <FormItem label="Vanity Name" prop="vanity_name">                                    
                                    <Row :gutter=8>
                                        <i-col span=20>
                                            <i-input v-model="input_vanity_name"></i-input>      
                                        </i-col>
                                        <i-col span=2>
                                            <Tooltip placement="right">
                                                <Icon type="help-circled" color="steelblue" size="15"></Icon>
                                                <div slot="content">
                                                    <p>This is how your company name will  <br/>
                                                    appear in the Symphony Global Directory.</p>
                                                </div>
                                            </Tooltip>
                                        </i-col>
                                    </Row>
                                </FormItem>
                                <FormItem label="Promo Code" prop="promo_code">                                    
                                    <Row :gutter=8>
                                        <i-col span=20>
                                            <i-input v-model="input_promo_code"></i-input>   
                                        </i-col>
                                        <i-col span=2>
                                            <Tooltip placement="right">
                                                <Icon type="help-circled" color="steelblue" size="15"></Icon>
                                                <div slot="content">
                                                    <p>If you were provided a promotional  <br/>
                                                    code, you may enter it here.</p>
                                                </div>
                                            </Tooltip>
                                        </i-col>
                                    </Row>
                                </FormItem>                                
                            </i-col>
                        </Row>
                        </Form>

                        <Row type="flex" justify="center" class="buttonRow">
                            <i-col :xs=5 :sm=4 :md=3 :lg=2 class-name="backButtonCol">
                                <Button type="primary" size="large" @click="handleGotoCompany">Back</Button>
                            </i-col>
                            <i-col :xs=6 :sm=5 :md=4 :lg=3 class-name="nextButtonCol">
                                <Button type="primary" size="large" @click="handleGotoLegal">Continue</Button>
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
                page_title: 'Symphony - Service',
                pricing_window: false,
                serviceForm: {
                    seats: 10,
                    vanity_name: '',
                    promo_code: ''
                },
                validation_rules: {
                    seats: [
                        //For some reason, I needed to specify the type for this rule to work consistently
                        { required: true, type: 'number', message: 'Please enter a non-zero number of seats.', trigger: 'change' }
                    ],
                    vanity_name: [
                        { required: true, message: 'Please include a "friendly" name for your company.', trigger: 'blur' }
                    ]
                }
            }
        },
        head() {
            return {
                title: this.page_title,
                meta: [
                    { hid: 'description', name: 'description', content: 'Enter the details of your Symphony service.' }
                ]
                
            }
        },
        mounted: function() {
            this.serviceForm.seats = this.$store.state.service.seats
            this.serviceForm.vanity_name = this.$store.state.service.vanity_name
            this.serviceForm.promo_code = this.$store.state.service.promo_code
        },
        computed: {
            input_seats: {
                get () {
                    return this.$store.state.service.seats
                },
                set (value) {
                    this.serviceForm.seats = value;
                    this.$store.commit('SET_SEATS', value)
                }
            },
            input_vanity_name: {
                get () {
                    return this.$store.state.service.vanity_name
                },
                set (value) {
                    this.serviceForm.vanity_name = value;
                    this.$store.commit('SET_VANITYNAME', value)
                }
            },
            input_promo_code: {
                get () {
                    return this.$store.state.service.promo_code
                },
                set (value) {
                    this.serviceForm.promo_code = value;
                    this.$store.commit('SET_PROMOCODE', value)
                }
            }
        },
        methods: {
            handleGotoLegal () {
                this.$refs['serviceForm'].validate((valid) => {
                    if (valid)
                    {
                        this.$store.commit('SET_PAGE_COMPLETE', 'service')
                        this.$router.push({name: "legal"});
                    }
                    else
                    {
                        this.$Message.error();
                    }
                })
            },
            handleGotoCompany() {
                this.$router.push({name: "company"})
            },
            modal_ok() {

            }
        }
    }
</script>
<style scoped>



</style>