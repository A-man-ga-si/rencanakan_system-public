<template>
  <div class="master-ahp">
    <h1>Master AHP</h1>
    <FloatingActionButton v-b-modal.add-ahp-modal />
    <AddAhp />
  </div>
</template>

<script>
  import FloatingActionButton from '@/components/Project/FloatingActionButton.vue';
  import AddAhp from '@/components/Master/Ahp/AddAhp.vue';

  export default {
    components: {
      FloatingActionButton,
      AddAhp,
    },
  };
</script>
