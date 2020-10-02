<template>
    <div>
        <div class="lite-header">
            <div class="lite-header-logo"></div>
        </div>
        <div class="new-sym-banner">
            <Row type="flex" justify="center">
                <!-- <i-col span=8 v-bind:class="getHeaderGraphic()"></i-col> -->
                <i-col span=4 class="new-sym-col">
                    <p class="signup" style="">Sign up</p>
                </i-col>
                <!-- <i-col span=8 v-bind:class="getHeaderGraphic()"></i-col> -->
            </Row>
            <Row>
                <i-col v-bind:class="getHeaderGraphic()"></i-col>
            </Row>
        </div>
    </div>
</template>
<script>
export default {
    mounted: function() {
        console.log('Header Route: ' + this.$route.name)
    },
    methods: {
        getHeaderGraphic() {
            switch(this.$route.name)
            {
                case 'email':
                    return 'orange-circles'
                    break
                case 'email-thankyou':
                    return 'orange-half-circles'
                    break
                case 'contact':
                    return 'purple-chat-min'
                    break
                case 'billing':
                    return 'purple-chevron-min'
                    break
                case 'company':
                    return 'green-oval-min'
                    break
                case 'summary':
                    return 'orange-diamonds'
                    break
                default:
                    return 'orange-diamonds'
            }
        }
    }
}
</script>

<style scoped>
    .signup {
        text-align: center; 
        /*margin: 10px auto;*/
        color: black;
    }
</style>
