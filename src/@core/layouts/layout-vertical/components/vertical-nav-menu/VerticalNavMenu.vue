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
        v-if="admin === 'admin'"
        class="d-flex flex-column align-items-center w-100">
        <h6 class="mt-1 mr-1">
          Клиент:
        </h6>
        <v-select
          v-model="selected"
          label="name"
          :options="allCompanies"
          :clearable="false"
          :filter="filter"
          class="w-75"
          @input="getContractName" />
      </div>
    </vue-perfect-scrollbar>
    <!-- /main menu content-->
  </div>
</template>

<script>
// import navMenuItems from '@/navigation/vertical';
import VuePerfectScrollbar from 'vue-perfect-scrollbar';
import { BLink, BImg } from 'bootstrap-vue';
import { provide, computed, ref } from '@vue/composition-api';
import { $themeConfig } from '@themeConfig';
import vSelect from 'vue-select';
import Fuse from 'fuse.js';
import { mapGetters } from 'vuex';
// eslint-disable-next-line import/extensions
import useJwt from '@/auth/jwt/useJwt';
// eslint-disable-next-line import/extensions
import useAppConfig from '@core/app-config/useAppConfig'; // @core/app-config/useAppConfig
// eslint-disable-next-line import/extensions
import store from '@/store'; // @/store
// import useJwt from '../../../../auth/jwt/useJwt'; // @/auth/jwt/useJwt
// eslint-disable-next-line import/extensions
import navMenuItems from '@/navigation/vertical/index.js';
import useVerticalNavMenu from './useVerticalNavMenu';
import VerticalNavMenuItems from './components/vertical-nav-menu-items/VerticalNavMenuItems.vue';

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
    // const admin = store.getters.ADMIN;
    const { skin } = useAppConfig();
    // const option = ref([]);

    // Shadow bottom is UI specific and can be removed by user => It's not in `useVerticalNavMenu`
    const shallShadowBottom = ref(false);

    provide('isMouseHovered', isMouseHovered);

    const perfectScrollbarSettings = {
      maxScrollbarLength: 60,
      wheelPropagation: false,
    };

    const collapseTogglerIconFeather = computed(() => (collapseTogglerIcon.value === 'unpinned' ? 'CircleIcon' : 'DiscIcon'));

    const filter = (options, search) => {
      const fuse = new Fuse(options, {
        keys: ['name'],
        shouldSort: true,
      });
      return search.length
        ? fuse.search(search).map(({ item }) => item)
        : fuse.list;
    };

    // App Name
    const { appName, appLogoImage } = $themeConfig.app;

    return {
      // admin,
      navMenuItems,
      perfectScrollbarSettings,
      isVerticalMenuCollapsed,
      collapseTogglerIcon,
      toggleCollapsed,
      isMouseHovered,
      updateMouseHovered,
      collapseTogglerIconFeather,
      // index,

      // Shadow Bottom
      shallShadowBottom,
      filter,
      // Skin
      skin,
      // selected,
      // option,
      // getContractName,

      // App Name
      appName,
      appLogoImage,
    };
  },

  data() {
    return {
      selected: this.$store.getters.COMPANY,
      allCompanies: [],
      loadDone: false,
      admin: store.getters.ADMIN,
    };
  },

  computed: {
    ...mapGetters({
      getAdmin: 'ADMIN',
      gotSelected: 'COMPANY',
    }),
  // selected() {
  //   if (this.selected.length > 15) {
  //     return `${this.userData.account.name.slice(0, 10 - 1)}…`;
  //   }
  //   return this.selected.length;
  // },
  },
  watch: {
    admin: {
      handler(newVal) {
        this.$store.dispatch('getAdmin', newVal);
        localStorage.setItem('admin', JSON.stringify(newVal));
      },
    },
    // selected(old, val) {
    //   // localStorage.setItem('selected', JSON.stringify(val.name));
    //   console.log(old, val);
    // },
    selected: {
      // get() {
      //   return this.$store.getters.COMPANY;
      // },
      // set(value) {
      //   this.$store.dispatch('getCompany', value.name);
      //   this.$store.dispatch('getContractId', value.id);
      // },
      handler(newVal) {
        // console.log('handler', newVal);
        this.$store.dispatch('getCompany', newVal.name);
        this.$store.dispatch('getContractId', newVal.id);
        // localStorage.setItem('selected', (newVal.name));
        this.getContractName(newVal);
      },
    },

  },
  created() {
    this.admin = JSON.parse(localStorage.getItem('admin'));
    // this.allCompanies = this.$store.getters.ALL_COMPANIES;
    if ((this.$store.state.selectedCompany !== null) || (this.$store.state.selectedCompany !== undefined)) {
      this.selected = this.$store.getters.COMPANY;
      this.loadDone = true;
    }

    if (this.$store.state.companies == null) {
      this.loadDone = true;
    } else {
      this.loadDone = true;
    }
    this.getAllComp();
  },
  methods: {
    getContractName(val) {
      this.$store.dispatch('getCompany', val.name);
      this.$store.dispatch('getCompanyId', val.id);
    },
    getAllComp() {
      useJwt.getAllCompanies().then((response) => {
        if (response.data.status) {
          this.allCompanies = response.data;
          const companies = this.allCompanies.data;
          this.allCompanies = companies;
          this.$store.dispatch('getAllCompanies', companies);
        }
      });
    },
  },
};
</script>

<style lang="scss">
@import "~@core/scss/base/core/menu/menu-types/vertical-menu.scss";
</style>
