<template>
  <div v-if="download">
    <b-overlay
      :show="!download"
      variant="black"
      spinner-type="grow"
      spinner-variant="primary"
      blur="2px"
      opacity=".75"
      rounded="md">
      <b-card>
        <!-- media -->
        <b-media no-body>
          <b-avatar
            ref="preview"
            :src="image"
            size="104px"
            rounded />
          <!--/ avatar -->

          <b-media-body class="mt-75 ml-75">
            <!-- upload button -->
            <b-button
              v-b-tooltip.hover.bottom="'Добавьте изображение в формате JPG, GIF или PNG. Размер изображения < 800kB'"
              variant="primary"
              size="sm"
              class="mb-75 mr-75"
              @click="$refs.refInput.$el.click()">
              Загрузить
            </b-button>
            <b-form-file
              ref="refInput"
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
              class="mb-75 mr-75"
              @click="resetPhoto">
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
            @submit.prevent="validateForm">
            <b-row>
              <b-col sm="6">
                <b-form-group
                  label="Имя пользователя:"
                  label-for="userName">
                  <b-form-input
                    id="userName"
                    v-model.trim="name"
                    placeholder="Имя"
                    @change="changeName" />
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
                    rules="min:10"
                    name="Телефон">
                    <b-input-group>
                      <b-input-group-prepend is-text>
                        (+7)
                      </b-input-group-prepend>
                      <b-form-input
                        id="name"
                        v-model.trim="phone"
                        placeholder="Телефон"
                        @change="changePhone" />
                    </b-input-group>
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
                class="mt-2">
                <b-link
                  class=" w-100 d-flex"
                  @click="toogleSeen">
                  <div
                    v-b-tooltip.hover.bottom="'Нажав здесь вы сможете сменить пароль.'"
                    class="d-flex align-items-baseline">
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
                            v-model="oldPassword"
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
      </b-card>
    </b-overlay>
  </div>
</template>

<script>
import {
  BFormFile, BButton, BAvatar, BForm, BOverlay, VBTooltip, BPopover, BInputGroupAppend, BInputGroupPrepend, BInputGroup, BFormGroup, BFormInput, BRow, BCol, BCard, BMedia, BMediaBody, BLink,
} from 'bootstrap-vue';
import { ValidationObserver, ValidationProvider } from 'vee-validate';
import {
  required, confirmed, password, length,
} from '@validations';
// import { useStore } from 'vuex';
import ToastificationContent from '@core/components/toastification/ToastificationContent.vue';
// eslint-disable-next-line import/extensions, import/no-cycle
import useJwt from '@/auth/jwt/useJwt';
// eslint-disable-next-line import/extensions
import { useInputImageRenderer } from '@core/comp-functions/forms/form-utils';
import { ref } from '@vue/composition-api';
// import { mapGetters } from 'vuex';
// import store from '@/store';
// import useUsersList from './useUsersList';
export default {
  directives: {
    'b-tooltip': VBTooltip,
  },
  components: {
    ValidationProvider,
    BInputGroupPrepend,
    ValidationObserver,
    BButton,
    BForm,
    BPopover,
    BOverlay,
    // BImg,
    BFormFile,
    BFormGroup,
    BFormInput,
    BRow,
    BCol,
    BCard,
    BMedia,
    // BMediaAside,
    BMediaBody,
    BLink,
    BInputGroup,
    BInputGroupAppend,
    BAvatar,
  },
  setup() {
    // const { resolveUserRoleVariant } = useUsersList();
    // const store = ctx.root.$store;
    const refInput = ref(null);
    const previewEl = ref(null);

    // const store = useStore();
    // const image = ref('');
    const image = ref('');
    const { inputImageRenderer } = useInputImageRenderer(refInput, (base64) => {
      // eslint-disable-next-line vue/no-mutating-props
      image.value = base64;
      // console.log(image.value);
    });
    // watch(image, () => {
    //   store.dispatch('getAvatar', image);
    //   image = store.state.avatar;
    //   console.log(image);
    // });
    return {
      // resolveUserRoleVariant,
      // image,
      image,
      //  ? Demo - Update Image on click of update button
      refInput,
      // store,
      previewEl,
      inputImageRenderer,
    };
  },
  data() {
    return {
      source: null,
      twin: null,
      saveChange: null,
      profileFile: null,
      passwordFieldTypeOld: 'password',
      passwordFieldTypeNew: 'password',
      passwordFieldTypeRetype: 'password',
      oldPassword: '',
      newPasswordValue: '',
      RetypePassword: '',
      changeNameFlag: false,
      changePhoneFlag: false,
      required,
      confirmed,
      defaultPhoto: '_9j_4AAQSkZJRgABAQEASABIAAD_2wBDAAEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQH_2wBDAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQH_wgARCAOEBaADAREAAhEBAxEB_8QAHgABAAICAgMBAAAAAAAAAAAAAAcIBgkFCgIDBAH_xAAcAQEAAgMBAQEAAAAAAAAAAAAABAUCAwYBCAf_2gAMAwEAAhADEAAAAdgHcc-AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAByWvLn9Gzm9OfKa8-R15fviDbqCAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABkcfZnUKRmkTdl8TdlUbbyWvMACKrOJVjpaoAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAD6sfZGr5Ml10mRYEnnNOwAAADFZOmn_V0_G7MQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAB5eJEgSZeqpkm10n68cgAAAABTrrKbCJmgAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAADkNeUyVMyaKidkGjYAAAAAABSrr6TGJOoAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAADk9eU50s-aKib92GQAAAAAAAEG3MCut_XAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAfRj7N9NOnaln_AH4ZAAAAAAAAAev3yqXTVMaWMYAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAACR6-TZPnrLItG0AAAAAAAAAAej3ytXQ1kP20MAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAffhlY7n7KX6qYAAAAAAAAAAAAImtIdbegreO2YgAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAZtD32m5q1yDRsAAAAAAAAAAAAAHDbddaOirIzsYwAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAEyVM2yXPWXu89AAAAAAAAAAAAAAAhm2hVx6Ct-fLwAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAD98WJobGcqaeAAAAAAAAAAAAAAAAMKmaKm9PU8VtwAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA8_FnOctJdq5gAAAAAAAAAAAAAAAAAxSTqqB1dNxuzEAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAADy8Wh5y1lmrlgAAAAAAAAAAAAAAAAACN7CNUzqKj8AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABYCisJ8pLAAAAAAAAAAAAAAAAAAAAVa6Sqii0iAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAfpeHjLzmtWwAAAAAAAAAAAAAAAAAAAYxI1Ur6-k_PQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAy6JuudyV0AAAAAAAAAAAAAAAAAAAAKhdVT4BOjgAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAACaqebZLn7MAAAAAAAAAAAAAAAAAAAAQjcQa49BWgAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAACz3OWkvVUwAAAAAAAAAAAAAAAAAAAAYXL0U362mAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAFy-SusxibgAAAAAAAAAAAAAAAAAAAB8mWNDu2oQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABfDib77McgAAAAAAAAAAAAAAAAAAAAKJ9pQ8fsxAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAHKasr0cZfAAAAAAAAAAAAAAAAAAAAACkHY0XBb8AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABl0Xdc7kboAAAAAAAAAAAAAAAAAAAAAUi7Gj4DfrAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAEhwJFueWuAAAAAAAAAAAAAAAAAAAAABSHsaPgd-sAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAASnWSrU81bAAAAAAAAAAAAAAAAAAAAACjHZ0PFbcQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABL1VMs9zloAAAAAAAAAAAAAAAAAAAAAKFdtQejLwAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAATNUTbLc9ZgAAAAAAAAAAAAAAAAAAAAfPl5QvtqAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAACZqibZbnrMAAAAAAAAAAAAAAAAAAAADhtuFHOzogAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAJmqJtlueswAAAAAAAAAAAAAAAAAAAAMVk6aW9fSgAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAATBUzLOc7aAAAAAAAAAAAAAAAAAAAAAYNN0U86umAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAlWsl2n5q1AAAAg00Lmvk8C-xvgLGgAAAAGvk1HlZTlS6ZuVLJgAAAAEdT41SOpqAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAJHr5NteXtwAABUw6fxZQ2yGSGich87U5spAAABxR1jzVibWy3ZhBqDILOx0bqgAAAARfZRap9NUgAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAZnE3XJ5K6AAA9R0yy3B2eD6TXadRUGTHcnLXgAAHWoNfp21CwoK5HTQI_PM7URtXAAAAIos4lWulqgAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAOb053h429AAA19HVaO76ZaDr7mgsA2GnbvAABUE6dh3RSxgBpkOs8AS8d30yEAAAEUWcSrXS1QAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAHn4vpxN_7fPQAB12DCDsvAGs06moOWPI7pxZYAA63J8B2VQAVNOmicGDmjtJG1AAAAEV2cSq_S1QAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAuxx93kkfaAAOpcbNDc6ADWOVtNqZ1bDbmblwADprG_g2YgAFYTXmWbNexwp2MgAAARpYxandPUgAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAC2HMW0mV0oAAdQI3OG2EAAA6qhaA7BYAB0gztblxQAAAacyhp2fgAAAYFNj1A6unAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAFiKGxnSlngADqTGy83VAAAHUzLwG-wAA6VR2TjYOAAADR6VmOy2AAADF5OqlfX0gAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAEhwJFkOfs8pjbQAB1ySipsCAAANPJ2YzaCAAdVAw4uEAAADWsbljdiAAADhN2unnV0_B7tfj6AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAGdQt9wuUuQAABVA1oAAAAG64zAAAo2UFAAAABtyJsAAAABDttCrL0VYAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAJEgSLcctcAAAAAAAAAAAAAAAAAAAAAACLrKLVTpqkAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAZxC33E5S5AAAAAAAAAAAAAAAAAAAAAAEOW0Ks3RVgAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAyWPsuvx94AAABXkrMAAAAAAAAAAACVC5YAAAABBd1ArvfVwAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA-rH2-PE3_AOgAAA01GnkpE3ZRs7YAAAAAAAAAD1-as8w4jvKnmAAAACvN9XQTdQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAALw8bec3p2AAAAYYdEJKtFYfcfkzAAAAAAAAAH48q7A-Ie7J5XWLAAAABWLo6uILWGAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABbTl7eSK-SAAAAOlCcbN-wMkz7AAAAAAAAAACu8L5F7ZOHE7CwAAAAVI6mnjqfHAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAn6jsJ-o7AAAAAdaM1cyP3uVpH7qAAAAAAAAABX6H8odq7X-fbHwAAAAUp6-kxmTqAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAkCBIt5y1wAAAANcR1PcunslO-yP16AAAAAAAAAK2wfjjuH48tc8AAAA9fvlDe2ofT74AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAB7sfb1cXe_ZjkAAAB8R0hj7Jn1jl2zvwAAAAAAAAPixra-wfiTvcMMjAAAAMUk6aXdfSgAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAWs5m2lCtlAAAADSAdezZ3Vhpn1sAAAAOWa5bzhcp7hGeEvBvJIAEYaPxS9Mb567WQAAABi0nVUbqafhd2AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAEuVUy0HOWgAAAAx86VRxEr6ZkDd-rgAAWX2VGzCVyVrdtLyHuI_CA9dlq6i9jT3Tej4MauuML427iPlZdgAAAHp98ph11LjEnUAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAPrw9sRQ2M01E4AAAAa-DqO-zrBzPr7ms-kAA2oyuM2YSuS8wAAfhqah9rrcjdJAMT5U3A6-B7JwAAABEVpDrB0lWAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAPb4uzx95z2jYAAAANEp19Mr-wcz605bK9A2KSOW24TOIAAAAjDDX1X6P8yujq4DtmnMgAAAFTenqI1sYwAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAE_UdhP1HYAAAAAaBTQj7bzdL-m8u2d9ybDsi2X5RlmWkAAD8Ne0PmtFFX-U7FddV2czIQAAADxKJ9rQ_DniAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABlkXbdDkbsAAAAAauTrSvcf2_qN0Zf6v2JbSl8noAGJ4x6AROV1Q1_DYNo5rsUm2EAAAAAxyRqpN2FIAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABd7jbzntOwAAAAAYQaWjT2R1sn2m33srbJ_2s8DxiQBpqYG0Ut6GG3E2uHNgAAAAAjSxi1O6epAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAsxztnMlTNAAAAAAAgcqkRYegy4sCWvMhAAAAAAAIPuYFc7-uAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAlKslWq5q2AAAAAAAAAAAAAAAAAArP0VXDdtDAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA5DXlejjL32eegAAAAAAAAAAAAAAAACnHWU2FTNAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAt_ylxnsKQAAAAAAAAAAAAAAAAB8mWNFO1ovT74AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAJvpp1jaCyAAAAAAAAAAAAAAAAAi2yiVV6aqAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA5vTnd7jbzzegAAAAAAAAAAAAAAACofVU8fzo4AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAtfzFtJtdKAAAAAAAAAAAAAAAAhS4g1u6CtAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAzGJuuRydz5-egAAAAAAAAAAAAAAQxbwa19BW_noAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAWMoLKcKacAAAAAAAAAAAAAAMLl6Kc9ZTePoAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAACTa6Va_mLYAAAAAAAAAAAAAAQBeV8BXleAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAMwibrmcldAAAAAAAAAAAAAACsPR1cQ2sMAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAZPG23V5C7AAAAAAAAAAAAAAFVemqYtsooAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAy-JuubyV0AAAAAAAAAAAAAAKsdLVRVZxAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABIkCRbjlrgAAAAAAAAAAAAAAVn6Kshu2hAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAACZKmZZjnbQAAAAAAAAAAAAAAQDeV8A3leAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAALF0FjONNPAAAAAAAAAAAAAAET2cSrfS1QAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAt1ytvIUGSAAAAAAAAAAAAAAMakaqUdhSAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAfpevir7kMMgAAAAAAAAAAAAAAKQ9jR8Dv1gAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAfZh7ZnnbSV6yWAAAAAAAAAAAAAAAK9XtdBF3AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAHl4txy1vIUGSAAAAAAAAAAAAAAAB8GeNOespsYk6gAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAJiqZlmudtAAAAAAAAAAAAAAAAAOB3a6e9ZTcHuwAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAFz-Rusti7gAAAAAAAAAAAAAAAABhsvTTjrKXw9AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAADIY-y7fH3gAAAAAAAAAAAAAAAAAAqj01TGNlFAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAErVku03NWoAAAAAAAAAAAAAAAAAAhy2hVm6KsAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAE90c-wNHYgAAAAAAAAAAAAAAAAADDZemmvW0oAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAsrz1nM9RNAAAAAAAAAAAAAAAAAAHp98ov2lF8OeIAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAFo-btZZq5YAAAAAAAAAAAAAAAAAAEC3dfX29rwAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAMqi7Ziqpsw1Mz78MgAAAAAAAAAAAAAAAAAAPErl0FbCVxBAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA5jTnK9ZLlqrl5nE3gAAAAAAAAAAAAAAAAAAAADA5seCbqBHFhG8PQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAH04-yhWypeqpkhQJHm9AAAAAAAAAAAAAAAAAAAAAAAHDbcIvsokXWUXAZ0f1-gAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABkcfZNVPOl6rmcjryAAAAAAAAAAAAAAAAAAAAAAAAAAHEbcIjtYcKW8Lgd-sAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAZ3C3zjTT5NrZPm9AAAAAAAAAAAAAAAAAAAAAAAAAAAAHq98iqziQXdQcRlaQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAPPxJ9dKnOln5vD3gAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAfhHU-NBl1AjyfHAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA-nH2X6qZONNOyOPtAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAGJStMJXEGJrSJ82XgAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA5TVlNVROmmnm8rrzAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAHHbMYitIcOW0LFJWoAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAZJH2ThTT5eqpn1Y-gAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAYNM0Q3bwoqs4ny5eAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAZ1C3zjTT5OrZPm9AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA4_PGI7WHC9vCxeTqAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAHs8SjWy5wpp2bw94AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA_CPJ8aD7mDHFhG_AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAADkdeUyVM2aaebz2nYAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABiUrTA93AiqyiePoAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAADIo-ycaafL9VL-rHIAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAADFJOmvN9XRpYxgAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABz-jZP1HYS3Vy_Z56AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABHU-NWzoazG5GsAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAfRj7PVJPnKmn_AEY-gAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAD5svK9XtdCVzB_AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAADL4m60vN2uURtoAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAjKxi1e6Sr-HPEAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAACVqyXZ3nLT6cfQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABiUrTUrqKjhd2AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAExVMyzHO2nkAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAADGZGqoHV0_EbcAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAJJrpNsOYtvN6AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAMKmaKf8AVU_oy8AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA5rTndDkbvkteQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAhK4g1w6CtAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAtTzNrKdbLAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA8SnXWU2FTNAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAGZxN1yOSuv0AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAEezo1ReqqAAAAAAAAAAAAAAAAAAAAAAAAAAAAAALRc3aS1VzAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABTDrqXEpWkAAAAAAAAAAAAAAAAAAAAAAAAAAAAD68Pbz8ZffVj6AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAIJuoFeb6uAAAAAAAAAAAAAAAAAAAAAAAAAAAAAkKBIt1y1wAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABg03RTzq6YAAAAAAAAAAAAAD_8QAMxAAAAUDAgQGAgAGAwEAAAAAAgMEBQYAAQcIcBgwUGASExQVIEAQERchJTE1NyMkNJD_2gAIAQEAAQUC_wDvKWjVnUXH3kygRJ5FQYW5XoMIUUZC_KJ2pTtDmroiGuRlEQlGGiY0yk0UjSEfKVuYUiHaUok48aSJOqiksMbyqTNqBHynd1JaUytWetUbRWtcV0UXdVlI4g2p6JIITg5khXDWum0KZKpVmIIYYKkTWgb7c96IEmddn0qNUtMbYaANJ0xCUv6Mxa7mA2dKKMPG1w4QqTpk6Qv6YghGGQMA2wzZtpjSxypvakTYX9YwsBwHyLmo9mUyY9Ya0RROk-28xZOupUkUIjdlWhjVOw29sSNhX3FqBK4lPEaVNuyjFFxq6LLAUD771FSlNGlGEGbH2te92CMWK6G8MiZ2LWolDefsaEIhij8cCht0R2aU7snVpD0SjYu1rivHI_ZADo0jZrOaXYuINJQgdIljZ6NZsT_em5LZEh6Q8ILOTfe17X2IYU3qnbpUmR-jdtiIUn8avpU1TeJNsRDCPA29KkJHns2xEfK8lm6UeX5xGxCcvySOlqw-Wq2GQl-at6Y6W_TnsMwg8x46Y6_5TYaKh8T30x1_m57DQ-37d-mLr-JbsNC_8p0w0XjN2GhX_v6WaLwFbDwr_wB_S3EXgb9h4V_7-lvYvC0bDwq9_c-lyQXhZNh4cL9O_JneR4fjdrnGs2XuZi_NOW3I5DmfLTedCdZc4aR48yrCsnoOXkXUrjXHxkk1n5DcTD9S-b1BiDVDm5AOJ62XkkyAZbgeTE_LlV_0ybDxQXhe-RmPK7TiWKSyXSCbvmNNP-Q8nFs2iOKFFLdE-PBl5Ph0dg0lY314jTpgLP7flNDyFy5G2I85anneaGszI8SJwiejPIDwWn0QxUIHfQ8T5eTcYSHFL8gcF7UtwDqeLlJnKl3-H2Hjw_A9fMYwFgzlkw_KE-00YCKnp5JJScqtTeRVWP8AG34Znhzj7rhrJ6HK0L-eq7NRsgdsT4okOWpFjvGEQxg0fjK2QkeMIRKJQ9zN9oIhBFphzSPITDyZj_idh2wflOPz1OTMcOxLCIqtnEtYWRtjTN-NchinzvzpoyQOAZH-Wc8hfw1xw0NTnJHnFmOWnF8P_OtkR38PvzApi4wGXNLoifGvkTH_ABOw4b3CIArDB8tb0gGY9aLIuBxm351UY7WzrHX4QoFzmqXIFzSuw9LhTnGnx1rSwSyU6MYOB1lfwzZju-T8euTa4Mzh-Frc4Ng9IcsE_wCLORMLXu0bEM5vnNfy1aOHrM1aJm4BUA-GRNKuPJyvadEEfIVQjGkIx2k1MtYWrNmip6ErgPx1EOonfM-kpkC1Ya-M_wAPY-yWFRokhIj4TpfxRC1Ot2OFFLtEDqIuQ8iW2_bLsREjvNZvlqj_AN66Nr2viT56xCQlZf0NqP0o-OWf9p6fiwF4Z5GtcgAsa6Kv9p8iTB8THsRCB3uT8tWKASPNmiRyCbCPnq2XWV5o0OIrhSfHN6ATbl7S46Bc8J8jW87llRjRKgEZPOQ9A8bTsOhjDqts0NRLSm-WtyP3IkeFs1uGGlnHE61xxOtccTrXHE61xxOtccTrXHE61OpYqnUu0ixwbJiL46v4_dpy3hrUU64gY-OJ1rjida44nWuOJ1rjida44nWuOJ1rjidazDlpzy_ItE0eukiHIciTFKAxqcir3tcN9hI2QWoeeRmDFLbl6NcDrXXA611wOtdcDrXXA611wOtdcDrXXA611wOtdR9kRRpi-OacHtmZCOB1rrgda64HWuuB1rrgda64HWuuB1rrgda64HWuuB1rrHUJRY6hvKmKIoxDsJFb_p76dLxeFn2EjYvC99Omov6dsIzj8t15M-ynB8ZlcWGEq4sMJVxYYSriwwlXFhhKuLDCVcWGEq4sMJVxYYSriwwlXFhhKuLDCVcWGEq4sMJVxYYSriwwlXFhhKuLDCVcWGEq4sMJVxYYSriwwlXFhhKuLDCVQ3PuMJ6_cubi_wCHYQgzyjuTqoxJkDJC58045hjjEAAjB-xulexulexulexulexulexulexulexulexulexulexulexulexulexulexulexulexulexulexulexulexulCZnIAceSccMnIRBGHlTgX_LsK2neob-TI2oL7HreYmUWvYVvqqSvJUYieryHGHKmg_257CxQ_zmblZoj94vlVpO89v-q8h8LnpYVDU4Q5UqM8b3sLCFHL1pxa7fNY0o_l9V9v8A1PSf_pLlPJnmuuwsYU-meOVqnht5ZiZtU-kW_VdDPMcNPDWNowvyRCsAJg7mD2FLMEUYQcFQRyVKchYnyZDFGPp0yq_VIvpqDrJyGtuVvbqztidlaeS9qQJWvYeJK_UNXK1k439yZWdb6JXykaBc4GJ8aT1VYzFOQirOEYkbSH4yNX4S9JMHFJ8m8l2dSGlMucFTifsPDlfkuPKdWtA9tmU8euOMpoxOHqCfnDcVSiY2jmFIUx2TJUqIn8yLGUMkwZ1h19iQPwpUFpSTTD16rAWNP4Y495BhgCgO7kY6LdiCDzEx0fkw1x3K1D4eBlSJf9puVoVpa4j44wwwUWXa1g2-eY8WFNYRjCWF2chLzdJ-FhvznyZgu9Og2KAMRY2xaFwQ8rVJgMblZEtOQnI1hK0r84Nx-B0UcmXyWORZjkTyQ5L8CYHcsqurc3oWlByZWq9Q77FwpZzNQ2mQw0whQoQnt7unXWpEkPcFjE0JmBn-d7_qsiahotEgy2aSKcOeDtMbxOxtTS2sTdyb3tayk66hTsWxq_RuvMzPpljuRhTGCyzH7qjf1SesRObKsn1r2vb4uz8yMJEs1OwtntN8zTqdVB8bzTIy_EmlWKwgXLdzvIa9jWxV61v5kgjbBK22f6LkCoUvw1kyDXYp1MozTbqVyghsn1YS4NGasZLcC3VJkVTZ2zXlF5sSQ-yVfEtLeXpQKC6PYFHrtza3NCPmS03y2bY2GKvMQ8-QYvx1KbuWk7Cq-5mi3FQx8FWLKRaPMQJbtGnjDDLdtaWpmI583N_SbY2IqvIdeizQ7xOGxqQ-6VUEVhh6JIj_AFDzsdGlXqmjoZ5wU5BgxGmbHQpZ4FHQ5as9M2bHtqu6Fda9hW6FJHKzi47IRVf6xt6DJ38JANkWNzu1rwiCMP35FI_SVe9732ShrgacX95_cbtjde9xX2TiJvlvP3pubsqwC8Dz96aC_bnsoy_5b70wv-3jZRgD43j70xt_V9lIqX43v701D_UNlIUV4nD704L2VhBP6T_emJPmNWykXJ8ll-88J_VNeyf96SE-mS_fc0vonDZEhOcqNZ4umRdBmaC9jNkLWuK8fZQNSfoKlMUrIdms9qU7HxBt9Qq6G4tydzTuDeobVOxzGj9C2dEe2oDqjEEQBbGNSb1bl0aWI_SumxkOJ8x26NNE_mINjIOX_Po0gJ89m2MhIf8AodGMAE0CkgaVRsXDbWs09HlzQIWxSJlc19IYWQCk6ZOkK6Pe1r2fYsMm-wqVvWrro4WoHSJgakPTXOPN7nS-LOaOhBEG_f5RJp40UPcVFI4u1JKCEIbdQVN6JbZXC0hlK4w7paEEQBd9IWle43QQwgFJ0iZIDqypAjWhXQsoVLWxc3i72b465uFN8UbklWtYNutDAEwLhEUKmnBjcW3vKwbiu3xNwV03x9tb-wXCMNq6nCMuaHu4ok1QNvhqo2kLSgbrdiL2NtcaXw5aRRpJpA-6EqJWtG3wykqJIhB2QpSJlgF0MTjpcyOTf3KhaV7jdvhyUmiiSk4OzV0da11LocuIo4g5OPt9vjrm4U3xRuSVa1g27RUJU6sC6GJjKXMzi3dthCIYkEScFVN8fbG_tf8AvS-MNi2nCLuaKv7drJkilYNBDDBUibELeHttwZG5ypyia5JV7XDftFC1L3G7fDUxVEkEpwdvuLKgc7OkXXoOz0LYtchtsRRpqCEIA9xusbQuVOLStbDOyiijTzGqH2tRRRZIO5jSSjy3mJmE1_bshqZVbsY2NCNrL7qe42ncrKUx6Q7sVhjY3GiiSiC-7HZnTOxK9AoblHYccj3rb2ta1u7nRrTuqdciPb1PYMdZLuh9rWDbvB7Zy3ZKaUYSZ19vQmuKtIlJRJ-8paz-cX1-KtfokXed7WvZ-bPa1_XWFu9yce9ZK3evbeuxBD6dv72fEPt7n1sgkag8koBBPe01SfsvrcWLCY9d7yQARsv3f__EAFIRAAECAgMICw0FBgUEAwAAAAECAwQRACExBRJBUWFwcZEGIjIzUGCBobHB0RMXMEBCUlVicqXU4fAHFCOCshUgQ3OSohAkU2PCNGTS8USQ4v_aAAgBAwEBPwH_AO-UIWbEqOgE0EO8f4auWQ6ZUEI9iA0qHVOn3J3CpGs_-NPuKv8AUGonsoYKQJLtgJ3GL82apLLq9yhWmUhrNVEwTh3RSnnPNVz0EEjylqOiQ7aCGZHkT0knrlQIQmxKRoAH70W7eovBul1aE4Ty2a8WaYAqMkgk4gJ0RCOqtkgZTXqHXKiYJsbolX9o7eeiWm0blCRllXrNfgnnUtJmbfJGM9mM0WtS1FSjMnNIiFdXaLwY1W6rdcqIg207qazqGodtAkJqSABkEvCxCyt1WJJvRydprzRJSpZkkFRyUbgia3FS9VNuuzpohptvcpAy2nWa_EHk3rrg9YnkNY5jmgShSzJIJP1bRuDFrpn6os5T2USlKRJIAGTxKMamA6MFStGA8mZ4AqMgCScAo1B4XTL1Rbyns10SlKBJIAGTxS2o2G2kQwWjfJrQf7ch6j15nGoZblZ2qcZtOgddG2kNCSRpOE8v0PFyAQQawbRR-FKJqbrTiwp7Rz48eZlKVLN6kTNGYRKNs5tlYvJHb429CpXtkbVf9p7DlGrDRSVIMlAg_WvMsywt01VJwqPVjP0aNtIaEkjScJ0-OrbQ4JLE-kaDR6GW3WNsjHhGnt6MyjEKV7dypOBOFXYOc89AABIVAYBwA_ChW2bqVhTgPYebRQgpMiJEYDmRh4WW3dFeBOLKrLkwdHATzCXhiULFduMfQotCm1XqhI9OUZjrahWTSHhrzbrrXgHm_PLgwcCutJdTI2-SrEezGKLSpCilVo-p5jYaH7mL9e7P9o7cerHPgaJZ7qmY3abPWHm9mXTmMg2hLuqrZyTyeV1ZJcExbV4u_G5XzKw67deYttN4hKcQGvDz8EvN90bUnDan2hZ2cuYphN88gZZn8tfBcSi8eViVthy2888xMEnbrViTL-o_LguNTtULxGWv_wBZiYISbJ85XR9HguIF8yvIL7-mvMTDiTLfsz_q23XwWoTSRjBGvMSkSSBiAGrgxdSlDEo9OYdAmtAxqSNZ4Nd31z21_qOYdgTeb9qeqvg13fXP5i_1HMPC7-n836Twa7vrn8xf6jmHg9-_Kerg1e7X7SunMPBb6r-Wf1J4NNZJynMPBb4v2OscGGoE4gcxEFvi_Y6xwY5U2s-oroOYiC3xfsdY4Mf3lz2Tz5iILfVfyz-pPBkTvDnJ-oZiIPfvynq4Mi94VpT-oZiITf05Qr9JPVwZGbz-ZOYiHMnm9PSCODIzevzjoOYhoycbPrp6eDIzevzjoOYkViePguM3n8w68xLJm02fVHMJcFxe8nSnpzEwhmyPVKh_y6-C4reF8n6hmJgTU4MqTrn2cFv1tOewo6hPMQiFdXXK9GNVXNbRloNJvRWTWTjPBbgKm1pFpSQKFp0Wtr_pPTmGhkhTyJ5TqBI5-D4xAKL-W2SRXkNXTLMLCb-n836TwfGbzpUO3qzCw2_t6TzpI4Pjd7T7fUrMKyZOt-2nnPB8dY2MquaXbmFSZKBxEHV4SGh3ouIYhIdBdiIp5qHYaEgXHnlhtpAKiEgrWoJEyBXWRTvZbN_QnvK5Hx9O9ls39Ce8rkfH072Wzf0J7yuR8fTvZbN_QnvK5Hx9O9ls39Ce8rkfH072Wzf0J7yuR8fTvZbN_QnvK5Hx9O9ls39Ce8rkfH072Wzf0J7yuR8fTvZbN_QnvK5Hx9O9ls39Ce8rkfH072Wzf0J7yuR8fTvZbN_QnvK5Hx9O9ls39Ce8rkfH072Wzf0J7yuR8fTvZbN_QnvK5Hx9O9ls39Ce8rkfH072Wzf0J7yuR8fTvZbN_QnvK5Hx9O9ls39Ce8rkfH072Wzf0J7yuR8fR_7OdmcMy9EPXGKWWGnHnVCPuWspbaQVrIQ3GqcWQlJN6hKlqsSkmrwsca2xkUdcuzMM2b5tBxpTrlX4OBilQMbBxqJ38JFQ8UiVt9DuodTLLNNG3EOtodbN8hxCXEKFikLAUkjSDPxUgKBBAIIIINYINoIwg4aXYgv2bda6dz8EFHxcKmc60sPrbQqus3yUhQOEGfhI0_ipGJA6TmGhFTZHqkjnn0HwmwK6IunsSuM9ObjEKIB6uaguAJhRfes40227jIcBNZPi32jMBjZpdxCbFOwz9hEzEQMK-u0ny3FCdk51CweDizN9WS9HMD15hoFW7RoUOg9XhPsYurNF1riLVWlSLpwyZ2pVew0XLEEkQllU1qNXleK_aisK2a3UAtbauehWk3PhnKuRY5Z-EeM3XD655jLMNCqvXk-tNOuznl4TYbdr9g7I7m3QUq9h-7fd4yva_dIn8F5SsYZCg-B57SaW1iufiuzeLEbssu--DfAXRehwbQRByhAQcIkxUbJWVeDsroTMk4zPMMDIgi0GeqiTfJCvOAOvwn2cXf8A25sbhkOrvo65d7ARc90pLaf8o-cJ7rDhIUs1rfaePil2Lot3IuVdC6bsr2ChHoi9PlrQglprS65etjKoV0cWt1a3XFFTji1LWo2qWslSlHKSST4N9V60sztSQNJGYiEXfNSwoMuS0dnJ4T7Ptkg2OXfaW-u9uddACDjvNbSpX4EUR_2ztajWQwt8JBJ8GtxtoXzjiGxjWpKBrURRd1rmotjWD7K-6fovqC7Vyz_8xvlC09KRRqLhX6mYlh04kOoUrUFT_e-2G74Zg4XY6wv8WMUmNjgPJhWV_wCWbV_OiU91xj7snAuvwTrqWkzNuBOEnsxmjjinFXyj2DIMxEGuThT545xX0T8L9l-y0XXuaLixrs7pXLaAZUs7aLuemSW1zwuQs0sO4S33FyalKdKf34-7MHAzQpXdn_8ARaIJB_3FWN6DNeG8IpFbII-ImG1iGbPks7uWV07eeVF5oota3FFTi1LUbVLUVKOkmZ_chbrx8IR3N9S0D-E9NxuWLbG-SPYUnppc67sPGkNOf5eINQQozQ4f9tdVZ8xUjXJJX_jdq68HcK5sVdSOXesQzZVegi_edNTTDQNrry5IRgE75RCEqULsXVirt3TjLqRhm_GOlwgTvW0VJaZbnX3NlpKGkTrvUiZJmfBEgAk2Cs0ecLqyrBYkYh9W5iUqKSFC0GYpDxJWbxyUzuTjyHL4S5t0ou5EdDXRgXSzFQjgcaXaLClSFjym3EFTbiDUttSkm2mxfZLBbKLltx8KQh5Mm42EvpuQkRLbIVhLa61MOyAcbxLS4hH7t17vklUNAqkkTS5Ei1RsKWTgT_u2nyJDbKt8BcK7JeIgotc3f4Dqv4gA3tZ88CtKju7Cb-V_ExLEIw7FRTqGIdhCnXnnVBLbbaRNSlKNgHyFdNnmzN3ZVHhqHK27jQS1fc2TtS-5WlUa-m3ujiSUtIVvDJlIOOPFXgoxd62EC1Zr9kW88ufMWDIzForFGl90QleMV6cPP4TY3sjuhsYuii6ECqYMkRUMsnuMWxOamnMRwtOjbNLrE0lSFbHtkVzdksAiOuc7PciIhlEfeIR4itp9ANRqN4sbR1Ivm1ETl_jsiumWU_cWVScdTN9QtQ2bG8inLVYkYPxJjwLsU1BNqi330wzTElqfWq9CCK0ylNSnCR-GhAU4tW1bSpUhTZls8j9lBTBtzhrlMlJDI2q4x1IH-Yi5EiV_NbMONozMXxccSFjwcWq-eIwJAT1nnOYyCXum_wAw6D1c_hbi3culsfjUR9zIgsvJqWg7ZmIbnMsxDUwHG1YqlJMltqQ4ErGxL7QLk7Jktw61JufdeW3gXV7V9QtVBOmQfB3XcTKIRtpoWhHdlUcWlptbi6ktoUtRxJSCo8wpEPriX3X3N06tSzknYkZEiSRkA8DdfZTc25V82F_fIsVfdodaZIP_AHD-3QzKRCkAOPhUgplKTfi6t2o-7DvdIt3aJJ7jDtzRDsz8xEzNWAuuKW6oABThCUgeEUb5SlYyTrOYxhd46g5ZHQavn4YEpIIJBBmCDIgiwg4CMdNjn2qXbuSG4a6g_bMEmSb55d7dBtPqxW27vK2USlxaqkh9sU74Gxu7Vy4hMLHiGjHEIR9yjh92f_EWhK0pUSph43hVUy84ZAzl-_ERcNCJv4mIZh0-c84huei-ImcgmTSO2bXKhpiFDse4LLwFlnLN10X2goZcBtnjulsrutdGaO7fdGDMFmEvm75JwOuzLq5ipSb5LR_0x4Z43rTh9U6zVmOaVftoVjFenDz-IQt1LowX_SxsSykeQl1XcuVoktnlTRnZpdxqV-5DxH86HSNfcCx28tEbProDfIKDVV5BeRXyuOVZOeh2fRstrAQoOMrdI1TT00d2dXYXuG4JnKlpxStbjykn-kW6KRGya7kTUu6LyBiYvIbnYS2rWomi3HHVFbq1uLNq1qK1HSpRJPiEWZMn1ikc8-rMdBKmhSfNPMr5g8DRx2qE4yTqHzzHQar12XngjltH1l4GjT-IkYk9JPYMxyFXqkq80g6qW14-BYhV88vIb3-mrpzHwy79lONO1PJZzS4EUb1JUcAJ1UJmSTaTPMfBL2ykYxMaRbzdHAkWu9avcKzLktPZy5kG13i0qxGvRh5qW8BxLndHKtynajLjPKeaWZGFcv25YUVcmDs5OAoqIvQW0HbHdHEMWno02ZkWHe5OA-SalaMfJbS2vgCJibybaN15SvNyDL0abMycE4SFIPkyKdGEaLJePxDnc2yRadqnScPTmVhDJ4eslQ_5dXj8cd7T7R6JdeZWH35v2umrx-NP4o9gdKsyrO_N-2Onx-M378o68yrFbzftdFfj8Zv35B15lYUTfTkvj_afH43fEn1OhR7cysEPxFHEnpI8fjhvZ9odHzzKwI2q1YyBqE_-Xj8YJtT81QOuY6xmVhRJlOWaufsl4-8m-aWPVOsVjnGZVAvUpT5qQNQ4AdReOLTiNWjBzZkkpKiEpEyaMwqUSUvbL_tGjHpPAMa3WlwYdqrTg7OTMjbSHZDSZndm04vV7cZ4CUkLSUqrBo60ppUjZ5JxjtxjMhBt3yi4bEWe18uscCONpdTeq5DhBxijjam1FKteMY8x7CLxpIwymdJr5rOTgV9oOol5QrScvYaWW5jWk37iE41Cei083A8Wi9dngWL7lw9vLmNgxN2fmpJ11dZ4HjUzbSrzVcyvmBmNgRvh9kdPA8QL5lwZJ_0mfVmNgt7WfX6AO3gciYIOGqiklKlJNoJGYyC3o-2egcERjP8AFT-f_wAu3MUhh1zcpMsZqHPbyToiCSK3FX2RNQ12nmolKUCSRIZOCX4UjbtCYwpwjRjGS0dGYVLa17lJPRrsoiCUd8VLIms67OmiIdpFiZnGqs9g5AODXYdt2vcq84dYw9OWjkK6iwX4xpt_pt1TzAgFRkAScQroiDcVuiEDWdQ7aIhWkYL4-tXzWcJKbQvdpB6ddtFwSDuFFOQ7YdR5zRcK8nBfD1a-a3mpZbx7Q045uUmWOwa_o0bgkitw32QVDXaeaiUJQJJSBo4XU2he7SDpt120XBC1tUsiqxrtHPRbS292kjLg18d24d1zBejGqrVhNG4RtFatuctmrtnw4a6jXpo5CIVWjaHWnVg5NVHGHG90KvOFY-XLxyto3COLrVtBlt1dsqNw7bdgmrzlVnkwDiC5CtrrG0VjTZyj_wBUchXUYL8Y09Yt6dPG4AqMgCTiFdG4NRrcN6MQrV2Dnohptvcprx2nX9DiK4w25uk1-cKj8-WdHINYrQb8YrFdh-qqEFJkoEHEauNKULWZJST9Y7KNwWFxX5U9Z7NdEoSgSSkD6wnDxJUhKxJSQrTRcEk72q9yGsa7Rz0Ww43uk1ecKx8uWXGVDTjm5SZY7Br-jRuDSK3DfHEKk9p5qABIkkADEKuJy4dpzyb0401HsOqi4NwbghY1K7OfkoUlJkoEHLVxgbh3XK5Xoxqq1YTRuEbRWrbnLZq7Z8U1JSsSUAoZaOQSTW2q9OI1jtHPRxlxvdJq84VjX28W7bKzRuEcVWraDLWrV2kUbh227BNXnKrPJgHFhyFaXgvDjT1izo00chXUVjbjGm3Vb08V0oUsySkqOSjcEbXFS9VNuuzVOiGkN7hIGXDrt4uOMNuboV-cKj8-WjkItFaduP7tWHk4poacc3KZ5cGv6NG4NIrcN8cQqT2nmoEhIkkADJxgcZbd3Qr84VH58tHYVxusbdOMWjSOyfE9DS3DtRPLgHL9GjcGhNa9ucXk_Pl1Uss4yOwyHK9yrGMOkYdNtHGltHbDQrAeXqt4lgFRkBMnAKNQflO_0DrPUNdAABICQxDjOQFCREwcBo9CEbZqsYU4Rox6LdPElplbpqqThVg-ZyUbZQ0NqK8KjaeNb8Ml3bJ2q8eBWnt6aKSpBKVCRHEZiGLm2XUjnV8stAAkSAkBg42uspdEjbgVhHaMlFoU2opVb05RxEhoe_269zgHnf8A56eODrSXUyNuBWEHsxii0KbUUqt6RjHEKHY7qqatwLcpxdvHJ9kPJxKG5PUch-dCCCQaiKjxAbQXFhIw8wwmiEhCQlNg-p8vHOLZmO6ptG6yjHydGjiBCtXiL47pfMnAOW3jrENdycI8k1p0YuTh5hvujgGAbZWgdpq47RLfdGzLdJ2w6xyjnlw9BovW7_Cs_wBos6zx3fR3N1ScFo0Hss5OHEgqUEi0kDXQAJASLAABycd41FSF4tqeWsdevhyFE3kzwTPLLjxEibK-Q848e__EAE0RAAECAQULBgoJAwMEAwAAAAECAxEABAUhMRIyQVFSYXBxgZGhEyJQYMHRIzBAQmJygpKisRQzNGNzssLS8CBT4SRD8RCDkOKTo7P_2gAIAQIBAT8B_wDPKp1pF-42n1lpHzMlT6aJtfRsir8oMjSk0FilK1IV-q5kaXm-BDx2I_fI0w3gZXtUB2GQpe6WlKZuecQmtzCTD-2dFTk6m7V-8gHFG6V7qYq4SXS03TeJcc2BI3kx-GS6YdN40hPrFS_lcSXSM7X_ALtz6qUp4gR4yU66u_ccV6y1H5n-qjJuXXg6RzGjGONfmjZfHZj0TKWlAulqSkY1EAcZO0pNkXpU6fQFXvKhvF1Jyl31fVpQ2Md-reeb8MnJw-79Y6tWa6Nz7o5vDxU1my505cJqSK1ryR2k4B2AyaaQyhLaBBKeOMnGThOiMmFZqGMyepKbNVBXKqxN1j373cTqk7Ss4XEN3LQzc5fvGrckSWtbhulqUs41Ek8fGzFkMzZvKWA4s4yoRh7Iq0ROONtJunFpQMZPyxnMK5P0ukRDCLr011DYm07SnVJ6cvv_AFrilDJsSPZFW23P5BNFhybMqH9tIOtPNPEaIHHW2U3TiwgZ8OoWk6pTiliYpm6bn7xdvspsHtR1SW4t1V04pS1Y1GP_AAMwq8ioqc3JVN1GpXOb9bzk-0KxnBwnQ8pSUAqUoJSLSTAb5TmlgIpmwj94oVeynDrVuMnHFuqu3FFajhJ-WIZhV5ICQQQYEGIOEEYZTGfCcpuF1PJFfpgecnPlDBaKrNDc6pBqbxSnwjuSDUk-mrBqETqtk_OXpwYuKiMCRUlOodpic_k6VFJCkkhQMQRaDKZ0kl2Db8EO2BViV_tVmsOCFmhlxxDSStxQSkYT8hjOYVmU6pNbsUMxbbyv9xW3zRqrz1w8rmlJLZgh2LjePz0aj5wzHYcEm3W3khbagpJwj5EWg5joWnU9bmor5zhvWxbrUfNHE4BJ-cOzhV04qOJIvU6h22nCfLWX3WFXbSik4RgVmUMP8hKa0i3OIIX4N3Eb1XqnH6JrxR0KT2kg1FpiCnLFLtSjVlK4DDGsSUoqJUolSiYkmsk5z0BNKTU3BucRWiwLtWnXlj4hnsklSVpCkkKSawQYg6EZ9SN1FqbmCbFOC1WZGIY1YcFVvQU1njk1VVzmzfNmzWnEr54cEGXkPoDjZik7wcIIwEfyrQcSACSYAVkmwDGZT6kC9FpkkNYVWFz_ANM2G04uhZrOlzVy6TWk36MCh2KGA9kZNOoeQlxBilX8IOIjDoMJhWagKyTKfz7lyWmj4EWn-4f24hhtOCHQ0wnf0dy5UfBOGCvROBf7s2oaDKVnSgfoyDAXIU5C0xsRqhWccRt6Ioyc8q1ySjz2oDWjzT7N6dmPQW-5yzzjmUskerYncmHRM0f-jvoc82NyvOg326-GcDQVPXOSmrysJTcjWvm8Ix6Lo53lZqiN834M-ze_CRt0E0wuDTTeWsq2IHeobui6Icg461lJCxrSYcQrhoJpZcZwlGQ2N6iSeFz0XMF3E7ZONVx74KfmRoJnyrudvnEu59wBHZ0WhVytCslSVbjHQS4q7WteUpSt5J6MbN022caEnekaB3lXLTqsltatySejZtXN2DjZa_INA89MJo-fuyPe5vb0bNvs03_Aa_InQPSRhM3c5QP_ALEns6Nm32eb_gtfkToHpX7LrcR2no1mplofdo_KNA9L_Zkfjp_I50akQSBiAHDQPTH1Df4v6FdGJEVJGNQG86CKY-ob_F_QroybiL7IxutjesaCKY-ob_F_QroyZiM6Y_ESdxjoIpf7Oj8ZP5HOjKPEZ4zrUdzajoIpb7LqdQeCh29GUZ9sbzBw_AodugikxGZuZig_GB29GUV9rHqL7NBE-EZo_wCrH3VBXZ0ZRP2o_hK_MjQROBdMPJxtOD4T0ZRP2o_hK_MjQQawRjkRAkYiRu6Lon7VraX80ns0EztNxOXx96s7FG6HA9F0X9rTnSv5R7NBNKJuZ2o5aEK4XH6ei6OMJ4z7Y3tr0E0yOewrCUrG4pI_Mei5mYTpg_eoHvGHboIepGbMxF0XFDA3XvVe64EkYpTqcrnTl2qoAQQnJHaThPZ0XN1pbfaWu9S4lRw2G3ZbJM5m6r19o-2mO0ExG2VtYr0C0gtSJo6U1E3KY5lKAPAno-iXlB4sxNwtJNzgCk1xGKIjHHViGgWk_sbuYt__AKJ6PooRnWptZ-Q7dAtICMzf1JO5aT2dH0QPDuHEyRvWju0CzsXU2fH3SzuST2dH0OOe-cSUDeVd2gVYukqTlJI3iHjeScyeI75ck5k8R3y5JzJ4jvlyTmTxHfLknMniO-XJOZPEd8uScyeI75ck5k8R3y5JzJ4jvlyTmTxHfLknMniO-XJOZPEd8uScyeI75ck5k8R3y5JzJ4jvlyTmTxHfLknMniO-XJOZPEd8uScyeI75ck5k8R3y5JzJ4jvlya8XEd_jaGHNfONSBuCv3aBpwm4feTicXDVdGHDxYqMcXk5ECRiJ8ZRA_wBOs43lcEo_zoGpNFzO1nLShfC5PFJ8Y2YoG7d5M5fq_mDxlGphM2_SK1fGR2aBqYR9S56yDwUn9XjGDaNvf5M7fnZ8vGTRNzNmB90k7VC6PE6BqRb5SaOY0QcHs2_CVeMQblQO_wAmXWtWvxYESALSYb5AXICRYABu0DKAUkpNigQdRqMloLa1oNqFFJ2GHjGlXSc4q7vJFGAJxeMmbZcnLIAJAWlSsyUmJjiFUNBFKNXE5KsDqQvaOar5XXteMbVcqzGo9_i4E2Vy5NeSZck5kmRSoWpI1j-p5VicdZ8XNZsudOXCakita8CR2k4Bh1RMmWG5ui4bTAYT5yjjUcJ-WCrQRSzV2wHBa0r4V1H4rnxrS4iBtHy8QhpS8wxn-VySwgW845-7_mVln9CmkKwQOMVSWypFdo-Wv_qo3IJMiboknD4pIKiEpEVKIAGMmyU1m6Zs0lAvrVnKXh2CwZs-glaEuIUhYilQIIzGU-o4Mp5ZmNwL9BrKfSBtIxxrFsYWeLBIMRJKgoR3jF_U0z5y9ie_u8S81DnJswjFnlZWZOLuzmFnf4uimbt4umxkVeuqIG4ROuGgsgKBSREEEEYwbRKcMlh5xrJPNONJrSd1ufxiVFJiP-ZJUFCI_wCP6GG4882CzX_j56vFOLQhJKzAfPNnk45dmqpMah3-Moxvk5qk4XCVn5J4CO3QZTDX1b4_DVxUn9XDxoUUmIkhwKzHF3f9Lascki5AGLxL07bbqTz1ZrBrPYOEnHVumKzHEMA1DxraOTbQjIQlPuiGgyeNctNnU4bm6T6yOcN8IbfHpdULaxx3yYcQpxNYHrVfyv8ArUpKa1KCdZhJyfNpvIrO5O818JOzl120wTkpqG3Cdp8dNU3c5YT94knUDdHgNB05b5J91vJWYeqa0_CR5Al1xF6tQzRq3WSE9fFpSrWn9sJfT3MKEfF3mX09eQnj3yM-eNgQNh7SZKnL6rXD7ME_lhIkmsmJz-QUWm6naTkIWrhc_q0HUu3cvIc_uIgfWR_6lPQ1Dp8I8vEhKfeMf0aDqVbu5tdYWlBWw80_MHZ0NRCYMOLynIbEpHaToOdQHG1tnz0qTvEI7JEEEg2gwOsdCzBFxNGRjTd--SocCNB9INclOnMS_CD2rfjuuhEJK1pQLVqCRrUYSACQEiwAAahVoPpdqKG3h5huFalVjcRD2uhKLa5Sc3ZvWhde0ak9qvZ0IThrlmXGspJh61qTsUBIggkG0VHX0HR835BgXQg45z14xG9TsHEnQjSbHJTgrF69zx63njfzva6Co6YlZTOHRzBW2k-ecCj6IwZRzW6EZ5N_pLKk-ennNn0hg1Ks44JEEEgiBBgQbQRaD0BMKP5WDzw8HahGXnV6H5vVt0J0swlKkPJEOUJSvEVCBB1kRjjhr8vmLH0icJSbxPPX6owe0YDVGVlQ0KUom6mijkLQrjcfr8vodP16_USPiJ7NCs-EZo_6kdxB7PL6IH-mWcbyuCUf50Kzv7LOPwl_lPl9FfZdbi-waFZ6YTR_1CN9Xb5fRX2X_ur-SdCtJKhM3PSKB8aT8gfL6IPgHBieJ3oR3aFaXVBhtOU7HYlKu0jy-hlfXp_DUPiB7NCtML8IyjEhS_eMP0eX0SqE5KcttQ2ghXyB0K0ku7nbmJFygbEgn4ifL5ovk5yyvEsA6lc1XAnQq6vlHHF5a1K3knoCbu8sw05lJEfWFSviB0JLWhtJWtQSkWk_y3ELTKd0k49FDUW2rPTWM580HENpPQNEP1LYJrBu0ajfDYYHadCJMKzYKyZT6eGcuQT9Sg8wZXpnXgxDOT0E24ppaXEGCkmI_wA5jYc0ptOUTlu7TURUtGFJ7jgOHXEaEKVnHJthlJ5zt9mbH7zVqCh0Iw-5N3A42dYwKGI_yq0SYfROGw4g6xhScIP8rt0Hzx3lpy4uMQDcp9VNQhrvtvQsznRmzoV_tqgHE4xj1ptG0YZAggEVg1g4wdBs6c5KbvLwhBh6xqT8RHQ9GPcpNrk3zRuPZtTw5vs6DaWXczW5y3EjYIr-aR0PRDkH1t4HER9pBq4FWg2mVVMJ_EV-UD5noeYruJ2wca7n3wUdug2mD4ZoYmo71K7uh0kpUFC1JBGsGMm1hxCHE2LSFDaOzDoMpb7Un8FP5l9EUXOgP9Ms2mLROM2o22pzxGLQU9PJuxfuC6yE85W4We1CT1LrNTCLgZa-crYm9G26k44t1RW4orUcJ_lQzDomZUkFwanBguxLhvVetiVnsOY26BXX2Wa3XEozE1nUkc47BJ2l0Cplsr9JfNTuvjtuZPT6cvXzhSnJRzRwrPtE9GzefvzeCY3beQvB6ptTxGaTNJTZ2pR5JWJd7sXZ71zqkCDWDEHCK9AClJQLpaglONRAG8yepVhFTYU8c3NR7xr3JOuT1JTl2xXJJxN1H3r7cRIkkxJiThNZ6RbfeZ-rcUjMDVtSeadok1S7oqdQlzOnmK7UncJNUjNXfP5M4nOb8VafikCCIggg4RWOvb06YY-scAOSK1n2RXtNWeT9LrNTCLgZa-crYL0bbqTjrjpunFqWfSMd2AbOl233WTFtxSNRqOtNh2iTNLqFT6LoZaKlbUmo7CnVJmcMviLTgVjTYoa0mvbZ13fn83YiCq7XkIrO03o2mOaT9Jzh2pHgU-jf7V2-7cyJJrNZxnpsEpMQSCLCDAjbJilXm6nfDJxmpY22H2hE5UmJ4xOLxcFZCuavdYfZJ65EgVkwGEmT9JsNVI8Mr0bzav8AaFSfn04fiCu4QfMRzRtNqtphm6gsUjOGaieVRkrt2LtG26GaTFIzd6oq5JeS5VuVenbA5utylpQLpaglIwqMBxk_SzaYhhPKHKVFKP3K-HXJ6dPzj6xZIyRUgeyPmYnP1FYnk4YvFxTkL5yd2D2SJM0syup4FpWO-Rw5w3EelJK0rF0hQUk4UmI4daXHmmRdOrSgZzWdQtOwSfpe1M3R_wBxfYn9x1pk6868bp1alnOahqFg2DqS2640bptakHMbdYsO2TNLrFT6AsZSOaraL07LmTM8m7944LrIVzVbjb7Mesr06Ym_1iwDkCtZ9kV7TAZ5P0s4qphPJjKVBS916Pi1yUtSzdLUVKNpUYnj1OZn85ZgAu7Tkuc4bDfDYZM0syup0Fo475G8c4e7DPJK0rF0hSVjGkgjh1gfn83YiCq7XkI5x2m9G0xzSfpN92pHgU-jf7V_tCZEk1ms4z1SbccaN02tSDjSYb8eoyZpdxNT6A4MpPNVuvT8MmZ3N3_q3BdZCuavcbdkR1bJAESQALSagNsn6UYbiG4vK9GpHv4fZBGeT8-nD8QV3KMhHNG3CraYdWGKRnDNRVyqMlys7F32-IzSYpKbvVKPJLxLs2Ls33JOLqu4620LpxaUD0jbqFp2SfpdIiGEXXprqGxNp2lOqT04efMXXCrNYkakirt6uMTx-b3i4pyFc5O7B7JEpvSjLsEu-BXnrQfawe1DWZW1isY-qT05Zm48IsA4EitZ1JFe01Z5P0s4qphPJjKVzl7r0fFrkpa3DdLUpSjhUSTx6wMTt-bnmKinChVaN2DWmBlN6SZfglXgnMSjzSfRV2GBxR6nvTlmbiLqwMSbVHUm3bZjMpxSrrkUsjkk5Vrh22J2RPpSJKiSSSTaSYk6z1km1IPTeCT4VvJUax6qrRqMRmEmJ0zORFtVeFBqWnWO0RGfqWpSUAqWoJSLSTACU5pW1E2_-VQ_Ik_NXu4ZKUpZKlqKlG0kxJ6zpWpCgpCilQsIMDKaUoFwbnEEqwOWJPrZJz3vq9SZzPGpsnnGKzeti068QznZGU4nTs5VFZ5vmoF6nZhPpGvZV1rmdILm8ELitnF5yPVzeiasUMLbiHUhbagpJsI_lRxg1jqNPaQDEW2oKew4Q3rxqxJ2nEVKUtRUtRUo1kmsnrbNZ05NVxTWg36DYruViO-Ikw-3OGw42Yg2jCk4Qc_ztFXUSkJ_yMWWT4U3yv7YOAen-W22zrfNpy5NnLtFhv0YFDvxHBqiCy8h9sONmIO8HCk5x_mzqFP559GRcoPhlir0Bln9OM14JEkkk1k1k4z1xmc6VNXI1ltVTic2UPSHGzDGSVJWkKSYpUIgjCD1AfeTN2lOqwWDKVgSNfAROCTrq3nFOLMVKMdWIDMBUOudFzu5V9HWeao-DJ81WTqVg9L1uoFJznlnuTSfBtVesvzjsvRtx9dZlOfpLIUfrE81zXle0K9cRg6enr_0ebqUL9XMR6ysPsiKtnXaj5xyE4ETzHeYrbeq2HDiJ6epV67fDYvWhD21Vq3C5GuPXeZvcvN21m-hcr9ZNRO2-29OLWG0KWqxCSo7BGS1Fa1LVatRUdZMeu9Du851k4RyidY5qt8U7unKSURM3IYbgHUVCO_rxR5InjMMJUDqKVeXf__EAGoQAAIBAgIEBQkOEgYGBQ0AAAECAwQFERIABiExEyJBUWEUIzAyQlJwcZYVNDdDUFNgYnKBgpGj1QcgJDM2QGNzg5KToaKxwcLT1BA1RHSywxYlZLO08FR2ttHhJnWEhYaQlJWktdLW8f_aAAgBAQAGPwL_AN_L1mlqZfvcEr_4VOnFt8w--ZIv96yacaKGP3c6H_d8Ju__AJpxqiiX4czH_cAfnOnGr4R7mJ22--y_H-bSWaS5ACJHkOFJjxUUsdpqVw3c3gq6xRVDA7nKcHGfwkuRP0tAZ5aanHKMzSyD3kXIfyun1RV1Ep-5KkA_S4Y_nGnnMSHnmeSX9Fmyfo6dYpaeHD1qGNP8Kj6ZqNG-qK0ZMOVKf01j7sdaXnxcjtPBNwcEUkznuIkZ2-JQToDKI6RPuz5pMOiOPPt6JDHoDVTTVTcoHWIviXGT5XT6mpIIiO7EYMn5VsZD77diM0nGlbFaeHllk_Yi73bkGwYsygyVNQ-eWQ4nmA5FUciKNijm6fBGFUFmOwADEk9AG_QM8YpIj3dTxWw6IRjJj7sIPbaBqkyVsntzwUOPRGhze88rjo04OCGOFO9iRUX4lA-PstSSTwdPI1NCvIFiYqSPvjhnPLtA5B4IuCpoZJn5o1xw6WO5R7ZiB06B7jPwQ9Yp8Gk8TSnFF-AsnQ2mFLTRxnlk7aVvHK-L-9jl5gPtCvjb_pMkg9xMeGT9Bx7_AIIOBpYXmfmUbFHO7HBUHSxA0Elzl4Q7-poCQnikl2M3SI8mB3Ow0EVNDHDGO5jUKPGe-bnY4k8p-0o7nCuLQjgqkDfwWPW5fgMSrnfgyntUPgeWKGN5ZHOCoilmJ6ANFluj5Bv6libj-KWUbF6VjxP3RToIaaJIYx3KDD3yd7NzsxLHlP2oyOAyOCrKwxDKwwII5QRsI0M8AL0MjcU7zTsd0UnteSOQ7-1bj9t4G1lkxpaQ7eFdePIPuMezHH1xsE5Rm3aZKWIBj28zcaaT3T83tVyoORR9rtFKiyRuCrowxVlO8EHR6mgDTUu1mi7aan5-mSId926jt82BkPgYWCmiaaVtyqPzk7lUcrMQo5Tos9flqqneI99PEfEfrzDncZByJiA_221RR5aaqO0rugmPtgPrbnv0GB3shJzaGCqiaGQcjco75W7V1PIykjwLYr1qmU9cqWGzpWMbOEfoBCr3TDZjwVLHhjhwkjbZZTzu36lGCL3Kj7d4GqiEi9ydzxnvo33qfzHcwI2aNNDjVUY25wOuwj7sg5B66vF5WCbB4FEq7gGjpu2jg2rJUDnbljiP47jdlGDlY4kWONBlREAVVA5ABsHqA1TbgsNRtZoNiwze45IXP5M8uTa2jRTI0ciHBkcZWB6Qf-Tv8CGA2k7ABvJ0StuSAy9tDSttWLmeYbmflWPcm9sX2J6hcbCKqUdaqQOMPaSeuR48h2rtKEYti1NUpkkX31dTudG7pDz-MHBgQPAaqIpZ2IVVUYszHYAANpJO4aLV1qq9YdsabGWm_YZudx2m5DvY-onBS8WVcTBOBxon_ejbu05d4wYKwkpqhMksZwPMRyOp5UYbVPN0-AwKoLMxAVQMSSdgAA2kk7hoKurUGtccRTtFMhG4cnDHu27kcRe6Leo3Cwr9W06kxYb5k3tAfHvj5n2bA7HwGG6TrmfhGSlDdquTY8w52zEop7jIx3kFfUgVcS4QVuZiBuSoH1wfhMeEHSZMNi-ArAb9KWlHpMKK3TJhmkPwpCx9_wBSZ6bDrmXhIDzTptj28mbbGx7x20IOwjYQd4PT4CaKM7VEomf3MAMuB6GyBfhepc-UYR1OFUn4XHhPlhJs5Bh4CaupPpMCxj3U744_iwsPhepdJVjfDK0Le4mXMCegNHh438BMs3LPUtt9pEqoP0-E9S65eVIuHHRwDCU_ooR4j4CaBe-g4X8uzTf5n_ds9S5ovXYpI_x0K_t8BMMPrUUcf4iBf2eplSneVEy_iyMPAPRxeuVVPH-PKq_t9TbiBuFdVge9USeAe3jmqFf8mDJ-76m3L-_1n_ESeAelPeLUN_8ATyr-tvj9TbiRy19Z_wARJ4B8e9pZj-eNf3vU2sbvqqoPxyufAPP_AHCX_iKb_wAfU2R8cczu2PPixOPgHqv7p_nRepkj7skbtj7lSfARVf3T_Oi9TK5-8o6lvxYXPgIqv7p_nReplxP-yyrs9uuT9u3o8BFQOQ0Mh98VFNh-s-plefaRL-PURL-3b0eAgjvqSYePjRN-7j2LzV1tu8NAkucUdGvX7lcZEGLRUFDH16cjFRJLglNAXQ1M8KuG0kptRLTRasUOJEdwuSRXi8yDE5ZeClXzKo8y4Zqdqe5ZWGyrYHDQz1H0R9cY3JY4UF-r7VDxsMfqe1zUcAGziqI8qbcoGJxE8H0R9cpHBBwrtYLjc4dmO-nuU9XTsNu0GIg7MccBhFT66W2362UO6Sspo47Leh7fNSx-ZU-XYeB8zqZpMMDUpjmDVmqt1WaogRXr7PVAU14tubAfVVEzEmLMci1dM9RRSPikdSzqyr2Oe39XPrPfoC0clo1fMVQtNMpymO4XNnFBSMrhkmgjkqq6BlIkoxpIurlmsGrdKS3BNLHNe7kgOxc1TUtT0Dkb_wCql42_FeKTI2vdSh3ZYLRq9TxgYk4BIbQi8vbNi5GGZjhpmOuAro82YwXCyWGdG7XZwi22KpVSBhljqEHGYjB-MIodd9UqCvp8VWWv1bmloKuNeWXzOuEtZTVcpHpa11ujx2gqOLoZNVb3FPWRJnqrNVr1FeaQbMTLQzHNLEuIVqqjaqo85yCoL4jslV7Z6ceP6ojb9mPgIpx36VC-PrDv-5j2GW81YSru9bwtJq7aC3GuFxEebPKAyutuos0ctwnUgqjRwIeqamnVqvWHWa4zXK51jYtJIcIoIgTwdLRwDrVLSQg4Q08Kqi7TtdmZkr7XQRWmwMf6_vbS0lFPgxVvM-JIpau4kZXGemgNIsimKaqhfAaJ_pDrprDcJsOueY1LbrPEDlOKp1dFfGIVsvHOXMqnraFxweFu1o1zpZsG49bNZK-PNsyngoLNbWwHGzDhuNiMGXKc0-r-r-ucGugozJHX1dNbGoIqGrRsrUBk6srYKyeI51nkpZmhjdcjETcLBBSXuw3GqtV1oJRLS1tJJwcsbDeOVZInGKTQyq8M0ZaKaN42ZStkvZprdr1QQZqikTrVNfKeIca5WtWOyVBxq-gBLQbaiDNSlhTdgqrjcaqCioaKCWqrKyqlWGnpqeFS8s00rkJHHGgLMzEAAaVerOotRVWTVFTLT1NxiL0121jTFkYs4yzUFpmXtKJeDqaqJm80GySmhhgtNhtldd7nUnCCht1NLV1L4ds3BwqxEaDjSythHEmLyMqAnRKjWi72fVGJwD1MAb9dY-fhaejnp7cOTAJd3bHEMqYbSKvXfWCaTg2Aant9upkEuPEcxyGrJjUdtFwgZztEybtC1h1_lWUDZBd7Grxuemro69GiH_oU37TDq_rHNa6ipqqFblTTWqqkqYJaN6iopkkYTwUtRCxkpZeJNAu7iltulNcbZWVVvuFHKJqWtop5Kaqp5V3SQzwskkbjnVhsJG46UWpn0Q54abWOUx01n1hyx09HfJDxUpLgq5IaO7SHKtPJGqUlwc8CEp6vgkrOxN01EGHxk-AigPPKU34fXI3j_e3cu7l7A8kjrHHGrO7uwVERRmZ3ZsAqqASzE4AbTpcrzHLJ5hUDNatWqdiQsdqppGy1ZjwXLUXSXPXz5gZEE0VIzvHSRYDXfW-nY6o26qyW22uuCayV9O5E3DHebRQyrwdQq7K6pz0mcRwVaPFT08UcEEEaQwwwoscUMUahI4oo0ASOONAFRFAVVAVQAP6KgWmoamvus9ULDbqiJis9HBLFJNc6-FhgUkho4zTQyowkgqq2mnTbF_TQXuzVk1vulrqoqyhrIDhJDPC2ZTtxV0O1JYpA0U0TPFKjxuymiv8AFwUF3p8KDWK3RnzldokUyNGhLOKKuUiroWJfrMhp2keopp8v09T9DTVyrwsFlqAmslTA5wu96ppMWtzFe3obNOgEiHiy3WN2KkUNNI3mNZ8tJQ0ipPe73OheltVI7EKxQMhqayoKslHRI6tO6szvDTRVFRCLVqxblikkVPNC7VGWW7XWVfTa6ryqSoJJipYhHSU-ZuAgTM5b-i7a2VMQqp6cJS2qhLZRXXarxSip2bEEQghqiqZOuLSQVDRhnCqbhrJrFXSXC7XObhaid9iqAAkUEEQ4kFLTxKsNPBGAkUSKqjZ_QGUlWUhlZTgysNoII2gg7QRu0fVXWKqMuuGrdKjdUzPmnvtlVlhjuDM3GkraJ3hpbk7caUy0tWWeSon4PsK_3uH_AAS-Aigk7yspifFwyY_mx7Be-ppDHcNZpI9VqJlODILnHO9xcd0MLRTV8auMvBzSwsGDZcdX9U7fxam-XKCi4XLnFLTk8JW1rrsLR0NFHUVkqjjGOBgu3DS2WC0QCmtlooqegooR3MFOgRS7YDPK-HCTSnjSys8jcZj_AE_Q1hOIpOC1rkTbsepDavLJmGbaYozFkJXi8NJgxzMB_TQU1XUcFq9rY8NivCuesxTTPhaLie5RqOukWOSZuLHQ1daTyFfpr1fYHCXeqC2XV8EjHzYuKSrFOAe26gp46m5FNucUeQ7Gx0t9mtsMlddr1XwUVJFiWeerrJhGpdzjgM755pnOVEzyyMFVjpbtWbYsclQqLU3q4hMsl2vEqIKusfHjcFioho4mx6no4oISWZWd_wCnVVBj1O2uMbScY4cMtku4g4uXKTkeowYuCu0KrBmKf02PWy1seqLRWpNLDjgtZRPjDcKCT7nW0ck1Ox7aPhBLGVkRGFuvNtmFRb7tQ0txoZxulpK2BKiCTozRSKSOQ7D2Ff73D_gl8BAYb1II8Y26K43OoYeJhj9PqRqsrYJR2u4awToPTHudWLdSMw-4i01ojw_6RLjjsw1j1pmjDrq1ZoqOlYj63cL_ACyxiZD362-33CA4bkqjm7YfSdXWenervWqFW15gpYVMk9ZbHhMN3paeMdvMIhBcFRQ0svmeaeBHmnRT_RDQ22jq7hXVL8HT0dDTzVdVPIdyQ08CSSyue9RCdKq3XGlqbfcaCokpqujqonp6qlqYWKSQzRSBZIpY3BDKwBB01Q1kmk4Wtq7THT3N82LNdba7225SPiSymespJahQxLcHKhxYEMfpdWNTYZD1PZLVJea1VPFa4XiUwwpIvrlNQ0KyRnDYlxfA8Y4XvXisiDQar0i2-1lwD_re8JKs08e_jUdsjniftf6zjKk4HD6S76t05RLshiutiklYLELxQBzBFI52JHWQyVFA8p-srVmbA8HlNZarrR1FvuNvqJKWtoqqNoqimqImyyRSxttDA-8RgykqQf6YY7jRVdDJUUsFbAlXTy07zUdUuemqo1lVS9POnGhlUFJF4ykjQWaokz1WqN2q7UuY4v5m1eFzoGY4niq1TV0cQ2ZYqNUGxR2H3NVCT8Ug_WR4CbfJ_skKn3UaCNv0lP097p82PmTadX7eBt4nCWuG6ZdoA33LNxcRxt-bMBrVdcoEtdrc1CWy4M0Vts9smj42HGQSXScLtODcJuOP0tReaB63VG8VbvNVyWdKeS11dRJiXqai1TKFSd348jUNTRLKxkkmSSaQy6Z73r3d7lSCTN1NbbNSWeYx4jCN6qorbyCd4Z0pkxx4oQ6Gl1SsFHbGkXLUV2DVN0rBv-qrlUmWslTNxlg4UU8Rx4GGMbNNdUjXLFWzWu6J0tcLLb6mpb361qn_AMNw1ksjsWNm1m6pixP1umu9vpisYHIvVVDWS9LSt9Nr7UMzEU92jtSAk4ItnoKS15VBC5VL0jvgBgWdmxcsXa1VuTJLrFd73eJsVIc8HWmywk47cpp7RE8fclHDr22J-lD602KKW4RxiKC9ULtQXiFFxyR9WwYGphjzNwdPWpVU0ZZmWEMcdM1LrhrVDTYjrVRFaamfDMcfqiOjpI8cmAB6l2Ni2BByCC4eZlXrNc6dlkhq9ZqiOuihmGDcJFbYKektmKuM0LVFJUzQkKUmzjOdRta4UUSVVJc9X6xgMOLQyQ19tGzYfP1zBxwKhUAzDtNerHmOStstruuTZhmtddNSFhygkXgBsuxsFz9qnYZj3s0B-UC_veAmNfWJp4f0uG_VMPp9ef8A2Z_7H6v6VWBBy64XkHoPUFnOB5jgQfEQeXsGcEk1Oq1kmbHkYS3CnwXoy06nb3RPJhp9EqkwJ4SHVOoBzcVeBfWKNhl55OqF433PA47MPpfolf8AX_XH82sNxA0-h8qKFBsQkIHfy1dTLI3jeR2Y9J7Dq3UnHhIteaKBd2XJUWDWGR8dmOONLHhgwHbYg7Mt_wD-oF0_7Raq9hrugQN-LUwn9WI9_wABNwj7lZYHHjkWQN-aNfp9YKhgwF1tur1ehOODLHZqS14rio4ue2uuwsMytxscVXXC0Y8eh1qjuTLhuW62ijpkOPSbPJs5MvT2C7wBixtlnsFCwJxyGS3pcsq96MtwV8O-ct3Wn0R7iQMs9TqvRRtl2g0sd9nmAffgwrKcsuztVJx2Zfpfoi07LlMmtd2r8OMeLdahrorcYA8dawP3ozYISmB01TXMDLbJLza6jDHitBea6aBdrMceoqikY8mJ4oVcAOwakWHOeFrr9X3fgw2zg7Tb-o87rjvzXrCNivroUjjg62XTBslHqj1Ax7jNcrzbahA3F7Yi1SZOOuwPxX3p2C4j_ZJ3_JoZP3fAQr8EKaJu7qTkJHOIgDL4syqrd9ht04CMmR2bPNKRgZHww3bcqKNiricNpxJJP0-petCR8S5Wetsc8g3cLaKzq2DhOTPJHeJQjdsywFd0S4X6opLNDfIL_TUMNRSTV8lAsc1vlqHpqgPHTVWcqlXVR5Sg-u4hxtDeh3b_ACjqPmjT0O7f5R1HzRp6Hdv8o6j5o09Du3-UdR80aeh3b_KOo-aNPQ7t_lHUfNGnod2_yjqPmjS_621kC0s98r3rDSpKZlpY8qRU9MszKhlEFPHFFwhRM2THIvaimuEqlZdaL3dL2M3bCmjMNnph7hha3qY-dajNuYfTSXVUwh1nsVquecdqamjjeyzx-7WO200r_f1bHFjpc7BDq9T6wUdfdPNaLh7lJQGjnelgpakLko6rhFnSlpjvTI0ZOB4Q6eh3b_KOo-aNPQ7t_lHUfNGnod2_yjqPmjT0O7f5R1HzRp6Hdv8AKOo-aNPQ7t_lHUfNGnod2_yjqPmjT0O7f5R1HzRpR3uut8Vop7dbI7bQ2uCqerihHDS1FRUGZ4oC89TJKA54JcIoYI-NweY63azOhVr3fKW1wk93TWKkaXhE9o1TeaiIkds9OQ31tew1lPD9dmp5Y0xOAJZCMpPJm7XHp0IkoKtcMdvU8pXZvwcKVYdIJGhDAgjeDsI8Y8AtIsozKpklynaC0UbunxOFb3sOw02r9dcJLTLRXSC6UdzhpVq5YJI4aimli4FpqcPFUQ1DB14UDOkMmDGJdPREuHk5T_O-noiXDycp_nfT0RLh5OU_zvp6Ilw8nKf5309ES4eTlP8AO-noiXDycp_nfT0RLh5OU_zvp6Ilw8nKf5309ES4eTlP876WfV63LkoLJbKK10g2ZjDRU8dOjvhvlkCcJK52vIzOxLEn6awiqvE1irLDLXGGsp6GOuaemuCU_DU0kb1NLsEtJBLG-dsnXQE66x09ES4eTlP876eiJcPJyn-d9PREuHk5T_O-noiXDycp_nfT0RLh5OU_zvp6Ilw8nKf5309ES4eTlP8AO-noiXDycp_nfT0RLh5OU_zvp6Ilw8nKf530sup1vqHq4LRDOrVkkQhkrKirq562qqXiV5AhkqKiTKnCScHHkjDEKOxitCATwSIpkAGZopOJkY91g5Urjjl42GGZvALS-2WoA_8Ah5W_UPU8jv6mBf8AE-38TwC0B9vKv48Eqfvep9MvPWqfxYJ__wAvALbm_wBsgU-J5Ah_M23sVBLrjeRbmubyrQU8VLV11XUCnycPItPRQzyJBDwkYeaUJFndEDF2C6fZHcPJ2-fyWn2R3Dydvn8lp9kdw8nb5_JafZHcPJ2-fyWn2R3Dydvn8lp9kdw8nb5_JafZHcPJ2-fyWn2R3Dydvn8lp9kdw8nb5_JafZHcPJ2-fyWn2R3Dydvn8lp9kdw8nb5_JafZHcPJ2-fyWn2R3Dydvn8lp9kdw8nb5_JafZHcPJ2-fyWn2R3Dydvn8lp9kdw8nb5_JafZHcPJ2-fyWn2R3Dydvn8lp9kdw8nb5_JafZHcPJ2-fyWn2R3Dydvn8lp9kdw8nb5_JaQatat3yoqbxVQ1M1NTVFquVEJlpImqJwk1VTRRGRIEklyZsxSNyO17Jb076WduniLGP39vveAWKX1uWOT8Rg37OxaoVuplqgvMFqpLpS1lN5o2y3VNPLVzUsqz5rrV0ME0EqQCMCKZ5Y3Qlo8r5tK_WK7aqCG3WqmmrbjwN5sVbUUlFTI0lRWPT0VyqHkghjQyy9T8M8UWMrosccrIsaDM7sEUc7McAPfOnnb5an_i6edvlqf-Lp52-Wp_4unnb5an_i6edvlqf-Lp52-Wp_4unnb5an_i6edvlqf-Lp52-Wp_4unnb5an_i6edvlqf-Lp52-Wp_4unnb5an_i6edvlqf-Lp52-Wp_4unnb5an_i6edvlqf-Lp52-Wp_4unnb5an_i6edvlqf-Lp52-Wp_4ujO1NxVUs3XYDsAxOwSknxDbpqrrQrMqWa90NVVZMcz0HDCK5Q7NvX6CSpgPOJCDiNmgZSGVgGVlOKsp2ggjYQRtBG_sdvTvY6hvx2iH-X4BqKbHEyUsDNy8fg1z_E2I7FfrI2GW8Wa6WpswxXLcKKekOIOAIwl2gnQZlKS08wzKdjLJE-1TzEMuB6dARtBGI8R-1p4fWpZE95WIH5tNQ7s7ZpqjVe0R1LY5s9XR0qUNY3wqqmlOXaVxykkjE9igTvKJPjaab9gXwDQrjiaeSaE_j8Ko95JV97sevdnycHGmsNbXUqd7RXci70IHQtJXQgeLSmblVOCbxxcTb4wA3v_AGtVDnZG_HiRj-c6aorJiTSzawUoYtmLIusV0lTxBElESrtwWMeIdiqR62kEfyKOfzuR4Bq6lJ9aqEHxxyH_AHXY9Xda4oyKfWKzNQVLgbDcbHMAWdsMFaS311EkascWFLIV2K2FRSnonT8ySf5fx_a0_QIR8ih_bpq5_wCcNYv_AL5W9juD_wC1zIPFG5jH5lHgGpsTgtRnpm_CDifLLH2O61VOhe4apVEOs1MFHGampFkp7rGSMSI1tlTU1hGHGko4scBxhBKTgmbJJ97fit-Ljm8a_a1W33Zk_J9b_d0-h_SuGUy2eW6YNvyXy41t6jO88Vo69WX2pGwbh2Fnbcqlj4gMTo8jb3dnPjY4n9fgGjlTY8brIp9shDD840hnTtJoklXxOoYfr7FPSVUST01VDLT1EEgzRzQTIY5YpFOxkkjZkYcoJGmseqc4fg7ZcJOoJX31NqqQKq11ObDBmloZoDLlxCT8LF2yHRAxxlg61Jz4D623wk5eVg32pNOd0UbP4yBsHwjgPf0t1pol4avu9wpLdSJyy1dfUx00C_DmlUe_pa7NSbKW026itlN_d6CmjpYfk4l7FWuzqjPTyxRYkAtJIhRQoPbEY5sBjsBO7wECInj0kjw9ORuuRnxYMUH3vsdt-iRbafGrsOS06wZBxpLPVT_6vq3wG3zPuEzQMe24K4hm63TcVSx6zL1uXoxPFf4B3-1Ldj4KgoquulG0x0dNNUyfiQo7fm0Bj1Vu65t3VNP1Gd2O0VZgK_CwwOw7dMW1XrjicOtyUcx98RVLkDpIw0L3Ow3igjG-Wrt1XDDux2TPEIiOchzht5vpko1O2TCSX3CniD4TjN8Dp0jv9REWtepNKbrIxw4N7tVCSks8B5c6t1VcoyMMGtoDHjBW7Dw0vGkbFYIQeNK_7qLvd-Qc7FVJnqpC7dyu6OJe8jXuR-dt7Enb4CHpieLVxEAfdYcZE-T4YeMjsdfZ7pTR1luulHUUFdSyjFJ6WqiaGaM-6Rjgw4ynBlIYA6XXVWu4SSGCTqm0VzjAXKz1DMaGsGAC8JlDQVSoMsVbBUwjER4nqaU9fgHFx3yRbgfGnanoynacewJVRQi12hiP9aXBXRJV5TQ04HC1vQ65KbNipqVbZoklZSvrBWr2011walzcvB25MKXIe9qhVsPXNFp6OmgpIE7SCmhjghX3McSqg94fSSGts8FLVvj_AKxtirQVgc-mM0K8DUtt_tkNQu7ZsXCa40LG92OPF5KmGPLWUSb8a2lBfrSDtquAvEAC860wyg_0PPKeKg99j3Kr0sdg-M7NC-VpJ6iQKkcYLsWYhY4o1GLMe1RFGJOwbTpb7ZWRKmsF2Pm1rE2wtHX1UacHb84xxW10qxUhCu0TVS1dRFsqOwvLIwWONWd2O5VUYsT4hpJUNiI-0p4_W4QeKPdN2z-2J5APATFUQtllhdZEbfgynHcdhHODsI2HQUVfkE7_AFiZRlEpG0xuu4PhiVK4K2GXANhm7FwtriiGuGryzVdjlOVDXxMM1XZJZSQAlbkV6R5Dkgro4sXignqmJDJJTVdJM8csUyNHLDNGxjlhmicK6MrBo5Y3AYHMrAHQSpsbdLHyxvzeI71PKOnED6Wn1g1xpxLM4jnt9jl2xQowDpPdIyOuTHYVoG63EPPYkkYwQBVAVVACqBgABsAAG4DkHYJdbNW6YR2_NjeLbCOLRvI3n-lTuaR3YLUQJspWIljUUxkFMzuwVFGLMdgAHKdMqYimjPW174-ut0nuR3K9JbGD6JusdKfMOz1Lf6M006cW63inbKbng3b0NolBEDjizXVMA_8Aq-eJ-wpSIePWvg33iLBn8WZzGvSuceAtJEJV0ZXRhvVlOKkdIIx0p6sYYyJ1wDuZV4sq-84OGO9cDy9jrPom6mUZavjjM-ttnpo2Z66NMoN9oYY1JNXDHibtENlRAnVygVEVUasSxeJ0PayL3p_Yd4PvgiWFvdoe3jbvWH6jubePpP8AS-7Q56Kgn4OzwSLxKmvi2yVrA9vDQnBYdhV6zMcwakZW7DWXHWiqgp7Y0clO8MoEklcZUZTRU9N21VLOmZeCUdpmeQrEruKzzMimpLOaud6GmncSVC0plY0y1Ui7Hljiyg4cXNicWPG0S6XRJqDUa2VK-aVdxo5LtLGVdrPa22EyOMBW1inJQRPji1S8MTUdrtlLDQ2-300NHRUdOgjgpqWnjEUMMSDYqRxqFA6OxSIDxKVEp18eHCSe_ncqfcjwGVVAx5qqL80cw_3Rw90eyV2vX0NaEMXz1d-1TpI8GL7XnuNhhXYxbbJU2iMZi2d7eGLCjGaMtHIhKujA7cDxo5EOHLsIOBB3YMNAh61UcsTHtumJu69z2427CBm_opKCmXPU1tTBSU67eNPUyrDEuwE7XcDYCejS22ajH1PbqSGlQ4AGQxr1yd8NnCVEueaU8skjHl7BidgG0k6T2-wNFrPf1zR5KaTG00UoOU9W10eydkOONNRGRyVMcs1KeNo111iuElZNxlp4RxKOhiJx4CipgeDgi58MZJDx5nkkxY0msuukdVY9TcUnp6U40931iTtkFMrLnoLXJs4SvkAnqIjltydd6upqO0WehprbbLfCtPR0NHEsNPTxL3KRrs2kl3Y4vJIzSSMzszHsJJ3DafFpUVB3zzSy_lHLft8BlHNjghlEUn3ubrbE9C5s_wAHstTf9XHp9WtcpM0k0_BkWe9y4H-taeEFqeqdsM11pI3mOLNV01c2Ro2tGtdmq7RWDFoHkXPSVsSnzxb66IvS1kPO9PK_BvjHKI5VZFCT_VMftjhKPFJ3Xw8T7YaatmsraaihhqpakmvlipVE1PR1E1IgeeRInkkrEgjjWN2cuwyqdAQcQdoI2gg8o-mNVe7vbbTT4E8Lca2npFbDkTh5E4RuZEzOx2KCdmksGrlPV60VoxCyor261K-HdVVVH1VLlb1iiaOUKctQoKuZKe4XLzOtL4jzGtGejonQ9zVNwj1NdswxWrnlhzDNHDHp1BqlY6q5ZGC1VcRwFroMcDjXXKbJSwHLx1hMhqZgD1PBM3F0pr3re1PrdrNHkliikh_8nrVOMGDUlHMua41MTY5K24KIxxJILfSzxiY9jr5dxFLMFO7jupRP0mHgOpKnHEywIX--rxJflFbsstn1ktFBerbNtekuFOlRGHAIWaLMM8FRGGPBVMDRzxE4xyKduk9d9Di--ZjsS62DWFpqmgG363SXiFJq6CNV7RK2muMjv9crEXaJG1h1RusNJHjjc6KIXS1ZcMwdrhbjU00GZQWCVLwy4Bs0alWAVbDrNebbEu6lgrpjReNqGRno3I5C0BI24bzooqKyz3jLy3K0xIWA5GNqe2Y82PbbScc23T6q1a1cmOX-ztc6bj991ysq-L7XEn255TwWqtiSTZg0lTXyoNu3FFeInZiB1xcDt24YErTUWrNuHctBb62aYdrvasudRExGBGyBRgxxGOUqVqdcLlToe4tQprNgO94S1QUkxHu5WbnJ0yQQ3a_3SfuYY6y61823mQT1Em09O06RyVFki1WoXyk1es1R1FIF7rC2QLVXYSAblnoqeNmIHCrxmWGs1trKzXSvTBuppFa1WNH3-cqaaSsqsjctTcOAmC9cowGMekNutVBR2ygplyU9FQU0NHSQL3sVPTpHFGPcqOyyr6_NBF8T8N-qLwHT0pO2mnzL0RzjEfKJKff-0JHv-pWrlxnl7esktVLFcD_6xp0hrh71QNGMFiudoLY_1bfroQCeVUuU9xRcDtCheDG4Jl4ujMt618hB3Rx3WwlF9yZtWZZOnjSNtPNs0_r_AF__APmmrv8A-q6KZ_8ASi55QuIrb3GgfDeW8zqC3nF-6yFB3gXRGpdQbRUOmBxu7118DsOV4rzV10DY72TguD5MmXAadS2i2W-1U2z6nttFT0MGzYOtU0cUewbuL9oUMHrk8sv5FAn-f_zt8B3Ak8WrheLozp11D-gyj3fqNTQ8kVLm-FLI-P6KIff8B1PUrvgmjl8eRgSPfGz39FdTirqGU84YYg_F6i1zciSCAfgFWJv01Y-_4D6bE4vT40r_AIHtPkTGfUSad-1hieVvFGpY_q0eR9ryOzsednOY_nPgPqaJjsmQTx-7i4rgdLIwPii9ROAB65WuIungkweU_mWM_fPAhTVY9KlBfpjPFlHvxsw0DKcVYAgjcQdoI8fqG_Btmp6YcBCeRsD1yQe7fceVFQ-BFYWPXqLCBucxekN4soMf4P1Ckt1G-NQ_FqZV9IQ9tGp9ebc3ra4-mHieBGOYk8BJ1qpH3Nu7w54zg45SAV7rQOpDKwDKwOIZTtBB5QRtB9QHoKFvqnDCecf2fHuI-ebnO6L752hJOJO0k7yec-BOehlfMKcJJT49sI2LB0x71WyZebMRuygfb0kyHr8hEEHRI4PH_BoGccmYAHfoSSSScSTtJJ3knlJ8CkaevwTxfEvD_wCT9v2-D7_K3yaJ-_8AH8fgUt5-75fx1ZP3vt-Be8oo_jaac_qy-BW3f3uH_GPt_DvaaEf42_e8CtvG_wCqA34gL_my4_b46aSEnp40o_Z4FaU-trPIfyEiD9JweX9v2_Sv31GF_EnmP7_gVqZeSOkK_Ckljw_RRvt-3Tf3iNvkWT9_l8XL4Fa6o9cmjh_IoXP-_H2-snLBVRPj7Vw8R_SdPi8CtNzzGWY_CkYL8mqfb9dDhiTTuyjneLrsf6aL4FMBv0p6cekwRRfiIF_Z7_qBV0uGAimbJ96bjxH342U-BJIKeNpZZDgqLv8A_ADezHYo2k4aJPWZaqrGDYHbBC2_iKe3YeuP41RSMT6gQXFBxWHU8-HI4xMTH3S5kx5MiDe3gRCqCWYgADaSTsAA5zpnkANbOo4Z9_BjeIE6F7sjt329qEw9QZaadc8UqlWH6iDyMpwZTyMAdDBLxo2xaCbDizR8_Q64gSJ3J51KsfAe9fKuMVJsix3NUMN_4FeN7p425PURqeoXZvRx28T8joefnG5hsOzRqaoG0bUcdpKh7V0PMeUb1OKnaPAfSw4YSFBNNz8LLx2x6UxEfiQeorR4AVEWL00nNJh2hPrcuAVubivvQaMjgqykqynYVYHAgjkIOw-A2ipyMVedM4540PCSfJq3qOZVGEdYgn6OF7Wb3yQJD0yeA0yH-z00rg-2crD_AIZH9R4KjDjU9Rl8Uc64N-mkXgNuMvMKaMe_wzN-pfUevTvYeG_IMs36kPgNq376ry_iQxn9_wBR3jfasiMjDnVhlP5jpNTSdvBK8bdOU4YjobeOcHHwGP01kxPj4OAfqA9SPNWnXHBQtYo35RsSf4I4knMoRtwc-AoGClfgz6dJ1qLxh3wz_g856NA9wnM7eswYxxeIyHrrj3IhOghpokhiXcqDlO8k72Y8rMSTz-pGB2g7CDuI0ertiGSHtpKVdskXOYhvkj9ptdOTMvaeAXClppZuTMq9bHupGwjX4TDQNXVKQjligHCyeIucEQ9IEo0BjplkkHp1R16TxjNxEPTGieppkZep6k_2iEAFj91TtZfGcH5M40LRJ1bEO7p_rmHtoO3x6I-FHttCrAqw2FWGBB6Qdo8AAjhikmkO5I0Z2PvKCdA1U0dEnM3XZvyaHL-NKpHNoC0Rq5B3dTx1_JACLD3SsenQKoCqNgVRgAOgDd6o4VVNDNyZmXrg9zIMJF-Cw0LUdRLTnvJBw0fiB4kg8ZaTQkQCpQd1Stwh_JkLN8SHQq6sjDerAqw8YO0ezv6lp3dOWVuJCOfGRsFOHeri3tdA9wmM7csMOMcXiMn11_g8FpwdNBFAvNGoXHpY72PSxJ9V8tVTRT8gLrx19zIMHT4LDQvb6gxH1mo48fiWUDOg90sp6dMKuneMY4CTtom9zKuKE-1xzDlA9m4ZYuAhPp1RigI50TDhJOgquT2w0Dzjq2YcswwhB9rBtB_CmT3tAqgKBsAAwAHQPVso6q6NsZXAZSOkHYdC9ITRS96vHp2P3snFPwbBR62dCZ4M0Q_tEOMkPvnAMn4RU9mQVQWYnAADEk8wA2k6B6j6ih-6jGcj2sPc_hWQjvTorJDw049PnwkfHnQYZI-goobnY-wEuidRzn0ynACE87w9o3Tl4NjyvoWWPquEem0-LMB7eH64vTlzqO_9lwigjeWRtyRqXb4hj8egevkFKnrUeWSc-NtsUfxyHnUafUtOqvyzNx5m58ZGxYA96uVPa-wUmeACU-nw9bm8ZYDB_wAIrjo0L0Ui1cfeHCKcD3zwb4c4ZSeSPQxzxvFIN6SKUb4mwPsp4OlgknblyDYvu3OCIOl2A0WS5T9PU9P-p5iPjEa-5k5dODpYI4V5co4ze7c4u56XJPsJ4OqgjnTmkUHDpU9sp6VIOhagnaBvWpsZIvEH-uoOluFOhNRTNwY9Pi67Dhzll7T8IEPR7JfqWnZk5Zm4kI5-uNsJHermf2ugevkNU_rUeaOAeM7JZPjjHOh0EUESQxjckahF-JcPj5fYcWaDgZT6dTYRNjzsuBjc85ZC3ToWo5ErE7z6zP8AiseDb3pAx5E0Mc8UkMg3pIjI3xMBs6dx9kAZYeAhPp1RjGpHOi4cJJiNxVcnO40Dz41sw5ZRhCD0QDEH8K0nvaBVAUDYABgAOgexLg6mGOdOaRQ2HSp3qelSD06F6CZqdvWpcZYfEH-up4zw3i0PVFO3Bj0-PrkP469rjyCTI3R7GwiKzuxwVVBZmPMANpOivU4UUR29c405HRCCMv4VkYd6dAyQ8NMPT6jCR8edBhkj8aKG52PsYLLH1JMfTKfBVJ9vD9bPTlCMe_0Lxp1ZCO7pwTIB7aDt_Hk4RRytpgd_sW4OlgknfmRcQOlm7VB0sQOnQPcZxGPWKfjP4mlIyL8BZOh9MKSnSM4YGTtpW91I2LnxY5eYD2OY1EAEvr8XW5vfYDB_FIHHMNGkpfq2EbcEGFQo6Yu7_Blid-RdCrAgg4EHYQeYjkPsSwpadnXHAytxIV8cjcXZ3q4tzKdA9wkNS_rUeMcA8bbJZPkxyFToIoIo4YxuSNQi_EOXnO88vsg-qIsJeSoiwSYfCwOce1kDrzDHRpIR1ZTDbniXrqD7pDtPjZM68rZfYfkpIGcDtpDxYk91IeLjy5Ri55FOiyVx6sm35Nq0yn3PbS_DwU8sWgRFVFUYKqgKoHMANgHskaRB1LVHbw0S8Vz92j2B_djLJzs2GGmSpi4pPEmTjQye5fDf7Rsrjmw2-wtYoY2lkc4KiAszHoA_5A26LNdDid4pI22fhpV3-5iOH3Q7RosUMaRRoMFRFCqB0Aeydopo1ljcYMjjMp94_mO8HaNujVFszSxb2pTxpk-9HfKvtD13m4QnZgd_sI60ODgU9dqXHEXoX1x_aL8IqNumWnTGQjrlQ-2WT3-5XmRcF5drYsfZU08GWnrd-f0ufomA7r7qBm77OMMHgqI2ilQ8ZW_WDuZTvVlxVhtB9gy1VXmioseKN0lThyL3sXPJvPapysqQwoscSDBEQYKB_wA7zvJ2nb7LckoyTKDwFQBx4zzHv4ye2Q-MZWwbRqapXBhtVh2kickkZ5VPxg4qwDAj2CLXVq_UinrUR_tJHdN9wB_KHEdqDmwGwDYANwHsvMMwwcYmGYDjwvzjnU92m5hzMFYPTVC5XTce5kTuZEPKjcnMcVODAgewHhpweooG65ycM-8QqeblkI2hcAMCwICqAqqAFA2AAbAAOQAezErsWqixamlPI3rbnfwcm496cHAOGBeKVSkkbFHRt6sN49gEVLDvc8Z94jjHbyN0KPxmwUbWGkVNAuWOJco5z3ztzs5xZjyk-zPzTp067EPqpR6ZCN0vuou6PLFv2Rj2AdVSr9U1gDbRtjg3xp0Z_rj-NARins0IIxB2EHaCDvB0eNR9Ty9dpj7QnbH44m4vPlyse29XoomGMMfX6j72hHE_CMVj8TE8ns2kKrjUUuM8POQPr0fPx4xjl7p0j9XmqmHXK18RziCLFYx8JuEfpBTm9m9TABhGW4aHm4KXjKB0IcY_Gh9XIYI-3mkSJfdOwUfr26RQR7EhjSJPcooUfmHs3pK4DajGmkPtXxki95WWT339XKXMMcgmkHulifKfeO0dIHs4rs3cojjoZZUI_wC7xE_b3__EACwQAQACAQMCBQQCAwEBAAAAAAERITEAQVFhcDBQYHGBIECRoRDBsdHw4ZD_2gAIAQEAAT8h_wDvLHorhmd6vah7L9mLpfMVeNRdjG3SXM-gxN7i9X1XgEeE_INScXHw6tjnKcbqQhjGDLWOLcGZ2O1Mc52L2kz8f5angeT_AKmqf3qAeNJfcEfs3XUKhsZtHKffBneSAi-CSpczKJm5zN5-oYC1FJDA9iYGLxY7TGsGkLrWOsRqWfQqCLqx1VmdpAAmUJ8_zh9pxDbNfKoRNpYt3fChoiiwQm95xDhjQkiaTMGqeaqbQtZL2ieiIuUwSFOwE6rJRkVVsSlgXxgxGSMidRLOqHfkKF-auUReVbu-LwcghzuUJwZRHaEUt7yJ_scTvpH9SrbJhlFiBcjqgpwo86Y42xIlhV9hKFuu6V2lZaVbtAbW7bQ3r3X1TOtmxgX7HhCgaTBkVgd47TcqtH7JOIIsqRgNrmS6EHZ3o0COcNXl2C2tSSUgyvdOsWGgJrGZ84XfOG4C0ftDYp4UF1JKKRR0nS-VTYZXclYWj2cxSgA5y7FEYTfWOsAKBFg85NrCUqxZ-2OwNIhEkEdIbszBmHwomuB2ZjdoS0FS6J43whqp0iPw1Z0URuU-6yF6Ny6dUZkEqxss3HW0KYJkmEmR7LRxrU09X_tgU6xWMURPHJ3QzGwz949txyrsPfww2NWWcLnnoLOzZFOycwLjkEHqmhqcz9UPg6CUDAHAeQCtPJll2fkuAT0rN89C2sdRwECiPZAECgAVDAAWq0Ba6xpsI9wWCifI9Gn0ZzQgkS7qdQhqluyJlVcEFgWIPscc6DZjG3kAAKrBo05CYfIjfVg3TyWsQCyQw-KAMwQTTCJoMy64oqt6rCQdi38gSf2YgABVYL1LvZC-KoqGsk8eT9hdSFCw3bT8N0ZEUREYRpEyPXsXERwyRAFh27IE-UwGUkEiMemQTxJB2KAUAqQAJVcAZV2NAADAcJ5SZ0cipKCK2MHwEC9AgoQEAwgbEaRsexMHuhiY9QTzTL5X-FgNoeCIQy9icSJJvtUuoh06vK49WWf6CO_t7EyeY_l-LV-flZReSRKmx7pPJ2JpuIHm7m7wOkdDyuY7FjnrR-x79iROIDzgLMuOp93yzZGhmY3HfGd-w-5FRz1Y_Y9zy0v1JwB-uw_63H5sf78I320_dVjqTFniBR6Dfy1CyRAmEUE9-w-fYvrMD8J-PLTMkBRzFp1vsOZeMWcLu7KfhPlv_oRhCG5mzsP-78sr72CmLGLmImIZ7Efu_LK20szJbnWq7Efu_LLNF7Y2fh-aReOxFj2Q5AXwfm8suxJoZ_wbX3M9iAmki82Ir0hWqQ3jwgUBup-jLL1NgRuQNbQTZiTpDLRwQWdqgBYwMmlwo7DMgGfDJGRWsHvIY9kjADBZD2vPx7W0Jiw8RiJsYn2H1RqYAJ8xbvBgbNiVJBkaHzYhHkEwlIiBBaMwUUWMkti4UEhqd6QLX3mAmaHNSk5ZYdo3GRII-G4hiTxQhX1NLriexF5xt80h9OSsRNw-Aia440pv9o9ts29dAja4QapqaBBkMQFB6WVMSdIhlwtAzCdM6EVwREzrzEyjZcE1BRE73QexQdTiGAPZcabE-FSc2Qlm2xMl_ghZKHwO79JtArqb3F3E8W7FC1Rbu6jKFv0CYPW8wqmS0LlhqU6sR7u7sy8KuLo3a5Otg-ZaVkKjQWvt4PlXLMmcROnRxtHDFJyQsFa-UkNTjq90fhlhOhAk5aRywLHAu3Yi64_DPT1r1fAnTReVKQqSEoAukUDaV6Ekzlgzo-jLKagoEGQF0aDhW3uSSf8A4A_hsfeNPGdPvmkfwK4gJ4MGggwZcandlbMxXYTHwCUBY4RgCUb0_DiNDMfmIi4xtEZqKG7ybrjB_kJwc8rmyfcdOrFVoGROdtTxyF0i_wCAxF4CCAoEZ1NtVNJWKIhHr-yTTakGwqwZhzE0048DCq7VcwyA6jC9VhcnQQVTAYSLDCf2pS8LOFn2vf4vQYZEJ_CJpQH0SJLIOi-5EJue_wBejnuBkSsONAYQoz8ohOVzQJABlwiGROAhnL6EOwthFtkCqRLfRFkHy5g-Qyb1poDe3e7lHSyYLLNw9kdKrw1cKB_Jr9K9wP6frR--RhgapfINGqKeeq5KJsL9yP8AIhteafWRxF_ngYP0ezTHkK9jRQwFSy0Ci2pUtbDrX1ADYWSiJlSzOtVqUkOhDc0kz6IzSWyf0s52bCrq741tDgCZoiEN9VIA_j3xqnkI_Kju03E9I8liMfQLJj4BBMezn5_YlWZKq8oPzS2xt9bM4QKs2iVm8dh0-gAEh7KJAxkl9C3dwCvPqAOC8pHYApEHATJkNOhxxfMgyNPMayDQolqW-qVhq5iIQDqZ-0pLQ7oIbn9TcFXEwJInTL5ljaCFIxKIycn9RzqGAFAALDb6jbBLlACCsgBSNMgohsQXYkrIlqmIIJtfnuwgB0p_ZagZaznxBKWPwLYj5uYn-Xx2JsOVzeJjPiBOCNo8DsyQEiK0NOD29kD4EJ8HCCmAGbNnLoHeFnYmkd5QlEJfUpXVabZoR7AAGwBrAiZB_wBqg74KFRRMisnHiwZdfhJ8UqQF2kY4U_gYXsS9RlKKioeSWbSc_XdJAUyjMENqjVhAsSEqbmhxhImfgRXZwjct1TfojeyCNvuYCIJcf1EYqeU0s8QoMATHkO1HXghkk-CuyAlTYNjkaY1YDemWYXkSbSand4P0vzI_4Fb47EIGHIzKyiktywTA2HxeFScA5YE76qghiwgUKKxbzE0xWehQpR18cR4Cr169evXrxldydqe1g9K6ARkFIou0uLu6v0v5GCgk1BFsmR6MVGbvWXXwoglU8CvXr169evXPMgLhv4xnoxyIjzw6tCBpIIXwVsDJxMihOSoJNamw0Mj3C0_yzTxGgagyJCJw9hTGwyWSZqLQI3FyeApLbXM1j8MyU8Lv379-_fv37zCwECYPKKPQT6S37NAY4MFPBvDvfv379-_fv37roUN0yKqmPDXhuX4LKpIucqIbsKY2Z93Fz5fmPL1s7mHYffEj5h27C34E2fbvdodY8vg-b91MblZ4Q57C3rBKSAKytBJLifCHgrXRXiApL4-4AgQIECBAgQIECBAgQIECBAgQIECBq1KR8nYBx-y8SOp_Rm6fu7CoPmajOyddmhEEZGxLEdx8GdyqYTBgJhyZm1ov8gyxguvTQQFcSUaUJQLQu37Y88888888888888888888-OgrDByEJA0KwC6kF5wLEzEHEwIIoB_wCIvK4QQIjHhy_DP5vL0bbZew2ZgichBd0WeR8LAH4LmZIsAJIoXqaxQPFdbWAlC9OXBNyEj8j9qgiJI0jYjs64IF6rV8gZ3nQXChzPOyzUlNvh3BCXMzrvEcTMzNR2F-ZishI9hOg9_Dnhhggp9gtoPynRykn5hU-7nyFb-2MjHyfLt3_wAxqXgX2T6EVxEKk-GRVgpP-wY6nYb_AIwP6r4bBxwpZLITBxpZkLEHR_ST8mN_tSR5z3_pjxAN_SSHLn7Ljpx2GxoXU3H5D_74atQMomgA4QLpPVELWUfZD0PtoNZIDmSIjpt6aBuYygz1V_hdmIh14Un4HX7PMf8AuXYZuOhU07YBzrmzUmul5CDi5o8ITPW778EnTzOoxFpq0qCqiFGGYYDzBt3YAVl_tIqaE7g-_C9dEo2ItGEVaOTNDQOI9SED0JBJgLHhSgSDrRCVUKUIPYi45ZLKb4zD6ht4bnx2bfBRk3JJdpSFDxmz_KskUV8NcYgIhmFECjC2h0WvQUScHuG0mwAmhhCBaIXZ0wJQTKGrtawvJEeiYJAKKj6Tt7EbXH_YEdrDkRZSe4lMTRx8KVm1RAk5vCUIwBrm5IA5Qd2g1OWv6uw9P-3JnDtsN0B4fOuIAgEg0EMAUOuCjefU7EEGg76ESo_KnN9zxn1uqgk3whVNmA06C8AVfpLKLniDqsFQSwGyUCmgNv5QRGxpHCddFRlEiykhkYLdbQ46I58p83gh3_lRuHsbmuVE2CZAKRCrllM8AhcElx0XFFE6TZ1kzL4GQgl5ulAr7aVMKowlRKb3cxmKdiKqEEUBMiMAUIIuggAafUHvizR4e9YqCFR1jSIhGQP4ryuhmtCCafcCJkxLW7tP2x9MBWC1oDK6CbtUAFFqQVdKh-QJDqMAAAABB9aCI2NI4TrpPGDsckejHjV0wlZTOXKOpSKpqbxHMdJxQa4qaQ0Xwog4XwtGrBLIci9Z0Q612LqxvEGa4YdTUToeye3LDc5MYfDEYqwMA4qYetYhUmWyZeF3PdEmhL0wIJGdlvsFqfQlntaOOARXhURcgUpSs-aSY0iEsXl5AJOJ9hpWhdYo7vFz0kTRTlUX6FXSaiSrK-Ck2cORkRwfZYtjsZ0-gr7RPVEc8z4kZ0tKL6UKIdP8-M14UpIoME0oiOIR7AzKKLmUcgGpzR7RiPctBSa1DUhiexCSggeBsAUAKEAFqrQBaus2matIpJy8ToM1-iufwTGA5NpcuxBXAQCPug0pq3SOkNA-FrAhhEoBRwAlX2NToyWdmH-K9jJo6AfyxC958U1mCTlG5vhqXVjLhFABIjg0gZ7ERqYH8lcwWoD0_uP96skW4w40CYAgAJEKRLEpPqJkhQHqzh4gsC1EXbTxkJidMa0cTkZd8NINp1l1TU5sIJhkl6M8BlehZbdaCICeJyN1WSUWp5I5laGXsdMckPQh-C81d-K7n5vNy0sR5raeuBkoUCwjoGmUm3TXQPwl8Gt81BpQrsGxQUQgkp7C3QWXIJUQiogFaCgtJAwRMMEiwRoMqNkwyz1EgOC1TCqwqKioRG2adKSfcSDmhOGJSIlGpS0mYVJm6jHvHTocD3Gpo8vEy1Z6ZcBjCyIJBDp1CqqcN2hbQyyts-Lb8INxujrbIRU7SPY27qMcsR8hHGeXx5UnXhsue22823qUedRXZnWL6hE6O2MacwhBFJTJISA1PPQgPa5g7ghhk3pPm8VZ4HMA5gANsVVyCS-ULAor7C2NhvlHapRN2x2ORMKxbL5kcswynk0UsifSORz8IOx0uEQDZ7Kkudlo-Rm4EF0UJ5LCLPHJCD392Xsdjp9ALkwwC9Zb38k5otIqqeUgddKN1DhX5R7H4DCXm90d_Jz5HOwghNEH5PhJ9kJXIKEzLLG5rqlONH8YdI8huBEdzyNCmADLsxqSQN-Pdkb11AuAvsCerdzyKFqlmgQK4bDMKB7JMQJGWWKDNcEBxPQCzhCQdIgAURk8gnhM1wQZMQu_guWqJEKCoZUbVbVteye8esZSxlnD12P34hNKNMtYM7mCqdo4Zz6klCVCqrK29lLQzeb6brK6rmPv3kWoNdtziutejsqvGJN7233aDss_f8O7Le17_wCaevbT4qLZ-otnWUe0dlaUpDmN-_4MRf34ChD1gu_gHx2V3IJ5HyCYCiUmMj75y7HR5RjrWfjsrIJInNSj3hw8rt9_SBzveFjpn7GXZWjMM-yD9nNTg-_iUtHAs-UXwvZ7KTlI61zPrKv11-_ifd3QovdjcN9lAUAqQAJVcAZV2NCEAqOvs7qpXcqqvkD1BM91_wDEq-yUVQiyt1XB5RCpguhwQAENSMT9mJDyFSnjjUPU_wAyUFYDsifhDlNALUQAtXQlKG8bjA0basi8iFz3N4b2YQ7IWaFxgHACUyWASo9kDTnAkCZoS3VrEhCPkiSssfXhbAwmaatRPc8yTKZgRKIROx4v42Ihg8wkeSiPAnoHM20A4RAg0QE9VSXWAg2JD2NugP0kfnydHD5EEQKXuTuZZ7GiWrhQkcy9LA8nk4jylnkbOpo_dQ9jLLnkN_8Ah38eT0FLC5J1OsL2UwvY2Gzu5I4PMma0yRh8nE7qjGPyho3IoKJOOYgfAhT2MQQvOLtelKuJzPlF6GWZoxwlIHuoBvYnprTp9gDcAaQMyFsG40nnqHLrwWENxpiCgRKg8oRAAQJRSI0iUjnSULMhvbbpHCz6YppM9hc1_JQvGtdjObIBvuef-I6I5EnQ8DAeWuMyWUfdjgmTCBaWJlIC8Ukz7wFZaRnKoOyAENxJ7AfmzCzEQJtiDfUgBzBH0CepMi9hm3CUkzXSQGN9yDOYQZgAA6B5jizYDB40wpoXKG6cgfVjh1eo20jrBTjiROJfIcNjwITonrsISiMIsWY3Jxp1u95ZX2QdZfffFkZSM2Z_vx83iyogsD_uJus3VSZH_YpC4mp9dRT8xQC6Q9b7Cb25t2AJuBpmnUvURgQFwIs1yyWjomDhMAQAbAedhLToUR0OiJqf8ywKF3Y8EDwmknucA2RkWoYuBkX1iXOS56iQQ4Al1F8aGZKuhHgySwdQ7QWsnehyWhIEk-gM02OdZ6gyA3h2KqbdGVxMHIchFoHGdMU0mfVuezky4mNQSTgbpqR82sNwFgsYWHaLkGjaaOTArJgehbF8xTO4HugrSApS85IipZT-aNYuu3eqUDDDEOz6p_M2TYZAdRVM6-Mk3z-Pcxs6VnsNm4f94jeieGyJW_8AN7zrKuknTcD4E7lWpOM3AOTTwMw4epT1mjB7Eot46ItQnm1kuBoNjKwTOOxP3liEu-WSr6Oi7nthVoEjk7jnUFkllAGaXCch3mNYOwkOsgrYcgp6gwXZvBdkWTU1k6h7CMLnGA6B3BaOiYOEwBABsB6Sbvs5odwezjtpmbaTx2wmc-yOnlPuRNlJOJJ6bnqAnBgdRsArrHHqMZuDkRTcWoX4bQTuQxLEGrJ9LoBEEREbEcibjvqb2UxoLlC9VSNvSEj4wA3Fi6bpRSCBREhEyI2Juelj9SSoLpH7Hc1Y27c2RAoiDqRXUUGplkUnGfTiAUIqMPcBNhloN6lje_IwNcSzmFp6Dh0RhRCDSNj6SN7qmO9ZItk9wgweu12uMA5lp5LA6E5ywgrKWWl9QJ4YoqGQTEDYJkLakEkJHs5hC1gDsfR88CRx_tRBtBnVpFopyKMIndjwaPQQOLA4DYAD1JCJMgJdyK5VlUWSDWRIiTt1gRzHIZheit0ZR5KSsEq4BSAuto-qnoz5kwkXT0OAHOGB15bb9TxLqPD1ksbCgIAdQnFLyG1WpGJBQtQikECiJCJkRsTc9ERSNBDrlTDhKkXtKdWCD6UY5wYbAj1WAE4MgQ3BUsDhggdYE5hfg0h2UAoZ9DNADIZYrXM0m0tumTPZQrgN1tJQopfVrUGWE72N00OUQ3PPJUoyFXoIAHoOcUknRXudFBjp1AAAABAKACgCgMer6-1eUHQrg6CL0Cu9UhMxThqyyAfQRzgI0rhwUhoi0pWmj-gWD4JQAAUFesas4C6iQaVMs6HrB_6kMwnzuSJYoj6ALbPiy_G4IpI65C2YalykCVgiUwFesxWhwNhiAydRTYgT5-JQGtHNdropyR9aAmOgACANIlI0mnRr2XDpm8i7Pbvn34vmN498WIXriig9ahc1QVNDCpAHwnn1Q8ySwvMZQge2PrfiD9j5dqn9w588JKePZSegyWxLo1IUcfKcE8vrf3sjSEjgDPCceeUVBu10e9702h9bmwmb7pw_a5Bv99__2gAMAwEAAgADAAAAEAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAa6eAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAPryAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAACmwAAAAyAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAB9mAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAnAAAAAAAAgAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAVQAAAAAAAAwAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAtgAAAAAAAABWAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAMwAAAAAAAAAANwAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABAAAAAAAAAAAAADAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABIAAAAAAAAAAAAAA2AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAIwAAAAAAAAAAAAAABgAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAANQAAAAAAAAAAAAAAAADAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABeAAAAAAAAAAAAAAAAABiAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAOAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAOAAAAAAAAAAAAAAAAAAABgAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAOAAAAAAAAAAAAAAAAAAAAsAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABgAAAAAAAAAAAAAAAAAAAAIAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABwAAAAAAAAAAAAAAAAAAAAMAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAGAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAHAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAJwAAAAAAAAAAAAAAAAAAAAAgAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAOAAAAAAAAAAAAAAAAAAAAABwAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAIAAAAAAAAAAAAAAAAAAAAABAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAKAAAAAAAAAAAAAAAAAAAAABgAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAOAAAAAAAAAAAAAAAAAAAAAAwAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAIAAAAAAAAAAAAAAAAAAAAABgAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAMAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAMAAAAAAAAAAAAAAAAAAAAAMAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAMAAAAAAAAAAAAAAAAAAAAAOAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAMAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAIAAAAJJJAAAAAAIAIAAAAAEAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAEAAABIBIIAAAAIIBBAAAAAIAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAKAAAAIAABAAABJAIAIAAAAMAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAKAAABAAAAAAAAIAIAIAAAAMAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAGQAABAAAAIAAJAAAABAAAACAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAQAABAAIIIAAAAABAAAAAAKAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAQAABAAABAAAIAAAAJAAAAOAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABQAABAAAAAAAIAAAABAAAAIAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAACAAAIAAABIAAIAAAAJAAAALuAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAwAAAIAAAAAAAAAAAABAAAAACAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABQAAAAAAAAAAAAAAAAAAAAAAIAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABgAAAAAAAAAAAAAAAAAAAAAAKAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAQAAABAAAAAAAAAAAAAAAAAACAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAYAAABBwAAAAAAAAAAoAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAACAAAABgAAAAAAAAABDAAAAAIAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABIAAAAAAAAAAGAAAAACAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABIAAAAAAAAAAMAAAAAEAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAMAAAAAHQAAAAAAAAAOAAAAAQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAANwAAAAIQAAAAAAAAAgAAAAAwAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABAAAAAPzwABIAAAABQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAgAAAABKAAAPeBKAEAAAAA8AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA-AAAAAKwAJaAABP5AAAAAgAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAACAAAAAAYAEAAAAJQAAAAAwAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABAAAAAAFBuAAAB7AAAAAMAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABQAAAAAJEqAAAdIAAAAACAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABOAAAAABBCajsIAAAAAACAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAGAAAAAAAIJIAAAAAAAACAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAOAAAAAAAAAAAAAAAAAACAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAMQAAAAAAAAAAAAAAAAAIAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAwAAAAAAAAAAAAAAAAAwAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABAAAAAAAAAAAAAAAAAAwAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABeAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAACAAAAAAAAAAAAAAAAKAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAKQAAAAAAAAAAAAAAAcAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABAAAAAAAAAAAAAAAGwAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAEAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABgAAAAAAAAAAAAAAIAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABgAAAAAAAAAAAAAAKAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAgAAAAAAAAAAAAAAIAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAQAAAAAAAAAAAAAAIAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAQAAAAAAAAAAAAAAIAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABQAAAAAAAAAAAAAAMAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAwAAAAAAAAAAAAAAEAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAgAAAAAAAAAAAAAAAgAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAB8AAAAAAAAAAAAAAAAgAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAOwAAAAAAAAAAAAAAABsAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAOAAAAAAAAAAAAAAAAAPQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAKAAAAAAAAAAAAAAAAAAOAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAgAAAAAAAAAAAAAAAAAAMAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABAAAAAAAAAAAAAAAAAAAKAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABwAAAAAAAAAAAAAAAAAAIAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAHAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABAAAAAAAAAAAAAAAAAAAAQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAB5gAAAAAAAAAAAAAAAAAABpAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAANmAAAAAAAAAAAAAAAAAAAAAA2wAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAL2AAAAAAAAAAAAAAAAAAAAAAABmyAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA9AAAAAAAAAAAAAAAAAAAAAAAAAAAAcAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAARwAAAAAAAAAAAAAAAAAAAAAAAAAAAAKQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAHUAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAIrAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAJCAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAWAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAGOAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAEwAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAACIAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAANKAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAGOAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAANYAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAYgAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAEYAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABRwAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABRwAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA8wAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA-AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABMQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAB6AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAGAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAgAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAMAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAADAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAALgAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAMAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAB-AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAcAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAALAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAOAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAGAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAANAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAYAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABwAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAIAAAAAAAAAAAAAAAAAAAAAAAAAAAAAGAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAMAAAAAAAAAAAAAAAAAAAAAAAAAAAAAOAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAP_8QALREBAAECBAQGAgMBAQEAAAAAAREhMQBBUWFwcYGRMFBgobHBQPAg0fHhEJD_2gAIAQMBAT8Q_wDvL-j6aDixh-m_Bd-aGAax6r1s93BmDyqOr3T0xF5WIyBWqdOFVwQ5pHY92KkJmKl0EsTXHYPvP3xl5azfR-CueMo230gd_wCQOhFImuYFdmYmUPCZPCswuwLiGSisze4Z2Waa4rD-YMvQnDeI5nuvd4SuJcktfqF8jdQZEil0DIDICgffCMFYBVsFVcRyCbMNjdXIHUxBL3Cz8yb6o2wVsUQnWAK7-K7rUHkDRTqSuzsBwh2YwFjdbBuoYgoXYepyN4ObBFYzuec3RMVaV_AZzSc34id-EGtuosGqaBuuDRJXlT5LuQ5uBR1kI6uq5rK5v4TAZTRvX7pR2RsKcHRCkgBVeRXCsRF5zoOQ3JOxwIOshHVzVzVVzfxEAgIIGojREbiXwpBXRupedGpezmeDcbW8qexTzIZk2xDGObXnaNiBkX_HBMAiVEbjhKVfa3lXS1sLGFcGDK3yPlbATVaGbiAgppcvJv3aaGf5c7C1UtzQmTkNZS4OTrJzNRsHUU4LSKjaKm4KcoYMxJNA6Ykq-q6sBAVg_NZlGTZNbg-zmJiVnvQt7T4UzSzgpESXahvOa9i0EIEACAIA0AoeQSsdZoD3pYbuzuV45EIIj1_XghVYKrbNVwEJE5epsM8xZcy08jVJTQVzYamTUqoll5CK6gyTMddZGETgcCgFAAEqtgLquAiIlaCfMf6lUr5I6piXM-5dTZBBShq6JkHMSo_fAwFQBVYAqq2Auq4CAG0NZi3PWWRRm8nCp0lorcU63Z7KCeBi0EyClDMNWZDmTVaeUQIxKsWuDaqGrRbgVfBj0jPMS-qXr5SGkpNJHuqtlhkUaJebzvwJz6DppV80jr5XSGT3vw9EcCZtDDnJ8Pv5XOS7vkZJ5Pe78CdV17AD38rRvOF1Dew9-BMO190-Vkl_1hPvgT_heA-vLBsx7I4D_wCWon35aIHQuA5EtnufThpwMroL2fvv5a5XVOA4Jlo_uPvy1y2rd28NIrqkyk6yrPDOJ7sOwvDSJ7EvZuGkShdvsj7rwIdDc_Xm-WOE2PcfvgQ45j919eWKN0OdT6ngQoHQeWBc3-ReBEy1ZeP9C2ds_LLfAhdhFeUZ9vLLfAhRREuInMrhQCwE6k-VmeR3sPl4E6sJvMF7j5WZfRvh98CY9_1XytE7I-z_ABJ14Eo5QJzAfh5WIf8AoPpwILIXzZRtXXkoDriXiiXexasAWJYqyqr5Vro6RKiQuU2XfCqAjOU6AR5i4RGERzG_AUCMgwtZewAPTy86QBOZtHNiQ0rq8BV1Q-79Pl6hGj-eAooTY_SvPl7p6l7f3cBZHsPQH5r5eucbsHAV_paB8RfZWt_Yhw1CCX8ZFFFFFFFFFFFFFFFFFFFFESqm2nrGngmYvE5W7oeAyucqnofKfDuUsAVVGQhwsg1cApepKEWYYOj-KYZzwIiEgFAiIoziOZlxJncgCoqBX8Sb_oD9YcBoPmn7PsniOqNRkaHKsiqwXAfilgh5gLgqK0GQgPiUB0e5PdcBrl4gI1f2SQvDVHBKUHL-MkyqIQRaUsl-xYikvh8rnog9jgNVbSR0_T4ih3lWEO7khZBWtMCAQAERkRqIlESo5_igTEN0NgoJSoKUL4SgVYFeRVwiF0XNZfd4DNbSDupPcwIVheQH78Q4holJYkrPtuQT-JOANKgdCI5_kmhcqmFftknVgvhi0Bk6CsAJatZglgXgREtVFer2CUdHiOrY6sTalcI4gGMzUZGo3mc_Cv1W_N7Bu1wokRVizRRIXYlStq4RQCK07uZdhXC0g_fzj1Cev8hcSqCpoqxJpieafhr61IT9qBoU3UFMpawZOhke7dVrwIm1YWNK4X_WXxZkiYroqyyN1-AwVQAdgYVa0TQECJw3OIEhoZJ2LhzQnBlWlVuv8AlauK0TUVbM1rI9yHIWpClVY1QgKf8AkJAgCuGAyZhljQmnVujEuoEKZ5lPBRKAUcgJXCsk6AtOrdZq5RwJRmDJeoyUb7jfFFi0kDzCxCokDCQMT4ZXioStR4PSWELBCIaFZ2CwpUSfyybexLBFBNCoivViYlUqqqqrKrVVaqtVb-A0iKHV3LJFZSMY8U8_AVJgAOawCgTBIFYZ0jMBgfDyzg7hQdxMG5DgWgIiCFxGRNxrgRImgMjQ9jE5Q5-IJsgoWSyU0iWIWJQC0jVQrjNVzn8JFw4EuYCWMyIwkgeENSxQTSsQih3Tq4k-2f4qaMWa8QnqlIjnHckOnAy_P7g31WAanxY-2GMKoo6qcOdNDsYwTMfFKgp_5UKNZOqZqhRGqGrhnpOJUKrGtOciZeBVYKrbNVwGJTGJKIIpgSsAUmKdGC6zq5HiI92CwK2Kr84dS_fx--BkitH3yXlPUeMdZz5VICKAQIiSM4XBEFl0ly4U9gDQvjTBilItXIATAiCIiSIyI1Ecx1_klj1QJCsTzZSigKxgZ2oltJhC6wVVBAYFHDqEmDBtcxLWZ8WqMIY7CPdOB0s3N5NPafwI8to6nVLGSqExdwcIfNhBKJzSi3Sq3YuB3czNsq3Lvir1YMD1SZCMkhTCjWIQkOrA9UaphCSFCkWQErk0YBmk9K31BXH9xVboE3X8CN8DlcqtZzaR-T18mhlZPyif3rwOqu3RVb2Tn5Mn3P1me3A4Q2_NZCnUp1wIAMgEdRJHyWZlgHQP2L14HzFZk_avNe_kg2I7yCveMJWCE6qy-7wPiW09qR1U_qfI6ce6xq_C4IGPy3cqHqnAgEZEESojUTn5GbykZS0Ge4Q5hcEYls183c_t-j5EEiUDzrh15uSS7gkZGbHu-SjUwmeBABEQRKiNRHMb-QSE2xuO5G7y5sFVVZWqtVXN4JpnIJFUSki2PIlLR-erqsJoC9gLmGFVVVVlWqrdXNeCka-xg_Pc01TsX6z4KqG5Ox90_nzDp3lviOCv7XR-ep5D-X3wVMLY-76fnmjdedT9cFZjoTsHumv5554Hc8FU-rQ5_SHv-f73e8_X98FYf-pb88jcyjsF7vBU0-tuqB6hfn51qga_THBS-P8AHDCesTv5BcmFqzVX1RwSTgqAP2gXVoEq4o4pNarsbjQvUBr5CgFQcgSt5ky2ZvBEFACqgBVVsG64hAJzeg1g6GY6gHkRzQ0T7HJGo5NcO66lyfqEmguYi8D4UzQnZZfprspl5I4DcOSTXUslGcE1UqCyWDo71GRrwPlshbu-HejyUVQCTNGhegnJuGEUgRFEbiMI7jfgbnIdAPwHyeaJHuCOtSXVwNnd7boPt5OUgrBOgM9_034GVNsOs34PJ81I9s4Gx5iHdeTgrACtxIfZxeYZ0Ynrc58DB1necP15QjSmAAaFDdFtBDYXgVEMp_fjD3GuIhC3uoqDsM1zwJOdY1N1zVzVXfyhrI1G81mdcOqLoy6rWvUZEk8Bjcb-FHNQOqYhETn2CUDnHViLRD-6JqV9xPlsoiXRFdbXOxsYlHqJDdXdDfCIoiIwiQjojWeABxSsCnoS4ineHzkdy1tliCVlm4TyR3DvOAAAACgBAGgeYlxk8pRyMDomJBWv7AVDmpiRY1qv5A7VhFIES4iJzGvrt2slC6OsulMwnY4gErN3q_Av1zgidgTut13VfNyY0dFHIQOiYbKH_wAgPuDdTDUATBc-QkXaZ9bwiTdYJqMzUI3xBSa9Jdip3aqYACAALBQPOwBADcAjzGjifRvwSjzM9SDCTVT_ANVv0B5-sgUAKrABKrkF1xBe7nyKR1LZxDMNoSaiOQgO7d9ASYSZAJ1su8SdcSKcyKHZObED1cOKVgU9D5xDh2rqNZtZRmYNpGZ1dZUtcwjZ6Fk0B811U-EYlxVKoLu9QRW2DwCuCuzX1TOk5wUOao6pixupPZfcHLPiPJzgq8yq5r6JiiNkxuNx3EcTCi38-hZbs74mlIf2anwLb1K7WSq6OsqimYTscQ6d66jlayHMwcArADsZubd9HTyydOa8pCjmqd8TroD6lV0ktsGgVcCuz8-oIQTdYI5iHYQjfEFJ05dQr79VHAAQABYKB6S2QwBicxajuQ74kkXPbx1rr04l5odR2WnSDt6bBQBRgAVXQCq4h1Hr_QpHUGjiGYbQk1EchAd276WvfEikmtAF7rVgThKhDqPVXuYgZueOfpblRBMbrYN1DfCIhLsDyLo3hzYKhDO581KnSY0PTlTE_wBqnsDtDXE90egN_kSuhhEUREuNEd59JOwwmF0PNU6E7HEOjWnqNO8NRwUCrAA9ruq1c_UBlnLResRyBPnEhTawUuavNgzY9HxZ9SpzlToSshxErm3BeV-eA54gAAAUAIA0AoepJ8E80qLnBuEVVW2I48NivK1bozRCL6KOOZACq_v_AHBEJLeSnTa79xUwKEFAADoep3hqRCR6Pzea4mZq6rOdLy7qcq2OfoimsDD2ahsNnVCuIhIjMdbI2IOtfVchBdo7Ez2y6lEIQdUfk1G4kiVF9DRM1WCybaSvmhC8hgwIAQB-3bt2vq2LsEYrm-5dNbkNcGnAs5DJMx7jIwiehJYdLXzmbse6SwzahQLer7axKX-paldkENuBUckmEzGOcyMInoJoJnzQ3g5xmshgZRwAABAAAWAsHrGA0qlyc0vqaMQYhNNUg3Ev-539AXd1VyC5yO7BdwO0DBq6rVUq5q-s6cU6Qr9_OxLcwPQFL6U1vc1DM5g1PWjWRqN5rM64gCbveprLVUrWIW_n0_k9YQp1DVCuXradCZdVDrOhmPPkoi6HORB1eYJ63jIhPv4E3lPMvPLIjeaAnq1xTM5ICD49bzBKpfb2IlevngoaYFyKHo15x64KXkBzGP3Rfzv_xAAtEQEAAQIEBAYDAAMBAQAAAAABESExAEFRYVBwcYEwQGCRobHB0fAg4fEQkP_aAAgBAgEBPxD_AO8uSLf8CZ4lJGfv9T998b01t9Lr_cOBuYXiHclvuGM0q7NrSpt86m2E5hYQoSXM5dOVUsFrkh1_2TE8IZMn7L7sWK9WPkJ6jiSljSIn-H7y4narfMaZlIp0p_kpaNNa-DnO1aA28pm4Xf3qQfOJcIzSGe8GNnuxMGWkPwny9cSsO3Ye4BOcVZ-EJkgQpJf0pqsrCCAnIDNXXmpcxciDlGAUAJUADNVoG7iTUOlJukhrJMIkLsihuPuQa54UrP7aShsU8UoA1YDFO6HKil2eUKgxyRLoL6AKyMSDOoT5tRQrIs1wRmQSS2UQzNQrNPkIxsiyOPPPiWY5QPNdVVaFOyC7YoxKkAversKmXLho0ZhRoTQMoBkHkihZVlpTEjmAFoFR5PGSiRgN0h-8VBdRd3vDsgJyqqy5iVTQWDIAZB5REwgFEJAlREkbjgIxTFAJUrah1XJycSyCkjdISIb6SksJ3wVvlo0nJmSJUeXDqpZAVESo4mdQXLsTkud1VJDyYu0WWK5BdMgUsOK0dRsHOhZtHPOK83oTMBKS3GjryFBCWcTQqOaIBmAmnJaKqNKOyoq5o5hVLbybQVt9yXOPO9xkBamg61Loa4pQek1XfzOZpVbyUkpU0CbJcDXfirCnES6hdSVXgE0KGpD70fYmGnAw4wYGyfOYyNeSCgKoAKqwAVVWwZuFntVZNRr3S5bCbwPXhfLKtWrSzKQAsLDcoygs2dUZyIqF5GgmAoAAlRoASquGQHIUpszmaHW1sOCBGVgzcfYW-NGUGAvJHMcjWVIMnNIXkWAUAKAABKq0AKq0Crh1EWlIm3c4t67acHOdNJWj0DSLQvWyliZqMjUbzOfIsLIUVVas3IA9M0E4SZ5RgrK9NxhmQDWVyKWJVgKq_bh12a0yDB2B24Sks2HUhRm0BnjCIIiJIjIjURzHXkTEDCdeUKby9k8LqxMk7WyTnWatw8iYUaqbwYdlXXhadGnfGBvIa25E4qaTDT3yPC1SqTq3iZ7rqHImuE_xjd95ms8L62p092nImRGVx1rnzwz_ALr4_PIepsVbSuZ6aPDUrXU9V355D79e5Gr-a25aRol3qM1GtFJpPDQhNEJG4k08h3DNE-34uGhQuG9QuQ7ozfMufPWO8cNoVFE0gEduQ_wfDGls0qYmAiZImbz35EfB8Mcz6c2YNes8iPg-GMTo57vc6kSbx15EEnzCnZZ-j-nhkTo5rqXUiTfkQJLE1DS4-lK1cp4YBRJRL0az2RXXXkRMImvTaZ965c7zlPDAtBYZ2IEvdDqmvIiPRMG2cy7VTlE5ctDmvxmdWNuWYb8tDgEKgR6JDhn7sdUj8nC0DG4Dr-AuRPRUdT8BXO_C1B6P5_xvyJohHxMj3XMXd54XnKq0ZwCdSYe035EiZgdaxSHWpNa6V4Vu1qbP9d-RDw0skEdFQQ9wJUYTEdWSVatJTMBNAAAcKkGYVJALAutgKyUrgEZAGIhNoRnQDtgQCAaiMiaiUeQqrIoTCQ_uknKZy4enGNpWxKooEIzJeQoFbUPs_acPgX_c2d_rPIWCVpSf8-52nh83--Amf4y8haLSxisqTEVWaNXh81X2Ksrvl78hZf8A2d-WGRRol5vO_hgqBVUA1W3u-WGGGGGGGGGGGGGGGGGGGGGTFaQVq2q6vFg_3yv8z7chqewH7o-6Hv4aQF0J1GcTNda-W2mHsp4kLf1BHefpyGpZAR3nd3O8-JJcwl8Ponv5Yx1h9w_nxJq3qXRe4XvPIa3mv9h4m79P1-Hln2z6H8-JQ-GUaB7kk7635DUgSveIfbxJotMdDR9r-Wcjce1Px4aVkIbqg-XB2YnoANcjkMKsleoodxcfMHIyejEm3iQMs1X5dzPNHyku5F6uR3aYWVW7V8NsK-CgLMuXGKoTKciINKYgoUjdULfxEMv7Bp2Nek-GIgK0BX4wP-cT7jD_AMJ-nHutIHun-UQDX2BY7tex38IZYCCZP6U8qVQAUNeSvcXQyFAQOREDpKrmRfeugL4taqNNXJ7W6Q6-BUg7Mdi_VbfFRDqWdhT37sACABoAHx_hIyeop1Yo9xwQjfS_Q03JNY_9Gyg93IN1_bh7qU_o6BQ8JfBDXUAN1QwRQoD5gSmjkOQJqV5EVglskhDURHMRkajOGstSQkWBVCwGUlSXiASQjI_2TZ1MGxfuL9OTn1n_ACGAJmqfe_8A6mx4FSWyzOTZbmSzaygUgKq4WhS013buWhus-EZ2SMrPRLBrEvIszSzVAImyKPXDMlFkv0QlZRaRcfElR1Mho_vLE6OpmtH8Of8AhJhlILnmdzJ4QKaFEasshdOhiYJClLpNFZv9Vr4kqka_QvtJgtU5vIyzNXjqX4K7PFmjDnomiZj_AFcUd6rN3Z9L_f8A4CgVUB1WD5wItgHVzeqyu74MopXIVacmjFZkcllOJDV0A0sG7Vc18QFQKqgGq293BB2B7Mu8TyMickrObAbzdK8eNO-s_LvK6mJJiswioFAVhWAArW3-Y8K1L2S1diuJIGqJm3CXZjriQJbUQ3SyZyGgeNTiRMiZFR0knQqzyOo5AE7nzo7-Qtf6H8qruY-ICPt_XBnjpD7xOXPuv8PvHuhjPwvjPFFCfwkL5wgoS6lXqsr5DNT5Gv7-_fkdC5BIapCvZduDT7qev17u05cjpUk7nnj6SzusPBpwu43hX2fbkdZcdXKYdxnqYJJFA3ERHcR4LJBCy1Z17ToZ35HxIIj365-wduCddeagHy1wZsCWgAPY5Hx8qqHXV0UN-CYwpW9GU-tQ35IAeiTNsCqvRB2HAAIiDRAwjuNHgaV4IksITO2o2Lu8kIIQTBYnHWULsy4FAzeCqNg51ZWBqXklMUKzMgvWwS5YFFOCJkAEQgDURkRqN-AVnEpFGLavVYo34QAAAAgCgBYDIOScy9BbBB9daDeT54Scg7ql-6tRkipgAAAAABABQAKAFjkp_wBxv9y1e0-fOFvPRd3WfbnlyUgt4fyntU-fgR-oM-eWiYILqH-NuSs1mJ1l5HvROUz59y6zAdKn2r35KxWYQ75sO4GY_D56bP7hSfn88la41BbyHy5Pz5-5v_Rb_XOrbkrNLvB0y_K-8XfPy40MNRTrT3dTM5KQOZDtAdvPurUC3R5uSmWJVgKq_bhFWX2PCuQMBkU4AUjL8LfYHJI3zyqA0DNTQJRAFcLNVKSjKMVhnzChmDgANfAlvEF7DVZ7DyRAKAChgAJVWwFVcNmRBYlZzVqi34gS8BgpclzcGYKGaTPBNSEpnRtpgWOBNgHI9YUNWNUQn2JqgM8EjQJR5r5TzHJuqkmJ9Q0e3s9S42CCR5HvWi15L9sY9T4LNxVu1WhN9zEqg3CJAADICRHMRkc-RsAsS_QZuDhiaVqWVRP0EjbkaQA381Fv4368HkpsRrI-X_7TkZ1Gp2P6H3wesMEneInue9b8jZZtaGuWmd570rc4OqsNWgg-5h-J2kiYd0oMkRryMayZCdJ_tWuvCLZpHKVGZbqlFVNKeRUkR3U9Gebkob4mS1LPVCr1HFHnS8sFgKASwAEsFeECiIojIjCJURuI54GLyiNEdDexnuBevIUSxpJBdR3DE-qrDVNQyOyeJMUa8ejKPbhrjSFSZQaT9jdm4jUvdQlnDbvI4AgASIBNRJE3nkA9BrlXVA-cS-qMptxl2DhJAprd5rPcG2ESESoo6qyruvEXJr0yZvUdwxCjM2eolZsDiEFrFGE9D7oXTAISSIIaiKJuPrsmYpJ0pEgHY1YSZsoBd6q7ezjQ7KkNhY2AbcXmiplGm3p75iOPmQ9RU3QbnEuFEydVAJNKJZL63p602SdJ5TMg3lidcWaNUbkDszSphBRRlRVW6rVd3jZxzSsjUCI7jiKMolA2xN2olxiPCW8fYS7qEzT1kAgAVAAF1WgariedGb4DuSOtA6mJcpBXUcpmbMaUoLegN8Q0OiqpDKttUGWEHIIJAL17lCTzjevq1vcYQs7oJ2u4k0t0i6hSJvQNxYYmcyZ0kiAUy3VehYUcdaHQTO-S64iGiBMu6yKrkkL5sF7DCNndJNal9fVOkSPaDl9kcd4CH5NrqIfBioyFM4uHB7AeidTsrBssOwTbEHQq1uq1docRJMdR0IOtRrf1KQsZkSstEgH7DCXJvx3FM-ZCLgcN7zEbuljQsZejpkR1otEQdAQ0cQS_vZ6FR1QKuJdJs1d0k6lzP1BQzJsg6TCjcglR4nnFyco3ATuNVwgooyoqrdVqu76S3SCJbCw2EdMRGcEY6re6B1riNErMgc86Ga9702iMCoAF1SAaq4o6MlUDuh7ktGJcmm6o5OWbMeVg9LiiIojIlx1HXENAIJED2mhIssYJrZ4N9zVgrFsJmoyNRvM5-lrnZqArS47BdsSDqoT9UWLdmqxDhTJP2QKTExIuvpxYGzZ16Jnepc1xcgUlytqd8AFpsCAQQkDIjZEojr6SnkanorUQbUNYxLk04Xcq9tZgwxu0au6WDIsWPUFdct21ZYkLc0TNSmJozQRvZIq2Fli4-j5jFsezJRNJQWxipBySgGup0INsHjNKyG6iquqr6knijBMhNaQMtJEZxEekmL3CyaMu6T0WZSZGBuqFWhmtCrh2BBUah3sOmuxjBymysjdVf16nbJsrA9TJslkUZFxJFdBq7EbNmaqrC8zUZGo3mc_REyi0p71xr3KwVMU8wytL0JKysyKUEgPVSWTUmR1a1zLbrnADjyj3EuDQAlEH0NNpBU3RRy5lg0YwPsGXUbr7BYKAB6tlEtJVLU0CyTkJBsAQnSuWB3BCKF9BwJQKaP2AV2JUjBVVVVVVZVaqrVVu-rwSTAItfZ0ErHK1WBBsdTJhByZqZiBUL6BOCKtd0QrWZA0kUiFAFChVRlVaqqqtV9YiajAt8gzFVTRLSgI8h6QEif7qWa-gHlobkKbyquw1CixIOJXgWErEYJYAqtfWaXvllFqzc2omlAKvQCpMVoZLK5N9yIYx60iiIoiIjCJURuI1HBLCiW0p0RaCFPHk5o6iE_E0FA3xer61iMUWmKrZV4Vbj3l1MtWjA37GBXVPW86pF1LfG5CGh44w3tMy7sU1cLpLLul8vreBChBuncCdHvxyRULVnQ3ZI7L64nRHVQSfk3B89__EACgQAQEBAAIBAwQCAwEBAQAAAAERIQAxQTBRcCBAUGAQYXGBkcGQsf_aAAgBAQABPxD_AO8pcNUJCIUGgUloL1zsVSVK_wCR-rI0mue7nfLQaCvDq1YFglor50jkr20JqinmGqa6B5ryAdjw7kbpACEhVBBqvxUEmsNet2L8oqCLAV2AEgErCMaPcmKPAYOipryM3s6y9pywWJrvXHVqRXCHAKcAtMMWObbW66-pmQc3bLoRmDR-Jt16mnrIgnlQ7UK8wb9YI0ot0vKDHBBOKe4purgGiqUPB7mnSLr3rBQQij6KX9DiCstdaA3BWUI16R4EgKRS-I8-KI2sEKmIJwF5uLADgSPkKBYDxEASMgIknDYBh28SBQk2EtNOgtVFV9RhZ3rf-uFCHD_ES4LvW2yBwGj7BDg6KIhmiN08aJHByjOWSWE1HcGPsAX0t9nzYIDBYhIfD8HFCLEKIyf3kgfccgZ32XGB0Kbr8KKEEHJHbYS_ZIQQQi0LcUD4eg-FgDKXsDFSQKAUq8IgNpDjJhbc-FuMpDSmj31OftAmxMeO0rijBF5DWxXWrqjQSivhxaNLgZNV7ZA0023Who07uNDCX25LRz_QUGekxiIg8rdg_cZQRq5A-GSot-3aCh5QhUQZvPNCQ5DotTyyVgAAIGAdB7H3SWQqSGwW5Ufymd_Fi2qJWAK0Eg-FR7jHTD2YZbkC_lA0oKHZvNMEGH70dd7nNTPJDpTkEsZjPguKj0Sv4UnCmzM4QMNzA8e-DEhoNHwugHb2r9-giJRxHRHsfe8eTlFbegqsiPTL7vbWrggCIKtEj4PAf8xEPK4AUACvI4Kp4KqePAmYf4OaonbQK6Si8AuXE0zikHRCmPg4nwCsrOWGBxJwK8tw0sc2WsWdvfhSHebQax7JEvKCFlCNekWDIASQvgzHWqldEg4k4FBxE9kAUOCjokwX4ejITdFrPOz3yGETEAUEA6Bojo478FhdpqmgUEB-JnMHp4lMaUPSRvP4Kegp5dAKggAqsKvOx6lIZ_5T_a_Eo1UTR_FByEsNQ8QP8xENA5AAIgj8Ei6jqV9pv9kEAgP4ssDzhAjGBQsg0BPgkB1dB0qevPKPen4sbmUmqmOo_nEPgkEjU2yT_feH9Ox_F6Kf6SA89l1eX4JEunkxCpIlgdECR-LmKEkkCI0IktD3HfERRERiPY-R_v4HBUAVWAaq-D3XgijX0DB1AQ_9h_F4u6sHjk4jMZ28_A4OkOUENlRLmp-_YfjB-QKVUIlaqA1Ve3fgcnS-UGmNBiWSukAfGcmnChrzkH4oHwLQn4wbDrqvh5AiPkb8DjQhHG3VexoG0HS_jRHgMQMIUghil6X4HqNEyKCT_ABtY9X8bOETWI7kAHcAi6Dnxn40bgFchYH2mCI2fGnjxImRyRUE7Cgsr8aeHPTursgWmyTdJVXwOIC6LSlEtBxjdFCfiyR1F5hx02Omqjo_A7AYKMIU8j00MUkn72FUpLeo2XYG9cRs3BEMHNI7b2RuCc-D_SfZRTBTkZPinUx8enZVs5sixlBAjNzjX6hGO2BGeLAjIir4xTcm8hJ4U4yZJCu0QVWWCQtLDkCDsbDyARQAmtwgSNl7wZshrAhxkOi96jJKCLoAMLTrMOtB-B9S42OyKjnoKU5P0SB0jvMOYGafwbb1cAcBjLY14YxP4sVH4k4wZzifr289PcO34OqSjAiuI8iKQG1DP2PMX5VFEz-mNC4uWEVYoweF14J1_wBKjUuAk5eNZwHFYRIM7YSDcYjYqAGnIGlPSO090QTrYNyjVeaaAeJqRjn6NYKzWZgZQBStLfABJm2yH22XcieScXt6UDv0TwgMkDKgQi9MgpLnKA4BNwrQfFfGJPgf3bF7vcG__tw16AcCGd4FsBuUE6Awuwie8sSrVgxyBZ5188jjsqefbeNIkr5WY6wL7siOuf5n5ImIEenBWh5o6R76NB7JfCGi6i3zy3gR32f4RtYx1S_eVRU7fIAhtHT-RtPTNeeh3fgbOvEIHnA6mqxn8GC8FsFYKGKQD8J4oitPzyr4oK-opX1pxgoWQwkTnoFxI5NH8YJsLLQowuK8oRAgyU246xeLf54nVQEB0emFJMbvPoTZ-0WP0xvvovrXceYAo-FznLE0dExCDpsY4rJDANt9AIqzzyD22I01c5yaO-gQp_kjbhjFtOAu8DpNzBCocJkMfCC__rIDlI6B7_3zdRHtum-cd89_XseNCE0pFMQBzZE1qWwLhMAiP0TTiYIGP8o2EHc-qInFAmCmYVY82Lg_7k0QaZ0trYdW8g6XH_UCTqaE6D1poKDyGtMwlaHR0D6YG2rqoUVDfi55lwxAG0DVjP5cF703ffC12ygLRhbEAY66cvRSsBl1JoQqlapoVivQvwSeIZEelgAVUG3a0_VCDhLV69knOPDApr5I3UgCQQfUKPSDIFdLd6s07sDUWfEwA5Q7SGMsfYyWxsi6IiVdLNCREvBKR6aThSGQFKhn02uGBWVMQQjk6_jI27XwjXAPqwzChQrCULrRCpjQpi3cJ3-M06ITPQwJLo1cw8mYGRTJDC73K8Z3B5yAAhJL6NewDJZgm4iL3ETafBFnbQUUa3uCDURCD61imlbSbCoYYiix9f8AaoN_egDMyOG0AkqmoQgo5aJ9RdSFURbCr4ZhEAOFqJFEmVWmrF4Agehe46LGKiGYfpQ2WZhLbbeuKMElpJ8Ei1D61tw1lIha9Pq_yhXYDOBJrwYqxSC84qqArigfWqYTzrD1VL5EuWukk1N0IWmR-p4ktjIZe83Mj3gG-05QUYd__wBHewowMoaUTvAI4X1Hm1ymZQhIz0b2J4wf2ZGnn2FCLT4Hu6d2EVd8ECjPDGsxngpETBA_W3caByk-gLER-eSMC7JW2Ker0HSIcOHDhw4YP3LfaTlZEJvAK6iCVRjLCkBA-phsXg4g3EtJhwWGT3plP-ii1nDhw4cOHDhvOIjsww8U-uTbOOoPATeu2oegPOZAOkgJO3Vh4n6wOAQbCLONzxCv3PUErsQEez4FRJyODorSgFwH6IZRncQ2p1ORXoo0aNGjRo0aONOMU7CF0Pqz9_UwFpkdpNXZvSRo0aNGjRo0aMbDrbKyV4GS56Q2czLwr8qsYV8CdHRQpYdiHbK4TVPxxGZwAOIe4A-BcpOjLRRRHtp6GmlPx_X9s4hM9wov9iJ8CWzV3AGqUJEsIxPRWyZ9SrgJl9yokQIECBAgQIECBAgQIECBAgQIECBAhdWjfOsN_IpvqFZsAXQqi6UVGLRW_Ai5Qm0s-hErYRvk74CYogAKAoiNEURp6JxFRw4vAJWzUSuz8dmVm_Cp21hsEviQ1IaAr9t555555555555555555554-9oXU6FYXSsBygoBE7xrXAGFB4LcawAMUiF9LX3qYhrHYeywA6-Bqh6KKEGguiBWINPS_wBzJGhWko8xDWMz4gi9eWYCicAaNehR32An9P2oIgIAAiDREURojvOzKe1aM6QqtAfPIglusW4sv-mRoJ37YCB6pUBA0VHwMAlQa1NUYjcNLVr0mMlzRZiaGibo4wXIrWiVbbFYASH2pK9giVHK1lUYowGNDDEQjsqwmD08CIYoIoVTzaNFPB8DdQXsdfHToqN8hN9MKidmhui8yPXBa27appB0GQKK6LftpMtqTywbp2s2nivpkV86EKAEqsEZEAAh8CgKgqyj3oNoL00oB9JJAAFPakMzweWQgEY_3vCEoNLwRBERKI0R0R8j7_agUEYYoS6UBRRhFIpd2cCA9sJlWLr6R16GbyyIY7UPdO-KVXckUcgG9QD-j4GAOmVRtwUiqBZiO8d69rhFAU24ghQQ9EYwk43JFDpQRce6mmiRVQvib-UZBl6XQtBa-KfaXRUEgecR8kFDTvgIZSAByS4ZajDh9yfPkoIwCEFC-kXoPVe1rsQZfgh1-79wl1Q1JDAgX0kwILXdXUDoEw4Apnscoi_vIEMTHvfSX_kS8HmwAIBUeEPllYQSwAuoRMrTA7oRKXc2uDzW4BDkGkESH6mqmsFX8-f1tF4s8pH2fwCUdekPZXhV5GFRyUnGPrDvQhhOpRfgibWKfhlYC9FgojY-kXgkZxfiyoagFIT64M7lcYlgW0zFyl_71A-gYwUVsHQIQm67iHwwxnYTCYEKpwdv9BkT3nm8IA_gAACAKCIGiIojid8NwQo4z1IHBx3ZlKnAnKf5Po0Q-wlOuJSuJiLge7SIE3FjgtAcaM5LjTgEmFL6PUdLAj_QLn4WKC5xpE89sxBRKxHwSDTFBDBKZIThIRcZicwICaOGix6eQgrjkUZtI-cjDUpQYIZKI4i9OgQa68ZhGyfT0ABQAKhgAVVWAavI19jw9QKbe40jDRS1iQ-ScAAfWAABAFBEDREURxO-EGTIbbfIIB-Kfbf4BUoAf7WAKgmgXidpkKL36hRxEIrmXxpYPX9Ld82QTHo2KKdlQPwWtcSe1dIhYwHmqTjUQJqpI0hD0ptFHPj0prlBAS9AdE4QqDjMdHgAVgkDKGqqR0rST-W_B_uLkMiTPSLVGVWJcB6rfw70DhdY-m5Ek5aOA23pishguIkUpA-HoBOsSv0k5ggD3k5SyAAzJfBaoqgRGCmFh7lUlfUKjUmQh8h5zBqWyuZRbuAS8cA8I-mBVgArmJX8di0T0EfCR8xulIBb9EBTMn5ICj0A_gAPq8AFAAFWc2zedUARDiGnraAxPYW4SfIU6bMNNjLgWMLXFuYHR_S64cC56YN_UVLewKvscywRqqX7PEAAAAAD4MRqSSyR95M2toKA-of9QV-EtSjlBJ0j3lsG1fyTYkecv6fQ7yoX0i71ReRSPPTQ2ID7ohyVwkoEUb9V8A3MU23f1xfOqH7NwnfOXFZKVQo5QESQRk-qEKhYsRN0_DhZ8N7WJ2X6ijqySdxSLTtSAkRAT4MFERRGidj7j78gocKJhCLhO_0Cg9QYREFz_I5R3xKZ0YoGyOVKvJKbvGSh4hHy9ABYvcAPkR9kTg8TFTglSmdWDwQ8oWKMWWFRgT4dOZGw-StwbzN4UxbKoUtjnLHc5YHdpUnETCLBWWEQpiwqYD2orIJFea5kx_M6qnBIpYUHfsFoTqJDUEtZEsvU9gBQlAlFqsJ0X4OjJHGrRXK0GGBgFPsHuZSradK3e7bXPGgGedRZWBBcDF4Ko1jEaGSf4qwPdNHS5NE05Y57waPYqGOivFtEhAQWdGPIjcMfYaF0OpjS7wf6D-DhYQ2oCOVCz7cUYPwuQZ0VsH6CvdtHR8HVjL0Da1yLcIHF40wBa8R5VHkfwpSOARroFtSqsGAfB4p_uUmNnbtKrdifhERlnFkpCCaR0YuPfFJvK2r50rur38H4Hu2wIHdsM8gEn4SY8LwACkag_ZIiD8IJoL8p7kLcdByBRk9tEI2hplEE7_BywM3UVlmsGYWPhAdIipJcqlINZwW_A6AjVTYSXvo5-Eps-SLxVWTxohQnHF4-Zqx4EZER_AOsZKnNQPZ10hJ-UBfMRKSuUFCqqvwmhyvTbnCd8ZMfvxBIZI6IQOONJXiX3QlG1RPKUVX4UQ5AA8AwwnT00I5v32eR8nL0RiHPIBj8Ks2boIeqF_woBIC_fuIrYEEQTsEdmAgqn4zXioA3LUNpfZEIxavwpo_EKHZ6U0FwoqP3xYEduJn7pfPBO78KpHBIEIM6hYAAYPvyrMNod1HbEjgM6vwrXxIdHlBCgwRCFKffI4IZPkAJ5iJ4h1-FarDXypRD0NwSjbD76BLoK4I0jxjQNPwqY395O2fetTLFAX33XAZ0ME9gL2IZH4Tegp5dAKggAqsKvBuGyEVqFt3VUgX75BESjiOiPY-94-kCBEBh7pJQoFCvwjs5zGxXIVEMxRfpPCEGCuiR-BqAylbRbFdFPcqC_CBlUvkxxEnIACvMA3exNHREta_BaUwGZAwglOC61PE5wwGDtpSIwfhBlMAfqcZKAk8pZfwel-jAqEnbrKfpw1cVYcDBjAC4T4PFmSWn2Swfsni_hevKtBKsQpl5X0LH65JyF4hIBH4NI0bD_wBJAj4dR6_DjIkiEKwL5-gUofBlAquTPoumWIAog_hgNALGocF7UiNsI-DUEQpHcD3yFQ7q9dvw04vMaiENKSdoUD8GLJhthLwdELgA1-H_APZR6GsTzge9HjyqmQp66E9QiC_Bcyy3VIMKnSIPBSfw83CZUQGbmPgo6BFpNKl3pTCIpLq86oYbwkaEuHU0DxdojTlUYADASH4cB_wCKPK5AQKIjx8JlnGollq--Q4IpBQgRERiI6I4jo9_ApnvNI-klt8F9-WQLoCnS1wGhjXjBvUwVw48dM0NrfxlRIYMCENjGRieLMoJwtPEBUj1SCP3g0RcF0Qez4AraCUQgptB5AKLzI01KHUbzA7KTHJnaS07XeKAQRRXALU9BkcXwAPB-RVtH_EsT_Co0wR3VZn099eHg90azsDuUKKBOvlB4zgYs1KKJ0Zv73lyHh-gtWtYOUIYtmQRXnfoZqGB573yPkhgNi6O3-XjuHoNKXpVXSO8Jede86TEDNaJoYOGZWEKvm6IUM_d7e5vOYdSa7EPCGOJKYJN3oAwREFBUTSCR2AAYH5tK00vkVp6CqEGc7LlzkwWKjNahAugsjrFB00EeSfuQNMUtHFkIFkYC81i_SWKX0oJhQHM819xmoAAXZB_n0AgAQJRHERxExHvzytISb60plkUCQjB8-OTjhBTlCRVFIKECIiMRHRHEdHv9taj0xrIVtSA2k3llw0wTUc0K5tJjD2Wj-gAsEzs_RSLLMOSRxUpLSt4wphsaUG_GQ3KA9O311UKUvAtUN_aYrRIVOquEQZYUDn-QO4zwB5nXfJAjVlK11AtYUsIz9JbaYkORSEWShQIvL-bofPJYwO4aAYq-ir2HIbrwHp_ZA69nVgG3tdLeDxn4RJrTSEN2HHdQsdQAwuLC3lH6agiJRxHRHsfe81bwRSdLhDGgjAkR2EbECSLIBAPUNxmVDMSpENRf2CqPRvoK3Aob7HCg6IMcVT2ih6IIKComkEjsAAwP1LGqCagLrIR0BBB5cJ1cN2i3Tl4IkB_gDXmMxVw0ud_W34qSLipzFh0PLaHQrVGsCAQJgOJSGyjY4DLKgv9WMM54ERCgFAiIo3lPluFmgAp3HUSrSqWwaecutICvHoKeXJAICICIjv6stUNXrBQOcTDiHi7IqFKkwcDkBIBSYq9YGPHJ6kw_W38EHPoxuIb_UDj2ZkDqybKG9DKIJ5juFRJHAIgn6kHCE7_AKmSYaHAC3OSsEQW4UJCELwVE47b5PHAUrBX9fa_OTOCRepeLBEGIskFbofSPZT9PzoDGE6ZygBqcJwbRNJMQvTHn2OCTMgfDTmDDA_ZN5breLSLBMOFVsvZ2jGbgpIP0u1JFZygUBII0AkT3HsLFRivpNkXHI-CEpe4M6gqKKV_Zm7eYx0gAIkCAA00jSGtsM6JKcPQU8uSAQEQERHf0j-mUUu2qO7AQ2HH0KVCxGG39rHCgqkJQo68JCePla2pdStxrQRAy_RU2AcBZhSB9Ab49kKkRoIqGwT6ftkG5zNoCLhRzXnBf23yj4kIafojiu85QO5ABhWipEHgF_wCIPA4AAAAB-34BqAUN3gM3H8J6WSesAjRP0KL80qMjCYQzfccHTpHVCioAOAAAP3EIEzJQqgki5EV2ytAnNqMDEWHI_PvUKk0gSI3LuDDwU90qepEzSg5AP3Kr7P2he0qxJ-gUjtC1p4SJUK1LAv3N0EfxAGrkZQiIvD8RqgEq1fjCKIfnqOqaivvTGKCVVXAAAAAAgBgAYAYB1-6mbAcJdCA2VEdM_OjdAmIFKaNQ4NX7qgiJRxHRHsfe8DHkRalAHs2vuh-biEFouHWoX4CmC899qUjh99J3RVVf3c8a-FT7_gKUkWvzegVnOjBGoZIlBF-8GGMdibyMs8mpNH3v__Z',
      password,
      phone: null,
      length,
      valid: false,
      name: null,
      validPassword: false,
      seen: false,
      popoverShow: false,
      // refInputEl: null,
      getInfo: null,
      download: false,
      newName: null,
    };
  },
  computed: {
    // comparison() {
    //   return ((JSON.stringify(this.getInfo) !== this.source) && (this.valid === true));
    // },
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
  watch: {
    image() {
      this.twin.avatar = this.image;
      useJwt.refreshGetCurrentUser(JSON.stringify(this.twin)).then(() => {

      });
    },

  },
  created() {
    useJwt.getCurrenUser().then((response) => {
      if (response.data.status) {
        this.$store.dispatch('user/getUserData', response.data).then(() => {
          // eslint-disable-next-line vue/no-mutating-props
          this.download = true;
          this.getInfo = response.data;
          this.image = this.getInfo.account.avatar;
          this.twin = this.getInfo.account;
          this.sourceName = JSON.stringify(this.getInfo.account.name);
          this.sourcePhone = JSON.stringify(this.getInfo.account.phone);
          this.source = JSON.stringify(response.data);
          this.name = this.getInfo.account.name;
          this.phone = this.getInfo.account.phone;
        });
      }
    });
  },
  methods: {
    onSubmit() {
      this.$refs.userData.validate().then((success) => {
        if ((success === true) && (this.changeNameFlag === false)) {
          this.saveChange = true;
          useJwt.refreshGetCurrentUser(JSON.stringify(this.twin)).then((response) => {
            this.twin = response;
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
    resetPhoto() {
      this.image = this.defaultPhoto;
      this.twin.avatar = this.defaultPhoto;
      useJwt.refreshGetCurrentUser(JSON.stringify(this.twin)).then(() => {
      });
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

    changeName() {
      // eslint-disable-next-line quotes
      if (this.name !== this.sourceName.replace(/("|')/g, "")) {
        this.comparison = true;
        this.newName = this.name;
        // if (this.name.length > 20) {
        //   this.newName = this.truncate(this.name, 20);
        // }
        this.changeNameFlag = true;
        this.twin.name = this.newName;
        this.$bvModal
          .msgBoxConfirm('Изменения ещё не сохранены. Сохранить?', {
            title: 'Уведомление',
            size: 'sm',
            okVariant: 'primary',
            okTitle: 'Да',
            cancelTitle: 'Нет',
            cancelVariant: 'outline-secondary',
            hideHeaderClose: false,
            centered: true,
          }).then((value) => {
            if (value === true) {
              useJwt.refreshGetCurrentUser(JSON.stringify(this.twin)).then(() => {
              });
              this.$toast({
                component: ToastificationContent,
                props: {
                  title: 'Данные сохранены',
                  icon: 'EditIcon',
                  variant: 'success',
                },
              });
            } else {
              this.$toast({
                component: ToastificationContent,
                props: {
                  title: 'Изменения не сохранены',
                  icon: 'alertCircle',
                  variant: 'warning',
                },
              });
            }
          });
      }
    },
    changePhone() {
      if (this.phone !== this.sourcePhone.replace(/("|')/g, '')) {
        this.comparison = true;
        this.changePhoneFlag = true;
        this.twin.phone = this.phone;
        this.$bvModal
          .msgBoxConfirm('Изменения ещё не сохранены. Сохранить?', {
            title: 'Уведомление',
            size: 'sm',
            okVariant: 'primary',
            okTitle: 'Да',
            cancelTitle: 'Нет',
            cancelVariant: 'outline-secondary',
            hideHeaderClose: false,
            centered: true,
          }).then((value) => {
            // console.log('changeBName', value);
            if (value === true) {
              useJwt.refreshGetCurrentUser(JSON.stringify(this.twin)).then(() => {
              });
              this.$toast({
                component: ToastificationContent,
                props: {
                  title: 'Данные сохранены',
                  icon: 'EditIcon',
                  variant: 'success',
                },
              });
            } else {
              this.$toast({
                component: ToastificationContent,
                props: {
                  title: 'Изменения не сохранены',
                  icon: 'alertCircle',
                  variant: 'warning',
                },
              });
            }
          });
      }
      // else {
      //   this.comparison = false;
      //   this.changePhoneFlag = false;
      // }
    },
    undoChange() {
      useJwt.getCurrenUser().then((response) => {
        if (response.data.status) {
          this.$store.dispatch('user/getUserData', response.data).then(() => {
            // eslint-disable-next-line vue/no-mutating-props
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
            old_password: this.oldPassword,
            email: this.twin.email,
          };
          useJwt.changePassword(JSON.stringify(newPassword)).then((response) => {
            this.empty = response;
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
