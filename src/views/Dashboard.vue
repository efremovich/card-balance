<template>
  <b-overlay
    class="mt-5"
    :show="showLoading"
    spinner-type="grow"
    spinner-variant="primary"
    spinner-medium
    variant="transparent"
    blur="5px"
    opacity=".75"
    rounded="md">
    <div v-if="download">
      <div class="column">
        <div class="row">
          <div :class="[{'col-md-6':getWidth !== 'xs'}]">
            <b-col>
              <b-overlay
                :show="showLoading"
                spinner-type="grow"
                spinner-variant="primary"
                spinner-medium
                variant="transparent"
                :opacity="opacity"
                :blur="blur"
                rounded="md">
                <b-card-actions
                  v-if="getWidth === 'xs'"
                  ref="userDate"
                  title="Информация по договору:"
                  action-refresh
                  @refresh="refreshMainCard('userDate')">
                  <b-card-text fluid>
                    <h3>
                      Баланс: <span> {{
                        cardBalance.contract.balance.toLocaleString('ru-RU', {
                          style: 'currency',
                          currency: 'RUB'
                        })
                      }} </span>
                    </h3>
                    <h5 v-if="cardBalance.contract.deposit !== 0">
                      Допустимая задолженность:
                      <span class="text-danger h5">  {{ cardBalance.contract.deposit.toLocaleString('ru-RU', {
                        style: 'currency',
                        currency: 'RUB'
                      }) }}</span>
                    </h5>
                    <h3 class="mr-1">
                      Договор № :
                    </h3>
                    <v-select
                      v-model="selected"
                      :clearable="false"
                      label="number"
                      :options="option"
                      class="w-100 mt-1 mb-1"
                      @input="сhange" />
                    <h4>Статус: {{ cardBalance.contract.status }} </h4>
                    <h4>
                      От: {{ date | formatDateNoTime }}
                    </h4>
                    <div class="d-flex justify-content-between align-items-end">
                      <h4>Последние изменения по договору:</h4>
                      <h4 class="text-info">
                        {{ dateUpdate | formatDateNoTime }}
                      </h4>
                    </div>
                    <b-link :to="{ name: 'bill' }">
                      <b-button
                        variant="warning"
                        class="d-flex align-items-center margin">
                        <feather-icon
                          size="2x"
                          icon="PlusIcon"
                          class="mr-50" />
                        <span class="align-baseline">Пополнить баланс</span>
                      </b-button>
                    </b-link>
                  </b-card-text>
                </b-card-actions>
                <b-card-actions
                  v-else
                  ref="userDate"
                  class="shadow-none"
                  title="Информация по договору:"
                  action-refresh
                  @refresh="refreshMainCard('userDate')">
                  <b-card-text fluid>
                    <h3>
                      Договор №: {{ gotSelected }}
                    </h3>
                    <h4>Статус: {{ cardBalance.contract.status }} </h4>
                    <h3>
                      Баланс: <span> {{
                        cardBalance.contract.balance.toLocaleString('ru-RU', {
                          style: 'currency',
                          currency: 'RUB'
                        })
                      }} </span>
                    </h3>
                    <h5 v-if="cardBalance.contract.deposit !== 0">
                      Допустимая задолженность:
                      <span class="text-danger">  {{ cardBalance.contract.deposit.toLocaleString('ru-RU', {
                        style: 'currency',
                        currency: 'RUB'
                      }) }}</span>
                    </h5>
                    <h4>
                      От: {{ date | formatDateNoTime }}
                    </h4>
                    <div class="d-flex justify-content-between align-items-end">
                      <h4>Последние изменения по договору:</h4>
                      <h4 class="text-info">
                        {{ dateUpdate | formatDateNoTime }}
                      </h4>
                    </div>
                    <b-link :to="{ name: 'bill' }">
                      <b-button
                        variant="warning"
                        class="d-flex align-items-center margin">
                        <feather-icon
                          size="2x"
                          icon="PlusIcon"
                          class="mr-50" />
                        <span class="align-baseline">Пополнить баланс</span>
                      </b-button>
                    </b-link>
                  </b-card-text>
                </b-card-actions>
              </b-overlay>
            </b-col>

            <b-col>
              <b-overlay
                :show="showLoading"
                spinner-variant="primary"
                spinner-type="grow"
                spinner-medium
                variant="transparent"
                blur="5px"
                opacity=".75"
                rounded="md">
                <b-card-actions
                  ref="cardStatistic"
                  title="Статистика по картам:"
                  class="p-0"
                  action-refresh
                  @refresh="refreshCardStatistic('cardStatistic')">
                  <div class="mt-1">
                    <div
                      class="d-flex justify-content-between">
                      <h4>
                        Всего карт:
                      </h4>
                      <h4>
                        {{ getCardsSumm }}
                      </h4>
                    </div>
                  </div>
                  <hr>
                  <template v-for="(el) in cardStatisticsData">
                    <div
                      :key="el.id"
                      class="d-flex flex-column">
                      <div class="d-flex justify-content-between">
                        <h4>
                          {{ el.name }}:
                        </h4>
                        <h4> {{ el.value }}</h4>
                      </div>
                      <div
                        v-for="(i) in el.cardStatus"
                        :key="i.id"
                        class="d-flex flex-column">
                        <template v-for="(status) in i">
                          <div
                            :key="status.id"
                            class="d-flex justify-content-between">
                            <h4>
                              {{ mapStatus[status.name] }}
                            </h4>
                            <h4>
                              {{ status.value }}
                            </h4>
                          </div>
                        </template>
                        <hr>
                      </div>
                    </div>
                  </template>
                </b-card-actions>
              </b-overlay>
            </b-col>
          </div>
          <b-col
            v-if="currentConsumption.currentConsumption.length !== null">
            <b-overlay
              :show="showLoading"
              spinner-variant="primary"
              spinner-type="grow"
              spinner-medium
              variant="transparent"
              blur="5px"
              opacity=".75"
              rounded="md">
              <b-card-actions
                v-if="!isBudget"
                ref="expenses"
                title="Расход за текущий месяц:"
                action-refresh
                @refresh="refreshExpenses('expenses')">
                <div class="d-flex justify-content-between">
                  <h4>{{ getMonthName(-1) | title }}:</h4>
                  <h4 class="text-danger">
                    {{ currentConsumptionDynamic.consumptionData.this_month.toLocaleString('ru-RU', {
                      style: 'currency',
                      currency: 'RUB'
                    }) }}
                  </h4>
                </div>

                <b-table
                  v-if="currentConsumption !==null && (currentConsumption.currentConsumption.length !== null && currentConsumption.currentConsumption.length>0)"
                  hover
                  responsive
                  :items="currentConsumption.currentConsumption"
                  :fields="fields" />
              </b-card-actions>
              <b-card-actions
                v-if="isBudget"
                ref="expenses"
                title="Остатки по контрактам:"
                action-refresh
                @refresh="refreshExpenses('expenses')">
                <div class="d-flex justify-content-between">
                  <h4>{{ getMonthName(-1) | title }}:</h4>
                  <h4 class="text-danger">
                    {{ currentConsumptionDynamic.consumptionData.this_month.toLocaleString('ru-RU', {
                      style: 'currency',
                      currency: 'RUB'
                    }) }}
                  </h4>
                </div>

                <b-table
                  v-if="currentConsumption !==null && (currentConsumption.currentConsumption.length !== null && currentConsumption.currentConsumption.length>0)"
                  hover
                  responsive
                  :items="currentConsumption.currentConsumption"
                  :fields="fields" />
              </b-card-actions>
            </b-overlay>
          </b-col>
          <b-col
            v-else>
            <b-overlay
              :show="showLoading"
              spinner-type="grow"
              spinner-variant="primary"
              spinner-medium
              variant="transparent"
              blur="5px"
              opacity=".75"
              rounded="md">
              <b-card-actions
                ref="expenses"
                action-refresh
                class="p-0"
                @refresh="refreshExpenses('expenses')">
                <div class="d-flex justify-content-between">
                  <h4> Расходы за {{ getMonthName(-1) }}:</h4>
                  <h4>
                    отсутствуют
                  </h4>
                </div>
                <div class="d-flex justify-content-between align-items-end">
                  <h4>Последние изменения <br> по договору:</h4>
                  <h4 class="text-info">
                    {{ cardBalance.contract.updated | formatDateNoTime }}
                  </h4>
                </div>
              </b-card-actions>
            </b-overlay>
          </b-col>
        </div>

        <!--Statistics -->
        <b-overlay
          :show="showLoading"
          spinner-variant="primary"
          spinner-type="grow"
          spinner-medium
          variant="transparent"
          blur="5px"
          opacity=".75"
          rounded="md">
          <b-card-actions
            v-if="currentConsumptionDynamic !== null"
            ref="consumption"
            action-close
            action-refresh
            title="Динамика потребления"
            @refresh="refreshConsumption('consumption')">
            <b-overlay
              :show="showLoading"
              spinner-variant="primary"
              spinner-type="grow"
              spinner-medium
              variant="transparent"
              blur="5px"
              opacity=".75"
              rounded="md">
              <b-card-body class="pb-0">
                <div class="d-flex flex-column mb-3 mix">
                  <div class="mr-2 mt-1">
                    <b-card-text class="mb-50">
                      В этом месяце:
                    </b-card-text>
                    <h3 class="font-weight-bolder">
                      <span class="text-primary">{{ currentConsumptionDynamic.consumptionData.this_month.toLocaleString('ru-RU', {
                        style: 'currency',
                        currency: 'RUB'
                      }) }}  </span>
                    </h3>
                  </div>
                  <div class="mr-2 mt-1">
                    <b-card-text class="mb-50">
                      В прошлом месяце:
                    </b-card-text>
                    <h3 class="font-weight-bolder">
                      <span>{{ currentConsumptionDynamic.consumptionData.last_month.toLocaleString('ru-RU', {
                        style: 'currency',
                        currency: 'RUB'
                      }) }}</span>
                    </h3>
                  </div>
                  <div class="mr-2 mt-1">
                    <b-card-text class="mb-50">
                      Два месяца назад :
                    </b-card-text>
                    <h3 class="font-weight-bolder">
                      <span>{{ currentConsumptionDynamic.consumptionData.other_month.toLocaleString('ru-RU', {
                        style: 'currency',
                        currency: 'RUB'
                      }) }}</span>
                    </h3>
                  </div>
                </div>

                <!-- apex chart -->
                <vue-apex-charts
                  v-if="getWidth !== 'xs'"
                  type="line"
                  height="240"
                  :options="revenueComparisonLine.chartOptions"
                  :series="currentConsumptionDynamic.consumptionSeries" />
              </b-card-body>
            </b-overlay>
          </b-card-actions>
          <b-card-actions
            v-else
            ref="consumption"
            action-close
            action-refresh
            title="Динамика потребления"
            @refresh="refreshConsumption('consumption')">
            <b-card-body class="pb-0">
              <!-- apex chart -->
              <vue-apex-charts
                type="line"
                height="240"
                :options="revenueComparisonLine.chartOptions"
                :series="currentConsumptionDynamic.consumptionSeries" />
            </b-card-body>
          </b-card-actions>
        </b-overlay>
        <!--end statistic -->
      </div>

      <!-- GEO-->
      <!-- <b-overlay
          :show="showLoading"
          spinner-variant="primary"
          spinner-type="grow"
          spinner-medium
          variant="transparent"
          blur="5px"
          opacity=".75"
          rounded="md">
          <b-card-actions
            ref="map"
            action-close
            action-refresh
            action-collapse
            title="Места потребления:"
            @refresh="refreshMap('map')">
            <div class="mt-1">
              <l-map
                :zoom="zoom"
                :center="center">
                <l-tile-layer :url="url" />
                <l-marker :lat-lng="markerLatLng" />
                <l-circle
                  :lat-lng="circle.center"
                  :radius="circle.radius"
                  :color="circle.color" />
              </l-map>
            </div>
          </b-card-actions>
        </b-overlay> -->
      <!--GEO-->
    </div>
    <!-- </b-overlay> -->
  </b-overlay>
</template>

<script>
import ToastificationContent from '@core/components/toastification/ToastificationContent.vue';
import BCardActions from '@core/components/b-card-actions/BCardActions.vue';
// GEO
// import {
//   LMap, LTileLayer, LMarker, LCircle,
// } from 'vue2-leaflet';
// import 'leaflet/dist/leaflet.css';
// end GEO
import vSelect from 'vue-select';
import VueApexCharts from 'vue-apexcharts';
import { ru } from 'apexcharts/dist/locales/ru.json';
import { $themeColors } from '@themeConfig';
// import { Icon } from 'leaflet';
import { mapGetters } from 'vuex';
import store from '@/store';
import {
  BCardText, BCol, BButton, BTable, BCardBody, BOverlay, BLink,
} from 'bootstrap-vue';
import useJwt from '@/auth/jwt/useJwt';

export default {
  components: {
    BCardActions,
    BCol,
    BCardBody,
    BOverlay,
    BLink,
    // BRow,
    BCardText,
    vSelect,
    BButton,
    BTable,
    // BProgress,
    VueApexCharts,
  },
  data() {
    return {
      // getInfo: null,
      userData: {},
      consumer: null,
      blur: '5px',
      opacity: 0.85,
      // userInfo: null,
      selectContract: null,
      cardBalance: {},
      organisationId: null,
      statisticsData: null,
      currentConsumption: null,
      consumptionDinamic: null,
      currentConsumptionDynamic: null,
      dateUpdate: null,
      date: null,
      budgetConsumption: null,
      isBudget: this.$store.state.status,
      cardStatisticsData: [],
      option: [],
      mapStatus: {
        ACTIVE: 'Активно:',

        BLOCK: 'Заблокировано:',

        BROKEN: 'Сломано:',

        DELETED: 'Удалено:',

        LOST: 'Утеряно:',

        Finance: 'Финансовая блокировка:',

        Return: 'Сдано:',

      },

      yetContract: null,
      ID: null,
      download: false,
      showLoading: true,
      fields: [
        {
          key: 'service.full_name',
          label: 'Товар/услуга',
        },
        {
          key: 'quantity',
          label: 'Количество',
        },
        {
          key: 'summ',
          label: 'Сумма',
        },
      ],
      // GEO
      // url: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
      // zoom: 10,
      // center: [45.0352566, 38.9764814],
      // markerLatLng: [45.0352566, 38.9764814],
      // circle: {
      //   center: [45.0352566, 38.9764814],
      //   radius: 150,
      //   color: '#EA5455',
      // },
      // end GEO
      revenue: {},
      revenueComparisonLine: {
        chartOptions: {
          locales: [ru],
          defaultLocale: 'ru',
          chart: {
            toolbar: { show: false },
            zoom: { enabled: false },
            type: 'line',
            offsetX: -10,
          },
          stroke: {
            curve: 'smooth',
            dashArray: [0, 12],
            width: [4, 3],
          },
          legend: {
            show: false,
          },
          colors: ['#d0ccff', '#ebe9f1'],
          fill: {
            type: 'gradient',
            gradient: {
              shade: 'dark',
              inverseColors: false,
              gradientToColors: [$themeColors.primary, '#ebe9f1'],
              shadeIntensity: 1,
              type: 'horizontal',
              opacityFrom: 1,
              opacityTo: 1,
              stops: [0, 100, 100, 100],
            },
          },
          markers: {
            size: 0,
            hover: {
              size: 5,
            },
          },
          xaxis: {
            labels: {
              style: {
                colors: '#b9b9c3',
                fontSize: '1rem',
              },
            },
            axisTicks: {
              show: false,
            },
            categories: ['01', '', '03', '', '05', '', '07', '', '09', '', '11', '', '13', '', '15', '', '17', '', '19', '', '21', '', '23', '', '26', '', '28', '', '30'],
            axisBorder: {
              show: false,
            },
            tickPlacement: 'on',
          },
          yaxis: {
            tickAmount: 5,
            labels: {
              style: {
                colors: '#b9b9c3',
                fontSize: '1rem',
              },
              formatter(val) {
                return val > 999 ? `${(val / 1000).toFixed(0)} тыс.` : val;
              },
            },
          },
          grid: {
            borderColor: '#e7eef7',
            padding: {
              top: -20,
              bottom: -10,
              left: 20,
            },
          },
          tooltip: {
            x: { show: false },
          },
        },
      },
    };
  },
  computed: {
    ...mapGetters({
      gotSelected: 'CONTRACT_NUMBER',
      gotSelectedContract: 'CONTRACT_ID',
    }),
    selected: {
      get() {
        return this.$store.getters.CONTRACT_NUMBER;
      },
      set(value) {
        this.$store.dispatch('getContractNumber', value.number);
        this.$store.dispatch('getContractId', value.id);
      },
    },

    getCardsSumm() {
      return this.statisticsData.cardStatistic.map((el) => el.total).reduce((el, summ) => el + summ, 0);
    },
    // gotSelected() {
    //   return this.$store.getters.CONTRACT_NUMBER;
    // },
    getUpdate() {
      return this.dateUpdate.split('').slice(0, 10).join('');
    },
    getDate() {
      return this.date.split('').slice(0, 10).join('');
    },
    getWidth() {
      return store.getters['app/currentBreakPoint'];
    },
  },
  watch: {
    gotSelectedContract(val) {
      this.getCardStatistica(val);
      this.onChange(val);
    },
  },
  beforeMount() {
    const userData = JSON.parse(localStorage.getItem('userData'));
    if (userData && this.gotSelectedContract === null) {
      this.yetContract = userData;
      this.ID = this.yetContract.account.contract_id;
      this.getCardStatistica(this.ID);
      this.onChange(this.ID);
      this.download = true;
    } else {
      useJwt.getCurrenUser().then((response) => {
        if (response.data.status) {
          this.download = true;

          this.$store.dispatch('user/getUserData', response.data).then(() => {
            const result = response.data;
            this.yetContract = result;
            this.makeOptions(result);
          });
        }
        // return this.userData;
        this.showLoading = false;
      });
      this.ID = this.gotSelectedContract;
      this.onChange(this.ID);
      this.getCardStatistica(this.ID);

      useJwt.getOrgId(this.ID)
        .then((response) => {
          if (response.status) {
            this.organisationId = response.data;
            const filterID = this.organisationId.data.company_id;
            useJwt.getConsumer(filterID)
              .then((status) => {
                if (status.status) {
                  this.consumer = status.data;
                  this.isBudget = this.consumer.data.contracts.map((el) => el).some((el) => el.is_budget);
                  this.$store.commit('setStatus', this.isBudget);
                }
              });
            useJwt.getValueServices(this.ID)
              .then((status) => {
                if (status.status) {
                  this.budgetConsumption = status.data;
                  console.log('бюджет', this.budgetConsumption);
                }
              });
          }
        });

    // this.showLoading = false;
    } // return { data: { status: false } };
  },
  mounted() {
    // if (this.gotSelectedContract !== null) {
    //   this.onChange(this.gotSelectedContract);
    // }

    useJwt.getCurrentConsumption().then((response) => {
      if (response.data.status) {
        this.$store.dispatch('user/getCurrentConsumption', response.data).then(() => {
          this.currentConsumption = response.data;
        });
      }
    });
    useJwt.getConsumptionDinamic().then((response) => {
      if (response.data.status) {
        this.$store.dispatch('user/getConsumptionDinamic', response.data).then(() => {
          this.currentConsumptionDynamic = response.data;
        });
      }
    });
  },
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
    getMonthName(i) {
      const date = new Date();
      date.setMonth(date.getMonth() - i);
      date.setDate(0);
      return date.toLocaleString('ru-RU', {
        month: 'long',
      });
    },
    makeOptions(val) {
      val.contracts.forEach((el) => {
        this.option.push({ 'number': el.number, 'id': el.id });
      });
    },
    // stop refreshing card in 3 sec
    refreshCardStatistic(card) {
      useJwt.getCardStatistic().then((response) => {
        if (response.data.status) {
          this.statisticsData = response.data;
          this.$refs[card].showLoading = false;
        } else {
          this.showToast();
        }
      });
    },
    refreshMainCard(card) {
      useJwt.getBalance().then((response) => {
        if (response.data.status) {
          this.cardBalance = response.data;
          this.$refs[card].showLoading = false;
        } else {
          this.showToast();
        }
      });
    },
    refreshExpenses(card) {
      useJwt.getConsumption(this.$store.getters.CONTRACT_ID).then((response) => {
        if (response.data.status) {
          this.currentConsumption = response.data;
          this.$refs[card].showLoading = false;
        } else {
          this.showToast();
        }
      });
    },
    refreshInformation(card) {
      useJwt.getCurrenUser().then((response) => {
        if (response.data.status) {
          this.userData = response.data;
          this.$refs[card].showLoading = false;
        } else {
          this.showToast();
        }
      });
    },
    refreshConsumptions(param) {
      useJwt.getConsumption(param).then((response) => {
        if (response.data.status) {
          this.currentConsumption = response.data;
        } else {
          this.showToast();
        }
      });
    },
    refreshData(param) {
      useJwt.getDynamic(param).then((response) => {
        if (response.data.status) {
          this.currentConsumptionDynamic = response.data;
        } else {
          this.showToast();
        }
      });
    },
    refreshConsumption(card) {
      useJwt.getDynamic(this.$store.getters.CONTRACT_ID).then((response) => {
        if (response.data.status) {
          this.currentConsumptionDynamic = response.data;
          this.$refs[card].showLoading = false;
        } else {
          this.showToast();
        }
      });
    },
    getCardStatistica(val) {
      useJwt.getCardStatisticFromID(val).then((response) => {
        if (response.data.status) {
          this.statisticsData = response.data;
          const allLabel = this.statisticsData.cardStatistic.map((el) => el.emitent.full_name);
          const allStatus = this.statisticsData.cardStatistic.map((el) => el.card_status.code);
          const uniqueStatus = new Set(allStatus);
          const allUniqueStatus = Array.from(uniqueStatus); // Статусы карт
          const uniqueLabel = new Set(allLabel);
          const allUniquelabels = Array.from(uniqueLabel);
          const emptyObject = [];
          // eslint-disable-next-line no-plusplus
          for (let i = 0; i < allUniquelabels.length; i++) {
            const summ = this.statisticsData.cardStatistic.filter((el) => el.emitent.full_name === allUniquelabels[i]);
            emptyObject.push(summ);
          }

          const totalSumm = [];
          this.cardStatisticsData = [];
          // eslint-disable-next-line no-plusplus
          for (let i = 0; i < emptyObject.length; i++) {
            const someSum = emptyObject[i].map((el) => el.total).reduce((el, acc) => el + acc, 0);
            totalSumm.push(someSum);
          }

          // eslint-disable-next-line no-plusplus
          for (let i = 0; i < allUniquelabels.length; i++) {
            const anotherObject = {};

            anotherObject.cardStatus = [];
            anotherObject.id = this.getRandom();
            const status = [];
            const value = [];
            // eslint-disable-next-line no-plusplus
            for (let j = 0; j < allUniqueStatus.length; j++) {
              status.push(allUniqueStatus[j]);
              let quantity = this.statisticsData.cardStatistic.filter((el) => el.emitent.full_name === allUniquelabels[i]).filter((el) => el.card_status.code === allUniqueStatus[j]).map((el) => el.total);
              quantity = Object.values(quantity).reduce((el, acc) => el + acc, 0);
              value.push(quantity);
            }

            anotherObject.name = allUniquelabels[i];
            anotherObject.value = totalSumm[i];
            anotherObject.cardStatus.status = status;
            anotherObject.cardStatus.value = value;
            const empty = [];
            // eslint-disable-next-line no-plusplus
            for (let w = 0; w < anotherObject.cardStatus.status.length; w++) {
              const someArr = {};
              someArr.name = anotherObject.cardStatus.status[w];
              someArr.value = anotherObject.cardStatus.value[w];
              someArr.id = this.getRandom();
              empty.push(someArr);
            }
            anotherObject.cardStatus.push(empty);
            this.cardStatisticsData.push(anotherObject);
          }
        }
      });
    },
    onChange(val) {
      this.showLoading = true;
      useJwt.changeContract(val)
        .then((response) => {
          if (response.status) {
            this.cardBalance = response.data;
            this.dateUpdate = this.cardBalance.contract.updated;
            this.date = this.cardBalance.contract.date;
            this.refreshConsumptions(val);
            this.refreshData(val);
            this.showLoading = false;
          }
        });
    },
    сhange() {
      this.$store.dispatch('getContractNumber', this.selected.number);
      this.$store.dispatch('getContractId', this.selected.id);
      this.showLoading = true;
      useJwt.changeContract(this.$store.getters.CONTRACT_ID)
        .then((response) => {
          if (response.status) {
            this.cardBalance = response.data;
            this.dateUpdate = this.cardBalance.contract.updated;
            this.date = this.cardBalance.contract.date;
            this.refreshConsumptions(this.$store.getters.CONTRACT_ID);
            this.refreshData(this.$store.getters.CONTRACT_ID);
            this.showLoading = false;
          }
        });
    },
    getRandom() {
      return Math.floor(Math.random() * 10000);
    },
  },
};
</script>

<style lang="scss">
@import "../assets/scss/components/dashboard";
</style>
