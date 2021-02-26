<template>
  <div class="auth-wrapper auth-v1 px-2">
    <div class="auth-inner py-2">

      <!-- Login v1 -->
      <b-card class="mb-0">
        <b-link class="brand-logo">
          <vuexy-logo />
        </b-link>

        <b-card-title class="mb-1">
          Добро пожаловать.
        </b-card-title>
        <b-card-text class="mb-2">
          Для использования топливного кабинета, пожалуйста, авторизуйтесь.
        </b-card-text>

        <!-- form -->
        <validation-observer
          ref="loginForm"
          #default="{invalid}"
        >
          <b-form
            class="auth-login-form mt-2"
            @submit.prevent="login"
          >

            <!-- email -->
            <b-form-group
              label-for="email"
              label="Электронная почта"
            >
              <validation-provider
                #default="{ errors }"
                name="Email"
                rules="required|email"
              >
                <b-form-input
                  id="email"
                  v-model="userEmail"
                  name="login-email"
                  :state="errors.length > 0 ? false:null"
                  placeholder="ivan@mail.ru"
                  autofocus
                />
                <small class="text-danger">{{ errors[0] }}</small>
              </validation-provider>
            </b-form-group>

            <!-- password -->
            <b-form-group>
              <div class="d-flex justify-content-between">
                <label for="password">Пароль</label>
                <b-link :to="{name:'auth-forgot-password'}">
                  <small>Забыли пароль?</small>
                </b-link>
              </div>
              <validation-provider
                #default="{ errors }"
                name="Пароль"
                rules="required"
              >
                <b-input-group
                  class="input-group-merge"
                  :class="errors.length > 0 ? 'is-invalid':null"
                >
                  <b-form-input
                    id="password"
                    v-model="password"
                    :type="passwordFieldType"
                    class="form-control-merge"
                    :state="errors.length > 0 ? false:null"
                    name="login-password"
                    placeholder="Пароль"
                  />

                  <b-input-group-append is-text>
                    <feather-icon
                      class="cursor-pointer"
                      :icon="passwordToggleIcon"
                      @click="togglePasswordVisibility"
                    />
                  </b-input-group-append>
                </b-input-group>
                <small class="text-danger">{{ errors[0] }}</small>
              </validation-provider>
            </b-form-group>

            <!-- checkbox -->
            <b-form-group>
              <b-form-checkbox
                id="remember-me"
                v-model="status"
                name="checkbox-1"
              >
                Запомнить меня
              </b-form-checkbox>
            </b-form-group>

            <!-- submit button -->
            <b-button
              variant="primary"
              type="submit"
              block
              :disabled="invalid"
            >
              Авторизация
            </b-button>
          </b-form>
        </validation-observer>

        <b-card-text class="text-center mt-2">
          <span>Вы здесь впервые? </span>
          <b-link :to="{name:'auth-register'}">
            <span>Создать аккаунт</span>
          </b-link>
        </b-card-text>
      </b-card>
      <!-- /Login v1 -->
    </div>
  </div>
</template>

<script>
import { ValidationProvider, ValidationObserver } from 'vee-validate'
import VuexyLogo from '@core/layouts/components/Logo.vue'
import { required, email } from '@validations'
import { togglePasswordVisibility } from '@core/mixins/ui/forms'
import { getHomeRouteForLoggedInUser } from '@/auth/utils'
import useJwt from '@/auth/jwt/useJwt'
import ToastificationContent from '@core/components/toastification/ToastificationContent.vue'

import {
  BButton,
  BForm,
  BFormInput,
  BFormGroup,
  BCard,
  BLink,
  BCardTitle,
  BCardText,
  BInputGroup,
  BInputGroupAppend,
  BFormCheckbox,
} from 'bootstrap-vue'

export default {
  components: {
    // BSV
    BButton,
    BForm,
    BFormInput,
    BFormGroup,
    BCard,
    BCardTitle,
    BLink,
    VuexyLogo,
    BCardText,
    BInputGroup,
    BInputGroupAppend,
    BFormCheckbox,
    ValidationProvider,
    ValidationObserver,
  },
  mixins: [togglePasswordVisibility],
  data() {
    return {
      userEmail: '',
      password: '',
      status: '',
      // validation rules
      required,
      email,
    }
  },
  computed: {
    passwordToggleIcon() {
      return this.passwordFieldType === 'password' ? 'EyeIcon' : 'EyeOffIcon'
    },
  },
  methods: {
    login() {
      this.$refs.loginForm.validate().then(success => {
        if (success) {
          useJwt
            .login({
              email: this.userEmail,
              password: this.password,
            })
            .then(response => {
              if (response.data.status) {
                const { userData } = response.data.account
                useJwt.setToken(response.data.account.accessToken)
                useJwt.setRefreshToken(response.account.data.refreshToken)
                localStorage.setItem('userData', JSON.stringify(userData))
                this.$ability.update(userData.ability)
                // ? This is just for demo purpose. Don't think CASL is role based in this case, we used role in if condition just for ease
                this.$router.replace(getHomeRouteForLoggedInUser(userData.role))
                /* .then(() => { */
                /* this.$toast({ */
                /* component: ToastificationContent, */
                /* position: 'top-right', */
                /* props: { */
                /* title: `Welcome ${userData.fullName */
                /* || userData.username}`, */
                /* icon: 'CoffeeIcon', */
                /* variant: 'success', */
                /* text: `You have successfully logged in as ${userData.role}. Now you can start to explore!`, */
                /* }, */
                /* }) */
                /* }) */
                /* .catch(error => { */
                /* this.$refs.loginForm.setErrors(error.response.data.message) */
                /* }) */
              } else {
                this.$toast({
                  component: ToastificationContent,
                  position: 'top-right',
                  props: {
                    title: 'Ошибка',
                    icon: 'AlertOctagonIcon',
                    variant: 'danger',
                    text: response.data.message,
                  },
                })
              }
            })
        }
      })
    },
  },
}
</script>

<style lang="scss">
@import "@core/scss/vue/pages/page-auth.scss";
</style>
