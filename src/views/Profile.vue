<template>
  <b-overlay
    :show="showLoading"
    variant="black"
    spinner-variant="primary"
    blur="0.5"
    opacity=".75"
    rounded="sm">
    <div class="d">
      <h3>Настройки профиля</h3>
      <b-col md="12">
        <b-card
          title="Данные организации:">
          <div class="d-flex flex-column">
            <h3>Название: &#8195; {{ userData.company.full_name }}</h3>
            <h3>ИНН: &#8195; {{ userData.company.inn }}</h3>
            <h3>
              Почтовый адрес: &#8195;
              {{ userData.company.legal_address }}
            </h3>
          </div>
        </b-card>
        <b-card
          class="mt-2"
          title="Данные держателя карты:"
          @refresh="refreshInformation('information')">
          <label for="name">
            Ф.И.О.:
          </label>
          <b-form-input
            id="name"
            v-model="name"
            class="mb-1" />
          <label for="contact">
            Контактные сведения:
          </label>
          <b-form-input
            id="contact"
            v-model="email"
            autofocus />
        </b-card>
      </b-col>
    </div>
  </b-overlay>
</template>

<script>
import {
  BCol, BOverlay, BCard, BFormInput,
} from 'bootstrap-vue';
import useJwt from '@/auth/jwt/useJwt';

export default {
  components: {
    BCol,
    BOverlay,
    BCard,
    BFormInput,
  },
  data() {
    return {
      userData: null,
      showLoading: true,
      name: 'Ваня',
      email: 'dfgdfgfdfgd',
    };
  },
  created() {
    useJwt.getCurrenUser().then((response) => {
      if (response.data.status) {
        this.$store.dispatch('user/getUserData', response.data).then(() => {
          this.userData = response.data;
          this.showLoading = false;
        });
      }
    });
  },
};
</script>

<style></style>
