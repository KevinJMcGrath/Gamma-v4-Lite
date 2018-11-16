<template>
    <div class="lite-layout">
        <div class="lite-body">
            <Row type="flex" justify="center" >
                <i-col span=10 offset=2 class="lite-col" style="border-right: 1px solid lightgray;">
                    <Row>                        
                        <i-col span=6>
                            <img src="../assets/images/big-green-check.png" height="60px" />
                        </i-col>
                        <i-col span=16>
                            <p class="info-header">You are on your way.</p>
                            <br/>
                            <p class="info-header info-header-bottom">What's next?</p>
                            <div class="lite-container-row" style="font-size:16px;">
                                Look for a confirmation email as we<br/>
                                set up your Symphony workspace.<br/><br/>
                                This email will also contain a receipt<br/> 
                                and a copy of the <a href="/symphony_terms_conditions_winter_2018.pdf" target="_blank">Terms and Conditions</a>.
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
        <symphony-footer is-absolute/>
    </div>
</template>
<script>
    import SymphonyLinks from '~/components/SymphonyLinks.vue'
    import SymphonyFooter from '~/components/SymphonyFooter.vue'
    import * as Cookies from 'js-cookie'

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
            this.$store.commit('RESET_STATE')
            console.log('Deleting cookie...')
            Cookies.remove('vuexstate');
        },
        methods: {

        },
        components: {
            SymphonyLinks,
            SymphonyFooter
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
        color: #333;
    }
</style>