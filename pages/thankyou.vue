<template>
    <div class="sym-layout">
        <Layout>
            <Header class="headerClass"></Header>
            <Layout >
                <Sider hide-trigger class="sidebarClass">
                    <Steps :current="6" direction="vertical">
                        <Step title="You" content="Information about the first user."></Step>
                        <Step title="Your Company" content="Some details about your organization."></Step>
                        <Step title="Symphony Service" content="How should the service be configured?"></Step>
                        <Step title="Legalese" content="Our terms and conditions."></Step>
                        <Step title="Billing" content="Credit card and billing information."></Step>
                        <Step title="Purchase Summary" content="Subscription summary and confirmation."></Step>
                        <Step title="Finished!" content=""></Step>
                    </Steps>
                </Sider>
                <Content class="contentClass">
                    <Layout class="invisibleLayout">
                        <Row type="flex" justify="center" class="logoRow">
                            <i-col span=2 >
                                <img src="../assets/images/Finished-Icon.png" height=75/>
                            </i-col>
                        </Row>
                        <Row type="flex" justify="center" class="standardRow">
                            <i-col :xs=24 :sm=18 :md=10 :lg=8>
                                <p class="p2">Thank You!</p>
                            </i-col>
                        </Row>
                        <Row type="flex" justify="center" class="standardRow">
                            <i-col :xs=24 :sm=20 :md=18 :lg=16>
                                <p class="p4">
                                    We're going to start spinning up your service shortly. We expect it to be ready in about <b style="color: Firebrick;">2 hours</b>.
                                    <br/><br/>
                                    You should shortly be receving an email containing a summary of your purchase. Upon delivery of your Symphony service creditials, you will receive a receipt for the charge on your credit card. You will <b>not</b> be charged until your service is deilvered.  
                                </p>
                            </i-col>
                        </Row>

                        <Row type="flex" justify="center" style="margin-top: 40px;">
                            <i-col :xs=24 :sm=20 :md=18 :lg=14>
                                <iframe width="560" height="315" src="https://www.youtube.com/embed/tRAmXi0uAio" frameborder="0" allow="autoplay; encrypted-media" allowfullscreen></iframe>
                            </i-col>
                        </Row>

                        <Row type="flex" justify="center"  class="standardRow">                            
                            <i-col span=14>
                                <Card>
                                    <p slot="title">What's Next?</p>
                                    <Collapse>
                                        <Panel name="pnl_gdpr">
                                            <b>Getting Started - Quick tips and How-to guides</b>
                                            <p slot="content">
                                                This document describes how Symphony Communications, LLC conforms to the requirements of the EU GDPR.
                                                <br/><br/>
                                                <Button type="primary">
                                                    <Icon type="eye"></Icon>
                                                    Read
                                                </Button>
                                                <Button type="primary">
                                                    <Icon type="android-download"></Icon>
                                                    Download
                                                </Button>
                                            </p>
                                        </Panel>
                                        <Panel name="pnl_privacy">
                                            <b>Community - Connecting through Symphony</b>
                                            <p slot="content">
                                                Our standard privacy policy regarding any personal information you submit on any of our public facing pages. 
                                                <br/><br/>
                                                <Button type="primary">
                                                    <Icon type="eye"></Icon>
                                                    Read
                                                </Button>
                                                <Button type="primary">
                                                    <Icon type="android-download"></Icon>
                                                    Download
                                                </Button>
                                            </p>
                                        </Panel>
                                        <Panel name="pnl_msa">
                                            <b>Development - Adding Apps and Bots to Symphony</b>
                                            <p slot="content">
                                                Terms and conditions for using the Symphony platform for communication. You are required to agree to these conditions before continuing. 
                                                <br/><br/>
                                                <Button type="primary">
                                                    <Icon type="eye"></Icon>
                                                    Read
                                                </Button>
                                                <Button type="primary">
                                                    <Icon type="android-download"></Icon>
                                                    Download
                                                </Button>
                                            </p>
                                        </Panel>
                                    </Collapse>
                                </Card>
                            </i-col>
                        </Row>
                        
                    </Layout>
                </Content>
            </Layout>
            <Footer></Footer>
        </Layout>
    </div>  
</template>
<script>
    export default {
        data() {
            return { }
        },
        methods: {
        }
    }
</script>
<style scoped>


</style>