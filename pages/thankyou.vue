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
                            <p class="info-header">Success!</p>
                            <p class="info-header info-header-bottom">Thanks for joining Symphony.</p>
                            <div class="lite-container-row">
                                We'll reach out soon with next steps for getting started.
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
            // Clear page errors from the store
            this.$store.dispatch('resetErrorState')
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