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
        :class="['d-flex', 'justify-content-center', {'pl-0': getWidth === 'xs'}, {'pr-0': getWidth === 'xs'}]">
        <b-col>
          <b-card class="text-rigth">
            <!-- ТАБЛИЦА -->
            <b-card-body>
              <div :class="['d-flex', 'justify-content-between', 'flex-wrap', {'container-fluid': getWidth !== 'xs'}, ]">
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
                        @input="onChange" />
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
                    <b-button

                      variant="primary"
                      class="ml-2"
                      @click="downloadTransReport">
                      <feather-icon
                        icon="DownloadCloudIcon" />
                      <span class="align-middle ml-1">Скачать</span>
                    </b-button>
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
                  <span :class="row.item.summ < 0 ? 'text-danger' : 'text-success'">{{ parseFloat(row.item.summ).toLocaleString('ru-RU', {
                    style: 'currency',
                    currency: 'RUB'
                  }) }}</span><br>

                  <!-- <b-button
                    class="mt-1"
                    pill
                    size="sm"
                    @click="row.detailsShowing">
                    Детали
                  </b-button> -->
                </b-col>
              </template>

              <template
                #cell(date)="row">
                <b-col @click="row.toggleDetails">
                  {{ row.item.date | formatDate }}
                </b-col>
              </template>

              <template
                #cell(quantity)="row">
                <b-col @click="row.toggleDetails">
                  {{ (parseFloat(row.item.quantity).toFixed(2)).replace('.', ',') }}
                </b-col>
              </template>

              <template
                #cell(card_number)="row">
                <b-col>
                  <router-link :to="{ name: 'card', params: { card_number: row.item.card_number } }">
                    <span class="text-body"> {{ row.item.card_number }} </span>
                  </router-link>
                </b-col>
              </template>

              <template #cell(period)="row">
                <b-col @click="row.toggleDetails">
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
              :items="transactions.data.result"
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

              <template
                #cell(date)="row">
                <b-col @click="row.toggleDetails">
                  {{ row.item.date | formatDate }}
                </b-col>
              </template>

              <template #cell(card_number)="row">
                <router-link :to="{ name: 'card', params: { card_number: row.item.card_number } }">
                  {{ row.item.card_number }}
                </router-link>
              </template>

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
                      <strong>Номер карты : </strong>{{ row.item.card_number }}
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
                </b-card>
              </template>

              <template #cell(period)="row">
                <b-col @click="row.toggleDetails">
                  {{ row.item.date | formatDate }}
                </b-col>
              </template>

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
              </b-card-body>
              <!-- КОНЕЦ ТАБЛИЦЫ -->
            </b-table>
            <b-pagination
              v-model="currentPage"
              :total-rows="totalRows"
              :per-page="perPage"
              first-number
              last-number
              prev-class="prev-item"
              next-class="next-item"
              class="mb-0 mt-1 ml-1">
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
import axios from '@axios';
// eslint-disable-next-line import/no-cycle
import store from '../store';
// import store from '@/store';
import useJwt from '../auth/jwt/useJwt';
import { formatDate } from '../@core/utils/filter';
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
      // selected: store.getters.CARD_NUMBER,
      transactions: {},
      rangeDate: null, // датапикер
      config: {
        mode: 'range',
        maxDate: 'today',
        locale: Russian,
        dateFormat: 'd.m.Y',
      },
      fields: [
        {
          key: 'date',
          label: 'Дата',
          sortable: true,
        },
        {
          key: 'service.full_name',
          label: 'Товар/услуга',
          sortable: true,
        },
        {
          key: 'quantity',
          label: 'Количество',
          sortable: true,
        },
        {
          key: 'summ',
          label: 'Сумма',
          sortable: true,
        },
        {
          key: 'card_holder',
          label: 'Держатель',
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

        'Дата': {
          field: 'date',
        },
        'Товар/услуга': {
          field: 'service.full_name',
        },
        'Количество': {
          field: 'quantity',
        },
        'Сумма': {
          field: 'summ',
        },
        'Держатель': {
          field: 'card_holder',
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
      credit,
      formatDate,
    };
  },
  computed: {
    ...mapGetters({
      gotSelectedContract: 'CONTRACT_ID',
      gotCardNumber: 'CARD_NUMBER',
    }),
    sortOptions() {
      return this.fields
        .filter((f) => f.sortable)
        .map((f) => ({ text: f.label, value: f.key }));
    },
    getWidth() {
      return store.getters['app/currentBreakPoint'];
    },
    selected: {
      get() {
        return this.gotCardNumber;
      },
      set(value) {
        this.$store.dispatch('getCardNumber', value);
      },
    },
  },
  watch: {
    gotSelectedContract(val, oldVal) {
      this.getAllCards(val);
      this.contractId = val;
      if (oldVal !== null) {
        this.onChange();
      }
      this.$store.dispatch('getCardNumber', null);
    },
  },
  beforeMount() {
    this.loadDone = true;
    const userData = JSON.parse(localStorage.getItem('userData'));
    if (userData && this.gotSelectedContract === null) {
      this.contract = userData;
      this.contractId = this.contract.contract.id;
    } else this.contractId = this.gotSelectedContract;
    this.getAllCards(this.contractId);
    this.start = `${this.getFirstDay()} 00:00:00`;
    this.end = `${this.isToday()} 23:59:59`;
    this.rangeDate = [this.start, this.end];

    if ((this.selected === null) || (this.selected === undefined)) {
      useJwt.getTransactions(`contract_id=${this.contractId}&startDate=${this.start}&endDate=${this.end}`).then((response) => {
        if (response.data.status) {
          this.transactions = response.data;
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
      useJwt.getTransactions(`contract_id=${this.contractId}&startDate=${this.start}&endDate=${this.end}&card_number=${this.selected}`).then((response) => {
        if (response.data.status) {
          this.transactions = response.data;
          this.totalRows = this.transactions.data.total;
          if (this.totalRows < 1) {
            this.$toast({
              component: ToastificationContent,
              props: {
                title: 'Отсутвуют транзакции по карте за выбранный период',
                icon: 'AlertTriangleIcon',
                variant: 'danger',
              },
            });
          }
        }
      });
    }
  },
  mounted() {
    this.loadDone = false;
  },
  methods: {
    unique(arr) {
      this.arr = Array.from(new Set(arr));
      return this.arr;
    },
    getAllTransactions() {
      this.loadDone = true;
      useJwt.getTransactions(`contract_id=${this.contractId}&startDate=${this.start}&endDate=${this.end}`).then((response) => {
        if (response.data.status) {
          this.transactions = response.data;
          this.totalRows = this.transactions.data.result.length;
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
    getDate() {
      const date = this.rangeDate;
      const newDate = Array.from(date).filter((n) => n !== '—');
      const arr = newDate.join('').split('00:00:00');
      const trim = arr.join('').split(' ').filter((n) => n !== '');
      // eslint-disable-next-line prefer-template
      this.start = trim[0] + ' 00:00:00';
      // eslint-disable-next-line prefer-template
      this.end = trim[1] + ' 23:59:59';
    },

    onChange() {
      const { selected } = this;
      this.getDate();
      if (selected === null) {
        useJwt.getTransactions(`contract_id=${this.contractId}&startDate=${this.start}&endDate=${this.end}`).then((response) => {
          if (response.data.status) {
            this.transactions = response.data;
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
        useJwt.getTransactions(`contract_id=${this.contractId}&startDate=${this.start}&endDate=${this.end}&card_number=${selected}`).then((response) => {
          if (response.data.status) {
            this.transactions = response.data;
            this.totalRows = this.transactions.data.total;
            if (this.totalRows < 1) {
              this.$toast({
                component: ToastificationContent,
                props: {
                  title: 'Отсутвуют транзакции по карте за выбранный период',
                  icon: 'AlertTriangleIcon',
                  variant: 'danger',
                },
              });
            }
          }
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
      this.getDate();
      const { selected } = this;
      if (date.length > 22) {
        if (selected === null) {
          useJwt.getTransactions(`contract_id=${this.contractId}&startDate=${this.start}&endDate=${this.end}`).then((response) => {
            this.transactions = response.data;
            this.totalRows = this.transactions.data.total;
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
          });
        } else {
          useJwt.getTransactions(`contract_id=${this.contractId}&startDate=${this.start}&endDate=${this.end}&card_number=${selected}`).then((response) => {
            if (response.data.status) {
              this.transactions = response.data;
              this.totalRows = this.transactions.data.total;
              if (this.totalRows < 1) {
                this.$toast({
                  component: ToastificationContent,
                  props: {
                    title: 'Отсутвуют транзакции по карте за выбранный период',
                    icon: 'AlertTriangleIcon',
                    variant: 'danger',
                  },
                });
              }
            }
          });
        }
      }
      if (this.rangeDate.length > 9 && this.rangeDate.length < 11) { // Указание одной и той же даты при выборе
        // eslint-disable-next-line prefer-template
        this.start = date + ' 00:00:00';
        // eslint-disable-next-line prefer-template
        this.end = date + ' 23:59:59';
        if (selected === null) {
          useJwt.getTransactions(`contract_id=${this.contractId}&startDate=${this.start}&endDate=${this.end}`).then((response) => {
            this.transactions = response.data;
            this.totalRows = this.transactions.data.total;
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
          });
        } else {
          useJwt.getTransactions(`contract_id=${this.contractId}&startDate=${this.start}&endDate=${this.end}&card_number=${selected}`).then((response) => {
            if (response.data.status) {
              this.transactions = response.data;
              this.totalRows = this.transactions.data.total;
              if (this.totalRows < 1) {
                this.$toast({
                  component: ToastificationContent,
                  props: {
                    title: 'Отсутвуют транзакции по карте за выбранный период',
                    icon: 'AlertTriangleIcon',
                    variant: 'danger',
                  },
                });
              }
            }
          });
        }
      }
    },
    downloadTransReport() {
      const date = this.rangeDate;
      const newDate = Array.from(date).filter((n) => n !== '—');
      const arr = newDate.join('').split('00:00:00');
      const trim = arr.join('').split(' ').filter((n) => n !== '');
      // eslint-disable-next-line prefer-template
      this.start = trim[0] + ' 00:00:00';
      // eslint-disable-next-line prefer-template
      this.end = trim[1] + ' 23:59:59';
      if (this.selected === null) {
        axios.get(`/api/getTransReport?contract_id=${this.contractId}&startDate=${this.start}&endDate=${this.end}`, {
          responseType: 'blob',
        }).then((response) => {
          const url = URL.createObjectURL(new Blob([response.data]));
          const link = document.createElement('a');
          link.href = url;
          link.setAttribute(
            'download',
            `Транзакционный отчёт от ${new Date().toLocaleDateString()}.xls`,
          );
          document.body.appendChild(link);
          link.click();
        });
      } else {
        axios.get(`/api/getTransReport?contract_id=${this.contractId}&startDate=${this.start}&endDate=${this.end}&card_number=${this.selected}`, {
          responseType: 'blob',
        }).then((response) => {
          const url = URL.createObjectURL(new Blob([response.data]));
          const link = document.createElement('a');
          link.href = url;
          link.setAttribute(
            'download',
            `Транзакционный отчёт от ${new Date().toLocaleDateString()}.xls`,
          );
          document.body.appendChild(link);
          link.click();
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
    // back() {
    //   this.items.status_card = '';
    //   this.items.transactions = [];
    // },
  },
};
</script>

<style lang="scss">
@import "@core/scss/vue/libs/vue-select.scss";
@import "@core/scss/vue/libs/vue-flatpicker.scss";
</style>
