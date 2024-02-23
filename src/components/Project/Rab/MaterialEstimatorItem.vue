<template>
  <div
    class="
      rab-card-single
      position-relative
      mb-3
      custom-nice-border
      pb-2
      rounded-md
      shadow-sm
    "
    style="padding-top: 0"
  >
    <div
      class="heading d-flex justify-content-between bg-primary px-3 pt-3"
      style="border-radius: 8px 8px 0 0"
    >
      <div class="left">
        <h4>{{ alphabeuticalRabNumber }}. {{ rabItem.name }}</h4>
      </div>
      <div class="right">
        <a
          href="#"
          style="font-weight: bold"
          @click.prevent="toggleMaincardCollapse"
          class="h4 text-white ml-1"
        >
          <ph-arrows-in weight="light" :size="25" v-if="!mainCardCollapsed" />
          <ph-arrows-out weight="light" :size="25" v-else />
        </a>
      </div>
    </div>
    <div class="body" v-show="!mainCardCollapsed">
      <div class="table-responsive-xxl">
        <table class="table text-left mx-3" style="width: 97%">
          <thead>
            <tr>
              <th scope="col" style="width: 3%">No.</th>
              <th scope="col">Uraian Pekerjaan</th>
              <th scope="col" style="width: 10%">Koefisien AHS</th>
              <th scope="col" style="width: 10%">Volume RAB</th>
              <th scope="col" style="width: 10%">Kebutuhan Bahan</th>
              <th scope="col" style="width: 15%">SAT</th>
            </tr>
          </thead>
          <tbody v-for="(itemRab, index) of mergedRabItems" :key="index">
            <tr>
              <td colspan="8" class="p-3">
                <div
                  class="py-2 px-4"
                  style="
                    border-radius: 30px;
                    background-color: #586878;
                    color: white;"
                >
                  <p class="d-inline-block mb-0" style="font-size: 16px">{{ itemRab.name }}</p>
                </div>
              </td>
            </tr>
            <MaterialEstimatorRow
              v-if="itemRab.custom_ahs"
              v-for="(customAhsItem, idx) in (itemRab.custom_ahs ? itemRab.custom_ahs.custom_ahs_item : [])"
              :index="idx"
              :key="idx"
              :rab-item-data="customAhsItem"
              :rab="itemRab"
              :custom-ahs-ids="ahsCodeList"
              :unit-ids="unitCodeList"
              @rab-item-deleted="onRabItemDeleted"
              @update-rab-item="onRabItemRowUpdated"
            />
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script>
  import { toRoman } from 'roman-numerals';
  import MaterialEstimatorRow from '@/components/Project/Rab/MaterialEstimatorRow.vue';
  import { mapActions } from 'vuex';
  import { Notify } from 'notiflix';
  import { showConfirmAlert, formatCurrency, numberToAlphabet } from '@/utils';
  import { PhX, PhPencil, PhArrowsIn, PhArrowsOut } from 'phosphor-vue';

  export default {
    props: {
      rabItem: {
        type: Object,
        required: true,
      },
      index: {
        type: Number,
        required: true,
      },
      unitCodeList: {
        type: Array,
        required: true,
      },
      ahsCodeList: {
        type: Array,
      },
    },
    mounted() {
    },
    data: () => ({
      mainCardCollapsed: false,
      editedRab: null,
    }),
    methods: {
      ...mapActions(['destroyRab', 'storeRabItem', 'destroyRabItemHeader']),
      toggleMaincardCollapse() {
        this.mainCardCollapsed = !this.mainCardCollapsed;
      },
      editRab() {
        this.$emit('edit-rab-item-bt-clicked', this.rabItem);
      },
      editRabItemHeader(rabItemHeader) {
        this.$emit(
          'edit-rab-item-header-bt-clicked',
          this.rabItem,
          rabItemHeader
        );
      },
      async deleteRab() {
        const { isConfirmed } = await showConfirmAlert({
          title: 'Hapus Item RAB ?',
          text: 'Item RAB ini akan dihapus, aksi ini tidak dapat dibatalkan !',
        });
        if (isConfirmed) {
          await this.destroyRab({
            projectId: this.$route.params.id,
            rabId: this.rabItem.hashid,
          });
          Notify.success('Berhasil menghapus RAB');
          this.onRabItemDeleted();
        }
      },
      async deleteRabItemHeader(rabItemHeaderId) {
        const { isConfirmed } = await showConfirmAlert({
          title: 'Hapus section RAB ini ?',
          text: 'Semua item RAB dibawah akan ikut dihapus !',
        });
        if (isConfirmed) {
          await this.destroyRabItemHeader({
            projectId: this.$route.params.id,
            rabId: this.rabItem.hashid,
            rabItemHeaderId,
          });
          this.$emit('rab-item-header-deleted');
          Notify.success('Berhasil menghapus section RAB');
        }
      },
      async addRabItem(header) {
        await this.storeRabItem({
          projectId: this.$route.params.id,
          rabId: this.rabItem.hashid,
          form: {
            rab_item_header_id: header ? header.hashid : null,
            volume: 0,
          },
        });
        this.$emit('rab-item-added');
      },
      onRabItemDeleted() {
        this.$emit('rab-item-deleted');
      },
      onRabItemRowUpdated() {
        this.$emit('rab-item-updated');
      },
      addRabItemHeader() {
        this.$emit('add-rab-item-header-bt-clicked', this.rabItem);
      },
      romanized(number) {
        return toRoman(number);
      },
    },
    computed: {
      alphabeuticalRabNumber() {
        return numberToAlphabet(this.index).toUpperCase();
      },
      formattedSubtotal() {
        return formatCurrency(parseInt(this.rabItem.subtotal));
      },
      mergedRabItems() {
        const filteredRabItem = this.rabItem.rab_item ? this.rabItem.rab_item.map(rabItem => {
          if (rabItem.custom_ahs) {
            return rabItem;
          } else {
            // Replicating the real rab item (with ahs) structure for non ahs rab item
            rabItem.custom_ahs = {
              custom_ahs_item: [
              {
                rab_item_without_ahs: true,
                custom_ahs_itemable: {
                  name: rabItem.name,
                },
                coefficient: 0,
                unit_id: rabItem.hashed_unit_id,
              }
              ]
            }
            return rabItem
          }
        }) : []
        const temporaryHeadedRabItems = this.rabItem.rab_item_header.length > 0 ? this.rabItem.rab_item_header.map(data => data.rab_item).flat().map(rabItem => {
          if (rabItem.custom_ahs) {
            return rabItem;
          } else {
            // Replicating the real rab item (with ahs) structure for non ahs rab item
            rabItem.custom_ahs = {
              custom_ahs_item: [
              {
                rab_item_without_ahs: true,
                custom_ahs_itemable: {
                  name: rabItem.name,
                },
                coefficient: 0,
                unit_id: rabItem.hashed_unit_id,
              }
              ]
            }
            return rabItem
          }
        }) : []
        if (typeof this.rabItem.rab_item != 'undefined' && this.rabItem.rab_item != null) {
          this.rabItem.rab_item = filteredRabItem.concat(temporaryHeadedRabItems)
        }
        console.log(this.rabItem)
        return this.rabItem.rab_item
      }
    },
    components: {
      MaterialEstimatorRow,
      PhX,
      PhPencil,
      PhArrowsIn,
      PhArrowsOut,
    },
  };
</script>

<style scoped>
  .inline-edit {
    border: none;
  }

  .action-close {
    font-size: 17px;
  }

  .rab-table-selector {
    border: none !important;
    height: 100%;
    width: 100%;
    background-color: transparent;
  }

  td {
    vertical-align: middle;
  }
</style>
