<template>
  <div class="unit">
    <div class="text-right mb-3">
      <b-btn v-b-modal.add-unit variant="primary">{{
        $t('pages.master.unit.add-unit-bt')
      }}</b-btn>
    </div>
    <vuetable
      api-url="https://vuetable.ratiw.net/api/users"
      :fields="['name', 'nickname', 'email', 'gender']"
      data-path=""
      pagination-path=""
      ref="vuetable"
    >
    </vuetable>
    <AddUnit />
  </div>
</template>

<script>
  import Vuetable from 'vuetable-2';
  import AddUnit from '@/components/Master/Unit/AddUnit';

  export default {
    components: {
      Vuetable,
      AddUnit,
    },
  };
</script>
