<template>
  <div
    class="
      rab-card-single
      position-relative
      mb-3
      custom-nice-border
      p-4
      rounded-md
      shadow-sm
    "
  >
    <div class="heading d-flex justify-content-between">
      <div class="left">
        <h5>{{ romanizedRabsNumber }}. {{ rabItem.name }}</h5>
      </div>
      <div class="right">
        <a
          href="#"
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
        <a href="#" class="h4 text-primary ml-1">
          <i class="iconsmind simple-icon-plus"></i>
        </a>
        <a class="h4 text-danger ml-1" href="#" @click.prevent="deleteRab">
          <i class="iconsmind simple-icon-close"> </i>
        </a>
      </div>
    </div>
    <div class="body mt-2" v-show="!mainCardCollapsed">
      <table class="table text-left">
        <thead>
          <tr>
            <th scope="col">No.</th>
            <th scope="col">Uraian Pekerjaan</th>
            <th scope="col">Kode</th>
            <th scope="col">Volume</th>
            <th scope="col">SAT</th>
            <th scope="col">Harga Sat (Rp.)</th>
            <th scope="col">Jumlah (Rp.)</th>
            <th></th>
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
          <tr class="bg-primary">
            <th colspan="7">
              {{ numToAlphabet(idx + 1) }}. {{ rabItemHeader.name }}
            </th>
            <td>
              <a href="#" class="text-white action-close">
                <i class="iconminds simple-icon-close"></i>
              </a>
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
      </table>
      <hr />
    </div>
    <div class="summary-footer">
      <div class="d-flex justify-content-between mt-3">
        <h5>Total</h5>
        <h5>Rp. {{ formattedSubtotal }}</h5>
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
