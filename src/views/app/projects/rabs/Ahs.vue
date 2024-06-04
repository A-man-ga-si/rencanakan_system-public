<template>
  <div class="ahs-page mt-5">
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
          <strong>Memuat AHS</strong>
        </h2>
      </div>
    </div>
    <div class="no-ahs text-center" v-else-if="!customAhs.length">
      <img
        src="@/assets/img/panel/Empty-amico.svg"
        alt=""
        style="max-width: 350px; width: 100%"
      />
      <div class="empty-word mt-3">
        <h3 class="font-weight-bold">AHS Kosong</h3>
        <p>
          Klik tombol
          <a href="#" @click.prevent="toggleAddCustomAhsModal">
            <u> tambah </u>
          </a>
          di pojok kanan bawah untuk membuat AHS pertamamu !
        </p>
      </div>
    </div>
    <div class="show-ahs-content" v-else>
      <div class="ahs-content">
        <AhsItem
          v-for="(cAhs, idx) in customAhs"
          :key="idx"
          :custom-ahs-itemable-list="getCustomAhsItemableIds"
          :custom-ahs-item="cAhs"
          :units-list="getUnit"
          :on-tap-add-row="didAddRowTapped"
          :in-submitting-sections="getInSubmittingSections(cAhs.hashid)"
          @custom-ahs-item-added="reloadData"
          @ahs-item-deleted="reloadData"
          @ahs-item-updated="reloadData"
          @delete-custom-ahs="reloadData"
          @custom-ahs-edit-bt-clicked="toggleEditCustomAhs"
        />
      </div>
      <b-pagination
        class="mx-auto w-100 mt-5"
        style="justify-content: center"
        v-model="currentPage"
        :total-rows="totalRows"
        :per-page="perPage"
      ></b-pagination>
    </div>
    <FloatingActionButton @click="toggleAddCustomAhsModal" />
    <AddCustomAhs @custom-ahs-added="reloadData" />
    <EditCustomAhs
      @custom-ahs-updated="reloadData"
      :edited-custom-ahs="editedCustomAhs"
    />
    <CreateItemPricePopup @submit="onNewItemPriceAdded" />
  </div>
</template>

<script>
  import { mapActions, mapGetters } from 'vuex';
  import AhsItem from '@/components/Project/Rab/AhsItem.vue';
  import AddCustomAhs from '@/components/Project/Rab/AddCustomAhs.vue';
  import EditCustomAhs from '@/components/Project/Rab/EditCustomAhs.vue';
  import FloatingActionButton from '@/components/Project/FloatingActionButton.vue';
  import Loader from '@/components/Common/Loader.vue';
  import CreateItemPricePopup from '@/components/Project/Rab/CreateItemPricePopup.vue';

  export default {
    data() {
      return {
        perPage: 4,
        totalRows: 0,
        currentPage: 1,
        isLoading: true,
        form: {
          searchQuery: '',
          searchQueryCategory: 'item',
        },
        searchQueryOptions: [
          { text: 'Nama Barang', value: 'item' },
          { text: 'Kategori', value: 'header' },
        ],
        customAhs: [],
        editedCustomAhs: {},
        searchCountdownObject: null,
        inSubmittingAhsItems: []
      };
    },
    created() {
      this.fetchCustomAhsItemableIds({
        projectId: this.$route.params.id,
      });
      this.fetchUnit();
    },
    mounted() {
      this.getCustomAhs();
    },
    methods: {
      ...mapActions([
        'fetchCustomAhs',
        'fetchCustomAhsItemableIds',
        'fetchUnit',
        'queryCustomAhs',
        'storeCustomAhsItem'
      ]),
      onNewItemPriceAdded() {
        this.fetchCustomAhsItemableIds({
          projectId: this.$route.params.id,
        });
      },
      async getCustomAhs() {
        const { data } = await this.fetchCustomAhs({
          projectId: this.$route.params.id,
          perPage: this.perPage,
          page: this.currentPage,
        });
        this.totalRows = data.data.pagination_attribute.total_rows;
        this.customAhs = data.data.customAhs;
        if (this.inSubmittingAhsItems.length === 0) {
          this.inSubmittingAhsItems = this.customAhs.map((ahsItem) => {
            return {
              hashId: ahsItem.hashid,
              sections: []
            }
          });
        };

        this.isLoading = false;
      },
      toggleAddCustomAhsModal() {
        this.$bvModal.show('add-custom-ahs');
      },
      toggleEditCustomAhs(customAhsItem) {
        this.editedCustomAhs = customAhsItem;
        this.$bvModal.show('edit-custom-ahs');
      },
      getInSubmittingSections(hashId) {
        const inSubmittingAhsItem = this.inSubmittingAhsItems.find(ahsItem => {
          return ahsItem.hashId == hashId
        });
        if (!inSubmittingAhsItem) {
          return [];
        }
        return inSubmittingAhsItem.sections;
      },
      async didAddRowTapped(hashId, section) {
        const submittingAhsItem = this.inSubmittingAhsItems.find(
          (ahsItem) => ahsItem.hashId == hashId
        );
        if (submittingAhsItem == null) { return;  }
        if (!submittingAhsItem.sections.includes(section)) {
          submittingAhsItem.sections = [
            ...submittingAhsItem.sections,
            section
          ];
        }
        await this.storeCustomAhsItem({
          projectId: this.$route.params.id,
          form: {
            section,
            custom_ahs_id: hashId,
          },
        });
        await this.getCustomAhs();
        submittingAhsItem.sections = submittingAhsItem.sections.filter(
          (submittingSection) => submittingSection != section
        );
      },
      reloadData() {
        // FIXME: Not well optimized but yeah it's work
        this.fetchCustomAhsItemableIds({
          projectId: this.$route.params.id,
        });
        this.getCustomAhs();
      },
    },
    computed: {
      ...mapGetters(['getCustomAhsItemableIds', 'getUnit'])
    },
    watch: {
      currentPage() {
        this.getCustomAhs();
      },
      form: {
        deep: true,
        async handler() {
          if (this.searchCountdownObject != 'null') {
            clearTimeout(this.searchCountdownObject);
          }

          const that = this;

          if (this.form.searchQuery != '') {
            this.searchCountdownObject = setTimeout(async function () {
              const { data } = await that.queryCustomAhs({
                projectId: that.$route.params.id,
                query: that.form.searchQuery,
                category: that.form.searchQueryCategory,
              });
              that.customAhs = data.data;
            }, 500);
          } else {
            this.getCustomAhs();
          }
        },
      },
    },
    components: {
      AhsItem,
      FloatingActionButton,
      AddCustomAhs,
      EditCustomAhs,
      Loader,
      CreateItemPricePopup,
    },
  };
</script>
