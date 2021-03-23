<template>
  <div>
    <div class="column">
      <div class="row">
        <b-col md="6">
          <b-card-actions
            ref="refreshCard"
            title="Информация по договору"
            action-refresh
            @refresh="refreshStop('refreshCard')">
            <hr>
            <b-card-text fluid>
              <h3>
                Баланс: <span> {{ cardBalance.contract.balance }} ₽ </span>
              </h3>
              <h5 v-if="cardBalance.contract.company.deposit !== 0">
                Допустимая задолженность:
                <span class="text-danger h5">  {{ cardBalance.contract.deposit }} ₽ </span>
              </h5>
              <div class="d-flex flex-column">
                <!-- <h3>Договор №</h3> -->
                <v-select
                  v-model="selected"
                  :dir="$store.state.appConfig.isRTL ? 'rtl' : 'ltr'"
                  label="title"
                  :options="getOptions"
                  class="w-100 mt-1 mb-1"
                  @input="changeContracts" />
              </div>
              <h4>Статус: {{ userData.contract.status }} </h4>
              <h4>От: {{ userData.contract.date }}</h4>
              <b-button
                v-ripple.400="'rgba(255, 255, 255, 0.15)'"
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
        </b-col>
        <b-col md="6">
          <b-card-actions
            ref="refreshCard"
            title="Остатки топлива по контракту:"
            action-refresh
            @refresh="refreshStop('refreshCard')">
            <vue-apex-charts
              type="bar"
              height="200" />
            <hr>

            <b-row class="avg-sessions pt-50">
              <!-- TEMPLATE -->
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
        </b-col>
      </div>
      <div class="row">
        <b-col md="6">
          <b-card-actions
            ref="refreshCard"
            title="Расход за текущий месяц:"
            action-refresh
            @refresh="refreshStop('refreshCard')">
            <hr>
            <div class="d-flex justify-content-between">
              <h4>{{ getDate }}:</h4>
              <h4 class="text-danger">
                {{ currentConsumptionDynamic.consumptionData.this_month }}
              </h4>
            </div>
            <div class="d-flex justify-content-between align-items-end">
              <h4>Последние изменения по договору:</h4>
              <h4 class="text-info">
                {{ userData.contract.updated }}
              </h4>
            </div>
            <b-table
              hover
              responsive="sm"
              :items="currentConsumption.currentConsumption"
              :fields="fields" />
          </b-card-actions>
        </b-col>

        <b-col md="6">
          <b-card-actions
            ref="refreshCard"
            title="Статистика по картам"
            action-refresh
            @refresh="refreshStop('refreshCard')">
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
                <h4 class="text-succes">
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
                <h4>
                  {{ getNotActiveCard }}
                </h4>
              </div>
            </div>
          </b-card-actions>
        </b-col>

        <b-row class="padding">
          <b-card-actions
            ref="refreshCard"
            action-close
            action-refresh
            action-collapse
            title="Данные организации:">
            <hr>
            <div class="d-flex flex-column">
              <h3>Название: &#8195; {{ cardBalance.contract.company.full_name }}</h3>
              <h3>ИНН: &#8195; {{ cardBalance.contract.company.inn }}</h3>
              <h3>
                Почтовый адрес: &#8195;
                {{ cardBalance.contract.company.legal_address }}
              </h3>
            </div>
          </b-card-actions>
        </b-row>
      </div>

      <!--Statistics -->
      <b-card-actions
        ref="refreshCard"
        action-close
        action-refresh
        action-collapse
        title="Динамика потребления"
        @refresh="refreshStop('refreshCard')">
        <hr>
        <b-card-body class="pb-0">
          <div class="d-flex flex-column mb-3">
            <div class="mr-2 mt-1">
              <b-card-text class="mb-50">
                В этом месяце:
              </b-card-text>
              <h3 class="font-weight-bolder">
                <span class="text-primary">{{ currentConsumptionDynamic.consumptionData.this_month }} ₽</span>
              </h3>
            </div>
            <div class="mr-2 mt-1">
              <b-card-text class="mb-50">
                В прошлом месяце:
              </b-card-text>
              <h3 class="font-weight-bolder">
                <span>{{ currentConsumptionDynamic.consumptionData.last_month }} ₽</span>
              </h3>
            </div>
            <div class="mr-2 mt-1">
              <b-card-text class="mb-50">
                Два месяца назад :
              </b-card-text>
              <h3 class="font-weight-bolder">
                <span>{{ currentConsumptionDynamic.consumptionData.other_month }} ₽</span>
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
      <!--end statistic -->
    </div>

    <!-- GEO-->
    <b-card-actions
      ref="refreshCard"
      action-close
      action-refresh
      action-collapse
      title="Места потребления:"
      @refresh="refreshStop('refreshCard')">
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
    <!--GEO-->
  </div>
</template>

<script>

import BCardActions from '@core/components/b-card-actions/BCardActions.vue';
// GEO
import {
  LMap, LTileLayer, LMarker, LCircle,
} from 'vue2-leaflet';
// import { Icon } from 'leaflet'
import 'leaflet/dist/leaflet.css';

// end GEO
import vSelect from 'vue-select';

import VueApexCharts from 'vue-apexcharts';
import { ru } from 'apexcharts/dist/locales/ru.json';

import { $themeColors } from '@themeConfig';
import { Icon } from 'leaflet';
import {
  BCardText, BCol, BButton, BTable, BProgress,
} from 'bootstrap-vue';
// import useJwt from '../@core/auth/jwt/useJwt';
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
    BCardText,
    vSelect,
    BButton,
    BTable,
    BProgress,
    VueApexCharts,
    // GEO
    LMap,
    LTileLayer,
    LMarker,
    LCircle,
    // formatDate,
  },
  data() {
    return {
      getInfo: null,
      userInfo: null,
      selectContract: null,
      axiosIns: null,
      cardBalance: null,
      option: [],
      items: [{ 'currentConsumption.service.full_name': '1' }],
      statisticsData: null,
      currentConsumption: null,
      consumptionDinamic: null,
      currentConsumptionDynamic: null,
      selected: 'Выберете договор',
      selectedIndex: 1,
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
            categories: ['01', '05', '09', '13', '17', '21', '26', '31'],
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
                return val > 999 ? `${(val / 1000).toFixed(0)}k` : val;
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

    getDate() {
      const date = new Date();
      const formatDate = (value, formatting = { month: 'long' }, locale = 'ru-RU') => {
        if (!value) return value;
        return new Intl.DateTimeFormat(locale, formatting).format(new Date(value));
      };
      return formatDate(date);
    },
    getActiveCard() {
      return this.cardBalance.card_statistic.filter((status) => status.card_status.code === 'ACTIVE').length;
    },

    getNotActiveCard() {
      return this.cardBalance.card_statistic.filter((status) => status.card_status.code !== 'ACTIVE').length;
    },
    getOptions() {
      return this.userData.contracts.map((el) => el.number);
    },
  },
  created() {
    useJwt.getCurrenUser().then((response) => {
      if (response.data.status) {
        this.$store.dispatch('user/getUserData', response.data).then(() => {
          this.userData = response.data;
          // console.log(this.userData);
        });
      }
    });
  },
  mounted() {
    useJwt.getConsumptionDinamic().then((response) => {
      if (response.data.status) {
        this.currentConsumptionDynamic = response.data;
        // console.log(this.currentConsumptionDynamic);
      }
    });
    useJwt.getCardStatistic().then((response) => {
      if (response.data.status) {
        this.statisticsData = response.data;
        console.log(this.statisticsData);
      }
    });

    useJwt.getCurrentConsumption().then((response) => {
      if (response.data.status) {
        this.currentConsumption = response.data;
        // console.log(this.currentConsumption);
      }
    });

    useJwt.getBalance().then((response) => {
      if (response.data.status) {
        this.cardBalance = response.data;
        // console.log(this.cardBalance);
      }
    });
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
    // stop refreshing card in 3 sec
    refreshCardStatistic(card) {
      this.dispatchStoreData('DashBoardData/getConsumptionDinamic', {
        cid: this.activeUserInfo.contract.id,
      }).then((this.$refs[card].showLoading = false));
    },
    // COLOR
    getPopularityColor(num) {
      if (Number(num) > 90) return 'success';
      if (Number(num) > 70) return 'warning';
      if (Number(num) >= 50) return 'info';
      if (Number(num) < 50) return 'danger';
      return 'primary';
    },

    // onChange(event) {
    //   const index = this.getInfo.contracts.map((el) => el.number).indexOf(event);
    //   this.selectedIndex = index;
    // },

    changeContracts() {
      useJwt.changeContract()
        .then((response) => {
          // console.log(response);
          if (response.status) {
            this.selectContract = response.data;
            console.log(this.selectContract);
          }
        });
    },

    getLimitResidual(limit) {
      if (Number(limit.value) > 0 && Number(limit.consumption) > 0) {
        const limitResidual = 100 - Number(limit.consumption) / (Number(limit.value) / 100);
        return limitResidual;
      }
      return 5;
    },

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
