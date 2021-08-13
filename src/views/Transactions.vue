<template>
  <b-overlay
    :show="loadDone"
    spinner-type="grow"
    spinner-variant="primary"
    spinner-medium
    variant="transparent"
    blur="5px"
    opacity=".75"
    rounded="md">
    <div v-if="!loadDone">
      <b-container
        fluid
        class="d-flex justify-content-center">
        <b-col>
          <b-card class="text-rigth">
            <!-- ТАБЛИЦА -->
            <b-card-body>
              <div class="d-flex justify-content-between  flex-wrap">
                <div :class="['d-flex', 'flex-column', {'w-100': getWidth === 'xs'}]">
                  <b-form-group>
                    <p class="mt-1">
                      Выберете период:
                    </p>
                    <flat-pickr
                      v-model="rangeDate"
                      size="sm"
                      class="form-control mb-0"
                      :config="config"
                      @on-change="selectDate" />
                  </b-form-group>
                  <div
                    class="d-flex flex-column justify-content-around
                  ">
                    <p class="mt-1">
                      Выберете карту:
                    </p>
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
                        :options="option"
                        class="w-100 mb-1"
                        @input="onChange()" />
                    </b-overlay>
                  </div>
                </div>
                <!-- filter -->
                <div :class="['d-flex', 'flex-column-reverse', 'justify-content-around', getWidth === 'xs'?'align-items-end':'align-items-end', {'w-100': getWidth === 'xs'}]">
                  <b-form-group
                    class="mb-0 mt-2">
                    <b-input-group
                      size="sm">
                      <b-form-input
                        id="filterInput"
                        v-model="filter"
                        placeholder="Найти"
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

                  <div>
                    <export-excel
                      class="btn btn-primary"
                      :data="transactions.data.result"
                      :fields="columns"
                      type="xlsx"
                      name="Транзакции.xlsx">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="20"
                        height="20"
                        fill="currentColor"
                        class="bi bi-file-earmark-excel"
                        viewBox="0 0 16 16">
                        <path d="M5.884 6.68a.5.5 0 1 0-.768.64L7.349 10l-2.233 2.68a.5.5 0 0 0 .768.64L8 10.781l2.116 2.54a.5.5 0 0 0 .768-.641L8.651 10l2.233-2.68a.5.5 0 0 0-.768-.64L8 9.219l-2.116-2.54z" />
                        <path d="M14 14V4.5L9.5 0H4a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2zM9.5 3A1.5 1.5 0 0 0 11 4.5h2V14a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1h5.5v2z" />
                      </svg>
                      Скачать
                    </export-excel>
                  </div>
                </div>
              </div>
            </b-card-body>
            <b-table
              v-if="getWidth !== 'xs'"
              hover
              responsive
              class="position-relative table-hover text-center"
              :per-page="perPage"
              :current-page="currentPage"
              :items="transactions.data.result"
              :fields="fields"
              :sort-by.sync="sortBy"
              :sort-desc.sync="sortDesc"
              :sort-direction="sortDirection"
              :filter="filter"
              :filter-included-fields="filterOn"
              @filtered="onFiltered">
              <template #cell(summ)="row">
                <b-col @click="row.toggleDetails">
                  <span :class="row.item.summ < 0 ? 'text-danger' : 'text-success'">{{ parseInt(row.item.summ).toLocaleString('ru-RU', {
                    style: 'currency',
                    currency: 'RUB'
                  }) }}</span><br>

                  <b-button
                    class="mt-1"
                    pill
                    size="sm"
                    @click="row.detailsShowing">
                    Детали
                  </b-button>
                </b-col>
              </template>

              <template
                #cell(date)="row">
                <b-col @click="row.toggleDetails">
                  {{ row.item.date | formatDate }}
                </b-col>
              </template>

              <template #row-details="row">
                <b-card
                  @click="row.toggleDetails">
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
                      <strong>Дата/время : </strong>{{ row.item.date | formatDate }}
                    </b-col>
                    <b-col
                      md="4"
                      class="mb-1">
                      <strong>Количество : </strong>{{ row.item.quantity }}
                    </b-col>
                    <b-col
                      md="4"
                      class="mb-1">
                      <strong>услуга : </strong>{{ row.item.service.full_name }}
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
                <b-col>
                  {{ row.item.date | formatDate }}
                </b-col>
              </template>
            </b-table>
            <b-table
              v-else
              hover
              responsive
              class="position-relative table-hover text-center"
              :per-page="perPage"
              :current-page="currentPage"
              :items="transactions.data"
              :fields="fieldsSM"
              :sort-by.sync="sortBy"
              :sort-desc.sync="sortDesc"
              :sort-direction="sortDirection"
              :filter="filter"
              :filter-included-fields="filterOn"
              @filtered="onFiltered">
              <template #cell(summ)="row">
                <b-col @click="row.toggleDetails">
                  <span :class="row.item.summ < 0 ? 'text-danger' : 'text-success'">{{ parseInt(row.item.summ).toLocaleString('ru-RU', {
                    style: 'currency',
                    currency: 'RUB'
                  }) }}</span><br>

                  <b-button
                    class="mt-1"
                    pill
                    size="sm"
                    @click="row.detailsShowing">
                    Детали
                  </b-button>
                </b-col>
              </template>
              <!--
              <template
                #cell(date)="row">
                <b-col @click="row.toggleDetails">
                  {{ row.item.date | formatDate }}
                </b-col>
              </template> -->

              <template #row-details="row">
                <b-card
                  @click="row.toggleDetails">
                  <b-row class="mb-2">
                    <b-col
                      md="4"
                      class="mb-1">
                      <strong>Дата/время : </strong>{{ row.item.date | formatDate }}
                    </b-col>
                    <b-col
                      md="4"
                      class="mb-1">
                      <strong>Количество : </strong>{{ row.item.quantity }}
                    </b-col>
                    <b-col
                      md="4"
                      class="mb-1">
                      <strong>Услуга : </strong>{{ row.item.service.full_name }}
                    </b-col>
                    <b-col
                      md="4"
                      class="mb-1">
                      <strong>Адрес операции: </strong>{{ row.item.pos.address }}
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
                  {{ row.item.date | formatDate }}
                </b-col>
              </template>
            </b-table>
            <b-card-body class="d-flex justify-content-between flex-wrap pt-0">
              <!-- page length -->
              <b-form-group
                label="На странице"
                label-cols="7"
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
    </div>
  </b-overlay>
  <!-- </div> -->
</template>
<script>
import { required, credit } from '@validations';
import flatPickr from 'vue-flatpickr-component'; // datapicker
import { Russian } from 'flatpickr/dist/l10n/ru';
import store from '@/store';
import { mapGetters } from 'vuex';
import {
  BRow,
  BCol,
  BOverlay,
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
  BSpinner,
} from 'bootstrap-vue';
// import 'swiper/swiper-bundle.css';
import vSelect from 'vue-select';
import ToastificationContent from '@core/components/toastification/ToastificationContent.vue';
// import store from '@/store';
import useJwt from '../auth/jwt/useJwt';
import { formatDate } from '../@core/utils/filter';
// import { codeRowDetailsSupport } from './code';
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
    BOverlay,
    vSelect,
    BSpinner,
  },
  data() {
    return {
      perPage: 5,
      pageOptions: [3, 5, 10],
      totalRows: null,
      busy: false,
      loadDone: false,
      contract: null,
      start: null,
      end: null,
      contractId: null,
      currentPage: 1,
      sortBy: 'date',
      sortDesc: false,
      sortDirection: 'asc',
      filter: null,
      filterOn: [],
      required,
      option: [],
      selected: [],
      transactions: {},
      rangeDate: null, // датапикер
      config: {
        mode: 'range',
        maxDate: 'today',
        // defaultDate: ['01-03-2021', 'today'],
        locale: Russian,
        dateFormat: 'd.m.Y',
      },
      fields: [
        {
          key: 'service.full_name',
          label: 'Товар/услуга',
          sortable: true,
        },
        {
          key: 'date',
          label: 'Дата',
          sortable: true,
        },
        {
          key: 'summ',
          label: 'Сумма',
          sortable: true,
        },
        {
          key: 'card_number',
          label: 'Номер карты',
          sortable: true,
        },
      ],
      fieldsSM: [
        {
          key: 'date',
          label: 'Дата',
          sortable: true,
        },
        {
          key: 'summ',
          label: 'Сумма',
          sortable: true,
        },
      ],
      columns: {
        'Товар/услуга': {
          field: 'service.full_name',
        },
        'Дата': {
          field: 'date',
        },
        'Сумма': {
          field: 'summ',
        },
        'Держатель': {
          field: 'holder',
        },
        'Номер договора': {
          field: 'contract.number',
        },
        'Номер карты': {
          field: 'card_number',
        },
        'Тип операции': {
          field: 'operation_type',
        },
        'Адрес операции': {
          field: 'pos.address',
        },
      },
      items: {
        transactions: [],
        status_card: '',
      },
      // contract: null,
      // gotSelectedContract: store.getters.CONTRACT_ID,
      credit,
      formatDate,
      // codeRowDetailsSupport,
    };
  },
  computed: {
    ...mapGetters({
      // gotSelected: 'CONTRACT_NUMBER',
      gotSelectedContract: 'CONTRACT_ID',
    }),
    sortOptions() {
      return this.fields
        .filter((f) => f.sortable)
        .map((f) => ({ text: f.label, value: f.key }));
    },

    getWidth() {
      return store.getters['app/currentBreakPoint'];
    },

  },
  watch: {
    gotSelectedContract(val) {
      this.getAllCards(val);
      // this.selectDate();
      this.onChange();
    },
    // rangeDate() {
    //   this.selectDate();
    // },
  },
  created() {
    this.loadDone = true;
  },
  beforeMount() {
    const userData = JSON.parse(localStorage.getItem('userData'));
    if (userData) {
      this.contract = userData;
      this.contractId = this.contract.contract.id;
    }
    this.loadDone = true;
    this.getAllCards(this.gotSelectedContract);
    this.start = `${this.getFirstDay()} 00:00:00`;
    this.end = `${this.isToday()} 00:00:00`;
    this.rangeDate = [this.start, this.end];
    useJwt.getTransactions(`contract_id=${this.contractId}&startDate=${this.start}&endDate=${this.end}`).then((response) => {
      if (response.data.status) {
        this.transactions = response.data;
        this.totalRows = this.transactions.data.total;
        // this.loadDone = false;
        if (this.totalRows < 1) {
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
      // return this.transactions;
    });
  },
  mounted() {
    this.loadDone = false;
    this.getAllTransactions();
  },
  methods: {
    unique(arr) {
      this.arr = Array.from(new Set(arr));
      return this.arr;
    },
    getAllTransactions() {
      // const ID = this.gotSelectedContract;
      this.loadDone = true;
      useJwt.getTransactions(`contract_id=${this.gotSelectedContract}&startDate=${this.start}&endDate=${this.end}`).then((response) => {
        if (response.data.status) {
          this.transactions = response.data;
          this.totalRows = this.transactions.data.total;

        }
        this.loadDone = false;
      });
    },
    getAllCards(val) {
      this.option = [];
      this.busy = true;
      useJwt.getCards(val).then((response) => {
        if (response.data.status) {
          this.response = response.data;
          this.response.cards.forEach((el) => {
            this.option.push(el.number);
          });
        }
        this.busy = false;
        this.option = this.unique(this.option);
      });
    },
    onChange() {
      // this.loadDone = true;
      const date = this.rangeDate;
      const newDate = Array.from(date).filter((n) => n !== '—');
      const arr = (newDate.join('').split('  '));
      // // eslint-disable-next-line prefer-template
      const start = `${arr[0]} 00:00:00`;
      // // eslint-disable-next-line prefer-template
      const end = `${arr[1]} 00:00:00`;
      const { selected } = this;
      // const { start } = this;
      // const { end } = this;
      // const ID = this.gotSelectedContract;
      if (selected === null) {
        useJwt.getTransactions(`contract_id=${this.gotSelectedContract}&startDate=${start}&endDate=${end}`).then((response) => {
          if (response.data.status) {
            this.transactions = response.data;
            // this.loadDone = false;
            this.totalRows = this.transactions.data.total;
            if (this.totalRows < 1) {
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
        });
      } else {
        useJwt.getTransactions(`contract_id=${this.gotSelectedContract}&startDate=${start}&endDate=${end}&card_number=${selected}`).then((response) => {
          if (response.data.status) {
            this.transactions = response.data;
            // this.loadDone = false;
            console.log(this.transactions);
            this.totalRows = this.transactions.data.total;
            if ((selected === null || selected.length < 1) && this.totalRows < 1) {
              this.$toast({
                component: ToastificationContent,
                props: {
                  title: 'Отсутвуют транзакции за выбранный период',
                  icon: 'AlertTriangleIcon',
                  variant: 'danger',
                },
              });
            }
            if ((selected !== null && selected.length > 0) && this.totalRows < 1) {
              this.$toast({
                component: ToastificationContent,
                props: {
                  title: 'Отсутвуют транзакции по карте за период',
                  icon: 'AlertTriangleIcon',
                  variant: 'danger',
                },
              });
            }

          }
        // return this.transactions;
        });
      }
    },
    isToday() {
      const today = new Date();
      return today.toLocaleDateString();
    },
    getFirstDay() {
      const date = new Date();
      const firstDay = new Date(date.getFullYear(), date.getMonth(), 1).toLocaleDateString();
      return firstDay;
    },
    selectDate() {
      const date = this.rangeDate;
      const newDate = Array.from(date).filter((n) => n !== '—');
      const arr = (newDate.join('').split('  '));
      // eslint-disable-next-line prefer-template
      const Start = arr[0] + ' 00:00:00';
      // eslint-disable-next-line prefer-template
      const End = arr[1] + ' 00:00:00';
      const { selected } = this;
      useJwt.getTransactions(`contract_id=${this.gotSelectedContract}&startDate=${Start}&endDate=${End}&card_number=${selected}`).then((response) => {
        if (response.data.status) {
          this.transactions = response.data;
          console.log(this.transactions);
          this.totalRows = this.transactions.data.total;
          // this.loadDone = false;
          if (this.rangeDate.length > 22) {
            if (this.totalRows < 1) {
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
        }
        // return this.transactions;
      });
      if (selected === null) {
        useJwt.getTransactions(`contract_id=${this.gotSelectedContract}&startDate=${Start}&endDate=${End}`).then((response) => {
          this.transactions = response.data;
          // this.loadDone = false;
          this.totalRows = this.transactions.data.total;
        });
      }
    },
    onFiltered(filteredItems) {
      this.loadDone = true;
      // Trigger pagination to update the number of buttons/pages due to filtering
      this.totalRows = filteredItems.length;
      this.currentPage = 1;
      this.loadDone = false;
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
