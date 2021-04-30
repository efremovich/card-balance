<template>
  <b-card title="Статистика по карте " />
</template>

<script>
import { BCard } from 'bootstrap-vue';
import { useRouter } from '@core/utils/utils';
import { ref } from '@vue/composition-api';

export default {
  components: {
    BCard,
  },
  props: {
    number: {
      type: [Number, String],
      default: null,
    },
  },
  setup() {
    // const { handleCartActionClick, toggleProductInWishlist } = useEcommerceUi();

    const product = ref(null);

    // Remote Data
    const fetchProduct = () => {
      // Get product  id from URL
      const { route } = useRouter();
      const productSlug = route.value.params.card_number;
      console.log(productSlug);
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
    const selectedColor = ref(null);

    fetchProduct();

    return {
      // Fetched Product
      product,

      // UI
      selectedColor,
      // handleCartActionClick,
      // toggleProductInWishlist,
    };
  },
};
</script>

<style></style>
