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
    <b-form
      class="mt-2"
      @submit.prevent="onSubmit">
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

        <!-- alert -->
        <!-- <b-col
          cols="12"
          class="mt-75">
          <b-alert
            show
            variant="warning"
            class="mb-50">
            <h4 class="alert-heading">
              Your email is not confirmed. Please check your inbox.
            </h4>
            <div class="alert-body">
              <b-link class="alert-link">
                Resend confirmation
              </b-link>
            </div>
          </b-alert>
        </b-col> -->
        <!--/ alert -->

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
  </b-card>
</template>

<script>
import {
  BFormFile, BButton, BForm, VBTooltip, BFormGroup, BFormInput, BRow, BCol, BCard, BMedia, BMediaAside, BMediaBody, BLink, BImg,
} from 'bootstrap-vue';
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
    };
  },

  computed: {
    comparison() {
      return JSON.stringify(this.getInfo) !== this.source;
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
      this.saveChange = true;
      this.$toast({
        component: ToastificationContent,
        props: {
          title: 'Данные сохранены',
          icon: 'EditIcon',
          variant: 'success',
        },

      });
      // console.log(this.twin.account.email); // Отправить через POST
      console.log(this.comparison);
    },
    undoChange() {
      useJwt.getCurrenUser().then((response) => {
        if (response.data.status) {
          this.$store.dispatch('user/getUserData', response.data).then(() => {
            this.getInfo = response.data;
          });
        }
      });
    },

  },

};
</script>
