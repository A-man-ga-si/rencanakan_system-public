<template>
  <div class="rab-summary-page">
    <div class="mt-5" v-if="isLoading">
      <div class="text-center">
        <Loader class="mt-5" />
        <h2>
          <strong>Memuat Jadwal Pelaksanaan</strong>
        </h2>
      </div>
    </div>
    <div class="mt-4" v-else>
      <b-alert variant="secondary" show class="rounded">
        <div class="d-flex justify-content-between">
          <span class="mt-1"
            ><strong>Durasi proyek</strong> :
            {{ getImplementationDurationSetting }} Minggu</span
          >
          <b-btn size="xs" @click="editProjectDuration">
            <PhLock
              v-if="getCurrentActiveProject.subscription_id != 'professional'"
            />
            <span>Ubah</span></b-btn
          >
        </div>
      </b-alert>
      <div
        class="implementation-schedule"
        v-if="getImplementationDurationSetting"
      >
        <div
          class="subscription-didnt-supported text-center mt-5"
          v-if="getCurrentActiveProject.subscription_id != 'professional'"
        >
          <img
            src="@/assets/img/custom/package.svg"
            alt=""
            width="400"
            class="mb-5"
          />
          <h2>Fitur Dikunci</h2>
          <p>
            Paket anda tidak mendukung untuk fitur jadwal pelaksanaan. Silahkan
            upgrade paket terlebih dahulu
          </p>
        </div>
        <div
          class="subscription-did-supported"
          style="display: flex; flex-direction: column"
          v-else
        >
          <div style="margin-top: 16px; margin-bottom: 16px; margin-left: auto">
            <b-button
              v-if="!isDownloadPdfLoading"
              variant="primary"
              @click.prevent="onClickDownloadButton"
            >
              Unduh PDF
            </b-button>
            <LoaderCircle v-else style="margin: auto 32px;"/>
          </div>

          <ImplementationScheduleItem
            v-for="(rab, idx) in getRabs"
            :key="idx"
            :index="idx"
            :rab-item="rab"
            :ahs-code-list="customAhsIds"
            :unit-code-list="getUnit"
            :rab-subtotals="rabSubtotals"
            @rab-item-deleted="reloadData"
            @rab-item-added="reloadData"
            @rab-item-updated="reloadData"
            @rab-item-header-deleted="reloadData"
            @edit-rab-item-header-bt-clicked="showEditRabItemHeaderModal"
            @add-rab-item-header-bt-clicked="showAddRabItemHeaderModal"
            @edit-rab-item-bt-clicked="editRab"
            @rab-item-edit="editItemImplementationSchedule"
            @rab-item-delete="reloadData"
          />
          <AddImplementationScheduleItem
            @implementation-schedule-updated="reloadData"
            :weight="selectedRabItem.weight"
            :item-name="selectedRabItem.name"
            :weeks="selectedRabItem.weeks"
            :rab-item-hashid="selectedRabItem.hashid"
          />
        </div>
      </div>
      <div class="implementation-schedule-not-set text-center" v-else>
        <img
          src="@/assets/img/custom/construction.svg"
          alt=""
          width="400"
          class="mb-5"
        />
        <h2>Estimasi Waktu Pelaksanaan Proyek Belum Diatur</h2>
        <p>
          Atur waktu pelaksanaan proyek dalam satuan minggu terlebih dahulu
          untuk menentukan jadwal pelaksanaan proyek anda.
        </p>
        <b-button @click="setImplementationSchedule" class="my-3">
          <PhLock
            v-if="getCurrentActiveProject.subscription_id != 'professional'"
          />
          Atur Sekarang</b-button
        >
      </div>
      <ImplementationScheduleSettingPopup
        @project-duration-updated="reloadData"
        :current-week="getImplementationDurationSetting"
      />
    </div>
  </div>
</template>

<script>
  import { mapActions, mapGetters } from 'vuex';
  import angkaTerbilang from '@develoka/angka-terbilang-js';
  import { formatCurrency, Utils } from '@/utils';
  import Swal from 'sweetalert2';
  import ImplementationScheduleItem from '@/components/Project/Rab/ImplementationScheduleItem.vue';
  import AddImplementationScheduleItem from '@/components/Project/Rab/AddImplementationScheduleItem.vue';
  import ImplementationScheduleSettingPopup from '@/components/Project/Rab/ImplementationScheduleSettingPopup.vue';
  import Loader from '@/components/Common/Loader.vue';
  import { PhLock } from 'phosphor-vue';
  import { LoaderCircle } from '@/components/Common';

  export default {
    data() {
      return {
        reservedWeeks: [],
        selectedRabItem: {
          name: '',
          weight: '',
          weeks: [],
          hashid: '',
        },
        isLoading: true,
        numberOfWeeks: null,
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
        rabSubtotals: 0,
        isDownloadPdfLoading: false,
      };
    },
    mounted() {
      this.$bvModal.show('');
    },
    created() {
      this.fetchRab({
        projectId: this.$route.params.id,
      });
      this.fetchShowProject();
      this.fetchUnit();
      this.getCustomAhsIds();
      this.loadImplementationScheduleDuration();
    },
    methods: {
      ...mapActions([
        'fetchUnit',
        'fetchCustomAhsIds',
        'fetchRab',
        'fetchAhs',
        'showProject',
        'getImplementationScheduleDuration',
        'showProject',
        'downloadSCurve',
      ]),
      async onClickDownloadButton() {
        this.isDownloadPdfLoading = true;
        const response = await this.downloadSCurve({
          projectId: this.$route.params.id,
        });
        Utils.downloadFile(
          `Kurva S - ${this.getCurrentActiveProject.name}.pdf`,
          response.data,
        );
        this.isDownloadPdfLoading = false;
      },
      editItemImplementationSchedule(rabItemData) {
        this.selectedRabItem.name = rabItemData[0].name;
        this.selectedRabItem.weight = rabItemData[1];
        this.selectedRabItem.hashid = rabItemData[0].hashid;
        this.selectedRabItem.weeks =
          rabItemData[0].implementation_schedule || [];
        this.$bvModal.show('add-implementation-schedule-item');
      },
      setImplementationSchedule() {
        if (this.getCurrentActiveProject.subscription_id != 'professional') {
          Swal.fire({
            title: 'Fitur Terkunci',
            text: 'Paket project anda belum termasuk jadwal pelaksanaan. Upgrade paket anda menjadi paket professional untuk menikmati fitur ini',
            icon: 'warning',
          });
        } else {
          this.$bvModal.show('implementation-schedule-setting-popup');
        }
      },
      editProjectDuration() {
        if (this.getCurrentActiveProject.subscription_id != 'professional') {
          Swal.fire({
            title: 'Fitur Terkunci',
            text: 'Paket project anda belum termasuk jadwal pelaksanaan. Upgrade paket anda menjadi paket professional untuk menikmati fitur ini',
            icon: 'warning',
          });
        } else {
          this.$bvModal.show('implementation-schedule-setting-popup');
        }
      },
      async loadImplementationScheduleDuration() {
        try {
          await this.getImplementationScheduleDuration({
            projectId: this.$route.params.id,
          });
        } catch (err) {
        } finally {
          this.isLoading = false;
        }
      },
      async fetchShowProject() {
        this.projectProperties = await this.showProject(this.$route.params.id);
      },
      async getCustomAhsIds() {
        const data = await this.fetchCustomAhsIds({
          projectId: this.$route.params.id,
          q: '',
          limit: null,
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
      ...mapGetters([
        'getRabs',
        'getAhs',
        'getUnit',
        'getImplementationDurationSetting',
        'getCurrentActiveProject',
      ]),
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
        const mappedRabs = this.getRabs.map((data) => data.subtotal);
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
      getRabs() {
        this.rabSubtotals = this.getRabs.length
          ? this.getRabs
              .map((data) => data.subtotal)
              .reduce((acc, curr) => acc + curr)
          : [];
      },
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
      ImplementationScheduleItem,
      AddImplementationScheduleItem,
      ImplementationScheduleSettingPopup,
      Loader,
      LoaderCircle,
      PhLock,
    },
  };
</script>
