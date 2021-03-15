<template>
  <div>
    <div class="column">
      <div class="row">
        <b-col md="6">

          <b-card-actions
            ref="refreshCard"
            title="Информация по договору"
            action-refresh
            @refresh="refreshStop('refreshCard')"
          >
            <b-card-text
              fluid
            >

              <h3>Баланс: <span> {{ value }}  ₽ </span></h3>
              <h5>Допустимая задолженность: <span class="text-danger h6"> {{ - value }}  ₽ </span> </h5>
              <div
                class="d-flex justify-content-between"
              >
                <h3> Договор № </h3>
                <v-select
                  v-model="selected"
                  :dir="$store.state.appConfig.isRTL ? 'rtl' : 'ltr'"
                  label="title"
                  :options="option"
                  class="w-50"
                />

              </div>
              <h4> Статус: {{ value }} </h4>
              <h4> Дата начала: {{ value }} </h4>
              <b-button
                v-ripple.400="'rgba(255, 255, 255, 0.15)'"
                variant="warning"
                class="d-flex align-items-center"
              >
                <feather-icon
                  size="2x"
                  icon="PlusIcon"
                  class="mr-50"
                />
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
            @refresh="refreshStop('refreshCard')"
          >

            <vue-apex-charts
              type="bar"
              height="200"
            />

            <hr>

            <b-row class="avg-sessions pt-50">
              <!-- TEMPLATE -->
              <template v-for="(item,index) in limits">
                <b-col
                  :key="index"
                  class="mb-2"
                >
                  <b-card-text class="mb-50 text-info">
                    АИ-92:  {{ item }} л.
                  </b-card-text>
                  <b-progress
                    :value="item"
                    :variant="getPopularityColor(item)"
                    height="6px"
                  />
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
            title="Расход за текущий месяц"
            action-refresh
            @refresh="refreshStop('refreshCard')"
          >
            <div
              class="d-flex justify-content-between"
            >
              <h4>{{ getDate }}:
              </h4>
              <h4 class="text-danger">
                4055054 ₽
              </h4>

            </div>
            <div class="d-flex justify-content-between align-items-end">
              <h4>Последние изменения по договору:
              </h4>
              <h4 class="text-info">
                20/02/2021
              </h4>
            </div>
            <b-table
              striped
              hover
              :items="items"
              :fields="fields"
            />

          </b-card-actions>
        </b-col>

        <b-col md="6">
          <b-card-actions
            ref="refreshCard"
            title="Статистика по картам"
            action-refresh
            @refresh="refreshStop('refreshCard')"
          >

            <div class="mt-1">
              <template v-for="(item,index) in statistics">
                <div
                  :key="index"
                  class="d-flex justify-content-between"
                >
                  <h4 :key="index">
                    {{ item }}
                  </h4>
                  <h4 :key="index">
                    {{ value }}
                  </h4>
                </div>

              </template>

            </div></b-card-actions>
        </b-col>

        <b-row class="padding">
          <b-card-actions
            ref="refreshCard"
            action-close
            action-refresh
            action-collapse
            title="Данные организации:"
          >

            <div class="d-flex flex-column">
              <h3>Название: {{ organization_data.name }}</h3>
              <h3> Почтовый адрес: <br> {{ organization_data.post }}</h3>
              <h3> ИНН: {{ organization_data.id.number }}</h3>

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

        @refresh="refreshStop('refreshCard')"
      >

        <b-card-body class="pb-0">
          <div class="d-flex justify-content-start mb-3">
            <div class="mr-2 mt-1">
              <b-card-text class="mb-50">
                В этом месяце:
              </b-card-text>
              <h3 class="font-weight-bolder">
                <sup class="font-medium-1">₽ </sup>
                <span class="text-primary">{{ revenue.thisMonth }}</span>
              </h3>
            </div>
            <div class="mr-2 mt-1">
              <b-card-text class="mb-50">
                В прошлом месяце:
              </b-card-text>
              <h3 class="font-weight-bolder">
                <sup class="font-medium-1">₽ </sup>
                <span>{{ revenue.lastMonth }}</span>
              </h3>
            </div>
          </div>

          <!-- apex chart -->
          <vue-apex-charts
            type="line"
            height="240"
            :options="revenueComparisonLine.chartOptions"
            :series="revenueComparisonLine.series"
          />
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
      @refresh="refreshStop('refreshCard')"
    >

      <div class="mt-1">
        <l-map
          :zoom="zoom"
          :center="center"
        >
          <l-tile-layer :url="url" />
          <l-marker :lat-lng="markerLatLng" />
          <l-circle
            :lat-lng="circle.center"
            :radius="circle.radius"
            :color="circle.color"
          />
        </l-map>
      </div>
    </b-card-actions>
    <!--GEO-->
  </div>

</template>

<script>
import BCardActions from '@core/components/b-card-actions/BCardActions.vue'

// GEO
import {
  LMap, LTileLayer, LMarker, LCircle,
} from 'vue2-leaflet'
// import { Icon } from 'leaflet'
import 'leaflet/dist/leaflet.css'

// end GEO
import vSelect from 'vue-select'
import VueApexCharts from 'vue-apexcharts'
import { $themeColors } from '@themeConfig'
import { Icon } from 'leaflet'
import {
  BCardText,
  BCol,
  BButton,
  BTable,
  BProgress,
} from 'bootstrap-vue'

// eslint-disable-next-line no-underscore-dangle
delete Icon.Default.prototype._getIconUrl
Icon.Default.mergeOptions({
  // eslint-disable-next-line global-require
  iconRetinaUrl: require('leaflet/dist/images/marker-icon-2x.png'),
  // eslint-disable-next-line global-require
  iconUrl: require('leaflet/dist/images/marker-icon.png'),
  // eslint-disable-next-line global-require
  shadowUrl: require('leaflet/dist/images/marker-shadow.png'),
})

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
    //

  },

  data() {
    return {
      value: 100,
      selected: [],
      option: [1, 2, 3],
      fields: ['Товар', 'Количество', 'Сумма'],
      statistics: ['Всего карт:', 'Активно:', 'Заблокировано:'],

      organization_data: {
        name: 'АБВГД',
        post: '241050, Брянская обл, Брянск г, Красноармейская ул, дом № 128, офис 314',
        id: {
          number: '2308240961',
        },
      },
      limits: ['10', '60', '80', '100'],
      // progress-bar

      bars: [
        { variant: 'success', value: 75 },
        { variant: 'info', value: 75 },
        { variant: 'warning', value: 75 },
        { variant: 'danger', value: 75 },
        { variant: 'primary', value: 75 },
      ],
      // end progress-bar

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
        series: [
          {
            name: 'This Month',
            data: [45000, 47000, 44800, 47500, 45500, 48000, 46500, 48600],
          },
          {
            name: 'Last Month',
            data: [46000, 48000, 45500, 46600, 44500, 46500, 45000, 47000],
          },
        ],
        chartOptions: {
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
                return val > 999 ? `${(val / 1000).toFixed(0)}k` : val
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

    }
  },

  computed: {
    getDate() {
      const Data = new Date()
      const Month = Data.getMonth()
      const monthRU = ['Январь', 'Февраль', 'Март', 'Апрель', 'Май', 'Июнь', 'Июль', 'Август', 'Сентябрь', 'Октябрь', 'Ноябрь', 'Декабрь']
      return monthRU[Month]
    },
  },
  created() {
    this.$http.get('/card/card-analytics/revenue').then(res => { this.revenue = res.data })
  },

  methods: {

    // stop refreshing card in 3 sec
    refreshStop(cardName) {
      setTimeout(() => {
        this.$refs[cardName].showLoading = false
      }, 3000)
    },
    // COLOR
    getPopularityColor(num) {
      if (Number(num) > 90) return 'success'
      if (Number(num) > 70) return 'warning'
      if (Number(num) >= 50) return 'info'
      if (Number(num) < 50) return 'danger'
      return 'primary'
    },
  },

  getLimitResidual(limit) {
    if (Number(limit.value) > 0 && Number(limit.consumption) > 0) {
      const limitResidual = 100 - Number(limit.consumption) / (Number(limit.value) / 100)
      return limitResidual
    }
    return 5
  },

}

</script>

<style lang="scss">
.padding {
  padding-left: 1rem;
  padding-right: 1rem;
}

.card .card-header {
  padding: 1.5rem !important;
}

.table th {
  padding: 0.72rem 1rem !important;
}

.vue2leaflet-map {
  &.leaflet-container {
    height: 350px;
  }
}
</style>
