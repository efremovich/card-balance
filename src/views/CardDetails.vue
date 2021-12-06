<template>
  <b-overlay
    :show="!showLoading"
    variant="black"
    spinner-type="grow"
    spinner-variant="primary"
    blur="2px"
    opacity=".75"
    rounded="md">
    <div
      v-if="download">
      <div
        v-if="limitsLength>0">
        <b-card
          :class="[getWidth === 'xs'?'max-w': '']">
          <b-card-header
            class="d-flex justify-content-start">
            <b-link :to="{ name: 'cards' }">
              <feather-icon
                class="mr-1"
                icon="ArrowLeftCircleIcon"
                size="30" />
            </b-link>
            <h3>
              Настройка карты № {{ number }}
            </h3>
          </b-card-header>
          <div class="d-flex flex-wrap justify-content-between">
            <div class="image">
              <b-img
                :class="['card-img-top', getWidth === 'xs'? 'min-w270':'']"
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
                  Выдана: {{ cardData.data.expiry_date | formatOnlyDate }}
                  <!-- указать дату выдачи карты не в лимитах, а выше иначе при удалении всех лимитов
                  невозможно создать новый лимит -->
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
                                :key="index"
                                v-model="limit.limit_services"
                                multiple
                                label="full_name"
                                :reduce="(services) => `${services.id}`"
                                :options="services"
                                :selectable="(option) => (!getSelectedServices.flat(1).includes(option.id))" />
                              <!-- Нужно отследить выбранные значения и фильтровать по ним services и затем передовать их options. Передавать computed свойство. -->
                              <small
                                class="text-danger">{{ errors[0] }}</small>
                            </b-form-group>
                          </validation-provider>
                          <div :class="['d-flex', 'flex-wrap', 'mt-1', getWidth === 'xs'?'align-items-center': '']">
                            <div :class="[getWidth === 'xs'?'d-flex flex-nowrap align-items-center':'d-flex mb-1']">
                              <h6 class="mr-1">
                                Лимит
                              </h6>
                              <div class="mr-1 mw-20">
                                <b-form-input
                                  v-model.number="limit.value" />
                              </div>
                              <b-col
                                :class="[getWidth === 'xs'? '': 'mr-1']">
                                <v-select
                                  v-model="limit.limit_unit_code"
                                  :clearable="false"
                                  :reduce="(unit) => unit.code"
                                  :options="units" />
                              </b-col>
                            </div>
                            <b-col>
                              <v-select
                                v-model="limit.limit_period_code"
                                :class="[getWidth === 'xs'?'mt-1 mb-1': '']"
                                :clearable="false"
                                :reduce="(period) => period.code"
                                :options="periods" />
                            </b-col>
                          </div>
                          <div class="mt-1">
                            <label>Остаток: {{ limit.value - limit.consumption }}  {{ unicodeLabel[limit.limit_unit_code] }} </label>
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
                    :show="!showLoading"
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
                        v-for="(limit) in cardData.data.limits">
                        <div :key="limit.limit_id">
                          <h4>
                            Вид топлива:
                            {{ selectedService(limit.limit_services) }}
                          </h4>
                          <h4>Лимит:  {{ periodLabel[limit.limit_period_code] }}.</h4>
                          <h4>
                            Остаток: {{ limit.value - limit.consumption }} {{ unicodeLabel[limit.limit_unit_code] }}.
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
                v-if="totalRows<1"
                class="text-center">
                Транзакции по карте № {{ cardData.data.number }} за период c
                {{ firstDayOfMonth }} по {{ lastDay }} отсутствуют
              </h4>
              <div v-if="totalRows>0">
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
                        :data="transactions.data.result"
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
                  :items="transactions.data.result"
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
          v-if="limitsLength<1">
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
                Настройка карты № {{ number }}
              </h3>
            </b-card-header>
            <div class="d-flex flex-wrap justify-content-between">
              <div class="image">
                <b-img
                  class="card-img-top"
                  :src="
                    require(`../assets/images/cards-icon/${cardEmitentCode}.svg`)
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
                          :data="transactions.data.result"
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
                    :items="transactions.data.result"
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
import store from '@/store';
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
    const cardData = ref({});
    const unfulfilledRequest = ref(null); // неисполненная заявка
    const product = ref(null);
    const value = ref(null);
    const totalRows = ref(null);
    const transactions = ref({});
    const option = ref([]);
    const loadDone = ref(false);
    const lastDay = ref(null);
    const firstDayOfMonth = ref(null);
    const labelService = ref({});
    const perPage = 5;
    const optionService = ref(null);
    const alreadySelectedServices = ref(null); // установленные лимиты
    // const selected = ref([]);
    const pageOptions = [3, 5, 10];
    const currentPage = 1;
    const filter = ref(null);
    const units = ref([]);
    const periods = ref([]);
    const services = ref([]);
    const showLoading = ref(true);
    const download = ref(false);
    const quantity = ref(null);
    const start = ref(null);
    const end = ref(null);
    const contractId = ref(null);
    // const limits = ref([]);
    const source = ref({});
    const limitsLength = ref(null);
    const cardEmitentCode = ref('0');
    /// const alreadySelectedServices = ref(null);
    const number = ref(null);
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
    const unicodeLabel = {
      L: 'литров',
      RU: 'рублей',
    };
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
    const getService = (params) => {
      useJwt.getServiceFromEmitent(`emitent_code=${params}`).then((response) => {
        if (response.data.status) {
          services.value = response.data.data;
          // services.value.forEach((el) => option.value.push(el.full_name));
          alreadySelectedServices.value = cardData.value.data.limits.map((el) => el.limit_services); // выбранные виды топлива
          // services.value = (services.value.filter((f) => !alreadySelectedServices.value.flat(1).includes(f.id)));
          const id = services.value.map((el) => el.id);
          // console.log(alreadySelectedServices.value);
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
              totalRows.value = transactions.value.data.total;
            }
            loadDone.value = false;
            // return transactions.value;
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
        limitsLength.value = cardData.value.data.limits.length;
        source.value = JSON.parse(JSON.stringify(cardData.value.data.limits));
        getService(cardEmitentCode.value);
      }
    });

    const fetchProduct = () => {
      const { route } = useRouter();
      cardDate(route.value.params.card_number);
      number.value = route.value.params.card_number;
      download.value = true;
      showLoading.value = true;
    };
    fetchProduct();
    getAllTransactions();
    getAllPeriods();
    getAllUnits();

    // const getSelectedServices = () => computed(() => cardData.value.data.limits.map((el) => el.limit_services));
    // const getUnelectedServices = () => computed(() => services.value.filter((f) => !getSelectedServices.value.flat(1).includes(f.id)));
    return {
      product,
      cardEmitentCode,
      alreadySelectedServices,
      optionService,
      // getSelectedServices,
      // getUnelectedServices,
      limitsLength,
      unicodeLabel,
      showLoading,
      unfulfilledRequest,
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
      quantity,
      units,
      periods,
      services,
      periodLabel,
      number,
    };
  },
  data() {
    return {
      newLimit: {},
      required,
      saveChange: false,
      comparison: true,
      newLimits: {},
      randomKey: null,
    };
  },
  computed: {
    servicesLength() {
      return this.cardData.data.limits.map((el) => el.limit_services).some((el) => el === null || el.length === 0);
    },
    getSelectedServices() {
      return this.cardData.data.limits.map((el) => el.limit_services);
    },
    getUnelectedServices() {
      return this.services.filter((f) => !this.getSelectedServices.flat(1).includes(f.id));
    },
    getWidth() {
      return store.getters['app/currentBreakPoint'];
    },
  },
  watch: {
    'cardData.data.limits': {
      deep: true,
      handler(val) {
        if (JSON.stringify(val) === JSON.stringify(this.source)) {
          this.comparison = true;
        } else {
          this.comparison = false;
          this.newLimits = val;
          // const service = this.newLimits.map((el) => el.limit_services);
        }
      },
    },
    saveChange() {
      if (this.saveChange === true) {
        this.sendRequest();
      }
    },
    // getUnelectedServices(val) {
    //   //   console.log(this.getSelectedServices);
    //   //   val.filter((f) => !this.getSelectedServices.flat(1).includes(f.id));
    //   //   console.log(val.filter((f) => !this.getSelectedServices.flat(1).includes(f.id)));
    //   // },
    //   // getUnelectedServices(val) {
    //   console.log(val);
    //   // this.services = val;
    // },
  },
  // mounted() {
  //   console.log('', this.alreadySelectedServices);
  // },
  methods: {
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
    // changeOptions() {
    //   // this.randomKey = this.getRandom();
    //   this.services = this.getUnelectedServices;
    //   console.log(this.services);
    // },
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
    sendRequest() {
      const request = [{
        // ID: 45,
        // CreatedAt: '2021-11-12T14:52:37.4280415+03:00',
        // UpdatedAt: '2021-11-12T14:52:37.4280415+03:00',
        // DeletedAt: null,
        // card_number: this.cardData.data.number,
        // request_type_code: 'EDIT',
        // request_status_code: 'CREATED',
        // contract_id: this.cardData.data.contract_id,
        // limits: this.newLimits, // всё о лимитах
        card_number: this.cardData.data.number,
        request_type_code: 'EDIT',
        request_status_code: 'CREATED',
        contract_id: this.cardData.data.contract_id,
        limits: this.newLimits,
        // limits: [
        //   {
        //     'card_number': this.cardData.data.number,
        //     'contract_id': this.cardData.data.contract_id,
        //     'value': 300,
        //     'limit_unit_code': 'L',
        //     'limit_type_code': 'INDIVID',
        //     'limit_period_code': 'MONTH',
        //     'consumption': 0,
        //     'limit_common': [
        //       {
        //         'service_id': '6b6f5f4a-1232-11e7-aaff-0025225e28fb',
        //       },
        //     ],
        //   },
        // ],
      }];
      useJwt.refreshDataUserLimits(request);
      // this.saveChange = false;
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
    // eslint-disable-next-line consistent-return
    selectedService(arrService) { // параметр функции у нас объект,
      if (arrService === null) {
        return '';
      }
      let label = '';
      // eslint-disable-next-line no-return-assign
      arrService.forEach((el) => (label += `${this.labelService[el]}, `));
      return label.split('').slice(0, -2).join('');
    },
  },
};
</script>

<style lang="scss">
@import "@core/scss/vue/libs/vue-select.scss";
@import "@core/scss/vue/libs/vue-flatpicker.scss";
</style>

<style lang="scss" scoped>
@import "../assets/scss/components/cardDetails";
</style>
