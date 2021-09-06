import store from './../store';
import { isAuthGuardActive } from '../constants/config';
import { setCurrentUser, getCurrentUser } from '.';

export default async (to, from, next) => {
  if (to.matched.some(record => record.meta.loginRequired)) {
    if (isAuthGuardActive) {
      const user = getCurrentUser();
      if (user) {
        try {
          if (!store.getters['isTokenVerified'])
            await store.dispatch('verifyToken');
          const roleArrayHierarchic = to.matched
            .filter(x => x.meta.permissions)
            .map(x => x.meta.permissions);
          if (
            roleArrayHierarchic.every(x =>
              user.permissions.every(y => x.includes(y))
            )
          ) {
            next();
          } else {
            next('/unauthorized');
          }
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
