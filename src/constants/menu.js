import { adminRoot } from './config';

const data = [
  // {
  //   id: 'dashboard',
  //   icon: 'iconsminds-shop',
  //   label: 'menu.dashboard',
  //   permissions: ['read-dashboard'],
  //   to: `${adminRoot}/dashboard`,
  // },
  {
    id: 'projects',
    icon: 'iconsminds-folders',
    label: 'menu.projects',
    permissions: ['access-project-page'],
    to: `${adminRoot}/projects`,
  },
  {
    id: 'talent-pool',
    icon: 'iconsminds-male-female',
    label: 'menu.talent-pool',
    permissions: ['read-dashboard'],
    to: `${adminRoot}/talent-pool`,
  },
  {
    id: 'orders',
    icon: 'iconsminds-safe-box',
    label: 'menu.orders',
    permissions: ['access-project-page'],
    to: `${adminRoot}/orders`,
  },
  {
    id: 'account',
    icon: 'iconsminds-administrator',
    label: 'menu.account',
    permissions: ['access-account-page'],
    to: `${adminRoot}/account`,
    subs: [
      {
        label: 'menu.user-profile',
        to: `${adminRoot}/account/profile`,
        permissions: ['access-account-page'],
      },
      {
        label: 'menu.company-profile',
        to: `${adminRoot}/account/company-profile`,
        permissions: ['access-account-page'],
      },
      {
        label: 'menu.change-email',
        to: `${adminRoot}/account/change-email`,
        permissions: ['access-account-page'],
      },
      {
        label: 'menu.change-password',
        to: `${adminRoot}/account/change-password`,
        permissions: ['access-account-page'],
      },
    ],
  },
  {
    id: 'master',
    icon: 'iconsminds-big-data',
    label: 'menu.master-data',
    permissions: ['access-master-page'],
    to: `${adminRoot}/master/`,
    subs: [
      {
        label: 'menu.master-unit',
        to: `${adminRoot}/master/unit`,
        permissions: ['access-master-page'],
      },
      {
        label: 'menu.master-item-price-group',
        to: `${adminRoot}/master/group-item-price`,
        permissions: ['access-master-page'],
      },
      {
        label: 'menu.master-item-price',
        to: `${adminRoot}/master/item-price`,
        permissions: ['access-master-page'],
      },
      {
        label: 'menu.master-ahs',
        to: `${adminRoot}/master/ahs`,
        permissions: ['access-master-page'],
      },
      {
        label: 'menu.master-rab',
        to: `${adminRoot}/master/rab`,
        permissions: ['access-master-page'],
      },
      {
        label: 'menu.master-ahp',
        to: `${adminRoot}/master/ahp`,
        permissions: ['access-master-page'],
      },
    ],
  },
  {
    id: 'admin',
    icon: 'iconsminds-administrator',
    label: 'Admin Panel',
    permissions: ['access-master-page'],
    to: `${adminRoot}/admin`
  },
];

export default data;
