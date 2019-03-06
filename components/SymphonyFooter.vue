<template>
    <div v-bind:class="getFooterPositioningClass()"> <!-- class="footer-container"-->
        <Row type="flex" justify="center">
            <i-col>
                <div class="footer-item"><a href="https://symphony.com/en-US/legal/privacy" target="_blank">Privacy Policy</a></div>
                <div class="footer-item"><a href="https://symphony.com/en-US/legal/cookie-policy" target="_blank">Cookie Policy</a></div>
                <div class="footer-item"><a href="https://support.symphony.com/hc/en-us" target="_blank">Support</a></div>
            </i-col>
        </Row>
        <Row type="flex" justify="center" class="copyright-row">
            <i-col>Copyright © 2019 Symphony Communication Services, LLC. All Rights Reserved</i-col>
        </Row>
    </div>
</template>
<script>
export default {
    props: {
        isAbsolute: Boolean
    },
    methods: {
        getFooterPositioningClass() {
            if (!!this.isAbsolute) {
                return 'footer-container-abs'
            }
            else {
                return 'footer-container-std'
            }
        }
    }
}
</script>

<style scoped>
    .footer-container-std {
        border-top: 1px solid #d8d8d8;
        margin-top: 20px;
        padding: 20px 0;
    }

    .footer-container-abs {
        position: absolute;
        right: 0;
        bottom: 0;
        left: 0;
        border-top: 1px solid #d8d8d8;
        margin-top: 20px;
        padding: 20px 0;
    }

    .footer-item {
        float: left;
        height: 15px;
        width: 75px;
        margin: 0 15px;
    }

    .footer-item a {
        text-decoration: none;
        color: #333;
    }

    .copyright-row {
        margin-top: 10px;
    }
</style>

