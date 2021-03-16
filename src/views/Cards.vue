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
          :items="items"
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
          <template #cell(selected)="{ rowSelected }">
            <template v-if="rowSelected">
              <i class="feather icon-check-circle primary" />
            </template>

            <template v-else>
              <i class="feather icon-circle" />
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
              <template v-for="(item, index) in data.item.age">
                <b-col
                  :key="index"
                  class="mb-2">
                  <b-card-text class="mb-50 text-info">
                    АИ-92: {{ data.item.age }}л.
                  </b-card-text>
                  <b-progress
                    :value="data.item.age"
                    :variant="getPopularityColor(data.item.age)"
                    height="6px" />
                </b-col>

                <template v-if="index > 1">
                  <app-collapse :key="index + 1">
                    <app-collapse-item title="yet anoter">
                      <b-col
                        :key="index + 1"
                        class="mb-2">
                        <b-card-text class="mb-50 text-info">
                          АИ-92: {{ data.item.age }}л.
                        </b-card-text>
                        <b-progress
                          :value="data.item.age"
                          :variant="getPopularityColor(data.item.age)"
                          height="6px" />
                      </b-col>
                    </app-collapse-item>
                  </app-collapse>
                </template>
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
} from 'bootstrap-vue';
import VueApexCharts from 'vue-apexcharts';
import AppCollapse from '@core/components/app-collapse/AppCollapse.vue';
import AppCollapseItem from '@core/components/app-collapse/AppCollapseItem.vue';

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
    AppCollapse,
    AppCollapseItem,
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

      cardStatus: {
        1: 'Активна',
        2: 'Заблокирована',
        4: 'Неисправна',
        5: 'Удалена',
        3: 'Финансовая блокировка',
        LOST: 'Утеряна',
        RETURN: 'Сдана',
        SOLD: 'Продана',
      },
      items: [
        {
          // eslint-disable-next-line global-require
          avatar: require('@/assets/images/avatars/10-small.png'),
          full_name: "Korrie O'Crevy",
          post: 'Nuclear Power Engineer',
          email: 'kocrevy0@thetimes.co.uk',
          city: 'Krasnosilka',
          start_date: '09/23/2016',
          number: '7824861010059713787',
          age: '70',
          experience: '1 Year',
          status: 2,
        },
        {
          // eslint-disable-next-line global-require
          avatar: require('@/assets/images/avatars/1-small.png'),
          full_name: 'Bailie Coulman',
          post: 'VP Quality Control',
          email: 'bcoulman1@yolasite.com',
          city: 'Hinigaran',
          start_date: '05/20/2018',
          number: '7824861010059713787',
          age: '30',
          experience: '3 Years',
          status: 2,
        },
        {
          // eslint-disable-next-line global-require
          avatar: require('@/assets/images/avatars/9-small.png'),
          full_name: 'Stella Ganderton',
          post: 'Operator',
          email: 'sganderton2@tuttocitta.it',
          city: 'Golcowa',
          start_date: '03/24/2018',
          number: '7824861010059713787',
          age: '66',
          experience: '6 Years',
          status: 5,
        },
        {
          // eslint-disable-next-line global-require
          avatar: require('@/assets/images/avatars/3-small.png'),
          full_name: 'Dorolice Crossman',
          post: 'Cost Accountant',
          email: 'dcrossman3@google.co.jp',
          city: 'Paquera',
          start_date: '12/03/2017',
          number: '7824861010059713787',
          age: '22',
          experience: '2 Years',
          status: 2,
        },
        {
          // eslint-disable-next-line global-require
          avatar: require('@/assets/images/avatars/4-small.png'),
          full_name: 'Harmonia Nisius',
          post: 'Senior Cost Accountant',
          email: 'hnisius4@gnu.org',
          city: 'Lucan',
          start_date: '08/25/2017',
          number: '7824861010059713787',
          age: '91',
          experience: '3 Years',
          status: 2,
        },
        {
          // eslint-disable-next-line global-require
          avatar: require('@/assets/images/avatars/5-small.png'),
          full_name: 'Genevra Honeywood',
          post: 'Geologist',
          email: 'ghoneywood5@narod.ru',
          city: 'Maofan',
          start_date: '06/01/2017',
          number: '7824861010059713787',
          age: '101',
          experience: '1 Year',
          status: 1,
        },
        {
          // eslint-disable-next-line global-require
          avatar: require('@/assets/images/avatars/7-small.png'),
          full_name: 'Eileen Diehn',
          post: 'Environmental Specialist',
          email: 'ediehn6@163.com',
          city: 'Lampuyang',
          start_date: '10/15/2017',
          number: '7824861010059713787',
          age: '9',
          experience: '9 Years',
          status: 3,
        },
        {
          // eslint-disable-next-line global-require
          avatar: require('@/assets/images/avatars/9-small.png'),
          full_name: 'Richardo Aldren',
          post: 'Senior Sales Associate',
          email: 'raldren7@mtv.com',
          city: 'Skoghall',
          start_date: '11/05/2016',
          number: '7824861010059713787',
          age: '55',
          experience: '5 Years',
          status: 3,
        },
        {
          // eslint-disable-next-line global-require
          avatar: require('@/assets/images/avatars/2-small.png'),
          full_name: 'Allyson Moakler',
          post: 'Safety Technician',
          email: 'amoakler8@shareasale.com',
          city: 'Mogilany',
          start_date: '12/29/2018',
          number: '7824861010059713787',
          age: '39',
          experience: '9 Years',
          status: 5,
        },
        {
          // eslint-disable-next-line global-require
          avatar: require('@/assets/images/avatars/6-small.png'),
          full_name: 'Merline Penhalewick',
          post: 'Junior Executive',
          email: 'mpenhalewick9@php.net',
          city: 'Kanuma',
          start_date: '04/19/2019',
          number: '7824861010059713787',
          age: '23',
          experience: '3 Years',
          status: 2,
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
  background-color: darkslategrey !important;
}

.table td {
  padding: 0.72rem 0rem !important;
}

td:first-child {
  width: 1px !important;
  padding: 10px 20px !important;
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
