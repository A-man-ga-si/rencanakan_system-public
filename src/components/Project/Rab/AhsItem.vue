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
        <h5>{{ customAhsItem.code }} | {{ customAhsItem.name }}</h5>
      </div>
      <div class="right">
        <a href="#" @click.prevent="toggleMaincardCollapse" class="h4 ml-1">
          <ph-arrows-in weight="light" :size="25" v-if="!mainCardCollapsed" />
          <ph-arrows-out weight="light" :size="25" v-else />
        </a>
        <a href="#" class="h4 ml-1" @click.prevent="toggleUpdateCustomAhs">
          <ph-pencil weight="light" :size="25" />
        </a>
        <a class="h4 ml-1" href="#" @click.prevent="destroyCustomAhs">
          <ph-x weight="light" :size="25" />
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
            <th></th>
          </tr>
        </thead>
        <tbody>
          <AhsHeaderRow title="A. TENAGA KERJA" />
          <AhsItemRow
            v-for="(laborAhs, idx) in customAhsItem.item_arranged.labor"
            :key="`A-${idx}`"
            :custom-ahs="customAhsItem"
            :codes-list="customAhsItemableList"
            :units-list="unitsList"
            :custom-ahs-itemable-list="customAhsItemableList"
            :idx="idx"
            :custom-ahs-item="laborAhs"
            @ahs-item-deleted="onCustomAhsItemDeleted"
            @ahs-item-updated="onCustomAhsItemUpdated"
          />
          <tr>
            <td colspan="8" class="font-weight-bold">
              <a
                href="#"
                @click.prevent="addCustomAhsItem('labor')"
                class="d-block w-100"
              >
                + Tambah Baris
              </a>
            </td>
          </tr>
          <AhsFooterRow title="Total Tenaga Kerja" :value="totalTenagaKerja" />
          <AhsHeaderRow title="B. BAHAN" />
          <AhsItemRow
            v-for="(ingredientsAhs, idx) in customAhsItem.item_arranged
              .ingredients"
            :key="`B-${idx}`"
            :idx="idx"
            :codes-list="customAhsItemableList"
            :custom-ahs="customAhsItem"
            :units-list="unitsList"
            :custom-ahs-itemable-list="customAhsItemableList"
            :custom-ahs-item="ingredientsAhs"
            @ahs-item-deleted="onCustomAhsItemDeleted"
            @ahs-item-updated="onCustomAhsItemUpdated"
          />
          <tr>
            <td colspan="8" class="font-weight-bold">
              <a
                href="#"
                class="d-block w-100"
                @click.prevent="addCustomAhsItem('ingredients')"
              >
                + Tambah Baris
              </a>
            </td>
          </tr>
          <AhsFooterRow title="Total Bahan" :value="totalBahan" />
          <AhsHeaderRow title="C. PERALATAN" />
          <AhsItemRow
            v-for="(toolsAhs, idx) in customAhsItem.item_arranged.tools"
            :key="`C-${idx}`"
            :idx="idx"
            :codes-list="customAhsItemableList"
            :units-list="unitsList"
            :custom-ahs="customAhsItem"
            :custom-ahs-itemable-list="customAhsItemableList"
            :custom-ahs-item="toolsAhs"
            @ahs-item-deleted="onCustomAhsItemDeleted"
            @ahs-item-updated="onCustomAhsItemUpdated"
          />
          <tr>
            <td colspan="8" class="font-weight-bold">
              <a
                href="#"
                class="d-block w-100"
                @click.prevent="addCustomAhsItem('tools')"
              >
                + Tambah Baris
              </a>
            </td>
          </tr>
          <AhsFooterRow title="Total Peralatan" :value="totalPeralatan" />
          <AhsHeaderRow title="D. LAIN LAIN" />
          <AhsItemRow
            v-for="(othersAhs, idx) in customAhsItem.item_arranged.others"
            :key="`D-${idx}`"
            :idx="idx"
            :codes-list="customAhsItemableList"
            :units-list="unitsList"
            :custom-ahs="customAhsItem"
            :custom-ahs-itemable-list="customAhsItemableList"
            :custom-ahs-item="othersAhs"
            @ahs-item-deleted="onCustomAhsItemDeleted"
            @ahs-item-updated="onCustomAhsItemUpdated"
          />
          <tr>
            <td colspan="8" class="font-weight-bold">
              <a
                href="#"
                class="d-block w-100"
                @click.prevent="addCustomAhsItem('others')"
              >
                + Tambah Baris
              </a>
            </td>
          </tr>
          <AhsFooterRow title="Total Lain Lain" :value="totalLainLain" />
          <AhsHeaderRow
            title="E. JUMLAH HARGA TENAGA, BAHAN, PERALATAN, DAN LAIN LAIN"
            tooltip="(A + B + C + D)"
            :value="ahsItemSubtotal"
          />
          <AhsHeaderRow
            title="F. BIAYA OVERHEAD & PROFIT"
            :tooltip="`${overheadAndProfitPercentage}%`"
            :value="overheadAndProfitTotal"
          />
          <AhsHeaderRow
            title="G. HARGA SATUAN PEKERJAAN"
            tooltip="(E + F)"
            :value="ahsItemFinalSubtotal"
          />
        </tbody>
      </table>
      <hr />
    </div>
  </div>
</template>

<script>
  import { formatCurrency, showConfirmAlert } from '@/utils';
  import AhsHeaderRow from '@/components/Master/Ahs/AhsHeaderRow.vue';
  import AhsFooterRow from '@/components/Master/Ahs/AhsFooterRow.vue';
  import AhsItemRow from '@/components/Project/Rab/AhsItemRow.vue';
  import { mapActions, mapGetters } from 'vuex';
  import { Notify } from 'notiflix';
  import { PhX, PhPencil, PhArrowsIn, PhArrowsOut } from 'phosphor-vue';

  export default {
    props: ['customAhsItem', 'customAhsItemableList', 'unitsList'],

    data: () => ({
      mainCardCollapsed: false,
      overheadAndProfit: 0,
      overheadAndProfitPercentage: 0,
      ahsItemSubtotalVal: 0,
    }),

    created() {
      this.getOverheadAndProfit();
    },

    methods: {
      ...mapActions(['storeCustomAhsItem', 'deleteCustomAhs', 'showProject']),
      toggleMaincardCollapse() {
        this.mainCardCollapsed = !this.mainCardCollapsed;
      },

      async getOverheadAndProfit() {
        const { data } = await this.showProject(this.$route.params.id);
        this.overheadAndProfitPercentage = data.data.project.profit_margin;
        this.overheadAndProfit =
          (parseInt(data.data.project.profit_margin) / 100) *
          this.ahsItemSubtotalVal;
      },

      async addCustomAhsItem(section) {
        await this.storeCustomAhsItem({
          projectId: this.$route.params.id,
          form: {
            section,
            custom_ahs_id: this.customAhsItem.hashid,
          },
        });
        this.$emit('custom-ahs-item-added');
      },

      async destroyCustomAhs() {
        try {
          const { isConfirmed } = await showConfirmAlert({
            title: 'Hapus AHS ?',
            text: 'Semua data yang terhubung dengan AHS ini akan dihapus !',
          });

          if (isConfirmed) {
            await this.deleteCustomAhs({
              projectId: this.$route.params.id,
              customAhsId: this.customAhsItem.hashid,
            });
            Notify.success('Berhasil menghapus AHS');
            this.$emit('delete-custom-ahs');
          }
        } catch (err) {
          Notify.failure(`Gagal menghapus AHS ! ${err.response.data.message}`);
        }
      },

      toggleUpdateCustomAhs() {
        this.$emit('custom-ahs-edit-bt-clicked', this.customAhsItem);
      },

      onCustomAhsItemDeleted() {
        this.$emit('ahs-item-deleted');
      },

      onCustomAhsItemUpdated() {
        this.$emit('ahs-item-updated');
      },
    },

    computed: {
      ...mapGetters(['getProjects']),
      totalTenagaKerja() {
        let val = 0;
        if (
          this.customAhsItem.item_arranged.labor &&
          this.customAhsItem.item_arranged.labor.length > 0
        ) {
          val = this.customAhsItem.item_arranged.labor
            .map(data => data.subtotal)
            .reduce((acc, curr) => acc + curr);
        }

        return `Rp. ${formatCurrency(val)}`;
      },
      totalBahan() {
        let val = 0;
        if (
          this.customAhsItem.item_arranged.ingredients &&
          this.customAhsItem.item_arranged.ingredients.length > 0
        ) {
          val = this.customAhsItem.item_arranged.ingredients
            .map(data => data.subtotal)
            .reduce((acc, curr) => acc + curr);
        }

        return `Rp. ${formatCurrency(val)}`;
      },
      totalPeralatan() {
        let val = 0;
        if (
          this.customAhsItem.item_arranged.tools &&
          this.customAhsItem.item_arranged.tools.length > 0
        ) {
          val = this.customAhsItem.item_arranged.tools
            .map(data => data.subtotal)
            .reduce((acc, curr) => acc + curr);
        }

        return `Rp. ${formatCurrency(val)}`;
      },
      totalLainLain() {
        let val = 0;
        if (
          this.customAhsItem.item_arranged.others &&
          this.customAhsItem.item_arranged.others.length > 0
        ) {
          val = this.customAhsItem.item_arranged.others
            .map(data => data.subtotal)
            .reduce((acc, curr) => acc + curr);
        }

        return `Rp. ${formatCurrency(val)}`;
      },
      ahsItemSubtotal() {
        this.ahsItemSubtotalVal = this.customAhsItem.subtotal;
        return `Rp. ${formatCurrency(this.customAhsItem.subtotal)}`;
      },
      overheadAndProfitTotal() {
        return `Rp. ${formatCurrency(this.overheadAndProfit)}`;
      },
      ahsItemFinalSubtotal() {
        return `Rp. ${formatCurrency(
          this.overheadAndProfit + this.customAhsItem.subtotal
        )}`;
      },
    },

    components: {
      AhsHeaderRow,
      AhsFooterRow,
      AhsItemRow,
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
