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
  // {
  //   id: 'transaction-history',
  //   icon: 'iconsminds-clock-back',
  //   label: 'menu.transaction-history',
  //   permissions: ['read-dashboard'],
  //   to: `${adminRoot}/transaction-history`,
  // },
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
    id: 'master',
    icon: 'iconsminds-big-data',
    label: 'menu.master-data',
    permissions: ['read-dashboard'],
    to: `${adminRoot}/master/`,
    subs: [
      {
        label: 'menu.master-unit',
        to: `${adminRoot}/master/unit`,
      },
      {
        label: 'menu.master-item-price-group',
        to: `${adminRoot}/master/group-item-price`,
      },
      {
        label: 'menu.master-item-price',
        to: `${adminRoot}/master/item-price`,
      },
      {
        label: 'menu.master-ahs',
        to: `${adminRoot}/master/ahs`,
      },
      {
        label: 'menu.master-ahp',
        to: `${adminRoot}/master/ahp`,
      },
    ],
  },
];

export default data;
