<template>
    <div>
        <SectionLoading
            v-if="materialSummaries === null"
            title="Memuat Ringkasan Bahan"
        />
        <table v-else class="table table-responsive-md shadow-sm w-100">
            <thead>
                <th class="table-header" style="border-top-left-radius: 8px">No.</th>
                <th class="table-header" style="min-width: 200px">Uraian Pekerjaan</th>
                <th class="table-header" style="min-width: 150px">Satuan</th>
                <th class="table-header" style="min-width: 150px">Total Kebutuhan Bahan</th>
                <th class="table-header" style="border-top-right-radius: 8px; min-width: 150px">Total Harga</th>
            </thead>
            <tbody>
                <tr v-for="(materialSummary, index) in materialSummaries" :key="materialSummary.name">
                    <td>{{ index + 1 }}.</td>
                    <td>{{ materialSummary.name }}</td>
                    <td>{{ materialSummary.unit_name }}</td>
                    <td>{{ materialSummary.total_coefficient }}</td>
                    <td>Rp. {{ formatCurrency(materialSummary.total_price) }}</td>
                </tr>
            </tbody>
        </table>
    </div>
</template>

<script>
    import { mapActions } from 'vuex';
    import { formatCurrency } from '@/utils';
    import { SectionLoading } from '@/components/Common';

    export default {
        data() {
            return {
                materialSummaries: null,
            };
        },
        created() {
            this.fetchMaterialSummary();
        },
        methods: {
            ...mapActions(['getMaterialSummary']),
            formatCurrency,
            async fetchMaterialSummary() {
                const respose = await this.getMaterialSummary({
                    projectId: this.$route.params.id,
                });
                this.materialSummaries = respose.data;
            },
        },
        components: {
            SectionLoading,
        },
    };
</script>

<style scoped>
    .table-header {
        background-color: #00365a;
        color: white;
    }
</style>
