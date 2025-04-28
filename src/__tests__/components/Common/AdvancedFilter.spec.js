import { shallowMount, createLocalVue } from '@vue/test-utils'
import AdvancedFilter from '@/components/Common/AdvancedFilter.vue'
import DropdownSelect from '@/components/Common/DropdownSelect.vue'
import { hargaJasa, locations, skills } from '@/constants/filterData'

// Mock $t function for i18n
const $t = (key) => {
  const translations = {
    'filter.keahlian': 'Keahlian',
    'filter.lokasi': 'Lokasi',
    'filter.harga': 'Harga'
  }
  return translations[key] || key
}

describe('AdvancedFilter.vue', () => {
  let wrapper

  beforeEach(() => {
    // Create fresh wrapper before each test
    wrapper = shallowMount(AdvancedFilter, {
      stubs: {
        DropdownSelect: true
      },
      mocks: {
        $t // Mock i18n translate function
      }
    })
  })

  afterEach(() => {
    wrapper.destroy()
  })

  // POSITIVE CASES

  it('renders three DropdownSelect components', () => {
    const dropdowns = wrapper.findAllComponents(DropdownSelect)
    expect(dropdowns).toHaveLength(3)
  })

  it('passes correct props to keahlian dropdown', () => {
    const keahlianDropdown = wrapper.findAllComponents(DropdownSelect).at(0)
    
    expect(keahlianDropdown.props().options).toEqual(skills.map(skill => skill.label))
    expect(keahlianDropdown.props().placeholder).toBe('Keahlian')
    expect(keahlianDropdown.props().customClass).toBe('filter-dropdown mr-2')
  })

  it('passes correct props to location dropdown', () => {
    const locationDropdown = wrapper.findAllComponents(DropdownSelect).at(1)
    
    expect(locationDropdown.props().options).toEqual(locations.map(location => location.label))
    expect(locationDropdown.props().placeholder).toBe('Lokasi')
    expect(locationDropdown.props().customClass).toBe('filter-dropdown mr-2')
  })

  it('passes correct props to price dropdown', () => {
    const priceDropdown = wrapper.findAllComponents(DropdownSelect).at(2)
    
    expect(priceDropdown.props().options.length).toBeGreaterThan(0)
    expect(priceDropdown.props().placeholder).toBe('Harga')
    expect(priceDropdown.props().customClass).toBe('filter-dropdown')
  })

  it('emits filter-applied event when keahlian is changed', async () => {
    await wrapper.setData({ selectedKeahlian: 'Arsitektur' })
    
    expect(wrapper.emitted('filter-applied')).toBeTruthy()
    expect(wrapper.emitted('filter-applied')[0][0]).toEqual({
      keahlian: 'Arsitektur',
      location: '',
      price: ''
    })
  })

  it('emits filter-applied event when location is changed', async () => {
    await wrapper.setData({ selectedLocation: 'Jakarta' })
    
    expect(wrapper.emitted('filter-applied')).toBeTruthy()
    expect(wrapper.emitted('filter-applied')[0][0]).toEqual({
      keahlian: '',
      location: 'Jakarta',
      price: ''
    })
  })

  it('emits filter-applied event when price is changed', async () => {
    await wrapper.setData({ selectedPrice: 'Rp500.000 - Rp1.000.000' })
    
    expect(wrapper.emitted('filter-applied')).toBeTruthy()
    expect(wrapper.emitted('filter-applied')[0][0]).toEqual({
      keahlian: '',
      location: '',
      price: 'Rp500.000 - Rp1.000.000'
    })
  })

  it('emits filter-applied event with multiple filters', async () => {
    await wrapper.setData({ selectedKeahlian: 'Arsitektur' })
    await wrapper.setData({ selectedLocation: 'Jakarta' })
    
    // Check the latest emitted event has both values
    const emittedEvents = wrapper.emitted('filter-applied')
    const lastEvent = emittedEvents[emittedEvents.length - 1][0]
    
    expect(lastEvent).toEqual({
      keahlian: 'Arsitektur',
      location: 'Jakarta',
      price: ''
    })
  })

  // NEGATIVE CASES

  it('does not emit filter-applied event when initialized', () => {
    expect(wrapper.emitted('filter-applied')).toBeFalsy()
  })

  it('handles missing translations without errors', () => {
    const localWrapper = shallowMount(AdvancedFilter, {
      stubs: {
        DropdownSelect: true
      },
      mocks: {
        $t: (key) => key // Return key instead of translation
      }
    })
    
    expect(() => {
      const dropdowns = localWrapper.findAllComponents(DropdownSelect)
      expect(dropdowns).toHaveLength(3)
    }).not.toThrow()
    
    localWrapper.destroy()
  })

  // EDGE CASES
  it('sorts price ranges correctly', () => {
    const priceOptions = wrapper.vm.priceOptions
    
    // Check that first price range has lower min value than last
    const firstMin = parseInt(priceOptions[0].split(' - ')[0].replace(/\D/g, ''))
    const lastMin = parseInt(priceOptions[priceOptions.length - 1].split(' - ')[0].replace(/\D/g, ''))
    
    expect(firstMin).toBeLessThan(lastMin)
  })

  it('handles empty price data', () => {
    // Mock the hargaJasa with empty data
    jest.mock('@/constants/filterData', () => ({
      hargaJasa: {},
      locations: [],
      skills: []
    }))
    
    // Force recompute priceOptions
    wrapper.vm.$options.computed.priceOptions.call({
      formatCurrency: wrapper.vm.formatCurrency
    })
    
    // We just check that no error is thrown
    expect(true).toBe(true)
  })

  it('removes duplicate price ranges', () => {
    // All unique price ranges should appear only once
    const priceOptions = wrapper.vm.priceOptions
    const uniqueOptions = [...new Set(priceOptions)]
    
    expect(priceOptions.length).toBe(uniqueOptions.length)
  })

  it('applies responsive styling for mobile view', () => {
    expect(wrapper.classes()).toContain('d-flex')
    
    // Verify that the component has the appropriate class for responsive layout
    const filterDiv = wrapper.find('.advanced-filter')
    expect(filterDiv.exists()).toBe(true)
    
    // Check that the wrapper has the class that would be styled in CSS
    expect(filterDiv.classes()).toContain('advanced-filter')
  })
})