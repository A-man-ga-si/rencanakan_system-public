<template>
  <div class="sync-container" v-show="getSynchroning">
    <img src="@/assets/img/custom/spinner_circle.gif" alt="" width="15" class="mr-2"> Synchronizing to Server
  </div>  
</template>

<script>

import { mapGetters } from 'vuex'

export default {
  computed : {
    ...mapGetters(['getSynchroning'])
  }
}
</script>

<style scoped>
.sync-container {
  position: fixed;
  z-index: 999;
  left: 20px;
  bottom: 20px;
  background-color: #00365a;
  color: white;
  padding: 10px 19px;
  box-shadow: 2px 2px 10px rgba(0, 0, 0, .5);
  transition: .2s;
}
</style>