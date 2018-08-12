<template>
    <div class="lite-layout">
        <div class="lite-body">
            <Row>
                <i-col span=4></i-col>
                <i-col span=10 type="flex" justify="center" class="lite-col" style="border-right: 1px solid lightgray;">
                    <Timeline>
                        <TimelineItem>
                            <p style="color: #006caf;font-size:1.6em;">Your Information</p>
                            <div class="timeline-content" style="height:280px;">
                            <Form ref="contactForm" :model="contactForm" :rules="validation_rules"> <!--:label-width="100" -->
                                <div class="lite-container-row"> 
                                    Email Address<br/>
                                    <b>{{ input_email }}</b><br/>
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
                            <p>Company Information</p>
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
    import SymphonyEdge from '~/components/SymphonyEdge.vue'
    

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
            //http://localhost:8080/contact?sseid=1234567890&email=kevinmcgr@gmail.com
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

            //this.$els.phone-input
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
            },
            input_email: {
                get() {
                    return this.$store.state.email.email_address
                }
            }
        },
        methods: {
            handleGotoBilling () {

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
            },
            handlePhoneValidation({number, isValid, country}) {
                console.log(number, isValid, country)
            }
        },
        components: {
            SymphonyEdge
        }
    }
</script>
<style scoped>


</style>