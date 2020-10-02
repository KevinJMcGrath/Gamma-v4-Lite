<template>
    <div>
        <p class="symphony-billing-header">Symphony Subscription</p>
        <div class="billing-group top-group">
            <Row>
                <i-col span="8">
                    <span class="big-item">Base Package</span>                    
                </i-col>
                <i-col :span="priceColSize" :offset="priceColOffset">
                    <div class="big-item align-right">{{formatCurrencyValue(monthly_base_cost)}}</div>                    
                </i-col>
            </Row>
            <Row class="mini-row">
                <i-col span="10">
                    <span class="small-item"><i>(Up to 10 licenses - <a class="lite-link-button" href="#" @click="pricing_window = true" >See Pricing</a>)</i></span>                    
                    <Modal v-model="pricing_window" title="Pricing" @on-ok="modal_ok" ok-text="Ok" >
                        <div>
                            <br/>
                            <Row>
                                <i-col span=10>
                                    <b>Base Package (up to 10 licenses)</b>
                                </i-col>
                                <i-col span=4 class="pricing-dotted-line"></i-col>
                                <i-col span=8 offset=1>
                                    <b>$4,800</b> per year
                                </i-col>
                            </Row>
                            <Row>
                                <i-col span=8>
                                    <b>Each additional license</b>
                                </i-col>
                                <i-col span=6 class="pricing-dotted-line" ></i-col>
                                <i-col span=8 offset=1>
                                    <b>$300</b> per year
                                </i-col>
                            </Row>
                            <br/>
                            A License is an individual user account to access and use Symphony.
                            <br/>                            
                            You can provision additional Licenses at any time. We will charge you for additional licenses in accordance with the Symphony Services Agreement.
                        </div>
                        <div slot="footer"></div> <!--intentionally blank to suppress OK/Cancel button -->
                    </Modal>
                </i-col>
                <i-col span="4" offset="10">
                    <div class="small-item align-right">per month</div>
                </i-col>
            </Row> 
        </div>
        <div class="billing-group top-group" v-bind:class="togglePromoCode">
            <Row>
                <i-col span="8">
                    <span class="big-item">Promo Code</span>                    
                </i-col>
                <i-col :span="priceColSize" :offset="priceColOffset">
                    <div class="big-item align-right">{{promo_code}}</div>                    
                </i-col>
            </Row>
            <Row class="mini-row">
                <i-col>
                    <span class="small-item"><i>{{promo_code_desc}}</i></span>
                </i-col>
            </Row>
        </div>
        <div class="billing-group">
            <Row class="summary-row">
                <i-col span="10">Annual Total</i-col>
                <i-col :span="totalColSize" :offset="totalColOffset">
                    <div class="align-right">{{formatCurrencyValue(adjusted_annual_seat_cost)}}</div>
                </i-col>
            </Row>
            <p class="small-item" style="font-style: italic !important;">
                You will be charged the full annual fee when we deliver your Symphony credentials.
            </p>
        </div>

        <Row type="flex" justify="center">
            <i-col span=10 style="font-size: 1em;">
                <a class="lite-link-button" href="https://symphony.com/resources/legal/ss-customer-agreement-sept2020.pdf" target="_blank">Symphony Services Agreement</a>
            </i-col>
        </Row>
    </div>
</template>
    
<script>
    export default {
        data() {            

            return {
                // Leaving this for now, though changing the internal containers to divs and right aligning 
                // made it kinda moot.
                priceColSize: 6, 
                priceColOffset: 10, 
                totalColSize: 8,
                totalColOffset: 6,
                pricing_window: false
            }
        },
        mounted: function() {
            
        },
        methods: {
            formatCurrencyValue(input_val) {
                // Regex is used to add separator commas to large numbers
                // https://stackoverflow.com/questions/2901102/how-to-print-a-number-with-commas-as-thousands-separators-in-javascript
                if (['us','US','USA','usa','United States', 'America', 'United States of America'].includes(this.$store.state.billing.country))
                    return `$${input_val.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}`
                else
                    return `US$ ${input_val.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}`
            },
            modal_ok() {

            }
        },
        computed: {
            togglePromoCode : {
                get() {
                    return this.has_promo_code? 'show': 'hide'
                }
            },
            has_promo_code: {
                get () {
                    return this.$store.state.service.show_promo_code
                }
            },
            promo_code: {
                get () {
                    return this.$store.state.service.promo_code
                }
            },
            promo_code_desc: {
                get () {
                    return this.$store.state.service.promo_code_desc
                }
            },
            monthly_base_cost: {
                get () {
                    return this.$store.state.service.seats * this.$store.state.base.pupm
                }
            },
            adjusted_annual_seat_cost: {
                get () {                    
                    
                    let list_price = this.$store.state.base.pupm * this.$store.state.base.seats * 12
                    let annual_price = list_price

                    if (this.$store.state.service.promo_code_discount_flat)
                        annual_price = list_price - this.$store.state.service.promo_code_discount_flat

                    if (this.$store.state.service.promo_code_discount_percentage)
                    {
                        let disc_price = annual_price * this.$store.state.service.promo_code_discount_percentage
                        annual_price -= disc_price
                    }                        

                    return annual_price
                }
            }
        }
    }
</script>

<style scoped>
    .billing-group {
        margin: 15px 5px;
    }

    .billing-group p {
        margin-top: 5px;
    }

    .top-group {
        border-bottom: 1px solid lightgray; 
        padding-bottom: 10px;
    }

    .big-item { 
        font-size: 1.2em;
    }

    .small-item {
        font-size: 0.8em;
        font-style: italic;
    }

    .align-right {
        text-align: right;
    }

    .summary-row {
        background-color: #f7f6f9;
        color: #614989;
        font-weight: bold;
        font-size: 1.2em;
        padding: 5px;
    }

    .symphony-billing-header {
        font-size: 1.4em;
        font-weight: bold;
    }

    .show {
        display: block;
        width: 100%;
    }

    .hide {
        display: none;
    }

    .mini-row {
        top: -6px;
    }

    .pricing-dotted-line { 
        border-bottom: 1px dotted gray;
        height: 14px;
    }
</style>
