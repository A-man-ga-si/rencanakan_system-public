<template>
    <div class="material-estimator-page">
        <div class="separator my-4" />
        <div v-if="this.currentProject != null">
            <div class="subscription-didnt-supported text-center mt-5" v-if="this.currentProject.subscription_id != 'professional'">
                <img src="@/assets/img/custom/package.svg" alt="" width="400" class="mb-5" />
                <h2>Fitur Dikunci</h2>
                <p>Paket anda tidak mendukung untuk fitur hitung bahan. Silahkan upgrade paket terlebih dahulu</p>
            </div>
            <div class="rab-summary-page" v-else>
                <div class="empty-view text-center mt-5" v-if="getRabs.length <= 0">
                    <img src="@/assets/img/panel/Empty-amico.svg" alt="" style="max-width: 350px; width: 100%" />
                    <h2 class="mt-4">Belum Ada RAB</h2>
                    <p>Buat RAB (minimal 1 RAB) terlebih dahulu untuk melihat hasil hitung bahan!.</p>
                </div>
                <div class="material-estimator-view" style="display: flex; flex-direction: column" v-else>
                    <div class="d-flex mx-auto mb-4 p-1" style="background: #eceff6; border-radius: 999px">
                        <div
                            :class="{
                                'active': this.selectedSegment == ESTIMATOR_SEGEMENT.DETAILS,
                            }"
                            class="segment"
                            @click="() => onClickSegment(ESTIMATOR_SEGEMENT.DETAILS)"
                        >
                            Detail
                        </div>
                        <div
                            :class="{
                                'active': this.selectedSegment == ESTIMATOR_SEGEMENT.SUMMARY,
                            }"
                            class="segment"
                            @click="() => onClickSegment(ESTIMATOR_SEGEMENT.SUMMARY)"
                        >
                            Ringkasan
                        </div>
                    </div>
                    <div v-if="selectedSegment == ESTIMATOR_SEGEMENT.DETAILS">
                        <EstimatorDetail
                            v-for="(rab, idx) in getRabs"
                            :key="idx"
                            :index="idx"
                            :rab-item="rab"
                            :ahs-code-list="customAhsIds"
                            :unit-code-list="getUnit"
                            @rab-item-deleted="reloadData"
                            @rab-item-added="reloadData"
                            @rab-item-updated="reloadData"
                            @rab-item-header-deleted="reloadData"
                            @edit-rab-item-header-bt-clicked="showEditRabItemHeaderModal"
                            @add-rab-item-header-bt-clicked="showAddRabItemHeaderModal"
                            @edit-rab-item-bt-clicked="editRab"
                        />
                    </div>
                    <EstimatorSummary v-else/>
                </div>
            </div>
        </div>
        <div v-else>
            <div class="text-center">
                <Loader class="mt-5" />
                <h2>
                    <strong>Memuat Data Bahan</strong>
                </h2>
            </div>
        </div>
    </div>
</template>

<script>
    import { EstimatorDetail, EstimatorSummary } from '.';
    import { mapActions, mapGetters } from 'vuex';
    import angkaTerbilang from '@develoka/angka-terbilang-js';
    import { formatCurrency } from '@/utils';
    import { Loader } from '@/components/Common';

    // Constants
    const ESTIMATOR_SEGEMENT = Object.freeze({
        DETAILS: 'DETAILS',
        SUMMARY: 'SUMMARY',
    });

    export default {
        data() {
            return {
                form: {
                    searchQuery: '',
                    searchQueryCategory: 'item',
                },
                searchQueryOptions: [
                    { text: 'Nama Barang', value: 'item' },
                    { text: 'Kategori', value: 'header' },
                ],
                projectProperties: {},
                currentProject: null,
                projects: {},
                ahsCodesList: [],
                unitCodesList: [],
                customAhsIds: [],
                rabItemHeaderAdd: {},
                rabItemHeaderEdit: {},
                searchCountdownObject: null,
                editedRabItem: null,
                editedRabItemHeader: null,
                selectedSegment: ESTIMATOR_SEGEMENT.DETAILS,

                // Constants
                ESTIMATOR_SEGEMENT,
            };
        },
        created() {
            this.fetchRab({
                projectId: this.$route.params.id,
            });
            this.fetchShowProject();
            this.fetchUnit();
            this.getCustomAhsIds();
        },
        methods: {
            ...mapActions(['fetchUnit', 'fetchCustomAhsIds', 'fetchRab', 'fetchAhs', 'showProject']),
            async fetchShowProject() {
                const response = await this.showProject(this.$route.params.id);
                this.currentProject = response.data.data.project;
            },
            async getCustomAhsIds() {
                const data = await this.fetchCustomAhsIds({
                    projectId: this.$route.params.id,
                    q: '',
                    limit: null,
                });
                this.customAhsIds = data.data.data.ahsItemIds;
            },
            showEditRabItemHeaderModal(rabItem, rabItemHeader) {
                this.rabItemHeaderEdit = rabItem;
                this.editedRabItemHeader = rabItemHeader;
                this.$bvModal.show('edit-rab-item-header');
            },
            showAddRabItemHeaderModal(rabItem) {
                this.rabItemHeaderAdd = rabItem;
                this.$bvModal.show('add-rab-item-header');
            },
            fabClick(ref) {
                this.$bvModal.show('add-rab');
            },
            reloadData() {
                this.fetchRab({
                    projectId: this.$route.params.id,
                });
            },
            numberFormat(number) {
                return formatCurrency(number);
            },
            editRab(rabItem) {
                this.editedRabItem = rabItem;
                this.$bvModal.show('edit-rab');
            },
            onClickSegment(segment) {
                this.selectedSegment = segment;
            }
        },
        computed: {
            ...mapGetters(['getRabs', 'getAhs', 'getProjects', 'getUnit']),
            projectPpn() {
                const percentage = this.projectProperties.data ? this.projectProperties.data.data.project.ppn : 0;
                return {
                    percentage,
                    total: parseInt((percentage / 100) * this.rabsTotal),
                };
            },
            rabsTotal() {
                const mappedRabs = this.getRabs.map((data) => data.subtotal);
                return mappedRabs.length ? parseInt(mappedRabs.reduce((acc, curr) => acc + curr)) : 0;
            },
            rabsSubTotal() {
                return parseInt(this.rabsTotal + this.projectPpn.total);
            },
            convertAlphabeuticalNum() {
                return angkaTerbilang(this.rabsSubTotal).toUpperCase();
            },
            isFeatureRestricted() {
                if (this.currentProject == null) {
                    return true;
                }
                this.currentProject.subscription_id != 'professional';
            },
        },
        watch: {
            form: {
                async handler() {
                    if (this.searchCountdownObject != 'null') {
                        clearTimeout(this.searchCountdownObject);
                    }

                    const that = this;

                    if (this.form.searchQuery != '') {
                        this.searchCountdownObject = setTimeout(async function () {
                            await that.fetchRab({
                                projectId: that.$route.params.id,
                                query: that.form.searchQuery,
                                queryCategory: that.form.searchQueryCategory,
                            });
                        }, 500);
                    } else {
                        this.fetchCustomItemPrices(this.$route.params.id);
                    }
                },
                deep: true,
            },
        },
        components: {
            EstimatorDetail,
            EstimatorSummary,
            Loader,
        },
    };
</script>

<style scoped>
    .segment {
        border-radius: 999px;
        cursor: pointer;
        padding: 0.5rem 3rem;
    }

    .segment.active {
        background-color: #00365a;
        color: white; 
    }
</style>
