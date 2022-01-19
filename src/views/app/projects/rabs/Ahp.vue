<template>
  <div class="ahsp-page mt-5">
    <div class="no-ahs text-center" v-if="!customAhps.length">
      <img
        src="@/assets/img/panel/Empty-amico.svg"
        alt=""
        style="max-width: 350px; width: 100%"
      />
      <div class="empty-word mt-3">
        <h3 class="font-weight-bold">AHP Kosong</h3>
        <p>
          Klik tombol
          <a href="#" @click.prevent="showCustomAhpModal">
            <u> tambah </u>
          </a>
          di pojok kanan bawah untuk membuat AHP pertamamu !
        </p>
      </div>
    </div>
    <div class="ahp-content" v-else>
      <b-row>
        <b-col :lg="6" :xl="3">
          <div class="text-right mb-2 position-relative">
            <label class="form-group has-float-label mb-0">
              <input
                v-model="form.searchQuery"
                type="text"
                class="form-control"
              />
              <span> Search Item </span>
            </label>
            <i
              class="simple-icon-magnifier position-absolute bg-white"
              style="top: 11px; right: 10px"
            />
          </div>
        </b-col>
      </b-row>
      <AhpItem
        v-for="(customAhp, idx) in customAhps"
        :custom-ahp="customAhp"
        :units="getUnit"
        :key="idx"
        @custom-ahp-item-edit-clicked="showEditCustomAhpModal"
        @custom-ahp-deleted="reloadData"
        @custom-ahp-item-changed="reloadData"
      />
    </div>
    <AddCustomAhp @custom-ahp-added="reloadData" />
    <EditCustomAhp
      :edited-custom-ahp="editedCustomAhp"
      @custom-ahp-updated="reloadData"
    />
    <FloatingActionButton @click="showCustomAhpModal" />
  </div>
</template>

<script>
  import { mapActions, mapGetters } from 'vuex';
  import AhpItem from '../../../../components/Project/Rab/AhpItem.vue';
  import AddCustomAhp from './../../../../components/Project/Rab/AddCustomAhp.vue';
  import EditCustomAhp from './../../../../components/Project/Rab/EditCustomAhp.vue';
  import FloatingActionButton from '../../../../components/Project/FloatingActionButton.vue';

  export default {
    created() {
      this.getCustomAhp();
    },
    data() {
      return {
        form: {
          searchQuery: '',
        },
        customAhps: [],
        editedCustomAhp: {},
        searchCountdownObject: null,
      };
    },
    methods: {
      ...mapActions(['fetchCustomAhp', 'queryCustomAhp']),
      async getCustomAhp() {
        const data = await this.fetchCustomAhp(this.$route.params.id);
        this.customAhps = data.data.data.customAhps;
      },
      showCustomAhpModal() {
        this.$bvModal.show('add-custom-ahp-modal');
      },
      reloadData() {
        this.getCustomAhp();
      },
      showEditCustomAhpModal(e) {
        this.editedCustomAhp = e;
        this.$bvModal.show('update-custom-ahp-modal');
      },
    },
    computed: {
      ...mapGetters(['getUnit']),
    },
    components: {
      AhpItem,
      FloatingActionButton,
      AddCustomAhp,
      EditCustomAhp,
    },
    watch: {
      form: {
        handler() {
          if (this.searchCountdownObject != 'null') {
            clearTimeout(this.searchCountdownObject);
          }

          const that = this;

          if (this.form.searchQuery != '') {
            this.searchCountdownObject = setTimeout(async function () {
              const data = await that.queryCustomAhp({
                projectId: that.$route.params.id,
                keyword: that.form.searchQuery,
              });
              that.customAhps = data.data.data.customAhps;
            }, 500);
          } else {
            this.getCustomAhp();
          }
        },
        deep: true,
      },
    },
  };
</script>
