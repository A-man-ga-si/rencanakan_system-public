<template>
  <div class="add-unit">
    <b-modal
      :id="modalId"
      :ref="modalId"
      title="Buat AHS Baru"
      no-close-on-backdrop
      size="lg"
      @hidden="onHideModal"
    >
      <b-nav class="mb-5 justify-content-center" pills>
        <!-- PUPR AHS GROUPS -->
        <b-nav-item
          v-for="(ahsGroup, index) in ahsGroups" :key="index"
          @click.prevent="switchSource(ahsGroup)"
          :active="selectedAhsGroup?.key === ahsGroup.key"
        >
          {{ ahsGroup.title }}
        </b-nav-item>

        <!-- CUSTOM AHS GROUP -->
        <b-nav-item
          @click.prevent="switchSource(undefined)"
          :active="selectedAhsGroup === undefined"
        >
          Custom AHS
        </b-nav-item>
      </b-nav>

      <!-- PUPR AHS DROPDOWN INPUT -->
      <div
        v-if="selectedAhsGroup !== undefined"
        class="reference-only-form mb-4"
      >
        <div
          class="labeled-select position-relative d-inline-block"
          style="width: 100%"
        >
          <span class="px-1">{{ selectedAhsGroup.title }}</span>
          <v-select
            label="id_name"
            :reduce="ahs => `${ahs.id}<<#>>${ahs.name}`"
            :options="getMappedAhsIds[selectedAhsGroup.key]"
            v-model="form.selectedReference"
          />
        </div>
      </div>

      <!-- DEFAULT FORM INPUTS -->
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
  import { AHSGroupReferences } from '@/constants/enums';

  export default {
    mixins: [validationMixins],
    props: ['selectedColumn'],
    data() {
      return {
        modalId: 'add-custom-ahs',
        selectedAhsGroup: AHSGroupReferences.reference2024,
        ahsGroups: Object.values(AHSGroupReferences).filter(
          (ahsGroup) => ahsGroup.key !== AHSGroupReferences.ahsProject.key
        ),
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
      ...mapActions(['storeCustomAhs', 'fetchAhs', 'fetchAhsIds']),
      async submit() {
        try {
          const { name, code, selectedReference } = this.form;
          await this.storeCustomAhs({
            projectId: this.$route.params.id,
            form: {
              name,
              code:
                selectedReference == AHSGroupReferences.reference2016.key
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
      async switchSource(ahsGroup) {
        this.selectedAhsGroup = ahsGroup;
        this.resetForm();
      },
      onHideModal() {
        this.$emit('hide');
      }
    },
    computed: {
      ...mapGetters(['getMappedAhsIds', 'getAhs', 'getCurrentActiveProject']),
      ahsOptions() {
        return this.getAhs.map((ahs) => {
          return {
            id: ahs.id,
            name: ahs.name
          }
        })
      }
    },
    components: {
      ValidationInput,
    },
    watch: {
      selectedColumn() {
        this.selectedAhsGroup = this.selectedColumn;
      },
      'form.selectedReference'(e) {
        const [code, name] = e.split('<<#>>');
        this.form.code = `${code || ''}`;
        this.form.name = `${name || ''}`;
      }
    },
  };
</script>