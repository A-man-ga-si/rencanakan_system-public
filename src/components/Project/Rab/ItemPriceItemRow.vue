<template>
  <tr>
    <td>{{ index + 1 }}</td>
    <td>
      <input
        v-if="isCustomItemPrice(item)"
        type="text"
        class="rab-inline-editor"
        style="width: 100%"
        :value="item.name"
      />
      <span v-else>{{ item.name }}</span>
    </td>
    <td>
      <v-select
        v-if="isCustomItemPrice(item)"
        label="name"
        class="rab-inline-editor"
        :reduce="unit => unit.hashid"
        v-model="unitId"
        :options="units"
      />
      <span v-else>{{ item.unit.name }}</span>
    </td>
    <td>
      <input
        v-if="isCustomItemPrice(item)"
        type="text"
        class="rab-inline-editor"
        :value="item.code"
      />
      <span v-else>{{ item.id }}</span>
    </td>
    <td>
      <input type="text" class="rab-inline-editor" :value="item.price" />
    </td>
    <td>
      <div class="action-bt" v-if="isCustomItemPrice(item)">
        <DeleteButton @click.prevent="" />
      </div>
    </td>
  </tr>
</template>

<script>
  import EditButton from '@/components/DataTable/Actions/EditButton.vue';
  import DeleteButton from '@/components/DataTable/Actions/DeleteButton.vue';

  export default {
    props: {
      item: {
        type: Object,
        required: true,
      },
      index: {
        type: Number,
        required: true,
      },
      units: {
        type: Array,
        required: true,
      },
    },
    data() {
      return {
        unitId: this.isCustomItemPrice(this.item) ? this.item.unit.hashid : '',
      };
    },
    methods: {
      isCustomItemPrice(itemPrice) {
        return !!itemPrice.project_id;
      },
    },
    components: {
      EditButton,
      DeleteButton,
    },
  };
</script>

<style scoped>
  .rab-inline-editor {
    border: none !important;
  }

  td {
    vertical-align: middle;
  }

  .inline-edit {
    border: none;
  }
</style>
