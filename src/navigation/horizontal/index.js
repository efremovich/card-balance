export default [
  {
    title: 'Главная',
    route: 'dashboard',
    icon: 'HomeIcon',
  },
  {
    title: 'Топливные карты',
    route: 'cards',
    icon: 'FileIcon',
  },
  {
    title: 'Топливные карты II',
    route: 'card',
    icon: 'FileIcon',
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
  {
    title: 'Локатор',
    route: 'locator',
    icon: 'CompassIcon',
  },
];
