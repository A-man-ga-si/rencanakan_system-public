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
        :ahs-group-items="filteredAhsGroupItems"
        :unit-code-list="unitItems"
        :selected-ahs-group-key="selectedAhsGroupKey"
        :ahs-search-query="ahsSearchQuery"
        @did-ahs-group-changed="didAhsGroupSelected"
        @did-rab-item-updated="didRabItemUpdated"
        @did-search-input-changed="didSearchInputChanged"
        @did-ahs-dropdown-dismissed="didAhsDropdownDismissed"
        @did-ahs-code-updated="didRabItemAhsUpdated"
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
        rabItems: null,
        unitItems: null,

        // Datas - Ahs Dropdown 
        ahsGroupItems: null,
        filteredAhsGroupItems: null,
        ahsItemLimit: 10,
        selectedAhsGroupKey: null,
        ahsSearchQuery: ""
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
        'fetchAhsIds',
        'fetchMasterAhsProject',
        'updateRabItem',
        'updateRabItemAhs'
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
      filterMasterAhs(masterAhsList, groupKey) { // TODO: Should move this code to RAB Summary Item Row
        return masterAhsList
          .filter((masterAhs) => masterAhs.groups == groupKey)
          .map(
            (masterAhs) => {
              return {
                key: masterAhs.id,
                label: `${masterAhs.id} - ${masterAhs.name}`
              }
            }
          )
      },
      async fetchAhsData() {
        this.filteredAhsGroupItems = [
          { groupKey: null, items: null },
          { groupKey: 'reference',  items: null },
          { groupKey: 'reference-2023', items: null },
        ]
        await this.reloadCustomAhsData();
        this.ahsGroupItems = JSON.parse(JSON.stringify(this.filteredAhsGroupItems));
      },
      async reloadData() {
        await this.fetchAhsData();

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
      didAhsDropdownDismissed() {
        this.selectedAhsGroupKey = null;
        this.ahsSearchQuery = '';
        this.filteredAhsGroupItems = JSON.parse(JSON.stringify(this.ahsGroupItems))
      },
      didAhsGroupSelected(groupKey) {
        this.ahsSearchQuery = '';
        this.selectedAhsGroupKey = groupKey;
        if (this.selectedAhsGroupKey == null) {
          this.reloadCustomAhsData();
          return;
        }
        this.reloadMasterAhsProjectData();
      },
      didSearchInputChanged(searchQuery) {
        this.ahsSearchQuery = searchQuery;
        if (this.selectedAhsGroupKey == null) {
          this.reloadCustomAhsData();
          return;
        }
        this.reloadMasterAhsProjectData();
      },
      calculateRabItemsSubtotal() {
        for (const rabItem of this.rabItems) {
          rabItem.subtotal = 0;
          for (const rabItemRow of rabItem.rab_item) {
            if (rabItemRow.custom_ahs != null) {
              rabItem.subtotal = rabItem.subtotal + (rabItemRow.custom_ahs.price * rabItemRow.volume);
              continue;
            }
            rabItem.subtotal = rabItem.subtotal + (rabItemRow.price * rabItemRow.volume);
          }
          for (const rabHeaderItemRow of rabItem.rab_item_header) {
            for (const rabItemRow of rabHeaderItemRow.rab_item) {
              if (rabItemRow.custom_ahs != null) {
                rabItem.subtotal = rabItem.subtotal + (rabItemRow.custom_ahs.price * rabItemRow.volume);
                continue;
              }
              rabItem.subtotal = rabItem.subtotal + (rabItemRow.price * rabItemRow.volume);
            }
          }
        }
      },
      async reloadCustomAhsData() { // TODO: Should pass only customAhsCodeList to RabSummaryItemRow
        const ahsGroupItem = this.filteredAhsGroupItems.find(
          (ahsGroupItem) => ahsGroupItem.groupKey == this.selectedAhsGroupKey
        );
        ahsGroupItem.items = null;
        const customAhsResponse = await this.fetchCustomAhsIds({
          projectId: this.$route.params.id,
          q: this.ahsSearchQuery,
          limit: this.ahsItemLimit
        });
        ahsGroupItem.items = customAhsResponse.data.data.ahsItemIds.map((customAhs) => {
          return  {
              key: customAhs.hashid,
              label: `${customAhs.code} - ${customAhs.name}`,
              price: customAhs.price
            }
        });
      },
      async reloadMasterAhsProjectData() { // TODO: Should pass only masterAhsList to RabSummaryItemRow
        const ahsGroupItem = this.filteredAhsGroupItems.find(
          (ahsGroupItem) => ahsGroupItem.groupKey == this.selectedAhsGroupKey
        );
        ahsGroupItem.items = null;
        const masterAhsResponse = await this.fetchMasterAhsProject({
          q: this.ahsSearchQuery,
          limit: this.ahsItemLimit,
          group: this.selectedAhsGroupKey
        });
        ahsGroupItem.items = this.filterMasterAhs(
          masterAhsResponse.data.ahsList,
          this.selectedAhsGroupKey
        );
      },
      async didRabItemUpdated(mutatedRab, mutatedRabItem) {
        let rab = this.rabItems.find((rab) => rab.hashid == mutatedRab.hashid);
        let rabItem = rab.rab_item.find((rabItemRow) => rabItemRow.hashid == mutatedRabItem.hashid);
        rabItem = mutatedRabItem;
        await this.updateRabItem({
          projectId: this.$route.params.id,
          rabId: rab.hashid,
          rabItemId: rabItem.hashid,
          form: { // TODO: Should changed to rab item instead
            name: rabItem.name,
            custom_ahs_id: rabItem.custom_ahs.hashid, // TODO: Should deleted soon on BE
            volume: rabItem.volume,
            unit_id: rabItem.hashed_unit_id,
            price: rabItem.price,
          },
        });
        this.calculateRabItemsSubtotal();
      },
      async didRabItemAhsUpdated({ rabId, rabHeaderId, rabRowItemId, ahsId }) {
        // 01 - Update RAB item remotely
        const response = await this.updateRabItemAhs({
            projectId: this.$route.params.id,
            rabId: rabId,
            rabItemId: rabRowItemId,
            groupId: this.selectedAhsGroupKey,
            ahsId: ahsId
        });
        const customAhs = response.data.data.customAhs;

        // 02 - Get RAB index
        let rabIndex = this.rabItems.findIndex((rab) => rab.hashid == rabId);

        // 03A - Update RAB header item locally
        if (rabHeaderId) {
          const rabHeaderIndex = this.rabItems[rabIndex].rab_item_header.findIndex(
            (rabHeaderItem) => rabHeaderItem.hashid == rabHeaderId
          );
          const rabItemIndex = this.rabItems[rabIndex].rab_item_header[rabHeaderIndex].rab_item.findIndex(
            (rabItemRow) => rabItemRow.hashid == rabRowItemId
          );
          this.rabItems[rabIndex].rab_item_header[rabHeaderIndex].rab_item[rabItemIndex].custom_ahs = customAhs;
        } else {
          // 03B - Update RAB item locally
          const rabItemIndex = this.rabItems[rabIndex].rab_item.findIndex(
            (rabItemRow) => rabItemRow.hashid == rabRowItemId
          );
          this.rabItems[rabIndex].rab_item[rabItemIndex].custom_ahs = customAhs;
        }

        // 04 - Reload custom AHS list data
        this.reloadCustomAhsData();
        this.calculateRabItemsSubtotal();
      }
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
        return !this.ahsGroupItems || !this.unitItems || !this.rabItems;
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
