<template>
  <div class="labeled-select position-relative">
    <span v-if="label" class="px-1"> {{ label }} </span>
    <v-select
      name=""
      :options="options"
      id=""
      :value="value"
      @input="$emit('input', $event.target.value)"
    />
  </div>
</template>

<script>
  export default {
    props: ['options', 'value', 'label'],
  };
</script>

<style scoped>
  .labeled-select span {
    font-size: 90%;
    color: rgba(58, 58, 58, 0.7);
    background-color: white;
    position: absolute;
    z-index: 99;
    top: -7px;
    left: 7px;
  }
</style>
