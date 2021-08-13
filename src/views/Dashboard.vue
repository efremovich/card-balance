<template>
  <b-overlay
    :show="showLoading"
    spinner-type="grow"
    spinner-variant="primary"
    spinner-medium
    variant="transparent"
    blur="5px"
    opacity=".75"
    rounded="md">
    <div v-if="download">
      <div>
        <div class="column">
          <div class="row">
            <b-col md="6">
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
                  v-if="getWidth === 'xs'"
                  ref="userDate"
                  title="Информация по договору"
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
                      @input="Change" />
                    <h4>Статус: {{ cardBalance.contract.status }} </h4>
                    <h4>
                      От: {{ cardBalance.contract.date | formatDate }}
                    </h4>
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
                  title="Информация по договору"
                  action-refresh
                  @refresh="refreshMainCard('userDate')">
                  <b-card-text fluid>
                    <h3 class="mr-1">
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
                      <span class="text-danger h5">  {{ cardBalance.contract.deposit.toLocaleString('ru-RU', {
                        style: 'currency',
                        currency: 'RUB'
                      }) }}</span>
                    </h5>
                    <h4>
                      От: {{ cardBalance.contract.date | formatDate }}
                    </h4>
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
            <b-col
              v-if="currentConsumption.currentConsumption.length !== null"
              md="6">
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
                  <div class="d-flex justify-content-between align-items-end">
                    <h4>Последние изменения <br> по договору:</h4>
                    <h4 class="text-info">
                      {{ userData.contract['updated'] | formatDate }}
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
              v-else
              md="6">
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
                      {{ userData.contract['updated'] | formatDate }}
                    </h4>
                  </div>
                </b-card-actions>
              </b-overlay>
            </b-col>
          </div>
          <div class="row">
            <b-col md="6">
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
                  ref="information"
                  action-close
                  action-refresh
                  action-collapse
                  title="Данные организации:"
                  @refresh="refreshInformation('information')">
                  <div class="d-flex flex-column">
                    <h3>Название: &#8195; {{ userData.company.name }}</h3>
                    <h3>ИНН: &#8195; {{ userData.company.inn }}</h3>
                    <h3>
                      Почтовый адрес: &#8195;
                      {{ userData.company.legal_address }}
                    </h3>
                  </div>
                </b-card-actions>
              </b-overlay>
            </b-col>

            <b-col md="6">
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
                  title="Статистика по картам"
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
                  <div class="mt-1">
                    <div

                      class="d-flex justify-content-between">
                      <h4>
                        Активно:
                      </h4>
                      <h4>
                        {{ getActiveCard }}
                      </h4>
                    </div>
                  </div>
                  <div class="mt-1">
                    <div
                      class="d-flex justify-content-between">
                      <h4>
                        Заблокировано:
                      </h4>
                      <h4 class="text-danger">
                        {{ getNotActiveCard }}
                      </h4>
                    </div>
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
              action-collapse
              title="Динамика потребления"
              @refresh="refreshConsumption('consumption')">
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
                  type="line"
                  height="240"
                  :options="revenueComparisonLine.chartOptions"
                  :series="currentConsumptionDynamic.consumptionSeries" />
              </b-card-body>
            </b-card-actions>
            <b-card-actions
              v-else
              ref="consumption"
              action-close
              action-refresh
              action-collapse
              title="Динамика потребления"
              @refresh="refreshConsumption('consumption')">
              <b-card-body class="pb-0">
                <div class="d-flex flex-column mb-3 mix">
                  <h3>Пустота</h3>
                </div>

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
        </b-overlay>
      <!--GEO-->
      </div>
    <!-- </b-overlay> -->
    </div>
  </b-overlay>
</template>

<script>
import ToastificationContent from '@core/components/toastification/ToastificationContent.vue';
import BCardActions from '@core/components/b-card-actions/BCardActions.vue';
// GEO
import {
  LMap, LTileLayer, LMarker, LCircle,
} from 'vue2-leaflet';
import 'leaflet/dist/leaflet.css';
// end GEO
import vSelect from 'vue-select';
import VueApexCharts from 'vue-apexcharts';
import { ru } from 'apexcharts/dist/locales/ru.json';
import { $themeColors } from '@themeConfig';
import { Icon } from 'leaflet';
import { mapGetters } from 'vuex';
import store from '@/store';
import {
  BCardText, BCol, BButton, BTable, BCardBody, BOverlay, BLink,
} from 'bootstrap-vue';
import useJwt from '@/auth/jwt/useJwt';
// eslint-disable-next-line no-underscore-dangle
delete Icon.Default.prototype._getIconUrl;
Icon.Default.mergeOptions({
  // eslint-disable-next-line global-require
  iconRetinaUrl: require('leaflet/dist/images/marker-icon-2x.png'),
  // eslint-disable-next-line global-require
  iconUrl: require('leaflet/dist/images/marker-icon.png'),
  // eslint-disable-next-line global-require
  shadowUrl: require('leaflet/dist/images/marker-shadow.png'),
});
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
    LMap,
    LTileLayer,
    LMarker,
    LCircle,
  },
  data() {
    return {
      getInfo: null,
      userData: null,
      userInfo: null,
      selectContract: null,
      axiosIns: null,
      cardBalance: null,
      statisticsData: null,
      currentConsumption: null,
      consumptionDinamic: null,
      currentConsumptionDynamic: null,
      option: [],
      ID: null,
      download: false,
      showLoading: false,
      // selected: this.$store.getters.CONTRACT_NUMBER,
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
      url: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
      zoom: 10,
      center: [45.0352566, 38.9764814],
      markerLatLng: [45.0352566, 38.9764814],
      circle: {
        center: [45.0352566, 38.9764814],
        radius: 150,
        color: '#EA5455',
      },
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
        console.log(value);
        this.$store.dispatch('getContractNumber', value.number);
        this.$store.dispatch('getContractId', value.id);
      },
    },
    getActiveCard() {
      return this.cardBalance.card_statistic.filter((status) => status.card_status.code === 'ACTIVE').length;
    },
    getNotActiveCard() {
      return this.cardBalance.card_statistic.filter((status) => status.card_status.code !== 'ACTIVE').length;
    },

    getCardsSumm() {
      return this.cardBalance.card_statistic.length;
    },

    // gotSelected() {
    //   return this.$store.getters.CONTRACT_NUMBER;
    // },
    getWidth() {
      return store.getters['app/currentBreakPoint'];
    },
  // getCurrentConsumptionLength() {
  //   return this.currentConsumption.currentConsumption.length;
  // },

  },
  watch: {
    gotSelected() {
      this.onChange();
    },
  },

  beforeMount() {
    // this.showLoading = true;
    // this.download = false;
    useJwt.getCurrenUser().then((response) => {
      if (response.data.status) {
        this.download = true;
        this.showLoading = false;
        this.$store.dispatch('user/getUserData', response.data).then(() => {
          this.userData = response.data;
          this.makeOptions();
          // this.getSelected();
        });
      }
    });

    useJwt.getCurrentConsumption().then((response) => {
      if (response.data.status) {
        this.$store.dispatch('user/getCurrentConsumption', response.data).then(() => {
          this.currentConsumption = response.data;
        });
      }
    });

    this.userData = JSON.parse(localStorage.getItem('userData'));
    if (this.userData) {
      this.getInfo = this.userData;
      return this.getInfo;
    }
    return { data: { status: false } };
  },
  mounted() {
    this.download = false;
    useJwt.getBalance().then((response) => {
      if (response.data.status) {
        this.cardBalance = response.data;
        console.log('cardbalance:', this.cardBalance);
        this.download = true;
      }
    });
    // useJwt.getCurrentConsumption().then((response) => {
    //   if (response.data.status) {
    //     this.$store.dispatch('user/getCurrentConsumption', response.data).then(() => {
    //       this.currentConsumption = response.data;
    //       console.log(this.currentConsumption.currentConsumption);
    //     });
    //   }
    // });
    useJwt.getConsumptionDinamic().then((response) => {
      if (response.data.status) {
        this.$store.dispatch('user/getConsumptionDinamic', response.data).then(() => {
          this.currentConsumptionDynamic = response.data;
        });
      }
    });
    useJwt.getCardStatistic().then((response) => {
      if (response.data.status) {
        this.statisticsData = response.data;
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

    // getSelected() {
    //   this.selected = this.$store.getters.CONTRACT_NUMBER;
    // },


    makeOptions() {
      this.userData.contracts.forEach((el) => {
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
    onChange() {
      this.showLoading = true;
      useJwt.changeContract(this.$store.getters.CONTRACT_ID)
        .then((response) => {
          if (response.status) {
            this.cardBalance = response.data;
            this.refreshConsumptions(this.$store.getters.CONTRACT_ID);
            this.refreshData(this.$store.getters.CONTRACT_ID);
            this.showLoading = false;

          }
        });
    },
    Change() {
      // this.$store.dispatch('getContractNumber', this.selected.number);
      // this.$store.dispatch('getContractId', this.selected.id);
      // console.log(this.$store.getters.CONTRACT_ID);
      this.showLoading = true;
      useJwt.changeContract(this.$store.getters.CONTRACT_ID)
        .then((response) => {
          if (response.status) {
            this.cardBalance = response.data;
            this.refreshConsumptions(this.$store.getters.CONTRACT_ID);
            this.refreshData(this.$store.getters.CONTRACT_ID);
            this.showLoading = false;
          }
        });
    },
  },
};
</script>

<style lang="scss">
@import "../assets/scss/components/dashboard";
</style>
