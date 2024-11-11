<template>
  <b-modal
    :id="id"
    :title="title"
  >
    <p>{{ subtitle }}</p>
    <template slot="modal-footer">
      <LoaderCircle v-if="isLoading"/>
      <div v-else>
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
      </div>
      <input
        ref="importFileInput"
        type="file"
        class="d-none"
        :accept="fileAccept"
        @change="onChangeImportFileInput"
      />
    </template>
  </b-modal>
</template>

<script>
  import { LoaderCircle } from '@/components/Common';

  export default {
    props: {
      id: { required: true, type: String },
      title: { required: true, type: String },
      subtitle: { required: true, type: String },
      fileAccept:{ required: true, type: String },
      isLoading:{ required: true, type: Boolean, default: true },
      didFileSelected: { required: true, type: Function },
    },
    components: {
      LoaderCircle
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