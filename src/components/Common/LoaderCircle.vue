<template>
  <div class="circle-loading-container" :style="{ height: size + 'px', width: size + 'px' }">
    <div :style="innerCircleStyle"/>
    <div :style="innerCircleStyle"/>
    <div :style="innerCircleStyle"/>
    <div :style="innerCircleStyle"/>
  </div>
</template>

<script>
export default {
  props: {
    size: {
      type: Number,
      required: false,
      default: 24
    }
  },
    computed: {
      innerCircleStyle() {
        return {
          height: this.size + 'px',
          width: this.size + 'px',
          borderWidth: this.size / 10 + 'px'
        }
      }
    }
}
</script>

<style scoped>
  .circle-loading-container,
  .circle-loading-container div {
    box-sizing: border-box;
  }

  .circle-loading-container {
    display: inline-block;
    position: relative;
  }

  .circle-loading-container div {
    box-sizing: border-box;
    display: block;
    position: absolute;
    margin: 0px;
    border-radius: 50%;
    animation: circle-loading-container 1.2s cubic-bezier(0.5, 0, 0.5, 1) infinite;
    border-style: solid;
    border-color: currentColor transparent transparent transparent;
  }

  .circle-loading-container div:nth-child(1) {
    animation-delay: -0.45s;
  }

  .circle-loading-container div:nth-child(2) {
    animation-delay: -0.3s;
  }

  .circle-loading-container div:nth-child(3) {
    animation-delay: -0.15s;
  }

  @keyframes circle-loading-container {
    0% {
      transform: rotate(0deg);
    }

    100% {
      transform: rotate(360deg);
    }
  }
</style>
