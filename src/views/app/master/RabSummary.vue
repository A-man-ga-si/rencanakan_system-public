<template>
  <div class="rab-summary-page">
    <div class="left mb-3">
        <div
          class="labeled-select position-relative d-inline-block"
          style="width: 300px"
        >
          <span class="px-1"> Provinsi</span>
          <v-select
            label="name"
            :reduce="province => province.hashid"
            :options="provinces"
            v-model="selectedProvince"
          />
        </div>
        <div
          class="labeled-select position-relative d-inline-block ml-2"
          style="width: 300px"
        >
          <span class="px-1"> Group AHS</span>
          <v-select
            label="name"
            :reduce="ahs => ahs.id"
            :options="rabGroup"
            v-model="selectedAhsGroup"
          />
        </div>
    </div>
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
    <RabSummaryItem
      v-for="(rab, idx) in getMasterRabs"
      :key="idx"
      :index="idx"
      :rab-item="rab"
      :ahs-code-list="ahsIds"
      :unit-code-list="getUnit"
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
    <AddMasterRab @master-rab-added="reloadData" />
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
</template>

<script>

  import { mapActions, mapGetters } from 'vuex';
  import angkaTerbilang from '@develoka/angka-terbilang-js';
  import EditRab from '@/components/Project/Rab/EditRab.vue';
  import AddRabItemHeader from '@/components/Project/Rab/AddRabItemHeader.vue';
  import { formatCurrency } from '@/utils';
  import EditRabItemHeader from '@/components/Project/Rab/EditRabItemHeader.vue';
  import RabSummaryItem from '@/components/Master/Rab/RabSummaryItem.vue';
  import AddMasterRab from '@/components/Project/Rab/AddMasterRab.vue';
  import { API_URL } from '@/constants/config'

  export default {
    data() {
      return {
        provinces: [],
        rabGroup: [
          {
            id: 'all',
            name: 'All'
          },
          {
            id: 'reference',
            name: 'AHS Permen PUPR 2016'
          },
          {
            id: 'reference-2023',
            name: 'AHS Permen PUPR 2023'
          },
        ],
        form: {
          searchQuery: '',
          searchQueryCategory: 'item',
        },
        searchQueryOptions: [
          { text: 'Nama Barang', value: 'item' },
          { text: 'Kategori', value: 'header' },
        ],
        selectedProvince: '',
        selectedAhsGroup: '',
        projectProperties: {},
        projects: {},
        ahsCodesList: [],
        unitCodesList: [],
        ahsIds: [],
        rabItemHeaderAdd: {},
        rabItemHeaderEdit: {},
        searchCountdownObject: null,
        editedRabItem: null,
        editedRabItemHeader: null,
      };
    },
    created() {
      // this.fetchRab({
      //   projectId: this.$route.params.id,
      // });
      this.fetchMasterRab({
        query: '',
        queryCategory: ''
      })
      this.fetchShowProject();
      this.fetchUnit();
      this.getAhsIds();
      this.loadProvinces();
    },
    methods: {
      ...mapActions([
        'fetchUnit',
        'fetchAhsIds',
        'showProject',
        'fetchMasterRab',
        'fetchProvinces'
      ]),
      async fetchShowProject() {
        this.projectProperties = await this.showProject(this.$route.params.id);
      },
      async getAhsIds() {
        const data = await this.fetchAhsIds();
        this.ahsIds = data.data.data.ahses;
      },
      async loadProvinces() {
        const data = await this.fetchProvinces();
        this.provinces = data;
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
        this.$bvModal.show('add-master-rab');
      },
      reloadData() {
        this.fetchMasterRab({
          query: '',
          queryCategory: ''
        })
        // this.fetchRab({
        //   projectId: this.$route.params.id,
        // });
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
      ...mapGetters(['getMasterRabs', 'getAhs', 'getProjects', 'getUnit']),
      rabsTotal() {
        const mappedRabs = this.getMasterRabs.map(data => data.subtotal);
        return mappedRabs.length
          ? parseInt(mappedRabs.reduce((acc, curr) => acc + curr))
          : 0;
      },
      rabsSubTotal() {
        return parseInt(this.rabsTotal);
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
              // await that.fetchRab({
              //   projectId: that.$route.params.id,
              //   query: that.form.searchQuery,
              //   queryCategory: that.form.searchQueryCategory,
              // });
            }, 500);
          } else {
            this.fetchCustomItemPrices(this.$route.params.id);
          }
        },
        deep: true,
      },
    },
    components: {
      RabSummaryItem,
      // FloatingActionButton,
      EditRab,
      AddMasterRab,
      AddRabItemHeader,
      EditRabItemHeader,
    },
  };
</script>
