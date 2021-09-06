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
        <h5>T.07 | 1 m3 Pekerjaan Galian Tanah Berbatu</h5>
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
            <th scope="col">Koefisien</th>
            <th scope="col">Satuan</th>
            <th scope="col">Keterangan</th>
          </tr>
        </thead>
        <tbody>
          <tr class="bg-primary">
            <th colspan="6">A. URAIAN PERALATAN</th>
          </tr>
          <tr>
            <td>1.</td>
            <td>Pekerja</td>
            <td>
              <v-select :options="codesList"></v-select>
            </td>
            <td>Rp. 100,000</td>
            <td>
              <v-select :options="unitsList"></v-select>
            </td>
          </tr>
          <tr>
            <td>2.</td>
            <td>Mandor</td>
            <td>
              <v-select :options="codesList"></v-select>
            </td>
            <td>Rp. 100,000</td>
            <td>
              <v-select :options="codesList"></v-select>
            </td>
          </tr>
          <tr class="bg-primary">
            <th colspan="6">B. BIAYA PASTI PER JAM KERJA</th>
          </tr>
          <tr>
            <td>1.</td>
            <td>Papan Kayu</td>
            <td>
              <v-select :options="codesList"></v-select>
            </td>
            <td>Rp. 100,000</td>
            <td>
              <v-select :options="codesList"></v-select>
            </td>
          </tr>
          <tr class="bg-primary">
            <th colspan="6">C. BIAYA OPERASI PER JAM KERJA</th>
          </tr>
          <tr>
            <td>1.</td>
            <td>Jack Hammer</td>
            <td>
              <v-select :options="codesList"></v-select>
            </td>
            <td>Rp. 100,000</td>
            <td>
              <v-select :options="codesList"></v-select>
            </td>
          </tr>
          <tr class="font-weight-bold">
            <td colspan="5" class="text-right">Total Bahan</td>
            <td colspan="2">Rp. 200,000</td>
          </tr>
          <tr class="bg-primary font-weight-bold">
            <th colspan="7">D. LAIN - LAIN</th>
          </tr>
          <tr>
            <td>1.</td>
            <td>Tingkat Suku Bunga</td>
            <td>
              <v-select :options="codesList"></v-select>
            </td>
            <td>Rp. 100,000</td>
            <td>
              <v-select :options="codesList"></v-select>
            </td>
          </tr>
        </tbody>
      </table>
      <hr />
    </div>
  </div>
</template>

<script>
  export default {
    data: () => ({
      mainCardCollapsed: false,
      codesList: ['Kode 1', 'Kode 2', 'Kode 3'],
      unitsList: ['Buah', 'm1', 'm3', 'OH'],
    }),
    methods: {
      toggleMaincardCollapse() {
        this.mainCardCollapsed = !this.mainCardCollapsed;
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

  td {
    vertical-align: middle;
  }
</style>
