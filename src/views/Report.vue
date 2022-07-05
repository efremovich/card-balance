<template>
  <b-overlay
    :show="download"
    spinner-type="grow"
    spinner-variant="primary"
    spinner-medium
    variant="transparent"
    blur="5px"
    opacity=".75"
    rounded="md">
    <div
      v-if="!download">
      <b-card
        title="Отчёты и графики">
        <div class="w-100">
          <b-form-group
            :class="['w-75',{'w-100': getWidth === 'xs'}]">
            <label
              for="flatPicker"
              class="mt-1">
              Выберете период:
            </label>
            <flat-pickr
              id="flatPicker"
              v-model="rangeDate"
              size="sm"
              :class="['form-control','w-50','mb-0',{'w-100': getWidth === 'xs'}]"
              :config="config"
              @on-change="selectDate" />
          </b-form-group>

        <!-- ПОВЕСИТЬ ПРЕЛОАДЕР -->
        </div>
        <b-overlay
          :show="download"
          spinner-type="grow"
          spinner-variant="primary"
          spinner-medium
          variant="transparent"
          blur="5px"
          opacity=".75"
          rounded="md">
          <div class="d-flex flex-wrap justify-content-between">
            <div
              class="pie-text">
              <div v-if="!download">
                <h5 v-if="!isBudget">
                  Всего израсходованно за период: <code>{{ transactions }}</code> рублей.
                </h5>
              </div>
              <div
                v-if="resultLength"
                class="mt-1">
                <h5 v-if="!download">
                  Всего потреблено топлива за период: <code>{{ consumptions }}</code>  литров,
                  из них:
                </h5>

                <ul v-if="getWidth !=='xs'">
                  <li
                    v-for="(item) in consumptionData"
                    :key="item.id">
                    <h5>
                      {{ item.name }}: <code>{{ item.consumption.toLocaleString() }} л.</code>  <span
                        v-if="!isBudget">на сумму <code>{{ item.value.toLocaleString() }} руб.;</code> </span>
                    </h5>
                  </li>
                </ul>
                <div v-if="getWidth ==='xs'">
                  <div
                    v-for="(item) in consumptionData"
                    :key="item.id">
                    <h6>
                      {{ item.name }}: <code>{{ item.consumption.toLocaleString() }} л.</code>  на сумму <code>{{ item.value.toLocaleString() }} руб.;</code>
                    </h6>
                  </div>
                </div>
              </div>
            </div>
            <div v-if="getWidth !=='xs'">
              <app-echart-doughnut
                v-if="resultLength"
                :series="series" />
            </div>
          </div>
        </b-overlay>
        <!-- echart -->
        <div
          v-if="resultLength && getWidth !=='xs'">
          <label
            class="mt-2"
            for="labelServices">Выберете вид отчёта:</label>
          <div class="flex-column">
            <div class="d-flex w-100 justify-content-between">
              <div :class="['w-75',{'d-flex w-75 align-items-center justify-content-start':selectable!==null},]">
                <v-select
                  id="labelServices"
                  v-model="selectable"
                  :class="['w-50',{'w-100': getWidth === 'xs'}]"
                  :options="arrReport" />
                <b-button
                  v-if="selectable==='транзакционный'"
                  variant="primary"
                  class="ml-2"
                  @click="downloadTransReport">
                  <!-- <feather-icon
                    icon="DownloadCloudIcon" /> -->
                  <span class="align-middle">Скачать</span>
                </b-button>
                <!-- <export-excel
                v-if="selectable==='оперативный'"
                class="ml-1 btn btn-primary"
                :data="dataReport"
                :fields="columnsReport"
                type="xls"
                :name="`Отчёт за период с ${getStartDate} по ${getEndDate}.xls`">
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
              </export-excel> -->
                <b-button
                  v-if="selectable==='оперативный'"
                  variant="primary"
                  class="ml-2"
                  @click="downloadOperReport">
                  <!-- <feather-icon
                    icon="DownloadCloudIcon" /> -->
                  <span class="align-middle">Скачать</span>
                </b-button>
              </div>
              <b-form-group
                v-if="selectable!==null"
                class="mb-0 w-25 ">
                <b-input-group
                  class="d-flex"
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
            </div>
            <div v-if="selectable!==null">
              <div class="w-100">
                <label
                  class="mt-2"
                  for="selectCard">Выберете карту:</label>
                <v-select
                  id="selectCard"
                  v-model="selected"
                  :disabled="selectedHolder !== null"
                  multiple
                  :options="option"
                  class="w-50"
                  @input="onChange" />
                <label
                  class="mt-2"
                  for="selectCard">Выберете держателя:</label>
                <v-select
                  id="selectCard"
                  v-model="selectedHolder"
                  :disabled="selected !== null"
                  multiple
                  :options="holders"
                  class="w-50"
                  @input="getHolder" />
              </div>
            </div>

            <div v-if="selectable==='транзакционный'">
              <b-table
                hover
                responsive
                class="position-relative table-hover text-center mt-1"
                :per-page="perPage"
                :current-page="currentPage"
                :items="emptyArr.data.result"
                :fields="fields"
                :sort-by.sync="sortBy"
                :sort-desc.sync="sortDesc"
                :sort-direction="sortDirection"
                :filter="filter"
                :filter-included-fields="filterOn"
                @filtered="onFiltered">
                <template #cell(date)="row">
                  <b-col>
                    {{ row.item.date | formatDate }}
                  </b-col>
                </template>
              </b-table>
              <b-pagination
                v-model="currentPage"
                :total-rows="totalRows"
                :per-page="perPage"
                first-number
                last-number
                prev-class="prev-item"
                next-class="next-item"
                class="mb-0 mt-1">
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
          </div>
          <div v-if="selectable==='оперативный'">
            <b-table
              hover
              responsive
              class="position-relative table-hover text-center mt-1"
              :per-page="perPage"
              :current-page="currentPage"
              :items="dataReport"
              :fields="fieldsOper"
              :sort-by.sync="sortBy"
              :sort-desc.sync="sortDesc"
              :sort-direction="sortDirection"
              :filter="filter"
              :filter-included-fields="filterOn"
              @filtered="onFiltered">
              <template #cell(Details)="row">
                <b-button
                  variant="gradient-primary"
                  pill
                  size="sm"
                  @click="row.toggleDetails">
                  Детали
                </b-button>
              </template>
              <template #cell(quantity)="row">
                <b-col @click="row.toggleDetails">
                  {{ row.item.quantity.toFixed(2) }}
                </b-col>
              </template>
              <template #cell(holder)="row">
                <b-col @click="row.toggleDetails">
                  {{ row.item.holder }}
                </b-col>
              </template>
              <template #cell(AllSumm)="row">
                <b-col @click="row.toggleDetails">
                  {{ row.item.AllSumm.toFixed(2) }}
                </b-col>
              </template>
              <template #row-details="row">
                <b-table
                  :items="row.item.details[0]"
                  :fields="fieldsDetails"
                  :sort-by.sync="sortBy"
                  :sort-desc.sync="sortDesc">
                  <template #cell(date)="cell">
                    <b-col @click="row.toggleDetails">
                      {{ cell.item.date | formatDate }}
                    </b-col>
                  </template>
                  <b-button
                    class="ml-1"
                    pill
                    size="sm"
                    @click="row.toggleDetails">
                    Детали
                  </b-button>
                </b-table>
                <export-excel
                  class="mt-1 btn btn-primary"
                  :data="row.item.details[0]"
                  :fields="fieldsPrint"
                  :title="`Транзакции по карте по карте № ${row.item.details[0][0].card_number}`"
                  type="xls"
                  :name="`Отчёт по карте № ${row.item.details[0][0].card_number} за период с ${getStartDate} по ${getEndDate}.xls`">
                  <h5 class="text-white">
                    Скачать отчёт по карте № {{ row.item.details[0][0].card_number }}
                  </h5>
                </export-excel>
              </template>
            </b-table>

            <b-pagination
              v-model="currentPage"
              :total-rows="arrUniqueCards"
              :per-page="perPage"
              first-number
              last-number
              prev-class="prev-item"
              next-class="next-item"
              class="mb-0 mt-1">
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
        </div>
      </b-card>
    </div>
    <template #overlay>
      <div class="text-center">
        <feather-icon
          icon="LoaderIcon"
          size="56"
          class="cursor-pointer" />
        <p>
          Идёт загрузка...
        </p>
      </div>
    </template>
  </b-overlay>
</template>

<script>
import {
  BCard, BFormGroup, BTable, BPagination, BCol, BOverlay, BButton, BFormInput, BInputGroupAppend, BInputGroup,
} from 'bootstrap-vue';
import ToastificationContent from '@core/components/toastification/ToastificationContent.vue';
import AppEchartDoughnut from '@core/components/charts/echart/AppEchartDoughnut.vue';
import { mapGetters } from 'vuex';
import { Russian } from 'flatpickr/dist/l10n/ru';
import flatPickr from 'vue-flatpickr-component'; // datapicker
import vSelect from 'vue-select';
import store from '@/store';
import axios from '@axios';
import useJwt from '../auth/jwt/useJwt';

export default {
  components: {
    BCard,
    BFormInput,
    AppEchartDoughnut,
    BInputGroupAppend,
    flatPickr,
    BFormGroup,
    vSelect,
    BTable,
    BPagination,
    BCol,
    BOverlay,
    BButton,
    BInputGroup,
  },
  data() {
    return {
      contractId: null,
      arrReport: ['оперативный', 'транзакционный'],
      selectable: null,
      sortBy: 'date',
      sortDesc: false,
      sortDirection: 'asc',
      contract: null,
      filter: null,
      start: null,
      arrUniqueCards: null,
      end: null,
      selected: [],
      selectedHolder: null,
      download: false,
      totalRows: null,
      transactions: {},
      rangeDate: null,
      resultLength: true,
      consumptions: null,
      operReport: null,
      isBudget: this.$store.state.status,
      option: [],
      holders: [],
      perPage: 5,
      dataDetails: [],
      pageOptions: [3, 5, 10],
      dataReport: [],
      dataTable: [],
      currentPage: 1,
      filterOn: [],
      response: null,
      emptyArr: {},
      consumptionData: [],
      config: {
        mode: 'range',
        maxDate: 'today',
        locale: Russian,
        dateFormat: 'd.m.Y',
      },
      defaultColDef: {
        // sortable: true,
        // filter: true,
        resizable: true,
        minWidth: 100,
        flex: 1,
      },
      // gridApi: null,
      columnApi: null,
      fieldsOper: [
        {
          key: 'number',
          label: 'Номер карты',
          sortable: true,
        },
        {
          key: 'holder',
          label: 'Держатель',
          sortable: true,
        },
        {
          key: 'quantity',
          label: 'Количество',
          sortable: true,
        },
        {
          key: 'AllSumm',
          label: 'Сумма',
          sortable: true,
        },

        {
          key: 'Details',
          label: '',
        },

      ],
      fieldsDetails: [
        {
          key: 'date',
          label: 'Дата',
          sortable: true,
        },

        {
          key: 'service.full_name',
          label: 'Тип топлива',
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
          key: 'pos.address',
          label: 'Адрес',
          sortable: true,
        },

      ],
      fields: [
        {
          key: 'date',
          label: 'Дата',
          sortable: true,
        },
        {
          key: 'card_number',
          label: 'Номер карты',
          sortable: true,
        },
        {
          key: 'service.full_name',
          label: 'Тип топлива',
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
          key: 'pos.address',
          label: 'Адрес',
          sortable: true,
        },

      ],

      fieldsPrint: {

        'Номер карты': {
          field: 'card_number',
        },
        'Держатель': {
          field: 'card_holder',
        },
        'Номер договора': {
          field: 'contract.number',
        },
        'Дата': {
          field: 'date',
        },
        'Вид топлива': {
          field: 'service.full_name',
        },
        'Количество': {
          field: 'quantity',
        },
        'Сумма': {
          field: 'summ',
        },

      },
      columns: {

        'Дата': {
          field: 'date',
        },
        'Товар/услуга': {
          field: 'service.full_name',
        },
        'Количество литров': {
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
      columnsReport: {
        'Номер карты': {
          field: 'number',
        },
        'Количество литров': {
          field: 'quantity',
        },
        'Сумма': {
          field: 'AllSumm',
        },
        'Держатель': {
          field: 'holder',
        },

      },

      series: [
        {
          name: '',
          type: 'pie',
          radius: ['60%', '80%'],
          avoidLabelOverlap: true,
          label: {
            show: true,
          },
          labelLine: {
            show: true,
          },
          data: [
            // { value: 335, name: 'Point One' },
            // { value: 310, name: 'Point Two' },
            // { value: 234, name: 'Point Three' },
            // { value: 435, name: 'Point Four' },
          ],
        },
      ],

    };
  },

  computed: {
    ...mapGetters({
      gotSelectedContract: 'CONTRACT_ID',
      gotStatus: 'STATUS_ORG',

    }),
    getWidth() {
      return store.getters['app/currentBreakPoint'];
    },
    getStartDate() {
      return this.start.slice(0, -8);
    },
    getEndDate() {
      return this.end.slice(0, -8);
    },
  },
  watch: {
    gotSelectedContract(val) {
      this.getTransactions(val);
      this.getAllCards(val);
      this.contractId = val;
    },
    selectable(val) {
      if (val === 'транзакционный' && this.totalRows < 1) {
        this.resultLength = false;
        this.getToast();
      }
      // if (val === 'оперативный') {

      // }
    },
    selectedHolder(val) {
      if (val.length < 1) {
        this.selectedHolder = null;
      }
    },
    selected(val) {
      if (val.length < 1) {
        this.selected = null;
      }
    },

  },

  beforeMount() {
    const userData = JSON.parse(localStorage.getItem('userData'));
    if (userData && this.gotSelectedContract === null) {
      this.contract = userData;
      this.contractId = this.contract.contract.id;
    } else this.contractId = this.gotSelectedContract;
    this.start = `${this.getFirstDay()} 00:00:00`;
    this.end = `${this.isToday()} 23:59:59`;
    this.rangeDate = [this.start, this.end];
    this.getTransactions(this.contractId);
    this.getAllCards(this.contractId);
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

    getTransactions(val) {
      this.rangeDate = [this.start, this.end];

      this.download = true;
      this.dataReport = [];
      this.emptyArr = {};
      useJwt.getTransactions(`contract_id=${val}&startDate=${this.start}&endDate=${this.end}`).then((response) => {
        if (response.data.status) {
          this.emptyArr = response.data;
          this.totalRows = this.emptyArr.data.total;
          if (this.totalRows > 0) {
            this.resultLength = true;
            this.transactions = (this.emptyArr.data.result.reduce((ac, el) => ac + el.summ, 0).toLocaleString());
            this.consumptions = (this.emptyArr.data.result.reduce((ac, el) => ac + el.quantity, 0).toLocaleString());
            const allLabels = [];
            allLabels.push(this.emptyArr.data.result.map((el) => el.service).map((el) => el.full_name));
            // Для отчета
            const allCards = [];
            allCards.push(this.emptyArr.data.result.map((el) => el.card_number));
            const arrCards = allCards[0];
            const uniqueCards = new Set(arrCards);
            const arrUniqueCards = Array.from(uniqueCards);
            this.dataTable = [];
            this.arrUniqueCards = Array.from(uniqueCards).length;
            // eslint-disable-next-line no-plusplus
            for (let i = 0; i < arrUniqueCards.length; i++) {
              const numberObject = {};
              numberObject.details = [];
              numberObject.number = Number(arrUniqueCards[i]);
              this.dataTable.push(this.emptyArr.data.result.filter((el) => (el.card_number) === arrUniqueCards[i]));
              numberObject.AllSumm = this.emptyArr.data.result.filter((el) => (el.card_number) === arrUniqueCards[i]).map((el) => el.summ).reduce((el, acc) => el + acc, 0);
              numberObject.quantity = this.emptyArr.data.result.filter((el) => (el.card_number) === arrUniqueCards[i]).map((el) => el.quantity).reduce((el, acc) => el + acc, 0);
              // eslint-disable-next-line prefer-destructuring
              numberObject.holder = this.emptyArr.data.result.filter((el) => (el.card_number) === arrUniqueCards[i]).map((el) => el.card_holder)[0];
              numberObject.details.push(this.emptyArr.data.result.filter((el) => (el.card_number) === arrUniqueCards[i]));
              this.dataReport.push(numberObject);
            }
            this.download = false;
            // Конец отчёта
            const arr = allLabels[0];
            const uniqueLabel = new Set(arr); // size != length
            const arrLabel = Array.from(uniqueLabel);
            const data = {};
            const dataConumption = {};
            // eslint-disable-next-line no-plusplus
            for (let i = 0; i < arrLabel.length; i++) {
              let zero = 0;
              let consumption = 0;

              this.emptyArr.data.result.forEach((el) => { // необходимо создавать объект на каждое используемое значение вида топлива
                if (el.service.full_name === arrLabel[i]) {
                  zero += (el.summ);
                  consumption += el.quantity;
                  const name = arrLabel[i];
                  const value = zero;
                  data[name] = value;
                  dataConumption[name] = consumption; // объект вида {Вид топлива-Сумма}
                }
              });
            }
            this.consumptionData = [];
            this.series[0].data = [];
            // eslint-disable-next-line no-plusplus
            for (let i = 0; i < Object.keys(data).length; i++) {
              const label = Object.keys(data);
              const value = Object.values(data);
              const consumptionL = Object.values(dataConumption);
              const randomObject = {};
              const anotherRandomObject = {};
              anotherRandomObject.value = value[i];
              anotherRandomObject.name = label[i];
              anotherRandomObject.id = this.getRandom();
              anotherRandomObject.consumption = consumptionL[i];
              randomObject.value = Number(value[i]).toFixed(2);
              randomObject.name = label[i];
              this.series[0].data.push(randomObject);
              this.consumptionData.push(anotherRandomObject);
            }
          } else {
            this.download = false;
            this.transactions = '0';
            this.resultLength = false;
            this.getToast();
          }
        }
      });
    },
    getDate() {
      const date = this.rangeDate;
      if (date.length === 10) {
        this.start = `${date} 00:00:00`;
        // eslint-disable-next-line prefer-template
        this.end = date + ' 23:59:59';
      } else {
        const newDate = Array.from(date).filter((n) => n !== '—');
        const arr = newDate.join('').split('00:00:00');
        const trim = arr.join('').split(' ').filter((n) => n !== '');
        // eslint-disable-next-line prefer-template
        this.start = trim[0] + ' 00:00:00';
        // eslint-disable-next-line prefer-template
        this.end = trim[1] + ' 23:59:59';
      }
    },
    getToast() {
      this.$toast({
        component: ToastificationContent,
        props: {
          title: 'Отсутствуют транзакции за выбранный период',
          icon: 'AlertTriangleIcon',
          variant: 'danger',
        },
      });
    },
    onFiltered(filteredItems) {
      this.download = true;
      // Trigger pagination to update the number of buttons/pages due to filtering
      this.totalRows = filteredItems.length;
      this.currentPage = 1;
      this.download = false;
    },
    selectDate() {
      //  const date = this.rangeDate;
      this.getDate();
      // if (date.length > 22) {
      //   this.getTransactions(this.contractId);
      // }
      if (this.rangeDate.length > 22) {
        const date = this.rangeDate;
        const newDate = Array.from(date).filter((n) => n !== '—');
        const arr = newDate.join('').split('00:00:00');
        const trim = arr.join('').split(' ').filter((n) => n !== '');
        // eslint-disable-next-line prefer-template
        this.start = trim[0] + ' 00:00:00';
        // eslint-disable-next-line prefer-template
        this.end = trim[1] + ' 23:59:59';
        this.getTransactions(this.contractId);
      }
      if (this.rangeDate.length > 9 && this.rangeDate.length < 11) { // Указание одной и той же даты при выборе
        const date = this.rangeDate;
        // eslint-disable-next-line prefer-template
        this.start = date + ' 00:00:00';
        // eslint-disable-next-line prefer-template
        this.end = date + ' 23:59:59';
        this.getTransactions(this.contractId);
      }
    },
    getRandom() {
      return Math.floor(Math.random() * 10000);
    },

    getAllCards(val) {
      this.option = [];
      this.holders = [];
      useJwt.getCards(val).then((response) => {
        if (response.data.status) {
          this.response = response.data;
          this.response.cards.forEach((el) => {
            this.option.push(el.number);
          });
          this.response.holders.forEach((el) => {
            this.holders.push(el.holder);
          });
        }
      });
    },
    downloadOperReport() {
      const date = this.rangeDate;
      const newDate = Array.from(date).filter((n) => n !== '—');
      const arr = newDate.join('').split('00:00:00');
      const trim = arr.join('').split(' ').filter((n) => n !== '');
      // eslint-disable-next-line prefer-template
      this.start = trim[0] + ' 00:00:00';
      // eslint-disable-next-line prefer-template
      this.end = trim[1] + ' 23:59:59';
      if (this.selected === null) {
        axios.get(`/api/getOperReport?contract_id=${this.contractId}&startDate=${this.start}&endDate=${this.end}&card_number=${this.selected}`, {
          responseType: 'blob',
        }).then((response) => {
          const url = URL.createObjectURL(new Blob([response.data]));
          const link = document.createElement('a');
          link.href = url;
          link.setAttribute(
            'download',
            `Оперативный отчёт от ${new Date().toLocaleDateString()}.xlsx`,
          );
          document.body.appendChild(link);
          link.click();
        });
      } else {
        axios.get(`/api/getOperReport?contract_id=${this.contractId}&startDate=${this.start}&endDate=${this.end}`, {
          responseType: 'blob',
        }).then((response) => {
          const url = URL.createObjectURL(new Blob([response.data]));
          const link = document.createElement('a');
          link.href = url;
          link.setAttribute(
            'download',
            `Оперативный отчёт от ${new Date().toLocaleDateString()}.xlsx`,
          );
          document.body.appendChild(link);
          link.click();
        });
      }
    },
    onChange() {
      console.log(this.selected);
      useJwt.getTransactions(`contract_id=${this.contractId}&startDate=${this.start}&endDate=${this.end}&card_number=${this.selected}`).then((response) => {
        if (response.data.status) {
          this.emptyArr = response.data;
          this.totalRows = this.emptyArr.data.total;
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
    },
    getHolder() {
      useJwt.getTransactions(`contract_id=${this.contractId}&startDate=${this.start}&endDate=${this.end}&card_holder=${this.selectedHolder}`).then((response) => {
        if (response.data.status) {
          this.emptyArr = response.data;
          this.totalRows = this.emptyArr.data.total;
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
      if (this.selected !== null) {
        axios.get(`api/getTransReport?contract_id=${this.contractId}&startDate=${this.start}&endDate=${this.end}&card_number=${this.selected}`, {
          responseType: 'blob',
        }).then((response) => {
          const url = URL.createObjectURL(new Blob([response.data]));
          const link = document.createElement('a');
          link.href = url;
          link.setAttribute(
            'download',
            `Транзакционный отчёт от ${new Date().toLocaleDateString()}.xlsx`,
          );
          document.body.appendChild(link);
          link.click();
        });
      } else {
        axios.get(`/api/getTransReport?contract_id=${this.contractId}&startDate=${this.start}&endDate=${this.end}`, {
          responseType: 'blob',
        }).then((response) => {
          const url = URL.createObjectURL(new Blob([response.data]));
          const link = document.createElement('a');
          link.href = url;
          link.setAttribute(
            'download',
            `Транзакционный отчёт от ${new Date().toLocaleDateString()}.xlsx`,
          );
          document.body.appendChild(link);
          link.click();
        });
      }
    },
  },
};

</script>

<style lang="scss">
@import "@core/scss/vue/libs/vue-select.scss";
@import "@core/scss/vue/libs/vue-flatpicker.scss";
</style>
