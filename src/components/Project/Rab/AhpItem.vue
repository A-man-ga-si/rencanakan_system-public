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
          <div v-if="customAhp.is_default == '1'" class="badge badge-primary mr-2">
            Default
          </div>
          {{ customAhp.code }} | {{ customAhp.name }}
        </h5>
      </div>
      <div class="right">
        <a href="#" @click.prevent="toggleMaincardCollapse" class="h4 ml-1">
          <ph-arrows-in weight="light" :size="25" v-if="!mainCardCollapsed" />
          <ph-arrows-out weight="light" :size="25" v-else />
        </a>
        <a
          v-if="customAhp.is_default == '0'"
          href="#"
          @click.prevent="editAhp"
          class="h4 ml-1"
        >
          <ph-pencil weight="light" :size="25" />
        </a>
        <a
          v-if="customAhp.is_default == '0'"
          class="h4 ml-1"
          @click.prevent="deleteCustomAhp"
          href="#"
        >
          <ph-x weight="light" :size="25" />
        </a>
      </div>
    </div>
    <div class="body mt-2" v-show="!mainCardCollapsed">
      <table class="table text-left table-responsive w-100 d-block d-md-table">
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
              customAhp.is_default == '0' ? customAhpAItem.editableCoefficient : false
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
              customAhp.is_default == '0' ? customAhpBItem.editableCoefficient : false
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
              customAhp.is_default == '0' ? customAhpCItem.editableCoefficient : false
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
              customAhp.is_default == '0' ? customAhpDItem.editableCoefficient : false
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
  import { PhX, PhPencil, PhArrowsIn, PhArrowsOut } from 'phosphor-vue';

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
        try {
          const { isConfirmed } = await showConfirmAlert({
            title: 'Hapus AHP ?',
            text: 'Pastikan tidak ada item yang terhubung dengan data ini !',
          });
          if (isConfirmed) {
            await this.destroyCustomAhp({
              projectId: this.$route.params.id,
              customAhpId: this.customAhp.hashid,
            });
            this.$emit('custom-ahp-deleted');
          }
        } catch (err) {
          Notify.failure(`Gagal menghapus AHP ! ${err.response.data.message}`);
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
      },

      editAhp() {
        this.$emit('custom-ahp-item-edit-clicked', this.customAhp);
      },
    },
    components: {
      AhpItemRow,
      PhX,
      PhPencil,
      PhArrowsIn,
      PhArrowsOut,
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
