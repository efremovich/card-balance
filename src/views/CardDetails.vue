/* eslint-disable vue/no-use-v-if-with-v-for */
<template>
  <div>
    <b-card title="Настройка карты">
      <b-card-header>
        <b-link :to="{ name: 'cards' }">
          <b-img
            v-b-tooltip.hover.top="'Назад к списку карт'"
            class="icon"
            src="../assets/images/icons/arrow.svg">
            <!-- getImage(product.emitent.code)"  -->
            <!-- require(`../assets/images/cards-icon/${product.emitent.code}.svg`) -->
          </b-img>
        </b-link>
      </b-card-header>
      <div class="d-flex flex-wrap justify-content-between">
        <div class="image">
          <b-img
            class="card-img-top"
            :src="
              require(`../assets/images/cards-icon/${date.data.emitent.code}.svg`)
            ">
            <!-- getImage(product.emitent.code)"  -->
            <!-- require(`../assets/images/cards-icon/${product.emitent.code}.svg`) -->
          </b-img>

          <div class="item-wrapper">
            <h6 class="item-price">
              PIN: {{ date.data.pin }}
            </h6>
            <h5 class="item-price">
              {{ date.data.number }}
            </h5>
          </div>
          <div class="holder">
            <h6 class="ml-1">
              Держатель:
            </h6>
            <b-form-input
              :value="date.data.holder" />
          </div>
        </div>
        <div
          class="d-flex flex-column align-items-start justify-content-start heigth ml-1 mt-2">
          <b-button
            variant="danger"
            class="btn mb-2"
            @click="handleCartActionClick(product)">
            Заблокировать карту
            <feather-icon
              icon="LockIcon"
              class="mr-50" />
          </b-button>
          <div class="mb-2">
            <h6>Выдана: {{ date.data.limits[0].CreatedAt | formatDate }}</h6>
          </div>
          <div class="mb-2">
            <h6>
              Действует до: {{ date.data.limits[0].CreatedAt | formatDate }}
            </h6>
          </div>
          <div class="mb-2">
            <h6>
              Последнее изменения:<br>
              {{ date.data.emitent.last_updated | formatDate }}
            </h6>
          </div>
        </div>
        <!-- <div class="appex">
            <vue-apex-charts
              type="radialBar"
              height="325"
              :options="productOrdersRadialBar.chartOptions"
              :series="productOrdersRadialBar.series" /> -->

        <!-- chart info -->
        <!-- <div
              v-for="(data,key,index) in date.data"
              :key="key"
              class="d-flex justify-content-between"
              :class="index === Object.keys(chartInfo.chartInfo).length - 1 ? '':'mb-1'">
              <div class="series-info d-flex align-items-center">
                <feather-icon
                  icon="CircleIcon"
                  size="16"
                  :class="key === 'finished' ? 'text-primary': key==='pending'?'text-warning':'text-danger'" />
                <span class="font-weight-bold text-capitalize ml-75">{{ key }}</span>
              </div>
              <span>{{ data }}</span>
            </div> -->
        <!-- </div> -->
      </div>
      <b-tabs
        content-class="pt-1"
        fill>
        <b-tab
          active
          title="Лимиты">
          <div class="d-flex flex-nowrap">
            <b-col
              md="6"
              class="p-0">
              <template v-for="(item, index) in date.data.limits">
                <b-card-actions
                  v-if="item.limit_commons.length > 1"
                  :key="index"
                  no-body
                  action-close
                  class="border p-1">
                  <v-select
                    v-model="selected"
                    multiple
                    :reduce="(service) => service.id"
                    label="full_name"
                    :options="services" />
                  <div class="d-flex flex-wrap align-items-baseline mt-1">
                    <h6 class="mx-auto">
                      Лимит
                    </h6>

                    <div class="ml-1 mw-20">
                      <b-form-input :value="item.value" />
                    </div>
                    <b-col class="mr-1">
                      <v-select
                        :value="item.limit_unit_code"
                        :reduce="(zalupa) => zalupa.code"
                        :options="units" />
                    </b-col>
                    <b-col>
                      <v-select
                        :value="item.limit_period_code"
                        :reduce="(period) => period.code"
                        :options="periods" />
                    </b-col>
                  </div>
                  <div class="mt-1">
                    <label>Остаток: {{ item.value - item.consumption }} л.</label>
                    <b-progress
                      :value="item.value - item.consumption"
                      :max="item.value" />
                  </div>
                </b-card-actions>
                <b-card-actions
                  v-if="item.limit_commons.length < 2"
                  :key="index"
                  no-body
                  action-close
                  class="border p-1">
                  <v-select
                    v-model="selected[index]"
                    multiple
                    :reduce="(service) => service.id"
                    label="full_name"
                    :options="services" />
                  <div class="d-flex flex-wrap align-items-baseline mt-1">
                    <h6 class="mx-auto">
                      Лимит
                    </h6>

                    <div class="ml-1 mw-20">
                      <b-form-input :value="item.value" />
                    </div>
                    <b-col class="mr-1">
                      <v-select
                        :value="item.limit_unit_code"
                        :reduce="(zalupa) => zalupa.code"
                        :options="units" />
                    </b-col>
                    <b-col>
                      <v-select
                        :value="item.limit_period_code"
                        :reduce="(period) => period.code"
                        :options="periods" />
                    </b-col>
                  </div>
                  <div class="mt-1">
                    <label>Остаток: {{ item.value - item.consumption }} л.</label>
                    <b-progress
                      :value="item.value - item.consumption"
                      :max="item.value" />
                  </div>
                </b-card-actions>
              </template>
            </b-col>
            <b-col
              md="6"
              class="border ml-1">
              <b-card-actions
                ref="cardAction"
                @refresh="refreshStop('cardAction')">
                <h4>Текущие лимиты по карте:</h4>
                <hr>
                <template v-for="(el,index) in date.data.limits">
                  <div
                    v-if="date.data.limits.length>0 && el.limit_commons.length < 2"
                    :key="index">
                    <h4>
                      Вид топлива: {{ selected[index] }}.
                    </h4>
                    <h4>Лимит: {{ periodLabel[el.limit_period_code] }}.</h4>
                    <h4>Остаток: {{ el.value - el.consumption }} литров.</h4>
                    <hr>
                  </div>

                  <div
                    v-if="el.limit_commons.length >1 && date.data.limits.length <2 && date.data.limits.length>0"
                    :key="el.number">
                    <h4>
                      Вид топлива: {{ selected }}.
                    </h4>
                    <h4>Лимит: {{ periodLabel[el.limit_period_code] }}.</h4>
                    <h4>Остаток: {{ el.value - el.consumption }} литров.</h4>
                    <hr>
                  </div>
                </template>
                <!-- <template v-for="(i,index) in item.limit_commons">
                  <div
                    v-if="i.limit_commons.length > 1"
                    :key="index">
                    <h4>
                      Вид топлива:  {{ labelService[selected[index]] }}.
                    </h4>
                    <h4>Лимит: {{ periodLabel[el.limit_period_code] }}.</h4>
                    <h4>Остаток: {{ el.value - el.consumption }} литров.</h4>
                    <hr>
                  </div>
                </template> -->
              </b-card-actions>
            </b-col>
          </div>
        </b-tab>
        <b-tab title="Транзакции">
          <h4
            v-if="totalRows < 1"
            class="text-center">
            Транзакции по карте №{{ product }} за период c
            {{ firstDayOfMonth }} по {{ lastDay }} отсутствуют
          </h4>
          <div v-if="totalRows > 0">
            <b-card>
              <div class="d-flex justify-content-between flex-wrap">
                <!-- filter -->
                <b-form-group
                  label-align-sm="left"
                  label-size="sm"
                  label-for="filterInput"
                  class="mb-0">
                  <b-input-group size="sm">
                    <b-form-input
                      id="filterInput"
                      v-model="filter"
                      type="search"
                      placeholder="Найти" />
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
                    :data="transactions.data"
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
                      <path
                        d="M5.884 6.68a.5.5 0 1 0-.768.64L7.349 10l-2.233 2.68a.5.5 0 0 0 .768.64L8 10.781l2.116 2.54a.5.5 0 0 0 .768-.641L8.651 10l2.233-2.68a.5.5 0 0 0-.768-.64L8 9.219l-2.116-2.54z" />
                      <path
                        d="M14 14V4.5L9.5 0H4a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2zM9.5 3A1.5 1.5 0 0 0 11 4.5h2V14a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1h5.5v2z" />
                    </svg>
                    Скачать
                  </export-excel>
                </div>
              </div>
            </b-card>
            <h6 class="text-center mb-1 mt-1">
              Транзакции по карте №{{ product }} за период c
              <code>{{ firstDayOfMonth }}</code>по <code>{{ lastDay }}</code>:
            </h6>
            <b-table
              striped
              hover
              responsive
              class="position-relative"
              :per-page="perPage"
              :current-page="currentPage"
              :items="transactions.data"
              :fields="fields"
              :sort-by.sync="sortBy"
              :filter="filter"
              :filter-included-fields="filterOn">
              <template #cell(date)="row">
                {{ row.item.date | formatDate }}
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
                class="text-nowrap mb-md-0 mr-2 pr-2">
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
          </div>
        </b-tab>
        <b-tab title="События" />
        <b-tab title="Сообщить о проблеме" />
      </b-tabs>
    </b-card>
  </div>
</template>

<script>
import {
  BCard,
  BImg,
  BTabs,
  BProgress,
  BCol,
  BTab,
  BFormInput,
  BButton,
  BTable,
  BPagination,
  BCardBody,
  BFormGroup,
  BFormSelect,
  BInputGroup,
  BLink,
  BCardHeader,
  VBTooltip,
  BInputGroupAppend,
} from 'bootstrap-vue';
import vSelect from 'vue-select';
import BCardActions from '@core/components/b-card-actions/BCardActions.vue';
import { ref } from '@vue/composition-api';
import { useRouter } from '../@core/utils/utils';
import useJwt from '../auth/jwt/useJwt';
// import { formatDate } from '../@core/utils/filter';
// import VueApexCharts from 'vue-apexcharts';
export default {
  directives: {
    'b-tooltip': VBTooltip,
  },
  components: {
    BCard,
    BImg,
    BTabs,
    BTab,
    BButton,
    BCardBody,
    BCol,
    BLink,
    vSelect,
    // VueApexCharts,
    // formatDate,
    BCardActions,
    BFormGroup,
    BFormInput,
    BTable,
    BFormSelect,
    // flatPickr,
    BPagination,
    BInputGroup,
    BProgress,
    BInputGroupAppend,
    BCardHeader,
  },
  setup() {
    // const { handleCartActionClick, toggleProductInWishlist } = useEcommerceUi();
    const date = ref(null);
    const product = ref(null);
    const value = ref(null);
    const totalRows = ref(null);
    const transactions = ref([]);
    const option = ref([]);
    const loadDone = ref(false);
    const lastDay = ref(null);
    const firstDayOfMonth = ref(null);
    const labelService = ref({});
    const perPage = 5;
    const selected = ref([]);
    const pageOptions = [3, 5, 10];
    const currentPage = 1;
    const filter = ref(null);
    const units = ref([]);
    const periods = ref([]);
    const services = ref([]);
    const quantity = ref(null);
    const start = ref(null);
    const end = ref(null);
    const contractId = ref(null);
    const fields = [
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
    ];

    const periodLabel = {
      DAY: 'Суточный',
      WEEK: 'Недельный',
      MONTH: 'Месячный',
      QUARTER: 'Квартальный',
      HALFYEAR: 'Полугодовой',
      YEAR: 'Годовой',
    };
    const columns = {
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
    };
    const isToday = () => {
      const today = new Date();
      return today.toLocaleDateString();
    };
    const getFirstDay = () => {
      const newDate = new Date();
      const firstDay = new Date(
        newDate.getFullYear(),
        newDate.getMonth(),
        1,
      ).toLocaleDateString();
      return firstDay;
    };
    const getAllService = () => {
      useJwt.getService().then((response) => {
        if (response.data.status) {
          services.value = response.data.data;
          services.value.forEach((el) => option.value.push(el.full_name));
          const id = services.value.map((el) => el.id);
          const label = services.value.map((el) => el.label);
          // eslint-disable-next-line no-plusplus
          for (let i = 0; i < id.length; i++) {
            labelService.value[id[i]] = label[i];
          }
        }
      });
    };

    const getAllTransactions = () => {
      firstDayOfMonth.value = getFirstDay();
      lastDay.value = isToday();
      const userData = JSON.parse(localStorage.getItem('userData'));
      if (userData) {
        const contract = userData;
        contractId.value = contract.contract.id;
        start.value = `${getFirstDay()} 00:00:00`;
        end.value = `${isToday()} 00:00:00`;
        loadDone.value = true;
        useJwt
          .getTransactions(
            `contract_id=${contractId.value}&startDate=${start.value}&endDate=${end.value}&card_number=${product.value}`,
          )
          .then((response) => {
            if (response.data.status) {
              transactions.value = response.data;
              totalRows.value = transactions.value.data.length;
            }
            loadDone.value = false;
            return transactions.value;
          });
      }
    };

    const getAllPeriods = () => {
      useJwt.getAllPeriods().then((response) => {
        if (response.data.status) {
          periods.value = response.data.data;
        }
      });
    };
    const getAllUnits = () => {
      useJwt.getAllUnits().then((response) => {
        if (response.data.status) {
          units.value = response.data.data;
        }
      });
    };
    const cardDate = (params) => useJwt.getCardDate(params).then((response) => {
      if (response.data.status) {
        date.value = response.data;
        console.log(date.value);
        const limitCommons = ref([]);
        date.value.data.limits.forEach((el) => limitCommons.value.push(el.limit_commons));
        // eslint-disable-next-line no-plusplus
        for (let i = 0; i < limitCommons.value.length; i++) {
          // eslint-disable-next-line no-plusplus
          for (let j = 0; j < limitCommons.value[i].length; j++) {
            selected.value.push(limitCommons.value[i][j].service_id);
          }
        }
      }
    });

    const textSelected = () => {
      const array = Array.from(selected.value);
      const b = [];
      // eslint-disable-next-line no-plusplus
      for (let q = 0; q < array.length; q++) {
        b.push(selected.value[q]);
      }
      console.log(b);
    };
    // Remote Data
    const fetchProduct = () => {
      // Get product  id from URL
      const { route } = useRouter();
      const productSlug = route.value.params.card_number;
      product.value = productSlug;
      cardDate(productSlug);
    };

    getAllTransactions();
    getAllService();
    getAllPeriods();
    getAllUnits();
    fetchProduct();
    textSelected();

    // cardDate();
    // label();
    return {
      product,
      date,
      value,
      transactions,
      totalRows,
      columns,
      textSelected,
      labelService,
      fields,
      end,
      start,
      perPage,
      pageOptions,
      currentPage,
      filter,
      getFirstDay,
      lastDay,
      firstDayOfMonth,
      option,
      selected,
      quantity,
      units,
      periods,
      services,
      periodLabel,
    };
  },
};
</script>

<style lang="scss">
@import "@core/scss/vue/libs/vue-select.scss";
@import "@core/scss/vue/libs/vue-flatpicker.scss";
</style>

<style lang="scss" scoped>
.card {
  display: flex;
  flex-wrap: wrap;
  justify-content: end;
  max-width: 95%;
  align-items: left;
  padding: 3px;
}
.border {
  border: 1px solid black;
  border-radius: 5px;
}
.mw-20 {
  max-width: 20%;
}
.icon {
  max-width: 30px;
  cursor: pointer;
  padding: 0 !important;
}
.card-header {
  padding: 1.5rem 0 !important;
}
.card-title {
  margin-bottom: 0.5rem !important;
}
.b-overlay-wrap:not(:last-child) {
  margin-bottom: 1rem !important;
}
.col {
  padding-right: 0 !important;
  padding-left: 0 !important;
}
.heigth {
  height: 200px;
}
.card-img-top {
  max-width: 390px;
  min-width: 350px;
}
// .card-body {
//   border: 1px solid;
//   border-radius: 4px;
// }
.holder {
  position: relative;
  bottom: 70px;
}
.item-wrapper {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  position: relative;
  bottom: 110px;
  left: 20px;
}
.item-options {
  display: flex;
  flex-direction: column;
  position: absolute !important;
  bottom: 35px !important;
  width: 100%;
}
.status {
  position: relative;
  top: 40px;
}
.ecommerce-card {
  background-color: inherit !important;
  cursor: pointer;
  margin: 3px;
  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 4px 25px 0 rgba(white, 0.25);
  }
}
.item-price {
  position: relative;
  left: 10px;
  color: #000;
  text-align: center;
  text-shadow: -1px -1px 1px rgba(255, 255, 255, 0.5),
    1px 1px 1px rgba(0, 0, 0, 0.5);
}
.item-img {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: auto;
  width: 95%;
}
.limits {
  width: 90%;
  display: flex;
  flex-direction: column;
  align-items: center;
  min-width: 200px;
  position: relative;
  top: 25px;
}
.views {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-around;
}
</style>
