<template>
  <div class="add-unit">
    <b-modal
      :id="modalId"
      :ref="modalId"
      :title="$t('pages.master.item-price-group.edit-item-price-group')"
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
  import ValidationInput from '../../Common/ValidationInput.vue';
  import validationMixins from '../../../mixins/validation-mixins';
  import { mapActions } from 'vuex';
  import { Notify } from 'notiflix';

  export default {
    mixins: [validationMixins],
    props: ['editedData'],
    data() {
      return {
        modalId: 'edit-item-price-group',
        customItemPriceId: '',
        form: {
          name: '',
        },
      };
    },
    methods: {
      ...mapActions(['updateCustomItemPriceGroup']),
      async submit() {
        try {
          this.updateCustomItemPriceGroup({
            projectId: this.$route.params.id,
            customItemPriceGroupId: this.customItemPriceId,
            form: this.form,
          });
          Notify.success('Berhasil mengupdate kategori harga satuan');
          this.hideModal(this.modalId);
          this.resetForm();
          this.$emit('custom-item-price-group-updated');
        } catch (err) {
          console.error(err);
          Notify.failure('Gagal menambahkan kategori harga satuan');
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
      editedData(e) {
        this.form.name = e.name;
        this.customItemPriceId = e.hashid;
      },
    },
    components: {
      ValidationInput,
    },
  };
</script>
