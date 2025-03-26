<template>
  <div class="rab-summary-page mt-5">
    <b-row style="margin-bottom: 24px">
      <b-col :lg="6" :xl="3">
        <div class="text-right position-relative">
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
      <b-col class="d-flex">
        <b-form-group horizontal class="my-auto">
          <b-form-radio-group
            class="my-auto"
            :options="searchQueryOptions"
            v-model="form.searchQueryCategory"
          />
        </b-form-group>
      </b-col>
      <b-col class="d-flex">
        <b-btn
          class="ml-auto my-auto"
          variant="outline-primary"
          @click="onTapImportButton"
        >
          Upload RAB LPSE
        </b-btn>
        <b-btn 
          variant="link" 
          class="text-primary font-weight-bold d-inline-flex align-items-center"
          @click="toggleRap"  
        >
          {{ showRap ? 'Hide RAP' : 'Show RAP' }} 
          <span v-if="!showRap" class="ml-1">→</span>
        </b-btn>
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
    <div v-else ref="mainTableDiv">
      <RabSummaryItem ref="rabSummaryItem"
        v-for="(rab, idx) in rabItems"
        :key="idx"
        :index="idx"
        :rab-item="rab"
        :showRap="showRap"
        :ahs-group-items="ahsGroupItems"
        :ahs-items="ahsItems"
        :unit-code-list="unitItems"
        :selected-ahs-group-key="selectedAhsGroupKey"
        :ahs-search-query="ahsSearchQuery"
        @did-ahs-group-changed="didAhsGroupSelected"
        @did-custom-button-clicked="didCustomButtonClicked"
        @did-rab-item-updated="didRabItemUpdated"
        @did-search-input-changed="didSearchInputChanged"
        @did-reset-ahs-button-clicked="didResetButtonClicked"
        @did-ahs-dropdown-showed="didAhsDropdownShowed"
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
      <transition name="slide">
      <div v-if="showRap" class="rap-sheet" :style="{ maxWidth: '100%', height: rapSheetHeight, top: popupMaxY }">
        <div class="rap-parent-view" :style="{ maxWidth: '100%', position: 'relative' }">
        <div class="rap-content" v-for="(tableItem, index) in rabItems" :key="index" :style="{ maxWidth: '100%', top: tablePositions[index] + 'px', position: 'absolute' }">
          <h4 class="text-primary" :style="{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                whiteSpace: 'nowrap',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                fontSize: '14px',
                height: '27px'
            }">
            <span :style="{
                  flex: '1',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap'
                  }"> 
              {{ alphabeuticalRabNumber(index) }}. {{ tableItem.name }} 
            </span>
            <a
            href="#"
            @click.prevent="toggleEdit(tableItem)"
            class="text-primary action-close float-right"
            style="margin-top: -3px"
          >
              <ph-pencil weight="light" :size="25" />
          </a>
          </h4>
          <table class="table">
            <thead>
              <tr>
                <th :style="{ width: '105px' }">Profit Margin</th>
                <th>Harga Satuan</th>
                <th>Jumlah Modal</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="item in tableItem.rab_item" :style="{ height: '62.2px' }">
                <td :style="{ verticalAlign: 'middle' }">
                  <template v-if="editingTable === tableItem">
                    <div :style="{ display: 'flex', alignItems: 'center' }">
                      <input type="number" v-model="item.profit_margin" class="form-control" :style="{ marginRight: '5px' }"/> 
                      <span>%</span>
                    </div>
                  </template>
                  <template v-else>
                      {{ item.profit_margin }} %
                  </template>
                </td>
                <td :style="{ verticalAlign: 'middle' }">{{ item.profit_margin == 0 ? "Rp. -" : getRAPPrice(item, item.profit_margin) }}</td>
                <td :style="{ verticalAlign: 'middle' }">{{ item.profit_margin == 0 ? "Rp. -" : getRAPTotal(item, item.profit_margin) }}</td>
              </tr>
            </tbody>
            <div v-if="editingTable === tableItem" class="edit-actions d-flex justify-content-end mt-2" :style="{ position:'absolute', right: '0' }">
              <button class="btn btn-outline-primary mr-2" @click.prevent = "editingTable = null" :style="{ width: '100px' }">Cancel</button>
              <button class="btn btn-primary" @click.prevent="saveProfitMargin(tableItem)" :style="{ width: '100px' }">Save</button>
            </div>
          </table>

          <div class="rap-content" v-for="(tableItem, idx) in rabItems[index].rab_item_header" :style="{ marginTop: '62.5px', position: 'relative' }" :key="idx">
            <h3 class="text-primary" :style="{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                whiteSpace: 'nowrap',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                fontSize: '14px',
                height: '43.8px'
            }">
            <span :style="{
                  flex: '1',
                  minWidth: '0', /* Prevents unexpected flex shrink */
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap'
                  }"> 
              {{ romanized(idx + 1) }}. {{ tableItem.name }} 
            </span>
            
            <a
            href="#"
            @click.prevent="toggleEdit(tableItem)"
            class="text-primary action-close float-right"
            style="margin-top: -3px"
          >
              <ph-pencil weight="light" :size="25" />
          </a>
          </h3>
          <table class="table">
            <tbody>
              <tr v-for="item in tableItem.rab_item" :style="{ height: '62.2px' }">
                <td :style="{ width: '105px', verticalAlign: 'middle' }">
                  <template v-if="editingTable === tableItem">
                    <div :style="{ display: 'flex', alignItems: 'center' }">
                      <input type="number" v-model="item.profit_margin" class="form-control" :style="{ marginRight: '5px' }"/> 
                      <span>%</span>
                    </div>
                    </template>
                    <template v-else>
                      {{ item.profit_margin }} %
                    </template>
                </td>
                <td :style="{ verticalAlign: 'middle' }">{{ item.profit_margin == 0 ? "Rp. -" : getRAPPrice(item, item.profit_margin) }}</td>
                <td :style="{ verticalAlign: 'middle' }">{{ item.profit_margin == 0 ? "Rp. -" : getRAPTotal(item, item.profit_margin) }}</td>
              </tr>
            </tbody>
            <div v-if="editingTable === tableItem" class="edit-actions d-flex justify-content-end mt-2" :style="{ position:'absolute', right: '0' }">
              <button class="btn btn-outline-primary mr-2" @click.prevent = "editingTable = null" :style="{ width: '100px' }">Cancel</button>
              <button class="btn btn-primary" @click.prevent="saveProfitMargin(rabItems[index], tableItem)" :style="{ width: '100px' }">Save</button>
            </div>
          </table>
        </div>
        </div>
        </div>
      </div>
    </transition>
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

    <ImportExcelModal
      :id="this.importApendoModalId"
      :title="'Unggah RAB Apendo'"
      :subtitle="'Upload dokumen lelang LPSE yang memuat tabel RAB ke format pdf, dan kemudian upload ke halaman ini.'"
      :fileAccept="'.pdf'"
      :isLoading="isImportRabLoading"
      :didFileSelected="didFileSelected"
    />
  </div>
</template>

<script>
  import { mapActions, mapGetters, mapMutations } from 'vuex';
  import angkaTerbilang from '@develoka/angka-terbilang-js';
  import EditRab from '@/components/Project/Rab/EditRab.vue';
  import AddRabItemHeader from '@/components/Project/Rab/AddRabItemHeader.vue';
  import { formatCurrency } from '@/utils';
  import EditRabItemHeader from '@/components/Project/Rab/EditRabItemHeader.vue';
  import RabSummaryItem from '@/components/Project/Rab/RabSummaryItem.vue';
  import AddRab from '@/components/Project/Rab/AddRab.vue';
  import Loader from '@/components/Common/Loader.vue';
  import { AHSGroupReferences } from '@/constants/enums.js'
  import { Notify } from 'notiflix';
  import { ImportExcelModal } from '@/components/Common';
  import { PhPencil } from 'phosphor-vue';
  import { toRoman } from 'roman-numerals';
  import { numberToAlphabet } from '@/utils';
import { isNil } from 'lodash';

  export default {
    data() {
      return {
        rapSheetHeight: null,
        isProfitMarginError: false,
        shouldShowProfitMarginNotif: false,
        editingTable: null,
        tablePositions: [],
        showRap: false,
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
        rabItemHeaderAdd: {},
        rabItemHeaderEdit: {},
        searchCountdownObject: null,
        editedRabItem: null,
        editedRabItemHeader: null,
        rabItems: null,
        unitItems: null,

        // Datas - Ahs Dropdown 
        ahsGroupItems: Object.values(AHSGroupReferences),
        ahsItems: null,
        filteredAhsGroupItems: null,
        ahsItemLimit: 10,
        selectedAhsGroupKey: AHSGroupReferences.ahsProject.key,
        ahsSearchQuery: "",

        ahsDropdownProps: null,

        importApendoModalId: 'import-apendo-modal',
        isImportRabLoading: false,
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
        'updateRabItemAhs',
        'importApendoRab'
      ]),
      ...mapMutations([
        'showCreateAhsPopup'
      ]),
      saveProfitMargin(tableItem, rabHeader) {
        if (rabHeader) {
          rabHeader.rab_item.forEach((item, index, array) => {
            this.didRabItemUpdated(tableItem, item, true);
            if (index === array.length - 1) {
              this.shouldShowProfitMarginNotif = true;
            }
          });          
          return;
        }
        tableItem.rab_item.forEach((item, index, array) => {
          this.didRabItemUpdated(tableItem, item, true);
          if (index === array.length - 1) {
              this.shouldShowProfitMarginNotif = true;
          }
        });
      },
      alphabeuticalRabNumber(index) {
        return numberToAlphabet(index).toUpperCase();
      },
      romanized(number) {
        return toRoman(number);
      },
      getRAPPrice(rabItemRow, profitMargin) {
        if (rabItemRow.custom_ahs != null) {
          return `Rp. ${formatCurrency(parseInt(Math.round(rabItemRow.custom_ahs.price) * (1 - profitMargin / 100)))}`;
        }
        return `Rp. ${formatCurrency(parseInt(Math.round((rabItemRow.price)) * (1 - profitMargin / 100)))}`;
      },
      getRAPTotal(rabItemRow, profitMargin) {
        if (rabItemRow.custom_ahs != null) {
          return `Rp. ${formatCurrency(parseInt(Math.round(rabItemRow.custom_ahs.price) * rabItemRow.volume * (1 - profitMargin / 100)))}`;
        }
        return `Rp. ${formatCurrency(parseInt(Math.round((rabItemRow.price) * rabItemRow.volume) * (1 - profitMargin / 100)))}`;
      },
      toggleEdit(table) {
        this.editingTable = this.editingTable === table ? null : table;
      },
      updateTablePositions() {
        const targetDiv = this.$refs.mainTableDiv;
        const targetRect = targetDiv.offsetTop;
        this.tablePositions = this.$refs.rabSummaryItem.map((item) => {
          return item.$el.offsetTop - targetRect;
        });
        this.rapSheetHeight = (this.$refs.mainTableDiv.offsetHeight - 475) + 'px';
      },
      getTbodyYPosition() {
        const targetDiv = this.$refs.mainTableDiv;
        if (targetDiv) {
          const targetRect = targetDiv.offsetTop;
          this.popupMaxY = `${targetRect}px`;
          this.$refs.rabSummaryItem[0].getTbodyMetrics();
          const maxY = this.$refs.rabSummaryItem[0].$refs.rabTheader.getBoundingClientRect().top + window.scrollY;
          this.headerMaxY = `${maxY}px`;
          
          const headerHeight = this.$refs.rabSummaryItem[0].$refs.rabTheader.offsetHeight;
          this.itemHeaderHeight = `${headerHeight}px`;

          this.updateTablePositions();
        }
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
      toggleRap() {
        this.showRap = !this.showRap;
        this.getTbodyYPosition();
      },
      async initAhsData() {
        this.selectedAhsGroupKey = AHSGroupReferences.ahsProject.key;
        await this.reloadCustomAhsData();
      },
      async reloadData() {
        await this.initAhsData();

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

        this.updateTablePositions();
      },
      numberFormat(number) {
        return formatCurrency(number);
      },
      editRab(rabItem) {
        this.editedRabItem = rabItem;
        this.$bvModal.show('edit-rab');
      },
      didAhsDropdownShowed() {
        this.reloadCustomAhsData();
      },
      didAhsDropdownDismissed() {
        this.selectedAhsGroupKey = AHSGroupReferences.ahsProject.key;
        this.ahsSearchQuery = '';
        this.ahsItems = null
      },
      reloadAhsData() {
        if (this.selectedAhsGroupKey == AHSGroupReferences.ahsProject.key) {
          this.reloadCustomAhsData();
          return;
        }
        this.reloadMasterAhsProjectData();
      },
      didCustomButtonClicked() {
        this.showCreateAhsPopup();
        this.$router.push({ name: 'RabAhs'});
      },
      didAhsGroupSelected(key) {
        this.selectedAhsGroupKey = key;
        this.ahsSearchQuery = '';
        this.reloadAhsData();
      },
      didSearchInputChanged(searchQuery) {
        this.ahsSearchQuery = searchQuery;
        this.reloadAhsData();
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
        this.ahsItems = null;
        const customAhsResponse = await this.fetchCustomAhsIds({
          projectId: this.$route.params.id,
          q: this.ahsSearchQuery,
          limit: this.ahsItemLimit
        });
        this.ahsItems = customAhsResponse.data.data.ahsItemIds.map((customAhs) => {
          return  {
              key: customAhs.hashid,
              label: `${customAhs.code} - ${customAhs.name}`,
              price: customAhs.price
            }
        });
      },
      async reloadMasterAhsProjectData() { // TODO: Should pass only masterAhsList to RabSummaryItemRow
        this.ahsItems = null
        const masterAhsResponse = await this.fetchMasterAhsProject({
          q: this.ahsSearchQuery,
          limit: this.ahsItemLimit,
          group: this.selectedAhsGroupKey
        });
        this.ahsItems = this.filterMasterAhs(
          masterAhsResponse.data.ahsList,
          this.selectedAhsGroupKey
        );
      },
      async didRabItemUpdated(mutatedRab, mutatedRabItem, isProfitMarginUpdate) {
        let rab = this.rabItems.find((rab) => rab.hashid == mutatedRab.hashid);
        let rabItem = rab.rab_item.find((rabItemRow) => rabItemRow.hashid == mutatedRabItem.hashid);
        rabItem = mutatedRabItem;
        try {
          await this.updateRabItem({
            projectId: this.$route.params.id,
            rabId: rab.hashid,
            rabItemId: rabItem.hashid,
            form: {
              name: rabItem.name,
              custom_ahs_id: rabItem.custom_ahs?.hashid ?? null,
              volume: rabItem.volume,
              unit_id: rabItem.hashed_unit_id,
              price: rabItem.price,
              profit_margin: rabItem.profit_margin
            },
          });
          this.calculateRabItemsSubtotal();
          if (this.shouldShowProfitMarginNotif && isProfitMarginUpdate && !this.isProfitMarginError) {
            Notify.success('Profit margin berhasil diubah');
            this.shouldShowProfitMarginNotif = false;
            this.editingTable = null;
          } else if (this.shouldShowProfitMarginNotif && isProfitMarginUpdate && this.isProfitMarginError) {
            Notify.failure('Profit margin gagal diubah');
            this.shouldShowProfitMarginNotif = false;
            this.editingTable = null;
          }
        } catch (err) {
          if (isProfitMarginUpdate) {
            this.isProfitMarginError = true;
          }
        }
      },
      async didRabItemAhsUpdated({ rabId, rabHeaderId, rabRowItemId, ahsId }) {
        try {
          // 01 - Update RAB item remotely
          let request = {
              projectId: this.$route.params.id,
              rabId: rabId,
              rabItemId: rabRowItemId,
              ahsId: ahsId
          }
          if (this.selectedAhsGroupKey != AHSGroupReferences.ahsProject.key) {
            request['groupId'] = this.selectedAhsGroupKey;
          }
          const response = await this.updateRabItemAhs(request);
          const customAhs = response.data.data.customAhs;

          // 02 - Get RAB index
          let rabIndex = this.rabItems.findIndex((rab) => rab.hashid == rabId);

          // 03.A - Update RAB header item locally
          if (rabHeaderId) {
            const rabHeaderIndex = this.rabItems[rabIndex].rab_item_header.findIndex(
              (rabHeaderItem) => rabHeaderItem.hashid == rabHeaderId
            );
            const rabItemIndex = this.rabItems[rabIndex].rab_item_header[rabHeaderIndex].rab_item.findIndex(
              (rabItemRow) => rabItemRow.hashid == rabRowItemId
            );
            this.rabItems[rabIndex].rab_item_header[rabHeaderIndex].rab_item[rabItemIndex].custom_ahs = customAhs;
          } else {
            // 03.B - Update RAB item locally
            const rabItemIndex = this.rabItems[rabIndex].rab_item.findIndex(
              (rabItemRow) => rabItemRow.hashid == rabRowItemId
            );
            this.rabItems[rabIndex].rab_item[rabItemIndex].custom_ahs = customAhs;
          }

          // 04 - Reload custom AHS list data
          this.reloadCustomAhsData();
          this.calculateRabItemsSubtotal();
        } catch(error) {
          if (error.response) {
            Notify.failure(error.response.data.message);
          }
        }
      },
      async didResetButtonClicked({ rabId, rabHeaderId, rabRowItemId }) {
        const rabItemIndex = this.rabItems.findIndex((rabItem) => rabItem.hashid == rabId);
        
        let mutatedRabItem = null;
        if (rabHeaderId) {
          const rabHeaderIndex = this.rabItems[rabItemIndex].rab_item_header.findIndex(
            (rabItemHeader) => rabItemHeader.hashid == rabHeaderId
          );
          const rabItemRowIndex = this.rabItems[rabItemIndex].rab_item_header[rabHeaderIndex].rab_item.findIndex(
            (rabItem) => rabItem.hashid == rabRowItemId
          );
          this.rabItems[rabItemIndex].rab_item_header[rabHeaderIndex].rab_item[rabItemRowIndex].name = '';
          this.rabItems[rabItemIndex].rab_item_header[rabHeaderIndex].rab_item[rabItemRowIndex].custom_ahs = null;
          this.rabItems[rabItemIndex].rab_item_header[rabHeaderIndex].rab_item[rabItemRowIndex].volume = 0;
          this.rabItems[rabItemIndex].rab_item_header[rabHeaderIndex].rab_item[rabItemRowIndex].price = 0;
          if (this.unitItems[0]) {
            this.rabItems[rabItemIndex].rab_item_header[rabHeaderIndex].rab_item[rabItemRowIndex].hashed_unit_id = this.unitItems[0].hashid;
          }
          mutatedRabItem = this.rabItems[rabItemIndex].rab_item_header[rabHeaderIndex].rab_item[rabItemRowIndex];
        } else {
          const rabItemRowIndex = this.rabItems[rabItemIndex].rab_item.findIndex((rabItem) => rabItem.hashid == rabRowItemId);
          this.rabItems[rabItemIndex].rab_item[rabItemRowIndex].name = '';
          this.rabItems[rabItemIndex].rab_item[rabItemRowIndex].custom_ahs = null;
          this.rabItems[rabItemIndex].rab_item[rabItemRowIndex].volume = 0;
          this.rabItems[rabItemIndex].rab_item[rabItemRowIndex].price = 0;
          if (this.unitItems[0]) {
            this.rabItems[rabItemIndex].rab_item[rabItemRowIndex].hashed_unit_id = this.unitItems[0].hashid;
          }
          mutatedRabItem = this.rabItems[rabItemIndex].rab_item[rabItemRowIndex];
        }
        await this.updateRabItem({
          projectId: this.$route.params.id,
          rabId: rabId,
          rabItemId: rabRowItemId,
          form: {
            name: mutatedRabItem.name,
            custom_ahs_id: mutatedRabItem.custom_ahs,
            volume: mutatedRabItem.volume,
            price: mutatedRabItem.price,
            unit_id: mutatedRabItem.hashed_unit_id
          },
        });
        this.calculateRabItemsSubtotal();
      },
      onTapImportButton() {
        this.$bvModal.show(this.importApendoModalId);
      },
      async didFileSelected(file) {
        this.isImportRabLoading = true;
        try {
          const formData = new FormData();
          formData.append('file', file);
          await this.importApendoRab({
            projectId: this.$route.params.id,
            formData: formData
          });
          this.$bvModal.hide(this.importApendoModalId);
          this.rabItems = null;
          await this.reloadData()
          this.isImportRabLoading = false;
        } catch (error){
          this.isImportRabLoading = false;
          if (error.response?.status == 400) {
            Notify.failure(error.response.data.message);
            return
          }
          this.checkForInvalidResponse(error);
        }
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
          total: Math.round((percentage / 100) * this.rabsTotal),
        };
      },
      rabsTotal() {
        const mappedRabs = this.rabItems.map(data => data.subtotal);
        return mappedRabs.length
          ? Math.round(mappedRabs.reduce((acc, curr) => acc + curr))
          : 0;
      },
      rabsSubTotal() {
        return Math.round(this.rabsTotal + this.projectPpn.total);
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
      EditRab,
      AddRab,
      AddRabItemHeader,
      EditRabItemHeader,
      ImportExcelModal,
      PhPencil
    },
  };
</script>

<style>
.rap-sheet {
  position: absolute;
  right: 0;
  width: 400px;
  max-width: 400px;
  background: white;
  box-shadow: -5px 0 5px -5px rgba(0, 0, 0, 0.2);
  padding: 20px;
  transition: transform 0.3s ease-in-out;
}

.rap-parent-view {
  max-width: 400px;
}

.slide-enter-active, .slide-leave-active {
  transition: transform 0.3s ease-in-out;
}
.slide-enter { transform: translateX(100%); }
.slide-leave-to { transform: translateX(100%); }
</style>
