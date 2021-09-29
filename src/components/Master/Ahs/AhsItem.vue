<template>
  <div
    class="
      ahs-card-single
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
        <h5>{{ ahsItem.id }} | {{ ahsItem.name }}</h5>
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
        <a href="#" class="h4 text-primary ml-1">
          <i class="iconsmind simple-icon-plus"></i>
        </a>
        <a class="h4 text-danger ml-1" href="#">
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
            <th scope="col">Satuan</th>
            <th scope="col">Koefisien</th>
            <th scope="col">Harga Sat (Rp.)</th>
            <th scope="col">Jumlah (Rp.)</th>
          </tr>
        </thead>
        <tbody>
          <AhsHeaderRow title="A. TENAGA KERJA" />
          <AhsItemRow
            v-for="(laborAhs, idx) in ahsItem.item_arranged.labor"
            :key="`A-${idx}`"
            :codes-list="codesList"
            :units-list="unitsList"
            :ahs-itemable-list="ahsItemableList"
            :idx="idx"
            :ahs-item="laborAhs"
          />
          <tr>
            <td colspan="8" class="font-weight-bold">
              <a href="#" class="d-block w-100"> + Tambah Baris </a>
            </td>
          </tr>
          <AhsFooterRow title="Total Tenaga Kerja" :value="totalTenagaKerja" />
          <AhsHeaderRow title="B. BAHAN" />
          <AhsItemRow
            v-for="(ingredientsAhs, idx) in ahsItem.item_arranged.ingredients"
            :key="`B-${idx}`"
            :idx="idx"
            :codes-list="codesList"
            :units-list="unitsList"
            :ahs-itemable-list="ahsItemableList"
            :ahs-item="ingredientsAhs"
          />
          <tr>
            <td colspan="8" class="font-weight-bold">
              <a href="#" class="d-block w-100"> + Tambah Baris </a>
            </td>
          </tr>
          <AhsFooterRow title="Total Bahan" :value="totalBahan" />
          <tr class="bg-primary">
            <th colspan="7">C. PERALATAN</th>
          </tr>
          <AhsItemRow
            v-for="(toolsAhs, idx) in ahsItem.item_arranged.tools"
            :key="`C-${idx}`"
            :idx="idx"
            :codes-list="codesList"
            :units-list="unitsList"
            :ahs-itemable-list="ahsItemableList"
            :ahs-item="toolsAhs"
          />
          <tr>
            <td colspan="8" class="font-weight-bold">
              <a href="#" class="d-block w-100"> + Tambah Baris </a>
            </td>
          </tr>
          <AhsFooterRow title="Total Peralatan" :value="totalPeralatan" />
          <AhsHeaderRow title="D. LAIN LAIN" />
          <AhsItemRow
            v-for="(othersAhs, idx) in ahsItem.item_arranged.others"
            :key="`D-${idx}`"
            :idx="idx"
            :codes-list="codesList"
            :units-list="unitsList"
            :ahs-itemable-list="ahsItemableList"
            :ahs-item="othersAhs"
          />
          <tr>
            <td colspan="8" class="font-weight-bold">
              <a href="#" class="d-block w-100"> + Tambah Baris </a>
            </td>
          </tr>
          <AhsFooterRow title="Total Lain Lain" :value="totalLainLain" />
          <AhsHeaderRow
            title="E. JUMLAH HARGA TENAGA, BAHAN, DAN PERALATAN"
            tooltip="Hello World"
            value="Rp.0 "
          />
          <AhsHeaderRow
            title="F. BIAYA OVERHEAD"
            tooltip="Hello World"
            value="Rp.0 "
          />
          <AhsHeaderRow title="G. PROFIT" tooltip="Hello World" value="Rp.0 " />
          <AhsHeaderRow
            title="H. HARGA SATUAN PEKERJAAN"
            tooltip="Hello World"
            value="Rp.0 "
          />
        </tbody>
      </table>
      <FloatingActionButton />
      <hr />
    </div>
  </div>
</template>

<script>
  import FloatingActionButton from '@/components/Project/FloatingActionButton.vue';
  import AhsItemRow from '@/components/Master/Ahs/AhsItemRow.vue';
  import AhsHeaderRow from '@/components/Master/Ahs/AhsHeaderRow.vue';
  import AhsFooterRow from '@/components/Master/Ahs/AhsFooterRow.vue';
  import { formatCurrency } from './../../../utils';

  export default {
    data: () => ({
      mainCardCollapsed: false,
    }),
    props: ['ahsItem', 'codesList', 'unitsList', 'ahsItemableList'],
    methods: {
      toggleMaincardCollapse() {
        this.mainCardCollapsed = !this.mainCardCollapsed;
      },
    },
    computed: {
      totalTenagaKerja() {
        let val = 0;
        if (
          this.ahsItem.item_arranged.labor &&
          this.ahsItem.item_arranged.labor.length > 0
        ) {
          val = this.ahsItem.item_arranged.labor
            .map(data => data.subtotal)
            .reduce((acc, curr) => acc + curr);
        }

        return `Rp. ${formatCurrency(val)}`;
      },
      totalBahan() {
        let val = 0;
        if (
          this.ahsItem.item_arranged.ingredients &&
          this.ahsItem.item_arranged.ingredients.length > 0
        ) {
          val = this.ahsItem.item_arranged.ingredients
            .map(data => data.subtotal)
            .reduce((acc, curr) => acc + curr);
        }

        return `Rp. ${formatCurrency(val)}`;
      },
      totalPeralatan() {
        let val = 0;
        if (
          this.ahsItem.item_arranged.tools &&
          this.ahsItem.item_arranged.tools.length > 0
        ) {
          val = this.ahsItem.item_arranged.tools
            .map(data => data.subtotal)
            .reduce((acc, curr) => acc + curr);
        }

        return `Rp. ${formatCurrency(val)}`;
      },
      totalLainLain() {
        let val = 0;
        if (
          this.ahsItem.item_arranged.others &&
          this.ahsItem.item_arranged.others.length > 0
        ) {
          val = this.ahsItem.item_arranged.others
            .map(data => data.subtotal)
            .reduce((acc, curr) => acc + curr);
        }

        return `Rp. ${formatCurrency(val)}`;
      },
    },
    components: {
      FloatingActionButton,
      AhsItemRow,
      AhsHeaderRow,
      AhsFooterRow,
    },
  };
</script>

<style scoped>
  .action-close {
    font-size: 17px;
  }

  .custom-nice-border {
    border: 2px solid #ddd;
  }
</style>
