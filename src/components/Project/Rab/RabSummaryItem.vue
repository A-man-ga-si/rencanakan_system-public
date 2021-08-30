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
        <h5>I. Pekerjaan Persiapan</h5>
      </div>
      <div class="right">
        <a href="#" @click.prevent="toggleMaincardCollapse" class="h4 text-success ml-1" :class="{'text-primary': mainCardCollapsed}">
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
          <tr class="bg-primary">
            <th colspan="7">A. Pekerjaan Tanah</th>
            <td>
              <a href="#" class="text-white action-close">
                <i class="iconminds simple-icon-close"></i>
              </a>
            </td>
          </tr>
          <tr>
            <td>1.</td>
            <td>
              <input
                type="text"
                class="inline-edit w-100"
                value="Pekerjaan Tanah"
              />
            </td>
            <td>
              <select
                name=""
                id=""
                style="
                  border: none;
                  height: 100%;
                  width: 100%;
                  background-color: transparent;
                "
              >
                <option value="">-</option>
                <option value="">Kode 1</option>
                <option value="">Kode 2</option>
              </select>
            </td>
            <td>1,00</td>
            <td>Buah</td>
            <td>Rp. 100,000</td>
            <td>Rp. 200,000</td>
            <td>
              <a href="#" class="text-danger action-close">
                <i class="iconminds simple-icon-close"></i>
              </a>
            </td>
          </tr>
          <tr>
            <td>2.</td>
            <td>
              <input
                type="text"
                class="inline-edit w-100"
                value="Sewa direksi keet, los kerja dan gudang"
              />
            </td>
            <td>
              <select
                name=""
                id=""
                style="
                  border: none;
                  height: 100%;
                  width: 100%;
                  background-color: transparent;
                "
              >
                <option value="">-</option>
                <option value="">Kode 1</option>
                <option value="">Kode 2</option>
              </select>
            </td>
            <td>1,00</td>
            <td>Buah</td>
            <td>Rp. 100,000</td>
            <td>Rp. 200,000</td>
            <td>
              <a href="#" class="text-danger action-close">
                <i class="iconminds simple-icon-close"></i>
              </a>
            </td>
          </tr>
          <tr>
            <td>3.</td>
            <td>
              <input
                type="text"
                class="inline-edit w-100"
                value="1 m 1 utizet trase saluran"
              />
            </td>
            <td>
              <select
                name=""
                id=""
                style="
                  border: none;
                  height: 100%;
                  width: 100%;
                  background-color: transparent;
                "
              >
                <option value="">-</option>
                <option value="">Kode 1</option>
                <option value="">Kode 2</option>
              </select>
            </td>
            <td>1.700,00</td>
            <td>m1</td>
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
          <tr class="bg-primary">
            <th colspan="7">B. Pekerjaan Lainnya</th>
            <td>
              <a href="#" class="text-white action-close">
                <i class="iconminds simple-icon-close"></i>
              </a>
            </td>
          </tr>
          <tr>
            <td>1.</td>
            <td>
              <input
                type="text"
                class="inline-edit w-100"
                value="Pekerjaan Tanah"
              />
            </td>
            <td>
              <select
                name=""
                id=""
                style="
                  border: none;
                  height: 100%;
                  width: 100%;
                  background-color: transparent;
                "
              >
                <option value="">-</option>
                <option value="">Kode 1</option>
                <option value="">Kode 2</option>
              </select>
            </td>
            <td>1,00</td>
            <td>Buah</td>
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
export default {
  data: () => ({
    mainCardCollapsed: false,
  }),
  methods: {
    toggleMaincardCollapse() {
      this.mainCardCollapsed = !this.mainCardCollapsed;
    }
  }
}
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
</style>
