<template>
  <b-modal :id="modalId" :ref="modalId" title="Buat Harga Satuan Baru">
    <b-form-group label="Kelompok Harga Satuan" class="has-float-label">
      <v-select label="name" :reduce="unit => unit.hashid" v-model="form.custom_item_price_group_id" :options="getCustomItemPriceGroups"/>
    </b-form-group>
    <ValidationInput v-model="form.code" class="mb-3" field-name="code" label="Kode" />
    <ValidationInput v-model="form.name" class="mb-3" field-name="name" label="Nama Harga Satuan" />
    <b-form-group label="Satuan" class="has-float-label">
      <v-select label="name" :reduce="unit => unit.hashid" v-model="form.unit_id" :options="getUnit"/>
    </b-form-group>
    <ValidationInput type="number" v-model="form.price" class="mb-3" field-name="code" label="Harga" />
    <template slot="modal-footer">
      <b-button @click.prevent="submit" variant="primary" class="mr-1">
        Simpan
      </b-button>
      <b-button variant="secondary" @click="hideModal(modalId)">
        {{ $t('modal.cancel-bt') }}
      </b-button>
    </template>
  </b-modal>
</template>

<script>

import ValidationInput from '@/components/Common/ValidationInput.vue';
import { mapActions, mapGetters } from 'vuex';
import { Notify } from 'notiflix';;

export default {
  data: () => ({
    form: {
      custom_item_price_group_id: '',
      code: '',
      name: '',
      price: '',
      unit_id: '',
    },
    modalId: 'create-item-price-modal',
  }),
  created() {
    this.fetchCustomItemPriceGroup()
  },
  methods: {
    ...mapActions(['storeCustomItemPrice', 'getCustomItemPriceGroup']),
    async fetchCustomItemPriceGroup() {
      await this.getCustomItemPriceGroup({
        projectId: this.$route.params.id
      })
    },
    hideModal(refname) {
      this.$refs[refname].hide();
    },
    async submit() {
      try {
        if (this.form.custom_item_price_group_id == '' || this.form.code == '' || this.form.name == '' || this.form.price == '' || this.form.unit_id == '') {
          Notify.failure('Form harus terisi semua!')
        } else {
          const projectId = this.$route.params.id
          this.form.project_id = projectId
          this.form.unique_check = true
          await this.storeCustomItemPrice({
            projectId: projectId,
            form: this.form,
          })
          Notify.success('Berhasil menambahkan harga satuan')
          this.hideModal(this.modalId)
          this.resetForm()
          this.$emit('submit')
        }
      } catch (err) {
        Notify.failure(err?.response?.data?.message || 'Gagal menambahkan harga satuan')
      }
    },
    resetForm() {
      this.form = {
        custom_item_price_group_id: '',
        code: '',
        name: '',
        price: '',
        unit_id: ''
      }
    }
  },
  computed: {
    ...mapGetters(['getUnit', 'getCustomItemPriceGroups'])
  },
  components: {
    ValidationInput,
  }
}
</script>