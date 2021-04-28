<template>
  <div style="height: inherit">
    <b-overlay
      :show="loadDone"
      spinner-variant="primary"
      variant="transparent"
      spinner-medium
      rounded="md">
      <b-form-radio-group
        v-model="itemView"
        class="ml-1 list item-view-radio-group"
        buttons
        size="sm"
        button-variant="outline-primary">
        <b-form-radio
          v-for="option in itemViewOptions"
          :key="option.value"
          :value="option.value">
          <feather-icon
            :icon="option.icon"
            size="18" />
        </b-form-radio>
      </b-form-radio-group>
      <!-- Prodcuts -->
      <section class="views">
        <b-card
          v-for="(product,index) in products.data"
          :key="index"
          class="ecommerce-card"
          no-body>
          <div class="item-img text-center">
            <b-img
              fluid
              class="card-img-top"
              src="../assets/images/cards-icon/TAT.svg" />
            <div class="item-options text-center">
              <div class="item-wrapper">
                <div class="item-cost ">
                  <h6 class="item-price">
                    {{ product.number }}
                  </h6>
                </div>
              </div>
              <div class="d-flex flex-row flex-wrap justify-content-around mt-2">
                <b-button
                  v-b-tooltip.hover.right="'Внести изменения'"
                  variant="light"
                  tag="a"
                  class="btn-wishlist mb-1"
                  @click="toggleProductInWishlist(product)">
                  <feather-icon
                    icon="SettingsIcon"
                    class="mr-50" />
                </b-button>
                <b-button
                  v-b-tooltip.hover.right="'Внести изменения'"
                  variant="light"
                  tag="a"
                  class="btn-wishlist mb-1"
                  @click="toggleProductInWishlist(product)">
                  <feather-icon
                    icon="Edit3Icon"
                    class="mr-50" />
                </b-button>
                <b-button
                  v-b-tooltip.hover.right="'Удалить карту'"
                  variant="light"
                  tag="a"
                  class="btn-cart mb-1"
                  @click="handleCartActionClick(product)">
                  <feather-icon
                    icon="Trash2Icon"
                    class="mr-50" />
                </b-button>
                <b-button
                  v-b-tooltip.hover.right="'Заблокировать карту'"
                  variant="light"
                  tag="a"
                  class="btn-cart mb-1"
                  @click="handleCartActionClick(product)">
                  <feather-icon
                    icon="LockIcon"
                    class="mr-50" />
                </b-button>
              </div>
            </div>
          </div>
          <div
            v-for="item in product.limits"
            :key="item.value"
            class="limits ml-1 pb-2">
            <div

              v-for="(i) in item.limit_commons"
              :key="i.limit_id">
              <label>{{ i.service_id }}</label>
              <b-progress
                :variant="getPopularityColor(i.limit_id)"
                show-value
                class="mb-1 mt-1 "
                :value="i.limit_id"
                :max="max" />
            </div>
          </div>
          <!-- Product Actions -->
        </b-card>
      </section>

      <!-- Pagination -->
      <!-- <section>
        <b-row>
          <b-col cols="12">
            <b-pagination
              v-model="filters.page"
              :total-rows="totalProducts"
              :per-page="filters.perPage"
              first-number
              align="center"
              last-number
              prev-class="prev-item"
              next-class="next-item">
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
          </b-col>
        </b-row>
      </section> -->
    </b-overlay>
  </div>
</template>

<script>
import {
  BCard, BImg, BButton, BOverlay, VBTooltip, BProgress,
} from 'bootstrap-vue';
import useJwt from '@/auth/jwt/useJwt';
import Ripple from 'vue-ripple-directive';
import { useResponsiveAppLeftSidebarVisibility } from '@core/comp-functions/ui/app';
import { useShopFiltersSortingAndPagination, useShopUi, useShopRemoteData } from './useECommerceShop';
import { useEcommerceUi } from './useEcommerce';

export default {
  directives: {
    'b-tooltip': VBTooltip,
    Ripple,
  },
  components: {

    BCard,
    BProgress,

    BImg,
    BButton,
    BOverlay,
    // BPagination,

  },
  setup() {
    const {
      filters, filterOptions, sortBy, sortByOptions,
    } = useShopFiltersSortingAndPagination();

    const { handleCartActionClick, toggleProductInWishlist } = useEcommerceUi();

    let loadDone = false;
    const max = 10000;

    const {
      itemView, itemViewOptions, totalProducts,
    } = useShopUi();

    const getPopularityColor = (num) => {
      if (Number(num) > 7000) return 'success';
      if (Number(num) > 4000) return 'primary';
      if (Number(num) >= 2000) return 'warning';
      if (Number(num) < 1000) return 'danger';
      return 'success';
    };

    const { products } = useShopRemoteData();

    const { mqShallShowLeftSidebar } = useResponsiveAppLeftSidebarVisibility();

    // Wrapper Function for `fetchProducts` which can be triggered initially and upon changes of filters

    const fetchShopProducts = () => {
      loadDone = true;
      useJwt.getCardsDate()
        .then((response) => {
          products.value = response.data;
          totalProducts.value = products.value.data.length;
          console.log(products.value.data);
        });
      loadDone = false;
    };

    fetchShopProducts();

    return {
      // useShopFiltersSortingAndPagination
      filters,
      filterOptions,
      sortBy,
      sortByOptions,
      loadDone,
      getPopularityColor,
      // useShopUi
      itemView,
      itemViewOptions,
      totalProducts,
      toggleProductInWishlist,
      handleCartActionClick,
      max,
      // useShopRemoteData
      products,

      // mqShallShowLeftSidebar
      mqShallShowLeftSidebar,
    };
  },
};
</script>

<style lang="scss">
// @import "../@core/scss/base/ecommerce";
</style>

<style lang="scss" scoped>
// .ecommerce-card {
//   max-width: 80% !important;
// }

.card {
  flex-direction: row !important;
  align-items: flex-start;
  max-width: 390px;
}

.item-wrapper {
  position: relative !important;
  bottom: 35% !important;
  right: 8% !important;
}

.item-options {
  position: relative !important;
  bottom: 45px !important;
}

.ecommerce-card {
  background-color: inherit !important;
  margin-bottom: 0 !important;
  cursor: pointer;
  margin: 3px;

  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 4px 25px 0 rgba(white, 0.25);
  }
}

.item-price {
  position: relative;
  left: 10px;
}

.item-img {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: auto;
  min-width: 40%;
}
.limits {
  max-width: 60%;
  padding: 0 10px 0 0;
  height: fit-content;
  min-width: 200px;
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
.item-view-radio-group ::v-deep {
  .btn {
    display: flex;
    align-items: center;
  }
}
</style>
