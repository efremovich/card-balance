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
      <!-- Item View Radio Button Group  -->
      <b-form-radio-group
        v-if="getWidth==='xl'"
        :model-value="itemView"
        class="ml-1 list item-view-radio-group float-right"
        buttons
        size="sm"
        button-variant="outline-primary"
        @change="setCardsView">
        <b-form-radio
          v-for="option in itemViewOptions"
          :key="option.value"
          :value="option.value">
          <feather-icon
            :icon="option.icon"
            size="18" />
        </b-form-radio>
      </b-form-radio-group>

      <div class="ecommerce-searchbar mt-1 mb-1">
        <b-row>
          <b-col cols="12">
            <b-input-group class="input-group-merge">
              <b-form-input
                v-model="filters"
                placeholder="Поиск по номеру карты"
                class="search-product" />
              <b-input-group-append is-text>
                <feather-icon
                  icon="SearchIcon"
                  class="text-muted" />
              </b-input-group-append>
            </b-input-group>
          </b-col>
        </b-row>
      </div>
      <div v-if="getWidth === 'xl'">
        <section
          v-if="gotItemView !== 'list-view'"
          class="views">
          <b-card
            v-for="(product, index) in products.data.result"
            :key="index"
            class="ecommerce-card mb-1 mr-9"
            no-body>
            <b-button
              v-if="product.card_status_id !== 'BLOCK'"
              variant="danger"
              class="mt-1"
              @click="getLockCard(product)">
              Заблокировать
              <feather-icon
                icon="LockIcon" />
            </b-button>
            <b-button
              v-else
              variant="success"
              class="mt-1"
              @click="getUnlockCard(product)">
              Разблокировать
              <feather-icon
                icon="UnlockIcon" />
            </b-button>

            <b-link
              class="w-80"
              :to="{ name: 'card', params: { card_number: product.number } }">
              <b-img
                class="card-img-top"
                :src="require(`../assets/images/cards-icon/${product.emitent.code}.svg`)" />

              <b-badge
                v-if="getStatusRequests(product.request_status)"
                class="badge-glow position-absolute mar"
                pill
                variant="warning">
                Заявка в обработке
              </b-badge>
            </b-link>
            <div class="item-options">
              <b-link
                :to="{ name: 'card', params: { card_number: product.number } }">
                <div class="item-wrapper down">
                  <h6 class="item-price">
                    PIN: {{ product.pin }}
                  </h6>
                  <h5 class="item-price">
                    {{ product.number }}
                  </h5>
                </div>
              </b-link>
            </div>
            <div class="d-flex flex-column align-items-center w-100 position-relative top-negative">
              <div
                class="limits mt-1">
                <label>Остаток по карте </label>
                <b-progress
                  variant="success"
                  show-value
                  :value="getValue(product.limits)"
                  :max="getMaxValue(product.limits)" />
              </div>
              <div class="wrap">
                <b-badge
                  :variant="colorMap[product.card_status_id]"
                  class="w-100 adge-glow mb-1 mt-1">
                  {{ product.card_status.name }}
                </b-badge>
              </div>
            </div>
          </b-card>
        </section>

        <!----ТАБЛИЦА---->
        <section
          v-else
          class="d-flex flex-column align-items-center">
          <b-card
            v-for="(product ) in products.data.result"
            :key="product.number"
            class="table d-flex justify-content-between mb-1 width mh-300"
            no-body>
            <div class="d-flex pr-1 pl-1 w-100">
              <b-link
                :to="{ name: 'card', params: { card_number: product.number } }">
                <div class="d-flex flex-column align-items-center">
                  <b-badge
                    v-if="getStatusRequests(product.request_status)"
                    pill
                    variant="warning"
                    class="badge-glow position-absolute list-badge">
                    Заявка в обработке
                  </b-badge>

                  <b-img
                    variant="outline-primary"
                    class="card card-img-top pt-1 w-100 mh-270"
                    :src="require(`../assets/images/cards-icon/${product.emitent.code}.svg`)" />

                  <b-badge
                    :variant="colorMap[product.card_status_id]"
                    class="w-95 position-relative badge-glow b-70">
                    {{ product.card_status.name }}
                  </b-badge>
                  <div class="item-wrapper pad mt-10">
                    <h6
                      class="item-price">
                      PIN: {{ product.pin }}
                    </h6>

                    <h5 class="item-price">
                      {{ product.number }}
                    </h5>
                  </div>
                </div>
              </b-link>
              <b-link
                :to="{ name: 'card', params: { card_number: product.number } }">
                <!-- <div class="item-wrapper pad bt-15">
                  <h6
                    class="item-price">
                    PIN: {{ product.pin }}
                  </h6>

                  <h5 class="item-price">
                    {{ product.number }}
                  </h5>
                </div> -->
              </b-link>

              <div class="d-flex flex-column w-60 mr-1 ml-1 mt-2">
                <h5> Остаток: {{ getValue(product.limits) }}</h5>
                <!-- <p>{{ getServicesLength(product.limits) }}</p> -->

                <div v-if="!getServicesLength(product.limits)">
                  <!-- <template v-for="(item, index) in 2"> -->
                  <div
                    v-for="(i) in product.limits"
                    :key="i.ID"
                    class="mw-50">
                    <h5 class="text-center pt-1 pr-1 pl-1">
                      {{ getLabel(i.limit_services_labels) }}
                    </h5>
                    <b-progress
                      variant="success"
                      show-value
                      class="mt-1"
                      :value="i.value - i.consumption"
                      :max="i.value" />
                  </div>
                </div>

                <div
                  v-else>
                  <template v-for="(item,index) in 2">
                    <div
                      :key="index"
                      class="mw-50">
                      <h5
                        class="text-center pt-1 pr-1 pl-1">
                        {{ getLabel(product.limits[index].limit_services_labels) }}
                      </h5>
                      <b-progress
                        variant="success"
                        show-value
                        class="mt-1"
                        :value="product.limits[index+1].value - product.limits[index+1].consumption"
                        :max="product.limits[index+1].value" />
                    </div>
                  </template>

                  <app-collapse>
                    <app-collapse-item

                      class="mh"
                      title="Ещё">
                      <template
                        v-for="(item,index) in (getLabelServicesLength(product.limits)-2)">
                        <h5
                          :key="index"
                          class="text-center pt-1 pr-1 pl-1">
                          {{ getLabel(product.limits[index+2].limit_services_labels) }}
                        </h5>
                        <b-progress
                          :key="index"
                          variant="success"
                          show-value
                          :value="product.limits[index+2].value - product.limits[index+2].consumption"
                          :max="product.limits[index+2].value" />
                      </template>
                    </app-collapse-item>
                  </app-collapse>
                </div>
              </div>

              <div class=" d-flex flex-column align-items-center w-25 mr-1 ml-1 mt-2">
                <h5> Держатель: {{ product.holder }} </h5>
                <h5> Последняя активность: </h5>
                <h5> Индекс активности: </h5>
              </div>
              <div
                class="d-flex flex-column align-items-start mt-2">
                <b-button
                  variant="light"
                  :to="{ name: 'card', params: { card_number: product.number } }"
                  class="btn-wishlist mb-1 mw-100 p-1 min-w">
                  <feather-icon
                    icon="EditIcon"
                    class="mr-50" />
                  Настроить карту
                </b-button>

                <b-button
                  v-if="product.card_status_id !== 'BLOCK'"
                  variant="light"
                  tag="a"
                  class="btn-wishlist mb-1 mw-100 p-1 min-w"
                  @click="getLockCard(product)">
                  <feather-icon
                    icon="LockIcon"
                    class="mr-25" />
                  Заблокировать карту
                </b-button>
                <b-button
                  v-else
                  variant="success"
                  tag="a"
                  class="btn-wishlist mb-1 mw-100 p-1 min-w"
                  @click="getUnlockCard(product)">
                  <feather-icon
                    icon="LockIcon"
                    class="mr-25" />
                  Разблокировать карту
                </b-button>
                <b-button
                  variant="light"
                  tag="a"
                  class="btn-wishlist mb-1 mw-100 p-1 min-w"
                  @click="cardDate(product.number)">
                  <feather-icon
                    icon="NavigationIcon"
                    class="mr-50" />
                  Карта заправок
                </b-button>
                <b-button
                  variant="light"
                  tag="a"
                  class="btn-wishlist mw-100 mb-1 w-100 p-1 min-w"
                  @click="getTransactions(product.number)">
                  <feather-icon
                    icon="ListIcon"
                    class="mr-50" />
                  Транзакции по карте
                </b-button>
              </div>
            </div>
          </b-card>
        </section>
        <b-card-body class="d-flex justify-content-center flex-wrap align-items-center">
          <b-form-group
            label="На странице"
            label-cols="7"
            label-align="left"
            label-size="sm"
            label-for="sortBySelect"
            class="text-nowrap mb-md-0 pl-0">
            <b-form-select
              id="perPageSelect"
              v-model="perPage"
              size="sm"
              inline
              :options="pageOptions" />
          </b-form-group>
          <div>
            <b-pagination
              v-model="currentPage"
              :total-rows="totalRows"
              :per-page="perPage"
              first-number
              last-number
              prev-class="prev-item"
              next-class="next-item"
              class="mb-0"
              align="center">
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
      <!----Конец таблицы--->
      </div>
      <div v-else>
        <section
          class="views">
          <b-card
            v-for="(product, index) in products.data.result"
            :key="index"
            :class="[product.card_status_id !== 'ACTIVE'?'':'ecommerce-card', 'mb-1', 'position-relative', getWidth === 'xl'?'mr-9':'']"
            no-body>
            <b-button
              v-if="product.card_status_id !== 'BLOCK'"
              variant="danger"
              class="mt-1"
              @click="getLockCard(product)">
              Заблокировать
              <feather-icon
                icon="LockIcon" />
            </b-button>
            <b-button
              v-else
              variant="success"
              class="mt-1"
              @click="getUnlockCard(product)">
              Разблокировать
              <feather-icon
                icon="UnlockIcon" />
            </b-button>
            <b-link
              class="w-80"
              :to="{ name: 'card', params: { card_number: product.number } }">
              <b-img
                class="card-img-top"
                :src="require(`../assets/images/cards-icon/${product.emitent.code}.svg`)" />

              <b-badge
                v-if="getStatusRequests(product.request_status)"
                class="badge-glow position-absolute mar"
                pill
                variant="warning">
                Заявка в обработке
              </b-badge>
            </b-link>
            <div class="item-options">
              <b-link
                :to="{ name: 'card', params: { card_number: product.number } }">
                <div class="item-wrapper down">
                  <h6 class="item-price">
                    PIN: {{ product.pin }}
                  </h6>
                  <h5 class="item-price">
                    {{ product.number }}
                  </h5>
                </div>
              </b-link>
            </div>
            <div class="d-flex flex-column align-items-center w-100 position-relative top-negative">
              <div
                class="limits mt-1">
                <label>Остаток по карте </label>
                <b-progress
                  variant="success"
                  show-value
                  :value="getValue(product.limits)"
                  :max="getMaxValue(product.limits)" />
              </div>
              <div class="wrap">
                <b-badge
                  :variant="colorMap[product.card_status_id]"
                  class="w-100 adge-glow mb-1 mt-1">
                  {{ product.card_status.name }}
                </b-badge>
              </div>
            </div>
          </b-card>
        </section>
        <b-card-body class="d-flex justify-content-center flex-wrap align-items-center">
          <b-form-group
            label="На странице"
            label-cols="7"
            label-align="left"
            label-size="sm"
            label-for="sortBySelect"
            class="text-nowrap mb-md-0 pl-0">
            <b-form-select
              id="perPageSelect"
              v-model="perPage"
              size="sm"
              inline
              :options="pageOptions" />
          </b-form-group>
          <div>
            <b-pagination
              v-model="currentPage"
              :total-rows="totalRows"
              :per-page="perPage"
              first-number
              last-number
              prev-class="prev-item"
              next-class="next-item"
              class="mb-0"
              align="center">
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
    </div>
  </b-overlay>
</template>
<script>
import {
  BCard,
  BImg,
  BPagination,
  BFormSelect,
  BFormGroup,
  BButton,
  VBTooltip,
  BProgress,
  BInputGroupAppend,
  BLink,
  BRow,
  BOverlay,
  BCol,
  BInputGroup,
  BFormInput,
  BFormRadioGroup,
  BFormRadio,
  BCardBody,
  BBadge,
} from 'bootstrap-vue';
import useJwt from '@/auth/jwt/useJwt';
import Ripple from 'vue-ripple-directive';
import { ref } from '@vue/composition-api';
import { useResponsiveAppLeftSidebarVisibility } from '@core/comp-functions/ui/app';
import { mapGetters, mapMutations } from 'vuex';
import store from '@/store';
import ToastificationContent from '@core/components/toastification/ToastificationContent.vue';
import AppCollapse from '@core/components/app-collapse/AppCollapse.vue';
import AppCollapseItem from '@core/components/app-collapse/AppCollapseItem.vue';
import { useShopUi, useShopRemoteData } from '../libs/useECommerceShop';
import { useEcommerceUi } from '../libs/useEcommerce';

export default {
  directives: {
    'b-tooltip': VBTooltip,
    Ripple,
  },
  components: {
    AppCollapse,
    AppCollapseItem,
    BLink,
    BCardBody,
    BFormSelect,
    BCard,
    BFormGroup,
    BPagination,
    BProgress,
    BOverlay,
    BImg,
    BButton,
    BRow,
    BCol,
    BInputGroup,
    BFormInput,
    BInputGroupAppend,
    BFormRadioGroup,
    BFormRadio,
    BBadge,
  },
  setup() {
    // const contractID = computed(() => store.getters.CONTRACT_ID); // ранее contractID было null.
    const contract = ref('');
    const contractID = ref(null); // // Была проблема при переходе с cardDetails в cards на тот же договор: не отслеживался договор к которому принадлежит карта, т.е. выбранный пользователем договор

    const userData = JSON.parse(localStorage.getItem('userData')); // загрузка номера контракта из localStorage
    if (userData && store.getters.CONTRACT_ID === null) { // Если это убрать, то contractID  в виде computed  свойства тоже работает, но выдаёт warning
      contract.value = userData;
      contractID.value = contract.value.contract.id;
    } else {
      contractID.value = store.getters.CONTRACT_ID;
    }
    const showLoading = ref(true);
    const download = ref(false);
    const filters = ref('');
    const { handleCartActionClick, toggleProductInWishlist } = useEcommerceUi();
    const { itemViewOptions, totalProducts } = useShopUi();
    const totalRows = ref(null);
    const pageOptions = [6, 12, 18];
    const currentPage = 1;
    const perPage = 6;
    const { products } = useShopRemoteData();
    const { mqShallShowLeftSidebar } = useResponsiveAppLeftSidebarVisibility();
    const fetchShopProducts = () => {
      useJwt.getChangeCardsDate(contractID.value, `offset=0&limit=${perPage}`).then((response) => {
        if (response.data.status) {
          products.value = response.data;
          showLoading.value = false;
          download.value = true;
          totalRows.value = products.value.data.total;

          // if (filters.value !== '') {
          //   products.value.data.result = response.data.data.result.filter((product) => product.number.includes(filters.value));
          // }
        }
      });
    };
    fetchShopProducts();

    // watch([filters], () => {
    //   fetchShopProducts();
    // });

    return {
      filters,
      itemViewOptions,
      totalProducts,
      toggleProductInWishlist,
      handleCartActionClick,
      products,
      totalRows,
      pageOptions,
      currentPage,
      mqShallShowLeftSidebar,
      perPage,
      showLoading,
      download,
      contractID,
    };
  },
  data() {
    return {
      view: true,
      page: 1,
      cardData: null,
      itemView: this.$store.state.cardsView,
      colorMap: {
        FINANCE: 'warning',
        ACTIVE: 'success',
        BLOCK: 'danger',
        BROKEN: 'danger',
        DELETED: 'secondary',
        LOST: 'secondary',
        RETURN: 'secondary',
        SOLD: 'secondary',
      },
    };
  },
  computed: {
    ...mapGetters({
      gotSelected: 'CONTRACT_ID',
      gotItemView: 'CARDS_VIEW',
    }),
    getWidth() {
      return store.getters['app/currentBreakPoint'];
    },
    getAllLimits() {
      return this.products.data.result;
    },

  },
  watch: {
    perPage() {
      useJwt.getChangeCardsDate(this.contractID, `offset=${this.currentPage * this.perPage}&limit=${this.perPage}`).then((response) => {
        if (response.data.status) {
          this.products = response.data;
        }
      });
    },
    gotSelected(val) {
      this.contractID = val;
      if (this.currentPage === 1) {
        useJwt.getChangeCardsDate(this.contractID, `offset=0&limit=${this.perPage}`).then((response) => {
          if (response.data.status) {
            this.products = response.data;
            this.totalRows = this.products.data.total;

          // if (this.filters !== '') {
          //   this.products.data.result = response.data.data.result.filter((product) => product.number.includes(this.filters));
          // }
          }
        });
      } else {
        useJwt.getChangeCardsDate(this.contractID, `offset=${this.currentPage * this.page}&limit=${this.perPage}`).then((response) => {
          if (response.data.status) {
            this.products = response.data;
            this.totalRows = this.products.data.total;

          // if (this.filters !== '') {
          //   this.products.data.result = response.data.data.result.filter((product) => product.number.includes(this.filters));
          // }
          }
        });
      }
    },
    currentPage() {
      this.page = this.currentPage;
      useJwt.getChangeCardsDate(this.contractID, `&offset=${this.perPage * (this.page - 1)}&limit=${this.perPage}`).then((response) => {
        if (response.data.status) {
          this.products = response.data;
        }
      });
    },
    filters(val) {
      useJwt.getChangeCardsDate(this.gotSelected, 'offset=0&limit=-1').then((response) => {
        if (response.data.status) {
          this.products = response.data;
          this.showLoading = false;
          this.download = true;
          this.totalRows = this.products.data.total;
          if (val !== '') {
            this.products = response.data;
            this.products.data.result = this.products.data.result.filter((product) => product.number.includes(val));
          }
        }
      });
    },
  },
  beforeMount() {
    const userData = JSON.parse(localStorage.getItem('userData'));
    if (userData && this.gotSelected === null) {
      this.contract = userData;
      this.contractID = this.contract.contract.id;
    } else this.contractID = this.gotSelected;
  },

  methods: {
    ...mapMutations({
      setCardsView: 'setCardsView',
    }),
    getMaxValue(item) {
      if (item === undefined || null || item.length < 1) {
        return 0;
      }
      const totalSumm = item.reduce((accumulator, el) => accumulator + el.value, 0);
      return totalSumm;
    },
    getTransactions(val) {
      this.$store.dispatch('getCardNumber', val);
      this.$router.push({ name: 'transactions' });
    },

    cardDate(params) {
      useJwt.getCardData(params).then((response) => {
        if (response.data.status) {
          this.cardData = response.data;
        }
        return this.cardData.data.limits.map((el) => el.limit_services);
      });
    },
    getServicesLength(item) {
      if (Object.keys(item).length > 2) {
        return true;
      }
      return false;
    },
    // Смена статуса карты
    getLockCard(item) {
      this.$bvModal
        .msgBoxConfirm(`Вы уверены что хотите заблокировать карту № ${item.number}?`, {
          cancelVariant: 'outline-secondary',
          okVariant: 'primary',
          okTitle: 'Да',
          cancelTitle: 'Нет',
          centered: true,
        })
        .then((value) => {
          if (value === true && item.card_status_id === 'ACTIVE') {
            const status = [{
              'card_number': item.number,
              'request_type_code': 'LOCK',
              'request_status_code': 'CREATED',
              'contract_id': this.contractID,
            }];
            useJwt.refreshDataUserLimits(status).then((response) => {
              if (response.data.status) {
                this.$toast({
                  component: ToastificationContent,
                  props: {
                    title: 'Направлена заявка на блокировку',
                    icon: 'LockIcon',
                    variant: 'success',
                  },
                });
              } else {
                this.$toast({
                  component: ToastificationContent,
                  props: {
                    title: '🙄 Ошибка. Попробуйте позже, а мы пока починим 👨‍🔧',
                    icon: 'AlertTriangleIcon',
                    variant: 'warning',
                  },
                });
              }
            });
          }
        });
    },
    getUnlockCard(item) {
      this.$bvModal
        .msgBoxConfirm(`Вы уверены что хотите разблокировать карту № ${item.number}?`, {
          cancelVariant: 'outline-secondary',
          okVariant: 'success',
          okTitle: 'Да',
          cancelTitle: 'Нет',
          centered: true,
        })
        .then((value) => {
          if (value === true && item.card_status_id === 'BLOCK') {
            const status = [{
              'card_number': item.number,
              'request_type_code': 'UNLOCK',
              'request_status_code': 'CREATED',
              'contract_id': this.contractID,
            }];
            useJwt.refreshDataUserLimits(status).then((response) => {
              if (response.data.status) {
                this.$toast({
                  component: ToastificationContent,
                  props: {
                    title: 'Направлена заявка на разблокировку',
                    icon: 'LockIcon',
                    variant: 'success',
                  },
                });
              } else {
                this.$toast({
                  component: ToastificationContent,
                  props: {
                    title: '🙄 Ошибка. Попробуйте позже, а мы пока починим 👨‍🔧',
                    icon: 'AlertTriangleIcon',
                    variant: 'warning',
                  },
                });
              }
            });
          }
        });
    },
    getStatusRequests(item) {
      if (item === 'PROCESSING' || item === 'CREATED') {
        return true;
      } return false;
    },

    getValue(item) {
      if (item === undefined || null || item.length < 1) {
        return 0;
      }
      const totalSumm = item.reduce((accumulator, el) => accumulator + el.value, 0);
      const consumption = item.reduce((accumulator, el) => accumulator + el.consumption, 0);
      return totalSumm - consumption;
    },
    getLabel(item) {
      if (item) {
        return String(item);
      } return '';
    },
    getLabelServicesLength(item) {
      return Object.keys(item).length;
    },
  },
};
</script>

<style lang="scss" scoped>
@import "../assets/scss/components/cards";
</style>
