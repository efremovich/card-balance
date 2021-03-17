<template>
  <div class="auth-wrapper auth-v1 px-2">
    <div class="auth-inner py-2">
      <!-- Forgot Password v1 -->
      <b-card class="mb-0">
        <b-link class="brand-logo">
          <!-- logo -->
          <vuexy-logo />

          <h2 class="brand-text text-primary ml-1">
            КТК
          </h2>
        </b-link>

        <b-card-title class="mb-1">
          Забыли пароль? 🔒
        </b-card-title>
        <b-card-text class="mb-2">
          Введите свой адрес электронной почты и следуйте инструкциям для установки нового пароля
        </b-card-text>

        <!-- form -->
        <validation-observer ref="simpleRules">
          <b-form
            class="auth-forgot-password-form mt-2"
            @submit.prevent="validationForm">
            <!-- email -->
            <b-form-group
              label="Email"
              label-for="forgot-password-email">
              <validation-provider
                v-slot="{ errors }"
                name="Email"
                rules="required|email">
                <b-form-input
                  id="forgot-password-email"
                  v-model="userEmail"
                  :state="errors.length > 0 ? false:null"
                  name="forgot-password-email"
                  placeholder="john@example.com" />
                <small class="text-danger">{{ errors[0] }}</small>
              </validation-provider>
            </b-form-group>

            <!-- submit button -->
            <b-button
              variant="primary"
              block
              type="submit">
              Направить ссылку для сброса пароля
            </b-button>
          </b-form>
        </validation-observer>

        <b-card-text class="text-center mt-2">
          <b-link :to="{name:'auth-login'}">
            <feather-icon icon="ChevronLeftIcon" /> Вернуться на страницу авторизации
          </b-link>
        </b-card-text>
      </b-card>
      <!-- /Forgot Password v1 -->
    </div>
  </div>
</template>

<script>
import { ValidationProvider, ValidationObserver } from 'vee-validate';
import VuexyLogo from '@core/layouts/components/Logo.vue';
import {
  BCard,
  BLink,
  BCardText,
  BCardTitle,
  BFormGroup,
  BFormInput,
  BForm,
  BButton,
} from 'bootstrap-vue';
import { required, email } from '@validations';

export default {
  components: {
    VuexyLogo,
    BCard,
    BLink,
    BCardText,
    BCardTitle,
    BFormGroup,
    BFormInput,
    BButton,
    BForm,
    ValidationProvider,
    ValidationObserver,
  },
  data() {
    return {
      userEmail: '',
      // validation
      required,
      email,
    };
  },
  methods: {
    validationForm() {
      this.$refs.simpleRules.validate().then((success) => {
        if (success) {
          this.$router.push({ name: 'auth-reset-password' });
        }
      });
    },
  },
};
</script>

<style lang="scss">
@import "@core/scss/vue/pages/page-auth.scss";
</style>
