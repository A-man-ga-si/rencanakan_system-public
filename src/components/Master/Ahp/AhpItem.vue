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
        <h5>{{ idx + 1 }}. {{ ahpItem.id }} | {{ ahpItem.name }}</h5>
      </div>
      <div class="right">
        <a href="#" @click.prevent="toggleMaincardCollapse" class="h4 ml-1">
          <ph-arrows-in weight="light" :size="25" v-if="!mainCardCollapsed" />
          <ph-arrows-out weight="light" :size="25" v-else />
        </a>
        <a
          href="#"
          class="h4 ml-1"
          v-b-modal.edit-ahp-modal
          @click.prevent="editAhp"
        >
          <ph-pencil weight="light" :size="25" />
        </a>
        <a class="h4 ml-1" href="#" @click.prevent="deleteAhp">
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
            <td>{{ ahpItem.id }}</td>
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
            :tooltip="ahpAItem.tooltip"
            :coefficient="formattedAhpNumerics[ahpAItem.code]"
            :editableCoefficient="ahpAItem.editableCoefficient"
            :description="ahpAItem.description"
            @value-changed="onAhpItemChanged($event, ahpAItem)"
          />
          <tr class="bg-primary font-weight-bold">
            <th colspan="5">B. LAIN - LAIN</th>
          </tr>
          <AhpItemRow
            v-for="(ahpBItem, key, idx) in getAhpItemRowsData.B"
            :key="Math.random() + idx"
            :number="idx + 1"
            :name="ahpBItem.name"
            :code="ahpBItem.code"
            :unit="ahpBItem.unit"
            :tooltip="ahpBItem.tooltip"
            :coefficient="formattedAhpNumerics[ahpBItem.code]"
            :editableCoefficient="ahpBItem.editableCoefficient"
            :description="ahpBItem.description"
            @value-changed="onAhpItemChanged($event, ahpBItem)"
          />
          <tr class="bg-primary">
            <th colspan="5">C. BIAYA PASTI PER JAM KERJA</th>
          </tr>
          <AhpItemRow
            v-for="(ahpCItem, key, idx) in getAhpItemRowsData.C"
            :key="Math.random() + idx"
            :number="idx + 1"
            :name="ahpCItem.name"
            :code="ahpCItem.code"
            :unit="ahpCItem.unit"
            :tooltip="replaceTooltip(ahpCItem.tooltip)"
            :coefficient="formattedAhpNumerics[ahpCItem.code]"
            :editableCoefficient="ahpCItem.editableCoefficient"
            :description="ahpCItem.description"
          />
          <tr class="bg-primary">
            <th colspan="5">D. BIAYA OPERASI PER JAM KERJA</th>
          </tr>
          <AhpItemRow
            v-for="(ahpDItem, key, idx) in getAhpItemRowsData.D"
            :key="Math.random() + idx"
            :number="idx + 1"
            :name="ahpDItem.name"
            :code="ahpDItem.code"
            :unit="ahpDItem.unit"
            :tooltip="replaceTooltip(ahpDItem.tooltip)"
            :coefficient="formattedAhpNumerics[ahpDItem.code]"
            :editableCoefficient="ahpDItem.editableCoefficient"
            :description="ahpDItem.description"
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
      mainCardCollapsed: false,
    }),
    mixins: [ahpMixins],
    props: ['ahpItem', 'idx'],
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
        let ahpItemCp = { ...this.ahpItem };

        // formatAhpNumerics is in ahpMixins
        return this.formatAhpNumerics(ahpItemCp);
      },
    },
    methods: {
      ...mapActions(['destroyAhp', 'updateAhp']),

      replaceTooltip(tooltip = '') {
        // tooltipReplacer is in ahpMixins
        return this.tooltipReplacer(tooltip);
      },

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
      PhX,
      PhPencil,
      PhArrowsOut,
      PhArrowsIn,
    },
  };
</script>

<style scoped>
  .action-close {
    font-size: 17px;
  }

  td {
    vertical-align: middle;
  }
</style>
