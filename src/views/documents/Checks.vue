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

        <b-button
          :disabled="!haveTransactions"
          class="btn btn-primary mt-1 ml-3"
          @click="toogle">
          {{ visible ? "Скрыть чеки" : "Показать чеки" }}
        </b-button>

        <b-button
          :disabled="!haveTransactions"
          class="btn btn-primary mt-1 ml-3"
          @click="download">
          Скачать чеки
        </b-button>
      </div>

      <div
        v-if="visible"
        id="check"
        ref="print"

        class="d-flex flex-row flex-wrap justify-content-around">
        <vprint
          ref="print"
          :transactions="transactions" />
      </div>
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
    </b-card>
  </div>
</template>

<script>
import {
  BCard, BButton, BPagination, BOverlay, BSpinner,
} from 'bootstrap-vue';
import html2pdf from 'html2pdf.js';

import print from 'vue-print-nb';
import vSelect from 'vue-select';
import flatPickr from 'vue-flatpickr-component';
import { Russian } from 'flatpickr/dist/l10n/ru';
import ToastificationContent from '@core/components/toastification/ToastificationContent.vue';
import vprint from '../vprint.vue';

// import JSPDF from 'jspdf';
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
    vprint,

  },

  directives: {
    print,
  },

  data() {
    return {
      getInfo: null,
      busy: false,
      contract: null,
      currentConsumption: null,
      currentConsumptionDynamic: null,
      contractId: null,
      transactions: null,
      option: [],
      onlyForPrintandDownload: false,
      selectedHolder: null,
      names: [],
      response: null,
      start: null,
      hidden: false,
      end: null,
      firstDay: null,
      today: null,
      visible: false,
      selected: [],
      cards: null,
      rangeDate: null,
      haveTransactions: false,
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
    this.firstDay = this.getFirstDay();
    this.today = this.isToday();

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
      const ID = this.contractId;
      const { selected } = this;
      // eslint-disable-next-line consistent-return
      useJwt.getTransactions(`contract_id=${ID}&startDate=${this.start}&endDate=${this.end}&holder=${holder}&card_number=${selected}`)
        .then((response) => {
          if (response.data.status) {
            this.transactions = response.data;
            this.totalRows = this.transactions.tol.Total;
            this.transactions.data = this.order(this.transactions.data);
            // this.onlyForPrintandDownload = true;
          }
        });

      setTimeout(this.clickPrint, 3000);
    },

    print() {
      this.getAllTransactions();
    },

    order(arr) {
      return arr.slice().sort((a, b) => a.card_number - b.card_number);
    },

    clickPrint() {
      this.$htmlToPaper('vprint');
    },

    download() {
      const holder = this.selectedHolder;
      const ID = this.contractId;
      const { selected } = this;
      useJwt.getTransactions(`contract_id=${ID}&startDate=${this.start}&endDate=${this.end}&holder=${holder}&card_number=${selected}`).then((response) => {
        if (response.data.status) {
          this.transactions = response.data;
        }
        return this.order(this.transactions.data);
      });
      setTimeout(this.getAllChecks, 3000);
    },

    getAllChecks() {
      html2pdf(this.$refs.print, {
        filename: 'Чеки.pdf',
        image: { type: 'png', quality: 0.7 },
        html2canvas: { dpi: 140, letterRendering: true },
        jsPDF: { unit: 'in', format: 'letter', orientation: 'portrait' },
      });
      html2pdf().set({
        pagebreak: { mode: 'avoid-all' },
      });
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
          if (this.transactions.data.length > 1) {
            this.haveTransactions = true;
          }

          if (this.rangeDate.length > 10 && this.transactions.data.length < 1) {
            this.haveTransactions = false;
            this.$toast({
              component: ToastificationContent,
              props: {
                title: 'Отсутвуют транзакции за выбранный период',
                icon: 'AlertTriangleIcon',
                variant: 'danger',
              },
            });
          }
        }
        // eslint-disable-next-line prefer-destructuring
        this.today = arr[0]; // для компонента vprint  = rangeDate [абзац с указанием периода операции по карте]
        // eslint-disable-next-line prefer-destructuring
        this.firstDay = arr[1]; // для компонента vprint  = rangeDate [абзац с указанием периода операции по карте]
        return this.order(this.transactions.data);
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
          if (this.transactions.data.length > 1) {
            this.haveTransactions = true;
          } else {
            this.haveTransactions = false;
            this.visible = false;
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

        return this.order(this.transactions.data);
      });
      // if (this.selected.length < 1) {
      //   this.getAllTransactions();
      //   // this.hidden = true;
      // }
    },

    toogle() {
      this.visible = !this.visible;
      this.hidden = !this.hidden;
    },
  },

};
</script>

<style lang="scss" scoped>
@import "@core/scss/vue/libs/vue-select.scss";
@import "@core/scss/vue/libs/vue-flatpicker.scss";

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
</style>
