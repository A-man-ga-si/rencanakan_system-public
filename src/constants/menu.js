import { adminRoot } from './config';

const data = [
  {
    id: 'dashboard',
    icon: 'iconsminds-shop',
    label: 'menu.dashboard',
    permissions: ['read-dashboard'],
    to: `${adminRoot}/dashboard`,
  },
  {
    id: 'projects',
    icon: 'iconsminds-folders',
    label: 'menu.projects',
    permissions: ['read-dashboard'],
    to: `${adminRoot}/projects`,
  },
  {
    id: 'token',
    icon: 'iconsminds-coins-2',
    label: 'menu.token',
    permissions: ['read-dashboard'],
    to: `${adminRoot}/token`,
  },
  {
    id: 'account',
    icon: 'iconsminds-administrator',
    label: 'menu.account',
    permissions: ['read-dashboard'],
    to: `${adminRoot}/account`,
    subs: [
      {
        label: 'menu.user-profile',
        to: `${adminRoot}/account/profile`,
      },
      {
        label: 'menu.company-profile',
        to: `${adminRoot}/account/company-profile`,
      },
      {
        label: 'menu.change-email',
        to: `${adminRoot}/account/change-email`,
      },
      {
        label: 'menu.change-password',
        to: `${adminRoot}/account/change-password`,
      },
    ],
  },
  {
    id: 'settings',
    icon: 'iconsminds-gear',
    label: 'menu.settings',
    permissions: ['read-dahboard'],
    to: `${adminRoot}/settings`,
  },
];

export default data;
