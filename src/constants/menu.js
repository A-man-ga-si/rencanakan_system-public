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
    permissions: ['blank-page'],
    to: `${adminRoot}/settings`,
  },
];

export default data;
