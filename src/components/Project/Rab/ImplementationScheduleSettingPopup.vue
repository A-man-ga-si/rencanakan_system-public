<template>
    <b-modal
      :id="modalId"
      :ref="modalId"
      title="Setting Jadwal Pelaksanaan Proyek"
      no-close-on-backdrop
    >
    <div class="form-group">
      <label class="form-group has-float-label mb-0 can-invalid">
      <input
        type="number"
        class="form-control"
        v-model="implementationScheduleDuration"
      />
      <span>Durasi implementasi project (Minggu)</span>
    </label>
    </div>
      <template slot="modal-footer">
        <b-button @click.prevent="submit" variant="primary" class="mr-1">
          {{ $t('modal.save-bt') }}
        </b-button>
        <b-button variant="secondary" @click="hideModal(modalId)">
          {{ $t('modal.cancel-bt') }}
        </b-button>
      </template>
    </b-modal>  
</template>

<script>

import { mapActions, mapGetters } from 'vuex'
import { showConfirmAlert } from '@/utils'
import { Notify } from 'notiflix'

export default {
  data() {
    return {
      modalId: 'implementation-schedule-setting-popup',
      implementationScheduleDuration: 8,
    }
  },
  props: ['currentWeek'],
  mounted() {
    this.implementationScheduleDuration = this.currentWeek || 8
  },
  computed: {
    ...mapGetters(['getImplementationDurationSetting']),
  },
  methods: {
    ...mapActions(['updateImplementationScheduleDuration']),
    hideModal(refname) {
      this.$refs[refname].hide();
    },
    async submit() {

      if (this.getImplementationDurationSetting) {
        const { isConfirmed } = await showConfirmAlert({
          title: 'Perhatian!',
          text: 'Anda akan melakukan perubahan pada durasi proyek. Beberapa item yang melebihi durasi timeline proyek akan dihapus. Tindakan ini tidak dapat dibatalkan' 
        })
        if (!isConfirmed) return
      }

      const numberValidation = /^[0-9]+$/

      if (!numberValidation.test(this.implementationScheduleDuration) || this.implementationScheduleDuration <= 0) {
        Notify.failure('Durasi pengerjaan yang diperbolehkan hanya angka dan minimal 1 minggu')
        return
      }
      const data = await this.updateImplementationScheduleDuration({
        projectId: this.$route.params.id,
        implementationScheduleDuration: this.implementationScheduleDuration
      })
      Notify.success(data.message)
      this.$emit('project-duration-updated')
      this.hideModal(this.modalId)
    }
  },
}
</script>