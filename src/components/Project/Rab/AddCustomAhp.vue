<template>
  <b-modal :id="modalId" :ref="modalId" :title="'Tambah AHP'">
    <b-nav class="mb-5 justify-content-center" pills>
      <b-nav-item
        v-for="ahpGroup in ahpGroups"
        :key="ahpGroup.key"
        @click.prevent="switchSource"
        :active="formOptions.currentState === ahpGroup.key"
      >
        AHP Permen PUPR 2016
      </b-nav-item>
      <b-nav-item
        @click.prevent="switchSource"
        :active="formOptions.currentState === 'custom'"
      >
        Custom AHP
      </b-nav-item>
    </b-nav>
    <div
      class="reference-only-form mb-4"
      v-if="formOptions.currentState !== 'custom'"
    >
      <div
        class="labeled-select position-relative d-inline-block"
        style="width: 100%"
      >
        <span class="px-1"> Referensi AHP</span>
        <v-select
          label="id"
          :reduce="(ahp) => `${ahp.id}~${ahp.name}`"
          :options="getAhp"
          v-model="form.selectedReference"
        />
      </div>
    </div>
    <ValidationInput
      class="mb-4"
      label="Kode"
      field-name="code"
      v-model="form.code"
    />
    <ValidationInput
      class="mb-4"
      label="Nama"
      field-name="name"
      v-model="form.name"
    />
    <template slot="modal-footer">
      <b-button @click.prevent="submitForm" variant="primary" class="mr-1">
        {{ $t('modal.save-bt') }}
      </b-button>
      <b-button variant="secondary" @click="hideModal(modalId)">
        {{ $t('modal.cancel-bt') }}
      </b-button>
    </template>
  </b-modal>
</template>

<script>
  import ValidationInput from '@/components/Common/ValidationInput.vue';
  import validationMixin from '@/mixins/validation-mixins';
  import { mapActions, mapGetters } from 'vuex';
  import { Notify } from 'notiflix';
  import { AHPGroupReferences } from '@/constants/enums';

  export default {
    mixins: [validationMixin],
    data: () => ({
      modalId: 'add-custom-ahp-modal',
      form: {
        selectedReference: '',
        code: '',
        name: '',
      },
      formOptions: {
        currentState: AHPGroupReferences.reference2016.key,
      },
      ahpGroups: Object.values(AHPGroupReferences).filter(
        (ahsGroup) => ahsGroup.key === AHPGroupReferences.reference2016.key,
      ),
    }),
    created() {
      this.fetchAhp();
    },
    methods: {
      ...mapActions(['storeCustomAhp', 'fetchAhp']),
      hideModal(refname) {
        this.$refs[refname].hide();
      },
      resetForm() {
        this.form.code = '';
        this.form.name = '';
        this.form.selectedReference = '';
      },
      async submitForm() {
        try {
          this.resetInvalid();
          const { code, name, selectedReference } = this.form;
          const data = await this.storeCustomAhp({
            projectId: this.$route.params.id,
            form: {
              code,
              name,
              selected_reference: selectedReference,
            },
          });
          this.hideModal(this.modalId);
          this.$emit('custom-ahp-added');
          Notify.success('Sukses Membuat AHP Baru');
          this.resetForm();
        } catch (err) {
          this.checkForInvalidResponse(err);
        }
      },
      switchSource() {
        if (this.formOptions.currentState === 'custom') {
          this.formOptions.currentState = AHPGroupReferences.reference2016.key;
        } else {
          this.formOptions.currentState = 'custom';
          this.resetForm();
        }
      },
    },
    computed: {
      ...mapGetters(['getAhp']),
    },
    watch: {
      'form.selectedReference'() {
        if (
          this.formOptions.currentState === AHPGroupReferences.reference2016.key
        ) {
          const [code, name] = this.form.selectedReference.split('~');
          this.form.code = `${code}-copy`;
          this.form.name = name;
        }
      },
    },
    components: {
      ValidationInput,
    },
  };
</script>
