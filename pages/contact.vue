<template>
    <div class="sym-layout">
        <Layout>
            <Header class="headerClass"></Header>
            <Layout class="layoutClass">
                <Sider hide-trigger class="sidebarClass">
                    <Steps :current="0" direction="vertical">
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
                                <img src="../assets/images/Contact-Icon.png" height=75/>
                            </i-col>
                        </Row>
                        <Row type="flex" justify="center" class="standardRow">
                            <i-col :xs=24 :sm=18 :md=10 :lg=8> <!--span=6-->
                                <p class="p2">Profile</p>
                            </i-col>
                        </Row>                        
                        <Row type="flex" justify="center" class="standardRow">
                            <i-col :xs=24 :sm=20 :md=18 :lg=16><!--span=16-->
                                <p class="p4">
                                    Congratulations! You're the first person on your Symphony team, which makes you the team admin. As team admin, you will help
                                    tailor Symphony to your organization's secure collaboration needs.<br/>
                                    First, we need some information to set up your profile. 
                                </p>
                            </i-col>
                        </Row>
                        <Row type="flex" justify="center" class="standardRow">
                            <i-col :xs=20 :sm=20 :md=12 :lg=10>
                                <Form ref="contactForm" :model="contactForm" :label-width="100" :rules="validation_rules">
                                    <FormItem label="First Name" prop="firstname">                                        
                                        <Row :gutter=8>
                                            <i-col span=20>
                                                <i-input v-model="input_firstname"></i-input>
                                            </i-col>
                                            <i-col span=2>
                                                
                                            </i-col>
                                        </Row>
                                    </FormItem>
                                    <FormItem label="Last Name" prop="lastname">
                                        <Row :gutter=8>
                                            <i-col span=20>
                                                <i-input v-model="input_lastname"></i-input>
                                            </i-col>
                                            <i-col span=2>
                                                
                                            </i-col>
                                        </Row>
                                    </FormItem>
                                    <FormItem label="Phone" prop="phone">
                                        <Row :gutter=8>
                                            <i-col span=20>
                                                <i-input v-model="input_phone"></i-input>
                                            </i-col>
                                            <i-col span=2>
                                                <Tooltip placement="right">
                                                    <Icon type="help-circled" color="steelblue" size="15"></Icon>
                                                    <div slot="content">
                                                        <p>Phone number where Symphony can reach <br/>
                                                        you during business hours (9am-5pm EST)</p>
                                                    </div>
                                                </Tooltip>
                                            </i-col>
                                        </Row>                                        
                                    </FormItem>
                                </Form>
                            </i-col>
                        </Row>
                        <Row type="flex" justify="center" class="buttonRow">
                            <i-col :xs=5 :sm=4 :md=3 :lg=2 class-name="backButtonCol"> 
                                <Button type="primary" size="large" @click="handleBackButton">Back</Button>
                            </i-col>
                            <i-col :xs=6 :sm=5 :md=4 :lg=3 class-name="nextButtonCol">
                                <Button type="primary" size="large" @click="handleGotoCompany">Continue</Button>
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
                page_title: 'Symphony - Contact',
                contactForm: {
                    firstname: '',
                    lastname: '',
                    phone: ''
                },
                validation_rules: { 
                    firstname: [
                        { required: true, message: 'Please enter your first name.', trigger: 'blur'}
                    ],
                    lastname: [
                        { required: true, message: 'Please enter your last name.', trigger: 'blur'}
                    ],
                    phone: [
                        { required: true, message: 'Please enter your daytime phone number.', trigger: 'blur'}
                    ]

                }
            }
        },
        head() {
            return {
                title: this.page_title,
                meta: [
                    { hid: 'description', name: 'description', content: 'Use this page to enter contact details for the initial user.' }
                ]
                
            }
        },
        fetch({ store, params, query, redirect }) {

            if(!(store.state.status.guid && store.state.email.email_address))
            {
                //Load query parameters
                if (query.sseid && query.email)
                {
                    store.commit('SET_GUID', query.sseid)
                    store.commit('SET_EMAIL', query.email.replace(' ', '+'))
                }
                else
                {
                    //I might need to return an error here instead.
                    redirect('/email')
                }
            }
            
        },
        mounted: function() {
            console.log('GUID: ' + this.$store.state.status.guid)
            console.log('EMail: ' + this.$store.state.email.email_address)

            this.contactForm.firstname = this.$store.state.user.firstname
            this.contactForm.lastname = this.$store.state.user.lastname
            this.contactForm.phone = this.$store.state.user.phone
        },
        computed: {
            // Using computed properties for two-way binding with Vuex
            input_firstname: {
                get () {
                    return this.$store.state.user.firstname
                },
                set (value) {
                    // I'm intentionally adding side effects to make the validation rules work. Not ideal
                    this.contactForm.firstname = value;
                    this.$store.commit('SET_FNAME', value)
                }
            },
            input_lastname: {
                get () {
                    return this.$store.state.user.lastname
                },
                set (value) {
                    this.contactForm.lastname = value;
                    this.$store.commit('SET_LNAME', value)
                }
            },
            input_phone: {
                get () {
                    return this.$store.state.user.phone
                },
                set (value) {
                    this.contactForm.phone = value;
                    this.$store.commit('SET_PHONE', value)
                }
            }
        },
        methods: {
            handleGotoCompany () {

                this.$refs['contactForm'].validate((valid) => {
                    if (valid)
                    {
                        this.$store.commit('SET_PAGE_COMPLETE', 'contact')
                        this.$router.push({ name: "company" });        
                    }
                    else
                    {
                        this.$Message.error();
                    }

                })
            },
            handleBackButton() {
                this.$router.push({ name: "index" })                
            }
        }
    }
</script>
<style scoped>


</style>