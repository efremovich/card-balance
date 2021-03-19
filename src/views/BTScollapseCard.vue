<template>
  <div>
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
            <!-- <b-form-select
              v-model="sortDesc"
              size="sm"
              :disabled="!sortBy"
              class="w-25"
            >
              <option :value="false">
                Asc
              </option>
              <option :value="true">
                Desc
              </option>
            </b-form-select> -->
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
        <!--NEW -->

        <b-table
          ref="selectableTable"
          selectable
          select-mode="single"
          :items="items"
          :fields="fields"
          responsive="sm"

          :per-page="perPage"
          :current-page="currentPage"
          :sort-by.sync="sortBy"
          :sort-desc.sync="sortDesc"
          :sort-direction="sortDirection"
          :filter="filter"
          :filter-included-fields="filterOn"
          @row-selected="onRowSelected"
          @row-clicked="onRowClicked"
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

          <template #cell(status)="data">
            <b-card-text class="mb-50 text-info">
              {{ data.item.status }}
            </b-card-text>
          </template>

          <template #cell(number)="data">
            <b-col
              md="6"
              xl="4">
              <!-- <b-card
                :img-src="require('@/assets/images/icons/NNK.svg')"
                overlay
                text-variant="white"
                img-alt="card img"
                body-class="bg-overlay"
              > -->
              <!-- <div class="d-flex">
                <i class="feather icon-credit-card primary" /> -->
              <p class="before">
                {{ data.item.number }}
              </p>
              <!-- </div> -->

              <!-- </b-card> -->
            </b-col>
          </template>

          <template #cell(age)="data">
            <vue-apex-charts
              type="bar"
              height="200" />

            <b-col class="avg-sessions pt-50">
              <!-- TEMPLATE -->
              <template v-for="(item, index) in 2">
                <b-col
                  :key="index"
                  class="mb-2">
                  <b-card-text class="mb-50 text-info">
                    АИ-92:   {{ data.item.age[index] }}л.
                  </b-card-text>
                  <b-progress
                    :value="data.item.age[index]"
                    :variant="getPopularityColor(data.item.age[index])"
                    height="6px" />
                </b-col>
              </template>

              <template v-if="data.item.age.length>2">
                <b-collapse id="1">
                  <b-card-body>
                    <b-col
                      v-for="(item, index) in data.item.age.length-2"
                      :key="index+2"

                      class="mb-2">
                      <b-card-text class="mb-50 text-info">
                        АИ-92:   {{ data.item.age[index+2] }}
                      </b-card-text>
                      <b-progress
                        :value="data.item.age[index+2]"
                        :variant="getPopularityColor(data.item.age[index+2])"
                        height="6px" />
                    </b-col>
                  </b-card-body>
                </b-collapse>
              </template>
            </b-col>
          </template>
        </b-table>
        <b-col cols="12">
          <b-pagination
            v-model="currentPage"
            :total-rows="totalRows"
            :per-page="perPage"
            align="center"
            size="sm"
            class="my-0" />
        </b-col>

        <!-- end -->
      </b-col>
    </b-row>
  </div>
</template>

<script>
import {
  BTable,
  BRow,
  BProgress,
  BCol,
  BFormGroup,
  BFormSelect,
  BPagination,
  BInputGroup,
  BFormInput,
  BInputGroupAppend,
  BButton,
  BCardText,
  VBToggle,
  BCollapse,
} from 'bootstrap-vue';
import VueApexCharts from 'vue-apexcharts';
// import AppCollapse from '@core/components/app-collapse/AppCollapse.vue';
// import AppCollapseItem from '@core/components/app-collapse/AppCollapseItem.vue';
import Ripple from 'vue-ripple-directive';

export default {
  components: {
    BTable,
    BProgress,
    VueApexCharts,
    BRow,
    BCol,
    BFormGroup,
    BFormSelect,
    BPagination,
    BInputGroup,
    BFormInput,
    BInputGroupAppend,
    BButton,
    BCardText,
    // AppCollapse,
    // AppCollapseItem,
    BCollapse,
    // VBToggle,
  },

  directives: {
    'b-toggle': VBToggle,
    Ripple,

  },
  data() {
    return {
      selected: [],
      limits: ['10', '60', '80', '100'],
      perPage: 5,
      pageOptions: [3, 5, 10],
      totalRows: 1,
      currentPage: 1,
      sortBy: '',
      sortDesc: false,
      filter: null,
      filterOn: [],
      infoModal: {
        id: 'info-modal',
        title: '',
        content: '',
      },
      fields: [
        {
          key: 'selected',
          label: '',
        },

        { key: 'number', label: 'номер карты', sortable: true },
        { key: 'age', label: 'лимиты', sortable: true },
        // { key: 'information', label: 'информация' },

        { key: 'status', label: 'статус', sortable: true },
      ],

      items: [
        {
          number: '7824861010059713787',
          age: ['101', '5', '1', '80', '40'],

        },
        {
          number: '7824861010059713787',
          age: ['9', '90'],

        },
        {
          number: '7824861010059713787',
          age: ['55', '1', '20'],
        },
      ],

      statusColor: [
        {
          1: 'ACTIVE',
          2: 'FINANCE',
          3: 'BROKEN',
          4: 'BLOCK',
          5: 'RETURN',
        },
        {
          1: 'light-primary',
          2: 'light-success',
          3: 'light-danger',
          4: 'light-warning',
          5: 'light-info',
        },
      ],
    };
  },
  computed: {
    sortOptions() {
      // Create an options list from our fields
      return this.fields
        .filter((f) => f.sortable)
        .map((f) => ({ text: f.label, value: f.key }));
    },
    getStatus() {
      // eslint-disable-next-line no-undef
      return this.cardStatus[data.item.status];
    },
  },
  mounted() {
    // Set the initial number of items
    this.totalRows = this.items.length;
  },
  methods: {
    info(item, index, button) {
      this.infoModal.title = `Row index: ${index}`;
      this.infoModal.content = JSON.stringify(item, null, 2);
      this.$root.$emit('bv::show::modal', this.infoModal.id, button);
    },
    resetInfoModal() {
      this.infoModal.title = '';
      this.infoModal.content = '';
    },

    onRowClicked(selectedItems, index) {
      const n = Array.from(document.querySelectorAll('.collapse'));
      console.log(selectedItems);
      // const c = n[index].classList.add('ddd');
      console.log(n[index]);
    },

    getPopularityColor(num) {
      if (Number(num) > 90) return 'success';
      if (Number(num) > 50) return 'secondary';
      if (Number(num) >= 30) return 'warning';
      if (Number(num) < 30) return 'danger';
      return 'primary';
    },

    onFiltered(filteredItems) {
      // Trigger pagination to update the number of buttons/pages due to filtering
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

/*
 */

/* .card .card-body,
.card-header {
  background-color: darkslategrey !important;
} */

.card {
  border-radius: 5px !important;
}

.tbody tr {
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
}

.before::before {
  content: "💳";
  text-align: center;
  filter: grayscale(100%);
  margin-right: 10px;
}
</style>
