<template>
  <div class="auth-wrapper auth-v1 px-2">
    <div class="auth-inner py-2">
      <!-- Reset Password v1 -->
      <b-card class="mb-0">
        <!-- logo -->
        <b-link class="brand-logo">
          <vuexy-logo />

          <h2 class="brand-text text-primary ml-1">
            КТК
          </h2>
        </b-link>

        <b-card-title class="mb-1">
          Сбросить пароль 🔒
        </b-card-title>
        <b-card-text class="mb-2">
          Ваш новый пароль должен отличаться от используемого ранее:
        </b-card-text>

        <!-- form -->
        <validation-observer ref="simpleRules">
          <b-form
            method="submit"
            class="auth-reset-password-form mt-2"
            @submit.prevent="validationForm">
            <!-- password -->
            <b-form-group
              label="Новый пароль"
              label-for="reset-password-new">
              <validation-provider
                v-slot="{ errors }"
                name="`Новый пароль`"
                vid="Password"
                rules="required|password">
                <b-input-group
                  class="input-group-merge"
                  :class="errors.length > 0 ? 'is-invalid':null">
                  <b-form-input
                    id="reset-password-new"
                    v-model="password"
                    :type="password1FieldType"
                    :state="errors.length > 0 ? false:null"
                    class="form-control-merge"
                    name="reset-password-new"
                    placeholder="············" />
                  <b-input-group-append is-text>
                    <feather-icon
                      class="cursor-pointer"
                      :icon="password1ToggleIcon"
                      @click="togglePassword1Visibility" />
                  </b-input-group-append>
                </b-input-group>
                <small class="text-danger">{{ errors[0] }}</small>
              </validation-provider>
            </b-form-group>

            <!-- confirm password -->
            <b-form-group
              label-for="reset-password-confirm"
              label="Повторите новый пароль">
              <validation-provider
                v-slot="{ errors }"
                name="`Повторите новый пароль`"
                rules="required|confirmed:Password">
                <b-input-group
                  class="input-group-merge"
                  :class="errors.length > 0 ? 'is-invalid':null">
                  <b-form-input
                    id="reset-password-confirm"
                    v-model="cPassword"
                    :type="password2FieldType"
                    class="form-control-merge"
                    :state="errors.length > 0 ? false:null"
                    name="reset-password-confirm"
                    placeholder="············" />
                  <b-input-group-append is-text>
                    <feather-icon
                      class="cursor-pointer"
                      :icon="password2ToggleIcon"
                      @click="togglePassword2Visibility" />
                  </b-input-group-append>
                </b-input-group>
                <small class="text-danger">{{ errors[0] }}</small>
              </validation-provider>
            </b-form-group>

            <!-- submit button -->
            <b-button
              block
              type="submit"
              variant="primary">
              Установите новый пароль
            </b-button>
          </b-form>
        </validation-observer>

        <p class="text-center mt-2">
          <b-link :to="{name:'auth-login-v1'}">
            <feather-icon icon="ChevronLeftIcon" /> Вернуться к странице авторизации
          </b-link>
        </p>
      </b-card>
    <!-- /Reset Password v1 -->
    </div>
  </div>
</template>

<script>
import { ValidationProvider, ValidationObserver } from 'vee-validate';
import VuexyLogo from '@core/layouts/components/Logo.vue';
import {
  BCard, BCardTitle, BCardText, BForm, BFormGroup, BInputGroup, BInputGroupAppend, BLink, BFormInput, BButton,
} from 'bootstrap-vue';
import { required } from '@validations';
// eslint-disable-next-line import/extensions, import/no-cycle
import useJwt from '@/auth/jwt/useJwt';
// eslint-disable-next-line import/extensions
import store from '@/store';
import ToastificationContent from '@core/components/toastification/ToastificationContent.vue';

export default {
  components: {
    VuexyLogo,
    BCard,
    BButton,
    BCardTitle,
    BCardText,
    BForm,
    BFormGroup,
    BInputGroup,
    BLink,
    BFormInput,
    BInputGroupAppend,
    ValidationProvider,
    ValidationObserver,
  },
  data() {
    return {
      userEmail: '',
      cPassword: '',
      password: '',
      // validation
      required,
      getInfo: null,
      empty: null,
      // Toggle Password
      password1FieldType: 'password',
      password2FieldType: 'password',
    };
  },
  computed: {
    password1ToggleIcon() {
      return this.password1FieldType === 'password' ? 'EyeIcon' : 'EyeOffIcon';
    },
    password2ToggleIcon() {
      return this.password2FieldType === 'password' ? 'EyeIcon' : 'EyeOffIcon';
    },
  },
  methods: {
    togglePassword1Visibility() {
      this.password1FieldType = this.password1FieldType === 'password' ? 'text' : 'password';
    },
    togglePassword2Visibility() {
      this.password2FieldType = this.password2FieldType === 'password' ? 'text' : 'password';
    },
    // validationForm() {
    //   this.$refs.simpleRules.validate().then((success) => {
    //     if (success) {
    //       this.$toast({
    //         component: ToastificationContent,
    //         props: {
    //           title: 'Form Submitted',
    //           icon: 'EditIcon',
    //           variant: 'success',
    //         },
    //       });
    //     }
    //   });
    // },
    validationForm() {
      this.$refs.simpleRules.validate().then((success) => {
        if (success) {
          const newPassword = {
            new_password: this.password,
            old_password: '',
            email: store.getters.EMAIL,
          };
          useJwt.changePassword(JSON.stringify(newPassword)).then((response) => {
            this.empty = response;
            this.$toast({
              component: ToastificationContent,
              props: {
                title: 'Пароль изменён',
                icon: 'EditIcon',
                variant: 'success',
              },
            });
          });
        }
      });
    },
  },
};
</script>

<style lang="scss">
@import "@core/scss/vue/pages/page-auth.scss";
</style>
