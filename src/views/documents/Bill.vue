<template>
  <b-overlay
    :show="!download"
    variant="black"
    spinner-type="grow"
    spinner-variant="primary"
    blur="2px"
    opacity=".75"
    rounded="md">
    <div
      v-if="download">
      <b-card>
        <p>Создать счёт по договору №  {{ contract }}</p>
        <v-select
          v-model="selected"
          :clearable="false"
          :options="option"
          class="w-100 mt-1 mb-1" />
        <b-form-input
          v-model="summ"
          autofocus
          placeholder="Введите сумму"
          class="mt-1"
          @input="getVisible" />
        <b-button
          v-if="visible"
          variant="success"
          class="btn btn-primary mt-1"
          @click="getPrint()">
          Печать
        </b-button>

        <div
          class="mt-2"
          style="width:90%; margin:0 auto; max-width:1000px;">
          <div
            v-show="visible"
            id="check"
            class="main"
            style="margin-top:60px">
            <table
              width="100%"
              style="font-family: Arial;">
              <!-- <tr>
                <td style="width: 68%; padding: 20px 0;">
                  <div style="text-align: justify; font-size: 11pt;">
                    Офис компании расположен по адресу: г.Краснодар, ул.Индустриальная 6, 3 эт. МЕСТО ДЛЯ РЕКЛАМЫ
                  </div>
                </td>
                <td style="width: 32%; text-align: center; padding: 30px 0;">

                  <img
                    src="http://createqr.ru/invoice?Name=Иванов И. И.&PersonalAcc=40802810902280000111&BankName=АО 'АЛЬФА-БАНК' &BIC=044525593&CorrespAcc=30101810200000000593&SumRub=100&Purpose=Оплата по счету"
                    style="width: 70%; height=150;">
                </td>
              </tr> -->
            </table>

            <table
              width="100%"
              border="2"
              style="border-collapse: collapse; width: 100%; font-family: Arial;"
              cellpadding="2"
              cellspacing="2">
              <tr style="">
                <td
                  colspan="2"
                  rowspan="2"
                  style="min-height:13mm; width: 105mm;">
                  <table
                    width="100%"
                    border="0"
                    cellpadding="0"
                    cellspacing="0"
                    style="height: 13mm;">
                    <tr>
                      <td valign="top">
                        <div> {{ organisationId.data.pay_account.name }} </div>
                      </td>
                    </tr>
                    <tr>
                      <td
                        valign="bottom"
                        style="height: 3mm;">
                        <div style="font-size:10pt;">
                          Банк получателя
                        </div>
                      </td>
                    </tr>
                  </table>
                </td>
                <td style="min-height:7mm;height:auto; width: 25mm;">
                  <div>БИK </div>
                </td>
                <td
                  rowspan="2"
                  style="vertical-align: top; width: 60mm;">
                  <div style=" height: 7mm; line-height: 7mm; vertical-align: middle;">
                    {{ organisationId.data.pay_account.bik }}
                  </div>
                  <div> {{ organisationId.data.pay_account.cor_account }}</div>
                </td>
              </tr>
              <tr>
                <td style="width: 25mm;">
                  <div>Сч. №</div>
                </td>
              </tr>
              <tr>
                <td style="min-height:6mm; height:auto; width: 50mm;">
                  <div>ИНН {{ organisationId.data.company.inn }}</div>
                </td>
                <td style="min-height:6mm; height:auto; width: 55mm;">
                  <div>КПП {{ organisationId.data.company.kpp }}</div>
                </td>
                <td
                  rowspan="2"
                  style="min-height:19mm; height:auto; vertical-align: top; width: 25mm;">
                  <div>Сч. №</div>
                </td>
                <td
                  rowspan="2"
                  style="min-height:19mm; height:auto; vertical-align: top; width: 60mm;">
                  <div>{{ organisationId.data.pay_account.checking_account }}</div>
                </td>
              </tr>
              <tr>
                <td
                  colspan="2"
                  style="min-height:13mm; height:auto;">
                  <table
                    border="0"
                    cellpadding="0"
                    cellspacing="0"
                    style="height: 13mm; width: 105mm;">
                    <tr>
                      <td valign="top">
                        <div> {{ provider[0].name }} </div>
                      </td>
                    </tr>
                    <tr>
                      <td
                        valign="bottom"
                        style="height: 3mm;">
                        <div style="font-size: 10pt;">
                          Получатель
                        </div>
                      </td>
                    </tr>
                  </table>
                </td>
              </tr>
            </table>
            <br>

            <div style="font-weight: bold; font-size: 25pt; padding-left:5px; font-family: Arial;">
              Счёт на оплату No {{ getRandom }} от {{ isToday() }}
            </div>
            <br>
            <hr style="border:2px solid black">
            <!-- <div style="background-color:#000000; width:100%; font-size:1px; height:2px;">
&nbsp;
            </div> -->

            <table
              width="100%"
              style=" border-collapse: separate;font-family: Arial;margin-top:10px; border-spacing: 0 5px;">
              <tr>
                <td style="width: 30mm; vertical-align: top; margin-top:10px;">
                  <div style=" padding-left:2px;">
                    Поставщик:
                  </div>
                </td>
                <td>
                  <div style="font-weight:bold;  padding-left:2px;">
                    ИНН {{ provider[0].inn }}, КПП {{ provider[0].kpp }}, {{ provider[0].name }}, <br>
                    <span style="font-weight: normal;">{{ provider[0].legal_address }}</span>
                  </div>
                </td>
              </tr>
              <tr style="margin-top:10px;">
                <td style="width: 30mm; vertical-align: top;">
                  <div style=" padding-left:2px;">
                    Покупатель:
                  </div>
                </td>
                <td>
                  <div style="font-weight:bold;padding-left:2px;">
                    ИНН {{ getInfo.contract.company.inn }}, КПП {{ getInfo.contract.company.kpp }}, {{ getInfo.contract.company.full_name }}, <br>
                    <span style="font-weight: normal;">{{ getInfo.contract.company.legal_address }}</span>
                  </div>
                </td>
              </tr>
              <tr style="margin-top:10px;">
                <td style="width: 30mm; vertical-align: top; margin-top:10px;">
                  <div style=" padding-left:2px;">
                    Основание:
                  </div>
                </td>
                <td>
                  <div style="font-weight:bold;  padding-left:2px;">
                    Договор №{{ getInfo.contract.number }} от {{ getInfo.contract.date | formatDateNoTime }}
                  </div>
                </td>
              </tr>
            </table>

            <table
              border="2"
              width="100%"
              cellpadding="2"
              cellspacing="2"
              style="border-collapse: collapse; width: 100%; font-family: Arial;margin-top:10px;">
              <thead>
                <tr>
                  <th style="width:13mm;">
                    №
                  </th>

                  <th style="text-align:center">
                    Товары (работы, услуги)
                  </th>
                  <!-- <th style="width:20mm; ">
                    Кол-во
                  </th> -->
                  <!-- <th style="width:17mm; ">
                    Ед.
                  </th> -->
                  <th style="width:27mm;text-align:center">
                    Цена
                  </th>
                  <th style="width:27mm;text-align:center">
                    Сумма
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td style="width:13mm;text-align:center">
                    1.
                  </td>

                  <td>{{ selected }}</td>
                  <!-- <td style="width:20mm; ">
                    Кол-во
                  </td>
                  <td style="width:17mm; ">
                    Шт.
                  </td> -->
                  <td style="width:27mm; text-align: center; ">
                    {{ getSumm }}
                  </td>
                  <td style="width:27mm; text-align: center; ">
                    {{ getSumm }}
                  </td>
                </tr>
              </tbody>
            </table>

            <table
              style="font-family: Arial;"
              border="0"
              width="100%"
              cellpadding="1"
              cellspacing="1">
              <tr>
                <td />
                <td style="width:27mm; font-weight:bold;  text-align:right;">
                  Итого:
                </td>
                <td style="width:27mm; font-weight:bold;  text-align: center; ">
                  {{ getSumm }}
                </td>
              </tr>
              <tr>
                <td />
                <td style="width:27mm; font-weight:bold;  text-align:right;">
                  в том НДС:
                </td>
                <td style="width:27mm; font-weight:bold;  text-align: center; ">
                  {{ getNDS }}
                </td>
              </tr>
              <tr>
                <td />
                <td style="width:37mm; font-weight:bold;  text-align:right;">
                  Всего к оплате:
                </td>
                <td style="width:27mm; font-weight:bold;  text-align: center; ">
                  {{ getSumm }}
                </td>
              </tr>
            </table>

            <br>
            <div style="font-family: Arial;">
              Всего наименований 1 на сумму  {{ getSumm }}.<br>
            </div>
            <hr style="border:2px solid black">
            <br>
            <!-- <div style="background-color:#000000; width:100%; font-size:1px; height:2px;">
&nbsp;
            </div> -->
            <br>
            <!-- <div style="font-family: Arial; font-size: 10pt;">
              1. Счет действителен в течении 5 (пяти) банковских дней, не считая дня выписки счета. В случае нарушения срока оплаты сохранение цены на товар и наличие товара на складе НЕ ГАРАНТИРУЕТСЯ.<br>
              2. Оплата данного счета означает согласие с условиями изложенными в п.1
            </div> -->

            <div style="background: url('<!--url печати в png сюда-->');  background-repeat: no-repeat; padding: 30px 10px; width: 400px; height: 250px;">
              <div style="font-weight:bold;">
                Руководитель ___________________________
              </div>
              <br>  <br><br>

              <div style="font-weight:bold;">
                Главный бухгалтер ______________________
              </div>
              <br>

              <div style="width: 85mm;text-align:center;">
                М.П.
              </div>
              <br>
            </div>
          </div>
        </div>
      </b-card>
    </div>
  </b-overlay>
</template>

<script>
import {
  BCard, BFormInput, BButton, BOverlay,
} from 'bootstrap-vue';
import useJwt from '@/auth/jwt/useJwt';
import vSelect from 'vue-select';
import { mapGetters } from 'vuex';
import store from '@/store';

export default {
  components: {
    BCard,
    BFormInput,
    BButton,
    BOverlay,
    vSelect,
  },
  data() {
    return {
      getInfo: null,
      option: ['Оплата за ГСМ согласно договора поставки ', 'Предоплата за ГСМ  согласно договора поставки ', 'Оплата за информационное обслуживание согласно договора поставки ', 'Оплата за утерянную топливную карту по договору '],
      today: null,
      fullContract: null,
      provider: '',
      selected: 'Оплата за ГСМ согласно договора поставки ',
      contractId: null,
      allProviders: null,
      yetContract: null,
      organisationId: '',
      allPayAccounts: null,
      summ: '',
      payAccount: null,
      visible: false,
      download: false,
      NDS: 20,
    };
  },
  computed: {
    getNDS() {
      return ((this.summ * this.NDS) / 100).toLocaleString('ru-RU', {
        style: 'currency',
        currency: 'RUB',
      });
    },
    ...mapGetters({
      gotSelected: 'CONTRACT_NUMBER',
      gotSelectedContract: 'CONTRACT_ID',
    }),
    getSumm() {
      return Number(this.summ).toLocaleString('ru-RU', {
        style: 'currency',
        currency: 'RUB',
      });
    },
    getWidth() {
      return store.getters['app/currentBreakPoint'];
    },
    getRandom() {
      return Math.floor(Math.random() * 10000);
    },
    contract() {
      return this.fullContract;
    },
  },
  watch: {
    gotSelectedContract(val) {
      this.getOrgID(val);
      this.getChangeContract(val);
    },
  },
  created() {
    const userData = JSON.parse(localStorage.getItem('userData'));

    if (userData && this.gotSelected === null) {
      this.yetContract = userData;
      this.contractId = this.yetContract.contract.id;
    } else this.contractId = this.gotSelectedContract;

    this.getOrgID(this.contractId);
    this.getChangeContract(this.contractId);
  },

  mounted() {
    this.download = true;
  },
  methods: {
    isToday() {
      const today = new Date();
      return today.toLocaleDateString();
    },
    getOrgID(val) {
      useJwt.getOrgId(val)
        .then((response) => {
          if (response.status) {
            this.organisationId = response.data;
            const filter = this.organisationId.data.organisation_id;
            useJwt.getAllProviders(val)
              .then((status) => {
                if (status.status) {
                  this.allProviders = status.data;
                  this.provider = this.allProviders.data.filter((el) => el.id === filter);
                }
              });
          }
        });
    },
    getChangeContract(val) {
      useJwt.changeContract(val)
        .then((response) => {
          if (response.status) {
            this.getInfo = response.data;
            this.dateContract = this.getInfo.contract.date.split('').splice(0, 10).join('');
            this.fullContract = `${this.getInfo.contract.number} от ${this.dateContract}`;
          }
        });
    },
    getVisible() {
      if (this.summ.split('').length > 0) {
        this.visible = true;
      } else this.visible = false;
    },
    getPrint() {
      this.$htmlToPaper('check');
    },
  },
};
</script>

<style lang="scss" scoped>
@import "../../assets/scss/components/bill";
</style>
