<template>
  <tr>
    <td>{{ index + 1 }}.</td>
    <td>
      <input type="text" class="inline-edit w-100" :value="rabItemData.name" />
    </td>
    <td>
      <v-select
        name=""
        :options="codesList"
        id=""
        v-model="defaultSelectedCode"
      />
    </td>
    <td>
      <input
        type="text"
        class="inline-edit w-100"
        :value="rabItemData.volume"
      />
    </td>
    <td>
      <v-select v-model="defaultSelectedUnit" :options="unitsList" />
    </td>
    <td>Rp. 100,000</td>
    <td>Rp. 200,000</td>
    <td>
      <a href="#" class="text-danger action-close">
        <i class="iconminds simple-icon-close"></i>
      </a>
    </td>
  </tr>
</template>

<script>
  export default {
    props: {
      rabItemData: {
        type: Object,
        required: true,
      },
      index: {
        type: Number,
        required: true,
      },
    },
  };
</script>

<style scoped>
  .inline-edit {
    border: none;
  }

  .custom-nice-border {
    border: 2px solid #ddd;
  }
</style>
