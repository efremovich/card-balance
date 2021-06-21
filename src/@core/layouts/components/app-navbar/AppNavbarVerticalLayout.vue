<template
  :key="visible">
  <div class="navbar-container d-flex content justify-content-evenly align-items-center">
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
      class="bookmark-wrapper align-items-center flex-grow-1 d-none d-lg-flex">
      <!-- Bookmarks Container -->
      <bookmarks />
    </div>
    <div class="d-flex w-50">
      <div class="d-flex w-75 justify-content-end align-items-center">
        <h6 class="p-1">
          Договор №:
        </h6>
        <v-select
          v-model="selected"
          :clearable="false"
          class="w-50 mt-1 mb-1"
          @input="onChange()" />
      </div>
      <b-navbar-nav class="nav align-items-center ml-auto w-50">
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
import vSelect from 'vue-select';
import useJwt from '@/auth/jwt/useJwt';
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
      visible: this.$store.state.visible,
      userData: null,
      option: null,
    };
  },
  created() {
    useJwt.getCurrenUser().then((response) => {
      if (response.data.status) {
        this.$store.dispatch('user/getUserData', response.data).then(() => {
          this.userData = response.data;
          // console.log(this.userData);
          this.makeOptions();
          this.getSelected();
        });
      }
    });

    this.userData = JSON.parse(localStorage.getItem('userData'));
    if (this.userData) {
      this.getInfo = this.userData;
      return this.getInfo;
    }
    return { data: { status: false } };
  },
  updated() {
    console.log('qewrewrqwre');
  },
  methods: {
    getSelected() {
      this.selected = this.userData.contract.number;
    },
    makeOptions() {
      this.userData.contracts.forEach((el) => {
        this.option.push({ 'number': el.number, 'id': el.id });
      });
    },
  },
};
</script>
