<template>
  <div class="auth-wrapper auth-v1 px-2">
    <div class="auth-inner py-2">
      <!-- Verify Email-->
      <b-card class="mb-0">
        <b-link class="brand-logo">
          <!-- logo -->
          <vuexy-logo />
        </b-link>

        <b-card-title class="mb-1">
          Подтвердите свою электронную почту.
        </b-card-title>
        <b-card-text class="mb-2">
          Введите код из письма.
        </b-card-text>
        <!-- form -->
        <validation-observer ref="simpleRules">
          <b-form
            class="auth-forgot-password-form mt-2 col-xs-5"
            @submit.prevent="validationForm">
            <!-- email -->
            <b-form-group
              label="Код"
              label-for="verify-email">
              <validation-provider
                v-slot="{ errors }"
                name="Код"
                rules="required|digits:5">
                <b-form-input
                  id="verify-email"
                  v-model="confirm_code"
                  style="col"
                  :state="errors.length > 0 ? false:null"
                  name="verify-email"
                  placeholder="00000" />
                <small class="text-danger">{{ errors[0] }}</small>
              </validation-provider>
            </b-form-group>

            <!-- submit button -->
            <b-button
              variant="primary"
              block
              type="submit">
              Подтвердить
            </b-button>
          </b-form>
          <b-button
            variant="flat-primary"
            block
            :disabled="currentTime!=0">
            Отправить код повторно через {{ currentTime }} секунд
          </b-button>
        </validation-observer>
      </b-card>
      <!-- /Forgot Password v1 -->
    </div>
  </div>
</template>

<script>
import ToastificationContent from '@core/components/toastification/ToastificationContent.vue';
// eslint-disable-next-line import/extensions
import useJwt from '@/auth/jwt/useJwt';
import { ValidationProvider, ValidationObserver } from 'vee-validate';
import VuexyLogo from '@core/layouts/components/Logo.vue';
// eslint-disable-next-line import/extensions
import { getHomeRouteForLoggedInUser } from '@/auth/utils';
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
import { required, digits } from '@validations';

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
  props: {
    userEmail: {
      type: String,
      default: null,
    },
  },
  data() {
    return {
      pincode: '',
      currentTime: 120,
      timer: null,
      confirm_code: '',

      // validation
      required,
      digits,
    };
  },
  watch: {
    currentTime(time) {
      if (time === 0) {
        this.stopTimer();
      }
    },
  },
  mounted() {
    this.startTimer();
  },
  destroyed() {
    this.stopTimer();
  },
  methods: {
    startTimer() {
      this.timer = setInterval(() => {
        this.currentTime -= 1;
      }, 1000);
    },
    stopTimer() {
      clearTimeout(this.timer);
    },
    validationForm() {
      this.$refs.simpleRules.validate().then((success) => {
        if (success) {
          useJwt
            .verifyEmail({
              email: this.userEmail,
              confirm_code: this.confirm_code,
            })
            .then((response) => {
              if (response.data.status) {
                this.$store.dispatch('user/getUserData', response.data);
                this.$router.replace(getHomeRouteForLoggedInUser('admin'));
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
                });
              }
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
