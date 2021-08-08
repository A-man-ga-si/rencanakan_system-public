import { isAuthGuardActive } from '../constants/config';
import { setCurrentUser, getCurrentUser } from '.';
import store from './../store';

export default async (to, from, next) => {
  if (to.matched.some(record => record.meta.loginRequired)) {
    if (isAuthGuardActive) {
      const user = getCurrentUser();
      // const verification = await new Promise((resolve, reject) => {
      //   if (!store.getters['isLoggedIn']) {
      //     setTimeout(() => {
      //       store.state.isLoggedIn = true;
      //       console.log(store.getters['isLoggedIn']);
      //       resolve(true);
      //     }, 2000);
      //   } else {
      //     resolve();
      //   }
      // });
      if (user) {
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
