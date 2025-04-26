<template>
    <svg xmlns="http://www.w3.org/2000/svg" :width="size" :height="size" viewBox="0 0 24 24" :fill="color" :stroke="stroke" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-search">
        <circle cx="10" cy="10" r="7"></circle>
        <line x1="21" y1="21" x2="15.65" y2="15.65"></line>
    </svg>
</template>

<script>
export default {
    name: 'IconLup',
    props: {
        size: {
            type: [Number, String],
            default: 24
        },
        color: {
            type: String,
            default: 'none'
        },
        stroke: {
            type: String,
            default: 'currentColor'
        }
    }
}
</script>