<template>
    <!-- <Form ref="billingForm" :model="countryStateForm" :rules="validation_rules"> -->
    <div>
        <div class="lite-container-row"> 
            <Row :gutter="8">
                <i-col span=12>
                    Country<br/>
                    <FormItem prop="country"> 
                        <select v-model="countryStateForm.country">
                            <option v-for="country in countries" :value="country.id" :key="country.id">{{country.name}}</option>
                        </select>
                    </FormItem>
                </i-col>
                <i-col span=12>
                    City<br/>
                    <FormItem prop="city"> 
                        <i-input v-model="countryStateForm.city"></i-input>
                    </FormItem>
                </i-col>                                    
            </Row>
        </div>

        <div class="lite-container-row"> 
            <Row :gutter="8">
                <i-col span=12>
                    State<br/>
                    <FormItem prop="country"> 
                        <i-input v-model="countryStateForm.state"></i-input>
                    </FormItem>
                </i-col>
                <i-col span=12>
                    ZIP Code<br/>
                    <FormItem prop="city"> 
                        <i-input v-model="countryStateForm.zip"></i-input>
                    </FormItem>
                </i-col>                                    
            </Row>
        </div>
    </div>
</template>

<script>
const countrylib = require('country-state-city')

export default {
    data() {
        return {
            countryStateForm: {
                country: '',
                state: '',
                city: '',
                zip: ''
            },
            countries: [],
            validation_rules: {
                city: [
                    { required: true, message: 'Please provide your city or town.', trigger: 'blur' }
                ],
                state: [
                    { required: true, message: 'Please provide your state or province.', trigger: 'blur' }
                ],
                zip_code: [
                    { required: true, message: 'Please provide your zip or postal code.', trigger: 'blur' }
                ]
            }
            
        }
    },
    mounted: function() {
        this.populateCountryList()
        //this.billingForm.city = this.$store.state.billing.city
        //this.billingForm.state = this.$store.state.billing.billing_state
        //this.billingForm.zip_code = this.$store.state.billing.zip_code
        //this.billingForm.country_code = this.$store.state.user.country_code
    },
    methods: {
        populateCountryList() {
            //I don't know if this is the most efficient way to do this
            //https://www.npmjs.com/package/country-state-city
            const countryList = countrylib.getAllCountries()
            const testco = countrylib.getCountryById(45)

            console.log(countryList[0].id)

            for (var c_index = 0; c_index < countryList.length; c_index++)
            {                
                this.countries.push({id: countryList[c_index].id, name: countryList[c_index].name})

                if (c_index % 15 == 0)
                {
                    console.log(countryList[c_index].name)
                }
            }
        }
    }
}
</script>

