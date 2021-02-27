<template>
  <div>
    <b-container
      fluid
      class="pb-2"
    >
      <b-row>
        <b-col />
        <b-col class="d-flex justify-content-center">
          <vuexy-logo />
        </b-col>
        <b-col class="d-flex justify-content-end">
          <b-button
            variant="flat-primary"
            @click="logout"
          >
            <feather-icon icon="LogOutIcon" /> Выход
          </b-button>

        </b-col>
      </b-row>
    </b-container>
    <b-container
      fluid
      class="pb-2"
    >
      <b-row>
        <b-col>
          <b-card-body
            class="pb-0 cursor-pointer"
            @click="addCard"
          >
            <b-card title="Добавить карту">
              <div class="d-flex justify-content-center mb-3">
                <feather-icon
                  size="60"
                  icon="PlusIcon"
                  class="text-muted cursor-pointer"
                />
              </div>
            </b-card>
          </b-card-body>
        </b-col>
        <b-col>
          <b-card title="Kick start your project 🚀">
            <b-card-text>All the best for your new project.</b-card-text>
            <b-card-text>Please make sure to read our <b-link
              href="https://pixinvent.com/demo/vuexy-vuejs-admin-dashboard-template/documentation/"
              target="_blank"
            >
              Template Documentation
            </b-link> to understand where to go from here and how to use our template.</b-card-text>
          </b-card>
        </b-col>
      </b-row>
    </b-container>

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
import VuexyLogo from '@core/layouts/components/Logo.vue'
import ToastificationContent from '@core/components/toastification/ToastificationContent.vue'

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
  created() {
    useJwt.getCurrenUser().then(response => {
      if (response.data.status) {
        this.$store.dispatch('user/getUserData', response.data)
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
    addCard() {
      console.log('add card')
    },
  },
}
</script>

<style>
</style>
