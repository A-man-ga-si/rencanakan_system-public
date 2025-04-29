import { mount } from '@vue/test-utils';
import UserCard from '@/components/Common/UserCard.vue';

describe('UserCard.vue', () => {
  const mockUser = {
    id: 1,
    name: 'John Doe',
    image: '/path/to/image.jpg',
    experience: 5,
    skill: 'Frontend Developer',
    location: 'Jakarta, Indonesia',
    price: 5000000,
    lastContracted: '2023-07-15',
    bookmarked: false
  };

  it('renders correctly with all user properties', () => {
    const wrapper = mount(UserCard, {
      propsData: {
        user: mockUser
      }
    });

    // Check basic elements
    expect(wrapper.find('.talent-name').text()).toBe(mockUser.name);
    expect(wrapper.find('.talent-location').text()).toContain(mockUser.location);
    expect(wrapper.find('.talent-price').text()).toContain('5.000.000');
    expect(wrapper.find('.talent-date').text()).toContain('Terakhir dikontrak:');
    expect(wrapper.find('.experience-badge').text()).toContain('5 Tahun Pengalaman');
    expect(wrapper.find('.specialty-badge').text()).toBe(mockUser.skill);
    
    // Check image
    const img = wrapper.find('.talent-image');
    expect(img.attributes('src')).toBe(mockUser.image);
    expect(img.attributes('alt')).toBe(mockUser.name);
  });

  it('handles missing user properties gracefully', () => {
    const minimalUser = {
      id: 2,
      name: 'Jane Smith',
      image: '/path/to/image2.jpg',
    };

    const wrapper = mount(UserCard, {
      propsData: {
        user: minimalUser
      }
    });

    // Only these elements should exist
    expect(wrapper.find('.talent-name').text()).toBe(minimalUser.name);
    expect(wrapper.find('.talent-image').exists()).toBe(true);
    
    // These elements should not exist
    expect(wrapper.find('.talent-location').exists()).toBe(false);
    expect(wrapper.find('.talent-price').exists()).toBe(false);
    expect(wrapper.find('.talent-date').exists()).toBe(false);
    expect(wrapper.find('.experience-badge').exists()).toBe(false);
    expect(wrapper.find('.specialty-badge').exists()).toBe(false);
  });

  it('emits toggle-bookmark event when bookmark icon is clicked', async () => {
    const wrapper = mount(UserCard, {
      propsData: {
        user: mockUser
      }
    });

    await wrapper.find('.bookmark-icon').trigger('click');
    
    // Check if the event was emitted with the correct payload
    expect(wrapper.emitted('toggle-bookmark')).toBeTruthy();
    expect(wrapper.emitted('toggle-bookmark')[0][0]).toEqual(mockUser);
  });

  it('displays bookmark icon with filled class when bookmarked is true', () => {
    const bookmarkedUser = {
      ...mockUser,
      bookmarked: true
    };

    const wrapper = mount(UserCard, {
      propsData: {
        user: bookmarkedUser
      }
    });

    expect(wrapper.find('.bookmark-icon i').classes()).toContain('filled');
  });

  it('formats price correctly', () => {
    const userWithLargePrice = {
      ...mockUser,
      price: 1234567890
    };

    const wrapper = mount(UserCard, {
      propsData: {
        user: userWithLargePrice
      }
    });

    expect(wrapper.find('.talent-price').text()).toContain('1.234.567.890');
  });

  it('formats date correctly', () => {
    // Mock the Intl.DateTimeFormat to ensure consistent test results
    const originalDateTimeFormat = Intl.DateTimeFormat;
    Intl.DateTimeFormat = jest.fn().mockImplementation(() => ({
      format: () => '15 Juli 2023'
    }));

    const wrapper = mount(UserCard, {
      propsData: {
        user: mockUser
      }
    });

    expect(wrapper.find('.talent-date').text()).toContain('15 Juli 2023');
    
    // Restore the original implementation
    Intl.DateTimeFormat = originalDateTimeFormat;
  });
});