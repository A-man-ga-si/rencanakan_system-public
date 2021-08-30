import store from './../store';

export default function (to, from, next) {
  if (to.name === 'ResetPassword') {
    store.dispatch('verifyResetPasswordToken', to.query.token).catch(() => {
      next({
        name: 'Login',
      });
    });
  }
}
