<template>
  <tr>
    <td>{{ number }}.</td>
    <td>{{ name }}</td>
    <td>{{ code }}</td>
    <td>
      <input
        v-if="editableCoefficient"
        type="number"
        class="inline-edit"
        step="0.01"
        :value="coefficient || 0"
        @change.prevent="valueChanged"
      />
      <span v-else>{{ coefficient || 0 }}</span>
    </td>
    <td>
      {{ unit }}
    </td>
    <td>
      <input type="text" class="inline-edit" :value="description" />
    </td>
  </tr>
</template>

<script>
  export default {
    props: [
      'number',
      'name',
      'code',
      'unit',
      'coefficient',
      'editableCoefficient',
      'description',
    ],
    methods: {
      valueChanged(newValue) {
        this.$emit('value-changed', newValue);
      },
    },
  };
</script>

<style scoped>
  .inline-edit {
    border: none;
  }
</style>
