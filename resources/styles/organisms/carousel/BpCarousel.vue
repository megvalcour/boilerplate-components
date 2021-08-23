<template>
    <swiper
        ref="mySwiper"
    >
        <slot />
    </swiper>
</template>
<script>
import { Swiper } from 'swiper/vue'
import 'swiper/swiper-bundle.css'

export default {
    components: {
        Swiper,
    },
}
</script>
