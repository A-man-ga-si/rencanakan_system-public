<template>
  <b-modal
    :id="modalId"
    :ref="modalId"
    title="Fitur Paket Premium"
  >
    <p><b>Ekspor RAB</b> adalah fitur premium. Upgrade paketmu sekarang dan dapatkan akses ke fitur ini.</p>
    <template slot="modal-footer">
      <b-button
        variant="outline-secondary"
        @click="onClickMaybeLaterButton(modalId)"
      >
        Mungkin Nanti
      </b-button>
      <b-button
        class="mr-1"
        variant="primary"
        @click.prevent="onClickUpgradeButton"
      >
        Upgrade Sekarang
      </b-button>
    </template>
  </b-modal>
</template>

<script>
  export default {
    data: () => ({
      modalId: "export-rab-restriction"
    }),
    methods: {
      onClickMaybeLaterButton(refname) {
        this.$refs[refname].hide();
      },
      onClickUpgradeButton() {
        this.$refs[this.modalId].hide();
        this.$emit('on-click-upgrade-button');
      }
    }
  }
</script>