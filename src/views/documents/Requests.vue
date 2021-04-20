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
          </b-form-group>
          <!-- filter -->
          <b-form-group
            label="Найти"
            label-cols-sm="2"
            label-align-sm="left"
            label-size="sm"
            label-for="filterInput"
            class="mt-2">
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
        </div>
      </b-card-body>

      <b-table
        :sticky-header="stickyHeader"
        :no-border-collapse="noCollapse"
        hover
        responsive
        class="position-relative table-hover"

        :fields="fields">
        <!--1-й вариант-->

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
    </b-card>
  </div>
</template>

<script>
import {
  BCard, BTable, BFormGroup,
  BFormInput, BCardBody, BButton, BInputGroup, BInputGroupAppend,
} from 'bootstrap-vue';
import flatPickr from 'vue-flatpickr-component';
import { Russian } from 'flatpickr/dist/l10n/ru';

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

  },
  data() {
    return {
      rangeDate: null,
      contract: null,
      contractId: null,
      start: null,
      end: null,
      filter: null,
      config: {
        mode: 'range',
        maxDate: 'today',
        locale: Russian,
        dateFormat: 'd.m.Y',
      },
      fields: ['№ п/п', 'Номер карты', 'Держатель', 'Операция', 'Статус/Дата'],

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
  },
};
</script>

<style lang="sccs">
</style>
