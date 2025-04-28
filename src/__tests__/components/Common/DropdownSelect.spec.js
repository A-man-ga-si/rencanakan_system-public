import { shallowMount } from '@vue/test-utils'
import DropdownSelect from '@/components/Common/DropdownSelect.vue'

describe('DropdownSelect.vue', () => {
  let wrapper

  beforeEach(() => {
    wrapper = shallowMount(DropdownSelect, {
      propsData: {
        value: '',
        placeholder: 'Select an option...',
        options: ['Option 1', 'Option 2', 'Option 3']
      },
      stubs: {
        IconChevronDown: true
      }
    })
  })

  afterEach(() => {
    wrapper.destroy()
  })

  it('renders placeholder option correctly', () => {
    const placeholderOption = wrapper.find('option[value=""]')
    expect(placeholderOption.exists()).toBe(true)
    expect(placeholderOption.text()).toBe('Select an option...')
  })

  it('renders all options passed in props', () => {
    const options = wrapper.findAll('option')
    expect(options).toHaveLength(4)
    expect(options.at(1).text()).toBe('Option 1')
    expect(options.at(2).text()).toBe('Option 2')
    expect(options.at(3).text()).toBe('Option 3')
  })

  it('emits input event when value changes', async () => {
    const select = wrapper.find('select')
    await select.setValue('Option 2')
    expect(wrapper.emitted('input')).toBeTruthy()
    expect(wrapper.emitted('input')[0]).toEqual(['Option 2'])
  })

  it('adds focused class when focused and removes it on blur', async () => {
    const select = wrapper.find('select')
    await select.trigger('focus')
    expect(wrapper.classes()).toContain('focused')

    await select.trigger('blur')
    expect(wrapper.classes()).not.toContain('focused')
  })

  it('disables the select element if disabled prop is true', async () => {
    await wrapper.setProps({ disabled: true })
    const select = wrapper.find('select')
    expect(select.attributes('disabled')).toBe('disabled')
  })
})
