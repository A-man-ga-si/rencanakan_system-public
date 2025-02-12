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
        <a href="#" class="h4 ml-1 text-white" @click.prevent="editRab">
          <ph-pencil weight="light" :size="25" />
        </a>
        <a class="h4 ml-1 text-white" href="#" @click.prevent="deleteRab">
          <ph-x weight="light" :size="25" />
        </a>
      </div>
    </div>
    <div class="body" v-show="!mainCardCollapsed">
      <div class="table-responsive-xxl" style="overflow-y: visible;">
        <table class="table text-left mx-3" style="width: 100%; table-layout: auto;">
          <thead>
            <tr>
              <th scope="col" style="width: 5%; min-width: 50px;">No.</th>
              <th scope="col" style="width: 25%; min-width: 350px;">Uraian Pekerjaan</th>
              <th scope="col" style="width: 20%; min-width: 300px;">Kode</th>
              <th scope="col" style="width: 5%; min-width: 75px;">Volume</th>
              <th scope="col" style="width: 10%; min-width: 150px;">SAT</th>
              <th scope="col" style="width: 15%; min-width: 200px;">Harga Sat (Rp.)</th>
              <th scope="col" style="width: 15%; min-width: 200px;">Jumlah (Rp.)</th>
              <th style="width: 5%"></th>
            </tr>
          </thead>
          <tbody>
            <RabSummaryItemRow
              v-for="(rabItemI, idx) in rabItem.rab_item"
              :index="idx"
              :key="idx"
              :rab-item-data="rabItemI"
              :rab="rabItem"
              :ahs-group-items="ahsGroupItems"
              :ahs-items="ahsItems"
              :unit-ids="unitCodeList"
              :selected-ahs-group-key="selectedAhsGroupKey"
              :ahs-search-query="ahsSearchQuery"
              @did-ahs-group-changed="(data) => $emit('did-ahs-group-changed',  data)"
              @did-search-input-changed="(data) => $emit('did-search-input-changed', data)"
              @did-rab-item-updated="(mutatedRabItem) => $emit('did-rab-item-updated', rabItem, mutatedRabItem)"
              @did-reset-ahs-button-clicked="didResetAhsButtonClicked"
              @did-ahs-dropdown-showed="() => $emit('did-ahs-dropdown-showed')"
              @did-ahs-dropdown-dismissed="() => $emit('did-ahs-dropdown-dismissed')"
              @did-ahs-code-updated="didAhsCodeUpdated"
              @rab-item-deleted="onRabItemDeleted"
              @update-rab-item="onRabItemRowUpdated"
            />
            <tr>
              <td colspan="8" class="font-weight-bold">
                <a href="#" class="d-block w-100" @click.prevent="addRabItem">
                  + Tambah baris
                </a>
              </td>
            </tr>
          </tbody>
          <tbody
            v-for="(rabItemHeader, idx) in rabItem.rab_item_header"
            :key="idx"
          >
            <tr>
              <td colspan="8" class="p-3">
                <div
                  class="py-2 px-4"
                  style="
                    border-radius: 30px;
                    background-color: #586878;
                    color: white;
                  "
                >
                  <p class="d-inline-block mb-0" style="font-size: 16px">
                    {{ romanized(idx + 1) }}. {{ rabItemHeader.name }}
                  </p>
                  <a
                    href="#"
                    @click.prevent="deleteRabItemHeader(rabItemHeader.hashid)"
                    class="text-white action-close float-right ml-2"
                    style="margin-top: -3px"
                  >
                    <ph-x weight="light" />
                  </a>
                  <a
                    href="#"
                    @click.prevent="editRabItemHeader(rabItemHeader)"
                    class="text-white action-close float-right"
                    style="margin-top: -3px"
                  >
                    <ph-pencil weight="light" />
                  </a>
                </div>
              </td>
            </tr>
            <RabSummaryItemRow
              v-for="(rabItemI, idx2) in rabItemHeader.rab_item"
              :index="idx2"
              :key="idx2"
              :rab-item-data="rabItemI"
              :rab="rabItem"
              :ahs-group-items="ahsGroupItems"
              :ahs-items="ahsItems"
              :unit-ids="unitCodeList"
              :selected-ahs-group-key="selectedAhsGroupKey"
              :ahs-search-query="ahsSearchQuery"
              @rab-item-deleted="onRabItemDeleted"
              @update-rab-item="onRabItemRowUpdated"
              @did-rab-item-updated="(mutatedRabItem) => $emit('did-rab-item-updated', rabItem, mutatedRabItem)"
              @did-ahs-group-changed="(data) => $emit('did-ahs-group-changed',  data)"
              @did-search-input-changed="(data) => $emit('did-search-input-changed', data)"
              @did-reset-ahs-button-clicked="(data) => didResetAhsHeaderButtonClicked(rabItemHeader, data)"
              @did-ahs-dropdown-showed="() => $emit('did-ahs-dropdown-showed')"
              @did-ahs-dropdown-dismissed="() => $emit('did-ahs-dropdown-dismissed')"
              @did-ahs-code-updated="(data) => didHeaderAhsCodeUpdated(rabItemHeader, data)"
            />
            <tr>
              <td colspan="8" class="font-weight-bold">
                <a
                  href="#"
                  @click.prevent="addRabItem(rabItemHeader)"
                  class="d-block w-100"
                >
                  + Tambah baris
                </a>
              </td>
            </tr>
          </tbody>
          <tbody>
            <tr>
              <td colspan="8" class="text-center py-3">
                <b-btn
                  class="w-100 py-1"
                  style="
                    font-size: 16px;
                    border-style: dashed;
                    border-width: 2px;
                  "
                  @click.prevent="addRabItemHeader"
                  variant="outline-primary"
                >
                  + Tambah Section
                </b-btn>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      <hr />
    </div>
    <div class="summary-footer">
      <div class="d-flex justify-content-between mt-3 px-3">
        <h2 class="text-primary font-weight-bold">Total</h2>
        <h2 class="text-primary font-weight-bold">
          Rp. {{ formattedSubtotal }}
        </h2>
      </div>
    </div>
  </div>
</template>

<script>
  import { toRoman } from 'roman-numerals';
  import RabSummaryItemRow from '@/components/Project/RabSummaryItemRow.vue';
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
      ahsGroupItems: {
        type: Array,
      },
      ahsItems: {
        type: Array,
      },
      selectedAhsGroupKey: {
        type: String,
        default: null
      },
      ahsSearchQuery: {
        type: String,
        default: ''
      },
      didAhsGroupSelected: {
        type: Function
      }
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
      didAhsCodeUpdated(data) {
        this.$emit('did-ahs-code-updated', {
          rabId: this.rabItem.hashid,
          rabHeaderId: null,
          rabRowItemId: data.rabRowItemId,
          ahsId: data.ahsId
        });
      },
      didResetAhsButtonClicked(data) {
        this.$emit('did-reset-ahs-button-clicked', {
          rabId: this.rabItem.hashid,
          rabHeaderId: null,
          rabRowItemId: data.rabRowItemId,
        });
      },
      didResetAhsHeaderButtonClicked(rabHeader, data) {
        this.$emit('did-reset-ahs-button-clicked', {
          rabId: this.rabItem.hashid,
          rabHeaderId: rabHeader.hashid,
          rabRowItemId: data.rabRowItemId,
        });
      },
      didHeaderAhsCodeUpdated(rabHeader, data) {
        this.$emit('did-ahs-code-updated', {
          rabId: this.rabItem.hashid,
          rabHeaderId: rabHeader.hashid,
          rabRowItemId: data.rabRowItemId,
          ahsId: data.ahsId
        });
      }
    },
    computed: {
      alphabeuticalRabNumber() {
        return numberToAlphabet(this.index).toUpperCase();
      },
      formattedSubtotal() {
        let subtotal = 0;
        for (const rabItemRow of this.rabItem.rab_item) {
          if (rabItemRow.custom_ahs != null) {
            subtotal = subtotal + Math.round(rabItemRow.custom_ahs.price) * rabItemRow.volume
            continue;
          }
          subtotal = subtotal + Math.round(rabItemRow.price) * rabItemRow.volume;
        }
        for (const rabHeaderItemRow of this.rabItem.rab_item_header) {
          for (const rabItemRow of rabHeaderItemRow.rab_item) {
            if (rabItemRow.custom_ahs != null) {
              subtotal = subtotal + Math.round(rabItemRow.custom_ahs.price) * rabItemRow.volume;
              continue;
            }
            subtotal = subtotal + Math.round(rabItemRow.price) * rabItemRow.volume;
          }
        }
        return formatCurrency(parseInt(subtotal));
      },
    },
    components: {
      RabSummaryItemRow,
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
