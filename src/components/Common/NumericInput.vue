<template>
  <input
    :disabled="disabled"
    type="text"
    placeholder="0"
    v-model="localValue"
    @keydown="onKeyDownInput"
    @input="onEditInput"
    @change="onChangeInput"
  />
</template>

<script>
  export default {
    props: {
      disabled: {
        type: Boolean,
        default: false,
      },
      value: {
        type: Number,
        default: undefined,
      },
      onChangeValue: {
        type: Function,
        required: true,
      },
      isSeparatorEnabled: {
        type: Boolean,
        default: true,
      },
    },
    data() {
      return {
        localValue: undefined,
      };
    },
    methods: {
      onKeyDownInput(event) {
        if (
          (String(this.localValue).match(/,/g) || []).length === 1 &&
          event.key === ','
        ) {
          event.preventDefault();
        }
      },
      onEditInput() {
        let mutatedValue = parseFloat(this.sanitizedValue.replace(',', '.'));
        if (isNaN(mutatedValue)) {
          mutatedValue = undefined;
        }
        this.$emit('input', mutatedValue);
      },
      onChangeInput() {
        let mutatedValue = this.sanitizedValue;
        if (mutatedValue === undefined) {
          this.$emit('input', undefined);
          this.onChangeValue(undefined);
          return;
        }
        if (mutatedValue.endsWith(',')) {
          mutatedValue = mutatedValue.slice(0, -1);
        }
        this.localValue = mutatedValue;
        mutatedValue = parseFloat(mutatedValue.replace(',', '.'));
        if (isNaN(mutatedValue)) {
          mutatedValue = undefined;
        }
        this.$emit('input', mutatedValue);
        this.onChangeValue(mutatedValue);
      },
    },
    computed: {
      sanitizedValue() {
        if (this.localValue === undefined) {
          return undefined;
        }
        this.localValue = this.localValue
          .replace(/[^0-9,]/g, '')
          .replace(/^,/g, '');
        if (!this.isSeparatorEnabled) {
          this.localValue = this.localValue.replace(',', '');
        }
        let finalValue = this.localValue;
        return finalValue;
      },
    },
    watch: {
      value(newValue) {
        if (this.localValue != undefined && this.localValue.endsWith(',')) {
          return;
        }
        if (newValue == 0 || newValue === undefined) {
          this.localValue = undefined;
          return;
        }
        this.localValue = String(newValue).replace('.', ',');
      },
    },
    mounted() {
      if (this.value == 0 || this.value === undefined) {
        this.localValue = undefined;
        return;
      }
      this.localValue = String(this.value).replace('.', ',');
    },
  };
</script>
