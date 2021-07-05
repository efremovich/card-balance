<template>
  <div
    id="vprint">
    <div

      class="d-flex flex-row flex-wrap justify-content-around"
      :rangeStart="today"
      :rangeEnd="firstDay"
      :transactions="transactions"
      :toogle="onlyForPrintandDownload">
      <template
        v-for="(item,index) in transactions.data.result">
        <div
          :key="index"
          class="col-5"
          style="page-break-before: auto;
          page-break-after:avoid;
          ">
          <div
            class="check">
            <div
              v-if="toogle
                && item.card_number[index] === item.card_number[index+1]"
              :key="item.card_number"

              class="col-12 text-center">
              Операции по карте   {{ item.card_number }} <br> за период c {{ firstDay }} по {{ today }}
            </div>
            <div
              class="d-flex flex-column align-items-center  mt-2 mb-2"
              style="
              page-break-inside: avoid;
              ">
              <div
                class="check__organization">
                {{ item.pos.seller }}
              </div>

              <div
                class="d-flex flex-column"
                style="page-break-after: avoid;">
                <p
                  class="text-center">
                  Адрес места расчётов:
                  <br>
                  {{ item.pos.address }}
                </p>
              </div>
            </div>

            <div
              class="check__content"
              style="margin-bottom: 20px;
                ">
              <div
                class="d-flex justify-content-between">
                <div
                  class="check__label">
                  Тип операции
                </div>
                <div
                  class="check__value">
                  {{ item.operation_type }}
                </div>
              </div>

              <div
                class="check__column">
                <div
                  class="d-flex justify-content-between"
                  style="width: 100%;
                ">
                  <div
                    class="check__label">
                    Бензин <br> автомобильный
                  </div>
                  <div
                    class="check__value">
                    {{ item.service.full_name }}
                  </div>
                </div>

                <div
                  class="d-flex justify-content-between"
                  style="width: 100%;
                  ">
                  <div
                    class="check__label">
                    Объем топлива
                  </div>
                  <div
                    class="check__value">
                    {{ item.quantity }}
                  </div>
                </div>

                <div
                  class="d-flex justify-content-between"
                  style="width: 100%;
                  ">
                  <div
                    class="check__label">
                    Цена
                  </div>
                  <div
                    class="check__value">
                    определяется договором
                  </div>
                </div>

                <div
                  class="d-flex justify-content-between"
                  style="width: 100%;page-break-inside: avoid;
                  ">
                  <div
                    class="check__label"
                    style="page-break-inside: avoid;">
                    Сумма
                  </div>
                  <div
                    class="check__value"
                    style="page-break-inside: avoid;">
                    {{ item.summ }}
                  </div>
                </div>

                <div
                  class="d-flex justify-content-between"
                  style="width: 100%;page-break-inside: avoid;
                  ">
                  <div class="check__label">
                    ТК:
                  </div>
                  <div class="check__value">
                    {{ item.card_number }}
                  </div>
                </div>

                <div
                  class="d-flex justify-content-between"
                  style="width: 100%;
                  ">
                  <div class="check__label">
                    Дата:
                  </div>
                  <div class="check__value">
                    {{ item.date | formatDate }}
                  </div>
                </div>

                <div
                  class="d-flex justify-content-between"
                  style="width: 100%;">
                  <div class="check__label">
                    RNN
                  </div>
                  <div class="check__value">
                    {{ item.pos_id }}
                  </div>
                </div>

                <div
                  class="d-flex justify-content-between mb-1"
                  style="width: 100%;
                                    ">
                  <div class="check__label">
                    Операция подтверждена
                  </div>
                  <div
                    class="check__value">
                    Вводом ПИН
                  </div>
                </div>

                <div
                  class="check__row check__row--black"
                  style="width: 100%;
                    -webkit-box-pack: center;
                    -ms-flex-pack: center;
                    justify-content: center;
                    text-transform: uppercase;
                    text-align: center;
                    color: #fff;
                    background-color: #000;
                    -webkit-transition: all 0.25s ease;
                    transition: all 0.25s ease;
                    page-break-inside: avoid;">
                  ОДОБРЕНО (RC: 0)
                </div>
              </div>
            </div>
          </div>
        </div>
      </template>
    </div>
  </div>
</template>

<script>

export default {
  props: {
    transactions: {
      type: Object,
      default: () => {},
    },
    today: {
      type: [String],
      default() {
        const today = new Date();
        return today.toLocaleDateString();
      },
    },
    firstDay: {
      type: [String],
      default() {
        const date = new Date();
        const firstDay = new Date(date.getFullYear(), date.getMonth(), 1).toLocaleDateString();
        return firstDay;
      },
    },
    onlyForPrintandDownload: {
      type: Boolean,
      default: false,
    },
  },

  data() {
    return {
      toogle: this.onlyForPrintandDownload,

    };
  },

};
</script>

<style lang="scss" scoped>
@import "../assets/scss/components/v-print";
</style>
