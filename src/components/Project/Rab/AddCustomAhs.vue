<template>
  <div class="add-unit">
    <b-modal :id="modalId" :ref="modalId" title="Buat AHS Baru">
      <b-nav class="mb-5 justify-content-center" pills>
        <b-nav-item
          @click.prevent="switchSource"
          :active="formOptions.currentState === 'custom'"
        >
          Kostum
        </b-nav-item>
        <b-nav-item
          @click.prevent="switchSource"
          :active="formOptions.currentState === 'reference'"
        >
          Referensi
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
            label="name"
            :reduce="ahs => ahs.id"
            :options="getAhsIds"
            v-model="form.selectedReference"
          />
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
  import ValidationInput from '../../Common/ValidationInput.vue';
  import validationMixins from '../../../mixins/validation-mixins';
  import { mapActions, mapGetters } from 'vuex';
  import { Notify } from 'notiflix';

  export default {
    mixins: [validationMixins],
    data() {
      return {
        modalId: 'add-custom-ahs',
        formOptions: {
          currentState: 'custom',
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
              code,
              selected_reference: selectedReference,
            },
          });
          Notify.success('Berhasil menambahkan AHS');
          this.hideModal(this.modalId);
          this.resetForm();
          this.$emit('custom-ahs-added');
        } catch (err) {
          console.error(err);
          Notify.failure('Gagal menambahkan kategori harga satuan');
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
        console.log(e);
        this.form.code = `${e}-copy`;
      },
    },
  };
</script>
