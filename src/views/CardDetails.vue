<template>
  <div>
    <b-card
      title="Настройка карты">
      <h3> Информация по карте № {{ product }}</h3>
      <p class="mt-1">
        {{ date.data }}
      </p>
      <div class="d-flex flex-wrap">
        <div class="image col-4">
          <b-img
            class="card-img-top"
            :src="require(`../assets/images/cards-icon/${date.data.emitent.code}.svg`)">
            <!-- getImage(product.emitent.code)"  -->
            <!-- require(`../assets/images/cards-icon/${product.emitent.code}.svg`) -->
          </b-img>
          <div class="item-wrapper">
            <h6 class="item-price">
              PIN: {{ date.data.pin }}
            </h6>
            <h5 class="item-price">
              {{ date.data.number }}
            </h5>
            <!-- <h4 class="status">
             Держатель:  {{ date.data.card_status.name }}
            </h4> -->
            <!-- <b-button
              variant="danger"
              class="btn mt-2 mx-auto"
              @click="handleCartActionClick(product)">
              Заблокировать карту
              <feather-icon
                icon="LockIcon"
                class="mr-50" />
            </b-button> -->
          </div>
        </div>
        <div class="col-4 ml-2">
          <h4>
            Выдана: {{ date.data.limits[0].CreatedAt | formatDate }}
          </h4>
        </div>
        <!-- <div class="appex">
            <vue-apex-charts
              type="radialBar"
              height="325"
              :options="productOrdersRadialBar.chartOptions"
              :series="productOrdersRadialBar.series" /> -->

        <!-- chart info -->
        <!-- <div
              v-for="(data,key,index) in date.data"
              :key="key"
              class="d-flex justify-content-between"
              :class="index === Object.keys(chartInfo.chartInfo).length - 1 ? '':'mb-1'">
              <div class="series-info d-flex align-items-center">
                <feather-icon
                  icon="CircleIcon"
                  size="16"
                  :class="key === 'finished' ? 'text-primary': key==='pending'?'text-warning':'text-danger'" />
                <span class="font-weight-bold text-capitalize ml-75">{{ key }}</span>
              </div>

              <span>{{ data }}</span>
            </div> -->
        <!-- </div> -->
      </div>
      <b-tabs
        content-class="pt-1"
        fill>
        <b-tab
          title="Лимиты" />
        <b-tab
          active
          title="Транзакции" />
        <b-tab title="События" />
        <b-tab title="Сообщить о проблеме" />
      </b-tabs>
    </b-card>
  </div>
</template>

<script>
import {
  BCard, BImg, BTabs, BTab,
} from 'bootstrap-vue';
import useJwt from '@/auth/jwt/useJwt';
import { useRouter } from '@core/utils/utils';
import { ref } from '@vue/composition-api';
// import VueApexCharts from 'vue-apexcharts';
// import { formatDate } from '@core/utils/filter';

export default {
  components: {
    BCard,
    BImg,
    BTabs,
    BTab,
    // BButton,
    // VueApexCharts,
    // formatDate,
  },

  setup() {
    // const { handleCartActionClick, toggleProductInWishlist } = useEcommerceUi();
    const date = ref(null);
    const product = ref(null);

    const cardDate = (param) => useJwt.getCardDate(param).then((response) => {
      if (response.data.status) {
        date.value = response.data;
        console.log(date.value);
      }
    });
    // Remote Data
    const fetchProduct = () => {
      // Get product  id from URL
      const { route } = useRouter();
      const productSlug = route.value.params.card_number;
      product.value = productSlug;
      cardDate(productSlug);
      // store
      //   .dispatch('app-ecommerce/fetchProduct', { productId })
      //   .then((response) => {
      //     product.value = response.data.product;
      //   })
      //   .catch((error) => {
      //     if (error.response.status === 404) {
      //       product.value = undefined;
      //     }
      //   });
    };

    // UI
    // const selectedColor = ref(null);

    fetchProduct();
    // cardDate();

    return {
      // Fetched Product
      product,
      date,
      // selectedColor,
      // handleCartActionClick,
      // toggleProductInWishlist,
    };
  },
  // data() {
  //   return {
  //     number: null,
  //   };
  // },
};
</script>

<style lang="scss" scoped>
.card {
  display: flex;
  flex-wrap: wrap;
  justify-content: end;
  max-width: 95%;
  align-items: center;
  padding: 3px;
}

.card-img-top {
  max-width: 390px;
  min-width: 350px;
}

.item-wrapper {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  position: relative;
  bottom: 110px;
  left: 20px;
}

.item-options {
  display: flex;
  flex-direction: column;
  position: absolute !important;
  bottom: 35px !important;
  width: 100%;
}

.status {
  position: relative;
  top: 40px;
}

.ecommerce-card {
  background-color: inherit !important;
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
  color: #000;
  text-align: center;
  text-shadow: -1px -1px 1px rgba(255, 255, 255, 0.5),
    1px 1px 1px rgba(0, 0, 0, 0.5);
}

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
</style>
