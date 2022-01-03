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
            <span> Search Item </span>
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
      v-for="(rab, idx) in getRabs"
      :key="idx"
      :index="idx"
      :rab-item="rab"
      :ahs-code-list="customAhsIds"
      :unit-code-list="getUnit"
      @rab-item-deleted="reloadData"
      @rab-item-added="reloadData"
      @rab-item-updated="reloadData"
      @add-rab-item-header-bt-clicked="showAddRabItemHeaderModal"
    />
    <b-row>
      <b-col>
        <b-button
          @click="fabClick"
          variant="primary"
          class="w-100 mb-4 mt-2 py-3"
          style="font-size: 17px; border-radius: 20px"
        >
          + Tambah Kategori
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
                <h3>{{ convertAlphabeuticalNum }} RUPIAH</h3>
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
  </div>
</template>

<script>
  import { mapActions, mapGetters } from 'vuex';
  import angkaTerbilang from '@develoka/angka-terbilang-js';
  import RabSummaryItem from '../../../../components/Project/Rab/RabSummaryItem.vue';
  // import FloatingActionButton from '../../../../components/Project/FloatingActionButton.vue';
  import AddRab from './../../../../components/Project/Rab/AddRab.vue';
  import AddRabItemHeader from '@/components/Project/Rab/AddRabItemHeader.vue';
  import { formatCurrency } from '@/utils';

  export default {
    data() {
      return {
        form: {
          searchQuery: '',
          searchQueryCategory: 'header',
        },
        searchQueryOptions: [
          { text: 'Header', value: 'header' },
          { text: 'Item', value: 'item' },
        ],
        projectProperties: {},
        projects: {},
        ahsCodesList: [],
        unitCodesList: [],
        customAhsIds: [],
        rabItemHeaderAdd: {},
        searchCountdownObject: null,
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
      showAddRabItemHeaderModal(rabItem) {
        console.log(rabItem);
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
    },
    computed: {
      ...mapGetters(['getRabs', 'getAhs', 'getProjects', 'getUnit']),
      projectPpn() {
        const percentage = this.projectProperties.data
          ? this.projectProperties.data.data.project.ppn
          : 0;
        return {
          percentage,
          total: (percentage / 100) * this.rabsTotal,
        };
      },
      rabsTotal() {
        const mappedRabs = this.getRabs.map(data => data.subtotal);
        return mappedRabs.length
          ? mappedRabs.reduce((acc, curr) => acc + curr)
          : 0;
      },
      rabsSubTotal() {
        return this.rabsTotal + this.projectPpn.total;
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
      RabSummaryItem,
      // FloatingActionButton,
      AddRab,
      AddRabItemHeader,
    },
  };
</script>
