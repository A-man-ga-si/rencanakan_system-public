import store from './../store';
import { isAuthGuardActive } from '../constants/config';
import { setCurrentUser, getCurrentUser } from '.';

/**
 * Verify is user valid or not by matching user.permissions array
 * with routers's permission tree
 *
 * @param {object} to
 * @param {object} user
 * @returns bool isValid
 */
const verifyPermissions = (to, user) => {
  const permissions = to.matched
    .filter(x => x.meta.permissions)
    .map(x => x.meta.permissions);
  const isPermissionTreeValid = permissions.every(x => {
    for (const pagePermission of x) {
      if (user.permissions.includes(pagePermission)) return true;
    }
    return false;
  });
  return isPermissionTreeValid;
};

export default async (to, from, next) => {
  if (to.matched.some(record => record.meta.loginRequired)) {
    if (isAuthGuardActive) {
      const user = getCurrentUser();
      if (user) {
        try {
          if (!store.getters['isTokenVerified']) {
            await store.dispatch('verifyToken');
          }
          // console.log(verifyPermissions(to, user));
          if (verifyPermissions(to, user)) next();
          else next('/unauthorized/403');
        } catch (err) {
          next({
            name: 'Login',
          });
        }
      } else {
        setCurrentUser(null);
        next({
          name: 'Login',
        });
      }
    } else {
      next();
    }
  } else {
    if (isAuthGuardActive) {
      if (getCurrentUser() && to.matched[0].name === 'Auth') {
        window.history.go(-1);
      } else {
        next();
      }
    } else {
      next();
    }
  }
};
