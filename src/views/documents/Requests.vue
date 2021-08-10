<template>
  <div>
    <b-card title="Заявки">
      <b-card-body>
        <div class="d-flex justify-content-between  flex-wrap  align-items-end">
          <b-form-group
            label-align-sm="left"
            label-size="sm"
            label-for="filterInput"
            class="mb-1">
            <p class="mt-1">
              История заявок за период:
            </p>
            <flat-pickr
              v-model="rangeDate"
              size="sm"
              class="form-control mb-0"
              :config="config"
              @on-change="selectDate" />

            <div
              class="d-flex flex-column">
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
        :item="request"
        responsive
        :per-page="perPage"
        :current-page="currentPage"
        class="position-relative table-hover text-center"
        :fields="fields" />
    </b-card>
  </div>
</template>

<script>
import {
  BCard, BTable, BFormGroup,
  BFormInput, BCardBody, BButton, BInputGroup, BInputGroupAppend, BOverlay, BSpinner,
} from 'bootstrap-vue';
import vSelect from 'vue-select';
import { mapGetters } from 'vuex';
import flatPickr from 'vue-flatpickr-component';
import { Russian } from 'flatpickr/dist/l10n/ru';
import ToastificationContent from '@core/components/toastification/ToastificationContent.vue';
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
    vSelect,
    BOverlay,
    BSpinner,

  },
  data() {
    return {
      perPage: 5,
      pageOptions: [3, 5, 10],
      totalRows: null,
      rangeDate: [],
      contract: null,
      contractId: null,
      selected: null,
      start: null,
      end: null,
      filter: null,
      option: [],
      currentPage: 1,
      request: null,
      config: {
        mode: 'range',
        maxDate: 'today',
        locale: Russian,
        dateFormat: 'd.m.Y',
      },
      fields: [
        {
          key: 'UpdatedAt',
          label: 'Дата заявки',
          sortable: true,
        },
        {
          key: 'request_status.name',
          label: 'Статус заявки',
          sortable: true,
        },
        {
          key: 'request_type.name',
          label: 'Тип заявки',
          sortable: true,
        },
        {
          key: 'card_number',
          label: 'Номер карты',
          sortable: true,
        },
      ],

    };
  },
  computed: {
    ...mapGetters({
      // gotSelected: 'CONTRACT_NUMBER',
      gotSelectedContract: 'CONTRACT_ID',
    }),
  },
  watch: {
    gotSelectedContract(val) {
      this.getAllCards(val);
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

    unique(arr) {
      this.arr = Array.from(new Set(arr));
      return this.arr;
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
        // console.log('Карт: ', this.option);
        this.option = this.unique(this.option);
      });
    },

    selectDate() {
      const date = this.rangeDate;
      const newDate = Array.from(date).filter((n) => n !== '—');
      const arr = (newDate.join('').split('  '));
      // eslint-disable-next-line prefer-template
      this.start = arr[0] + ' 00:00:00';
      // eslint-disable-next-line prefer-template
      this.end = arr[1] + ' 00:00:00';
      const ID = this.contractId;
      useJwt.GetRequests(`contract_id=${ID}&startDate=${this.start}&endDate=${this.end}&card_number=7824861010051464017`).then((response) => {
        if (response.data.status) {
          this.request = response.data;
          // console.log(this.request);
          if (this.rangeDate.length > 10 && this.request.data.length < 1) {
            this.$toast({
              component: ToastificationContent,
              props: {
                title: 'Отсутвуют заявки за выбранный период',
                icon: 'AlertTriangleIcon',
                variant: 'danger',
              },
            });
          }
        }
      });
    },
  },

};
</script>

<style lang="sccs">
</style>
