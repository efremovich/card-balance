<template>
  <div
    id="vprint">
    <div

      class="d-flex flex-row flex-wrap justify-content-around"
      :rangeStart="today"
      :rangeEnd="firstDay"
      :transactions="transactions"
      :toogle="onlyForPrintandDownload">
      <p>
        {{ rangeStart }}
      </p>
      <template
        v-for="(item,index) in transactions.data.result">
        <!-- <p
          v-if="print"
          :key="item.card_number">
          Электронные чеки за период {{ rangeDate }}
        </p> -->

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
      type: Array,
      default: () => [],
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
.flex {
  display: flex !important;
  flex-wrap: wrap !important;
  justify-content: space-evenly !important;
}

.container,
.container-fluid {
  padding-right: 15px;
  padding-left: 15px;
  margin-right: auto;
  width: 100%;
  margin-left: auto;
}
.row,
html {
  display: -webkit-box;
}
.flex-column,
.flex-row {
  -webkit-box-direction: normal !important;
}
.heading-1,
.heading-2,
.heading-3,
body,
h1,
h2,
h3 {
  font-style: normal;
  font-stretch: normal;
  letter-spacing: normal;
}

@media only screen and (min-device-width: 480px) {
  .container {
    max-width: 290px;
  }
}
@media only screen and (min-device-width: 768px) {
  .container {
    max-width: 708px;
  }
}
@media only screen and (min-device-width: 1025px) {
  .container {
    max-width: 964px;
  }
}
@media only screen and (min-device-width: 1230px) {
  .container {
    max-width: 1170px;
  }
}

.check__value {
  text-align: end;
}

@media only screen and (min-device-width: 1024px) {
  .col-5 {
    display: flex;
    flex-grow: 0;
    flex-shrink: 0;
    flex-basis: 10%;
    max-width: 330px;
  }
}

@media only screen and(min-device-width: 768px) and (max-device-width: 1023px) {
  .col-5 {
    display: flex;
    flex-grow: 0;
    flex-shrink: 0;
    flex-basis: 10%;
    max-width: 50.33333%;
  }
}

@media only screen and(min-device-width: 620px) and (max-device-width: 767px) {
  .col-5 {
    display: flex;
    display: -moz-flex;
    display: -webkit-flex;
    display: -ms-flex;
    display: flex;
    // -ms-flex: 0 0 33.33333%;
    // flex: 0 0 33.33333%;
    flex-grow: 0;
    flex-shrink: 0;
    flex-basis: 10%;
    max-width: 60.33333%;
  }
}

@media only screen and (min-device-width: 380px) and (max-device-width: 619px) {
  .col-5 {
    display: flex;
    display: -moz-flex;
    display: -webkit-flex;
    display: -ms-flex;
    display: flex;
    // -ms-flex: 0 0 33.33333%;
    flex: 0 0 10%;
    max-width: 100%;
  }
}

.check {
  padding: 20px 0;
  min-width: 320px;
}
.check__content,
.check__header {
  margin-bottom: 20px;
}
.check__organization {
  text-align: center;
}
.check__row {
  display: -webkit-box;
  display: -ms-flexbox;
  display: flex;
  -webkit-box-align: centerl;
  -ms-flex-align: centerl;
  align-items: centerl;
  -webkit-box-pack: justify;
  -ms-flex-pack: justify;
  justify-content: space-between;
  line-height: 1.4;
}
.check__row--black {
  -webkit-box-pack: center;
  -ms-flex-pack: center;
  justify-content: center;
  text-transform: uppercase;
  text-align: center;
  color: #fff;
  background-color: #000;
  -webkit-transition: all 0.25s ease;
  transition: all 0.25s ease;
}
.check__row--black:hover {
  color: #000;
  background: #fff;
}
.check__rq {
  display: block;
  margin-left: auto;
  margin-right: auto;
}
</style>
