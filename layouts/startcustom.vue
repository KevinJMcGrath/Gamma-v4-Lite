<template>
    <div>
        <nuxt/>
        <symphony-footer v-bind:is-absolute="false"/>
    </div>
</template>
<script>
import SymphonyFooter from '~/components/SymphonyFooter.vue'

export default {
    components: {
        SymphonyFooter
    }
}
</script>