export default [
  {
    title: 'Главная',
    route: 'dashboard',
    icon: 'HomeIcon',
  },
  {
    title: 'Топливные карты',
    route: 'cards',
    icon: 'CreditCardIcon',
  },
  {
    title: 'Транзакции',
    route: 'transactions',
    icon: 'ListIcon',
  },
  {
    title: 'Отчёты и графики',
    route: 'report',
    icon: 'TrendingUpIcon',
  },

  {
    title: 'Документы',
    route: 'documents',
    icon: 'ArchiveIcon',
    children: [
      {
        url: '/requests',
        title: 'Заявки',
        route: 'requests',
        icon: 'CheckSquareIcon',
      },
      {
        url: '/documents/bill',
        title: 'Заказать счет',
        route: 'bill',
        icon: 'CheckSquareIcon',
      },
      {
        url: '/documents/checks',
        title: 'Электронные чеки',
        route: 'checks',
        icon: 'CheckSquareIcon',
      },
      {
        url: '/documents/payments',
        title: 'Платежи',
        route: 'payments',
        icon: 'CheckSquareIcon',
      },
    ],
  },
  // {
  //   title: 'Контакты',
  //   route: 'locator',
  //   icon: 'MapPinIcon',
  // },
];
