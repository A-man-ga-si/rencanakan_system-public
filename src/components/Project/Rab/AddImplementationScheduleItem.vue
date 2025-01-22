<template>
  <b-modal
    :id="modalId"
    :ref="modalId"
    title="Atur Jadwal Pelaksanaan"
    no-close-on-backdrop
  >
    <div class="form-group">
      <label class="font-weight-bold">Nama Pekerjaan</label>
      <p class="text-disabled">{{ scheduleItem.rab.name }}</p>
    </div>
    <div class="form-group">
      <label class="font-weight-bold">Bobot</label>
      <p class="text-disabled">{{ scheduleItem.effortCalculcation }} %</p>
    </div>
    <div class="implementation-range-group">
      <p class="font-weight-bold text-center w-100">Range Pengerjaan</p>
      <div
        class="implementation-range-input-group"
        v-for="(weekData, i) in weeksChoice"
        :key="i"
      >
        <div class="row">
          <div :class="{ 'col-md-6': i >= 1, col: i < 1 }">
            <b-form-group label="Minggu dimulai" class="has-float-label">
              <v-select
                label="label"
                v-model="weekData.start"
                :reduce="(week) => week.id"
                :options="formattedWeeksDataSelector"
              />
            </b-form-group>
          </div>
          <div :class="{ 'col-md-5': i >= 1, col: i < 1 }">
            <b-form-group label="Minggu selesai" class="has-float-label">
              <v-select
                label="label"
                v-model="weekData.end"
                :reduce="(week) => week.id"
                :options="formattedWeeksDataSelector"
              />
            </b-form-group>
          </div>
          <div v-if="i > 0">
            <a href="#" class="text-danger" @click.prevent="deleteWeek(i)">
              <PhX />
            </a>
          </div>
        </div>
      </div>
      <b-alert
        variant="danger"
        show
        class="rounded"
        size="xs"
        v-if="correctionAlert"
      >
        <PhInfo class="mb-1 mr-1" />
        Terdapat minggu yang saling overlap atau tidak sesuai urutan
      </b-alert>
      <div class="text-center">
        <b-button variant="outline-primary" @click="addRange"
          >+ Tambah Range</b-button
        >
      </div>
    </div>
    <template slot="modal-footer">
      <b-button
        @click.prevent="submit"
        variant="primary"
        class="mr-1"
        :disabled="correctionAlert"
      >
        {{ $t('modal.save-bt') }}
      </b-button>
      <b-button variant="secondary" @click="hideModal(modalId)">
        {{ $t('modal.cancel-bt') }}
      </b-button>
    </template>
  </b-modal>
</template>

<script>
  import { mapGetters, mapActions } from 'vuex';
  import { PhX, PhInfo } from 'phosphor-vue';
  import { Notify } from 'notiflix';

  export default {
    data() {
      return {
        modalId: 'add-implementation-schedule-item',
        correctionAlert: false,
        weeksChoice: [{ start: null, end: null }],
      };
    },
    props: {
      scheduleItem: {
        type: Object,
      },
    },
    methods: {
      ...mapActions(['updateImplementationSchedule']),
      checkForCorrection() {
        let reservedWeeks = [];
        let invalid = false;
        for (const weeksChoice of this.weeksChoice) {
          if (weeksChoice.start && weeksChoice.end) {
            if (
              reservedWeeks.includes(weeksChoice.start) ||
              reservedWeeks.includes(weeksChoice.end) ||
              weeksChoice.end < weeksChoice.start
            ) {
              invalid = true;
            }
            for (let i = weeksChoice.start; i <= weeksChoice.end; i++) {
              reservedWeeks.push(i);
            }
          }
        }
        this.correctionAlert = invalid;
      },
      deleteWeek(index) {
        this.weeksChoice.splice(index, 1);
      },
      hideModal(refname) {
        this.$refs[refname].hide();
      },
      addRange() {
        this.weeksChoice.push({
          start: null,
          end: null,
        });
      },
      resetForm() {
        this.weeksChoice = [{ start: null, end: null }];
        this.correctionAlert = false;
      },
      async submit() {
        const data = await this.updateImplementationSchedule({
          projectId: this.$route.params.id,
          implementationScheduleData: {
            implementation_schedules: this.weeksChoice,
            rab_item_id: this.scheduleItem.rab.hashid,
          },
        });
        Notify.success(data.message);
        this.$emit('implementation-schedule-updated');
        this.hideModal(this.modalId);
        this.resetForm();
      },
    },
    computed: {
      ...mapGetters(['getImplementationDurationSetting']),
      formattedWeeksDataSelector() {
        const weeks = [];
        for (let i = 1; i <= this.getImplementationDurationSetting; i++) {
          weeks.push({
            id: i,
            label: `Week ${i}`,
          });
        }
        return weeks;
      },
    },
    watch: {
      weeksChoice: {
        deep: true,
        handler() {
          this.checkForCorrection();
        },
      },
      scheduleItem(value) {
          const schedules = value.rab.implementation_schedule;
          if (schedules.length) {
            this.weeksChoice = [];
            for (const week of schedules) {
              this.weeksChoice.push({
                start: week.start_of_week,
                end: week.end_of_week,
              });
            }
          } else {
            this.weeksChoice = [{ start: null, end: null }];
          }
      },
    },
    components: {
      PhX,
      PhInfo,
    },
  };
</script>

<style scoped>
  .table-responsive {
    width: 100%;
    overflow: auto;
  }

  .week-columns th {
    min-width: 80px;
  }

  .job-title {
    min-width: 200px;
  }
</style>
