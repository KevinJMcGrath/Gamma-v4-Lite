<template>
    <div>
        <span v-bind:class="toggleText">
            <i-input v-model="set_local_state" ></i-input> 
        </span> 
        <span class="override-border" v-bind:class="toggleDropDown">
            <!-- <i-select placeholder="Select State" v-model="altered_val" @on-change="showOnChangeDataSelect"> 
                <i-option v-for="state in states" v-bind:value="state.name" :key="state.code">{{state.name}}</i-option>
            </i-select> -->
            <v-select v-model="set_local_state" label="name" :options="states" :reduce="sel_state => sel_state.name"></v-select>
        </span>
    </div>
</template>
<script>
import vSelect from 'vue-select'
const state_list = require('../assets/data/state_list.json')

export default {
    data() {
        return {
            local_state: '',
            states: [],
            us_array: ['us','US','USA','usa','United States', 'America', 'United States of America']
        }
    },
    props: {        
        selected_country: String,
        selected_state: String
    },     
    mounted() {
        this.states = state_list
        this.local_state = this.selected_state
    },
    methods: {

    },
    computed: {
        isCountryUS: {
            get() {
                return this.us_array.includes(this.selected_country) 
            }            
        },
        toggleDropDown: {
            get() {
                return (this.isCountryUS ? 'show' : 'hide')
            }
        },
        toggleText: {
            get() {
                return (this.isCountryUS ? 'hide' : 'show')
            }
        },
        set_local_state: {
            get () {
                return this.local_state
                
            },
            set (value) {                                
                this.local_state = value                
                this.$emit('state-changed', value)
            }
        }
    },
    components: {
        vSelect
    } 
}
</script>
<style >
    .show {
        display: inline-block;
        width: 100%;
    }

    .hide {
        display: none;
    }

    .override-border {
        margin-top: 1px;
    }

    .override-border input {
        border-width: 0 !important;
    }
</style>


