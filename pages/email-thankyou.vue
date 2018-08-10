<template>
    <div class="lite-layout">
        <div class="lite-header">
            <div class="lite-header-logo"></div>
        </div>
        <div class="lite-banner">
            <p>Sign up</p>
        </div>

        <div class="lite-body">
            <Row>
                <i-col span=4></i-col>
                <i-col span=10 type="flex" justify="center" class="lite-col" style="border-right: 1px solid lightgray;">
                    <Row>
                        
                        <i-col span=6>
                            <img src="../assets/images/big-green-check.png" height="60px" />
                        </i-col>
                        <i-col span=16>
                            <p style="color: #006caf;">Please check your inbox for next steps.</p>
                            <div class="lite-container-row">
                                We sent a confirmation email to: <b>{{ $store.state.email.email_address }}</b>
                            </div>
                            <div class="lite-container-row">
                                <a class="lite-link-button" @click="handleResendEmail()">Resend email</a>
                                <br/><br/>
                                <a class="lite-link-button" @click="handleChangeEmail()">Enter new email address</a>
                            </div>
                        </i-col>
                    
                    
                    </Row>

                </i-col>
                <i-col span=8 type="flex" justify="center"  class="lite-col">
                    <p>The Symphony Edge</p>
                    <ul>
                        <li><div class="sym-list-bullet"><img src="../assets/images/lock.svg" height="20px"/></div>Lock-tight information security</li>
                        <li><div class="sym-list-bullet"><img src="../assets/images/check.svg" height="17px" /></div>Complies with global regulations</li>
                        <li><div class="sym-list-bullet"><img src="../assets/images/chat.svg" height="17px" /></div>Robust text, voice and video chat</li>
                        <li><div class="sym-list-bullet"><img src="../assets/images/refresh.svg" height="20px" /></div>Syncs with other productivity apps</li>
                        <li><div class="sym-list-bullet"><img src="../assets/images/mobile.svg" height="20px" /></div>Ideal for desktop and mobile users</li>
                    </ul>

                </i-col>
                <i-col span=2></i-col>
            </Row>
        </div>
        
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
                this.$store.commit('SET_EMAIL', '')
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