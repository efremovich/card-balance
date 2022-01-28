<template>
  <div>
    <b-card
      title="Отчёты и графики">
      <b-form-group class="w-50">
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
      <div class="pie-text text-left">
        <h2 class="font-weight-bolder" />
        <span class="font-weight-bold"> Всего израсходованно за период: {{ transactions }} рублей.</span>
      </div>

      <!-- echart -->
      <app-echart-doughnut
        :series="series" />
    </b-card>
  </div>
</template>

<script>
import { BCard, BFormGroup } from 'bootstrap-vue';
import AppEchartDoughnut from '@core/components/charts/echart/AppEchartDoughnut.vue';
import { mapGetters } from 'vuex';
import { Russian } from 'flatpickr/dist/l10n/ru';
import flatPickr from 'vue-flatpickr-component'; // datapicker
import useJwt from '../auth/jwt/useJwt';

export default {
  components: {
    BCard,
    AppEchartDoughnut,
    flatPickr,
    BFormGroup,

  },
  data() {
    return {
      contractId: null,
      contract: null,
      start: null,
      end: null,
      transactions: {},
      rangeDate: null,
      emptyArr: {},
      costOfAllPurchases: null,
      config: {
        mode: 'range',
        maxDate: 'today',
        // defaultDate: ['01-03-2021', 'today'],
        locale: Russian,
        dateFormat: 'd.m.Y',
      },
      series: [
        {
          name: 'Потребление топлива',
          type: 'pie',
          radius: ['50%', '70%'],
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
  },
  watch: {
    gotSelectedContract(val) {
      this.getTransactions(val);
      this.contractId = val;
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
          if (this.emptyArr.data.total > 0) {
            this.transactions = (this.emptyArr.data.result.reduce((ac, el) => ac + el.summ, 0).toFixed(2));
            const allLabels = [];
            allLabels.push(this.emptyArr.data.result.map((el) => el.service).map((el) => el.full_name));
            const arr = allLabels[0];
            const uniqueLabel = new Set(arr); // size != length
            const arrLabel = Array.from(uniqueLabel);
            const data = {};
            // eslint-disable-next-line no-plusplus
            for (let i = 0; i < arrLabel.length; i++) {
              let zero = 0;
              this.emptyArr.data.result.forEach((el) => { // необходимо создавать объект на каждое используемое значение вида топлива
                if (el.service.full_name === arrLabel[i]) {
                  zero += (el.summ);
                  const name = arrLabel[i];
                  const value = zero;
                  data[name] = value;
                }
                return data;
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
          } else this.transactions = '0';
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
  @import "@core/scss/vue/libs/vue-flatpicker.scss";
</style>
