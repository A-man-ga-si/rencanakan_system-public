<template>
  <div class="rab-summary-page mt-5">
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
    <FloatingActionButton @click="fabClick" />
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
  import FloatingActionButton from '../../../../components/Project/FloatingActionButton.vue';
  import AddRab from './../../../../components/Project/Rab/AddRab.vue';
  import AddRabItemHeader from '@/components/Project/Rab/AddRabItemHeader.vue';
  import { formatCurrency } from '@/utils';

  export default {
    data() {
      return {
        projectProperties: {},
        projects: {},
        ahsCodesList: [],
        unitCodesList: [],
        customAhsIds: [],
        rabItemHeaderAdd: {},
      };
    },
    created() {
      this.fetchRab(this.$route.params.id);
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
        this.fetchRab(this.$route.params.id);
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
    components: {
      RabSummaryItem,
      FloatingActionButton,
      AddRab,
      AddRabItemHeader,
    },
  };
</script>
