<template>
    <div>
        <nuxt/>
        <symphony-footer/>
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