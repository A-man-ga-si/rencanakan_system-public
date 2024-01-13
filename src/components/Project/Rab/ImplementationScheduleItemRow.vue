<template>
  <tr>
    <td>{{ index + 1 }}.</td>
    <td>
      <p class="mb-0">{{ rabItemData.name }}</p>
    </td>
    <td>
      <p class="mb-0">{{ rabItemData.custom_ahs ? rabItemData.custom_ahs.code : '-' }}</p>
    </td>
    <td>
      <p class="mb-0">{{ rabItemData.volume  }}</p>
    </td>
    <td>
      <p class="mb-0">{{ form.unitName ? (form.unitName[0] ? form.unitName[0].name : '-') : '-' }}</p>
    </td>
    <td>{{ jumlahSubtotal }}</td>
    <td>{{ rabsSubtotal ? (jumlahSubtotalUnformatted / rabsSubtotal * 100) : 0 }}</td>
    <td><p class="mb-0">{{ formattedImplementationScheduleWeeks }}</p></td>
    <td>
      <a
        href="#"
        class="text-success action-schedule"
        @click.prevent="scheduleItem"
      >
        <ph-calendar weight="light" :size="16" />
      </a>
    </td>
  </tr>
</template>

<script>
  import { showConfirmAlert } from '@/utils';
  import { mapActions } from 'vuex';
  import { PhX, PhCalendar } from 'phosphor-vue';
  import { formatCurrency } from '@/utils';
  export default {
    data() {
      return {
        form: {
          name: '',
          customAhsId: '',
          volume: '',
          unitId: '',
          unitName: '',
          price: '',
        },
      };
    },
    props: {
      rabsSubtotal: {
        type: Number,
        required: true
      },
      rabItemData: {
        type: Object,
        required: true,
      },
      index: {
        type: Number,
        required: true,
      },
      rab: {
        type: Object,
      },
      customAhsIds: {
        type: Array,
      },
      unitIds: {
        type: Array,
      },
    },
    // mounted() {
    //   console.log(this.rabItemData)
    // },
    methods: {
      ...mapActions(['destroyRabItem', 'updateRabItem']),
      scheduleItem() {
        this.$emit('rab-item-edit', this.rabItemData, this.rabsSubtotal ? (this.jumlahSubtotalUnformatted / this.rabsSubtotal * 100) : 0)
      },
      isAhsReferenced(data) {
        return !!data?.custom_ahs_id;
      },
    },
    computed: {
      formattedImplementationScheduleWeeks() {
        if (this.rabItemData.implementation_schedule.length) {
          return this.rabItemData.implementation_schedule.map(data => `W-${data.start_of_week} s/d W-${data.end_of_week}`).join(' | ')
        } else {
          return '-'
        }
      },
      combinedCustomAhsIds() {
        const combinedCustomAhs = [
          {
            hashid: '',
            name: '-',
            code: '-',
          },
        ].concat(this.customAhsIds || []);
        return combinedCustomAhs;
      },
      jumlahSubtotalUnformatted() {
        return this.isAhsReferenced(this.rabItemData)
            ? this.rabItemData.custom_ahs?.price * this.rabItemData.volume
            : this.rabItemData.price * this.rabItemData.volume
      },
      jumlahSubtotal() {
        return `Rp. ${formatCurrency(
          this.isAhsReferenced(this.rabItemData)
            ? this.rabItemData.custom_ahs?.price * this.rabItemData.volume
            : this.rabItemData.price * this.rabItemData.volume
        )}`;
      },
    },
    watch: {
      $props: {
        handler() {
          this.form.unitName = this.unitIds.filter(d => d.hashid == this.rabItemData?.hashed_unit_id)
          this.form.name = this.rabItemData?.name;
          this.form.customAhsId = this.rabItemData?.custom_ahs
            ? this.rabItemData?.custom_ahs.hashid
            : '';
          this.form.volume = this.rabItemData?.volume;
          this.form.unitId = this.rabItemData?.hashed_unit_id;
          this.form.price = this.rabItemData?.custom_ahs
            ? this.rabItemData?.custom_ahs.price.toFixed(2)
            : this.rabItemData.price;
        },
        deep: true,
      },
    },
    components: {
      PhX,
      PhCalendar
    },
  };
</script>

<style scoped>
  .inline-edit {
    border: none;
    background-color: transparent;
  }

  td {
    vertical-align: middle;
  }
</style>
