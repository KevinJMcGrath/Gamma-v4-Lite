<template>
    <div>
        <v-select v-model="set_local_country" label="Name" :options="countries" :reduce="sel_country => sel_country.Name"></v-select>
    </div>
</template>
<script>
const country_list = require('../assets/data/country_list.json')
//import 'flag-icon-css/css/flag-icon.css'
import vSelect from 'vue-select'

export default {
    data() {
        return {
            local_country: '',
            countries: []
        }
    },
    props: {
        // without the :reduce property above, this needs to be an Object
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
            //this.$emit('country-changed', selected_item)
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
                console.log('set_local_country:SET ')
                console.log(value)
                this.$emit('country-changed', value)
            }
        }
    },
    components: {
        vSelect
        //CountryFlag
    }

}
</script>
<style scoped>
    

    .v-select .vs__selected-options {
        height: 26px;
    }
</style>


