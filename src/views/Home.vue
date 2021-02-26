<template>
  <div>
    <b-container fluid>
      <b-row cols="6">
        <b-col sm />
        <b-col
          sm
          class="pt-10"
        >
          <vuexy-logo />
        </b-col>
        <b-col
          sm
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
    <b-card title="Kick start your project 🚀">
      <b-card-text>All the best for your new project.</b-card-text>
      <b-card-text>Please make sure to read our <b-link
        href="https://pixinvent.com/demo/vuexy-vuejs-admin-dashboard-template/documentation/"
        target="_blank"
      >
        Template Documentation
      </b-link> to understand where to go from here and how to use our template.</b-card-text>
    </b-card>

    <b-card title="Want to integrate JWT? 🔒">
      <b-card-text>We carefully crafted JWT flow so you can implement JWT with ease and with minimum efforts.</b-card-text>
      <b-card-text>Please read our JWT Documentation to get more out of JWT authentication.</b-card-text>
    </b-card>
  </div>
</template>

<script>
import {
  BCard,
  BCardText,
  BLink,
  BButton,
  BContainer,
  BCol,
  BRow,
} from 'bootstrap-vue'

import useJwt from '@/auth/jwt/useJwt'
import ToastificationContent from '@core/components/toastification/ToastificationContent.vue'
import VuexyLogo from '@core/layouts/components/Logo.vue'

export default {
  components: {
    BCard,
    BCardText,
    BLink,
    BButton,
    BContainer,
    BCol,
    BRow,
    VuexyLogo,
  },
  methods: {
    logout() {
      useJwt.logout().then(response => {
        if (response.data.status) {
          this.$router.push({
            name: 'auth-verify-email',
            params: { userEmail: this.regEmail },
          })
        } else {
          this.$toast({
            component: ToastificationContent,
            props: {
              title: 'Ошибка',
              icon: 'AlertOctagonIcon',
              variant: 'danger',
              text: response.data.message,
            },
          })
        }
      })
    },
  },
}
</script>

<style>
</style>
