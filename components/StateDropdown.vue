<template>
    <div>
        <span v-bind:class="toggleText">
            <i-input v-model="altered_val" @on-change="showOnChangeDataText"></i-input>
        </span> 
        <span v-bind:class="toggleDropDown">
            <i-select placeholder="Select State" v-model="altered_val" @on-change="showOnChangeDataSelect"> 
                <i-option v-for="state in states" v-bind:value="state.name" :key="state.code">{{state.name}}</i-option>
            </i-select>
        </span>
    </div>
</template>
<script>
const state_list = require('../assets/data/state_list.json')

export default {
    data() {
        return {
            states: [],
            us_array: ['us','US','USA','usa','United States', 'America', 'United States of America'],            
            altered_val: this.altered
        }
    },
    model: {
        prop: 'altered',
        event: 'custom-event'
    },
    props: {
        altered: String
    },     
    mounted() {
        this.states = state_list
    },
    methods: {
        // Note: I have to emit the event to get the components to update on the parent side
        // even if I'm not capturing the event on the parent side. 
        // This is likely because I'm using a custom property in the "model" section.
        // By default, I can just reference the property name in 'props' and it
        // will automatically fire the 'input' event.
        showOnChangeDataSelect(selected_item) {
            // I'm doing this check because the Select element is set 
            // to empty (no matching value) when  you first start typing
            // in the text box. After the first time, the select box is no
            // longer changing, so the event here does not fire.
            if(selected_item)
                this.$emit('custom-event', selected_item)
        },
        showOnChangeDataText(input_event) {
            if(input_event)
                this.$emit('custom-event', input_event.target.value)
        }
    },
    computed: {
        isCountryUS: {
            get() {
                return this.us_array.includes(this.$store.state.billing.country) 
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
        }
    } 
}
</script>
<style>
    .show {
        display: inline-block;
        width: 100%;
    }

    .hide {
        display: none;
    }
</style>


