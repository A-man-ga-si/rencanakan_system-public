import { adminRoot } from './config';
import { UserRole } from '../utils/auth.roles';

const data = [
  {
    id: 'dashboard',
    icon: 'iconsminds-shop',
    label: 'menu.dashboard',
    permissions: ['read-dashboard'],
    to: `${adminRoot}/dashboard`,
  },
  {
    id: 'settings',
    icon: 'iconsminds-gear',
    label: 'menu.settings',
    permissions: ['read-dahboard'],
    to: `${adminRoot}/settings`,
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
  // {
  //   id: 'projects',
  //   icon: 'iconsminds-user',
  //   label: 'menu.account',
  //   permissions: ['read-dashboard'],
  //   to: `${adminRoot}/token`,
  // },
];

export default data;
