<template>
  <b-overlay
    :show="!loadDone"
    spinner-type="grow"
    spinner-variant="primary"
    spinner-medium
    variant="transparent"
    blur="5px"
    opacity=".75"
    rounded="md">
    <div v-if="loadDone">
      <b-card>
        <h3> Платежи за период с {{ getStartDate }} по {{ getEndDate }} составляют  <span class="text-success">{{ (requests.data.result.reduce((ac,el)=>ac+el.summ,0)).toLocaleString() }}</span> рублей.</h3>
        <b-card-body>
          <div class="d-flex justify-content-between flex-wrap align-items-end">
            <b-form-group
              label-align-sm="left"
              label-size="sm"
              label-for="filterInput"
              class="mb-1">
              <p class="mt-1">
                История платежей за период:
              </p>
              <flat-pickr
                v-model="rangeDate"
                size="sm"
                class="form-control mb-0"
                :config="config"
                @on-change="selectDate" />
            </b-form-group>

            <!-- filter -->
            <b-form-group

              class="mt-2">
              <b-input-group size="sm">
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
        </b-card-body>

        <b-table
          hover
          :items="requests.data.result"
          responsive
          :filter="filter"
          :sort-by.sync="sortBy"
          :per-page="perPage"
          :current-page="currentPage"
          class="position-relative table-hover text-center"
          :fields="fields">
          <template
            #cell(date)="row">
            <b-col>
              {{ row.item.date | formatDateNoTime }}
            </b-col>
          </template>
        </b-table>
      </b-card>
    </div>
  </b-overlay>
</template>

<script>
import {
  BCard, BTable, BFormGroup,
  BFormInput, BCardBody, BButton, BInputGroup, BInputGroupAppend, BOverlay, BCol,
} from 'bootstrap-vue';
import { mapGetters } from 'vuex';
import flatPickr from 'vue-flatpickr-component';
import { Russian } from 'flatpickr/dist/l10n/ru';
import ToastificationContent from '@core/components/toastification/ToastificationContent.vue';
import { formatDate } from '../../@core/utils/filter';
import useJwt from '../../auth/jwt/useJwt';

export default {
  components: {
    BCard,
    flatPickr,
    BTable,
    BFormGroup,
    BFormInput,
    BCardBody,
    BButton,
    BInputGroup,
    BInputGroupAppend,

    BOverlay,

    BCol,
  },
  data() {
    return {
      loadDone: false,
      perPage: 5,
      pageOptions: [3, 5, 10],
      totalRows: null,
      rangeDate: [],
      contract: null,
      contractId: null,
      selected: null,
      sortBy: 'date',
      start: null,
      end: null,
      filter: null,
      currentPage: 1,
      requests: null,
      config: {
        mode: 'range',
        maxDate: 'today',
        locale: Russian,
        dateFormat: 'd.m.Y',
      },
      fields: [
        {
          key: 'number',
          label: 'Номер п/п',
          sortable: true,
        },
        {
          key: 'reason_for',
          label: 'Назначение платежа',
          sortable: true,
        },
        {
          key: 'date',
          label: 'Дата платежа',
          sortable: true,
        },
        {
          key: 'summ',
          label: 'Сумма',
          sortable: true,
        },
      ],
      formatDate,

    };
  },
  computed: {
    ...mapGetters({
      gotSelectedContract: 'CONTRACT_ID',
    }),
    getStartDate() {
      return this.start.slice(0, -8);
    },
    getEndDate() {
      return this.end.slice(0, -8);
    },
  },
  watch: {
    gotSelectedContract(val) {
      this.contractId = val;
      this.getPayments(val, this.start, this.end);
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
    // this.getAllCards(this.contractId);
    // useJwt.getPayments(`contract_id=${this.contractId}&startDate=${this.start}&endDate=${this.end}`).then((response) => {
    //   if (response.data.status) {
    //     this.requests = response.data;
    //     if (this.requests.data.result < 1) {
    //       this.$toast({
    //         component: ToastificationContent,
    //         props: {
    //           title: 'Отсутствуют платежи за выбранный период',
    //           icon: 'AlertTriangleIcon',
    //           variant: 'danger',
    //         },
    //       });
    //     }
    //   }
    this.getPayments(this.contractId, this.start, this.end);
    // });
    this.loadDone = true;
  },
  methods: {
    isToday() {
      const today = new Date();
      return today.toLocaleDateString();
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
    getPayments(contract, start, end) {
      useJwt.getPayments(`contract_id=${contract}&startDate=${start}&endDate=${end}`).then((response) => {
        if (response.data.status) {
          this.requests = response.data;
          if (this.requests.data.result < 1) {
            this.$toast({
              component: ToastificationContent,
              props: {
                title: 'Отсутствуют платежи за выбранный период',
                icon: 'AlertTriangleIcon',
                variant: 'danger',
              },
            });
          }
        }
      });
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
          useJwt.getPayments(`contract_id=${this.contractId}&startDate=${this.start}&endDate=${this.end}`).then((response) => {
            this.requests = response.data;
            this.totalRows = this.requests.data.total;
            if (this.rangeDate.length > 22) {
              if (this.totalRows < 1) {
                this.$toast({
                  component: ToastificationContent,
                  props: {
                    title: 'Отсутствуют платежи за выбранный период',
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
  },

};
</script>

<style lang="scss">
@import "@core/scss/vue/libs/vue-flatpicker.scss";
</style>
