<template>
    <div class="lite-layout">
        <div class="lite-body">
            <Row type="flex" justify="center">
                <i-col span=10 class="lite-col" >
                    <p class="info-header">The page you are looking for could not be found.</p>                    
                </i-col>
            </Row>
        </div>
    </div>        
</template>
<script>

    export default {
        data() {
            return {
                page_title: 'Symphony - 404'
            }
        },
        head() {
            return {
                title: this.page_title,
                meta: [
                    { hid: 'description', name: 'description', content: 'Page could not be found.' }
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