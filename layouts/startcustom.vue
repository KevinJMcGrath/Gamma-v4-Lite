<template>
    <div>
        <nuxt/>
        <symphony-footer v-bind:is-absolute="true"/>
    </div>
</template>
<script>
import SymphonyFooter from '~/components/SymphonyFooter.vue'

export default {
    middleware: 'phk',
    components: {
        SymphonyFooter
    }
}
</script>