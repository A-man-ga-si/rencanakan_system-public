<template>
  <div class="my-auto" style="display: flex;">
    <span class="my-auto">Sort By: </span>
    <div style="position: relative; margin-left: 8px;">
      <!-- Input -->
      <button class="input-button" type="button" @click="onClickInputButton" :style="inputStyle">
        <span>{{ selectedOption?.label }}</span>
        <icon-down-chevron
          style="
            width: 16px;
            height: 16px;
            margin-top: auto;
            margin-bottom: auto;
            margin-left: auto;
          "
        />
      </button>

      <!-- Selection Popup -->
      <div v-if="isExpanded" class="option-container">
        <div
          v-for="option in options"
          :key="option.key"
          class="option"
          @click="() => onSelectOption(option.key)"
        >
          {{ option.label }}
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import { IconDownChevron } from '@/assets/icons';

  export default {
    props: {
      inputStyle: Object | undefined,
      options: [],
      selectedOption: undefined,
      didSelectOption: Function,
    },
    data() {
      return {
        isExpanded: false,
      };
    },
    methods: {
      onClickInputButton() {
        this.isExpanded = !this.isExpanded;
      },
      onSelectOption(key) {
        this.isExpanded = false;
        this.didSelectOption(key);
      },
    },
    components: {
      IconDownChevron,
    },
  };
</script>

<style scoped>
  .option-container {
    position: absolute;
    background-color: white;
    left: 0;
    right: 0;
    border-radius: 4px;
    box-shadow: 0px 0px 15px -5px rgb(0 0 0 / 0.25);
  }

  .input-button {
    background-color: white;
    display: flex;
    border: 1px solid #d7d7d7;
    padding: 8px 16px;
    border-radius: 4px;
    width: 100%;
  }

  .option {
    padding: 8px 16px;
    cursor: pointer;
  }

  .option:hover {
    background-color: rgb(241 245 249);
  }
</style>
