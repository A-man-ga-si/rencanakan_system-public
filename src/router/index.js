import Vue from 'vue';
import VueRouter from 'vue-router';
import AuthGuard from './../utils/auth.guard';
import App from './../views/app';
import { adminRoot } from './../constants/config';
import { UserRole } from './../utils/auth.roles';

Vue.use(VueRouter);

const routes = [
  {
    path: '/',
    redirect: {
      name: 'Dashboard',
    },
  },
  {
    path: adminRoot,
    name: 'root',
    redirect: {
      name: 'Dashboard',
    },
    component: App,
    children: [
      {
        path: `dashboard`,
        name: 'Dashboard',
        meta: {
          loginRequired: true,
          permissions: ['read dashboard', 'read home'],
        },
        component: () =>
          import(/* webpackChunkName: "dashboard" */ './../views/app/single'),
      },
      {
        path: `settings`,
        name: 'Settings',
        meta: {
          loginRequired: true,
          permissions: ['read dashboard', 'read home'],
        },
        component: () =>
          import(/* webpackChunkName: "dashboard" */ './../views/app/settings'),
      },
    ],
  },
  {
    path: `/auth`,
    redirect: '/auth/login',
    name: 'Auth',
    component: () => import(/* webpackChunkName: "auth" */ './../views/user'),
    children: [
      {
        path: 'login',
        name: 'Login',
        component: () =>
          import(/* webpackChunkName: "login" */ './../views/user/Login'),
      },
      {
        path: 'register',
        name: 'Register',
        component: () =>
          import(/* webpackChunkName: "register" */ './../views/user/Register'),
      },
      {
        path: 'forgot-password',
        name: 'ForgotPassword',
        component: () =>
          import(
            /* webpackChunkName: "forgotPassword" */ './../views/user/ForgotPassword'
          ),
      },
      {
        path: 'reset-password',
        name: 'ResetPassword',
        component: () =>
          import(
            /* webpackChunkName: "resetPassword" */ './../views/user/ResetPassword'
          ),
      },
    ],
  },
  {
    path: '/error',
    component: () => import(/* webpackChunkName: "error" */ './../views/Error'),
  },
  {
    path: '*',
    component: () => import(/* webpackChunkName: "error" */ './../views/Error'),
  },
];

const router = new VueRouter({
  routes,
  linkActiveClass: 'active',
  mode: 'history',
});

router.beforeEach(AuthGuard);

export default router;
