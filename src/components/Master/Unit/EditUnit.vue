<template>
  <div class="add-unit">
    <b-modal
      :id="modalId"
      :ref="modalId"
      :title="$t('pages.master.unit.update-unit-bt')"
    >
      <ValidationInput
        :label="'Name'"
        field-name="name"
        @keydown.enter="submit"
        v-model="form.name"
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
  import validationMixin from './../../../mixins/validation-mixins';
  import ValidationInput from './../../Common/ValidationInput.vue';
  import { mapActions } from 'vuex';
  import { Notify } from 'notiflix';

  export default {
    mixins: [validationMixin],
    props: ['selectedUnit'],
    data() {
      return {
        form: {
          name: '',
        },
        modalId: 'edit-unit',
      };
    },
    methods: {
      ...mapActions(['updateUnit']),
      hideModal(refname) {
        this.$refs[refname].hide();
      },
      async submit() {
        try {
          console.log(this.selectedUnit);
          this.resetInvalid();
          await this.updateUnit({
            id: this.selectedUnit.hashid,
            data: {
              name: this.form.name,
            },
          });
          Notify.success('Berhasil mengupdate satuan');
          this.$emit('unit-updated');
          this.resetForm();
          this.hideModal(this.modalId);
        } catch (err) {
          this.checkForInvalidResponse(err);
        }
      },
      resetForm() {
        for (const formIdx in this.form) {
          this.form[formIdx] = '';
        }
      },
    },
    watch: {
      selectedUnit(ctx) {
        this.form.name = this.selectedUnit.name;
      },
    },
    components: {
      ValidationInput,
    },
  };
</script>
