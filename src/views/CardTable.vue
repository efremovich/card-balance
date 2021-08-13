<template>
  <div>
    <b-overlay
      :show="loadDone"
      spinner-variant="primary"
      variant="transparent"
      spinner-medium
      rounded="md">
      <b-row>
        <b-col
          md="2"
          sm="4"
          class="my-1">
          <b-form-group class="mb-0">
            <label
              class="d-inline-block text-sm-left mr-50">Значений на странице
            </label>
            <b-form-select
              id="perPageSelect"
              v-model="perPage"
              size="sm"
              :options="pageOptions"
              class="w-50" />
          </b-form-group>
        </b-col>
        <b-col
          md="4"
          sm="8"
          class="my-1">
          <b-form-group
            label="Сортировка"
            label-cols-sm="3"
            label-align-sm="right"
            label-size="sm"
            label-for="sortBySelect"
            class="mb-0">
            <b-input-group size="sm">
              <b-form-select
                id="sortBySelect"
                v-model="sortBy"
                :options="sortOptions"
                class="w-75">
                <template #first>
                  <option value="">
                    -выберите параметр-
                  </option>
                </template>
              </b-form-select>
            </b-input-group>
          </b-form-group>
        </b-col>
        <b-col
          md="6"
          class="my-1">
          <b-form-group
            label="Найти"
            label-cols-sm="3"
            label-align-sm="right"
            label-size="sm"
            label-for="filterInput"
            class="mb-0">
            <b-input-group size="sm">
              <b-form-input
                id="filterInput"
                v-model="filter"
                type="search"
                placeholder="Поле для поиска" />
              <b-input-group-append>
                <b-button
                  :disabled="!filter"
                  @click="filter = ''">
                  Очистить
                </b-button>
              </b-input-group-append>
            </b-input-group>
          </b-form-group>
        </b-col>
        <b-col cols="12">
          <b-table
            ref="selectableTable"
            :sticky-header="stickyHeader"
            selectable
            :small="small"
            :items="items.data"
            :fields="fields"
            responsive="sm"
            :select-mode="selectMode"
            :per-page="perPage"
            :current-page="currentPage"
            :sort-by.sync="sortBy"
            :sort-desc.sync="sortDesc"
            :sort-direction="sortDirection"
            :filter="filter"
            :filter-included-fields="filterOn"
            @row-selected="onRowSelected"
            @filtered="onFiltered">
            <template

              #cell(selected)="{ rowSelected }">
              <template
                v-if="rowSelected">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="#ea5455"
                  stroke-width="2"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  class="feather feather-check-circle"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" /><polyline points="22 4 12 14.01 9 11.01" /></svg>
              </template>

              <template v-else>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="grey"
                  stroke-width="2"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  class="feather feather-circle"><circle
                    cx="12"
                    cy="12"
                    r="10" /></svg>
              </template>
            </template>

            <template #cell(card_status_id)="data">
              <b-card-text
                class="mb-50 text-info">
                {{ viewStatus(data.item.card_status_id) }}
              </b-card-text>
            </template>

            <template #cell(number)="data">
              <b-col
                md="6"
                xl="4">
                <p class="before">
                  {{ data.item.number }}
                </p>
              </b-col>
            </template>

            <template #cell(limits[0])="data">
              <vue-apex-charts
                type="bar"
                height="200" />

              <b-col class="avg-sessions pt-50">
                <template v-for="(item, index) in data.limit_commons">
                  <b-col
                    :key="index"
                    class="mb-2">
                    <b-card-text class="mb-50 text-info">
                      {{ item.service_id[index] }}
                    </b-card-text>
                    <b-progress
                      :value="item[index].limits.id"
                      :variant="getPopularityColor(item[index].limits.id)"
                      height="6px" />
                  </b-col>
                </template>

                <template
                  v-if="item[index].length>2">
                  <app-collapse
                    id="collapse-1">
                    <app-collapse-item
                      id="collapse-2"
                      title="ещё...  ">
                      <b-col
                        v-for="(item, index) in item.length-2"
                        :key="index+2"

                        class="mb-2">
                        <b-card-text class="mb-50 text-info">
                          АИ-92:   {{ item.limits.id[index+2] }}
                        </b-card-text>
                        <b-progress
                          :value="item[index+2]"
                          :variant="getPopularityColor(item[index+2])"
                          height="6px" />
                      </b-col>
                    </app-collapse-item>
                  </app-collapse>
                </template>
              </b-col>
            </template>
          </b-table>
          <b-col cols="12">
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
          </b-col>
        </b-col>
      </b-row>
    </b-overlay>
  </div>
</template>

<script>
import {
  BTable,
  BRow,
  BProgress,
  BCol,
  BOverlay,
  BFormGroup,
  BFormSelect,
  BPagination,
  BInputGroup,
  BFormInput,
  BInputGroupAppend,
  BButton,
  BCardText,

} from 'bootstrap-vue';
import useJwt from '@/auth/jwt/useJwt';
import VueApexCharts from 'vue-apexcharts';
import AppCollapse from '@core/components/app-collapse/AppCollapse.vue';
import AppCollapseItem from '@core/components/app-collapse/AppCollapseItem.vue';

export default {
  components: {
    BTable,
    BProgress,
    VueApexCharts,
    BRow,
    BOverlay,
    BCol,
    BFormGroup,
    BFormSelect,
    BPagination,
    BInputGroup,
    BFormInput,
    BInputGroupAppend,
    BButton,
    BCardText,
    AppCollapse,
    AppCollapseItem,
  },

  data() {
    return {
      selectMode: [],

      perPage: 5,
      pageOptions: [3, 5, 10],
      totalRows: 1,
      currentPage: 1,
      loadDone: false,
      sortBy: '',
      sortDesc: false,
      filter: null,
      filterOn: [],
      fields: [
        {
          key: 'selected',
          label: '',
        },
        { key: 'number', label: 'номер карты', sortable: true },
        { key: 'limits[0].limit_commons', label: 'лимиты', sortable: true },
        { key: 'card_status_id', label: 'статус', sortable: true },
      ],
      items: [],

      cardStatus: {

        ACTIVE: 'Активна',
        BLOCK: 'Заблокирована',
        BROKEN: 'Неисправна',
        DELETED: 'Удалена',
        FINANCE: 'Финансовая блокировка',
        LOST: 'Утеряна',
        RETURN: 'Сдана',
        SOLD: 'Продана',
      },

      status: [
        {
          1: 'ACTIVE',
          2: 'FINANCE',
          3: 'BROKEN',
          4: 'BLOCK',
          5: 'RETURN',
        },
        {
          1: 'primary',
          2: 'success',
          3: 'danger',
          4: 'warning',
          5: 'info',
        },
      ],
    };
  },

  computed: {
    // statusVariant(value) {
    //   const statusColor = {
    //     /* eslint-disable key-spacing */
    //     ACTIVE: 'primary',
    //     FINANCE: 'success',
    //     BROKEN: 'danger',
    //     BLOCK: 'warning',
    //     RETURN: 'info',
    //     /* eslint-enable key-spacing */
    //   };

    //   return statusColor[value];
    // },

  },

  beforeMount() {
    this.getAllCards();
  },
  mounted() {
    // Set the initial number of items
    this.totalRows = this.items.data.data.length;
  },

  methods: {
    viewStatus(value) {
      return this.cardStatus[value];
    },

    statusVariant(value) {
      const statusColor = {
        /* eslint-disable key-spacing */
        ACTIVE: 'text-primary',
        FINANCE: 'text-success',
        BROKEN: 'text-danger',
        BLOCK: 'text-warning',
        RETURN: 'text-info',
        /* eslint-enable key-spacing */
      };

      return statusColor[value];
    },

    getAllCards() {
      const ID = this.contractId;
      this.busy = true;
      this.loadDone = true;
      useJwt.getCardsDate(`contract_id=${ID}`).then((response) => {
        if (response.data.status) {
          this.items = response.data;
          this.totalRows = this.items.data.length;
          console.log(this.items.data);
        }
        this.loadDone = false;
      });
    },
    getPopularityColor(num) {
      if (Number(num) > 90) return 'success';
      if (Number(num) > 50) return 'secondary';
      if (Number(num) >= 30) return 'warning';
      if (Number(num) < 30) return 'danger';
      return 'primary';
    },
    onFiltered(filteredItems) {
      this.totalRows = filteredItems.length;
      this.currentPage = 1;
    },
  },
};
</script>

<style>
.table.b-table > tbody .b-table-row-selected.table-active td {
  background-color: #283046 !important;
}
.card {
  border-radius: 5px !important;
}
.pad {
  padding-bottom:0.2%;
  padding-left:0.1%;
}
.card .card-header {
  padding: 1rem !important;
}
.row td {
  height: 202px !important;
}
.table td {
  padding: 0.72rem 0rem !important;
}
td:first-child {
  width: 1px !important;
  padding: 10px !important;
}
td:nth-child(2) {
  width: 15% !important;
}
.mb-2,
.pt-50 {
  padding-left: 0 !important;
  padding-right: 0 !important;
}
.card .card-img-overlay.bg-overlay {
  display: flex;
  align-items: flex-end;
  justify-content: flex-end;
}
.shadow {
  color: black;
  font-size: 1rem !important;
  letter-spacing: 1.5px !important;
  position: relative !important;
  bottom: 4% !important;
}
.col-xl-4 {
  padding: 1rem 0 0 !important;
}
.before {
  margin-right: 15px;
  display: flex;
  font-size: 13px;
}
.before::before {
  content: "💳";
  text-align: center;
  filter: grayscale(100%);
  margin-right: 10px;
}
</style>
