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
        <h5>{{ ahpItem.id }} | {{ ahpItem.name }}</h5>
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
          class="h4 text-primary ml-1"
          v-b-modal.edit-ahp-modal
          @click.prevent="editAhp"
        >
          <i class="iconsmind simple-icon-plus"></i>
        </a>
        <a class="h4 text-danger ml-1" href="#" @click.prevent="deleteAhp">
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
            <td>Jenis Peralatan</td>
            <td>{{ ahpItem.id }}</td>
            <td>-</td>
            <td>-</td>
            <td>-</td>
          </tr>
          <AhpItemRow
            v-for="(ahpAItem, key, idx) in getAhpItemRowsData.A"
            :key="Math.random() + idx"
            :number="idx + 2"
            :name="ahpAItem.name"
            :code="ahpAItem.code"
            :unit="ahpAItem.unit"
            :coefficient="formattedAhpNumerics[ahpAItem.code]"
            :editableCoefficient="ahpAItem.editableCoefficient"
            :description="ahpAItem.description"
            @value-changed="onAhpItemChanged($event, ahpAItem)"
          />
          <tr class="bg-primary font-weight-bold">
            <th colspan="7">B. LAIN - LAIN</th>
          </tr>
          <AhpItemRow
            v-for="(ahpBItem, key, idx) in getAhpItemRowsData.B"
            :key="Math.random() + idx"
            :number="idx + 1"
            :name="ahpBItem.name"
            :code="ahpBItem.code"
            :unit="ahpBItem.unit"
            :coefficient="formattedAhpNumerics[ahpBItem.code]"
            :editableCoefficient="ahpBItem.editableCoefficient"
            :description="ahpBItem.description"
            @value-changed="onAhpItemChanged($event, ahpBItem)"
          />
          <tr class="bg-primary">
            <th colspan="6">C. BIAYA PASTI PER JAM KERJA</th>
          </tr>
          <AhpItemRow
            v-for="(ahpCItem, key, idx) in getAhpItemRowsData.C"
            :key="Math.random() + idx"
            :number="idx + 1"
            :name="ahpCItem.name"
            :code="ahpCItem.code"
            :unit="ahpCItem.unit"
            :coefficient="formattedAhpNumerics[ahpCItem.code]"
            :editableCoefficient="ahpCItem.editableCoefficient"
            :description="ahpCItem.description"
          />
          <tr class="bg-primary">
            <th colspan="6">D. BIAYA OPERASI PER JAM KERJA</th>
          </tr>
          <AhpItemRow
            v-for="(ahpDItem, key, idx) in getAhpItemRowsData.D"
            :key="Math.random() + idx"
            :number="idx + 1"
            :name="ahpDItem.name"
            :code="ahpDItem.code"
            :unit="ahpDItem.unit"
            :coefficient="formattedAhpNumerics[ahpDItem.code]"
            :editableCoefficient="ahpDItem.editableCoefficient"
            :description="ahpDItem.description"
          />
          <tr class="font-weight-bold">
            <td colspan="5" class="text-right">Total Bahan</td>
            <td colspan="2">Rp. {{ formattedAhpNumerics.S }}</td>
          </tr>
        </tbody>
      </table>
      <hr />
    </div>
  </div>
</template>

<script>
  import AhpItemRow from '@/components/Master/Ahp/AhpItemRow.vue';
  import ahpItemRowsData from '@/data/items/ahp-item-rows';
  import { mapActions } from 'vuex';
  import { formatCurrency, showConfirmAlert } from './../../../utils';
  import { Notify } from 'notiflix';

  export default {
    data: () => ({
      mainCardCollapsed: false,
    }),
    props: ['ahpItem'],
    computed: {
      getAhpItemRowsData() {
        return ahpItemRowsData;
      },
      /**
       * formattedAhpNumerics
       * Return same value as ahpItem props, but with fixed floating point
       */
      formattedAhpNumerics() {
        // Make copy of ahpItem to remap as fixed floating point
        let ahpItemCp = { ...this.ahpItem };

        for (const d in ahpItemCp) {
          /**
           * Because ahpItem is also content String value (e.g name, code created_at, updated_at)
           * So it need to check if d is number
           */
          if (typeof ahpItemCp[d] == 'number') {
            // Convert to float and make it fixed by 2 numbers after decimal
            ahpItemCp[d] = Number.parseFloat(ahpItemCp[d]).toFixed(2);

            if (
              d == 'H' ||
              d == 'I' ||
              d == 'J' ||
              d == 'K' ||
              d == 'L' ||
              d == 'M' ||
              d == 'P' ||
              d == 'S'
            ) {
              ahpItemCp[d] = formatCurrency(ahpItemCp[d]);
            }
          }
        }
        return ahpItemCp;
      },
    },
    methods: {
      ...mapActions(['destroyAhp', 'updateAhp']),
      toggleMaincardCollapse() {
        this.mainCardCollapsed = !this.mainCardCollapsed;
      },
      async onAhpItemChanged(e, ahpVal) {
        await this.updateAhp({
          ahpId: this.ahpItem.id,
          form: {
            [ahpVal.code]: e.target.value,
          },
        });
        this.$emit('ahp-item-changed');
        Notify.success('Berhasil mengubah AHP');
      },
      async deleteAhp() {
        const { isConfirmed } = await showConfirmAlert({
          title: 'Hapus AHP',
          text: 'AHP ini akan dihapus',
        });
        if (isConfirmed) {
          await this.destroyAhp(this.ahpItem.id);
          this.$emit('ahp-deleted');
          Notify.success('Berhasil menghapus AHP');
        }
      },
      editAhp() {
        this.$emit('ahp-item-edit-clicked', this.ahpItem);
      },
    },
    components: {
      AhpItemRow,
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

  td {
    vertical-align: middle;
  }
</style>
