<template>
  <div class="navbar-container d-flex content justify-content-between align-items-center">
    <!-- Nav Menu Toggler -->
    <ul class="nav navbar-nav d-xl-none">
      <li class="nav-item">
        <b-link
          class="nav-link"
          @click="toggleVerticalMenuActive">
          <feather-icon
            icon="MenuIcon"
            size="21" />
        </b-link>
      </li>
    </ul>

    <!-- Left Col -->
    <div
      class="bookmark-wrapper align-items-center flex-grow-1 d-none d-lg-flex w-25">
      <!-- Bookmarks Container -->
      <bookmarks />
    </div>
    <div
      class="d-flex w-100">
      <div
        v-if="getWidth !== 'xs'"

        class="d-flex w-100 justify-content-center align-items-center">
        <h6 class="mt-1 mr-1 min-vw-25">
          Договор №:
        </h6>
        <v-select
          v-model="selected"
          label="number"
          :options="option"
          :clearable="false"
          class="w-75"
          style="max-heigth:30px;" />
      </div>
      <b-navbar-nav class="nav flex-nowrap align-items-center justify-content-end ml-auto w-25">
        <dark-Toggler class="d-none d-lg-block" />
        <search-bar />
        <notification-dropdown />
        <user-dropdown />
      </b-navbar-nav>
    </div>
  </div>
</template>

<script>
import { BLink, BNavbarNav } from 'bootstrap-vue';
import { mapGetters } from 'vuex';
import vSelect from 'vue-select';
import useJwt from '@/auth/jwt/useJwt';
import store from '@/store';
import Bookmarks from './components/Bookmarks.vue';
import SearchBar from './components/SearchBar.vue';
import DarkToggler from './components/DarkToggler.vue';
import NotificationDropdown from './components/NotificationDropdown.vue';
import UserDropdown from './components/UserDropdown.vue';

export default {
  components: {
    BLink,
    // Navbar Components
    BNavbarNav,
    Bookmarks,
    SearchBar,
    DarkToggler,
    NotificationDropdown,
    UserDropdown,
    vSelect,
  },
  props: {
    toggleVerticalMenuActive: {
      type: Function,
      default: () => {},
    },
  },
  data() {
    return {
      userData: null,
      option: [],
      // getInfo: null,
      contract: null,
    };
  },
  computed: {
    getWidth() {
      return store.getters['app/currentBreakPoint'];
    },
    ...mapGetters({
      gotSelected: 'CONTRACT_NUMBER',
      gotSelectedContract: 'CONTRACT_ID',
      gotOrgId: 'COMPANY_ID',
    }),
    selected: {
      get() {
        return this.gotSelected;
      },
      set(value) {
        this.$store.dispatch('getContractNumber', value.number);
        this.$store.dispatch('getContractId', value.id);
      },
    },
  },
  watch: {
    getWidth() {
      return this.getWidth;
    },
    gotOrgId(val) {
      useJwt.getConsumer(val)
        .then((status) => {
          if (status.status) {
            this.consumer = status.data;
            this.option = [];
            this.makeOptions(this.consumer.data);
            // eslint-disable-next-line prefer-destructuring
            this.selected = this.option[0];
          }
        });
    },
  },

  beforeMount() {
    useJwt.getCurrenUser().then((response) => {
      if (response.data.status) {
        this.$store.dispatch('user/getUserData', response.data).then(() => {
          this.userData = response.data;
          this.$store.dispatch('getEmail', this.userData.account.email);
          this.makeOptions(this.userData);
          this.getSelected();
        });
      }
    });
    // this.userData = JSON.parse(localStorage.getItem('userData'));
    // if (this.userData) {
    //   this.getInfo = this.userData;
    // }
    return { data: { status: false } };
  },
  methods: {
    getSelected() {
      this.selected = this.userData.contract;
    },
    makeOptions(val) {
      val.contracts.forEach((el) => {
        this.option.push({ 'number': el.number, 'id': el.id });
      });
    },

    // onChange() {
    //   this.$store.commit('changeContractId', this.selected.id);
    //   this.$store.commit('changeContractNumber', this.selected.number);
    // },
  },
};
</script>
