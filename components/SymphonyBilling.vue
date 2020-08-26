<template>
    <div>
        <p class="symphony-billing-header">Symphony Subscription</p>
        <div class="billing-group top-group">
            <Row>
                <i-col span="8">
                    <span class="big-item">Base Package</span>
                    <!--<span class="big-item"><b>{{total_seats}}</b> Licenses</span>-->
                </i-col>
                <i-col :span="priceColSize" :offset="priceColOffset">
                    <div class="big-item align-right">{{formatCurrencyValue(400)}}</div>
                    <!-- <div class="big-item align-right">{{formatted_monthly_seat_cost}}</div> -->
                </i-col>
            </Row>
            <Row class="mini-row">
                <i-col span="10">
                    <span class="small-item"><i>(Up to 20 licenses)</i></span>
                    <!-- <span class="small-item">{{formatted_pupm}} /license/month</span> -->
                </i-col>
                <i-col span="4" offset="10">
                    <div class="small-item align-right">per month</div>
                </i-col>
            </Row>

            <Row v-bind:class="toggleMoreSeats">
                <i-col span="8">
                    <span class="big-item">More Licenses</span>
                    <!--<span class="big-item"><b>{{total_seats}}</b> Licenses</span>-->
                </i-col>
                <i-col :span="priceColSize" :offset="priceColOffset">
                    <div class="big-item align-right">{{formatted_more_seats_cost}}</div>
                    <!-- <div class="big-item align-right">{{formatted_monthly_seat_cost}}</div> -->
                </i-col>
            </Row>
            <Row v-bind:class="toggleMoreSeats" class="mini-row">
                <i-col span="10">
                    <span class="small-item"><i>({{more_seats}} x $20/month)</i></span>
                    <!-- <span class="small-item">{{formatted_pupm}} /license/month</span> -->
                </i-col>
                <i-col span="4" offset="10">
                    <div class="small-item align-right">per month</div>
                </i-col>
            </Row>
 
        </div>
        <div class="billing-group">
            <Row class="summary-row">
                <i-col span="10">Annual Total</i-col>
                <i-col :span="totalColSize" :offset="totalColOffset">
                    <div class="align-right">{{formatted_annual_seat_cost}}</div>
                </i-col>
            </Row>
            <!--<p class="small-item">
                Requires a 2 year subscription.<br/>
                We'll charge the first year's amount when your service is ready.
            </p>-->
        </div>
    </div>
</template>
    
<script>
    export default {
        data() {            

            return {
                // Leaving this for now, though changing the internal containers to divs and right aligning 
                // made it kinda moot.
                priceColSize: 6, //4
                priceColOffset: 10, //12
                totalColSize: 8,
                totalColOffset: 6
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
            }
        },
        computed: {
            total_seats: {
                get () {
                    return this.$store.state.service.seats
                }
            },
            more_seats: {
                get () {
                    return this.is_more_than_base ? this.$store.state.service.seats - 100 : 0
                }
            },
            more_seats_cost: {
                get () {
                    return this.more_seats * this.scaled_pupm
                }
            },
            formatted_more_seats_cost: {
                get () {
                    return this.formatCurrencyValue(this.more_seats_cost)
                }
            },
            is_more_than_base: {
                get () {
                    return this.$store.state.service.seats > 100
                }
            },
            toggleMoreSeats: {
                get() {
                    return (this.is_more_than_base ? 'show' : 'hide')
                }
            },
            scaled_pupm: {
                get () {
                    let seats = this.$store.state.service.seats
                    let pupm = 20 //(seats < 50 ? 30 : 20)
                    
                    return pupm
                }
            },
            formatted_pupm: {
                get () {
                    return this.formatCurrencyValue(this.scaled_pupm)
                }
                
            },
            monthly_seat_cost: {
                get () {
                    return this.total_seats * this.scaled_pupm
                }
            },
            formatted_monthly_seat_cost: {
                get () {
                    return this.formatCurrencyValue(this.monthly_seat_cost)
                }
            },
            annual_seat_cost: {
                get () {
                    //return this.monthly_seat_cost * 12
                    return (400 + this.more_seats_cost) * 12
                }
            },
            formatted_annual_seat_cost: {
                get () {
                    return this.formatCurrencyValue(this.annual_seat_cost)
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
</style>
