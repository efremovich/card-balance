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
          <b-card title="Добавить карту">
            <div class="d-flex justify-content-center mb-3">
              <feather-icon
                size="60"
                icon="PlusIcon"
                class="text-muted cursor-pointer"
              />
            </div>
          </b-card>
        </b-col>
        <b-col>
          <b-card title="7824861010047300291">
            <div class="d-flex justify-content-between">
              <div>Баланс:</div>
              <div class="text-success">155255 руб.
                <div />

              </div>
            </div>
            <div class="d-flex justify-content-between">
              <div>
                <h4>Статус:</h4>
              </div>
              <div>Активна
                <div />

              </div>
            </div>
            <div class="d-flex justify-content-center">
              <b-button
                variant="primary"
                @click="logout"
              >
                <feather-icon icon="LockIcon" /> Заблокировать карту
              </b-button>

            </div>
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
    BButton,
    BContainer,
    BCol,
    BRow,
    VuexyLogo,
  },
  created() {
    useJwt
      .getCurrenUser()
      .then(response => {
        console.log('На форме:', response)
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
      .catch(err => console.log('err', err))
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
