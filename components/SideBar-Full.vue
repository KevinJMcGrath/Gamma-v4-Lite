<template>
	<Sider hide-trigger class="sidebarClass">
        <Steps :current="0" direction="vertical">
            <Step title="You" content="Information about the first user."></Step>
            <Step title="Your Company" content="Some details about your organization."></Step>
            <Step title="Symphony Service" content="How should the service be configured?"></Step>
            <Step title="Legalese" content="Our terms and conditions."></Step>
            <Step title="Billing Details" content="Credit card and billing information"></Step>
            <Step title="Purchase Summary" content="Subscription summary and confirmation."></Step>
            <Step title="Finished!" content=""></Step>
        </Steps>
    </Sider>
</template>

<script>
	export default {
        data() {
            return {
            	current: 0
            }
        }
    }
</script>

<style>
	

</style>

