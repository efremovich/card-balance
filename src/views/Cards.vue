<template>
  <div style="height: inherit">
    <b-overlay
      :show="loadDone"
      spinner-variant="primary"
      variant="transparent"
      spinner-medium
      rounded="md">
      <!-- Prodcuts -->
      <section :class="itemView">
        <b-card
          v-for="(product,index) in products.value"
          :key="index"
          class="ecommerce-card"
          no-body>
          <div class="item-img text-center">
            <b-img
              fluid
              class="card-img-top"
              src="../assets/images/cards-icon/LUK.svg" />
          </div>

          <!-- Product Actions -->
          <div class="item-options text-center">
            <div class="item-wrapper">
              <div class="item-cost">
                <h4 class="item-price">
                  {{ index }}
                </h4>
              </div>
            </div>
            <b-button
              variant="light"
              tag="a"
              class="btn-wishlist"
              @click="toggleProductInWishlist(product)">
              <feather-icon
                icon="HeartIcon"
                class="mr-50" />
              <span>Wishlist</span>
            </b-button>
            <b-button
              variant="primary"
              tag="a"
              class="btn-cart"
              @click="handleCartActionClick(product)">
              <feather-icon
                icon="ShoppingCartIcon"
                class="mr-50" />
              <!-- <span>{{ product.isInCart ? 'View In Cart' : 'Add to Cart' }}</span> -->
            </b-button>
          </div>
        </b-card>
      </section>

      <!-- Pagination -->
      <section>
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
      </section>
    </b-overlay>
  </div>
</template>

<script>
import {
  BRow, BCol, BCard, BImg, BButton, BPagination, BOverlay,
} from 'bootstrap-vue';
import useJwt from '@/auth/jwt/useJwt';
import Ripple from 'vue-ripple-directive';

import { useResponsiveAppLeftSidebarVisibility } from '@core/comp-functions/ui/app';
import { useShopFiltersSortingAndPagination, useShopUi, useShopRemoteData } from './useECommerceShop';
import { useEcommerceUi } from './useEcommerce';

export default {
  directives: {
    Ripple,
  },
  components: {
    // BSV
    BRow,
    BCol,
    BCard,

    BImg,
    BButton,
    BOverlay,
    BPagination,

    // SFC

  },
  setup() {
    const {
      filters, filterOptions, sortBy, sortByOptions,
    } = useShopFiltersSortingAndPagination();

    const { handleCartActionClick, toggleProductInWishlist } = useEcommerceUi();

    let loadDone = false;

    const {
      itemView, itemViewOptions, totalProducts,
    } = useShopUi();

    const { products } = useShopRemoteData();

    const { mqShallShowLeftSidebar } = useResponsiveAppLeftSidebarVisibility();

    // Wrapper Function for `fetchProducts` which can be triggered initially and upon changes of filters

    const fetchShopProducts = () => {
      loadDone = true;
      useJwt.getCardsDate()
        .then((response) => {
          products.value = response.data;
          totalProducts.value = products.value.data.length;
          console.log(products.value);
          loadDone = false;
        });
      return products.value;
    };

    fetchShopProducts();

    return {
      // useShopFiltersSortingAndPagination
      filters,
      filterOptions,
      sortBy,
      sortByOptions,
      loadDone,
      // useShopUi
      itemView,
      itemViewOptions,
      totalProducts,
      toggleProductInWishlist,
      handleCartActionClick,

      // useShopRemoteData
      products,

      // mqShallShowLeftSidebar
      mqShallShowLeftSidebar,
    };
  },
};
</script>

<style lang="scss">
@import "~@core/scss/base/pages/app-ecommerce.scss";
</style>

<style lang="scss" scoped>
.item-view-radio-group ::v-deep {
  .btn {
    display: flex;
    align-items: center;
  }
}
</style>
