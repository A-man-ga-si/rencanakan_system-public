<template>
  <tr>
    <td>{{ index + 1 }}.</td>
    <td>{{ rabItemData.name }}</td>
    <td>{{ rabItemData.custom_ahs ? rabItemData.custom_ahs.code : '-' }}</td>
    <td>{{ rabItemData.volume }}</td>
    <td>{{ rabItemData.unit.name ?? '-' }}</td>
    <td>{{ jumlahSubtotal }}</td>
    <td>{{ rabItemEffort }}</td>
    <td>{{ formattedImplementationScheduleWeeks }}</td>
    <td>
      <a
        href="#"
        class="text-success action-schedule"
        @click.prevent="scheduleItem"
        title="Tambah jadwal"
      >
        <ph-calendar weight="light" :size="16" />
      </a>
      <a
        href="#"
        class="text-danger action-schedule"
        @click.prevent="deleteSchedule"
        title="Hapus jadwal"
      >
        <ph-trash weight="light" :size="16" />
      </a>
    </td>
  </tr>
</template>

<script>
  import { showConfirmAlert } from '@/utils';
  import { mapActions } from 'vuex';
  import { PhX, PhCalendar, PhTrash } from 'phosphor-vue';
  import { formatCurrency } from '@/utils';
  import { Notify } from 'notiflix';

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
      rabTotalCalculation: {
        type: Number,
        required: true,
      },
      rabItemData: {
        type: Object,
        required: true,
      },
      index: {
        type: Number,
        required: true,
      },
    },
    methods: {
      ...mapActions([
        'destroyRabItem',
        'updateRabItem',
        'deleteImplementationSchedule',
      ]),
      scheduleItem() {
        this.$emit(
          'rab-item-edit',
          this.rabItemData,
          this.rabItemEffort
        );
      },
      isAhsReferenced(data) {
        return !!data?.custom_ahs_id;
      },
      async deleteSchedule() {
        const { isConfirmed } = await showConfirmAlert({
          title: 'Hapus jadwal pelaksanaan?',
          text: 'Semua jadwal pelaksanaan pada item ini akan dihapus',
        });
        if (isConfirmed) {
          const data = await this.deleteImplementationSchedule({
            rabItemId: this.rabItemData.hashid,
            projectId: this.$route.params.id,
          });
          Notify.success(data.message);
          this.$emit('rab-item-delete');
        }
      },
    },
    computed: {
      formattedImplementationScheduleWeeks() {
        if (this.rabItemData.implementation_schedule.length) {
          return this.rabItemData.implementation_schedule
            .map((data) => `W-${data.start_of_week} s/d W-${data.end_of_week}`)
            .join(' | ');
        } else {
          return '-';
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
      rabItemEffort() {
        const effortCalculation =
          (this.jumlahSubtotalUnformatted / this.rabTotalCalculation) * 100;
        return parseFloat(effortCalculation).toFixed(2);
      },
      jumlahSubtotalUnformatted() {
        return this.isAhsReferenced(this.rabItemData)
          ? this.rabItemData.custom_ahs?.price * this.rabItemData.volume
          : this.rabItemData.price * this.rabItemData.volume;
      },
      jumlahSubtotal() {
        return `Rp. ${formatCurrency(
          this.isAhsReferenced(this.rabItemData)
            ? this.rabItemData.custom_ahs?.price * this.rabItemData.volume
            : this.rabItemData.price * this.rabItemData.volume,
        )}`;
      },
    },
    watch: {
      $props: {
        handler() {
          this.form.unitName = this.unitIds.filter(
            (d) => d.hashid == this.rabItemData?.hashed_unit_id,
          );
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
      PhCalendar,
      PhTrash,
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
