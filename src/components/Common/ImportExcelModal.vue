<template>
  <b-modal
    :id="id"
    :title="$t('modal.import-popup-title')"
  >
    <p>Pastikan format excel yang diupload sama dengan format export dan seluruh data yang diinput sudah benar karena data baru akan menimpa data yang lama</p>
    <template slot="modal-footer">
      <b-button
        class="mr-1"
        variant="primary"
        @click.prevent="onClickUploadButton" 
      >
        Upload
      </b-button>
      <b-button
        class="mr-1"
        variant="outline-primary"
        @click.prevent="onClickCancelButton"
      >
        {{ $t('modal.cancel-bt') }}
      </b-button>
      <input
        ref="importFileInput"
        type="file"
        class="d-none"
        accept=".csv, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel"
        @change="onChangeImportFileInput"
      />
    </template>
  </b-modal>
</template>

<script>
  export default {
    props: {
      id: {
        required: true,
        type: String
      },
      didFileSelected: {
        required: true,
        type: Function
      }
    },
    methods: {
      onClickCancelButton() {
        this.$bvModal.hide(this.id);
      },
      onClickUploadButton() {
        this.$refs.importFileInput.click();
      },
      onChangeImportFileInput(event) {
        this.didFileSelected(event.target.files[0])
      }
    }
  };
</script>