<template>
    <div class="lite-layout">
        <div class="lite-body">
            <Row type="flex" justify="center" >
                <i-col span=10 offset=4 class="lite-col" style="border-right: 1px solid lightgray;">
                    <Row>                        
                        <i-col span=6>
                            <img src="../assets/images/big-green-check.png" height="60px" />
                        </i-col>
                        <i-col span=16>
                            <p class="info-header">You made it! Welcome.</p>
                            <br/>
                            <p class="info-header info-header-bottom">Now it's our turn to deliver.</p>
                            <div class="lite-container-row">
                                Thanks for joining Symphony. What’s next? Look for a confirmation 
                                email shortly with important steps and info as we launch the custom creation of your new service!
                            </div>                            
                        </i-col>                    
                    </Row>
                </i-col>
                <i-col span=6 class="lite-col">
                    <symphony-links />
                </i-col>
                <i-col span=2></i-col>
            </Row>
        </div>
        
    </div>
</template>
<script>
    import SymphonyLinks from '~/components/SymphonyLinks.vue'

    export default {
        data() {            

            return {
                page_title: 'Symphony - Thank You',
                emailAddress: ''
            }
        },
        head() {
            return {
                title: this.page_title,
                meta: [
                    { hid: 'description', name: 'description', content: 'Thank you for your business.' }
                ]
                
            }
        },
        mounted: function() {

        },
        methods: {

        },
        components: {
            SymphonyLinks
        }
    }
</script>
<style scoped>
   .info-header {
        font-size: 1.6em;
        font-weight: bold;        
        color: #006caf;
    }

    .info-header-bottom {
        margin-bottom: 20px;
        font-weight: normal;
    }
</style>