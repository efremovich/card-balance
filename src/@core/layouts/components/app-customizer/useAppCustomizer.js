import { ref } from '@vue/composition-api';
// eslint-disable-next-line import/extensions
import useAppConfig from '@core/app-config/useAppConfig';

export default function useAppCustomizer() {
  // Customizer
  const isCustomizerOpen = ref(false);

  // Skin
  const skinOptions = [
    { text: 'Светлый', value: 'light' },
    { text: 'Без границ', value: 'bordered' },
    { text: 'Темный', value: 'dark' },
    { text: 'Полутёмный', value: 'semi-dark' },
  ];

  // Content Width Options
  const contentWidthOptions = [
    { text: 'На всю ширину', value: 'full' },
    { text: 'С отступом', value: 'boxed' },
  ];

  // Router Transition
  const routerTransitionOptions = [
    { title: 'Zoom Fade', value: 'zoom-fade' },
    { title: 'Fade', value: 'fade' },
    { title: 'Fade Bottom', value: 'fade-bottom' },
    { title: 'Slide Fade', value: 'slide-fade' },
    { title: 'Zoom Out', value: 'zoom-out' },
    { title: 'None', value: 'none' },
  ];

  // Router Transition
  const layoutTypeOptions = [
    { text: 'Вертикальное', value: 'vertical' },
    { text: 'Горизонтальное', value: 'horizontal' },
  ];

  // Navbar
  const navbarColors = ['', 'primary', 'secondary', 'success', 'danger', 'warning', 'info', 'dark'];

  // Navbar Types
  const navbarTypes = [
    { text: 'Плавающий', value: 'floating' },
    { text: 'Липкий', value: 'sticky' },
    { text: 'Статический', value: 'static' },
    { text: 'Скрытый', value: 'hidden' },
  ];

  // Footer Types
  const footerTypes = [
    { text: 'Липкий', value: 'sticky' },
    { text: 'Статический', value: 'static' },
    { text: 'Скрытый', value: 'hidden' },
  ];

  // eslint-disable-next-line object-curly-newline
  const {
    isRTL,
    skin,
    contentWidth,
    routerTransition,
    layoutType,
    isNavMenuHidden,
    isVerticalMenuCollapsed,
    navbarBackgroundColor,
    navbarType,
    footerType,
  } = useAppConfig();

  return {
    // Customizer
    isCustomizerOpen,

    // Vertical Menu
    isVerticalMenuCollapsed,

    // Skin
    skin,
    skinOptions,

    // Content Width
    contentWidth,
    contentWidthOptions,

    // RTL
    isRTL,

    // routerTransition
    routerTransition,
    routerTransitionOptions,

    // Layout Type
    layoutType,
    layoutTypeOptions,

    // NavMenu Hidden
    isNavMenuHidden,

    // Navbar
    navbarColors,
    navbarTypes,
    navbarBackgroundColor,
    navbarType,

    // Footer
    footerTypes,
    footerType,
  };
}
