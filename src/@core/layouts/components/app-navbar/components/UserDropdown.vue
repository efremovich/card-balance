<template>
  <b-nav-item-dropdown
    right
    toggle-class="d-flex align-items-center dropdown-user-link"
    class="dropdown-user">
    <template #button-content>
      <div class="d-sm-flex d-none user-nav">
        <p class="user-name font-weight-bolder mb-0">
          {{ userData.account.name }}
        </p>
      </div>
      <b-avatar
        size="50"
        :src="userData.account.avatar"
        variant="light-primary"
        class="badge-minimal"
        badge-variant="success" />
    </template>

    <b-dropdown-item :to="{ name: 'profile' }">
      <link class="d-flex align-items-center">
      <feather-icon
        size="16"
        icon="UserIcon"
        class="mr-50" />
      <span>Профиль</span>
    </b-dropdown-item>
    <b-dropdown-divider />

    <b-dropdown-item
      link-class="d-flex align-items-center"
      @click="change">
      <feather-icon
        size="16"
        icon="SettingsIcon"
        class="mr-50" />
      <span>Настройки</span>
    </b-dropdown-item>
    <b-dropdown-item
      link-class="d-flex align-items-center"
      @click="logout">
      <feather-icon
        size="16"
        icon="LogOutIcon"
        class="mr-50" />
      <span>Выход</span>
    </b-dropdown-item>
  </b-nav-item-dropdown>
</template>

<script>
import {
  BNavItemDropdown,
  BDropdownItem,
  BDropdownDivider,
  BAvatar,
} from 'bootstrap-vue';
// eslint-disable-next-line import/extensions
import { initialAbility } from '@/libs/acl/config';
// eslint-disable-next-line import/extensions
import useJwt from '@/auth/jwt/useJwt';
// eslint-disable-next-line import/extensions
import { avatarText } from '@core/utils/filter';

export default {
  components: {
    BNavItemDropdown,
    BDropdownItem,
    BDropdownDivider,
    BAvatar,
  },
  data() {
    return {
      userData: JSON.parse(localStorage.getItem('userData')),
      // userData: null,
      avatarText,
      visible: false,
    };
  },
  beforeCreate() {
    useJwt.getCurrenUser().then((response) => {
      if (!response.status) {
        this.$ability.update(initialAbility);
        // Redirect to login page
        this.$router.push({ name: 'auth-login' });
      }
    });
  },
  created() {
    useJwt.getCurrenUser().then((response) => {
      if (response.data.status) {
        this.$store.dispatch('user/getUserData', response.data).then(() => {
          this.userData = response.data;
        });
      }
    });
  },

  methods: {
    change() {
      this.$store.dispatch('getVisible');
      this.visible = true;
    },

    logout() {
      // Remove userData from localStorage
      // ? You just removed token from localStorage. If you like, you can also make API call to backend to blacklist used token
      localStorage.removeItem(useJwt.jwtConfig.storageTokenKeyName);
      localStorage.removeItem(useJwt.jwtConfig.storageRefreshTokenKeyName);

      // Remove userData from localStorage
      localStorage.removeItem('userData');

      // Reset ability
      this.$ability.update(initialAbility);

      // Redirect to login page
      this.$router.push({ name: 'auth-login' });
    },
  },
};
</script>
<style></style>
