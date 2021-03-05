<template>
  <div :class="contentWidth === 'boxed' ? 'container p-0' : null">
    <div>
      <b-container
        fluid
        class="pb-2 pt-1"
      >
        <b-row align-v="center">
          <b-col>
            <b-avatar
              variant="light-primary"
              class="mr-1"
            />
            <span class="text-primary">
              {{ userData.account.name }}
            </span>
          </b-col>
          <b-col class="d-flex justify-content-center">
            <vuexy-logo />
          </b-col>
          <b-col
            class="d-flex justify-content-end align-items-center"
            align-self="center"
          >
            <b-button
              variant="flat-primary"
              @click="logout"
            >
              <feather-icon icon="LogOutIcon" /> Выход
            </b-button>

          </b-col>
        </b-row>
      </b-container>
    </div>
    <router-view />
  </div>
</template>

<script>
import useAppConfig from '@core/app-config/useAppConfig'
import ToastificationContent from '@core/components/toastification/ToastificationContent.vue'
import {
  BButton, BContainer, BCol, BRow, BAvatar,
} from 'bootstrap-vue'

import useJwt from '@/auth/jwt/useJwt'
import VuexyLogo from '@core/layouts/components/Logo.vue'

export default {
  components: {
    BButton,
    BContainer,
    BCol,
    BRow,
    VuexyLogo,
    BAvatar,
  },
  setup() {
    const { contentWidth } = useAppConfig()
    return { contentWidth }
  },
  data() {
    return {
      userData: JSON.parse(localStorage.getItem('userData')),
    }
  },
  created() {
    useJwt.getCurrenUser().then(response => {
      if (response.data.status) {
        this.$store.dispatch('user/getUserData', response.data).then(() => {
          this.userData = response.data
        })
      } else {
        this.$toast({
          component: ToastificationContent,
          position: 'top-right',
          props: {
            title: 'Oшибка',
            icon: 'alertoctagonicon',
            variant: 'danger',
            text: 'Ошибка авторизации',
          },
        })
        this.$router.push({ name: 'auth-login' })
      }
    })
  },
  methods: {
    logout() {
      useJwt.logout()
      this.$router.push({ name: 'auth-login' })
    },
  },
}
</script>
