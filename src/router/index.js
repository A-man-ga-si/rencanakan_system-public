import Vue from 'vue';
import VueRouter from 'vue-router';
import AuthGuard from './../utils/auth.guard';
import App from './../views/app';
import { adminRoot, defaultTitle, titleSuffix } from './../constants/config';
import PasswordResetGuard from './../utils/password-reset.guard';

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
    name: 'Root',
    meta: {
      permissions: ['read-dashboard'],
    },
    redirect: {
      name: 'Dashboard',
    },
    component: App,
    children: [
      {
        path: `dashboard`,
        name: 'Dashboard',
        meta: {
          title: 'Dashboard',
          loginRequired: true,
          permissions: ['read-dashboard'],
        },
        component: () =>
          import(
            /* webpackChunkName: "dashboard" */ './../views/app/dashboard'
          ),
      },
      {
        path: `settings`,
        name: 'Setting',
        meta: {
          title: 'Setting',
          loginRequired: true,
          permissions: ['read-dashboard'],
        },
        component: () =>
          import(/* webpackChunkName: "settings" */ './../views/app/settings'),
      },
      {
        path: `projects`,
        name: 'Project',
        meta: {
          title: 'My Projects',
          loginRequired: true,
          permissions: ['read-dashboard'],
        },
        component: () =>
          import(/* webpackChunkName: "project" */ './../views/app/projects'),
      },
      {
        path: 'projects/:id/rab',
        name: 'Rab',
        redirect: {
          name: 'RabSummary',
        },
        meta: {
          title: 'RAB',
          loginRequired: true,
          permissions: ['read-dashboard'],
        },
        component: () =>
          import(/* webpackChunkName: "rab" */ './../views/app/projects/rabs'),
        children: [
          {
            path: 'summary',
            name: 'RabSummary',
            meta: {
              title: 'RAB Summary',
              loginRequired: true,
              permissions: ['read-dashboard'],
            },
            component: () =>
              import(
                /* webpackChunkName: "rabSummary" */ './../views/app/projects/rabs/RabSummary.vue'
              ),
          },
          {
            path: 'ahs',
            name: 'RabAhs',
            meta: {
              title: 'AHS',
              loginRequired: true,
              permissions: ['read-dashboard'],
            },
            component: () =>
              import(
                /* webpackChunkName: "rabAhs" */ './../views/app/projects/rabs/Ahs.vue'
              ),
          },
          {
            path: 'item-price',
            name: 'ItemPrice',
            meta: {
              title: 'Item Price',
              loginRequired: true,
              permissions: ['read-dashboard'],
            },
            redirect: {
              name: 'RabItemPriceMaster',
            },
            component: () =>
              import(
                /* webpackChunkName: "itemPrice" */ './../views/app/projects/rabs/item-price'
              ),
            children: [
              {
                path: 'item-price-master',
                name: 'RabItemPriceMaster',
                meta: {
                  title: 'Harga Satuan',
                  loginRequired: true,
                  permissions: ['read-dashboard'],
                },
                component: () =>
                  import(
                    /* webpackChunkName: "itemPriceMaster" */ './../views/app/projects/rabs/item-price/ItemPriceMaster.vue'
                  ),
              },
              {
                path: 'equipment-item-price-master',
                name: 'RabEquipmentPriceMaster',
                meta: {
                  title: 'Harga Satuan Peralatan',
                  loginRequired: true,
                  permissions: ['read-dashboard'],
                },
                component: () =>
                  import(
                    /* webpackChunkName: "equipmentItemPriceMaster" */ './../views/app/projects/rabs/item-price/EquipmentItemPriceMaster.vue'
                  ),
              },
            ],
          },
          {
            path: 'ahp',
            name: 'RabAhp',
            meta: {
              title: 'Equipments Price Analysis',
              loginRequired: true,
              permissions: ['read-dashboard'],
            },
            component: () =>
              import(
                /* webpackChunkName */ './../views/app/projects/rabs/Ahp.vue'
              ),
          },
        ],
      },
      {
        path: `token`,
        name: 'Token',
        meta: {
          title: 'My Token',
          loginRequired: true,
          permissions: ['read-dashboard'],
        },
        component: () =>
          import(/* webpackChunkName: "token" */ './../views/app/token'),
      },
      {
        path: `transaction-history`,
        name: 'TransactionHistory',
        meta: {
          title: 'Transaction History',
          loginRequired: true,
          permissions: ['read-dashboard'],
        },
        component: () =>
          import(
            /* webpackChunkName: "transactionHistory" */ './../views/app/transaction-history'
          ),
      },
      {
        path: `account`,
        name: 'Account',
        meta: {
          loginRequired: true,
          permissions: ['read-dashboard'],
        },
        redirect: {
          name: 'ProfileAccount',
        },
        component: () =>
          import(/* webpackChunkName: "account" */ './../views/app/account'),
        children: [
          {
            path: 'profile',
            name: 'ProfileAccount',
            meta: {
              title: 'Account Profile',
            },
            component: () =>
              import(
                /* webpackChunkName: "profileAccount" */ './../views/app/account/Profile.vue'
              ),
          },
          {
            path: 'company-profile',
            name: 'CompanyProfile',
            meta: {
              title: 'Company Profile',
            },
            component: () =>
              import(
                /* webpackChunkName: "companyProfile" */ './../views/app/account/CompanyProfile.vue'
              ),
          },
          {
            path: 'change-email',
            name: 'ChangeEmail',
            meta: {
              title: 'Change Email',
            },
            component: () =>
              import(
                /* webpackChunkName: "changeEmail" */ './../views/app/account/ChangeEmail.vue'
              ),
          },
          {
            path: 'change-password',
            name: 'ChangePassword',
            meta: {
              title: 'Change Password',
            },
            component: () =>
              import(
                /* webpackChunkName: "changePassword" */ './../views/app/account/ChangePassword.vue'
              ),
          },
        ],
      },
      {
        path: `master`,
        name: 'Master',
        meta: {
          loginRequired: true,
          permissions: ['read-dashboard'],
        },
        redirect: {
          name: 'ProfileAccount',
        },
        component: () =>
          import(/* webpackChunkName: "master" */ './../views/app/master'),
        children: [
          {
            path: 'unit',
            name: 'MasterUnit',
            meta: {
              title: 'Master Unit',
            },
            component: () =>
              import(
                /* webpackChunkName: "masterUnit" */ './../views/app/master/Unit.vue'
              ),
          },
          {
            path: 'group-item-price',
            name: 'MasterItemPriceGroup',
            meta: {
              title: 'Master Item Price Group',
            },
            component: () =>
              import(
                /* webpackChunkName: "masterItemPriceGroup" */ './../views/app/master/ItemPriceGroup.vue'
              ),
          },
          {
            path: 'item-price',
            name: 'MasterItemPrice',
            meta: {
              title: 'Master Item Price',
            },
            component: () =>
              import(
                /* webpackChunkName: "masterItemPrice" */ './../views/app/master/ItemPrice.vue'
              ),
          },
          {
            path: 'ahs',
            name: 'MasterAhs',
            meta: {
              title: 'Master AHS',
            },
            component: () =>
              import(
                /* webpackChunkName: "masterAhs" */ './../views/app/master/Ahs.vue'
              ),
          },
          {
            path: 'ahp',
            name: 'MasterAhp',
            meta: {
              title: 'Master AHP',
            },
            component: () =>
              import(
                /* webpackChunkName: "masterAhp" */ './../views/app/master/Ahp.vue'
              ),
          },
        ],
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
        meta: {
          title: 'Login',
        },
        component: () =>
          import(/* webpackChunkName: "login" */ './../views/user/Login'),
      },
      {
        path: 'register',
        name: 'Register',
        meta: {
          title: 'Register',
        },
        component: () =>
          import(/* webpackChunkName: "register" */ './../views/user/Register'),
      },
      {
        path: 'forgot-password',
        name: 'ForgotPassword',
        meta: {
          title: 'Forgot Password',
        },
        component: () =>
          import(
            /* webpackChunkName: "forgotPassword" */ './../views/user/ForgotPassword'
          ),
      },
      {
        path: 'reset-password',
        name: 'ResetPassword',
        meta: {
          title: 'Reset Password',
        },
        component: () =>
          import(
            /* webpackChunkName: "resetPassword" */ './../views/user/ResetPassword'
          ),
      },
      {
        path: 'verification/callback',
        name: 'VerificationCallback',
        meta: {
          title: 'Email Verification Status',
        },
        component: () =>
          import(
            /* webpackChunkName: "emailVerificationCallback" */ './../views/user/VerificationCallback'
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

router.beforeEach((to, from, next) => {
  document.title = `${to.meta.title || defaultTitle} ${titleSuffix}`;
  PasswordResetGuard(to, from, next);
  AuthGuard(to, from, next);
});

export default router;
