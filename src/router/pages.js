/* eslint-disable no-unused-vars */
export default [
  {
    path: '/',
    name: 'dashboard',
    component: () => import('@/views/Dashboard.vue'),
    meta: {
      resource: 'Auth',
    },
  },

  {
    path: '/cards',
    name: 'cards',
    component: () => import('@/views/Cards.vue'),
  },
  {
    path: '/card/:card_number',
    name: 'card',
    component: () => import('@/views/CardDetails.vue'),
    meta: {
      pageTitle: 'Карта',
      breadcrumb: [{ text: 'Топливные карты', to: '/cards' }],
      rule: 'editor',
    },
    beforeEnter(to, _, next) {
      to.meta.breadcrumb = [
        { text: 'Топливные карты', to: '/cards' },
      ];
      to.meta.breadcrumb.push({ text: to.params.card_number, active: true });
      next();
    },

  },

  {
    path: '/transactions',
    name: 'transactions',
    component: () => import('@/views/Transactions.vue'),
  },

  {
    path: 'setting',
    name: 'setting',
    component: () => import('@/views/Settings.vue'),
  },

  {
    path: 'profile',
    name: 'profile',
    component: () => import('@/views/Profile.vue'),
  },

  {
    path: '/report',
    name: 'report',
    component: () => import('@/views/Report.vue'),
  },
  {
    path: '/locator',
    name: 'locator',
    component: () => import('@/views/Locator.vue'),
  },

  {
    path: '/documents',
    name: 'documents',
    component: () => import('@/views/documents/Documents.vue'),
  },

  {
    path: '/documents/payments',
    name: 'payments',
    component: () => import('@/views/documents/Payments.vue'),
    meta: {
      breadcrumb: [
        { text: 'Главная', url: '/' },
        { text: 'Документы' },
        { text: 'Платежи', active: true },
      ],
      rule: 'editor',
    },
  },
  {
    path: '/documents/bill',
    name: 'bill',
    component: () => import('@/views/documents/Bill.vue'),
    meta: {
      breadcrumb: [
        { text: 'Главная', url: '/' },
        { text: 'Документы' },
        { text: 'Заказать счет', active: true },
      ],
      rule: 'editor',
    },
  },
  {
    path: '/documents/checks',
    name: 'checks',
    component: () => import('@/views/documents/Checks.vue'),
    meta: {
      breadcrumb: [
        { text: 'Главная', url: '/' },
        { text: 'Документы' },
        { text: 'Электронные чеки', active: true },
      ],
      rule: 'editor',
    },
  },
  {
    path: '/requests',
    name: 'requests',
    component: () => import('@/views/documents/Requests.vue'),
    meta: {
      breadcrumb: [
        { text: 'Главная', url: '/' },
        { text: 'Документы' },
        { text: 'Заявки', active: true },
      ],
      rule: 'editor',
    },
  },

  {
    path: '/error-404',
    name: 'error-404',
    component: () => import('@/views/error/Error404.vue'),
    meta: {
      layout: 'full',
      resource: 'Auth',
      action: 'read',
    },
  },
  {
    path: '/login',
    name: 'auth-login',
    component: () => import('@/views/auth/Login.vue'),
    meta: {
      layout: 'full',
      resource: 'Auth',
      redirectIfLoggedIn: true,
    },
  },
  {
    path: '/register',
    name: 'auth-register',
    component: () => import('@/views/auth/Register.vue'),
    meta: {
      layout: 'full',
      resource: 'Auth',
      redirectIfLoggedIn: true,
    },
  },
  {
    path: '/forgot-password',
    name: 'auth-forgot-password',
    component: () => import('@/views/auth/ForgotPassword.vue'),
    meta: {
      layout: 'full',
      resource: 'Auth',
      redirectIfLoggedIn: true,
    },
  },
  {
    path: '/reset-password',
    name: 'auth-reset-password',
    component: () => import('@/views/auth/ResetPassword.vue'),
    meta: {
      layout: 'full',
      resource: 'Auth',
      redirectIfLoggedIn: true,
    },
  },
  {
    path: '/verify-email',
    name: 'auth-verify-email',
    component: () => import('@/views/auth/VerifyEmail.vue'),
    props: true,
    meta: {
      layout: 'full',
      resource: 'Auth',
      redirectIfLoggedIn: true,
    },
  },
  {
    path: '/not-authorized',
    name: 'not-authorized',
    component: () => import('@/views/auth/NotAuthorized.vue'),
    props: true,
    meta: {
      layout: 'full',
      resource: 'Auth',
    },
  },
];
