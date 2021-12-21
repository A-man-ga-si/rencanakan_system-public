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
        <h5>
          <div v-if="customAhp.is_default" class="badge badge-primary mr-2">
            Default
          </div>
          {{ customAhp.code }} | {{ customAhp.name }}
        </h5>
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
          v-if="!customAhp.is_default"
          href="#"
          @click.prevent="editAhp"
          class="h4 text-primary ml-1"
        >
          <i class="iconsmind simple-icon-plus"></i>
        </a>
        <a
          v-if="!customAhp.is_default"
          class="h4 text-danger ml-1"
          @click.prevent="deleteCustomAhp"
          href="#"
        >
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
          </tr>
        </thead>
        <tbody>
          <tr class="bg-primary">
            <th colspan="5">A. URAIAN PERALATAN</th>
          </tr>
          <tr>
            <td>1.</td>
            <td>Jenis Peralatan</td>
            <td>{{ customAhp.code }}</td>
            <td>-</td>
            <td>-</td>
          </tr>
          <AhpItemRow
            v-for="(customAhpAItem, key, idx) in getAhpItemRowsData.A"
            :key="Math.random() + idx"
            :number="idx + 2"
            :name="customAhpAItem.name"
            :code="customAhpAItem.code"
            :unit="customAhpAItem.unit"
            :tooltip="customAhpAItem.tooltip"
            :coefficient="formattedAhpNumerics[customAhpAItem.code]"
            :editableCoefficient="
              customAhp.is_default ? false : customAhpAItem.editableCoefficient
            "
            :description="customAhpAItem.description"
            @value-changed="onAhpItemChanged($event, customAhpAItem)"
          />
          <tr class="bg-primary font-weight-bold">
            <th colspan="5">B. LAIN - LAIN</th>
          </tr>
          <AhpItemRow
            v-for="(customAhpBItem, key, idx) in getAhpItemRowsData.B"
            :key="Math.random() + idx"
            :number="idx + 1"
            :name="customAhpBItem.name"
            :code="customAhpBItem.code"
            :unit="customAhpBItem.unit"
            :tooltip="customAhpBItem.tooltip"
            :coefficient="formattedAhpNumerics[customAhpBItem.code]"
            :editableCoefficient="
              customAhp.is_default ? false : customAhpBItem.editableCoefficient
            "
            :description="customAhpBItem.description"
            @value-changed="onAhpItemChanged($event, customAhpBItem)"
          />
          <tr class="bg-primary">
            <th colspan="5">C. BIAYA PASTI PER JAM KERJA</th>
          </tr>
          <AhpItemRow
            v-for="(customAhpCItem, key, idx) in getAhpItemRowsData.C"
            :key="Math.random() + idx"
            :number="idx + 1"
            :name="customAhpCItem.name"
            :code="customAhpCItem.code"
            :unit="customAhpCItem.unit"
            :tooltip="replaceTooltip(customAhpCItem.tooltip)"
            :coefficient="formattedAhpNumerics[customAhpCItem.code]"
            :editableCoefficient="
              customAhp.is_default ? false : customAhpCItem.editableCoefficient
            "
            :description="customAhpCItem.description"
          />
          <tr class="bg-primary">
            <th colspan="5">D. BIAYA OPERASI PER JAM KERJA</th>
          </tr>
          <AhpItemRow
            v-for="(customAhpDItem, key, idx) in getAhpItemRowsData.D"
            :key="Math.random() + idx"
            :number="idx + 1"
            :name="customAhpDItem.name"
            :code="customAhpDItem.code"
            :unit="customAhpDItem.unit"
            :tooltip="replaceTooltip(customAhpDItem.tooltip)"
            :coefficient="formattedAhpNumerics[customAhpDItem.code]"
            :editableCoefficient="
              customAhp.is_default ? false : customAhpDItem.editableCoefficient
            "
            :description="customAhpDItem.description"
          />
          <tr class="font-weight-bold">
            <td colspan="4" class="text-right">TOTAL BIAYA SEWA ALAT / JAM</td>
            <td colspan="1">Rp. {{ formattedAhpNumerics.S }}</td>
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
  import ahpMixins from '@/mixins/ahp-mixins';
  import { mapActions } from 'vuex';
  import { showConfirmAlert } from './../../../utils';
  import { Notify } from 'notiflix';

  export default {
    data: () => ({
      mainCardCollapsed: true,
    }),

    mixins: [ahpMixins],

    props: ['customAhp'],

    computed: {
      getAhpItemRowsData() {
        return ahpItemRowsData;
      },
      /**
       * formattedAhpNumerics
       *
       * Return same value as ahpItem props, but with fixed floating point
       */
      formattedAhpNumerics() {
        let ahpItemCp = { ...this.customAhp };

        // formatAhpNumerics is in ahpMixins
        return this.formatAhpNumerics(ahpItemCp);
      },
    },
    methods: {
      ...mapActions(['destroyCustomAhp', 'updateCustomAhp']),

      replaceTooltip(tooltip = '') {
        // tooltipReplacer is in ahpMixins
        return this.tooltipReplacer(this.customAhp, tooltip);
      },

      toggleMaincardCollapse() {
        this.mainCardCollapsed = !this.mainCardCollapsed;
      },

      async deleteCustomAhp() {
        const { isConfirmed } = await showConfirmAlert({
          title: 'Hapus AHP ?',
          text: 'Semua item yang berkaitan dengan AHP ini akan dihapus !',
        });
        if (isConfirmed) {
          await this.destroyCustomAhp({
            projectId: this.$route.params.id,
            customAhpId: this.customAhp.hashid,
          });
          this.$emit('custom-ahp-deleted');
        }
      },

      async onAhpItemChanged(e, ahpVal) {
        await this.updateCustomAhp({
          customAhpId: this.customAhp.hashid,
          projectId: this.$route.params.id,
          form: {
            [ahpVal.code]: e.target.value,
          },
        });
        this.$emit('custom-ahp-item-changed');
        Notify.success('Berhasil mengubah AHP');
      },

      async deleteAhp() {
        const { isConfirmed } = await showConfirmAlert({
          title: 'Hapus AHP',
          text: 'AHP ini akan dihapus',
        });
        if (isConfirmed) {
          await this.destroyCustomAhp(this.customAhp.code);
          this.$emit('custom-ahp-deleted');
          Notify.success('Berhasil menghapus AHP');
        }
      },

      editAhp() {
        this.$emit('custom-ahp-item-edit-clicked', this.customAhp);
      },
    },
    components: {
      AhpItemRow,
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

  td {
    vertical-align: middle;
  }
</style>
