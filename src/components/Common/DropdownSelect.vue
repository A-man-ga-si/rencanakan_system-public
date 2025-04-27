<template>
  <div 
    class="dropdown-container"
    :class="[customClass, { focused: isFocused }]"
  >
    <select
      class="dropdown-select"
      :value="value"
      :disabled="disabled"
      @change="$emit('input', $event.target.value)"
      @focus="isFocused = true"
      @blur="isFocused = false"
    >
      <option value="">{{ placeholder }}</option>
      <option 
        v-for="option in options" 
        :key="option" 
        :value="option"
      >
        {{ option }}
      </option>
    </select>
    <div class="dropdown-icon">
      <IconChevronDown :size="iconSize" stroke="#3A3A3A" />
    </div>
  </div>
</template>

<script>
import IconChevronDown from '@/components/Svg/ChevronDown.vue'

export default {
  name: 'DropdownSelect',
  components: {
    IconChevronDown
  },
  props: {
    value: String,
    placeholder: {
      type: String,
      default: 'Select an option...'
    },
    disabled: Boolean,
    options: {
      type: Array,
      default: () => []
    },
    customClass: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      isFocused: false
    }
  },
  computed: {
    iconSize() {
      return window.innerWidth >= 768 ? 20 : 16;
    }
  }
}
</script>

<style scoped>
  .dropdown-container {
    align-self: stretch;
    padding: 0.5rem 0.75rem;
    border-radius: 0.125rem;
    outline: 1px solid #D7D7D7;
    outline-offset: -1px;
    display: inline-flex;
    justify-content: space-between;
    align-items: center;
    overflow: hidden;
    width: 100%;
    max-width: 100%;
    position: relative;
    background-color: white;
  }

  .dropdown-container.focused {
    outline-color: #4A98C9;
  }

  .dropdown-select {
    width: 100%;
    color: #3A3A3A;
    font-size: 0.75rem;
    font-family: 'Roboto', sans-serif;
    font-weight: normal;
    line-height: 1;
    background-color: transparent;
    border: none;
    outline: none;
    appearance: none;
    padding-right: 2rem;
    padding: 0 2rem 0 0.25rem;
    margin: 0;
    height: auto; 
  }

  .dropdown-select::placeholder {
    color: #70787F;
    opacity: 1;
  }

  .dropdown-icon {
    position: absolute;
    right: 0.75rem;
    top: 35%;
    pointer-events: none;
    display: flex;
    align-items: center;
    height: auto;
  }

  @media (min-width: 768px) {
    .dropdown-select {
      font-size: 0.875rem;
    }
  }
</style>
