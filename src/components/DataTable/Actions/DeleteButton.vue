<template>
  <a
    :href="href"
    class="text-danger mr-2"
    :class="additionalClasses"
    @click="onClick"
  >
    <slot>
      <i class="simple-icon-trash"></i>
    </slot>
  </a>
</template>

<script>
  export default {
    props: {
      href: {
        type: String,
        default: '',
      },
      additionalClasses: {
        type: Object,
      },
    },
    methods: {
      onClick(data) {
        this.$emit('click', data);
      },
    },
  };
</script>
