<template>
  <div class="material-estimator-page">
    <div class="subscription-didnt-supported text-center mt-5" v-if="getCurrentActiveProject.subscription_id != 'professional'">
      <img src="@/assets/img/custom/package.svg" alt="" width="400" class="mb-5">
      <h2>Fitur Dikunci</h2>
      <p>Paket anda tidak mendukung untuk fitur hitung bahan. Silahkan upgrade paket terlebih dahulu</p>
    </div>
    <div class="rab-summary-page mt-5" v-else>
      <div class="empty-view text-center" v-if="getRabs.length <= 0">
        <img
          src="@/assets/img/panel/Empty-amico.svg"
          alt=""
          style="max-width: 350px; width: 100%"
        />
        <h2 class="mt-4">Belum Ada RAB</h2>
        <p>Buat RAB (minimal 1 RAB) terlebih dahulu untuk melihat hasil hitung bahan!.</p>
      </div>
      <div class="material-estimator-view" v-else>
        <MaterialEstimatorItem
          v-for="(rab, idx) in getRabs"
          :key="idx"
          :index="idx"
          :rab-item="rab"
          :ahs-code-list="customAhsIds"
          :unit-code-list="getUnit"
          @rab-item-deleted="reloadData"
          @rab-item-added="reloadData"
          @rab-item-updated="reloadData"
          @rab-item-header-deleted="reloadData"
          @edit-rab-item-header-bt-clicked="showEditRabItemHeaderModal"
          @add-rab-item-header-bt-clicked="showAddRabItemHeaderModal"
          @edit-rab-item-bt-clicked="editRab"
        />
      </div>
    </div>
  </div>
</template>

<script>
  import { mapActions, mapGetters } from 'vuex';
  import angkaTerbilang from '@develoka/angka-terbilang-js';
  import { formatCurrency } from '@/utils';
  import MaterialEstimatorItem from '@/components/Project/Rab/MaterialEstimatorItem.vue';

  export default {
    data() {
      return {
        form: {
          searchQuery: '',
          searchQueryCategory: 'item',
        },
        searchQueryOptions: [
          { text: 'Nama Barang', value: 'item' },
          { text: 'Kategori', value: 'header' },
        ],
        projectProperties: {},
        projects: {},
        ahsCodesList: [],
        unitCodesList: [],
        customAhsIds: [],
        rabItemHeaderAdd: {},
        rabItemHeaderEdit: {},
        searchCountdownObject: null,
        editedRabItem: null,
        editedRabItemHeader: null,
      };
    },
    created() {
      this.fetchRab({
        projectId: this.$route.params.id,
      });
      this.fetchShowProject();
      this.fetchUnit();
      this.getCustomAhsIds();
    },
    methods: {
      ...mapActions([
        'fetchUnit',
        'fetchCustomAhsIds',
        'fetchRab',
        'fetchAhs',
        'showProject',
      ]),
      async fetchShowProject() {
        this.projectProperties = await this.showProject(this.$route.params.id);
      },
      async getCustomAhsIds() {
        const data = await this.fetchCustomAhsIds({
          projectId: this.$route.params.id,
        });
        this.customAhsIds = data.data.data.ahsItemIds;
      },
      showEditRabItemHeaderModal(rabItem, rabItemHeader) {
        this.rabItemHeaderEdit = rabItem;
        this.editedRabItemHeader = rabItemHeader;
        this.$bvModal.show('edit-rab-item-header');
      },
      showAddRabItemHeaderModal(rabItem) {
        this.rabItemHeaderAdd = rabItem;
        this.$bvModal.show('add-rab-item-header');
      },
      fabClick(ref) {
        this.$bvModal.show('add-rab');
      },
      reloadData() {
        this.fetchRab({
          projectId: this.$route.params.id,
        });
      },
      numberFormat(number) {
        return formatCurrency(number);
      },
      editRab(rabItem) {
        this.editedRabItem = rabItem;
        this.$bvModal.show('edit-rab');
      },
    },
    computed: {
      ...mapGetters(['getRabs', 'getAhs', 'getProjects', 'getUnit', 'getCurrentActiveProject']),
      projectPpn() {
        const percentage = this.projectProperties.data
          ? this.projectProperties.data.data.project.ppn
          : 0;
        return {
          percentage,
          total: parseInt((percentage / 100) * this.rabsTotal),
        };
      },
      rabsTotal() {
        const mappedRabs = this.getRabs.map(data => data.subtotal);
        return mappedRabs.length
          ? parseInt(mappedRabs.reduce((acc, curr) => acc + curr))
          : 0;
      },
      rabsSubTotal() {
        return parseInt(this.rabsTotal + this.projectPpn.total);
      },
      convertAlphabeuticalNum() {
        return angkaTerbilang(this.rabsSubTotal).toUpperCase();
      },
    },
    watch: {
      form: {
        async handler() {
          if (this.searchCountdownObject != 'null') {
            clearTimeout(this.searchCountdownObject);
          }

          const that = this;

          if (this.form.searchQuery != '') {
            this.searchCountdownObject = setTimeout(async function () {
              await that.fetchRab({
                projectId: that.$route.params.id,
                query: that.form.searchQuery,
                queryCategory: that.form.searchQueryCategory,
              });
            }, 500);
          } else {
            this.fetchCustomItemPrices(this.$route.params.id);
          }
        },
        deep: true,
      },
    },
    components: {
      MaterialEstimatorItem
    },
  };
</script>
