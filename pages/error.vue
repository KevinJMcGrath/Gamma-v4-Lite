<template>
    <div class="lite-layout">
        <div class="lite-body">
            <Row type="flex" justify="center">
                <i-col span=10 class="lite-col" >
                    <p class="info-header">We encountered an error.</p>
                    <div class="lite-container-row">
                        Message: {{ $store.state.error.message}} 
                    </div>
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