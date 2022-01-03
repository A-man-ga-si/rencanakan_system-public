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
        <h5>{{ romanizedRabsNumber }}. {{ rabItem.name }}</h5>
      </div>
      <div class="right">
        <a
          href="#"
          style="font-weight: bold"
          @click.prevent="toggleMaincardCollapse"
          class="h4 text-success ml-1"
          :class="{ 'text-primary': mainCardCollapsed }"
        >
          <i class="iconsmind simple-icon-plus"></i>
        </a>
        <a
          href="#"
          class="h4 text-warning ml-1"
          @click.prevent="addRabItemHeader"
        >
          <i class="iconsmind simple-icon-plus"></i>
        </a>
        <a href="#" class="h4 text-info ml-1">
          <i class="iconsmind simple-icon-plus"></i>
        </a>
        <a class="h4 text-danger ml-1" href="#" @click.prevent="deleteRab">
          <i class="iconsmind simple-icon-close"> </i>
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
              v-for="(rabItemI, idx) in rabItem.rab_item"
              :index="idx"
              :key="idx"
              :rab-item-data="rabItemI"
              :rab="rabItem"
              :custom-ahs-ids="ahsCodeList"
              :unit-ids="unitCodeList"
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
                  class="py-3 px-4"
                  style="
                    border-radius: 30px;
                    background-color: #586878;
                    color: white;
                  "
                >
                  <h5 class="d-inline-block mb-0">
                    {{ numToAlphabet(idx + 1) }}. {{ rabItemHeader.name }}
                  </h5>
                  <a href="#" class="text-white action-close float-right">
                    <i class="iconminds simple-icon-close"></i>
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
              :custom-ahs-ids="ahsCodeList"
              :unit-ids="unitCodeList"
              @rab-item-deleted="onRabItemDeleted"
              @update-rab-item="onRabItemRowUpdated"
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
                  class="w-100 py-2"
                  style="
                    font-size: 20px;
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
  import { NumberToAlphabet } from 'number-to-alphabet';
  import { toRoman } from 'roman-numerals';
  import RabSummaryItemRow from '@/components/Project/RabSummaryItemRow.vue';
  import { mapActions } from 'vuex';
  import { Notify } from 'notiflix';
  import { showConfirmAlert, formatCurrency } from '@/utils';

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
      numToAlphabetInstance: null,
    }),
    created() {
      this.numToAlphabetInstance = new NumberToAlphabet();
    },
    methods: {
      ...mapActions(['destroyRab', 'storeRabItem']),
      toggleMaincardCollapse() {
        this.mainCardCollapsed = !this.mainCardCollapsed;
      },
      numToAlphabet(num) {
        return this.numToAlphabetInstance.numberToString(num).toUpperCase();
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
    },
    computed: {
      romanizedRabsNumber() {
        return toRoman(this.index + 1) || 0;
      },
      formattedSubtotal() {
        return formatCurrency(this.rabItem.subtotal);
      },
    },
    components: {
      RabSummaryItemRow,
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
