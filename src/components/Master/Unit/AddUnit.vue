<template>
  <div class="add-unit">
    <b-modal
      :id="modalId"
      :ref="modalId"
      :title="$t('pages.master.unit.add-unit-bt')"
    >
      <b-form-group
        :label="$t('pages.master.unit.unit-name')"
        class="has-float-label"
      >
        <b-form-input type="text" v-model="form.unitName" />
      </b-form-group>
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
  import { mapActions } from 'vuex';
  import { Notify } from 'notiflix';
  export default {
    data: () => ({
      form: {
        unitName: '',
      },
      modalId: 'add-unit',
    }),
    methods: {
      ...mapActions(['storeUnit']),
      hideModal(refname) {
        this.$refs[refname].hide();
      },
      async submit() {
        const data = await this.storeUnit({
          name: this.form.unitName,
        });
        Notify.success('Berhasil menambah satuan');
        this.hideModal(this.modalId);
      },
    },
  };
</script>
