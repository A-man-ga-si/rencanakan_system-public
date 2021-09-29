<template>
  <tr>
    <td>{{ idx + 1 }}.</td>
    <td>
      <input
        type="text"
        class="inline-edit"
        v-model="name"
        :disabled="ahsItemableType == 'ItemPrice'"
      />
    </td>
    <td>
      <v-select
        label="id"
        :reduce="
          ahsItemable => `${ahsItemable.ahs_itemable_type}-${ahsItemable.id}`
        "
        :options="getAhsItemableList"
        v-model="ahsItemableId"
        id=""
      />
    </td>
    <td>
      <v-select
        label="name"
        :reduce="unit => unit.hashid"
        v-model="unitId"
        :options="unitsList"
      />
    </td>
    <td>
      <input type="number" v-model="coefficient" class="inline-edit" />
    </td>
    <td>{{ getItemPrice }}</td>
    <td>{{ getSubtotalPrice }}</td>
  </tr>
</template>

<script>
  import { isItemPrice, ahsItemable, formatCurrency } from './../../../utils';

  export default {
    props: ['ahsItem', 'idx', 'codesList', 'unitsList', 'ahsItemableList'],
    data() {
      return {
        name: isItemPrice(this.ahsItem.ahs_itemable_type)
          ? this.ahsItem.ahs_itemable.name
          : this.ahsItem.name,
        ahsItemableId: `${ahsItemable(this.ahsItem.ahs_itemable_type)}-${
          this.ahsItem.ahs_itemable_id
        }`,
        unitId: isItemPrice(this.ahsItem.ahs_itemable_type)
          ? this.ahsItem.ahs_itemable.unit.hashid
          : this.ahsItem.unit?.hashid,
        coefficient: this.ahsItem.coefficient,
      };
    },
    computed: {
      ahsItemableType() {
        return ahsItemable(this.ahsItem.ahs_itemable_type);
      },
      ahsItemName() {
        return this.ahsItemableType == 'ItemPrice'
          ? this.ahsItem.ahs_itemable.name
          : this.ahsItem.name;
      },
      getAhsItemableList() {
        return this.ahsItemableList.map(ahsItemableItem => {
          ahsItemableItem.ahs_itemable_type = ahsItemable(
            ahsItemableItem.ahs_itemable_type
          );
          return ahsItemableItem;
        });
      },
      getItemPrice() {
        return `Rp. ${formatCurrency(this.ahsItem.ahs_itemable.subtotal)}`;
      },
      getSubtotalPrice() {
        return `Rp. ${formatCurrency(this.ahsItem.subtotal)}`;
      },
    },
  };
</script>

<style scoped>
  .inline-edit:disabled {
    background-color: transparent;
  }

  .inline-edit {
    border: none;
  }

  td {
    vertical-align: middle;
  }
</style>
