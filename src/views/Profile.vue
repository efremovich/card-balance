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

    <!-- form -->
    <!-- @submit.prevent="onSubmit" -->
    <validation-observer
      ref="userData">
      <b-form
        class="mt-2"
        @input="validateForm">
        <b-row>
          <b-col sm="6">
            <b-form-group
              label="Имя пользователя:"
              label-for="userName">
              <b-form-input
                id="userName"
                v-model="getInfo.account.name"
                placeholder="Имя" />
            </b-form-group>
          </b-col>
          <b-col sm="6">
            <b-form-group
              label="Электронная почта:"
              label-for="email">
              <b-form-input
                id="email"
                :value="getInfo.account.email"
                readonly
                placeholder="Электронная почта" />
            </b-form-group>
          </b-col>
          <b-col sm="6">
            <b-form-group
              label="Телефон:"
              label-for="name">
              <validation-provider
                v-slot="{ errors }"
                rules="integer|min:11"
                name="Телефон">
                <b-form-input
                  id="name"
                  v-model="getInfo.account.phone"
                  placeholder="Телефон" />
                <small class="text-danger">{{ errors[0] }}</small>
              </validation-provider>
            </b-form-group>
          </b-col>
          <b-col sm="6">
            <b-form-group
              label="Организация:"
              label-for="company">
              <b-form-input
                id="company"
                :value="getInfo.company.name"
                readonly
                placeholder="Организация" />
            </b-form-group>
          </b-col>
          <b-col
            sm="6"
            class="mb-1">
            <b-button
              :disabled="!comparison"
              variant="primary"
              class="mt-2 mr-1"
              @click="onSubmit">
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
          <b-col sm="6">
            <b-link
              class=" w-100 d-flex"
              @click="toogleSeen">
              <div
                v-b-tooltip.hover.bottom="'Нажав здесь вы сможете сменить пароль.'"
                class="d-flex">
                <h3>Сменить пароль</h3>
                <feather-icon
                  v-if="!seen"
                  icon="LockIcon"
                  size="16"
                  class="align-text-top ml-1" />
                <feather-icon
                  v-if="seen"
                  icon="UnlockIcon"
                  size="16"
                  class="align-text-top ml-1" />
              </div>
            </b-link>
            <validation-observer
              ref="simpleRules">
              <!-- @submit.prevent="changePassword" -->
              <b-form
                v-if="seen"
                @input="validatePassword">
                <b-link
                  id="popover-reactive-1"
                  ref="link"
                  class="d-flex justify-content-end pr-1">
                  <h6
                    v-b-tooltip.hover.bottom="'Нажав здесь вы сможете восстановить пароль.'">
                    Забыли пароль?
                  </h6>

                  <b-popover
                    ref="popover"
                    target="popover-reactive-1"
                    triggers="click"
                    :show.sync="popoverShow"
                    placement="auto"
                    container="my-container">
                    <template #title>
                      <div class="d-flex justify-content-between align-items-center">
                        <span>Уведомление</span>
                        <b-button
                          class="close"
                          variant="transparent"
                          aria-label="Close"
                          @click="onClose">
                          <span
                            class="d-inline-block text-white"
                            aria-hidden="true">&times;</span>
                        </b-button>
                      </div>
                    </template>

                    <div class="pd-1">
                      <h5>На электронный адрес {{ getInfo.account.email }} будет отправлена ссылка для восстановления пароля.</h5>
                      <b-button
                        class="mt-1"
                        size="sm"
                        variant="primary"
                        @click="onOk">
                        Отправить
                      </b-button>
                    </div>
                  </b-popover>
                </b-link>
                <b-col
                  md="12">
                  <b-form-group
                    key="passwordOld"
                    v-b-tooltip.hover.bottom="'Ваш действующий пароль'"
                    label="Текущий пароль:"
                    label-for="account-old-password">
                    <b-input-group class="input-group-merge">
                      <b-form-input
                        id="account-old-password"
                        key="oldPassword"
                        :value="$store.state.password[1]"
                        :type="passwordFieldTypeOld"
                        name="old-password"
                        placeholder="Введите текущий пароль"
                        readonly />
                      <b-input-group-append
                        key="1"
                        is-text>
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
                <b-col md="12">
                  <b-form-group
                    key="pass"
                    label-for="account-new-password"
                    label="Новый пароль:">
                    <validation-provider
                      v-slot="{ errors }"
                      rules="password|min:6"
                      name="`новым паролем`"
                      vid="password">
                      <b-input-group
                        key="passwordNew"
                        class="input-group-merge">
                        <b-form-input
                          id="account-new-password"
                          key="NewPassword"
                          v-model="newPasswordValue"
                          :type="passwordFieldTypeNew"
                          name="new-password"
                          placeholder="Введите новый пароль" />
                        <b-input-group-append
                          key="2"
                          is-text>
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
                  md="12">
                  <b-form-group
                    key="retype"
                    label-for="account-retype-new-password"
                    label="Повторите новый пароль:">
                    <validation-provider
                      v-slot="{ errors }"
                      rules="required|confirmed:password"
                      name=" ">
                      <b-input-group
                        key="passwordRetype"
                        class="input-group-merge">
                        <b-form-input
                          id="account-retype-new-password"
                          key="retypePassword"
                          v-model="RetypePassword"
                          :type="passwordFieldTypeRetype"
                          name="retype-password"
                          placeholder="Введите новый пароль ещё раз" />
                        <b-input-group-append
                          key="3"
                          is-text>
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

                <b-button
                  :disabled="!validPassword"
                  variant="primary"
                  class="mt-2 mr-1"
                  @click="changePassword">
                  Сменить пароль
                </b-button>
              </b-form>
            </validation-observer>
          </b-col>
        </b-row>
      </b-form>
    </validation-observer>
    <!-- <b-col sm="6">
      <b-link
        class=" w-100 d-flex"
        @click="toogleSeen">
        <div
          v-b-tooltip.hover.bottom="'Нажав здесь вы сможете сменить пароль.'"
          class="d-flex">
          <h3>Сменить пароль</h3>
          <feather-icon
            v-if="!seen"
            icon="LockIcon"
            size="16"
            class="align-text-top ml-1" />
          <feather-icon
            v-if="seen"
            icon="UnlockIcon"
            size="16"
            class="align-text-top ml-1" />
        </div>
      </b-link> -->
    <!-- <validation-observer
        ref="simpleRules">
        <b-form
          v-if="seen"
          @input="validatePassword">
          <b-link
            id="popover-reactive-1"
            ref="link"
            class="d-flex justify-content-end pr-1">
            <h6
              v-b-tooltip.hover.bottom="'Нажав здесь вы сможете восстановить пароль.'">
              Забыли пароль?
            </h6>

            <b-popover
              ref="popover"
              target="popover-reactive-1"
              triggers="click"
              :show.sync="popoverShow"
              placement="auto"
              container="my-container">
              <template #title>
                <div class="d-flex justify-content-between align-items-center">
                  <span>Уведомление</span>
                  <b-button
                    class="close"
                    variant="transparent"
                    aria-label="Close"
                    @click="onClose">
                    <span
                      class="d-inline-block text-white"
                      aria-hidden="true">&times;</span>
                  </b-button>
                </div>
              </template>

              <div class="pd-1">
                <h5>На электронный адрес {{ getInfo.account.email }} будет отправлена ссылка для восстановления пароля.</h5>
                <b-button
                  class="mt-1"
                  size="sm"
                  variant="primary"
                  @click="onOk">
                  Отправить
                </b-button>
              </div>
            </b-popover>
          </b-link>
          <b-col
            md="12">
            <b-form-group
              key="passwordOld"
              v-b-tooltip.hover.bottom="'Ваш действующий пароль'"
              label="Текущий пароль:"
              label-for="account-old-password">
              <b-input-group class="input-group-merge">
                <b-form-input
                  id="account-old-password"
                  key="oldPassword"
                  :value="getInfo.account.role"
                  :type="passwordFieldTypeOld"
                  name="old-password"
                  placeholder="Введите текущий пароль" />
                <b-input-group-append
                  key="1"
                  is-text>
                  <feather-icon
                    :icon="passwordToggleIconOld"
                    class="cursor-pointer"
                    @click="togglePasswordOld" />
                </b-input-group-append>
              </b-input-group>
            </b-form-group>
          </b-col>

          <b-col md="12">
            <b-form-group
              key="pass"
              label-for="account-new-password"
              label="Новый пароль:">
              <validation-provider
                v-slot="{ errors }"
                rules="password|min:6"
                name="`новым паролем`"
                vid="password">
                <b-input-group
                  key="passwordNew"
                  class="input-group-merge">
                  <b-form-input
                    id="account-new-password"
                    key="NewPassword"
                    v-model="newPasswordValue"
                    :type="passwordFieldTypeNew"
                    name="new-password"
                    placeholder="Введите новый пароль" />
                  <b-input-group-append
                    key="2"
                    is-text>
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

          <b-col
            v-if="newPasswordValue !== ''"
            md="12">
            <b-form-group
              key="retype"
              label-for="account-retype-new-password"
              label="Повторите новый пароль:">
              <validation-provider
                v-slot="{ errors }"
                rules="required|confirmed:password"
                name=" ">
                <b-input-group
                  key="passwordRetype"
                  class="input-group-merge">
                  <b-form-input
                    id="account-retype-new-password"
                    key="retypePassword"
                    v-model="RetypePassword"
                    :type="passwordFieldTypeRetype"
                    name="retype-password"
                    placeholder="Введите новый пароль ещё раз" />
                  <b-input-group-append
                    key="3"
                    is-text>
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

          <b-button
            :disabled="!validPassword"
            variant="primary"
            class="mt-2 mr-1"
            @click="changePassword">
            Сменить пароль
          </b-button>
        </b-form>
      </validation-observer>
    </b-col> -->
  </b-card>
</template>

<script>
import {
  BFormFile, BButton, BForm, VBTooltip, BPopover, BInputGroupAppend, BInputGroup, BFormGroup, BFormInput, BRow, BCol, BCard, BMedia, BMediaAside, BMediaBody, BLink, BImg,
} from 'bootstrap-vue';
import { ValidationObserver, ValidationProvider } from 'vee-validate';
import {
  required, confirmed, password, length,
} from '@validations';
// import ToastificationContent from '@core/components/toastification/ToastificationContent.vue';
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
    BPopover,
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
    const { inputImageRenderer } = useInputImageRenderer(refInputEl, previewEl);
    // const { inputImageRenderer } = useInputImageRenderer(refInputEl, (base64) => {
    //   // eslint-disable-next-line no-param-reassign
    //   this.getInfo.avatar = base64;
    // });

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
      validPassword: false,
      seen: false,
      popoverShow: false,
    };
  },

  computed: {
    comparison() {
      return ((JSON.stringify(this.getInfo) !== this.source) && (this.valid === true));
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
      this.$refs.userData.validate().then((success) => {
        if (success === true) {
          this.saveChange = true;
          // this.twin.name = 'Хакер';
          // this.twin.phone = '+7892246643456456';
          useJwt.refreshGetCurrentUser(JSON.stringify(this.twin)).then((response) => {
            console.log(response);
            // this.$toast({
            //   component: ToastificationContent,
            //   props: {
            //     title: 'Данные сохранены',
            //     icon: 'EditIcon',
            //     variant: 'success',
            //   },
            // });
            this.$swal({
              position: 'center',
              icon: 'success',
              title: 'Данные сохранены',
              showConfirmButton: false,
              timer: 1500,
              customClass: {
                confirmButton: 'btn btn-primary',
              },
              buttonsStyling: false,
            });
          });
        }
      });
    },
    onClose() {
      this.popoverShow = false;
    },
    onOk() {
      this.onClose();
    },
    toogleSeen() {
      this.seen = !this.seen;
    },
    validateForm() {
      this.$refs.userData.validate().then((success) => {
        if (success) {
          this.valid = true;
        } else {
          this.valid = false;
        }
      });
    },
    validatePassword() {
      this.$refs.simpleRules.validate().then((success) => {
        if (success) {
          this.validPassword = true;
        } else {
          this.validPassword = false;
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
    changePassword() {
      this.$refs.simpleRules.validate().then((success) => {
        if (success) {
          this.saveChange = true;
          const newPassword = {
            new_password: this.newPasswordValue,
            old_password: this.passwordValueOld,
            email: this.twin.email,
          };
          useJwt.changePassword(JSON.stringify(newPassword)).then((response) => {
            console.log(response);
            console.log(this.newPasswordValue);
            (this.$store.dispatch('getPassword', this.newPasswordValue));
            // this.$toast({
            //   component: ToastificationContent,
            //   props: {
            //     title: 'Данные сохранены',
            //     icon: 'EditIcon',
            //     variant: 'success',
            //   },
            // });
            this.$swal({
              position: 'center',
              icon: 'success',
              title: 'Пароль изменён',
              showConfirmButton: false,
              timer: 1000,
              customClass: {
                confirmButton: 'btn btn-primary',
              },
              buttonsStyling: false,
            });
          });
        }
      });
    },
  },

};
</script>
