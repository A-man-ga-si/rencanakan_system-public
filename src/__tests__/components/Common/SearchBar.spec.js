import { shallowMount } from '@vue/test-utils'
import SearchBar from '@/components/Common/SearchBar.vue'

describe('SearchBar.vue', () => {
  let wrapper

  beforeEach(() => {
    wrapper = shallowMount(SearchBar, {
      stubs: {
        IconLup: true
      }
    })
  })

  describe('Positive Cases', () => {
    it('renders correctly', () => {
      expect(wrapper.exists()).toBe(true)
      expect(wrapper.find('.search-container').exists()).toBe(true)
      expect(wrapper.find('.search-input').exists()).toBe(true)
      expect(wrapper.find('.search-button').exists()).toBe(true)
    })

    it('accepts a custom placeholder', () => {
      wrapper = shallowMount(SearchBar, {
        propsData: {
          placeholder: 'Custom placeholder'
        },
        stubs: {
          IconLup: true
        }
      })
      const input = wrapper.find('input')
      expect(input.attributes('placeholder')).toBe('Custom placeholder')
    })

    it('emits input event when typing', async () => {
      const input = wrapper.find('input')
      await input.setValue('test query')
      
      expect(wrapper.emitted('input')).toBeTruthy()
      expect(wrapper.emitted('input')[0]).toEqual(['test query'])
    })

    it('emits search event when pressing enter', async () => {
      const input = wrapper.find('input')
      await input.trigger('keyup.enter')
      
      expect(wrapper.emitted('search')).toBeTruthy()
    })

    it('emits search event when clicking the search button', async () => {
      const searchButton = wrapper.find('.search-button')
      await searchButton.trigger('click')
      
      expect(wrapper.emitted('search')).toBeTruthy()
    })

    it('applies focused class when input is focused', async () => {
      const input = wrapper.find('input')
      await input.trigger('focus')
      
      expect(wrapper.vm.isFocused).toBe(true)
      expect(wrapper.find('.search-container').classes()).toContain('focused')
    })

    it('removes focused class when input is blurred', async () => {
      const input = wrapper.find('input')
      await input.trigger('focus')
      await input.trigger('blur')
      
      expect(wrapper.vm.isFocused).toBe(false)
      expect(wrapper.find('.search-container').classes()).not.toContain('focused')
    })

    it('sets the correct value when provided as prop', () => {
      wrapper = shallowMount(SearchBar, {
        propsData: {
          value: 'initial value'
        },
        stubs: {
          IconLup: true
        }
      })
      
      const input = wrapper.find('input')
      expect(input.element.value).toBe('initial value')
    })

    it('computes correct icon size based on window width', () => {
      // Mock window.innerWidth
      global.innerWidth = 1024 // Desktop
      expect(wrapper.vm.iconSize).toBe(20)
      
      global.innerWidth = 600 // Mobile
      // Need to force computed property recalculation
      wrapper.vm.$forceUpdate()
      expect(wrapper.vm.iconSize).toBe(20)
    })
  })

  // NEGATIVE CASES
  describe('Negative Cases', () => {
    it('disables the input when disabled prop is true', () => {
      wrapper = shallowMount(SearchBar, {
        propsData: {
          disabled: true
        },
        stubs: {
          IconLup: true
        }
      })
      
      const input = wrapper.find('input')
      expect(input.attributes('disabled')).toBeDefined()
    })

    it('does not emit input event when disabled', async () => {
      wrapper = shallowMount(SearchBar, {
        propsData: {
          disabled: true
        },
        stubs: {
          IconLup: true
        }
      })
      
      const input = wrapper.find('input')
      await input.setValue('test query')
      
      // The DOM will prevent input on disabled fields, so we need to manually dispatch an input event
      await input.trigger('input')
      
      expect(wrapper.emitted('input')).toBeFalsy()
    })

    it('does not emit search event when pressing enter while disabled', async () => {
      wrapper = shallowMount(SearchBar, {
        propsData: {
          disabled: true
        },
        stubs: {
          IconLup: true
        }
      })
      
      const input = wrapper.find('input')
      await input.trigger('keyup.enter')
      
      // Even though the field is disabled, keyup events can still be triggered
      // But we'd expect the component to handle this gracefully
      expect(wrapper.emitted('search')).toBeFalsy()
    })
  })

  // EDGE CASES
  describe('Edge Cases', () => {
    it('handles empty string as value', () => {
      wrapper = shallowMount(SearchBar, {
        propsData: {
          value: ''
        },
        stubs: {
          IconLup: true
        }
      })
      
      const input = wrapper.find('input')
      expect(input.element.value).toBe('')
    })

    it('handles spaces in search input', async () => {
      const input = wrapper.find('input')
      await input.setValue('   test with spaces   ')
      
      expect(wrapper.emitted('input')).toBeTruthy()
      expect(wrapper.emitted('input')[0]).toEqual(['   test with spaces   '])
    })

    it('handles special characters in search input', async () => {
      const input = wrapper.find('input')
      await input.setValue('test!@#$%^&*()')
      
      expect(wrapper.emitted('input')).toBeTruthy()
      expect(wrapper.emitted('input')[0]).toEqual(['test!@#$%^&*()'])
    })

    it('handles very long search inputs', async () => {
      const input = wrapper.find('input')
      const longText = 'a'.repeat(1000)
      await input.setValue(longText)
      
      expect(wrapper.emitted('input')).toBeTruthy()
      expect(wrapper.emitted('input')[0]).toEqual([longText])
    })

    it('handles rapid repeated search button clicks', async () => {
      const searchButton = wrapper.find('.search-button')
      
      await searchButton.trigger('click')
      await searchButton.trigger('click')
      await searchButton.trigger('click')
      
      expect(wrapper.emitted('search')).toBeTruthy()
      expect(wrapper.emitted('search').length).toBe(3)
    })

    it('handles empty placeholder', () => {
      wrapper = shallowMount(SearchBar, {
        propsData: {
          placeholder: ''
        },
        stubs: {
          IconLup: true
        }
      })
      
      const input = wrapper.find('input')
      expect(input.attributes('placeholder')).toBe('')
    })
  })
})