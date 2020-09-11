<template>
    <div style="min-height:650px;">
        <div class="lite-header">
            <div class="lite-header-logo"></div>
        </div>
        <div class="sym-index-banner">
            <Row type="flex" justify="center">
                <i-col span=6 class="blue-shields"></i-col>
                <i-col span=10 class="sym-index-col">
                    <p>SECURE TEAM COLLABORATION</p>
                    <p style="font-size:1.8em;">FOR YOUR BUSINESS</p>
                </i-col>
                <i-col span=6 class="blue-shields"></i-col>
            </Row>
        </div>
        <div style="margin-top:20px;">
            <div class="asset-box">
                <div class="asset-1"></div>
                <div class="asset-2">
                    <p class="symphony-start-header">With Symphony, you can:</p>
                    <ul class="symphony-start-list">
                        <li><div class="icon-box"><img class="icon-image" style="margin-top:2px;" src="../assets/images/dudes.svg" height="12px" /></div>Optimize team collaboration</li>
                        <li><div class="icon-box"><img class="icon-image" src="../assets/images/web.svg" height="16px" /></div>Connect to a verified network</li>
                        <li><div class="icon-box"><img class="icon-image" src="../assets/images/expand.svg" height="15px" /></div>Streamline financial services workflows</li>
                        <li><div class="icon-box"><img class="icon-image" src="../assets/images/refresh.svg" height="16px" /></div>Integrate with top apps</li>
                        <li><div class="icon-box"><img class="icon-image" src="../assets/images/lock.svg" height="16px"/></div>Secure your collaboration data</li>
                    </ul>
                    <p class="symphony-start-header">Tips and tricks available at <a href="#">Symphony.direct</a></p>
                </div>
            </div>
            <div class="button-box">
                <button class="button-style-1 button-style-start" style="" @click="handleGetStarted()">Get Started</button>
            </div>

        </div>
    </div>
</template>
<script>
export default {
    layout: 'startcustom',
    data() {

        return {
            page_title: 'Symphony - Get Started!',
        }
    },
    head() {
        return {
            title: this.page_title,
            meta: [
                { hid: 'description', name: 'description', content: 'Get started using Symphony' }
            ]
            
        }
    },
    mounted() {
        if (this.$route.query.reset)
        {
            console.log('Clearing State')
            this.$store.commit('RESET_STATE')
            localStorage.removeItem('vuex')
            localStorage.removeItem('vuexstate')
        }
        
    },
    methods: {
        handleGetStarted() {
            
            this.$router.push({name: "email" })
        }
    }
    
}
</script>
<style scoped>
    .lite-banner p {
        font-family: Roboto;
        font-weight: 300;
        width: 700px;
        height: 60px;
        margin: 30px auto 0 auto;        
        font-size: 3em;
        text-align: center;
        
    }

    .lite-banner p.sub-banner {
        margin-top: 2px;
        font-size: 2em;
        
    }

    .asset-box {
        width: 800px;
        height: 240px;
        margin: 0 auto;        
    }

    .asset-1 {
        float: left;
        height: 237px;
        width: 402px;
        background-image: url("../assets/images/start-asset-1.png")
    }

    .asset-2 {
        float: right;
        height: 250px;        
        width: 370px;
        background-color: white;
        color: #333333;
        padding: 24px 32px;
        box-shadow: 4px 4px 15px 2px rgb(201, 201, 201, 0.5);
    }

    p.symphony-start-header {
        font-size: 1.2em;
        font-weight: bold;
        height: auto;
        width: auto;
        text-align: left;
        margin-top: 0px;
    }

    .symphony-start-list {
        list-style: none;
        /*margin-top: 15px;
        margin-left: 10px;*/
        
    }

    .symphony-start-list li {
        margin: 10px 0;
        font-size: 1.2em;
    }

    .symphony-start-list li > div {
        float: left;
        height: 20px;
        width: 20px;
        margin-right: 7px;
    }

    .button-box {        
        height: 45px;
        width: 190px;
        margin: 50px auto;
    }

    .button-style-start {
        height: 40px; 
        width: 190px;
        font-size: 1.3em;        
    }

    .icon-box {         
        width:20px;
        height:20px;
    }

    .icon-image {
        display:block;
        margin: auto;
    }
</style>



