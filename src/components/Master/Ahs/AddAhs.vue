<template>
  <b-modal
    :id="modalId"
    :ref="modalId"
    :title="'Tambah AHS'"
    no-close-on-backdrop
    @close="onTapCancelButton(modalId)"
  >
    <div
      class="labeled-select position-relative d-inline-block mb-4"
      :class="{ 'disabled': isSubmitting }"
      style="width: 100%;"
    >
      <span class="px-1"> Group AHS</span>
      <v-select
        :disabled=isSubmitting
        label="name"
        :reduce="ahs => ahs.id"
        :options="ahsGroup"
        v-model="form.groups"
      >
      </v-select>
    </div>
    <ValidationInput
      :disabled=isSubmitting
      class="mb-4"
      label="Kode"
      field-name="id"
      v-model="form.id"
    />
    <ValidationInput
      :disabled=isSubmitting
      class="mb-4"
      label="Nama"
      field-name="name"
      v-model="form.name"
    />
    <template slot="modal-footer">
      <b-button
        :disabled=!isFormFilled
        :style="buttonStyle"
        @click.prevent="onTapSaveButton"
        variant="primary"
        class="mr-1"
      >
        <LoaderCircle v-show="isSubmitting"/>
        <span v-show="!isSubmitting">
          {{ $t('modal.save-bt') }}
        </span>
      </b-button>
      <b-button
        :style="buttonStyle"
        variant="secondary"
        @click="onTapCancelButton(modalId)"
      >
        {{ $t('modal.cancel-bt') }}
      </b-button>
    </template>
  </b-modal>
</template>

<script>
  import ValidationInput from '@/components/Common/ValidationInput.vue';
  import validationMixin from '@/mixins/validation-mixins';
  import { mapActions } from 'vuex';
  import { Notify } from 'notiflix';
  import LoaderCircle from '@/components/Common/LoaderCircle.vue';

  export default {
    mixins: [validationMixin],
    data: () => ({
      modalId: 'add-ahs-modal',
      isSubmitting: false,
      buttonStyle: {
        height: '42px', width: '100px'
      },
      form: {
        id: '',
        name: '',
        groups: '',
      },
      ahsGroup: [
        {
          id: 'reference',
          name: 'AHS Permen PUPR 2016'
        },
        {
          id: 'reference-2023',
          name: 'AHS Permen PUPR 2023'
        },
      ]
    }),
    computed: {
      isFormFilled() {
        return this.form.groups != ''
          && this.form.name != ''
          && this.form.id != ''
      }
    },
    methods: {
      ...mapActions(['storeAhs']),
      onTapCancelButton(refname) {
        this.resetForm();
        this.$refs[refname].hide();
      },
      async onTapSaveButton() {
        if (this.isSubmitting) { return; }
        this.isSubmitting = true;
        try {
          this.resetInvalid();
          await this.storeAhs(this.form);
          this.$refs[this.modalId].hide();
          this.$emit('ahs-added');
          Notify.success('Sukses Membuat AHS Baru');
          this.isSubmitting = false;
          this.resetForm();
        } catch (err) {
          this.isSubmitting = false;
          this.checkForInvalidResponse(err);
        }
      },
      resetForm() {
        this.form.groups = '';
        this.form.id = '';
        this.form.name = '';
      }
    },
    components: {
      LoaderCircle,
      ValidationInput,
    },
  };
</script>