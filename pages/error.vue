<template>
    <div class="lite-layout">
        <div class="lite-body">
            <Row type="flex" justify="center">
                <i-col span=10 class="lite-col" >
                    <Row>                        
                        <i-col span=6>
                            <img src="../assets/images/error_icon.svg" height="60px" />
                        </i-col>
                        <i-col span=16>
                            <p class="info-header">We encountered an error.</p>
                            <div class="lite-container-row">
                                <p>
                                    <b>Message</b>: {{ $store.state.error.message || "Unknown error."}} 
                                </p>
                                <p style="margin-top: 20px;">You can contact support here: <a href="mailto:support@symphony.com">support@symphony.com</a></p>
                            </div>
                        </i-col>
                    </Row>
                </i-col>
            </Row>
        </div>
    </div>        
</template>
<script>

    export default {
        data() {
            return {
                page_title: 'Symphony - Error'
            }
        },
        head() {
            return {
                title: this.page_title,
                meta: [
                    { hid: 'description', name: 'description', content: 'There was an error.' }
                ]
                
            }
        },
        fetch({ store }) {
            
            //store.commit('SET_GUID', 'bob')
        },
        mounted() {
            try
            {
                console.log('Error page loaded')
                console.log('Error State: ' + this.$store.state.error.message)
                //console.log(this.$store.state)
                this.$store.dispatch('resetErrorState')
            }
            catch (error)
            {
                console.error('error on error page')
                console.error(error)
            }

            
        }
    }
</script>
<style scoped>
    .info-header {
        font-size: 1.6em;
        font-weight: bold;
        margin-bottom: 20px;
        color: #006caf;
    }

    .email-input {
        width: 50%;
    }
</style>