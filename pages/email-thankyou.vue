<template>
    <div class="sym-layout">
        <Layout>
            <Header class="headerClass"></Header>
            <Layout class="layoutClassEmail">
                <Content class="contentClass">
                    <Row type="flex" justify="center" class="logoRow">
                        <i-col span=2 >
                            <img src="../assets/images/SymphonyLogo.png" height=75/>
                        </i-col>
                    </Row>
                    <Row type="flex" justify="center" class="standardRow">
                        <i-col :xs=24 :sm=18 :md=10 :lg=8>
                            <p class="p1">Thank you!</p>
                        </i-col>
                    </Row>
                    <Row type="flex" justify="center" class="standardRow">
                        <i-col :xs=18 :sm=16 :md=14 :lg=10>
                            <p class="p3">
                                You will receive an email from Symphony shortly with your verification link. 
                                <br/><br/>
                                If you do not receive this email, please check your spam folder or re-send the verification. 
                            </p>
                        </i-col>
                    </Row>
                    <Row type="flex" justify="center" class="standardRow">
                        <!--<i-col span=3 > 
                            <Button type="primary" size="large" @click="handleResendEmail()">Re-Send Verification</Button>
                        </i-col>-->
                        <i-col span=2 > <!--style="border:1px solid green;"-->
                            <Button type="primary" size="large" @click="handleChangeEmail()">Start Over</Button>
                        </i-col>
                    </Row>
                    <Row type="flex" justify="center" class="standardRow">
                        <i-col :xs=18 :sm=18 :md=12 :lg=12>
                            <Alert show-icon>
                                You may need to add symphony.com to your list of spam filter exceptions.
                            </Alert>
                        </i-col>
                    </Row>
                </Content>
            </Layout>
            <Footer>

            </Footer>
        </Layout>
        
    </div>
</template>
<script>

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
                    { hid: 'description', name: 'description', content: 'Please enter your email for verification.' }
                ]
                
            }
        },
        mounted: function() {
                this.emailAddress = this.$store.state.email.email_address
        },
        methods: {
            handleResendEmail() {
               this.$Notice.success({
                title: 'Email verification Re-sent',
                desc: 'Email verification re-sent to: <br/><p style="margin:10px 0;font-weight:bold;">' + this.emailAddress + '</p>Click Change Email to use a different address.',
                duration: 6
               });
            },
            handleChangeEmail() {
                this.$router.push({ name: "email" });
            },
            handleStartInterview() {
                this.$router.push( { name: "contact" });
            }
        }
    }
</script>
<style scoped>
   
</style>