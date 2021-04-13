<template>
  <div>
    <b-card
      title="Электронные чеки">
      <div class="col-12">
        <p>Выберете держателя карты:</p>

        <b-overlay
          :show="busy"
          rounded="lg"
          opacity="0.6">
          <template #overlay>
            <div class="d-flex align-items-center">
              <b-spinner
                style="width: 1rem; height: 1rem;"
                type="grow"
                variant="secondary" />
              <b-spinner
                style="width: 1.5rem; height: 1.5rem;"
                type="grow"
                variant="dark" />
              <b-spinner
                style="width: 1rem; height: 1rem;"
                type="grow"
                variant="secondary" />
              <!-- We add an SR only text for screen readers -->
              <span class="sr-only">Данные загружаются</span>
            </div>
          </template>
          <v-select
            v-model="selectedHolder"
            :disabled="busy"
            :options="names"
            class="w-100 mt-1 mb-1"
            @input="onChange()" />
        </b-overlay>

        <p>Выберете карту:</p>
        <b-overlay
          :show="busy"
          rounded="lg"
          opacity="0.6">
          <template #overlay>
            <div class="d-flex align-items-center">
              <b-spinner
                style="width: 1rem; height: 1rem;"
                type="grow"
                variant="secondary" />
              <b-spinner
                type="grow"
                style="width: 1.5rem; height: 1.5rem;"
                variant="dark" />
              <b-spinner
                style="width: 1rem; height: 1rem;"
                type="grow"
                variant="secondary" />
              <!-- We add an SR only text for screen readers -->
              <span class="sr-only">Данные загружаются</span>
            </div>
          </template>
          <v-select
            v-model="selected"
            :disabled="busy"
            multiple
            :options="option"
            class="w-100 mt-1 mb-1"
            @input="onChange()" />
        </b-overlay>
        <p class="mt-1">
          Выберете период:
        </p>
        <flat-pickr
          v-model="rangeDate"
          size="sm"
          class="form-control mb-0"
          :config="config"
          @on-change="selectDate" />
        <b-button
          :disabled="!visible"
          :variant="color"
          class="btn btn-primary mt-1"
          @click="print">
          Печать
        </b-button>

        <p> <!-- v-print="'#check'" --> </p>

        <b-button
          class="btn btn-primary mt-1 ml-3"

          @click="toogle">
          {{ visible ? "Скрыть чеки" : "Показать чеки" }}
        </b-button>
        <b-pagination
          v-if="hidden"
          v-model="currentPage"
          :total-rows="totalRows"
          first-number
          last-number
          prev-class="prev-item"
          next-class="next-item"
          class="mb-0 "
          align="center"
          @change="selectPage">
          <template #prev-text>
            <feather-icon
              icon="ChevronLeftIcon"
              size="18" />
          </template>
          <template #next-text>
            <feather-icon
              icon="ChevronRightIcon"
              size="18" />
          </template>
        </b-pagination>
      </div>
      <!-- </b-card> -->
      <div
        v-if="visible"
        id="check"
        class="flex">
        <template
          v-for="(item,index) in transactions.data">
          <div
            :key="index"
            class="col-5">
            <!-- begin .check -->
            <div
              class="check">
              <div
                class="d-flex flex-column align-items-center"
                style="margin-bottom: 20px;
              ">
                <!-- begin .check__header -->
                <div
                  class="check__organization">
                  {{ item.pos.seller }}
                </div>
                <!-- end .check__header -->

                <div
                  class="d-flex flex-column">
                  <p class="text-center">
                    Адрес места расчётов:
                  </p>
                  <p class="text-center">
                    {{ item.pos.address }}
                  </p>
                </div>
              </div>

              <!-- begin .check__content -->
              <div
                class="check__content"
                style="margin-bottom: 20px;">
                <div
                  class="check__row"
                  style="display: -webkit-box;
                  display: -ms-flexbox;
                  display: flex;
                  -webkit-box-align: center;
                  -ms-flex-align: center;
                  align-items: centerl;
                  -webkit-box-pack: justify;
                  -ms-flex-pack: justify;
                  justify-content: space-between;
                  line-height: 1.4;
  ">
                  <div
                    class="check__label">
                    ИНН:
                  </div>
                  <div
                    class="check__value">
                    2309051942
                  </div>
                </div>

                <div
                  class="d-flex justify-content-between mb-1"
                  style="width: 100%;
                ">
                  <div class="check__label">
                    Тип операции
                  </div>
                  <div class="check__value">
                    {{ item.operation_type }}
                  </div>
                </div>

                <div class="check__column">
                  <div
                    class="d-flex justify-content-between mb-1"
                    style="width: 100%;
                ">
                    <div class="check__label">
                      Бензин <br> автомобильный
                    </div>
                    <div class="check__value">
                      {{ item.service.full_name }}
                    </div>
                  </div>

                  <div
                    class="d-flex justify-content-between mb-1"
                    style="width: 100%;
                ">
                    <div class="check__label">
                      Объем топлива
                    </div>
                    <div class="check__value">
                      {{ item.quantity }}
                    </div>
                  </div>

                  <div
                    class="d-flex justify-content-between mb-1"
                    style="width: 100%;
                ">
                    <div class="check__label">
                      Цена
                    </div>
                    <div class="check__value">
                      определяется договором
                    </div>
                  </div>

                  <div
                    class="d-flex justify-content-between mb-1"
                    style="width: 100%;
                ">
                    <div class="check__label">
                      Сумма
                    </div>
                    <div class="check__value">
                      {{ item.summ }}
                    </div>
                  </div>

                  <div
                    class="d-flex justify-content-between mb-1"
                    style="width: 100%;
                ">
                    <div class="check__label">
                      ТК:
                    </div>
                    <div class="check__value">
                      {{ item.card_number }}
                    </div>
                  </div>

                  <div
                    class="check__row"
                    style="width: 100%;">
                    <div class="check__label">
                      {{ item.date | formatDate }}
                    </div>
                  </div>

                  <div
                    class="check__row"
                    style="width: 100%;">
                    <div class="check__label">
                      RNN
                    </div>
                    <div class="check__value">
                      921303719885
                    </div>
                  </div>

                  <div
                    class="check__row"
                    style="width: 100%;
                                    ">
                    <div class="check__label">
                      Операция подтверждена
                    </div>
                    <div class="check__value">
                      Вводом ПИН
                    </div>
                  </div>

                  <!-- begin .check__row -->
                  <div
                    class="check__row check__row--black"
                    style="width: 100%;
                    -webkit-box-pack: center;
                    -ms-flex-pack: center;
                    justify-content: center;
                    text-transform: uppercase;
                    text-align: center;
                    color: #fff;
                    background-color: #000;
                    -webkit-transition: all 0.25s ease;
                    transition: all 0.25s ease;">
                    ОДОБРЕНО (RC: 0)
                  </div>
                <!-- end .check__row -->
                </div>
              <!-- end .check__content -->
              </div>
            <!-- end .check -->
            </div>
          <!-- end .col-4 -->

          <!-- end .row -->
          </div>
        <!-- </div> -->
        </template>
      </div>
    </b-card>
  </div>
</template>

<script>
import {
  BCard, BButton, BPagination, BOverlay, BSpinner,
} from 'bootstrap-vue';

import print from 'vue-print-nb';
import vSelect from 'vue-select';
import flatPickr from 'vue-flatpickr-component';
import { Russian } from 'flatpickr/dist/l10n/ru';
import ToastificationContent from '@core/components/toastification/ToastificationContent.vue';
import useJwt from '../../auth/jwt/useJwt';

export default {
  components: {
    BCard,
    BButton,
    flatPickr,
    vSelect,
    BPagination,
    BOverlay,
    BSpinner,
  },

  directives: {
    print,
  },

  data() {
    return {
      getInfo: null,
      busy: false,
      value: 'Some value',
      contract: null,
      currentConsumption: null,
      currentConsumptionDynamic: null,
      contractId: null,
      transactions: null,
      option: [],
      selectedHolder: null,
      names: [],
      response: null,
      start: null,
      hidden: false,
      end: null,
      visible: false,
      selected: [],
      cards: null,
      rangeDate: null,
      currentPage: 1,
      totalRows: null,
      config: {
        mode: 'range',
        maxDate: 'today',
        // defaultDate: ['01.04.2021 00:00:00', 'today'],
        locale: Russian,
        dateFormat: 'd.m.Y',
      },

    };
  },
  computed: {
    color() {
      return this.visible ? 'success' : '';
    },
  },

  created() {
    const userData = JSON.parse(localStorage.getItem('userData'));
    if (userData) {
      this.contract = userData;
      this.contractId = this.contract.contract.id;
      this.start = `${this.getFirstDay()} 00:00:00`;
      this.end = `${this.isToday()} 00:00:00`;
      this.rangeDate = [this.start, this.end];
    }
    return this.contract;
  },

  beforeMount() {
    this.getAllCards();
  },

  methods: {
    isToday() {
      const today = new Date();
      return today.toLocaleDateString();
    },

    getFirstDay() {
      const date = new Date();
      const firstDay = new Date(date.getFullYear(), date.getMonth(), 1).toLocaleDateString();
      return firstDay;
    },

    unique(arr) {
      this.arr = Array.from(new Set(arr));
      return this.arr;
    },

    getAllCards() {
      const ID = this.contractId;
      this.busy = true;
      useJwt.getCards(`contract_id=${ID}`).then((response) => {
        if (response.data.status) {
          this.response = response.data;

          this.response.cards.forEach((el) => {
            this.option.push(el.number);
          });
          this.response.holders.forEach((el) => {
            this.names.push(el.holder);
          });
        }

        this.busy = false;
        this.names = this.unique(this.names);
        this.names = this.names.filter((el) => el !== '');
        this.option = this.unique(this.option);
      });
    },

    getAllTransactions() {
      const holder = this.selectedHolder;
      // const date = this.rangeDate;
      // const newDate = Array.from(date).filter((n) => n !== '—');
      // const arr = (newDate.join('').split('  '));
      // // eslint-disable-next-line prefer-template
      // this.start = arr[0] + ' 00:00:00';
      // // eslint-disable-next-line prefer-template
      // this.end = arr[1] + ' 00:00:00';
      const ID = this.contractId;
      const { selected } = this;
      useJwt.getTransactions(`contract_id=${ID}&startDate=${this.start}&endDate=${this.end}&holder=${holder}&card_number=${selected}`).then((response) => {
        if (response.data.status) {
          this.transactions = response.data;
          this.totalRows = this.transactions.tol.Total;
        }
        return this.transactions;
      });
      setTimeout(this.clickPrint, 3000);
    },

    print() {
      this.getAllTransactions();
    },

    clickPrint() {
      this.$htmlToPaper('check');
    },

    selectDate() {
      const holder = this.selectedHolder;
      const date = this.rangeDate;
      const { selected } = this;
      const newDate = Array.from(date).filter((n) => n !== '—');
      const arr = (newDate.join('').split('  '));
      // eslint-disable-next-line prefer-template
      this.start = arr[0] + ' 00:00:00';
      // eslint-disable-next-line prefer-template
      this.end = arr[1] + ' 00:00:00';
      const ID = this.contractId;
      useJwt.getTransactions(`contract_id=${ID}&startDate=${this.start}&endDate=${this.end}&card_number=${selected}&holder=${holder}&offset=10&limit=10`).then((response) => {
        if (response.data.status) {
          this.transactions = response.data;
          this.totalRows = this.transactions.tol.Total;
        }

        return this.transactions;
      });
    },

    selectPage(page) {
      const holder = this.selectedHolder;
      const { selected } = this;
      const { start } = this;
      const { end } = this;
      const ID = this.contractId;
      useJwt.getTransactions(`contract_id=${ID}&startDate=${start}&endDate=${end}&card_number=${selected}&holder=${holder}&offset=${10 * page}&limit=10`).then((response) => {
        if (response.data.status) {
          this.transactions = response.data;
        }

        if (this.transactions.data.length < 1) {
          // this.visible = false;
          this.$toast({
            component: ToastificationContent,
            props: {
              title: 'Отсутвуют операции по карте за период',
              icon: 'AlertTriangleIcon',
              variant: 'danger',
            },
          });
        }
        return this.transactions;
      });
    },

    onChange() {
      const { selected } = this;
      const holder = this.selectedHolder;
      // this.hidden = false;
      const { start } = this;
      const { end } = this;
      const ID = this.contractId;
      useJwt.getTransactions(`contract_id=${ID}&startDate=${start}&endDate=${end}&card_number=${selected}&card_holder=${holder}&offset=10&limit=10`).then((response) => {
        if (response.data.status) {
          this.transactions = response.data;
          this.totalRows = this.transactions.tol.Total;

          if (this.transactions.data.length < 1) {
            this.transactions = [];
            // this.visible = false;
            this.$toast({
              component: ToastificationContent,
              props: {
                title: 'Отсутвуют операции по карте за период',
                icon: 'AlertTriangleIcon',
                variant: 'danger',
              },
            });
          }
        }
        return this.transactions;
      });
      // if (this.selected.length < 1) {
      //   this.getAllTransactions();
      //   // this.hidden = true;
      // }
    },

    toogle() {
      this.visible = !this.visible;
      this.hidden = !this.hidden;
      // this.selectPage(1);
      // if (this.selected.length < 1) {
      //   this.getAllTransactions();
      // } else this.onChange();
    },
  },

};
</script>

<style lang="scss" scoped>
@import "@core/scss/vue/libs/vue-select.scss";
@import "@core/scss/vue/libs/vue-flatpicker.scss";
// @import "../../assets/scss/components/Checks";

.flex {
  display: flex !important;
  flex-wrap: wrap !important;
  justify-content: space-evenly !important;
}

.container,
.container-fluid {
  padding-right: 15px;
  padding-left: 15px;
  margin-right: auto;
  width: 100%;
  margin-left: auto;
}
.row,
html {
  display: -webkit-box;
}
.flex-column,
.flex-row {
  -webkit-box-direction: normal !important;
}
.heading-1,
.heading-2,
.heading-3,
body,
h1,
h2,
h3 {
  font-style: normal;
  font-stretch: normal;
  letter-spacing: normal;
}
@font-face {
  font-family: Magnolia-Script;
  font-display: auto;
  src: local("Magnolia"), local("Magnolia Script"), local("Magnolia-Script"),
    url(../fonts/Magnolia.ttf) format("truetype");
  font-weight: 400;
  font-style: normal;
}
@font-face {
  font-family: Gilroy;
  src: url(../fonts/Gilroy-ExtraBold.eot);
  font-display: auto;
  src: local("Gilroy ExtraBold"), local("Gilroy-ExtraBold"),
    url(../fonts/Gilroy-ExtraBold.eot?#iefix) format("embedded-opentype"),
    url(../fonts/Gilroy-ExtraBold.woff) format("woff"),
    url(../fonts/Gilroy-ExtraBold.ttf) format("truetype");
  font-weight: 800;
  font-style: normal;
}
@font-face {
  font-family: Gilroy;
  font-display: auto;
  src: url(../fonts/Gilroy-Heavy.eot);
  src: local("Gilroy Heavy"), local("Gilroy-Heavy"),
    url(../fonts/Gilroy-Heavy.eot?#iefix) format("embedded-opentype"),
    url(../fonts/Gilroy-Heavy.woff) format("woff"),
    url(../fonts/Gilroy-Heavy.ttf) format("truetype");
  font-weight: 900;
  font-style: normal;
}
@font-face {
  font-family: Gilroy;
  font-display: auto;
  src: url(../fonts/Gilroy-LightItalic.eot);
  src: local("Gilroy Light Italic"), local("Gilroy-LightItalic"),
    url(../fonts/Gilroy-LightItalic.eot?#iefix) format("embedded-opentype"),
    url(../fonts/Gilroy-LightItalic.woff) format("woff"),
    url(../fonts/Gilroy-LightItalic.ttf) format("truetype");
  font-weight: 300;
  font-style: italic;
}
@font-face {
  font-family: Gilroy;
  font-display: auto;
  src: url(../fonts/Gilroy-ThinItalic.eot);
  src: local("Gilroy Thin Italic"), local("Gilroy-ThinItalic"),
    url(../fonts/Gilroy-ThinItalic.eot?#iefix) format("embedded-opentype"),
    url(../fonts/Gilroy-ThinItalic.woff) format("woff"),
    url(../fonts/Gilroy-ThinItalic.ttf) format("truetype");
  font-weight: 100;
  font-style: italic;
}
@font-face {
  font-family: Gilroy;
  font-display: auto;
  src: url(../fonts/Gilroy-BlackItalic.eot);
  src: local("Gilroy Black Italic"), local("Gilroy-BlackItalic"),
    url(../fonts/Gilroy-BlackItalic.eot?#iefix) format("embedded-opentype"),
    url(../fonts/Gilroy-BlackItalic.woff) format("woff"),
    url(../fonts/Gilroy-BlackItalic.ttf) format("truetype");
  font-weight: 900;
  font-style: italic;
}
@font-face {
  font-family: Gilroy;
  font-display: auto;
  src: url(../fonts/Gilroy-BoldItalic.eot);
  src: local("Gilroy Bold Italic"), local("Gilroy-BoldItalic"),
    url(../fonts/Gilroy-BoldItalic.eot?#iefix) format("embedded-opentype"),
    url(../fonts/Gilroy-BoldItalic.woff) format("woff"),
    url(../fonts/Gilroy-BoldItalic.ttf) format("truetype");
  font-weight: 700;
  font-style: italic;
}
@font-face {
  font-family: Gilroy;
  font-display: auto;
  src: url(../fonts/Gilroy-SemiBold.eot);
  src: local("Gilroy SemiBold"), local("Gilroy-SemiBold"),
    url(../fonts/Gilroy-SemiBold.eot?#iefix) format("embedded-opentype"),
    url(../fonts/Gilroy-SemiBold.woff) format("woff"),
    url(../fonts/Gilroy-SemiBold.ttf) format("truetype");
  font-weight: 600;
  font-style: normal;
}
@font-face {
  font-family: Gilroy;
  font-display: auto;
  src: url(../fonts/Gilroy-UltraLightItalic.eot);
  src: local("Gilroy UltraLight Italic"), local("Gilroy-UltraLightItalic"),
    url(../fonts/Gilroy-UltraLightItalic.eot?#iefix) format("embedded-opentype"),
    url(../fonts/Gilroy-UltraLightItalic.woff) format("woff"),
    url(../fonts/Gilroy-UltraLightItalic.ttf) format("truetype");
  font-weight: 200;
  font-style: italic;
}
@font-face {
  font-family: Gilroy;
  font-display: auto;
  src: url(../fonts/Gilroy-SemiBoldItalic.eot);
  src: local("Gilroy SemiBold Italic"), local("Gilroy-SemiBoldItalic"),
    url(../fonts/Gilroy-SemiBoldItalic.eot?#iefix) format("embedded-opentype"),
    url(../fonts/Gilroy-SemiBoldItalic.woff) format("woff"),
    url(../fonts/Gilroy-SemiBoldItalic.ttf) format("truetype");
  font-weight: 600;
  font-style: italic;
}
@font-face {
  font-family: Gilroy;
  font-display: auto;
  src: url(../fonts/Gilroy-Light.eot);
  src: local("Gilroy Light"), local("Gilroy-Light"),
    url(../fonts/Gilroy-Light.eot?#iefix) format("embedded-opentype"),
    url(../fonts/Gilroy-Light.woff) format("woff"),
    url(../fonts/Gilroy-Light.ttf) format("truetype");
  font-weight: 300;
  font-style: normal;
}
@font-face {
  font-family: Gilroy;
  font-display: auto;
  src: url(../fonts/Gilroy-MediumItalic.eot);
  src: local("Gilroy Medium Italic"), local("Gilroy-MediumItalic"),
    url(../fonts/Gilroy-MediumItalic.eot?#iefix) format("embedded-opentype"),
    url(../fonts/Gilroy-MediumItalic.woff) format("woff"),
    url(../fonts/Gilroy-MediumItalic.ttf) format("truetype");
  font-weight: 500;
  font-style: italic;
}
@font-face {
  font-family: Gilroy;
  font-display: auto;
  src: url(../fonts/Gilroy-ExtraBoldItalic.eot);
  src: local("Gilroy ExtraBold Italic"), local("Gilroy-ExtraBoldItalic"),
    url(../fonts/Gilroy-ExtraBoldItalic.eot?#iefix) format("embedded-opentype"),
    url(../fonts/Gilroy-ExtraBoldItalic.woff) format("woff"),
    url(../fonts/Gilroy-ExtraBoldItalic.ttf) format("truetype");
  font-weight: 800;
  font-style: italic;
}
@font-face {
  font-family: Gilroy;
  font-display: auto;
  src: url(../fonts/Gilroy-Regular.eot);
  src: local("Gilroy Regular"), local("Gilroy-Regular"),
    url(../fonts/Gilroy-Regular.eot?#iefix) format("embedded-opentype"),
    url(../fonts/Gilroy-Regular.woff) format("woff"),
    url(../fonts/Gilroy-Regular.ttf) format("truetype");
  font-weight: 400;
  font-style: normal;
}
@font-face {
  font-family: Gilroy;
  font-display: auto;
  src: url(../fonts/Gilroy-HeavyItalic.eot);
  src: local("Gilroy Heavy Italic"), local("Gilroy-HeavyItalic"),
    url(../fonts/Gilroy-HeavyItalic.eot?#iefix) format("embedded-opentype"),
    url(../fonts/Gilroy-HeavyItalic.woff) format("woff"),
    url(../fonts/Gilroy-HeavyItalic.ttf) format("truetype");
  font-weight: 900;
  font-style: italic;
}
@font-face {
  font-family: Gilroy;
  font-display: auto;
  src: url(../fonts/Gilroy-Medium.eot);
  src: local("Gilroy Medium"), local("Gilroy-Medium"),
    url(../fonts/Gilroy-Medium.eot?#iefix) format("embedded-opentype"),
    url(../fonts/Gilroy-Medium.woff) format("woff"),
    url(../fonts/Gilroy-Medium.ttf) format("truetype");
  font-weight: 500;
  font-style: normal;
}
@font-face {
  font-family: Gilroy;
  font-display: auto;
  src: url(../fonts/Gilroy-RegularItalic.eot);
  src: local("Gilroy Regular Italic"), local("Gilroy-RegularItalic"),
    url(../fonts/Gilroy-RegularItalic.eot?#iefix) format("embedded-opentype"),
    url(../fonts/Gilroy-RegularItalic.woff) format("woff"),
    url(../fonts/Gilroy-RegularItalic.ttf) format("truetype");
  font-weight: 400;
  font-style: italic;
}
@font-face {
  font-family: Gilroy;
  font-display: auto;
  src: url(../fonts/Gilroy-UltraLight.eot);
  src: local("Gilroy UltraLight"), local("Gilroy-UltraLight"),
    url(../fonts/Gilroy-UltraLight.eot?#iefix) format("embedded-opentype"),
    url(../fonts/Gilroy-UltraLight.woff) format("woff"),
    url(../fonts/Gilroy-UltraLight.ttf) format("truetype");
  font-weight: 200;
  font-style: normal;
}
@font-face {
  font-family: Gilroy;
  font-display: auto;
  src: url(../fonts/Gilroy-Bold.eot);
  src: local("Gilroy Bold"), local("Gilroy-Bold"),
    url(../fonts/Gilroy-Bold.eot?#iefix) format("embedded-opentype"),
    url(../fonts/Gilroy-Bold.woff) format("woff"),
    url(../fonts/Gilroy-Bold.ttf) format("truetype");
  font-weight: 700;
  font-style: normal;
}
@font-face {
  font-family: Gilroy;
  font-display: auto;
  src: url(../fonts/Gilroy-Thin.eot);
  src: local("Gilroy Thin"), local("Gilroy-Thin"),
    url(../fonts/Gilroy-Thin.eot?#iefix) format("embedded-opentype"),
    url(../fonts/Gilroy-Thin.woff) format("woff"),
    url(../fonts/Gilroy-Thin.ttf) format("truetype");
  font-weight: 100;
  font-style: normal;
}
@font-face {
  font-family: Gilroy;
  font-display: auto;
  src: url(../fonts/Gilroy-Black.eot);
  src: local("Gilroy Black"), local("Gilroy-Black"),
    url(../fonts/Gilroy-Black.eot?#iefix) format("embedded-opentype"),
    url(../fonts/Gilroy-Black.woff) format("woff"),
    url(../fonts/Gilroy-Black.ttf) format("truetype");
  font-weight: 900;
  font-style: normal;
}

@media only screen and (min-device-width: 480px) {
  .container {
    max-width: 290px;
  }
}
@media only screen and (min-device-width: 768px) {
  .container {
    max-width: 708px;
  }
}
@media only screen and (min-device-width: 1025px) {
  .container {
    max-width: 964px;
  }
}
@media only screen and (min-device-width: 1230px) {
  .container {
    max-width: 1170px;
  }
}

.check__value {
  text-align: end;
}

@media only screen and (min-device-width: 1024px) {
  .col-5 {
    // -ms-flex: 0 0 33.33333%;
    display: flex;
    flex-grow: 0;
    flex-shrink: 0;
    flex-basis: 35.33333%;
    max-width: 330px;
  }
}

@media only screen and(min-device-width: 768px) and (max-device-width: 1023px) {
  .col-5 {
    display: flex;
    flex-grow: 0;
    flex-shrink: 0;
    flex-basis: 33.33333%;
    max-width: 50.33333%;
  }
}

@media only screen and(min-device-width: 620px) and (max-device-width: 767px) {
  .col-5 {
    display: flex;
    display: -moz-flex;
    display: -webkit-flex;
    display: -ms-flex;
    display: flex;
    // -ms-flex: 0 0 33.33333%;
    // flex: 0 0 33.33333%;
    flex-grow: 0;
    flex-shrink: 0;
    flex-basis: 33.33333%;
    max-width: 60.33333%;
  }
}

@media only screen and (min-device-width: 380px) and (max-device-width: 619px) {
  .col-5 {
    display: flex;
    display: -moz-flex;
    display: -webkit-flex;
    display: -ms-flex;
    display: flex;
    // -ms-flex: 0 0 33.33333%;
    flex: 0 0 33.33333%;
    max-width: 100%;
  }
}

.check {
  padding: 40px 0;
  min-width: 290px;
}
.check__content,
.check__header {
  margin-bottom: 20px;
}
.check__organization {
  text-align: center;
}
.check__row {
  display: -webkit-box;
  display: -ms-flexbox;
  display: flex;
  -webkit-box-align: centerl;
  -ms-flex-align: centerl;
  align-items: centerl;
  -webkit-box-pack: justify;
  -ms-flex-pack: justify;
  justify-content: space-between;
  line-height: 1.4;
}
.check__row--black {
  -webkit-box-pack: center;
  -ms-flex-pack: center;
  justify-content: center;
  text-transform: uppercase;
  text-align: center;
  color: #fff;
  background-color: #000;
  -webkit-transition: all 0.25s ease;
  transition: all 0.25s ease;
}
.check__row--black:hover {
  color: #000;
  background: #fff;
}
.check__rq {
  display: block;
  margin-left: auto;
  margin-right: auto;
}
</style>
