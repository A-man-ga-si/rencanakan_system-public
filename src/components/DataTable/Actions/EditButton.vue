<template>
  <a
    :href="href"
    class="text-primary mr-2"
    :class="additionalClasses"
    @click="onClick"
  >
    <slot>
      <ph-pencil :size="20" weight="light" />
    </slot>
  </a>
</template>

<script>
  import { PhPencil } from 'phosphor-vue';

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
      PhPencil,
    },
  };
</script>
