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
      <div class="table-responsive-xxl">
        <table class="table text-left mx-3 table-responsive" style="width: 97%">
          <thead>
            <tr>
              <th scope="col" style="width: 3%">No.</th>
              <th scope="col">Uraian Pekerjaan</th>
              <th scope="col" style="width: 15%">Kode</th>
              <th scope="col" style="width: 10%">Volume</th>
              <th scope="col" style="width: 15%">SAT</th>
              <th scope="col" style="width: 15%">Harga Sat (Rp.)</th>
              <th scope="col">Jumlah (Rp.)</th>
              <th style="width: 2%"></th>
            </tr>
          </thead>
          <tbody>
            <RabSummaryItemRow
              v-for="(rabItemI, idx) in rabItem.master_rab_item"
              :index="idx"
              :key="idx"
              :rab-item-data="rabItemI"
              :rab="rabItem"
              :ahs-ids="ahsCodeList"
              :unit-ids="unitCodeList"
              @rab-item-deleted="onRabItemDeleted"
              @update-rab-item="onRabItemRowUpdated"
            />
            <tr>
              <td colspan="8" class="font-weight-bold">
                <a href="#" class="d-block w-100" @click.prevent="addMasterRabItem">
                  + Tambah baris
                </a>
              </td>
            </tr>
          </tbody>
          <tbody
            v-for="(rabItemHeader, idx) in rabItem.master_rab_item_header"
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
              v-for="(rabItemI, idx2) in rabItemHeader.master_rab_item"
              :index="idx2"
              :key="idx2"
              :rab-item-data="rabItemI"
              :rab="rabItem"
              :ahs-ids="ahsCodeList"
              :unit-ids="unitCodeList"
              @rab-item-deleted="onRabItemDeleted"
              @update-rab-item="onRabItemRowUpdated"
            />
            <tr>
              <td colspan="8" class="font-weight-bold">
                <a
                  href="#"
                  @click.prevent="addMasterRabItem(rabItemHeader)"
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
  import RabSummaryItemRow from '@/components/Master/Rab/RabSummaryItemRow.vue';
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
    data: () => ({
      mainCardCollapsed: false,
      editedRab: null,
    }),
    methods: {
      ...mapActions(['destroyMasterRab', 'storeMasterRabItem', 'destroyMasterRabItemHeader']),
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
      async addMasterRabItem(header) {
        await this.storeMasterRabItem({
          rabId: this.rabItem.hashid,
          form: {
            master_rab_item_header_id: header ? header.hashid : null,
            volume: 0,
          },
        });
        console.log(header)
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
