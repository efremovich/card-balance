<template>
  <b-card>
    <!-- media -->
    <b-media no-body>
      <b-media-aside>
        <b-link>
          <b-img
            ref="previewEl"
            rounded
            src="../assets/images/cards-icon/GPO.svg"
            height="104" />
        </b-link>
        <!--/ avatar -->
      </b-media-aside>

      <b-media-body class="mt-75 ml-75">
        <!-- upload button -->
        <b-button
          v-b-tooltip.hover.bottom="'Добавьте изображение в формате JPG, GIF или PNG. Размер изображения < 800kB'"
          variant="primary"
          size="sm"
          class="mb-75 mr-75"
          @click="$refs.refInputEl.$el.click()">
          Загрузить
        </b-button>
        <b-form-file
          ref="refInputEl"
          v-model="profileFile"
          accept=".jpg, .png, .gif"
          :hidden="true"
          plain
          @input="inputImageRenderer" />
        <!--/ upload button -->

        <!-- reset -->
        <b-button
          variant="outline-secondary"
          size="sm"
          class="mb-75 mr-75">
          Сброс
        </b-button>
        <!--/ reset -->
        <!-- <b-card-text>Добавьте изображение в формате JPG, GIF or PNG. Максимальный размер изображения - 800kB</b-card-text> -->
      </b-media-body>
    </b-media>
    <!--/ media -->
    <validation-observer ref="simpleRules">
      <!-- form -->
      <b-form
        class="mt-2"
        @submit.prevent="onSubmit"
        @change="validateForm">
        <b-row>
          <b-col sm="6">
            <b-form-group
              label="Имя пользователя:"
              label-for="userName">
              <b-form-input
                id="userName"
                v-model="getInfo.company.name"
                placeholder="Имя" />
            </b-form-group>
          </b-col>
          <b-col sm="6">
            <b-form-group
              label="Телефон:"
              label-for="name">
              <b-form-input
                id="name"
                v-model="getInfo.company.name"
                placeholder="Телефон" />
            </b-form-group>
          </b-col>
          <b-col sm="6">
            <b-form-group
              label="Электронная почта:"
              label-for="email">
              <b-form-input
                id="email"
                v-model="getInfo.account.email"
                placeholder="Электронная почта" />
            </b-form-group>
          </b-col>
          <b-col sm="6">
            <b-form-group
              label="Организация:"
              label-for="company">
              <b-form-input
                id="company"
                v-model="getInfo.company.name"
                readonly
                placeholder="Организация" />
            </b-form-group>
          </b-col>

          <!-- old password -->
          <b-col md="6">
            <b-form-group
              label="Старый пароль:"
              label-for="account-old-password">
              <b-input-group class="input-group-merge">
                <b-form-input
                  id="account-old-password"
                  v-model="passwordValueOld"
                  name="old-password"
                  :type="passwordFieldTypeOld" />
                <b-input-group-append is-text>
                  <feather-icon
                    :icon="passwordToggleIconOld"
                    class="cursor-pointer"
                    @click="togglePasswordOld" />
                </b-input-group-append>
              </b-input-group>
            </b-form-group>
          </b-col>
          <!--/ old password -->

          <!-- new password -->
          <b-col md="6">
            <b-form-group
              label-for="account-new-password"
              label="Новый пароль:">
              <validation-provider
                v-slot="{ errors }"
                rules="password"
                name="`новым паролем`"
                vid="password">
                <b-input-group class="input-group-merge">
                  <b-form-input
                    id="account-new-password"
                    v-model="newPasswordValue"
                    :type="passwordFieldTypeNew"
                    name="new-password"
                    placeholder="Введите новый пароль" />
                  <b-input-group-append is-text>
                    <feather-icon
                      :icon="passwordToggleIconNew"
                      class="cursor-pointer"
                      @click="togglePasswordNew" />
                  </b-input-group-append>
                </b-input-group>
                <small class="text-danger">{{ errors[0] }}</small>
              </validation-provider>
            </b-form-group>
          </b-col>
          <!--/ new password -->
          <!-- retype password -->
          <b-col
            v-if="newPasswordValue !== ''"
            md="6">
            <b-form-group
              label-for="account-retype-new-password"
              label="Повторите новый пароль:">
              <validation-provider
                v-slot="{ errors }"
                rules="required|confirmed:password"
                name=" ">
                <b-input-group class="input-group-merge">
                  <b-form-input
                    id="account-retype-new-password"
                    v-model="RetypePassword"
                    :type="passwordFieldTypeRetype"
                    name="retype-password"
                    placeholder="Введите новый пароль ещё раз" />
                  <b-input-group-append is-text>
                    <feather-icon
                      :icon="passwordToggleIconRetype"
                      class="cursor-pointer"
                      @click="togglePasswordRetype" />
                  </b-input-group-append>
                </b-input-group>
                <small class="text-danger">{{ errors[0] }}</small>
              </validation-provider>
            </b-form-group>
          </b-col>

          <b-col cols="12">
            <b-button
              :disabled="!comparison"
              type="submit"
              variant="primary"
              class="mt-2 mr-1">
              Сохранить
            </b-button>
            <b-button
              :disabled="!comparison"
              variant="outline-secondary"
              type="reset"
              class="mt-2"
              @click.prevent="undoChange">
              Отмена
            </b-button>
          </b-col>
        </b-row>
      </b-form>
    </validation-observer>
  </b-card>
</template>

<script>
import {
  BFormFile, BButton, BForm, VBTooltip, BInputGroupAppend, BInputGroup, BFormGroup, BFormInput, BRow, BCol, BCard, BMedia, BMediaAside, BMediaBody, BLink, BImg,
} from 'bootstrap-vue';
import { ValidationObserver, ValidationProvider } from 'vee-validate';
import {
  required, confirmed, password, length,
} from '@validations';
import ToastificationContent from '@core/components/toastification/ToastificationContent.vue';
import useJwt from '@/auth/jwt/useJwt';
import { useInputImageRenderer } from '@core/comp-functions/forms/form-utils';
import { ref } from '@vue/composition-api';
import useUsersList from './useUsersList';

export default {
  directives: {
    'b-tooltip': VBTooltip,
  },
  components: {
    ValidationProvider,
    ValidationObserver,
    BButton,
    BForm,
    BImg,
    BFormFile,
    BFormGroup,
    BFormInput,
    BRow,
    BCol,
    BCard,
    BMedia,
    BMediaAside,
    BMediaBody,
    BLink,
    BInputGroup,
    BInputGroupAppend,
  },

  setup() {
    const { resolveUserRoleVariant } = useUsersList();

    // ? Demo Purpose => Update image on click of update
    const refInputEl = ref(null);
    const previewEl = ref(null);

    const { inputImageRenderer } = useInputImageRenderer(refInputEl, (base64) => {
      // eslint-disable-next-line no-param-reassign
      this.getInfo.avatar = base64;
    });

    return {
      resolveUserRoleVariant,
      //  ? Demo - Update Image on click of update button
      refInputEl,
      previewEl,
      inputImageRenderer,
    };
  },

  data() {
    return {
      getInfo: null,
      source: null,
      twin: null,
      saveChange: null,
      passwordFieldTypeOld: 'password',
      passwordFieldTypeNew: 'password',
      passwordFieldTypeRetype: 'password',
      passwordValueOld: '',
      newPasswordValue: '',
      RetypePassword: '',
      required,
      confirmed,
      password,
      length,
      valid: false,
    };
  },

  computed: {
    comparison() {
      return ((JSON.stringify(this.getInfo) !== this.source) || this.valid === true);
    },
    passwordToggleIconOld() {
      return this.passwordFieldTypeOld === 'password' ? 'EyeIcon' : 'EyeOffIcon';
    },
    passwordToggleIconNew() {
      return this.passwordFieldTypeNew === 'password' ? 'EyeIcon' : 'EyeOffIcon';
    },
    passwordToggleIconRetype() {
      return this.passwordFieldTypeRetype === 'password' ? 'EyeIcon' : 'EyeOffIcon';
    },
  },
  created() {
    useJwt.getCurrenUser().then((response) => {
      if (response.data.status) {
        this.$store.dispatch('user/getUserData', response.data).then(() => {
          this.getInfo = response.data;
          this.twin = this.getInfo.account;
          this.source = JSON.stringify(response.data);
        });
      }
    });
  },
  methods: {
    onSubmit() {
      this.$refs.simpleRules.validate().then((success) => {
        if (success === true) {
          this.saveChange = true;
          useJwt.refreshGetCurrentUser(JSON.stringify(this.twin)).then((response) => {
            console.log(response);
            this.$toast({
              component: ToastificationContent,
              props: {
                title: 'Данные сохранены',
                icon: 'EditIcon',
                variant: 'success',
              },
            });
          });
        }
      });
    },

    validateForm() {
      this.$refs.simpleRules.validate().then((success) => {
        if (success) {
          this.valid = true;
        } else {
          this.valid = false;
        }
      });
    },
    undoChange() {
      useJwt.getCurrenUser().then((response) => {
        if (response.data.status) {
          this.$store.dispatch('user/getUserData', response.data).then(() => {
            this.getInfo = response.data;
            this.newPasswordValue = '';
            this.RetypePassword = '';
          });
        }
      });
    },
    togglePasswordOld() {
      this.passwordFieldTypeOld = this.passwordFieldTypeOld === 'password' ? 'text' : 'password';
    },
    togglePasswordNew() {
      this.passwordFieldTypeNew = this.passwordFieldTypeNew === 'password' ? 'text' : 'password';
    },
    togglePasswordRetype() {
      this.passwordFieldTypeRetype = this.passwordFieldTypeRetype === 'password' ? 'text' : 'password';
    },

  },

};
</script>
