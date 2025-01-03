<template>
  <div class="has-float-label" style="position: relative">
    <legend>{{ label }}</legend>
    <div class="value-container" @click="toggleCalendar">
      {{ localValue ?? '' }}
    </div>

    <!-- Calendar Popup -->
    <div v-show="isCalendarShow" style="position: relative">
      <div
        style="
          position: absolute;
          background-color: white;
          top: 8px;
          padding: 8px;
          border: 1px solid rgba(0, 0, 0, 0.15);
        "
      >
        <b-calendar
          v-model="localValue"
          :date-format-options="{
            year: 'numeric',
            month: 'numeric',
            day: 'numeric',
          }"
          @input="onSelectLocalDate"
        ></b-calendar>
      </div>
    </div>
  </div>
</template>

<script>
  export default {
    props: {
      label: { type: String },
      value: {
        type: String,
        required: true,
      },
    },
    data() {
      return {
        localValue: this.value,
        isCalendarShow: false,
      };
    },
    methods: {
      onSelectLocalDate() {
        this.isCalendarShow = false;
        this.$emit('input', this.localValue);
        this.$emit('on-select-date');
      },
      toggleCalendar() {
        this.isCalendarShow = !this.isCalendarShow;
      },
    },
    watch: {
      value(newVal) {
        this.localValue = newVal;
      },
    },
  };
</script>

<style scoped>
  .value-container {
    padding: 0.5rem 0.75rem;
    border: 1px solid #d7d7d7;
    width: 100%;
    cursor: pointer;
  }
</style>
