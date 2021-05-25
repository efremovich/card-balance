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
        :fields="fields">
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
          <b-col @click="row.toggleDetails" />
        </template>

        <template #row-details="row">
          <b-card
            @click="row.toggleDetails">
            <b-row class="mb-2">
              <b-col
                md="4"
                class="mb-1">
                <strong>Дата/время : </strong>
              </b-col>
              <b-col
                md="4"
                class="mb-1">
                <strong>Количество : </strong>{{ }}
              </b-col>
              <b-col
                md="4"
                class="mb-1">
                <strong>услуга : </strong>
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
          class="text-nowrap mb-md-0">
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
    </b-card>
  </div>
</template>

<script>
import {
  BCard, BTable, BFormGroup,
  BFormInput, BCardBody, BButton, BInputGroup, BInputGroupAppend, BOverlay, BSpinner, BPagination, BFormSelect,
} from 'bootstrap-vue';
import vSelect from 'vue-select';
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
    BPagination,
    BFormSelect,

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
          this.busy = false;
          this.response.cards.forEach((el) => {
            this.option.push(el.number);
          });
        }
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
          console.log(this.request);
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
