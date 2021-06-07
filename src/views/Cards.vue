<template>
  <b-overlay
    :show="loading"
    variant="black"
    spinner-type="grow"
    spinner-variant="primary"
    blur="2px"
    opacity=".75"
    rounded="md">
    <div
      v-if="!loading">
      <b-button
        variant="success"
        class="w-75 btn btn-primary"
        style="min-width:100px"
        @click="getChangeTheView">
        <span class="align-baseline" />
        {{ view ? "Строка": "Таблица" }}
      </b-button>
      <div class="ecommerce-searchbar mt-1 mb-1">
        <b-row>
          <b-col cols="12">
            <b-input-group class="input-group-merge">
              <b-form-input
                v-model="filters"
                autofocus
                placeholder="Найти по номеру карты"
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
      <section
        v-if="view"
        class="views">
        <b-card
          v-for="(product, index) in products.data.result"
          :key="index"
          class="ecommerce-card mb-1"
          no-body>
          <b-link
            :to="{ name: 'card', params: { card_number: product.number } }">
            <b-img
              class="card-img-top"
              :src="require(`../assets/images/cards-icon/${product.emitent.code}.svg`)" />
          </b-link>
          <div class="item-options">
            <b-link
              :to="{ name: 'card', params: { card_number: product.number } }">
              <div class="item-wrapper">
                <h6 class="item-price">
                  PIN: {{ product.pin }}
                </h6>
                <h5 class="item-price">
                  {{ product.number }}
                </h5>
              </div>
            </b-link>
            <div
              class="d-flex flex-row flex-nowrap justify-content-around mt-2">
              <b-button-group>
                <b-button
                  v-b-tooltip.hover.top="'Внести изменения'"
                  variant="light"
                  tag="a"
                  class="btn-wishlist mb-1"
                  @click="toggleProductInWishlist(product)">
                  <feather-icon
                    icon="SettingsIcon"
                    class="mr-50" />
                </b-button>
                <b-button
                  v-b-tooltip.hover.top="'Внести изменения'"
                  variant="light"
                  tag="a"
                  class="btn-wishlist mb-1"
                  @click="toggleProductInWishlist(product)">
                  <feather-icon
                    icon="Edit3Icon"
                    class="mr-50" />
                </b-button>
                <b-button
                  v-b-tooltip.hover.top="'Удалить карту'"
                  variant="light"
                  tag="a"
                  class="btn-cart mb-1"
                  @click="handleCartActionClick(product)">
                  <feather-icon
                    icon="Trash2Icon"
                    class="mr-50" />
                </b-button>
                <b-button
                  v-b-tooltip.hover.top="'Заблокировать карту'"
                  variant="light"
                  tag="a"
                  class="btn-cart mb-1"
                  @click="handleCartActionClick(product)">
                  <feather-icon
                    icon="LockIcon"
                    class="mr-50" />
                </b-button>
              </b-button-group>
            </div>
          </div>

          <div
            class="limits pb-1">
            <label>Остаток по карте </label>
            <b-progress
              variant="success"
              show-value
              class="mb-1"
              :value="getValue(product.limits)"
              :max="getMaxValue(product.limits)" />
          </div>
        </b-card>
      </section>
      <!----ТАБЛИЦА---->
      <section
        v-else
        class="views">
        <div
          v-for="(product, index) in products.data.result"
          :key="index"
          class="d-flex justify-content-between w-100 mb-1 rlt"
          no-body>
          <b-link
            :to="{ name: 'card', params: { card_number: product.number } }">
            <b-img
              class="card-img-top"
              :src="require(`../assets/images/cards-icon/${product.emitent.code}.svg`)" />
          </b-link>
          <b-link
            :to="{ name: 'card', params: { card_number: product.number } }">
            <div class="item-wrapper abs">
              <h6 class="item-price">
                PIN: {{ product.pin }}
              </h6>
              <h5 class="item-price">
                {{ product.number }}
              </h5>
            </div>
          </b-link>
          <div class="d-flex flex-column w-60 mr-1 ml-1">
            <label> Остаток: {{ getValue(product.limits) }}</label>
            <div
              v-for="(i) in product.limits"
              :key="i.ID">
              <b-progress

                variant="success"
                show-value
                class="mt-1"
                :value="i.value - i.consumption"
                :max="i.value" />
            </div>
          </div>

          <!-- <div v-else
            class="w-60 pb-1">
            <label>Остаток по карте </label>
            <b-progress
              variant="success"
              show-value
              class="mb-1"
              :value="getValue(product.limits)"
              :max="getMaxValue(product.limits)" />
          </div> -->

          <!-- <div
            class="w-60 pb-1">
            <label>{{ product.limits }} </label>
            <b-progress
              variant="success"
              show-value
              class="mb-1"
              :value="getValue(product.limits)"
              :max="getMaxValue(product.limits)" />
          </div> -->
          <div
            class="d-flex w-20 flex-column align-items-center">
            <b-button

              class="btn btn-light p-1 mt-1"
              style="min-width:200px"
              @click="toggleProductInWishlist(product)">
              <feather-icon
                icon="SettingsIcon"
                class="mr-50" />
              Внести изменения
            </b-button>
            <b-button

              class="btn btn-light p-1 mt-1"
              style="min-width:200px"
              @click="toggleProductInWishlist(product)">
              <feather-icon
                icon="Edit3Icon"
                class="mr-50" />
              Внести изменения
            </b-button>
            <b-button

              class="btn btn-light p-1 mt-1"
              style="min-width:200px"
              @click="handleCartActionClick(product)">
              <feather-icon
                icon="Trash2Icon"
                class="mr-50" />
              Внести изменения
            </b-button>
            <b-button

              class="btn btn-light p-1 mt-1"
              style="min-width:200px"
              @click="handleCartActionClick(product)">
              <feather-icon
                icon="LockIcon"
                class="mr-50" />
              Заблокировать карту
            </b-button>
          </div>
        </div>
      </section>
      <!----Конец таблицы--->
    </div>
  </b-overlay>
</template>

<script>
import {
  BCard,
  BImg,
  BButton,
  BOverlay,
  VBTooltip,
  BProgress,
  BInputGroupAppend,
  BButtonGroup,
  BLink,
  BRow,
  BCol,
  BInputGroup,
  BFormInput,
} from 'bootstrap-vue';
import useJwt from '@/auth/jwt/useJwt';
import Ripple from 'vue-ripple-directive';
import { watch, ref } from '@vue/composition-api';
import { useResponsiveAppLeftSidebarVisibility } from '@core/comp-functions/ui/app';
import { useShopUi, useShopRemoteData } from './useECommerceShop';
import { useEcommerceUi } from './useEcommerce';

export default {
  directives: {
    'b-tooltip': VBTooltip,
    Ripple,
  },
  components: {
    BLink,
    BCard,
    BProgress,
    BButtonGroup,
    BImg,
    BButton,
    BOverlay,
    BRow,
    BCol,
    BInputGroup,
    BFormInput,
    BInputGroupAppend,
    // BPagination,
  },
  setup() {
    const filters = ref('');
    const { handleCartActionClick, toggleProductInWishlist } = useEcommerceUi();
    const loading = ref(false);
    const { itemView, itemViewOptions, totalProducts } = useShopUi();

    const getPopularityColor = (num) => {
      if (Number(num) > 7000) return 'success';
      if (Number(num) > 4000) return 'primary';
      if (Number(num) >= 2000) return 'warning';
      if (Number(num) < 1000) return 'danger';
      return 'success';
    };

    const { products } = useShopRemoteData();

    const { mqShallShowLeftSidebar } = useResponsiveAppLeftSidebarVisibility();

    const fetchShopProducts = () => {
      loading.value = true;
      useJwt.getCardsDate().then((response) => {
        products.value = response.data;
        loading.value = false;
        if (filters.value !== '') {
          products.value.data.result = response.data.data.result.filter((product) => product.number.includes(filters.value));
        }
      });
    };

    fetchShopProducts();
    watch([filters], () => {
      fetchShopProducts();
    });

    return {
      filters,
      getPopularityColor,
      itemView,
      itemViewOptions,
      totalProducts,
      toggleProductInWishlist,
      handleCartActionClick,
      products,
      loading,
      mqShallShowLeftSidebar,
    };
  },
  data() {
    return {
      number: null,
      zero: 0,
      view: true,
    };
  },

  methods: {
    getMaxValue(item) {
      if (item.length < 1) {
        return 0;
      }
      const totalSumm = item.reduce((accumulator, el) => accumulator + el.value, 0);
      return totalSumm;
    },

    getChangeTheView() {
      this.view = !this.view;
    },

    getValue(item) {
      if (item.length < 1) {
        return 0;
      }
      const totalSumm = item.reduce((accumulator, el) => accumulator + el.value, 0);
      const consumption = item.reduce((accumulator, el) => accumulator + el.consumption, 0);
      return totalSumm - consumption;
    },
  },
};
</script>

<style lang="scss">
// @import "../@core/scss/base/ecommerce";
</style>

<style lang="scss" scoped>

.card {
  display: flex;
  flex-wrap: wrap;
  justify-content: end;
  max-width: 390px;
  align-items: center;
  padding: 3px;
}

.item-wrapper {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  position: relative;
  left: 20px;
}

.item-options {
  display: flex;
  flex-direction: column;
  position: absolute !important;
  bottom: 35px !important;
  width: 100%;
}

.ecommerce-card {
  background-color: inherit !important;
  cursor: pointer;
  margin: 3px;

  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 4px 25px 0 rgba(black, 0.25);
  }
}

.item-price {
  position: relative;
  left: 10px;
  color: #000;
  text-align: center;
  text-shadow: -1px -1px 1px rgba(255, 255, 255, 0.5),
    1px 1px 1px rgba(0, 0, 0, 0.5);
}
.rlt {
  position: relative;
}

.abs {
  position: absolute;
  bottom: 95px;
  left:10px;
}

.w-20 {
  width: 20%;
}

.w-60 {
  width: 60%;
  max-width: 65% !important;
}

// .card-img-top {
//   min-height:200px !important;
// }

.item-img {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: auto;
  width: 95%;
}
.limits {
  width: 90%;
  display: flex;
  flex-direction: column;
  align-items: center;
  min-width: 200px;
  position: relative;
  top: 25px;
}
.views {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-around;
}
.progress {
  width: 100%;
  height: 12px;
}

.btn {
  max-width: 50px;

  // &:hover {
  //   background-color: "primary";
  // }
}
.item-view-radio-group ::v-deep {
  .btn {
    display: flex;
    align-items: center;
  }
}
</style>
