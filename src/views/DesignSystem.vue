<template>
  <div class="design-system-container">
    <h1 class="main-title">Design System</h1>
    
    <section class="component-section">
      <h2 class="section-title">Search Components</h2>
      
      <div class="component-demo">
        <h3 class="component-title">SearchBar</h3>
        <div class="component-description">
          <p>A reusable search input component with customizable placeholder.</p>
        </div>
        <div class="component-example">
          <SearchBar 
            v-model="searchQuery" 
            placeholder="Search for something..." 
            @search="performSearch"
          />
          <div class="component-result" v-if="hasSearched">
            <p>Search query: "{{ searchQuery }}"</p>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script>
import SearchBar from '@/components/Common/SearchBar.vue'

export default {
  name: 'DesignSystem',
  components: {
    SearchBar
  },
  data() {
    return {
      searchQuery: '',
      hasSearched: false
    }
  },
  methods: {
    performSearch() {
      this.hasSearched = true
      console.log('Searching for:', this.searchQuery)
    }
  }
}
</script>

<style scoped>
  .design-system-container {
    max-width: 1200px;
    margin: 0 auto;
    padding: 40px 20px;
    font-family: 'Roboto', sans-serif;
  }

  .main-title {
    font-size: 32px;
    margin-bottom: 40px;
    padding-bottom: 10px;
    border-bottom: 1px solid #e0e0e0;
  }

  .component-section {
    margin-bottom: 60px;
  }

  .section-title {
    font-size: 24px;
    margin-bottom: 20px;
    padding-bottom: 8px;
    border-bottom: 1px solid #e0e0e0;
  }

  .component-demo {
    margin-bottom: 40px;
    padding: 20px;
    border-radius: 8px;
    background-color: #f9f9f9;
  }

  .component-title {
    font-size: 18px;
    margin-bottom: 10px;
  }

  .component-description {
    margin-bottom: 20px;
    color: #777;
  }

  .component-example {
    padding: 20px;
    background-color: white;
    border-radius: 5px;
    border: 1px solid #e0e0e0;
  }

  .component-result {
    margin-top: 15px;
    padding: 10px;
    background-color: #f0f8ff;
    border-radius: 4px;
  }
</style>
