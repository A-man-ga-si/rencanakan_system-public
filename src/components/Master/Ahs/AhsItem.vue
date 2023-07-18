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
        <h5>{{ idx + 1 }}. {{ ahsItem.id }} | {{ ahsItem.name }}</h5>
      </div>
      <div class="right text-right" style="min-width: 120px">
        <h3 class="d-inline-block mb-0" style="vertical-align: top">
          {{ ahsItemFinalSubtotal }} |
        </h3>
        <a
          href="#"
          @click.prevent="toggleMaincardCollapse"
          class="h4 ml-1"
          :class="{ 'text-primary': mainCardCollapsed }"
        >
          <ph-arrows-in weight="light" :size="25" />
        </a>
        <a
          v-b-modal.edit-ahs-modal
          @click.prevent="editAhs"
          href="#"
          class="h4 ml-1"
        >
          <ph-pencil weight="light" :size="25" />
        </a>
        <a class="h4 ml-1" href="#" @click.prevent="deleteAhs">
          <ph-x weight="light" :size="25" />
        </a>
      </div>
    </div>
    <div class="body mt-2" v-show="!mainCardCollapsed">
      <table class="table text-left table-responsive d-block d-lg-table w-100">
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
            v-for="(laborAhs, idx) in ahsItem.item_arranged.labor"
            :key="`A-${idx}`"
            :codes-list="ahsItemableList"
            :units-list="unitsList"
            :ahs-itemable-list="ahsItemableList"
            :idx="idx"
            :ahs-item="laborAhs"
            @ahs-item-updated="onAhsItemUpdated"
            @ahs-item-deleted="onAhsItemDeleted"
          />
          <tr>
            <td colspan="8" class="font-weight-bold">
              <a
                href="#"
                @click.prevent="addAhsItem('labor')"
                class="d-block w-100"
              >
                + Tambah Baris
              </a>
            </td>
          </tr>
          <AhsFooterRow title="Total Tenaga Kerja" :value="totalTenagaKerja" />
          <AhsHeaderRow title="B. BAHAN" />
          <AhsItemRow
            v-for="(ingredientsAhs, idx) in ahsItem.item_arranged.ingredients"
            :key="`B-${idx}`"
            :idx="idx"
            :codes-list="ahsItemableList"
            :units-list="unitsList"
            :ahs-itemable-list="ahsItemableList"
            :ahs-item="ingredientsAhs"
            @ahs-item-updated="onAhsItemUpdated"
            @ahs-item-deleted="onAhsItemDeleted"
          />
          <tr>
            <td colspan="8" class="font-weight-bold">
              <a
                href="#"
                class="d-block w-100"
                @click.prevent="addAhsItem('ingredients')"
              >
                + Tambah Baris
              </a>
            </td>
          </tr>
          <AhsFooterRow title="Total Bahan" :value="totalBahan" />
          <AhsHeaderRow title="C. PERALATAN" />
          <AhsItemRow
            v-for="(toolsAhs, idx) in ahsItem.item_arranged.tools"
            :key="`C-${idx}`"
            :idx="idx"
            :codes-list="ahsItemableList"
            :units-list="unitsList"
            :ahs-itemable-list="ahsItemableList"
            :ahs-item="toolsAhs"
            @ahs-item-updated="onAhsItemUpdated"
            @ahs-item-deleted="onAhsItemDeleted"
          />
          <tr>
            <td colspan="8" class="font-weight-bold">
              <a
                href="#"
                class="d-block w-100"
                @click.prevent="addAhsItem('tools')"
              >
                + Tambah Baris
              </a>
            </td>
          </tr>
          <AhsFooterRow title="Total Peralatan" :value="totalPeralatan" />
          <AhsHeaderRow title="D. LAIN LAIN" />
          <AhsItemRow
            v-for="(othersAhs, idx) in ahsItem.item_arranged.others"
            :key="`D-${idx}`"
            :idx="idx"
            :codes-list="ahsItemableList"
            :units-list="unitsList"
            :ahs-itemable-list="ahsItemableList"
            :ahs-item="othersAhs"
            @ahs-item-updated="onAhsItemUpdated"
            @ahs-item-deleted="onAhsItemDeleted"
          />
          <tr>
            <td colspan="8" class="font-weight-bold">
              <a
                href="#"
                class="d-block w-100"
                @click.prevent="addAhsItem('others')"
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
          <AhsHeaderRow title="F. BIAYA OVERHEAD" tooltip="0%" value="Rp.0 " />
          <AhsHeaderRow title="G. PROFIT" tooltip="0%" value="Rp.0 " />
          <AhsHeaderRow
            title="H. HARGA SATUAN PEKERJAAN"
            tooltip="(E + (F + G))"
            :value="ahsItemFinalSubtotal"
          />
        </tbody>
      </table>
      <hr />
    </div>
  </div>
</template>

<script>
  import AhsItemRow from '@/components/Master/Ahs/AhsItemRow.vue';
  import AhsHeaderRow from '@/components/Master/Ahs/AhsHeaderRow.vue';
  import AhsFooterRow from '@/components/Master/Ahs/AhsFooterRow.vue';
  import { PhX, PhPencil, PhArrowsIn } from 'phosphor-vue';
  import { mapActions } from 'vuex';
  import { Notify } from 'notiflix';
  // prettier-ignore
  import { formatCurrency, showConfirmAlert, ahsItemable } from '@/utils';

  export default {
    data: () => ({
      mainCardCollapsed: false,
    }),
    props: ['ahsItem', 'codesList', 'unitsList', 'ahsItemableList', 'idx'],
    methods: {
      ...mapActions(['destroyAhs', 'storeAhsItem']),
      async deleteAhs() {
        try {
          const { isConfirmed } = await showConfirmAlert({
            title: 'Hapus AHS',
            text: 'AHS akan dihapus secara permanen !',
          });
          if (isConfirmed) {
            await this.destroyAhs(this.ahsItem.id);
            this.$emit('ahs-deleted');
            Notify.success('Berhasil menghapus AHS');
          }
        } catch (err) {
          if (err.response) {
            Notify.failure(err.response.data.message);
          } else {
            Notify.failure('Gagal menghapus AHS');
          }
        }
      },
      onAhsItemUpdated() {
        this.$emit('ahs-item-updated');
      },
      editAhs() {
        this.$emit('ahs-item-edit-clicked', this.ahsItem);
      },
      async addAhsItem(section) {
        if (this.ahsItemableList.length <= 0) {
          Notify.failure(
            'Tidak ada data untuk di referensi, buat minimal 1 harga satuan terlebih dahulu'
          );
        } else {
          const data = await this.storeAhsItem({
            ahsId: this.ahsItem.id,
            form: {
              section,
              ahs_itemable_id: this.ahsItemableList[0].id,
              ahs_itemable_type: ahsItemable(
                this.ahsItemableList[0].ahs_itemable_type
              ),
            },
          });
          this.$emit('ahs-item-added');
        }
      },
      onAhsItemDeleted() {
        this.$emit('ahs-item-deleted');
      },
      toggleMaincardCollapse() {
        this.mainCardCollapsed = !this.mainCardCollapsed;
      },
    },
    computed: {
      totalTenagaKerja() {
        let val = 0;
        if (
          this.ahsItem.item_arranged.labor &&
          this.ahsItem.item_arranged.labor.length > 0
        ) {
          val = this.ahsItem.item_arranged.labor
            .map(data => data.subtotal)
            .reduce((acc, curr) => acc + curr);
        }

        return `Rp. ${formatCurrency(val)}`;
      },
      totalBahan() {
        let val = 0;
        if (
          this.ahsItem.item_arranged.ingredients &&
          this.ahsItem.item_arranged.ingredients.length > 0
        ) {
          val = this.ahsItem.item_arranged.ingredients
            .map(data => data.subtotal)
            .reduce((acc, curr) => acc + curr);
        }

        return `Rp. ${formatCurrency(val)}`;
      },
      totalPeralatan() {
        let val = 0;
        if (
          this.ahsItem.item_arranged.tools &&
          this.ahsItem.item_arranged.tools.length > 0
        ) {
          val = this.ahsItem.item_arranged.tools
            .map(data => data.subtotal)
            .reduce((acc, curr) => acc + curr);
        }

        return `Rp. ${formatCurrency(val)}`;
      },
      totalLainLain() {
        let val = 0;
        if (
          this.ahsItem.item_arranged.others &&
          this.ahsItem.item_arranged.others.length > 0
        ) {
          val = this.ahsItem.item_arranged.others
            .map(data => data.subtotal)
            .reduce((acc, curr) => acc + curr);
        }

        return `Rp. ${formatCurrency(val)}`;
      },
      ahsItemSubtotal() {
        return `Rp. ${formatCurrency(this.ahsItem.subtotal)}`;
      },
      ahsItemFinalSubtotal() {
        return `Rp. ${formatCurrency(
          (0 / 100) * this.ahsItem.subtotal +
            (0 / 100) * this.ahsItem.subtotal +
            this.ahsItem.subtotal
        )}`;
      },
    },
    components: {
      AhsItemRow,
      AhsHeaderRow,
      AhsFooterRow,
      PhX,
      PhPencil,
      PhArrowsIn,
    },
  };
</script>

<style scoped>
  .action-close {
    font-size: 17px;
  }
</style>
