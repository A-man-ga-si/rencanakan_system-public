<template>
  <tr>
    <td>{{ idx + 1 }}.</td>
    <td>
      <input
        type="text"
        class="inline-edit"
        v-model="name"
        @change="submitUpdateAhsItem"
        :disabled="ahsItemableType == 'CustomItemPrice'"
      />
    </td>
    <td>
      <v-select
        label="display_name"
        @input="submitUpdateAhsItem"
        :reset-on-option-change="true"
        :reduce="
          (customAhsItemable) =>
            `${customAhsItemable.custom_ahs_itemable_type}~${customAhsItemable.custom_ahs_itemable_id}`
        "
        :options="getAhsItemableList"
        v-model="ahsItemableId"
      >
        <template slot="list-footer">
          <div class="text-center">
            <b-badge
              v-b-modal.create-item-price-modal
              variant="primary"
              class="add-item-btn"
              >Tambah Baru</b-badge
            >
          </div>
        </template>
      </v-select>
    </td>
    <td>
      <v-select
        label="name"
        :reduce="(unit) => unit.hashid"
        @input="submitUpdateAhsItem"
        v-model="unitId"
        :options="unitsList"
        :disabled="ahsItemableType === 'CustomItemPrice'"
      />
    </td>
    <td>
      <NumericInput
        class="inline-edit"
        v-model="coefficient"
        :is-zero-allowed="true"
        :onChangeValue="submitUpdateAhsItem"
      />
    </td>
    <td>{{ getItemPrice }}</td>
    <td>{{ getSubtotalPrice }}</td>
    <td>
      <DeleteButton @click.prevent="submitDeleteAhsItem" />
    </td>
  </tr>
</template>

<script>
  import DeleteButton from '@/components/DataTable/Actions/DeleteButton';
  import { mapActions } from 'vuex';
  import { ahsItemable, formatCurrency } from './../../../utils';
  import { Notify } from 'notiflix';
  import { showConfirmAlert } from './../../../utils';
  import { NumericInput } from '@/components/Common';

  export default {
    props: [
      'customAhsItem',
      'idx',
      'codesList',
      'unitsList',
      'customAhsItemableList',
      'customAhs',
    ],
    data() {
      return {
        name:
          ahsItemable(this.customAhsItem.custom_ahs_itemable_type) ===
          'CustomItemPrice'
            ? this.customAhsItem.custom_ahs_itemable.name
            : this.customAhsItem.name,
        ahsItemableId: `${ahsItemable(
          this.customAhsItem.custom_ahs_itemable_type,
        )}~${this.customAhsItem.custom_ahs_itemable_id}`,
        unitId:
          ahsItemable(this.customAhsItem.custom_ahs_itemable_type) ===
          'CustomItemPrice'
            ? this.customAhsItem.custom_ahs_itemable.unit.hashid
            : this.customAhsItem.unit?.hashid,
        coefficient:
          this.customAhsItem.coefficient !== 0
            ? this.customAhsItem.coefficient
            : undefined,
      };
    },
    methods: {
      ...mapActions(['updateCustomAhsItem', 'deleteCustomAhsItem']),

      async submitUpdateAhsItem() {
        try {
          const ahsType = ahsItemable(
            this.customAhsItem.custom_ahs_itemable_type,
          );

          const ahsItemableIdType = this.ahsItemableId.split('~');
          const dataToUpdate = {};

          if (ahsType === 'CustomAhs' || ahsType == 'CustomAhp') {
            dataToUpdate.name = this.name;
            dataToUpdate.unit_id = this.unitId;
          }

          dataToUpdate.custom_ahs_itemable_id = ahsItemableIdType[1];
          dataToUpdate.custom_ahs_itemable_type = ahsItemableIdType[0];
          dataToUpdate.coefficient = parseFloat(this.coefficient ?? 0);

          const data = await this.updateCustomAhsItem({
            customAhsItemId: this.customAhsItem.hashid,
            projectId: this.$route.params.id,
            form: dataToUpdate,
          });

          this.$emit('ahs-item-updated');
        } catch (err) {
          this.ahsItemableId = `${ahsItemable(
            this.customAhsItem.custom_ahs_itemable_type,
          )}~${this.customAhsItem.custom_ahs_itemable_id}`;
          Notify.failure(
            err?.response?.data?.message || 'Gagal mengupdate item AHS',
          );
        }
      },

      async submitDeleteAhsItem() {
        try {
          const { isConfirmed } = await showConfirmAlert({
            title: 'Hapus Item AHS',
            text: 'Aksi ini tidak dapat dibatalkan',
          });

          if (isConfirmed) {
            await this.deleteCustomAhsItem({
              projectId: this.$route.params.id,
              customAhsItemId: this.customAhsItem.hashid,
            });

            Notify.success('Berhasil menghapus item ahs');
            this.$emit('ahs-item-deleted');
          }
        } catch (err) {
          console.log(err.response);
          Notify.failure('Gagal menghapus AHS !');
        }
      },
    },
    computed: {
      ahsItemableType() {
        const ahsItemableData = this.customAhsItem.custom_ahs_itemable_type;
        return ahsItemable(ahsItemableData);
      },
      ahsItemName() {
        return this.ahsItemableType == 'ItemPrice'
          ? this.customAhsItem.custom_ahs_itemable.name
          : this.customAhsItem.name;
      },
      getAhsItemableList() {
        const ctx = this;
        const d = this.customAhsItemableList
          .filter((customAhsItemableItem) => {
            // Filter to not showing current AHS ID
            return !(
              ahsItemable(customAhsItemableItem.custom_ahs_itemable_type) ==
                'CustomAhs' &&
              customAhsItemableItem.display_id == ctx.customAhs.code
            );
          })
          .map((customAhsItemableItem) => {
            customAhsItemableItem.custom_ahs_itemable_type = ahsItemable(
              customAhsItemableItem.custom_ahs_itemable_type,
            );
            return customAhsItemableItem;
          });
        return d;
      },
      getItemPrice() {
        return `Rp. ${formatCurrency(
          ahsItemable(this.customAhsItem.custom_ahs_itemable_type) ==
            'CustomAhp'
            ? this.customAhsItem.custom_ahs_itemable.subtotal
            : this.customAhsItem.custom_ahs_itemable.price,
        )}`;
      },
      getSubtotalPrice() {
        return `Rp. ${formatCurrency(this.customAhsItem.subtotal)}`;
      },
    },
    components: {
      DeleteButton,
      NumericInput,
    },
    watch: {
      customAhsItem(e) {
        this.name =
          ahsItemable(e.custom_ahs_itemable_type) === 'CustomItemPrice'
            ? e.custom_ahs_itemable.name
            : e.name;
        this.unitId =
          ahsItemable(this.customAhsItem.custom_ahs_itemable_type) ===
          'CustomItemPrice'
            ? this.customAhsItem.custom_ahs_itemable.unit.hashid
            : this.customAhsItem.unit?.hashid;
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

  .add-item-btn {
    margin: 10px 0 10px 0;
    cursor: pointer;
  }

  td {
    vertical-align: middle;
  }
</style>
