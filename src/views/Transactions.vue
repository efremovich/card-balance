<template>
  <div>
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
    <b-card
      class="card-transaction"
      no-body>
      <b-card-header>
        <b-card-title>Tранзакции</b-card-title>
      </b-card-header>

      <b-card-body>
        <div
          v-for="transaction in transactionData"
          :key="transaction.mode"
          class="transaction-item">
          <b-media no-body>
            <b-media-aside>
              <b-avatar
                rounded
                size="42"
                :variant="transaction.avatarVariant">
                <feather-icon
                  size="18"
                  :icon="transaction.avatar" />
              </b-avatar>
            </b-media-aside>
            <b-media-body>
              <h6 class="transaction-title">
                {{ transaction.mode }}
              </h6>
              <small>{{ transaction.types }}</small>
            </b-media-body>
          </b-media>
          <div
            class="font-weight-bolder"
            :class="transaction.deduction ? 'text-danger':'text-success'">
            {{ transaction.payment }}
          </div>
        </div>
      </b-card-body>
    </b-card>
  </div>
</template>

<script>
import {
  BCard, BCardHeader, BCardTitle, BCardBody, BMediaBody, BMedia, BMediaAside, BAvatar, BInputGroup, BFormGroup,
  BFormInput, BButton,
} from 'bootstrap-vue';

export default {
  components: {
    BCard,
    BCardHeader,
    BCardTitle,
    BCardBody,
    BMediaBody,
    BMedia,
    BMediaAside,
    BAvatar,
    BFormGroup,
    BFormInput,
    BInputGroup,
    BButton,
  },
  data() {
    return {
      transactionData: [
        {
          mode: 'Wallet',
          types: 'Starbucks',
          avatar: 'PocketIcon',
          avatarVariant: 'light-primary',
          payment: '-$74',
          deduction: true,
        },
        {
          mode: 'Bank Transfer',
          types: 'Add Money',
          avatar: 'CheckIcon',
          avatarVariant: 'light-success',
          payment: '+$480',
          deduction: false,
        },
        {
          mode: 'Paypal',
          types: 'Add Money',
          avatar: 'DollarSignIcon',
          avatarVariant: 'light-danger',
          payment: '+$480',
          deduction: false,
        },
        {
          mode: 'Mastercard',
          types: 'Ordered Food',
          avatar: 'CreditCardIcon',
          avatarVariant: 'light-warning',
          payment: '-$23',
          deduction: true,
        },
        {
          mode: 'Transfer',
          types: 'Refund',
          avatar: 'TrendingUpIcon',
          avatarVariant: 'light-info',
          payment: '+$98',
          deduction: false,
        },
      ],
    };
  },
};

</script>

<style></style>
