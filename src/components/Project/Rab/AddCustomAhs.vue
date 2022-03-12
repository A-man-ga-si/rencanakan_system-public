<template>
  <div class="add-unit">
    <b-modal
      :id="modalId"
      :ref="modalId"
      title="Buat AHS Baru"
      no-close-on-backdrop
    >
      <b-nav class="mb-5 justify-content-center" pills>
        <b-nav-item
          @click.prevent="switchSource"
          :active="formOptions.currentState === 'reference'"
        >
          AHS Permen PUPR 2016
        </b-nav-item>
        <b-nav-item
          @click.prevent="switchSource"
          :active="formOptions.currentState === 'custom'"
        >
          Custom AHS
        </b-nav-item>
      </b-nav>
      <div
        class="reference-only-form mb-4"
        v-if="formOptions.currentState === 'reference'"
      >
        <div
          class="labeled-select position-relative d-inline-block"
          style="width: 100%"
        >
          <span class="px-1"> Referensi AHS</span>
          <v-select
            label="id_name"
            :reduce="ahs => `${ahs.id}<<#>>${ahs.name}`"
            :options="getAhsIds"
            v-model="form.selectedReference"
          >
          </v-select>
        </div>
      </div>
      <ValidationInput
        :label="'Kode'"
        field-name="code"
        v-model="form.code"
        class="mb-4"
      />
      <ValidationInput
        :label="'Name'"
        field-name="name"
        v-model="form.name"
        class="mb-4"
      />
      <template slot="modal-footer">
        <b-button @click.prevent="submit" variant="primary" class="mr-1">
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
        modalId: 'add-custom-ahs',
        formOptions: {
          currentState: 'reference',
        },
        form: {
          name: '',
          code: '',
          selectedReference: '',
        },
      };
    },
    created() {
      this.requestAhsIds();
    },
    methods: {
      ...mapActions(['storeCustomAhs', 'fetchAhsIds']),
      async submit() {
        try {
          const { name, code, selectedReference } = this.form;
          await this.storeCustomAhs({
            projectId: this.$route.params.id,
            form: {
              name,
              code:
                selectedReference == 'reference'
                  ? code.split('<<#>>')[0]
                  : code,
              selected_reference: selectedReference.split('<<#>>')[0],
            },
          });
          Notify.success('Berhasil menambahkan AHS');
          this.hideModal(this.modalId);
          this.resetForm();
          this.$emit('custom-ahs-added');
        } catch (err) {
          if (err.response.status == 422) {
            if (err.response.data.errors.code) {
              Notify.failure(err.response.data.errors.code[0]);
            }
          } else {
            Notify.failure('Gagal menambahkan AHS');
          }
        }
      },
      async requestAhsIds() {
        const data = await this.fetchAhsIds();
      },
      hideModal(refname) {
        this.$refs[refname].hide();
      },
      resetForm() {
        this.form.name = '';
        this.form.code = '';
        this.form.selectedReference = '';
      },
      switchSource() {
        if (this.formOptions.currentState === 'custom') {
          this.formOptions.currentState = 'reference';
        } else {
          this.formOptions.currentState = 'custom';
          this.resetForm();
        }
      },
    },
    computed: {
      ...mapGetters(['getAhsIds']),
    },
    components: {
      ValidationInput,
    },
    watch: {
      'form.selectedReference'(e) {
        const [code, name] = e.split('<<#>>');
        this.form.code = `${code || ''}`;
        this.form.name = `${name || ''}`;
      },
    },
  };
</script>
