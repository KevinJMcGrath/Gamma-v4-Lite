<template>
    <div class="sym-layout">
        <Layout>
            <Header class="headerClass"></Header>
            <Layout class="layoutClassStationary">
                <Sider hide-trigger class="sidebarClass">
                    <Steps :current="3" direction="vertical">
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
                                <img src="../assets/images/Legal-Icon.png" height=75/>
                            </i-col>
                        </Row>
                        <Row type="flex" justify="center" class="standardRow">
                            <i-col :xs=24 :sm=24 :md=24 :lg=24>
                                <p class="p2">Terms of Service</p>
                            </i-col>
                        </Row>
                        <Row type="flex" justify="center" class="standardRow">
                            <i-col :xs=24 :sm=20 :md=18 :lg=16>
                                <p  class="p4">
                                    Please read through Symphony's agreements and policies. You must agree to our terms & conditions to continue with your setup.<br/>
                                    If you need additional documentation, please contact <a href="mailto:legal@symphony.com">legal@symphony.com</a>
                                </p>
                            </i-col>
                        </Row>
                        <Row type="flex" justify="center" class="standardRow">
                            
                            <i-col span=10>
                                <Card>
                                    <p slot="title">Terms and Conditions</p>
                                    <p>
                                        Terms and conditions for using the Symphony platform for communication. You are required to agree to these conditions before continuing.
                                        <br/><br/>
                                        <Button type="primary" @click="handleOpenPDF">
                                            <Icon type="eye"></Icon>
                                            Read
                                        </Button>
                                    </p>
                                </Card>                                
                            </i-col>
                        </Row>
                        <Row type="flex" justify="center" class="standardRow">
                            <i-col :xs=20 :sm=20 :md=20 :lg=14>
                                <Form ref="legalForm" :model="legalForm" :rules="validation_rules">
                                    <FormItem prop="terms_accepted" :required=true>
                                        <Checkbox v-model="input_terms_accepted">
                                            <span>I have read and agree to the Terms and Conditions</span>
                                        </Checkbox>
                                    </FormItem>
                                </Form>
                            </i-col>
                        </Row>
                        <Row type="flex" justify="center" class="buttonRow">
                            <i-col :xs=5 :sm=4 :md=3 :lg=2 class-name="backButtonCol">
                                <Button type="primary" size="large" @click="handleGotoService">Back</Button>
                            </i-col>
                            <i-col :xs=6 :sm=5 :md=4 :lg=3 class-name="nextButtonCol">
                                <Button type="primary" size="large" @click="handleGotoBilling">Continue</Button>
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
            const validateTandC = (rule, value, callback) => {
                console.log(value)

                if (value === true)
                {
                    callback();
                }
                else
                {
                    callback(new Error('You must agree to the terms specified in the EULA to proceed.'));
                }                
            };

            return {
                page_title: 'Symphony - Terms and Conditions',
                legalForm: {
                    terms_accepted: false
                },
                validation_rules: {
                    terms_accepted: [
                        //{ required: true, type: "boolean",  message: 'Please check that you agree to the terms specified in the EULA', trigger: 'change'}
                        { validator: validateTandC, trigger: 'change' }
                    ]
                }
            }
        },
        head() {
            return {
                title: this.page_title,
                meta: [
                    { hid: 'description', name: 'description', content: 'Please accept the Symphony Terms and Conditions.' }
                ]
                
            }
        },
        mounted: function() {

            this.legalForm.terms_accepted = this.$store.state.legal.terms_accepted
        },
        computed: {
            input_terms_accepted: {
                get () {
                    return this.$store.state.legal.terms_accepted
                },
                set (value) {
                    this.legalForm.terms_accepted = value
                    this.$store.commit('SET_TANDC', value)
                }
            }
        },
        methods: {
            handleGotoBilling () {
                this.$refs['legalForm'].validate((valid) => {
                    if (valid)
                    {
                        this.$store.commit('SET_PAGE_COMPLETE', 'legal')
                        this.$router.push({name: "billing"});
                    }
                    else
                    {
                        this.$Message.error();
                    }
                })
                
                
            },
            handleGotoService() {
                this.$router.push({name: "service"})
            },
            handleOpenPDF() {
                window.open('/Symphony_EULA.pdf', '_blank')
            }
        }
    }
</script>
<style scoped>

</style>