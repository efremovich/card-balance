<template>
  <b-overlay
    :show="!loadDone"
    spinner-type="grow"
    spinner-variant="primary"
    spinner-medium
    variant="transparent"
    blur="5px"
    opacity=".75"
    rounded="md">
    <div v-if="loadDone">
      <b-card title="Заявки">
        <b-card-body>
          <div class="d-flex justify-content-between  flex-wrap  align-items-end">
            <b-form-group
              label-align-sm="left"
              label-size="sm"
              label-for="filterInput"
              class="mb-1">
              <p class="mt-1">
                История заявок за период:
              </p>
              <flat-pickr
                v-model="rangeDate"
                size="sm"
                class="form-control mb-0"
                :config="config"
                @on-change="selectDate" />

              <div
                class="d-flex flex-column">
                <p class="mt-1">
                  Выберете карту:
                </p>
                <b-overlay
                  :show="busy"
                  rounded="xs"
                  opacity="0.1"
                  variant="secondary">
                  <template #overlay>
                    <div class="d-flex align-items-center">
                      <b-spinner
                        style="width: 1rem; height: 1rem;"
                        type="grow"
                        variant="secondary" />
                      <b-spinner
                        type="grow"
                        style="width: 1.5rem; height: 1.5rem;"
                        variant="dark" />
                      <b-spinner
                        style="width: 1rem; height: 1rem;"
                        type="grow"
                        variant="secondary" />
                      <span class="sr-only">Данные загружаются</span>
                    </div>
                  </template>
                  <v-select
                    v-model="selected"
                    :disabled="busy"
                    :options="option"
                    class="w-100 mb-1" />
                </b-overlay>
              </div>
            </b-form-group>

            <!-- filter -->
            <b-form-group

              class="mt-2">
              <b-input-group size="sm">
                <b-form-input
                  id="filterInput"
                  v-model="filter"
                  placeholder="Найти"
                  type="search" />
                <b-input-group-append>
                  <b-button
                    :disabled="!filter"
                    @click="filter = ''">
                    Очистить
                  </b-button>
                </b-input-group-append>
              </b-input-group>
            </b-form-group>
          </div>
        </b-card-body>

        <b-table
          hover
          :item="requests.data.result"
          responsive
          :per-page="perPage"
          :current-page="currentPage"
          class="position-relative table-hover text-center"
          :fields="fields" />
      </b-card>
    </div>
  </b-overlay>
</template>

<script>
import {
  BCard, BTable, BFormGroup,
  BFormInput, BCardBody, BButton, BInputGroup, BInputGroupAppend, BOverlay, BSpinner,
} from 'bootstrap-vue';
import vSelect from 'vue-select';
import { mapGetters } from 'vuex';
import flatPickr from 'vue-flatpickr-component';
import { Russian } from 'flatpickr/dist/l10n/ru';
import ToastificationContent from '@core/components/toastification/ToastificationContent.vue';
import useJwt from '../../auth/jwt/useJwt';

export default {
  components: {
    BCard,
    flatPickr,
    BTable,
    BFormGroup,
    BFormInput,
    BCardBody,
    BButton,
    BInputGroup,
    BInputGroupAppend,
    vSelect,
    BOverlay,
    BSpinner,
  },
  data() {
    return {
      loadDone: false,
      perPage: 5,
      pageOptions: [3, 5, 10],
      totalRows: null,
      rangeDate: [],
      contract: null,
      contractId: null,
      selected: null,
      start: null,
      end: null,
      filter: null,
      option: [],
      currentPage: 1,
      requests: null,
      config: {
        mode: 'range',
        maxDate: 'today',
        locale: Russian,
        dateFormat: 'd.m.Y',
      },
      fields: [
        {
          key: 'UpdatedAt',
          label: 'Дата заявки',
          sortable: true,
        },
        {
          key: 'request_status.name',
          label: 'Статус заявки',
          sortable: true,
        },
        {
          key: 'request_type.name',
          label: 'Тип заявки',
          sortable: true,
        },
        {
          key: 'card_number',
          label: 'Номер карты',
          sortable: true,
        },
      ],

    };
  },
  computed: {
    ...mapGetters({
      gotSelectedContract: 'CONTRACT_ID',
    }),
  },
  watch: {
    gotSelectedContract(val) {
      this.getAllCards(val);
      this.contractId = val;
    },
    selected(val) {
      this.loadDone = false;
      const date = this.rangeDate;
      const [start, end] = date;
      console.log(start, end);
      if (val !== null) {
        useJwt.GetRequests(`contract_id=${this.contractId}&startDate=${start}&endDate=${end}&card_number=${val}`).then((response) => {
          if (response.data.status) {
            this.requests = response.data;
            if (this.requests.data.result < 1) {
              this.$toast({
                component: ToastificationContent,
                props: {
                  title: 'Отсутствуют заявки по карте за выбранный период',
                  icon: 'AlertTriangleIcon',
                  variant: 'danger',
                },
              });
            }
          }
        });
      } else {
        useJwt.GetRequests(`contract_id=${this.contractId}&startDate=${start}&endDate=${end}`).then((response) => {
          if (response.data.status) {
            this.requests = response.data;
            if (this.requests.data.result < 1) {
              this.$toast({
                component: ToastificationContent,
                props: {
                  title: 'Отсутствуют заявки за выбранный период',
                  icon: 'AlertTriangleIcon',
                  variant: 'danger',
                },
              });
            }
          }
        });
      }
      this.loadDone = true;
    },
  },

  beforeMount() {
    const userData = JSON.parse(localStorage.getItem('userData'));
    if (userData && this.gotSelectedContract === null) {
      this.contract = userData;
      this.contractId = this.contract.contract.id;
    } else this.contractId = this.gotSelectedContract;

    // this.contractId = this.gotSelectedContract;
    this.start = `${this.getFirstDay()} 00:00:00`;
    this.end = `${this.isToday()} 00:00:00`;
    // this.rangeDate = [this.start, this.end];
    // const userData = JSON.parse(localStorage.getItem('userData'));
    // if (userData) {
    //   this.contract = userData;
    //   this.contractId = this.contract.contract.id;
    //   this.start = `${this.getFirstDay()} 00:00:00`;
    //   this.end = `${this.isToday()} 00:00:00`;
    //   this.rangeDate = [this.start, this.end];
    // }

    this.rangeDate = [this.start, this.end];
    this.getAllCards(this.contractId);
    useJwt.GetRequests(`contract_id=${this.contractId}&startDate=${this.start}&endDate=${this.end}&card_number=7824861010051464017`).then((response) => {
      if (response.data.status) {
        this.requests = response.data;
        if (this.requests.data.result < 1) {
          this.$toast({
            component: ToastificationContent,
            props: {
              title: 'Отсутствуют заявки за выбранный период',
              icon: 'AlertTriangleIcon',
              variant: 'danger',
            },
          });
        }
      }
    });
    this.loadDone = true;
  },
  methods: {
    isToday() {
      const today = new Date();
      return today.toLocaleDateString();
    },

    getFirstDay() {
      const date = new Date();
      const firstDay = new Date(date.getFullYear(), date.getMonth(), 1).toLocaleDateString();
      return firstDay;
    },

    unique(arr) {
      this.arr = Array.from(new Set(arr));
      return this.arr;
    },

    getAllCards(val) {
      this.loadDone = false;
      this.option = [];
      this.busy = true;
      useJwt.getCards(val).then((response) => {
        if (response.data.status) {
          this.response = response.data;
          this.response.cards.forEach((el) => {
            this.option.push(el.number);
          });
        }
        this.busy = false;
        this.option = this.unique(this.option);
      });
      this.loadDone = true;
    },

    // onChange() {
    //   this.loadDone = false;
    //   const { selected } = this;
    //   const date = this.rangeDate;
    //   // const newDate = Array.from(date).filter((n) => n !== '—');
    //   // const arr = newDate.join('').split('00:00:00');
    //   // const trim = arr.join('').split(' ').filter((n) => n !== '');
    //   // // eslint-disable-next-line prefer-template
    //   // const start = trim[0] + ' 00:00:00';
    //   // // eslint-disable-next-line prefer-template
    //   // const end = trim[1] + ' 00:00:00';
    //   const [start, end] = date;
    //   if (selected === null) {
    //     useJwt.GetRequests(`contract_id=${this.contractId}&startDate=${start}&endDate=${end}`).then((response) => {
    //       if (response.data.status) {
    //         this.requests = response.data;
    //         this.totalRows = this.requests.data.total;
    //         if (this.rangeDate.length > 10 && this.totalRows < 1) {
    //           this.$toast({
    //             component: ToastificationContent,
    //             props: {
    //               title: 'Отсутствуют заявки за выбранный период',
    //               icon: 'AlertTriangleIcon',
    //               variant: 'danger',
    //             },
    //           });
    //         }
    //       }
    //     });
    //   } else {
    //     useJwt.GetRequests(`contract_id=${this.contractId}&startDate=${start}&endDate=${end}&card_number=${selected}`).then((response) => {
    //       if (response.data.status) {
    //         this.requests = response.data;
    //         this.totalRows = this.requests.data.total;
    //         if (this.rangeDate.length > 10 && this.totalRows < 1) {
    //           this.$toast({
    //             component: ToastificationContent,
    //             props: {
    //               title: 'Отсутствуют заявки по карте за выбранный период',
    //               icon: 'AlertTriangleIcon',
    //               variant: 'danger',
    //             },
    //           });
    //         }
    //       }
    //     });
    //   }
    //   this.loadDone = true;
    // },

    selectDate() {
      const date = this.rangeDate;
      const newDate = Array.from(date).filter((n) => n !== '—');
      const prot = (newDate.join('').split('00:00:00'));
      const arr = prot.join('').split(' ').filter((n) => n !== '');
      // eslint-disable-next-line prefer-template
      const start = `${arr[0]} 00:00:00`;
      // eslint-disable-next-line prefer-template
      const end = `${arr[1]} 00:00:00`;
      // const [start, end] = date;
      const { selected } = this;
      if (date.length > 22) {
        if (selected === null) {
          useJwt.GetRequests(`contract_id=${this.contractId}&startDate=${start}&endDate=${end}`).then((response) => {
            this.requests = response.data;
            this.totalRows = this.requests.data.total;
            if (this.rangeDate.length > 22) {
              if (this.totalRows < 1) {
                this.$toast({
                  component: ToastificationContent,
                  props: {
                    title: 'Отсутствуют заявки за выбранный период',
                    icon: 'AlertTriangleIcon',
                    variant: 'danger',
                  },
                });
              }
            }
          });
        } else {
          useJwt.GetRequests(`contract_id=${this.contractId}&startDate=${start}&endDate=${end}&card_number=${selected}`).then((response) => {
            if (response.data.status) {
              this.requests = response.data;
              this.totalRows = this.requests.data.total;
              if (this.totalRows < 1) {
                this.$toast({
                  component: ToastificationContent,
                  props: {
                    title: 'Отсутствуют заявки по карте за выбранный период',
                    icon: 'AlertTriangleIcon',
                    variant: 'danger',
                  },
                });
              }
            }
          });
        }
      }
    },
  },

};
</script>

<style lang="scss">
@import "@core/scss/vue/libs/vue-flatpicker.scss";
</style>
