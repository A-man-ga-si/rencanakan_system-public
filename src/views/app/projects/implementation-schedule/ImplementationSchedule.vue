<template>
  <div>
    <!-- PROJECT DURATION SECTION -->
    <b-alert
      variant="secondary"
      show
      class="rounded"
      style="margin: 1.5rem 0px"
    >
      <div class="d-flex justify-content-between">
        <span class="mt-1">
          <strong>Durasi proyek</strong>: {{ implementationDuration }} Minggu
        </span>
        <b-btn size="xs" @click="onClickChangeProjectDuration">
          <PhLock v-show="currentProject?.subscription_id != 'professional'" />
          <span>Ubah</span>
        </b-btn>
      </div>
    </b-alert>

    <!-- HEADER ACTIONS -->
    <div class="d-flex justify-content-between" style="margin-bottom: 24px">
      <!-- SEGMENTED CONTROL -->
      <div class="d-flex p-1" style="background: #eceff6; border-radius: 999px">
        <div
          class="segment"
          :class="{
            active: this.selectedSegment == SCHEDULE_SEGMENT.TABLE,
          }"
          @click="() => onClickSegment(SCHEDULE_SEGMENT.TABLE)"
        >
          Tabel
        </div>
        <div
          class="segment"
          :class="{
            active: this.selectedSegment == SCHEDULE_SEGMENT.SCURVE,
          }"
          @click="() => onClickSegment(SCHEDULE_SEGMENT.SCURVE)"
        >
          Kurva S
        </div>
      </div>

      <!-- S-CURVE DOWNLOAD BUTTON -->
      <div style="margin: auto 0px">
        <b-button
          v-if="!isDownloadPdfLoading"
          variant="primary"
          @click.prevent="onClickDownloadButton"
        >
          Unduh Kurva S
        </b-button>
        <LoaderCircle v-else style="margin: 0px 32px" />
      </div>
    </div>

    <!-- IMPLEMENTATION SCHEDULE TABLE -->
    <div v-if="selectedSegment == SCHEDULE_SEGMENT.TABLE">
      <SectionLoading v-if="rabs == null" title="Memuat Table Jadwal" />
      <div v-else>
        <ImplementationScheduleItem
          v-for="(rab, index) in rabs"
          :key="index"
          :index="index"
          :rab-item="rab"
          @rab-item-edit="onClickEditScheduleItem"
          @rab-item-delete="reloadData"
        />
      </div>
    </div>

    <!-- IMPLEMENTATION S-CURVE -->
    <div class="d-flex" v-else>
      <SectionLoading
        v-if="sCurveImage == null"
        title="Memuat Kurva S"
        style="margin: 0px auto"
      />
      <img v-else id="scurve-image" alt="S Curve" :src="sCurveImage" />
    </div>

    <!-- UPDATE DURATION FORM POPUP -->
    <ImplementationScheduleSettingPopup
      @project-duration-updated="reloadData"
      :current-week="implementationDuration"
    />

    <!-- RAB SCHEDULE ITEM UPDATE FORM POPUP -->
    <AddImplementationScheduleItem
      :schedule-item="selectedScheduleItem"
      @implementation-schedule-updated="reloadData"
    />
  </div>
</template>

<script>
  import { mapActions } from 'vuex';
  import { PhLock } from 'phosphor-vue';
  import Swal from 'sweetalert2';
  import { Utils } from '@/utils';
  import { LoaderCircle, SectionLoading } from '@/components/Common';
  import ImplementationScheduleSettingPopup from '@/components/Project/Rab/ImplementationScheduleSettingPopup.vue';
  import ImplementationScheduleItem from '@/components/Project/Rab/ImplementationScheduleItem.vue';
  import AddImplementationScheduleItem from '@/components/Project/Rab/AddImplementationScheduleItem.vue';

  const SCHEDULE_SEGMENT = Object.freeze({
    TABLE: 'TABLE',
    SCURVE: 'SCURVE',
  });

  export default {
    data() {
      return {
        currentProject: null,
        implementationDuration: null,
        selectedSegment: SCHEDULE_SEGMENT.TABLE,
        isDownloadPdfLoading: false,
        rabs: null,
        sCurveImage: null,
        selectedScheduleItem: null,

        SCHEDULE_SEGMENT,
      };
    },
    created() {
      this.reloadData();
    },
    methods: {
      ...mapActions([
        'showProject',
        'getImplementationScheduleDuration',
        'downloadSCurve',
        'fetchRab',
        'showSCurve',
      ]),

      reloadData() {
        this.rabs = null;

        this.getCurrentProject();
        this.getImplementationDuration();
        this.getAllRabs();
      },

      // API Request Functions
      async getCurrentProject() {
        const response = await this.showProject(this.$route.params.id);
        this.currentProject = response.data.data.project;
      },
      async getImplementationDuration() {
        const response = await this.getImplementationScheduleDuration({
          projectId: this.$route.params.id,
        });
        this.implementationDuration = response.projectDuration;
      },
      async getAllRabs() {
        const response = await this.fetchRab({
          projectId: this.$route.params.id,
        });
        this.rabs = response.data.data.rabs;
      },
      async getSCurve() {
        const blob = await this.showSCurve({
          projectId: this.$route.params.id,
        });
        this.sCurveImage = URL.createObjectURL(blob.data);
      },

      // Action Functions
      onClickSegment(segment) {
        this.selectedSegment = segment;
        if (segment == SCHEDULE_SEGMENT.SCURVE) {
          this.sCurveImage = null;
          this.getSCurve();
        }
      },
      onClickChangeProjectDuration() {
        if (this.currentProject.subscription_id == 'professional') {
          this.$bvModal.show('implementation-schedule-setting-popup');
          return;
        }
        Swal.fire({
          title: 'Fitur Terkunci',
          text: 'Paket project anda belum termasuk jadwal pelaksanaan. Upgrade paket anda menjadi paket professional untuk menikmati fitur ini',
          icon: 'warning',
        });
      },
      async onClickDownloadButton() {
        this.isDownloadPdfLoading = true;
        const response = await this.downloadSCurve({
          projectId: this.$route.params.id,
        });
        Utils.downloadFile(
          `Kurva S - ${this.currentProject.name}.pdf`,
          response.data,
        );
        this.isDownloadPdfLoading = false;
      },
      onClickEditScheduleItem(scheduleItem) {
        this.selectedScheduleItem = {
          rab: scheduleItem[0],
          effortCalculcation: scheduleItem[1],
        };
        this.$nextTick(() => {
          this.$bvModal.show('add-implementation-schedule-item');
        });
      },
    },
    components: {
      LoaderCircle,
      SectionLoading,
      PhLock,
      ImplementationScheduleSettingPopup,
      ImplementationScheduleItem,
      AddImplementationScheduleItem,
    },
  };
</script>

<style scoped>
  .segment {
    border-radius: 999px;
    cursor: pointer;
    padding: 0.5rem 3rem;
  }

  .segment.active {
    background-color: #00365a;
    color: white;
  }

  #scurve-image {
    width: 100%;
    margin: 0px auto;
  }

  @media (min-width: 1536px) {
    #scurve-image {
      width: 50%;
    }
  }
</style>
