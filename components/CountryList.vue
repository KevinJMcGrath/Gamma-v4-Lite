<template>
    <div >
        <i-select v-model="selected_country" placeholder="Select Country" @on-change="showOnChangeData">
            <i-option v-for="country in countries" v-bind:value="country.Code" :key="country.Code" >{{country.Name}}</i-option>
<!--                 <span>{{country.Name}}</span>
                <span style="float:right" class="flag-icon" v-bind:class="getFlagClass(country.Code)"></span>
            </i-option> -->
        </i-select>
    </div>
</template>
<script>
const country_list = require('../assets/data/country_list.json')
import 'flag-icon-css/css/flag-icon.css'


export default {
    data() {

        return {
            countries: []
            
        }
    },
    mounted: function() {
        console.log('Loading country dropdown component...')
        this.countries = country_list
    },
    methods: {
        getFlagClass(iso_code) {
            //console.log(iso_code)
            return 'flag-icon-' + iso_code.toLowerCase()
        },
        showOnChangeData(selected_item) {
            //console.log('Showing selected item object...')
            //console.log(selected_item)

            // This emit call does correctly emit an event back out to 
            // the parent compnent. 
            //this.$emit('country-changed')

            // I don't actually need the event. The problem was I was not setting the 
            // country code in the Vuex Store when changing the option.
            this.$store.commit('SET_COUNTRYCODE', selected_item)
        }
    },
    computed: {
        selected_country: {
            get () {
                //console.log('Getting Country Code: ' + this.$store.state.user.country_code)
                return this.$store.state.user.country_code
            },
            set (value) {                
                this.$store.commit('SET_BILLING_COUNTRY', value)
            }
        }
    },
    components: {
        
        //CountryFlag
    }

}
</script>
<style>

</style>


