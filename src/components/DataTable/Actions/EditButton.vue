<template>
  <a
    :href="href"
    class="text-primary mr-2"
    :class="additionalClasses"
    @click="onClick"
  >
    <slot>
      <i class="simple-icon-pencil"></i>
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
