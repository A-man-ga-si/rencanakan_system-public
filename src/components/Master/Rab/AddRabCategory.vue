<template>
  <div class="add-unit">
    <b-modal :id="modalId" :ref="modalId" title="RAB" :no-close-on-backdrop="true">
      <b-nav class="mb-5 justify-content-center" pills>
        <b-nav-item
          @click.prevent="switchRABMode('existing')"
          :active="formOptions.currentState === 'existing'"
        >
          Existing RAB
        </b-nav-item>
        <b-nav-item
          @click.prevent="switchRABMode('new')"
          :active="formOptions.currentState === 'new'"
        >
          Buat RAB Baru
        </b-nav-item>
      </b-nav>
      <ValidationInput
        v-if="formOptions.currentState == 'new'"
        :label="'Name'"
        field-name="name"
        @keydown.enter="submit"
        v-model="form.name"
      />
      <div
        class="reference-only-form mb-4"
        v-if="formOptions.currentState === 'existing'"
      >
      <div class="d-flex justify-content-between">
        <div
            class="labeled-select position-relative d-inline-block"
            style="width: 100%"
          >
            <span class="px-1">RAB</span>
            <v-select
              label="name"
              :reduce="rab => rab.id"
              :options="getRabCategories"
              v-model="form.selectedRabCategory"
            >
            </v-select>
        </div>
        <a href="#" class="mt-2 ml-2" @click.prevent="deleteMasterRabCategory"><ph-x class="text-danger" weight="light" :size="16" /></a>
      </div>
      </div>
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
  import { mapActions, mapGetters } from 'vuex';
  import { PhX } from 'phosphor-vue';
  import { Notify } from 'notiflix';
  import { showConfirmAlert } from '@/utils';

  export default {
    data() {
      return {
        modalId: 'add-rab-category-modal',
        form: {
          name: '',
          selectedRabCategory: '',
        },
        formOptions: {
          currentState: 'existing'
        }
      };
    },
    created() {
      this.getMasterRabCategory()
    },
    computed: {
      ...mapGetters(['getRabCategories']),
    },
    methods: {
      ...mapActions(['getMasterRabCategory', 'storeMasterRabCategory', 'showMasterRabCategory', 'destroyMasterRabCategory']),
      async submit() {
        if (this.formOptions.currentState == 'existing') {
          await this.showMasterRabCategory(this.form.selectedRabCategory)
          this.$emit('master-rab-category-changed', this.form.selectedRabCategory)
          this.hideModal(this.modalId)
        } else {
          await this.storeMasterRabCategory({
            masterRabCategoryName: this.form.name,
          })
          await this.getMasterRabCategory()
          this.form.name = ''
          Notify.success('Berhasil menambahkan RAB baru')
        }
      },
      async deleteMasterRabCategory() {
        const { isConfirmed } = await showConfirmAlert({
          title: 'Hapus RAB?',
          text: 'Semua kategori yang berhubungan dengan RAB ini akan dihapus! Tindakan ini tidak dapat dibatalkan',
        });
        if (isConfirmed) {
          await this.destroyMasterRabCategory({
            masterRabCategoryId: this.form.selectedRabCategory
          })
          this.form.selectedRabCategory = ''
          await this.getMasterRabCategory()
        }
      },
      hideModal(refname) {
        this.$refs[refname].hide();
      },
      switchRABMode(rabMode) {
        this.formOptions.currentState = rabMode
      },
    },
    watch: {
    },
    components: {
      ValidationInput,
      PhX,
    },
  };
</script>
