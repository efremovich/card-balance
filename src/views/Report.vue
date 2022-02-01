<template>
  <div>
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
            :class="['form-control','mb-0',{'w-100': getWidth === 'xs'}]"
            :config="config"
            @on-change="selectDate" />
        </b-form-group>

        <!-- <export-excel
          class="mt-1 btn btn-primary"
          :data="emptyArr.data.result"
          :fields="columns"
          type="xlsx"
          name="Отчёт.xlsx">
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
      </div>
      <div class="pie-text">
        <div>
          Всего израсходованно за период: <span class="font-weight-bold">{{ transactions }} </span> рублей.
        </div>
        <div
          v-if="resultLength"
          class="mt-1">
          Всего потреблено топлива за период: <span class="font-weight-bold">{{ consumptions }}</span>  литров,
          из них:

          <ul>
            <li
              v-for="(item,index) in consumptionData"
              :key="index">
              {{ item[0] }} : {{ item[1].toFixed(2) }} л.;
            </li>
          </ul>
        </div>
      </div>

      <!-- echart -->
      <div v-if="resultLength">
        <app-echart-doughnut
          class="mt-2 w-100"
          :series="series" />

        <label
          class="mt-2"
          for="labelServices">Выберите вид отчёта:</label>
        <div :class="[{'d-flex align-items-center justify-content-start':selectable==='транзакционный'}]">
          <v-select
            id="labelServices"
            v-model="selectable"
            :class="['w-50',{'w-100': getWidth === 'xs'}]"
            :options="arrReport" />
          <export-excel
            v-if="selectable==='транзакционный'"
            class="ml-1 btn btn-primary"
            :data="emptyArr.data.result"
            :fields="columns"
            type="xlsx"
            name="Отчёт.xlsx">
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
            :filter-included-fields="filterOn">
            <template #cell(date)="row">
              <b-col>
                {{ row.item.date | formatDate }}
              </b-col>
            </template>
          </b-table>
          <!-- <div>
            Всего:
            <template v-for="(item,index) in consumptionData">
              <div
                :key="index">
                {{
                  item[0] }}: {{ item[1].toFixed(2) }}
              </div>
            </template>
          </div> -->
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
        <p>Оперативный</p>
      </div>
    </b-card>
  </div>
</template>

<script>
import {
  BCard, BFormGroup, BTable, BPagination, BCol,
} from 'bootstrap-vue';
import ToastificationContent from '@core/components/toastification/ToastificationContent.vue';
import AppEchartDoughnut from '@core/components/charts/echart/AppEchartDoughnut.vue';
import { mapGetters } from 'vuex';
import { Russian } from 'flatpickr/dist/l10n/ru';
import flatPickr from 'vue-flatpickr-component'; // datapicker
import vSelect from 'vue-select';
import store from '@/store';
import useJwt from '../auth/jwt/useJwt';

export default {
  components: {
    BCard,
    AppEchartDoughnut,
    flatPickr,
    BFormGroup,
    vSelect,
    BTable,
    BPagination,
    BCol,

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
      end: null,
      totalRows: null,
      transactions: {},
      rangeDate: null,
      resultLength: true,
      consumptions: null,
      perPage: 5,
      pageOptions: [3, 5, 10],
      dataReport: [],
      currentPage: 1,
      filterOn: [],
      emptyArr: {},
      consumptionData: {},
      config: {
        mode: 'range',
        maxDate: 'today',
        // defaultDate: ['01-03-2021', 'today'],
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
          key: 'card_number',
          label: 'Номер карты',
          sortable: true,
        },
        {
          key: 'service.label',
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
      series: [
        {
          name: 'Потребление топлива',
          type: 'pie',
          radius: ['60%', '80%'],
          avoidLabelOverlap: false,
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

    }),
    getWidth() {
      return store.getters['app/currentBreakPoint'];
    },
  },
  watch: {
    gotSelectedContract(val) {
      this.getTransactions(val);
      this.contractId = val;
    },
    selectable(val) {
      if (val === 'транзакционный' && this.totalRows < 1) {
        this.resultLength = false;
        this.getToast();
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
    this.end = `${this.isToday()} 00:00:00`;
    this.rangeDate = [this.start, this.end];
    this.rangeDate = [this.start, this.end];
    this.getTransactions(this.contractId);
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
      useJwt.getTransactions(`contract_id=${val}&startDate=${this.start}&endDate=${this.end}`).then((response) => {
        if (response.data.status) {
          this.emptyArr = response.data;
          this.totalRows = this.emptyArr.data.total;
          if (this.emptyArr.data.total > 0) {
            this.resultLength = true;
            this.transactions = (this.emptyArr.data.result.reduce((ac, el) => ac + el.summ, 0).toFixed(2));
            this.consumptions = (this.emptyArr.data.result.reduce((ac, el) => ac + el.quantity, 0).toFixed(2));
            const allLabels = [];
            allLabels.push(this.emptyArr.data.result.map((el) => el.service).map((el) => el.full_name));
            // Для отчета
            const example = [];
            const allCards = [];
            allCards.push(this.emptyArr.data.result.map((el) => el.card_number));
            const arrCards = allCards[0];
            const uniqueCards = new Set(arrCards);
            const arrUniqueCards = Array.from(uniqueCards);
            // eslint-disable-next-line no-plusplus
            for (let i = 0; i < arrUniqueCards.length; i++) {
              // let zero = 0;
              this.emptyArr.data.result.forEach((el) => {
                if (el.card_number === arrUniqueCards[i]) {
                  // zero += el.summ;
                  example.push(el);
                }
              });
            }
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
                  const valueConpumption = consumption;
                  data[name] = value;
                  dataConumption[name] = valueConpumption;
                }
                // return data;
                this.consumptionData = Array.from(Object.entries(dataConumption));

                // this.consumptionData.value = Object.values(dataConumption);
              });
            }

            this.series[0].data = [];
            // eslint-disable-next-line no-plusplus
            for (let i = 0; i < Object.keys(data).length; i++) {
              const label = Object.keys(data);
              const value = Object.values(data);
              const randomObject = {};
              randomObject.value = value[i];
              randomObject.name = label[i];
              this.series[0].data.push(randomObject);
            }
          } else {
            this.transactions = '0';
            this.resultLength = false;
            this.getToast();
          }
        }
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
      this.end = trim[1] + ' 00:00:00';
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

    selectDate() {
      const date = this.rangeDate;
      this.getDate();
      if (date.length > 22) {
        this.getTransactions(this.contractId);
      }
    },
  },

};

</script>

<style lang="scss">
@import "@core/scss/vue/libs/vue-select.scss";
@import "@core/scss/vue/libs/vue-flatpicker.scss";
</style>
