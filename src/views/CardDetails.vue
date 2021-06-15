<template>
  <b-overlay
    :show="!download"
    variant="black"
    spinner-type="grow"
    spinner-variant="primary"
    blur="2px"
    opacity=".75"
    rounded="md">
    <div
      v-if="download">
      <div
        v-if="cardData.data.limits.length>0">
        <b-card>
          <b-card-header
            class="d-flex justify-content-start">
            <b-link :to="{ name: 'cards' }">
              <feather-icon
                class="mr-1"
                icon="ArrowLeftCircleIcon"
                size="30" />
            </b-link>
            <h3>
              Настройка карты № {{ cardData.data.number }}
            </h3>
          </b-card-header>
          <div class="d-flex flex-wrap justify-content-between">
            <div class="image">
              <b-img
                class="card-img-top"
                :src="
                  require(`../assets/images/cards-icon/${cardData.data.emitent.code}.svg`)
                " />
              <div class="item-wrapper">
                <h6 class="item-price">
                  PIN: {{ cardData.data.pin }}
                </h6>
                <h5 class="item-price">
                  {{ cardData.data.number }}
                </h5>
              </div>
              <div class="holder">
                <h6 class="ml-1">
                  Держатель:
                </h6>
                <b-form-input :value="cardData.data.holder" />
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
                <h6>
                  Выдана: {{ cardData.data.limits[0].CreatedAt | formatOnlyDate }}
                </h6>
              </div>
              <div class="mb-2">
                <h6>
                  Действует до: {{ cardData.data.expiry_date | formatDateNoTime }}
                </h6>
              </div>
              <div class="mb-2">
                <h6>
                  Последнее изменения:<br>
                  {{ cardData.data.emitent.last_updated | formatDate }}
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
              v-for="(data,key,index) in cardData.data"
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
            content-class="pt-1 position-relative"
            fill>
            <b-tab
              active
              title="Лимиты">
              <b-button
                class="mr-1 mb-1"
                variant="success"
                :disabled="servicesLength"
                @click="addLimit">
                Добавить лимит
              </b-button>
              <div
                class="d-flex flex-nowrap column ">
                <b-col
                  md="7"
                  class="p-0">
                  <validation-observer
                    ref="limitsForm">
                    <b-form
                      @submit.prevent="newLimitsData">
                      <template
                        v-for="(limit,index) in cardData.data.limits">
                        <b-card-actions
                          :key="limit.limit_id"
                          no-body
                          action-close
                          class="border pl-1 pr-1"
                          @close="hide(index)">
                          <validation-provider
                            v-slot="{ errors }"
                            name="Виды топлива"
                            rules="required">
                            <b-form-group
                              label="Виды топлива:"
                              label-for="labelServices">
                              <v-select
                                id="labelServices"
                                v-model="limit.limit_services"
                                multiple
                                label="full_name"
                                :reduce="(services) => `${services.id}`"
                                :options="services" />
                              <small
                                class="text-danger">{{ errors[0] }}</small>
                            </b-form-group>
                          </validation-provider>
                          <div class="d-flex flex-wrap align-items-center mt-1">
                            <h6 class="mx-auto">
                              Лимит
                            </h6>
                            <div class="ml-1 mw-20">
                              <b-form-input
                                v-model="limit.value" />
                            </div>
                            <b-col class="mr-1">
                              <v-select
                                v-model="limit.limit_unit_code"
                                :clearable="false"
                                :reduce="(unit) => unit.code"
                                :options="units" />
                            </b-col>
                            <b-col>
                              <v-select
                                v-model="limit.limit_period_code"
                                :clearable="false"
                                :reduce="(period) => period.code"
                                :options="periods" />
                            </b-col>
                          </div>
                          <div class="mt-1">
                            <label>Остаток: {{ limit.value - limit.consumption }} л.</label>
                            <b-progress
                              :value="limit.value - limit.consumption"
                              :max="limit.value" />
                          </div>
                        </b-card-actions>
                      </template>
                    </b-form>
                  </validation-observer>
                </b-col>
                <b-col
                  md="5"
                  class="border">
                  <b-overlay
                    :show="showLoading"
                    variant="black"
                    spinner-variant="primary"
                    blur="0"
                    opacity=".75"
                    rounded="sm">
                    <b-card-actions
                      ref="limits"
                      action-refresh
                      show
                      class="pl-1"
                      @refresh="refreshLimits('limits')">
                      <h4>Текущие лимиты по карте:</h4>
                      <hr>
                      <template
                        v-for="limit in cardData.data.limits">
                        <div :key="limit.limit_id">
                          <h4>
                            Вид топлива:
                            {{ selectedService(limit.limit_services) }}
                          </h4>
                          <h4>Лимит:  {{ periodLabel[limit.limit_period_code] }}.</h4>
                          <h4>
                            Остаток: {{ limit.value - limit.consumption }} литров.
                          </h4>

                          <hr>
                        </div>
                      </template>
                    </b-card-actions>
                  </b-overlay>
                </b-col>
              </div>
              <div class="d-flex justify-content-around w-90 position-sticky bottom">
                <b-button
                  variant="success"
                  type="submit"
                  @click="newLimitsData">
                  Сохранить
                </b-button>
                <b-button
                  class="mr-1"
                  variant="primary"
                  @click="undoChange">
                  Отмена
                </b-button>
              </div>
            </b-tab>
            <b-tab title="Транзакции">
              <h4
                v-if="totalRows < 1"
                class="text-center">
                Транзакции по карте № {{ cardData.data.number }} за период c
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
                  Транзакции по карте №{{ route.value.params.card_number }} за период c
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
                  :filter="filter">
                  <template #cell(cardData)="row">
                    {{ row.item.cardData | formatDate }}
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
      <div
        v-else>
        <div
          v-if="cardData.data.limits.length<1"
          :key="cardData.data.limits.length">
          <b-card>
            <b-card-header
              class="d-flex justify-content-start">
              <b-link :to="{ name: 'cards' }">
                <feather-icon
                  class="mr-1"
                  icon="ArrowLeftCircleIcon"
                  size="30" />
              </b-link>
              <h3>
                Настройка карты № {{ cardData.data.number }}
              </h3>
            </b-card-header>
            <div class="d-flex flex-wrap justify-content-between">
              <div class="image">
                <b-img
                  class="card-img-top"
                  :src="
                    require(`../assets/images/cards-icon/${cardData.data.emitent.code}.svg`)
                  " />
                <div class="item-wrapper">
                  <h6 class="item-price">
                    PIN: {{ cardData.data.pin }}
                  </h6>
                  <h5 class="item-price">
                    {{ cardData.data.number }}
                  </h5>
                </div>
                <div class="holder">
                  <h6 class="ml-1">
                    Держатель:
                  </h6>
                  <b-form-input :value="cardData.data.holder" />
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
                  <h6>
                    Выдана: {{ cardData.data.limits.CreatedAt | formatDate }}
                  </h6>
                </div>
                <div class="mb-2">
                  <h6>
                    Действует до: {{ cardData.data.limits.CreatedAt | formatDate }}
                  </h6>
                </div>
                <div class="mb-2">
                  <h6>
                    Последнее изменения:<br>
                    {{ cardData.data.emitent.last_updated | formatDate }}
                  </h6>
                </div>
              </div>
            </div>
            <b-tabs
              content-class="pt-1 position-relative"
              fill>
              <b-tab
                active
                title="Лимиты">
                <b-button
                  class="mr-1 mb-1"
                  variant="success"
                  :disabled="servicesLength"
                  @click="addLimit">
                  Добавить лимит
                </b-button>
                <div class="d-flex justify-content-around w-90 position-sticky bottom">
                  <b-button
                    variant="success"
                    type="submit"
                    @click="newLimitsData">
                    Сохранить
                  </b-button>
                  <b-button
                    class="mr-1"
                    variant="primary"
                    @click="undoChange">
                    Отмена
                  </b-button>
                </div>
              </b-tab>
              <b-tab title="Транзакции">
                <h4
                  v-if="totalRows < 1"
                  class="text-center">
                  Транзакции по карте № {{ cardData.data.number }} за период c
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
                    Транзакции по карте №{{ route.value.params.card_number }} за период c
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
                    :filter="filter">
                    <template #cell(cardData)="row">
                      {{ row.item.cardData | formatDate }}
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
      </div>
    </div>
  </b-overlay>
</template>

<script>
import {
  BCard,
  BImg,
  BTabs,
  BProgress,
  BOverlay,
  BCol,
  BTab,
  BFormInput,
  BButton,
  BTable,
  BPagination,
  BCardBody,
  BForm,
  BFormGroup,
  BFormSelect,
  BInputGroup,
  BLink,
  BCardHeader,
  VBTooltip,
  BInputGroupAppend,
} from 'bootstrap-vue';
import ToastificationContent from '@core/components/toastification/ToastificationContent.vue';
import { ValidationProvider, ValidationObserver } from 'vee-validate';
import vSelect from 'vue-select';
import { required } from '@validations';
import BCardActions from '@core/components/b-card-actions/BCardActions.vue';
import { ref } from '@vue/composition-api';
import { useRouter } from '../@core/utils/utils';
import useJwt from '../auth/jwt/useJwt';

export default {
  directives: {
    'b-tooltip': VBTooltip,
  },
  components: {
    ValidationProvider,
    ValidationObserver,
    BCard,
    BImg,
    BForm,
    BTabs,
    BTab,
    BButton,
    BCardBody,
    BCol,
    BLink,
    vSelect,
    BOverlay,
    // VueApexCharts,
    BCardActions,
    BFormGroup,
    BFormInput,
    BTable,
    BFormSelect,
    BPagination,
    BInputGroup,
    BProgress,
    BInputGroupAppend,
    BCardHeader,
  },
  setup() {
    const cardData = ref([]);
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
    const download = ref(false);
    const quantity = ref(null);
    const start = ref(null);
    const end = ref(null);
    const contractId = ref(null);
    const limits = ref([]);
    const source = ref({});
    const cardEmitentCode = ref(null);
    const fields = [
      {
        key: 'service.full_name',
        label: 'Товар/услуга',
        sortable: true,
      },
      {
        key: 'cardData',
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
        field: 'cardData',
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
    // const getAllService = () => {
    //   useJwt.getService().then((response) => {
    //     if (response.data.status) {
    //       services.value = response.data.data;
    //       services.value.forEach((el) => option.value.push(el.full_name));
    //       const id = services.value.map((el) => el.id);
    //       const label = services.value.map((el) => el.label);
    //       // eslint-disable-next-line no-plusplus
    //       for (let i = 0; i < id.length; i++) {
    //         labelService.value[id[i]] = label[i];
    //       }
    //     }
    //   });
    // };
    const getServiceFromEmitent = (params) => {
      useJwt.getServiceFromEmitent(`emitent_code=${params}`).then((response) => {
        if (response.data.status) {
          services.value = response.data.data;
          services.value.forEach((el) => option.value.push(el.full_name));
          const id = services.value.map((el) => el.id);
          const label = services.value.map((el) => el.label);
          console.log(label.length);
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
    const cardDate = (params) => useJwt.getCardData(params).then((response) => {
      if (response.data.status) {
        cardData.value = response.data;
        cardEmitentCode.value = cardData.value.data.emitent.code;
        source.value = JSON.stringify(response.data);
      }
      // return cardData.value;
    });
    const number = ref(null);

    const fetchProduct = () => {
      const { route } = useRouter();
      cardDate(route.value.params.card_number);
      number.value = route.value.params.card_number;
      download.value = true;
    };

    fetchProduct();
    getAllTransactions();
    getServiceFromEmitent(cardEmitentCode);
    // getAllService();
    getAllPeriods();
    getAllUnits();
    return {
      product,
      cardEmitentCode,
      // labelSelected
      source,
      download,
      cardData,
      value,
      transactions,
      totalRows,
      columns,
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
      limits,
      number,
    };
  },
  data() {
    return {
      newLimit: {},
      required,
      showLoading: false,
      saveChange: false,
    };
  },

  computed: {
    servicesLength() {
      return this.cardData.data.limits.map((el) => el.limit_services).some((el) => el === null || el.length === 0);
    },

  },
  beforeMount() {
    this.getCardNumber();
  },
  methods: {
    // eslint-disable-next-line vue/return-in-computed-property
    labelSelected() {
      const empty = [];
      // eslint-disable-next-line no-plusplus
      for (let i = 0; i < this.selected.length; i++) {
        empty.push(this.labelService[this.selected[i]]);
      }

      return empty;
    },

    getCardNumber() {
      this.$store.dispatch('getCardNumber', this.number);
      // console.log(this.$store.state.cardNumber);
    },

    showToast() {
      this.$toast({
        component: ToastificationContent,
        props: {
          title: 'Уведомление',
          icon: 'BellIcon',
          text: '🙄 Данные обновить не удалось. Попробуйте позже, а мы пока починим 👨‍🔧',
        },
      });
    },

    refreshLimits(card) {
      useJwt.getCardData(this.cardData.data.number).then((response) => {
        if (response.data.status) {
          this.cardData = response.data;
          this.$refs[card].showLoading = false;
        } else {
          //  this.showLoading = false;
          this.showToast();
        }
      });
    },

    newLimitsData() {
      this.$refs.limitsForm.validate().then((success) => {
        if (success) {
          this.saveChange = true;
          this.$toast({
            component: ToastificationContent,
            props: {
              title: 'Данные сохранены',
              icon: 'EditIcon',
              variant: 'success',
            },

          });
        } else {
          this.$toast({
            component: ToastificationContent,
            props: {
              title: 'Укажите вид(ы) топлива',
              icon: 'AlertTriangleIcon',
              variant: 'danger',
            },

          });
        }
      });
    },

    undoChange() {
      useJwt.getCardData(this.cardData.data.number).then((response) => {
        if (response.data.status) {
          this.cardData = response.data;
        }
        // this.render = this.getRandom();
      });
    },
    getRandom() {
      return Math.floor(Math.random() * 10000);
    },

    addLimit() {
      this.newLimit = {
        limit_period_code: 'MONTH',
        value: 0,
        limit_unit_code: 'L',
        limit_services: [],
        limit_commons: [],
        consumption: 0,
        limit_id: this.getRandom(),
      };
      this.cardData.data.limits.unshift(this.newLimit);
    },

    hide(index) {
      this.cardData.data.limits.splice(index, 1);
    },

    selectedService(arrService) {
      if (arrService === null) {
        return '';
      }
      let label = '';
      // eslint-disable-next-line no-return-assign
      arrService.forEach((el) => (label += `${this.labelService[el]}, `));
      return label.split('').slice(0, -2).join('');
    },

    // selectedService(arrService) {
    //   const label = [];
    //   // eslint-disable-next-line no-return-assign
    //   // label.push(arrService);
    //   // eslint-disable-next-line no-plusplus
    //   for (let i = 0; i < arrService.length; i++) {
    //     label.push(this.labelService[arrService[i]]);
    //   }
    //   return label;
    // },
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

.b-overlay-wrap {
  min-height: 265px !important;
}
@media screen and (max-width: 768px) {
  .column {
    flex-direction: column;
  }
}

@media (max-width: 768px) {
  .col-md-6 {
    -webkit-box-flex: 0;
    -ms-flex: 0 0 50%;
    flex: 0 0 50%;
    max-width: 100%;
  }
}

.card-body {
  padding: 0.5rem !important;
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

.bottom {
  bottom: 50px;
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
