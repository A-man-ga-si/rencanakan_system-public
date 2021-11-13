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
            <th scope="col">Volume</th>
            <th scope="col">SAT</th>
            <th scope="col">Harga Sat (Rp.)</th>
            <th scope="col">Jumlah (Rp.)</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(rabItem, idx) in rabItem.rab_item" :key="idx">
            <td>{{ idx + 1 }}.</td>
            <td>
              <input
                type="text"
                class="inline-edit w-100"
                :value="rabItem.name"
              />
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
                :value="rabItem.volume"
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
          <tr>
            <td colspan="8" class="font-weight-bold">
              <a href="#" class="d-block w-100"> + Tambah baris </a>
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
          <tr
            v-for="(rabItemHeaderItem, idx2) in rabItemHeader.rab_item"
            :key="idx2"
          >
            <td>{{ idx2 + 1 }}.</td>
            <td>
              <input
                type="text"
                class="inline-edit w-100"
                :value="rabItemHeaderItem.name"
              />
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
                :value="rabItemHeaderItem.volume"
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
          <tr>
            <td colspan="8" class="font-weight-bold">
              <a href="#" class="d-block w-100"> + Tambah baris </a>
            </td>
          </tr>
        </tbody>
      </table>
      <hr />
    </div>
    <div class="summary-footer">
      <div class="d-flex justify-content-between mt-3">
        <h5>Total</h5>
        <h5>Rp.150,000</h5>
      </div>
    </div>
  </div>
</template>

<script>
  import { NumberToAlphabet } from 'number-to-alphabet';
  import { toRoman } from 'roman-numerals';

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
    },
    data: () => ({
      mainCardCollapsed: false,
      defaultSelectedCode: 'Kode 1',
      defaultSelectedUnit: 'Buah',
      codesList: ['Kode 1', 'Kode 2', 'Kode 3'],
      unitsList: ['Buah', 'm1', 'm3', 'OH'],
      numToAlphabetInstance: null,
    }),
    created() {
      this.numToAlphabetInstance = new NumberToAlphabet();
    },
    methods: {
      toggleMaincardCollapse() {
        this.mainCardCollapsed = !this.mainCardCollapsed;
      },
      numToAlphabet(num) {
        return this.numToAlphabetInstance.numberToString(num).toUpperCase();
      },
    },
    computed: {
      romanizedRabsNumber() {
        return toRoman(this.index + 1) || 0;
      },
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

  .custom-nice-border {
    border: 2px solid #ddd;
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
