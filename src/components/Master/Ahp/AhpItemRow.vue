<template>
  <tr>
    <td>{{ number }}.</td>
    <td>
      {{ name }}
      <i
        v-if="tooltip != null"
        @click.prevent
        class="text-primary ml-1 iconsminds simple-icon-question"
        v-b-popover.hover="tooltip"
      />
    </td>
    <td>{{ code }}</td>
    <td>
      <NumericInput
        v-if="editableCoefficient"
        class="inline-edit"
        v-model="form.coefficient"
        :onChangeValue="valueChanged"
      />
      <span v-else>{{ coefficient || 0 }}</span>
    </td>
    <td>
      {{ unit }}
    </td>
  </tr>
</template>

<script>
  import { NumericInput } from '@/components/Common';

  export default {
    components: {
      NumericInput,
    },
    props: [
      'number',
      'name',
      'code',
      'unit',
      'coefficient',
      'editableCoefficient',
      'description',
      'tooltip',
    ],
    data() {
      return {
        form: { coefficient: parseFloat(this.coefficient) },
      };
    },
    methods: {
      valueChanged(newValue) {
        this.$emit('value-changed', newValue ?? 0);
      },
    },
  };
</script>

<style scoped>
  .inline-edit {
    border: none;
  }
</style>
