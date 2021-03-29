<template>
  <div>
    <!-- <div v-if="items.transactions.length>0"> -->
    <b-container
      fluid
      class="d-flex justify-content-center">
      <b-col>
        <b-card class="text-rigth">
          <!-- ТАБЛИЦА -->
          <b-card-body>
            <div class="d-flex justify-content-between  flex-wrap">
              <b-form-group
                label="Период"
                label-cols-sm="3"
                label-align-sm="left"
                label-size="sm"
                label-for="filterInput"
                class="mb-1">
                <flat-pickr
                  v-model="rangeDate"
                  size="sm"
                  class="form-control mb-0"
                  :config="config"
                  @on-change="selectDate" />
              </b-form-group>
              <!-- filter -->
              <b-form-group
                label="Найти"
                label-cols-sm="2"
                label-align-sm="left"
                label-size="sm"
                label-for="filterInput"
                class="mb-0">
                <b-input-group size="sm">
                  <b-form-input
                    id="filterInput"
                    v-model="filter"
                    type="search" />
                  <b-input-group-append>
                    <b-button
                      :disabled="!filter"
                      @click="filter = ''">
                      Очистить
                    </b-button>
                  </b-input-group-append>
                </b-input-group>
              </b-form-group>
              <!-- <b-button
                @click="download">
                Скачать
              </b-button> -->
              <vue-excel-xlsx
                class="btn btn-secondary"
                :data="transactions.data"
                :columns="columns"
                :filename="'Транзакции'"
                :sheetname="'Транзакции'">
                Скачать
              </vue-excel-xlsx>
            </div>
            <div />
          </b-card-body>

          <b-table
            hover
            responsive
            class="position-relative table-hover"
            :per-page="perPage"
            :current-page="currentPage"
            :items="transactions.data"
            :fields="fields"
            :sort-by.sync="sortBy"
            :sort-desc.sync="sortDesc"
            :sort-direction="sortDirection"
            :filter="filter"
            :filter-included-fields="filterOn"
            @filtered="onFiltered">
            <!--1-й вариант-->
            <template #cell(summ)="row">
              <b-col @click="row.toggleDetails">
                <span :class="row.item.summ < 0 ? 'text-danger' : 'text-success'">{{ parseInt(row.item.summ).toLocaleString('ru-RU', {
                  style: 'currency',
                  currency: 'RUB'
                }) }}</span><br>
                <!--
                  <b-button
                    pill
                    size="sm"
                    @click="row.detailsShowing"
                  >Детали
                  </b-button> -->

                <span
                  class="border-dashed"
                  @click="row.detailsShowing">Детали</span>
              </b-col>
            </template>

            <template #row-details="row">
              <b-card>
                <b-row class="mb-2">
                  <!-- <b-col
                      md="4"
                      class="mb-1"
                    >
                      <strong>Сумма : </strong>  <span :class="row.item.summ < 0 ? 'text-danger' : 'text-success'">  {{ row.item.summ }} </span>
                    </b-col> -->

                  <b-col
                    md="4"
                    class="mb-1">
                    <strong>Дата/время : </strong>{{ row.item.period }}
                  </b-col>
                  <b-col
                    md="4"
                    class="mb-1">
                    <strong>Количество : </strong>{{ row.item.quantity }}
                  </b-col>
                </b-row>

                <b-button
                  size="sm"
                  variant="outline-secondary"
                  @click="row.toggleDetails">
                  Скрыть детали
                </b-button>
              </b-card>
            </template>

            <template #cell(period)="row">
              <b-col @click="row.toggleDetails">
                {{ formatDate(row.item.period, {day:"numeric", month:"long"}, "ru-RU" ) }}
              </b-col>
            </template>
          </b-table>
          <b-card-body class="d-flex justify-content-between flex-wrap pt-0">
            <!-- page length -->
            <b-form-group
              label="На странице"
              label-cols="6"
              label-align="left"
              label-size="sm"
              label-for="sortBySelect"
              class="text-nowrap mb-md-0 mr-1">
              <b-form-select
                id="perPageSelect"
                v-model="perPage"
                size="sm"
                inline
                :options="pageOptions" />
            </b-form-group>

            <!-- pagination -->
            <div>
              <b-pagination
                v-model="currentPage"
                :total-rows="totalRows"
                :per-page="perPage"
                first-number
                last-number
                prev-class="prev-item"
                next-class="next-item"
                class="mb-0">
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
          </b-card-body>
          <!-- КОНЕЦ ТАБЛИЦЫ -->
        </b-card>
      </b-col>
    </b-container>
    <!-- </div> -->
  </div>
</template>
<script>

import { required, credit } from '@validations';
import { formatDate } from '@core/utils/filter';
import flatPickr from 'vue-flatpickr-component'; // datapicker
import { Russian } from 'flatpickr/dist/l10n/ru';
// import excel from 'vue-excel-export';
import XLSX from 'xlsx';

// import ToastificationContent from '@core/components/toastification/ToastificationContent.vue';
import {
  BRow,
  BCol,
  BFormGroup,
  BFormInput,
  BCard,
  BButton,
  BContainer,
  BTable,
  BFormSelect,
  BPagination,
  BInputGroup,
  BInputGroupAppend,
  BCardBody,
} from 'bootstrap-vue';
import 'swiper/css/swiper.css';
// import axios from '@axios';
import useJwt from '@/auth/jwt/useJwt';
// import { isToday } from '@core/utils/utils';
import { codeRowDetailsSupport } from './code';
import 'bootstrap-vue/dist/bootstrap-vue-icons.min.css';

export default {
  components: {
    BCard,
    flatPickr,
    BButton,
    BContainer,
    BCol,
    BRow,
    BTable,
    BFormGroup,
    BFormSelect,
    BPagination,
    BInputGroup,
    BFormInput,
    BInputGroupAppend,
    BCardBody,
  },
  data() {
    return {
      perPage: 5,
      pageOptions: [3, 5, 10],
      totalRows: null,
      contract: null,
      contractId: null,
      currentPage: 1,
      sortBy: '',
      sortDesc: false,
      sortDirection: 'asc',
      filter: null,
      filterOn: [],
      required,
      Selected: null,
      transactions: [],

      rangeDate: null, // датапикер
      dateStart: [],
      dateEnd: [], // new Date()
      config: {
        mode: 'range',
        maxDate: 'today',
        defaultDate: ['01-03-2021', 'today'],
        locale: Russian,
        dateFormat: 'd.m.Y',
      },
      cardStatus: {

        ACTIVE: 'Активна',
        BLOCK: 'Заблокирована',
        BROKEN: 'Неисправна',
        DELETED: 'Удалена',
        FINANCE: 'Финансовая блокировка',
        LOST: 'Утеряна',
        RETURN: 'Сдана',
        SOLD: 'Продана',
      },
      fields: [
        {
          key: 'service.full_name',
          label: 'Товар/услуга',
        },
        {
          key: 'date',
          label: 'Дата',
        },
        {
          key: 'summ',
          label: 'Сумма',
        },
      ],

      columns: [
        {
          label: 'Товар/услуга',
          field: 'service.full_name',
        },
        {
          label: 'Дата',
          field: 'date',
          dataFormat: this.priceFormat,
        },
        {
          label: 'Сумма',
          field: 'summ',
        },
      ],
      items: {
        transactions: [],
        status_card: '',
      },
      credit,
      formatDate,
      codeRowDetailsSupport,
    };
  },
  computed: {
    sortOptions() {
      // Create an options list from our fields
      return this.fields
        .filter((f) => f.sortable)
        .map((f) => ({ text: f.label, value: f.key }));
    },
    viewStatus() {
      return this.cardStatus[this.items.card_status];
    },
    getDay() {
      const Data = new Date();
      return Data.getDate();
    },
  },

  // created() {
  //   useJwt.getTransactions().then((response) => {
  //     if (response.data.status) {
  //       this.$store.dispatch('user/getTransactions', response.data).then(() => {
  //         this.transactions = response.data;
  //         console.log(this.transactions);
  //       });
  //     }
  //   });
  // },

  // beforeCreate() {
  //   const userData = JSON.parse(localStorage.getItem('userData'));
  //   if (userData) {
  //     this.contract = userData;
  //   }
  //   console.log(this.contract);
  //   return this.contract;
  // },

  created() {
    const userData = JSON.parse(localStorage.getItem('userData'));
    if (userData) {
      this.contract = userData;
      this.contractId = this.contract.contract.id;
    }
    return this.contract;
  },

  beforeMount() {
    // eslint-disable-next-line no-template-curly-in-string
    // eslint-disable-next-line quotes
    const ID = this.contractId;
    useJwt.getTransactions(`contract_id=${ID}&startDate=01.03.2021 00:00:00&endDate=01.04.2021 00:00:00&card_nuber=7826010113259838`).then((response) => {
      if (response.data.status) {
        this.transactions = response.data;
        this.totalRows = this.transactions.data.length;
        console.log(this.transactions);
      }
      return this.transactions;
    });
  },

  methods: {
    // getData() {
    //   this.$refs.simpleRules.validate().then((success) => {
    //     if (success) {
    //       return new Promise((resolve, reject) => {
    //         axios
    //           .post('http://cabinet.autocard-yug.ru/api/transaction/new', {
    //             // ДАТА К ТАБЛИЦЕ
    //             card_number: this.NumberCard,
    //             pin: this.pinCard,
    //             start_date: '2021-01-01', // this.rangeDate ()
    //             end_date: new Date(),
    //           })
    //           .then((response) => {
    //             if (response.data.status) {
    //               this.items = response.data.message;
    //               this.totalRows = this.items.transactions.length;
    //             } else {
    //               this.$toast({
    //                 component: ToastificationContent,
    //                 props: {
    //                   title: 'Уведомление',
    //                   icon: 'BellIcon',
    //                   text: response.data.message,
    //                   // variant,
    //                 },
    //               });
    //             }
    //           })
    //           .catch((error) => reject(error));
    //       });
    //     }
    //     return null;
    //   });
    // },
    // getTransactions() {
    //   const urlParams = new URLSearchParams(window.location.search);

    //   urlParams.set('startDate', 'date');

    //   useJwt.getTransactions('contract_id=afed3af7-b90c-11e9-94d2-7054d2199b65&startDate=01.03.2021 00:00:00&endDate=01.04.2021 00:00:00&card_nuber=7826010113259838');
    // },
    // getDate() {
    //   const date = this.rangeDate;
    //   const newDate = Array.from(date).filter((n) => n !== '—');
    //   const arr = (newDate.join('').split('  '));
    //   const start = arr[0].split('.').reverse().join('-');
    //   const end = arr[1].split('.').reverse().join('-');
    //   axios
    //     .post('http://cabinet.autocard-yug.ru/api/gettransactionPin', {
    //       // ДАТА К ТАБЛИЦЕ
    //       card_number: this.NumberCard,
    //       start_date: start,
    //       end_date: end,
    //     })
    //     .then((response) => {
    //       if (response.data.status) {
    //         this.items = response.data.message;
    //         this.totalRows = this.items.transactions.length;
    //       } else {
    //         this.items.transactions = [];
    //       }
    //     });
    // },

    download() {
      const data = XLSX.utils.json_to_sheet(this.transactions.data);
      const wb = XLSX.utils.book_new();
      console.log(wb);
      XLSX.utils.book_append_sheet(wb, data, 'data');
      XLSX.writeFile(wb, 'Транзакции.xlsx');
    },

    selectDate() {
      const date = this.rangeDate;
      const newDate = Array.from(date).filter((n) => n !== '—');
      const arr = (newDate.join('').split('  '));
      // eslint-disable-next-line prefer-template
      const start = arr[0] + ' 00:00:00';
      // eslint-disable-next-line prefer-template
      const end = arr[1] + ' 00:00:00';
      const ID = this.contractId;
      useJwt.getTransactions(`contract_id=${ID}&startDate=${start}&endDate=${end}&card_nuber=7826010113259838`).then((response) => {
        if (response.data.status) {
          this.transactions = response.data;
          this.totalRows = this.transactions.data.length;
        }
        return this.transactions;
      });
    },

    onFiltered(filteredItems) {
      // Trigger pagination to update the number of buttons/pages due to filtering
      this.totalRows = filteredItems.length;
      this.currentPage = 1;
    },
    back() {
      this.items.status_card = '';
      this.items.transactions = [];
    },
  },
};
</script>

<style lang="scss">
@import "@core/scss/vue/libs/vue-select.scss";
@import "@core/scss/vue/libs/vue-flatpicker.scss";
</style>
