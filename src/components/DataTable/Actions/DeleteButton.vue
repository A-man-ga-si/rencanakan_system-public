<template>
  <a
    :href="href"
    class="text-danger mr-2"
    :class="additionalClasses"
    @click="onClick"
  >
    <slot>
      <ph-trash :size="20" weight="light" />
    </slot>
  </a>
</template>

<script>
  import { PhTrash } from 'phosphor-vue';

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
    components: {
      PhTrash,
    },
  };
</script>
