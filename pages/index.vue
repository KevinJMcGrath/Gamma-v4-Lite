<template>
    <div class="sym-layout">
        <Layout>
            <Header class="header-bg-fix"></Header>
            <Layout>
                <Content class="contentClass">
                    <Row type="flex" justify="center" class="logoRow">
                        <i-col span=2 >
                            <img src="../assets/images/SymphonyLogo.png" height=75/>
                        </i-col>
                    </Row>
                    <Row type="flex" justify="center" class="standardRow">
                        <i-col :xs=24 :sm=18 :md=10 :lg=8>
                            <p class="p1">Getting Started</p>
                        </i-col>
                    </Row>
                    <Row type="flex" justify="center" class="standardRow">
                        <i-col :xs=18 :sm=16 :md=14 :lg=8>
                            <p class="p2">
                                Thanks for choosing Symphony!
                            </p>
                            <p class="p3">
                                We need to ask you a few questions to kick off the process and get you on your way to a better experience. If you're ready to begin, click the "Continue" button below. 
                            </p>
                        </i-col>
                    </Row>
                    <Row type="flex" justify="center" class="buttonRow">
                        <i-col span=2>
                            <Button type="primary" size="large" @click="handleStartFlow">Continue</Button>
                        </i-col>
                        <i-col span=2>
                            <nuxt-link to="/contact">NEXT</nuxt-link>
                        </i-col>
                    </Row>
                </Content>
            </Layout>
            <Footer></Footer>
        </Layout>
        
    </div>
</template>
<script>
    const moment = require('moment')
    const axios = require('axios')

    export default {
        data() {
            return {
                page_title: moment().format('MM-DD-YYYY HH:mm:ss.SSS Z') + ' | Start Page'
            }
        },
        head() {
            return {
                title: this.page_title,
                meta: [
                    { hid: 'description', name: 'description', content: 'Use this page to enter contact details for the initial user.' }
                ]
                
            }
        },
        asyncData (pageContext) {
            
        },
        mounted() {

        },
        methods: {
            handleStartFlow () {

                this.$router.push({ name: "contact", query: { sseid: '1234567890', email: 'kevin.mcgrath@symphony.com' } }); 
            }
        }
    }
</script>
<style scoped>
    .sym-layout {
        border: 1px solid #d7dde4;
        background: #f5f7f9;
        position: relative;
        border-radius: 20px;
        overflow: hidden;
        margin:50px;
    }

    .contentClass {
        background: url("../assets/images/trusted-global-directory-trans.png") no-repeat top left;
        background-size: 40% auto;

    }

    .header-bg-fix {
        background: #F5F7F9;
    }

    .p1 {
        font-size: 2.8em;
        text-align: center;
    }

    .p2 {
        font-size: 2.2em;
        text-align: center;
    }

    .p3 {
        margin-top:10px;
        font-size:1.6em;
        text-align:center;
    }
</style>