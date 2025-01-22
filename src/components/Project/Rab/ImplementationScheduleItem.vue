<template>
  <div
    class="rab-card-single position-relative mb-3 custom-nice-border pb-2 rounded-md shadow-sm"
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
        <table class="table text-left mx-3 table-responsive" style="width: 97%">
          <thead>
            <tr>
              <th scope="col" style="width: 3%">No.</th>
              <th scope="col">Uraian Pekerjaan</th>
              <th scope="col" style="width: 15%">Kode</th>
              <th scope="col" style="width: 10%">Volume</th>
              <th scope="col" style="width: 15%">Satuan</th>
              <th scope="col">Jumlah (Rp.)</th>
              <th scope="col" style="width: 15%">Bobot (%)</th>
              <th scope="col" style="width: 15%">Range Pengerjaan</th>
              <th style="width: 2%"></th>
            </tr>
          </thead>
          <tbody>
            <ImplementationScheduleItemRow
              v-for="(rabItemI, idx) in rabItem.rab_item"
              :index="idx"
              :key="idx"
              :rab-item-data="rabItemI"
              :rab-total-calculation="rabItem.subtotal"
              @update-rab-item="onRabItemRowUpdated"
              @rab-item-edit="onRabItemEdit"
              @rab-item-delete="onRabItemDelete"
            />
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
            <ImplementationScheduleItemRow
              v-for="(rabItemI, index) in rabItemHeader.rab_item"
              :key="index"
              :index="index"
              :rab-item-data="rabItemI"
              :rab-total-calculation="rabItem.subtotal"
              @update-rab-item="onRabItemRowUpdated"
              @rab-item-edit="onRabItemEdit"
            />
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
  import ImplementationScheduleItemRow from '@/components/Project/Rab/ImplementationScheduleItemRow.vue';
  import { mapActions } from 'vuex';
  import { Notify } from 'notiflix';
  import { showConfirmAlert, formatCurrency, numberToAlphabet } from '@/utils';
  import { PhX, PhPencil, PhArrowsIn, PhArrowsOut } from 'phosphor-vue';

  export default {
    props: {
      rabTotalCalculation: 0,
      rabItem: {
        type: Object,
        required: true,
      },
      index: {
        type: Number,
        required: true,
      },
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
      onRabItemEdit(...rabItemData) {
        this.$emit('rab-item-edit', rabItemData);
      },
      editRabItemHeader(rabItemHeader) {
        this.$emit(
          'edit-rab-item-header-bt-clicked',
          this.rabItem,
          rabItemHeader,
        );
      },
      onRabItemDelete() {
        this.$emit('rab-item-delete');
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
      PhX,
      PhPencil,
      PhArrowsIn,
      PhArrowsOut,
      ImplementationScheduleItemRow,
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
