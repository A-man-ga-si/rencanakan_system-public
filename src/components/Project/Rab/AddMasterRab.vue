<template>
  <div class="add-unit">
    <b-modal :id="modalId" :ref="modalId" title="Tambah Kategori">
      <p><span class="font-weight-bold">Nama RAB :</span>
        <span v-if="Object.values(getSelectedRabCategory).length > 0">
          {{ getSelectedRabCategory.name }}
        </span>
        <span class="text-danger blinking-text" v-else>Tidak ada RAB terpilih, tombol simpan dimatikan</span>
      </p>
      <ValidationInput
        :label="'Name'"
        field-name="name"
        @keydown.enter="submit"
        v-model="form.name"
      />
      <template slot="modal-footer">
        <b-button @click.prevent="submit" variant="primary" class="mr-1" :disabled="Object.values(getSelectedRabCategory).length <= 0">
          {{ $t('modal.save-bt') }}
        </b-button>
        <b-button variant="secondary" @click="hideModal(modalId)">
          {{ $t('modal.cancel-bt') }}
        </b-button>
      </template>
    </b-modal>
  </div>
</template>

<script>
  import ValidationInput from '@/components/Common/ValidationInput.vue';
  import validationMixins from '@/mixins/validation-mixins';
  import { mapActions, mapGetters } from 'vuex';
  import { Notify } from 'notiflix';

  export default {
    mixins: [validationMixins],
    data() {
      return {
        modalId: 'add-master-rab',
        form: {
          name: '',
          master_rab_category_id: null,
        },
      };
    },
    computed: {
      ...mapGetters(['getSelectedRabCategory'])
    },
    methods: {
      ...mapActions(['storeMasterRab']),
      async submit() {
        try {
          await this.storeMasterRab({
            form: this.form,
            master_rab_category_id: this.form.master_rab_category_id
          });
          Notify.success('Berhasil Menambah Master RAB baru');
          this.hideModal(this.modalId);
          this.resetForm();
          this.$emit('master-rab-added');
        } catch (err) {
          console.error(err);
          Notify.failure('Gagal menambahkan Master RAB');
        }
      },

      hideModal(refname) {
        this.$refs[refname].hide();
      },

      resetForm() {
        this.form.name = '';
      },
    },
    watch: {
      getSelectedRabCategory() {
        this.form.master_rab_category_id = this.getSelectedRabCategory.id
      }
    },
    components: {
      ValidationInput,
    },
  };
</script>

<style>
@keyframes blink {
  0% { opacity: 1; }
  50% { opacity: 0; }
  100% { opacity: 1; }
}

.blinking-text {
  animation: blink 1s infinite;
}
</style>