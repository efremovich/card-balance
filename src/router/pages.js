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
    path: '/Cards',
    name: 'cards',
    component: () => import('@/views/Cards.vue'),
  },

  {
    path: '/CardDetails',
    name: 'card',
    component: () => import('@/views/CardDetails.vue'),
  },

  {
    path: '/transactions',
    name: 'transactions',
    component: () => import('@/views/Transactions.vue'),
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
        { title: 'Главная', url: '/' },
        { title: 'Документы' },
        { title: 'Платежи', active: true },
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
        { title: 'Главная', url: '/' },
        { title: 'Документы' },
        { title: 'Электронные чеки' },
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
        { title: 'Главная', url: '/' },
        { title: 'Документы' },
        { title: 'Заявки', active: true },
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
