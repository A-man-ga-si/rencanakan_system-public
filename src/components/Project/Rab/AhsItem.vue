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
            <th scope="col">Satuan</th>
            <th scope="col">Koefisien</th>
            <th scope="col">Harga Sat (Rp.)</th>
            <th scope="col">Jumlah (Rp.)</th>
          </tr>
        </thead>
        <tbody>
          <tr class="bg-primary">
            <th colspan="8">A. TENAGA KERJA</th>
          </tr>
          <tr>
            <td>1.</td>
            <td>Pekerja</td>
            <td>L.01</td>
            <td>OH</td>
            <td>1,00</td>
            <td>Rp. 100,000</td>
            <td>Rp. 200,000</td>
          </tr>
          <tr>
            <td>2.</td>
            <td>Mandor</td>
            <td>L.02</td>
            <td>OH</td>
            <td>1,00</td>
            <td>Rp. 100,000</td>
            <td>Rp. 200,000</td>
          </tr>
          <tr class="font-weight-bold">
            <td colspan="6" class="text-right">Total Tenaga Kerja</td>
            <td colspan="2">Rp. 400,000</td>
          </tr>
          <tr class="bg-primary">
            <th colspan="7">B. BAHAN</th>
          </tr>
          <tr>
            <td>1.</td>
            <td>Papan Kayu</td>
            <td>M.33.a</td>
            <td>m3</td>
            <td>0,007</td>
            <td>Rp. 100,000</td>
            <td>Rp. 200,000</td>
          </tr>
          <tr class="font-weight-bold">
            <td colspan="6" class="text-right">Total Bahan</td>
            <td colspan="2">Rp. 200,000</td>
          </tr>
          <tr class="bg-primary">
            <th colspan="7">C. PERALATAN</th>
          </tr>
          <tr>
            <td>1.</td>
            <td>Jack Hammer</td>
            <td>E.14</td>
            <td>Sewa-Hari</td>
            <td>0,125</td>
            <td>Rp. 100,000</td>
            <td>Rp. 200,000</td>
          </tr>
          <tr class="font-weight-bold">
            <td colspan="6" class="text-right">Total Perlatan</td>
            <td colspan="2">Rp. 200,000</td>
          </tr>
          <tr class="bg-primary font-weight-bold">
            <th colspan="6">
              D. JUMLAH HARGA TENAGA, BAHAN, DAN PERALATAN
              <i
                @click.prevent
                class="text-white ml-1 iconsminds simple-icon-question"
                v-b-popover.hover="'Testing'"
              />
            </th>
            <td colspan="2">Rp. 32,722</td>
          </tr>
          <tr class="bg-primary font-weight-bold">
            <th colspan="6">
              E. BIAYA OVERHEAD
              <i
                @click.prevent
                class="text-white ml-1 iconsminds simple-icon-question"
                v-b-popover.hover="'Testing'"
              />
            </th>
            <td colspan="2">Rp. 32,722</td>
          </tr>
          <tr class="bg-primary font-weight-bold">
            <th colspan="6">
              F. PROFIT
              <i
                @click.prevent
                class="text-white ml-1 iconsminds simple-icon-question"
                v-b-popover.hover="'Testing'"
              />
            </th>
            <td colspan="2">Rp. 32,722</td>
          </tr>
          <tr class="bg-primary font-weight-bold">
            <th colspan="6">
              G. HARGA SATUAN PEKERJAAN
              <i
                @click.prevent
                class="text-white ml-1 iconsminds simple-icon-question"
                v-b-popover.hover="'Testing'"
              />
            </th>
            <td colspan="2">Rp. 32,722</td>
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
