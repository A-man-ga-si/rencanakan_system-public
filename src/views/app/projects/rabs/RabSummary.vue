<template>
  <div class="rab-summary-page mt-5">
    <b-row>
      <b-col :lg="6" :xl="3">
        <div class="text-right mb-2 position-relative">
          <label class="form-group has-float-label mb-0">
            <input
              v-model="form.searchQuery"
              type="text"
              class="form-control"
            />
            <span> Search </span>
          </label>
          <i
            class="simple-icon-magnifier position-absolute bg-white"
            style="top: 11px; right: 10px"
          />
        </div>
      </b-col>
      <b-col>
        <b-form-group horizontal>
          <b-form-radio-group
            class="pt-2"
            :options="searchQueryOptions"
            v-model="form.searchQueryCategory"
          />
        </b-form-group>
      </b-col>
    </b-row>
    <div v-if="isLoading">
      <div class="text-center">
        <Loader class="mt-5" />
        <h2>
          <strong>Memuat RAB</strong>
        </h2>
      </div>
    </div>
    <div v-else>
      <RabSummaryItem
        v-for="(rab, idx) in rabItems"
        :key="idx"
        :index="idx"
        :rab-item="rab"
        :ahs-code-list="ahsItems"
        :unit-code-list="unitItems"
        @rab-item-deleted="reloadData"
        @rab-item-added="reloadData"
        @rab-item-updated="reloadData"
        @rab-item-header-deleted="reloadData"
        @edit-rab-item-header-bt-clicked="showEditRabItemHeaderModal"
        @add-rab-item-header-bt-clicked="showAddRabItemHeaderModal"
        @edit-rab-item-bt-clicked="editRab"
      />
      <b-row>
        <b-col>
          <b-button
            @click="fabClick"
            variant="primary"
            class="w-100 mb-4 mt-2"
            style="font-size: 17px; border-radius: 12px; padding: 12px 0"
          >
            <h4 class="mb-0">+ Tambah Kategori</h4>
          </b-button>
        </b-col>
      </b-row>
      <b-row>
        <b-col :xl="7" :lg="9" :md="10" class="ml-auto">
          <b-card class="ahs-card-single custom-nice-border">
            <table class="w-100">
              <tr>
                <td>
                  <h3>Total</h3>
                </td>
                <td class="text-right">
                  <h3>Rp. {{ numberFormat(rabsTotal) }}</h3>
                </td>
              </tr>
              <tr>
                <td>
                  <h3>PPN ({{ projectPpn.percentage }}%)</h3>
                </td>
                <td class="text-right">
                  <h3>Rp. {{ numberFormat(projectPpn.total) }}</h3>
                </td>
              </tr>
              <tr>
                <td>
                  <h3>Subtotal</h3>
                </td>
                <td class="text-right">
                  <h3>Rp. {{ numberFormat(rabsSubTotal) }}</h3>
                </td>
              </tr>
              <tr>
                <td>
                  <h3>Terbilang</h3>
                </td>
                <td class="text-right">
                  <h3 style="padding-left: 70px">
                    {{ convertAlphabeuticalNum }} RUPIAH
                  </h3>
                </td>
              </tr>
            </table>
          </b-card>
        </b-col>
      </b-row>
      <!-- <FloatingActionButton  /> -->
      <AddRab @rab-added="reloadData" />
      <AddRabItemHeader
        :rab="rabItemHeaderAdd"
        @rab-item-header-added="reloadData"
      />
      <EditRab @rab-updated="reloadData" :edited-rab="editedRabItem" />
      <EditRabItemHeader
        @rab-item-header-updated="reloadData"
        :rab="rabItemHeaderEdit"
        :edited-rab-item-header="editedRabItemHeader"
      />
    </div>
  </div>
</template>

<script>
  import { mapActions, mapGetters } from 'vuex';
  import angkaTerbilang from '@develoka/angka-terbilang-js';
  import EditRab from '@/components/Project/Rab/EditRab.vue';
  import AddRabItemHeader from '@/components/Project/Rab/AddRabItemHeader.vue';
  import { formatCurrency } from '@/utils';
  import EditRabItemHeader from '@/components/Project/Rab/EditRabItemHeader.vue';
  import RabSummaryItem from '@/components/Project/Rab/RabSummaryItem.vue';
  import AddRab from '@/components/Project/Rab/AddRab.vue';
  import Loader from '@/components/Common/Loader.vue';

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
        unitCodesList: [],
        rabItemHeaderAdd: {},
        rabItemHeaderEdit: {},
        searchCountdownObject: null,
        editedRabItem: null,
        editedRabItemHeader: null,
        ahsItems: null,
        rabItems: null,
        unitItems: null
      };
    },
    created() {
      this.reloadData();
    },
    methods: {
      ...mapActions([
        'fetchUnit',
        'fetchCustomAhsIds',
        'fetchRab',
        'fetchAhs',
        'showProject',
      ]),
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
      async reloadData() {
        // Generate AHS items
        const ahsData = await this.fetchCustomAhsIds({
          projectId: this.$route.params.id,
        });
        this.ahsItems = ahsData.data.data.ahsItemIds;

        // Generate unit items
        const unitData = await this.fetchUnit();
        this.unitItems = unitData.data.data.units;

        // Generate RAB items
        const rabData = await this.fetchRab({
          projectId: this.$route.params.id,
        });
        this.rabItems = rabData.data.data.rabs;

        // Generate project items
        this.projectProperties = await this.showProject(
          this.$route.params.id
        );
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
      ...mapGetters(['getProjects']),
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
        const mappedRabs = this.rabItems.map(data => data.subtotal);
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
      isLoading() {
        return !this.ahsItems || !this.unitItems || !this.rabItems;
      }
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
      Loader,
      RabSummaryItem,
      // FloatingActionButton,
      EditRab,
      AddRab,
      AddRabItemHeader,
      EditRabItemHeader,
    },
  };
</script>
