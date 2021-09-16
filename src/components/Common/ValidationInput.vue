<template>
  <div class="validation-input">
    <label
      class="form-group has-float-label mb-0 can-invalid"
      :class="fieldName"
    >
      <input
        :type="type"
        class="form-control"
        :value="value"
        @input="$emit('input', $event.target.value)"
      />
      <span>{{ label }}</span>
    </label>
    <span for="" class="mt-1 d-block text-danger error-msg d-none"> </span>
  </div>
</template>

<script>
  // NOTE: Validation input require validation mixin to work !
  export default {
    props: {
      value: {
        type: String,
        required: false,
      },
      fieldName: {
        type: String,
        required: true,
      },
      label: {
        type: String,
        required: true,
      },
      type: {
        type: String,
        required: false,
        default: 'text',
      },
      // ['value', 'fieldName', 'label']
    },
  };
</script>
