<template>
  <div
    class="
      item-price-card-single
      position-relative
      mb-3
      custom-nice-border
      p-4
      rounded-md
      shadow-sm
    "
  >
    <div class="heading">
      <h5>I. UPAH TENAGA KERJA</h5>
    </div>
    <div class="body">
      <table class="table text-left">
        <thead>
          <tr>
            <th scope="col">No.</th>
            <th scope="col">Uraian</th>
            <th scope="col">Satuan</th>
            <th scope="col">Kode</th>
            <th scope="col">Harga</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>1.</td>
            <td>Pekerja</td>
            <td>OH</td>
            <td>L.01</td>
            <td>
              <input type="text" class="rab-inline-editor" value="90,000" />
            </td>
          </tr>
          <tr>
            <td>2.</td>
            <td>Tukang</td>
            <td>OH</td>
            <td>L.02</td>
            <td class="text-primary font-weight-bold">
              <input
                type="text"
                class="rab-inline-editor text-primary font-weight-bold"
                value="80,000"
              />
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

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

  .rab-inline-editor {
    /* width: 100%; */
    border: none !important;
  }
</style>
