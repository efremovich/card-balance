<template>
  <div
    class="main-menu menu-fixed menu-accordion menu-shadow"
    :class="[
      {
        expanded:
          !isVerticalMenuCollapsed ||
          (isVerticalMenuCollapsed && isMouseHovered),
      },
      skin === 'semi-dark' ? 'menu-dark' : 'menu-light',
    ]"
    @mouseenter="updateMouseHovered(true)"
    @mouseleave="updateMouseHovered(false)">
    <!-- main menu header-->
    <div class="navbar-header expanded">
      <slot
        name="header"
        :toggleVerticalMenuActive="toggleVerticalMenuActive"
        :toggleCollapsed="toggleCollapsed"
        :collapseTogglerIcon="collapseTogglerIcon">
        <ul class="nav navbar-nav flex-row">
          <!-- Logo & Text -->
          <li class="nav-item mr-auto">
            <b-link
              class="navbar-brand"
              to="/">
              <span class="brand-logo">
                <b-img
                  :src="appLogoImage"
                  alt="logo" />
              </span>
              <h2 class="brand-text">
                {{ appName }}
              </h2>
            </b-link>
          </li>

          <!-- Toggler Button -->
          <li class="nav-item nav-toggle">
            <b-link class="nav-link modern-nav-toggle">
              <feather-icon
                icon="XIcon"
                size="20"
                class="d-block d-xl-none"
                @click="toggleVerticalMenuActive" />
              <feather-icon
                :icon="collapseTogglerIconFeather"
                size="20"
                class="d-none d-xl-block collapse-toggle-icon"
                @click="toggleCollapsed" />
            </b-link>
          </li>
        </ul>
      </slot>
    </div>
    <!-- / main menu header-->

    <!-- Shadow -->
    <div
      :class="{ 'd-block': shallShadowBottom }"
      class="shadow-bottom" />

    <!-- main menu content-->
    <vue-perfect-scrollbar
      :settings="perfectScrollbarSettings"
      class="main-menu-content scroll-area"
      tagname="ul"
      @ps-scroll-y="
        (evt) => {
          shallShadowBottom = evt.srcElement.scrollTop > 0;
        }
      ">
      <vertical-nav-menu-items
        :items="navMenuItems"
        class="navigation navigation-main" />
      <div
        class="d-flex flex-column align-items-center w-100">
        <h6 class="mt-1 mr-1">
          Клиент:
        </h6>
        <v-select
          v-model="selected"
          label="name"
          :options="option"
          :clearable="false"
          class="w-75"
          @input="getContractName" />
      </div>
    </vue-perfect-scrollbar>
    <!-- /main menu content-->
  </div>
</template>

<script>
import navMenuItems from '@/navigation/vertical';
import VuePerfectScrollbar from 'vue-perfect-scrollbar';
import { BLink, BImg } from 'bootstrap-vue';
import { provide, computed, ref } from '@vue/composition-api';
import useAppConfig from '@core/app-config/useAppConfig';
import { $themeConfig } from '@themeConfig';
import vSelect from 'vue-select';
import store from '@/store';
// import { mapGetters } from 'vuex';
import VerticalNavMenuItems from './components/vertical-nav-menu-items/VerticalNavMenuItems.vue';
import useVerticalNavMenu from './useVerticalNavMenu';

export default {
  components: {
    VuePerfectScrollbar,
    VerticalNavMenuItems,
    BLink,
    BImg,
    vSelect,

  },
  props: {
    isVerticalMenuActive: {
      type: Boolean,
      required: true,
    },
    toggleVerticalMenuActive: {
      type: Function,
      required: true,
    },
  },
  setup(props) {
    const {
      isMouseHovered,
      isVerticalMenuCollapsed,
      collapseTogglerIcon,
      toggleCollapsed,
      updateMouseHovered,
    } = useVerticalNavMenu(props);

    const { skin } = useAppConfig();
    const option = ref([]);

    // Shadow bottom is UI specific and can be removed by user => It's not in `useVerticalNavMenu`
    const shallShadowBottom = ref(false);

    provide('isMouseHovered', isMouseHovered);

    const perfectScrollbarSettings = {
      maxScrollbarLength: 60,
      wheelPropagation: false,
    };

    const collapseTogglerIconFeather = computed(() => (collapseTogglerIcon.value === 'unpinned' ? 'CircleIcon' : 'DiscIcon'));
    const selected = ref(store.getters.COMPANY);
    const someA = computed(() => store.getters.ALL_COMPANIES);
    // eslint-disable-next-line no-plusplus
    for (let i = 0; i < someA.value.length; i++) {
      option.value.push(someA.value[i]);
    }
    // App Name
    const { appName, appLogoImage } = $themeConfig.app;
    const getContractName = () => {
      store.dispatch('getCompany', selected.value.name);
      store.dispatch('getCompanyId', selected.value.id);

      // const updateUser = {
      //   uid: 'iGxxfffAo0Rz816RNGMPKvWthVdf6cWsJw7WyFcg_do=',
      //   accessToken: 'eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJleHAiOjE2MjMzOTQ1MDksInN1YiI6ImlHeHhmZmZBbzBSejgxNlJOR01QS3ZXdGhWZGY2Y1dzSnc3V3lGY2dfZG89Iiwicm9sZSI6ImFkbWluIn0.KL4v32JbyuZFceRB6jI8T010edVrMeB-XE8khpCqOlMKxk9parQT2wfs0n3K3xFlsafJU-cxX10539igCpL25kpvaAslYXZZchlRe7Q3F2dgk_O7NDQ-CytaLhrsGJP82orfgzQ4YyxNB-c-TopcBTpg45RUrsPLuszouZkaEmVpS6m_02ti9VeKxx3gyrXQFVUgIcVha_tzFZK4NCVCMjrTDpq7Fwrb5AAoTo1y-U8U-c8OFZnbYGQiBuFYenMObZw41YLx6CcfLNaLwxoEkFdwZacs_GDC03bD_FBwSyp7_9mPNo1Na1tFJYs5FDdNvikxBJgg6LnjaLb4nMrywg',
      //   refreshToken: 'eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJleHAiOjE2MjM2NTI4MDksImp0aSI6IlFRT2NkQU5yV3oyb3NhQzVNVFduRURVdG9QYkRFZ09nblI4aktXVWJzNnM9Iiwic3ViIjoiaUd4eGZmZkFvMFJ6ODE2Uk5HTVBLdld0aFZkZjZjV3NKdzdXeUZjZ19kbz0iLCJyb2xlIjoiYWRtaW4ifQ.qXU64SU0FhVVknpTpjGejeBHlCbaamerncgV57NUAXTTJhICAyO2A8Q0IfdkxwLoW2EY9o2RqES6bwh5NAxb1LVdzBcKcUnEBa0RKYrWXXgy2-cOmScJxA2CWPAbed4DnpvGQi_cXZMqG4f2OqZ_YmEQzobW_oSh19sNI32D0SaNsjb1vcgYj974WpPdX9V7YinnFPdB5FyEIpi8HcOsj1RBOziLp15jQrlnL6u9wC9DGZIN32tD5arzSocUngKcAV9m-KlW82j55UmS0hQ9RRFAFVGRTVxgvMLVd86gbEMUa6NEdEkaJVCSRplym97cEfzthLaNEflRWtvuaUqnRw',
      //   is_mail_confirm: true,
      //   confirm_code: '',
      //   email: 'admin@fc.ru',
      //   contract_id: '4a8e263b-d740-11ea-9132-d017c2c9f767',
      //   status: 'active',
      //   role: 'admin',
      //   name: 'Хакер',
      //   phone: '+7892246643456456',
      // };
    };
    return {
      navMenuItems,
      perfectScrollbarSettings,
      isVerticalMenuCollapsed,
      collapseTogglerIcon,
      toggleCollapsed,
      isMouseHovered,
      updateMouseHovered,
      collapseTogglerIconFeather,

      // Shadow Bottom
      shallShadowBottom,

      // Skin
      skin,
      // eslint-disable-next-line no-undef
      selected,
      option,
      getContractName,

      // App Name
      appName,
      appLogoImage,
    };
  },
};
</script>

<style lang="scss">
@import "~@core/scss/base/core/menu/menu-types/vertical-menu.scss";
</style>
