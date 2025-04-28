<template>
  <div class="advanced-filter d-flex">
    <DropdownSelect
      v-model="selectedKeahlian"
      :options="keahlianOptions"
      :placeholder="$t('filter.keahlian')"
      custom-class="filter-dropdown mr-2"
    />
    <DropdownSelect
      v-model="selectedLocation"
      :options="locationOptions"
      :placeholder="$t('filter.lokasi')"
      custom-class="filter-dropdown mr-2"
    />
    <DropdownSelect
      v-model="selectedPrice"
      :options="priceOptions"
      :placeholder="$t('filter.harga')"
      custom-class="filter-dropdown"
    />
  </div>
</template>

<script>
import DropdownSelect from '@/components/Common/DropdownSelect.vue';
import { hargaJasa, locations, skills } from '@/constants/filterData';

export default {
  name: 'AdvancedFilter',
  components: {
    DropdownSelect
  },
  data() {
    return {
      selectedKeahlian: '',
      selectedLocation: '',
      selectedPrice: '',
      keahlianType: 'operator', // Default to operator type
      experienceLevel: '< 1 Tahun', // Default experience level
    };
  },
  computed: {
    keahlianOptions() {
      return skills.map(skill => skill.label);
    },
    locationOptions() {
      return locations.map(location => location.label);
    },
    priceOptions() {
      const priceRanges = [];
      
      // Create price range options based on all possible combinations
      Object.keys(hargaJasa).forEach(type => {
        Object.keys(hargaJasa[type]).forEach(exp => {
          const { min, max } = hargaJasa[type][exp];
          const formattedMin = this.formatCurrency(min);
          const formattedMax = this.formatCurrency(max);
          const priceRange = `${formattedMin} - ${formattedMax}`;
          
          if (!priceRanges.includes(priceRange)) {
            priceRanges.push(priceRange);
          }
        });
      });
      
      // Sort price ranges by the minimum value
      return priceRanges.sort((a, b) => {
        const minA = parseInt(a.split(' - ')[0].replace(/\D/g, ''));
        const minB = parseInt(b.split(' - ')[0].replace(/\D/g, ''));
        return minA - minB;
      });
    }
  },
  methods: {
    formatCurrency(value) {
      return new Intl.NumberFormat('id-ID', {
        style: 'currency',
        currency: 'IDR',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0
      }).format(value);
    },
    applyFilter() {
      // This method would emit an event with the selected filter values
      // that parent components can listen to
      this.$emit('filter-applied', {
        keahlian: this.selectedKeahlian,
        location: this.selectedLocation,
        price: this.selectedPrice
      });
    }
  },
  watch: {
    selectedKeahlian() {
      this.applyFilter();
    },
    selectedLocation() {
      this.applyFilter();
    },
    selectedPrice() {
      this.applyFilter();
    }
  }
};
</script>

<style scoped>
.advanced-filter {
  flex-wrap: wrap;
}

.filter-dropdown {
  min-width: 150px;
}

@media (max-width: 768px) {
  .advanced-filter {
    flex-direction: column;
    width: 100%;
  }
  
  .filter-dropdown {
    width: 100%;
    margin-right: 0 !important;
    margin-bottom: 0.5rem;
  }
}
</style>