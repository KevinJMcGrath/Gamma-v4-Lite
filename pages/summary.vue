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
                        <TimelineItem class="completed-icon">
                            <ion-icon name="checkmark-circle" slot="dot"></ion-icon>
                            <p class="timeline-completed-label">Company Information</p>
                            <div class="timeline-spacer"></div>
                        </TimelineItem>
                        <TimelineItem class="completed-icon">
                            <ion-icon name="checkmark-circle" slot="dot"></ion-icon>
                            <p class="timeline-completed-label">Billing</p>
                            <div class="timeline-spacer"></div>
                        </TimelineItem>
                        <TimelineItem>
                            <p class="timeline-current-label">Review</p>
                            <div class="timeline-spacer"></div> 
                            <div class="timeline-content" style="height:500px;">
                                <div class="timeline-billing-subgroup">
                                    <Row>
                                        <i-col span=8 ><p>Your Information</p></i-col>
                                        <i-col span=4 offset=12 class="edit-link-col">                                            
                                            <a @click="handleGotoContact()"><ion-icon name="create"></ion-icon>Edit</a>
                                        </i-col>
                                    </Row>                                    
                                </div>

                                <p>{{$store.state.email.email_address}}</p>
                                <p>{{$store.state.user.firstname}} {{$store.state.user.lastname}}</p>
                                <p>{{$store.state.user.phone}}</p>

                                <div class="timeline-billing-subgroup group-margin">
                                    <Row>
                                        <i-col span=8 ><p>Company Information</p></i-col>
                                        <i-col span=4 offset=12 class="edit-link-col">                                            
                                            <a @click="handleGotoCompany()"><ion-icon name="create"></ion-icon>Edit</a>
                                        </i-col>
                                    </Row>                                    
                                </div>

                                <p>{{$store.state.company.name}}</p>
                                <p>{{$store.state.company.industry}}</p>
                                <p>New Symphony Users: {{$store.state.service.seats}}</p>

                                <div class="timeline-billing-subgroup group-margin">
                                    <Row>
                                        <i-col span=8 ><p>Billing</p></i-col>
                                        <i-col span=4 offset=12 class="edit-link-col">                                            
                                            <a @click="handleGotoBilling()"><ion-icon name="create"></ion-icon>Edit</a>
                                        </i-col>
                                    </Row>                                    
                                </div>

                                <p>xxxx xxxx xxxx {{$store.getters.getPaymentLast4}}, 
                                    {{$store.getters.getPaymentExpMon}}/
                                    {{$store.getters.getPaymentExpYear}}</p>
                                <p>{{$store.state.billing.address1}}</p>
                                <p>{{$store.state.billing.address2}}</p>
                                <p>{{$store.state.billing.city}}, {{$store.state.billing.billing_state}} {{$store.state.billing.zip_code}}</p>
                                <p>{{$store.state.billing.country}}</p>

                                <div class="tandc group-margin">
                                    <Form ref="summary_form" :model="summaryForm" :rules="validation_rules" @submit.native.prevent>
                                    <!-- I REALLY hate trying to get checkboxs to align with labels.
                                    I can't believe this is still a thing in 2018-->
                                    <FormItem prop="tandc"> 
                                        <label for="tandc_check">
                                            <input type="checkbox" v-model="input_accept_tandc" name="tandc_check"/>
                                            <span>I have read and agree to the <a href="#">Terms and Conditions</a></span>
                                        </label>
                                    </FormItem>
                                    </Form>
                                </div>

                                <div class="group-margin">
                                    <button :disabled="!!loading" v-bind:class="{button_disabled: loading}" class="button-style-1" 
                                        style="height: 32px; width: 100px;" @click="handleGotoThankyou()">
                                        <ion-icon name="checkmark" style="color: white;"></ion-icon>Submit
                                    </button>
                                </div>
                            </div>
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
    const axios = require('axios')
    const card_brand = require('~/plugins/payment-type.js')
    import SymphonyBilling from '~/components/SymphonyBilling.vue'

    export default {
        data() {
            const validateTandC = (rule, value, callback) => {
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
                loading: false,
                page_title: 'Symphony - Review Your Purchase',
                summaryForm: {
                    accept_tandc: false
                },
                validation_rules: {
                    tandc: [
                        { validator: validateTandC, trigger: 'change' }
                    ]
                }
            }
        },
        head() {
            return {
                title: this.page_title,
                meta: [
                    { hid: 'description', name: 'description', content: 'Review your purchase details.' }
                ]
                
            }
        },
        mounted: function() {
            this.summaryForm.accept_tandc = this.$store.state.legal.terms_accepted

            // Clear page errors from the store
            this.$store.dispatch('resetErrorState')
        },
        computed: {
            input_accept_tandc: {
                get () {
                    return this.$store.state.legal.terms_accepted
                },
                set (value) {
                    this.summaryForm.accept_tandc = value
                    this.$store.commit('SET_TANDC', value)
                }
            }
        },
        methods: {
            handleGotoContact() { 
                this.$router.push({ name: "contact", query: { sseid: this.$store.state.status.guid }})
            },
            handleGotoCompany() { 
                this.$router.push({ name: "company", query: { sseid: this.$store.state.status.guid }})
            },
            handleGotoBilling() { 
                this.$router.push({ name: "billing", query: { sseid: this.$store.state.status.guid }})
            },
            handleGotoThankyou() {
                loading = true
                this.$refs['summary_form'].validate((valid) => {
                    if (valid)
                    {
                        this.$store.dispatch('submitPurchase')
                        this.$router.push({name: "thankyou"}) 
                    }
                    else
                    {
                        //this.$Message.error()
                        loading = false
                    }
                })
                                            
            }
        },
        components: {
            SymphonyBilling
        }
    }
</script>
<style scoped>

    .timeline-content > p {
        margin-bottom: 5px;
    }

    .timeline-billing-subgroup {
        font-weight: bold;
        border-bottom: 1px solid lightgray;
        padding-bottom: 0px;
        margin-bottom: 15px;
    }

    .edit-link-col {
        text-align :right;
        color: #0395a1;
    }

    .edit-link-col ion-icon,.button-style-1 ion-icon {
        position: relative;
        top: 2px;
        margin-right: 2px;
    }

    .edit-link-col a {
        display: inline-block;
    }

    .edit-link-col a:link {
        color: #0395a1;
    }

    .tandc a {
        display: inline-block;
    }

    .tandc a:link {
        color: #0395a1;
    }

    .tandc a:hover {
        text-decoration: underline;
    }

    .tandc label {
        display: block;
        padding-right: 10px;
        white-space: nowrap;
    }

    .tandc input {
        vertical-align: middle;
    }

    .tandc label span {
        vertical-align: middle;
    }

    .group-margin {
        margin-top: 20px;
    }

</style>