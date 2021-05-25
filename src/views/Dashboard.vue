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
      <div class="column">
        <div class="row">
          <b-col md="6">
            <b-overlay
              :show="showLoading"
              variant="black"
              spinner-variant="primary"
              blur="0"
              opacity=".75"
              rounded="sm">
              <b-card-actions
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
                  <!-- <div class="d-flex align-items-baseline"> -->
                  <h3 class="mr-1">
                    Договор № :
                  </h3>
                  <v-select
                    v-model="selected"
                    :clearable="false"
                    label="number"
                    :options="option"
                    class="w-100 mt-1 mb-1"
                    @input="onChange()" />
                  <!-- </div> -->
                  <h4>Статус: {{ cardBalance.contract.status }} </h4>
                  <h4>
                    От: {{ cardBalance.contract.date | formatDate }}
                  </h4>
                  <b-button

                    variant="warning"
                    class="d-flex align-items-center margin">
                    <feather-icon
                      size="2x"
                      icon="PlusIcon"
                      class="mr-50" />
                    <span class="align-baseline">Пополнить баланс</span>
                  </b-button>
                </b-card-text>
              </b-card-actions>
            </b-overlay>
          </b-col>
          <b-col
            v-if="currentConsumptionDynamic !==null && currentConsumptionDynamic.consumptionData.this_month !== 0"
            md="6">
            <b-overlay
              :show="showLoading"
              variant="black"
              spinner-variant="primary"
              blur="0"
              opacity=".75"
              rounded="sm">
              <b-card-actions
                ref="expenses"
                title="Расход за текущий месяц:"
                action-refresh
                @refresh="refreshExpenses('expenses')">
                <hr>
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
                    {{ userData.contract.updated | formatDate }}
                  </h4>
                </div>
                <b-table
                  hover
                  responsive
                  :items="currentConsumption.currentConsumption"
                  :fields="fields" />
              </b-card-actions>
            </b-overlay>
          </b-col>

        <!-- <b-col md="6">
          <b-overlay
            :show="showLoading"
            variant="black"
            spinner-variant="primary"
            blur="0"
            opacity=".75"
            rounded="sm">
            <b-card-actions
              ref="fuelResidue"
              title="Остатки топлива по контракту:"
              action-refresh
              @refresh="refreshFuelResidue('fuelResidue')">
              <vue-apex-charts
                type="bar"
                height="200" />
              <hr>

              <b-row class="avg-sessions pt-50">

                <template v-for="( item, index) in currentConsumption.currentConsumption.length">
                  <b-col
                    :key="index"
                    class="mb-2">
                    <b-card-text class="mb-50 text-info">
                      {{ currentConsumption.currentConsumption[index].service.full_name }} : {{ currentConsumption.currentConsumption[index].quantity }} л.
                    </b-card-text>
                    <b-progress
                      :value="currentConsumption.currentConsumption[index].quantity"
                      :variant="getPopularityColor(currentConsumption.currentConsumption[index].quantity)"
                      height="6px" />
                  </b-col>
                </template>
              </b-row>
            </b-card-actions>
          </b-overlay>
        </b-col> -->
        </div>
        <div class="row">
          <b-col md="6">
            <b-overlay
              :show="showLoading"
              variant="black"
              spinner-variant="primary"
              blur="0"
              opacity=".75"
              rounded="sm">
              <b-card-actions
                ref="information"
                action-close
                action-refresh
                action-collapse
                title="Данные организации:"
                @refresh="refreshInformation('information')">
                <hr>
                <div class="d-flex flex-column">
                  <h3>Название: &#8195; {{ userData.company.full_name }}</h3>
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
              variant="black"
              spinner-variant="primary"
              blur="0"
              opacity=".75"
              rounded="sm">
              <b-card-actions
                ref="cardStatistic"
                title="Статистика по картам"
                action-refresh
                @refresh="refreshCardStatistic('cardStatistic')">
                <hr>
                <div class="mt-1">
                  <div

                    class="d-flex justify-content-between">
                    <h4>
                      Всего карт:
                    </h4>
                    <h4>
                      {{ cardBalance.card_statistic.length }}
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

        <!-- <b-col md="6">
          <b-overlay
            :show="showLoading"
            variant="black"
            spinner-variant="primary"
            blur="0"
            opacity=".75"
            rounded="sm">
            <b-card-actions
              ref="cardStatistic"
              title="Статистика по картам"
              action-refresh
              @refresh="refreshCardStatistic('cardStatistic')">
              <hr>
              <div class="mt-1">
                <div

                  class="d-flex justify-content-between">
                  <h4>
                    Всего карт:
                  </h4>
                  <h4>
                    {{ cardBalance.card_statistic.length }}
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
        </b-col> -->

        <!-- <b-col md="6">
          <b-overlay
            :show="showLoading"
            variant="black"
            spinner-variant="primary"
            blur="0"
            opacity=".75"
            rounded="sm">
            <b-card-actions
              ref="information"
              action-close
              action-refresh
              action-collapse
              title="Данные организации:"
              @refresh="refreshInformation('information')">
              <hr>
              <div class="d-flex flex-column">
                <h3>Название: &#8195; {{ userData.company.full_name }}</h3>
                <h3>ИНН: &#8195; {{ userData.company.inn }}</h3>
                <h3>
                  Почтовый адрес: &#8195;
                  {{ userData.company.legal_address }}
                </h3>
              </div>
            </b-card-actions>
          </b-overlay>
        </b-col> -->
        </div>

        <!--Statistics -->
        <b-overlay
          v-if="currentConsumptionDynamic !== null && currentConsumptionDynamic.consumptionData.this_month !== 0 && currentConsumptionDynamic.consumptionData.last_month !== 0 && currentConsumptionDynamic.consumptionData.other_month !== 0"
          :show="showLoading"
          variant="black"
          spinner-variant="primary"
          blur="0"
          opacity=".75"
          rounded="sm">
          <b-card-actions
            ref="consumption"
            action-close
            action-refresh
            action-collapse
            title="Динамика потребления"
            @refresh="refreshConsumption('consumption')">
            <hr>
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
        </b-overlay>
      <!--end statistic -->
      </div>

      <!-- GEO-->
      <b-overlay
        :show="showLoading"
        variant="black"
        spinner-variant="primary"
        blur="0"
        opacity=".75"
        rounded="sm">
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
import {
  BCardText, BCol, BButton, BTable, BCardBody, BOverlay,
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
      userInfo: null,
      selectContract: null,
      axiosIns: null,
      cardBalance: null,
      statisticsData: null,
      currentConsumption: null,
      consumptionDinamic: null,
      currentConsumptionDynamic: null,
      option: [],
      download: false,
      showLoading: false,
      selected: null,
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
    activeUserInfo() {
      return this.$store.state.CurrentUser;
    },
    getActiveCard() {
      return this.cardBalance.card_statistic.filter((status) => status.card_status.code === 'ACTIVE').length;
    },

    getNotActiveCard() {
      return this.cardBalance.card_statistic.filter((status) => status.card_status.code !== 'ACTIVE').length;
    },
  },

  created() {
    // useJwt.getCurrenUser().then((response) => {
    //   if (response.data.status) {
    //     this.$store.dispatch('user/getUserData', response.data).then(() => {
    //       this.userData = response.data;
    //       this.makeOptions();
    //       this.getSelected();
    //     });
    //   }
    // });

    // useJwt.getBalance().then((response) => {
    //   if (response.data.status) {
    //     this.$store.dispatch('user/getBalance', response.data).then(() => {
    //       this.cardBalance = response.data;
    //       this.download = true;
    //     });
    //   }
    // });

    // useJwt.getCurrentConsumption().then((response) => {
    //   if (response.data.status) {
    //     this.$store.dispatch('user/getCurrentConsumption', response.data).then(() => {
    //       this.currentConsumption = response.data;
    //     });
    //   }
    // });

    // useJwt.getConsumptionDinamic().then((response) => {
    //   if (response.data.status) {
    //     this.$store.dispatch('user/getConsumptionDinamic', response.data).then(() => {
    //       this.currentConsumptionDynamic = response.data;
    //     });
    //   }
    // });
  },

  mounted() {
    useJwt.getCurrenUser().then((response) => {
      if (response.data.status) {
        this.$store.dispatch('user/getUserData', response.data).then(() => {
          this.userData = response.data;
          this.makeOptions();
          this.getSelected();
        });
      }
    });

    useJwt.getBalance().then((response) => {
      if (response.data.status) {
        this.$store.dispatch('user/getBalance', response.data).then(() => {
          this.cardBalance = response.data;
          this.download = true;
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

    // useJwt.getBalance().then((response) => {
    //   if (response.data.status) {
    //     this.$store.dispatch('user/getBalance', response.data).then(() => {
    //       this.cardBalance = response.data;
    //     });
    //   }
    // });
  },

  beforeMount() {
    const userData = JSON.parse(localStorage.getItem('userData'));
    if (userData) {
      this.getInfo = userData;
      return this.getInfo;
    }
    return { data: { status: false } };
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

    getSelected() {
      this.selected = this.userData.contract.number;
    },

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
      useJwt.getCurrentConsumption().then((response) => {
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
    refreshConsumption(card) {
      useJwt.getConsumptionDinamic().then((response) => {
        if (response.data.status) {
          this.currentConsumptionDynamic = response.data;
          this.$refs[card].showLoading = false;
        } else {
          this.showToast();
        }
      });
    },

    // COLOR
    getPopularityColor(num) {
      if (Number(num) > 90) return 'success';
      if (Number(num) > 70) return 'warning';
      if (Number(num) >= 50) return 'info';
      if (Number(num) < 50) return 'danger';
      return 'primary';
    },

    onChange() {
      this.showLoading = true;
      useJwt.changeContract(this.selected.id)
        .then((response) => {
          if (response.status) {
            this.cardBalance = response.data;
            this.showLoading = false;
          }
        });
    },

    // getLimitResidual(limit) {
    //   if (Number(limit.value) > 0 && Number(limit.consumption) > 0) {
    //     const limitResidual = 100 - Number(limit.consumption) / (Number(limit.value) / 100);
    //     return limitResidual;
    //   }
    //   return 5;
    // },

  },

};
</script>

<style lang="scss">
.padding {
  padding-left: 1rem;
  padding-right: 1rem;
}

h4 {
  font-size: 1.2rem !important;
}

h3 {
  font-size: 1.2rem !important;
}

.mix {
  @media (min-width: 550px) {
    flex-direction: row !important;
    justify-content: space-evenly !important;
  }
}

.avg-sessions {
  display: flex !important;
  flex-direction: column !important;
}

.mr-2 mt-1 {
  display: flex;
  width: 90%;
  justify-content: space-around;
}

.margin {
  margin: 3% auto 0 !important;
}

.card-body {
  padding: 1rem !important;
}

.card .card-header {
  padding: 1.5rem !important;
}

.table th {
  padding: 0.72rem 1rem !important;
}

.table td {
  padding: 0.72rem 1rem !important;
}

.vue2leaflet-map {
  &.leaflet-container {
    height: 350px;
  }
}
</style>
