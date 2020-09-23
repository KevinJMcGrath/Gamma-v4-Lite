<template>
    <div >
        <i-select v-model="set_local_country" placeholder="Select Country" @on-change="showOnChangeData"> 
            <i-option v-for="country in countries" v-bind:value="country.Name" :key="country.Code" >{{country.Name}}</i-option>
<!--                 <span>{{country.Name}}</span>
                <span style="float:right" class="flag-icon" v-bind:class="getFlagClass(country.Code)"></span>
            </i-option> -->
        </i-select>
    </div>
</template>
<script>
const country_list = require('../assets/data/country_list.json')
//import 'flag-icon-css/css/flag-icon.css'


export default {
    data() {
        return {
            local_country: '',
            countries: []
        }
    },
    props: {
        selected_country: String
    },
    mounted: function() {
        console.log('mounted selected_country: ' + this.selected_country)

        this.countries = country_list
        this.local_country = this.selected_country
    },
    methods: {
        /*getFlagClass(iso_code) {
            //console.log(iso_code)
            return 'flag-icon-' + iso_code.toLowerCase()
        },*/
        showOnChangeData(selected_item) {
            this.$emit('country-changed', selected_item)
        }
    },
    computed: {
        set_local_country: {
            get () {                
                console.log('set_local_country:GET') 
                return this.local_country
                
            },
            set (value) {                                
                this.local_country = value
                console.log('set_local_country:SET ' + value)
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


