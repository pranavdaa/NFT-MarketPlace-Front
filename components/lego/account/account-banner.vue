<template>
  <div class="row ps-y-16 ps-x-16 account-banner">
    <div
      class="col-12 col-lg d-flex flex-column flex-md-row justify-content-center justify-content-lg-start"
    >
      <svg-sprite-icon name="profile" class="profile-pic align-self-center" />
      <div
        class="d-flex flex-column align-self-center ps-l-md-16 text-center text-md-left ps-t-16 ps-t-md-0"
      >
        <div class="white-color name ps-b-4 font-heading-small font-semibold">
          {{ account.name }}
        </div>
        <div class="d-flex flex-row">
          <div class="white-color address font-body-medium">
            {{ account.address.toUpperCase() }}
          </div>
          <div class="white-color address-short font-body-medium">
            {{ account.shortChecksumAddress }}
          </div>
          &nbsp; &nbsp;
          <div class="copy-wrapper" @click.stop.prevent="copyAddress">
            <img
              name="copy-white"
              src="~/assets/svg/copy-white.svg"
              v-if="copyAnim === false"
            />
            <lottie
              :options="defaultOptions"
              :width="24"
              :height="24"
              v-if="copyAnim === true"
            />
          </div>
        </div>
      </div>
    </div>
    <div
      class="col-12 col-lg d-flex left-content text-center text-sm-left justify-content-center ps-t-16 ps-t-md-32 ps-t-lg-0 justify-content-lg-end"
    >
      <div
        class="d-flex flex-column align-self-center ms-r-32 justify-content-start"
      >
        <div class="white-color name ps-b-4 font-heading-small font-semibold">
          {{ $t("account.banner.totalNft") }}
        </div>
        <div class="white-color amount font-body-medium text-right">
          {{ totalMaticNft + totalMainNft }}
        </div>
      </div>
      <div
        class="d-flex flex-column align-self-center ms-r-32 justify-content-start"
      >
        <div class="white-color name ps-b-4 font-heading-small font-semibold">
          {{ $t("account.banner.WETHBalance") }}
        </div>
        <div
          v-if="erc20Tokens[1]"
          class="white-color amount font-body-medium text-right"
        >
          {{ formattedFullUSDBalance(1) }}
        </div>
      </div>
      <div
        class="d-flex flex-column align-self-center ms-r-32 justify-content-start"
      >
        <div class="white-color name ps-b-4 font-heading-small font-semibold">
          {{ $t("account.banner.DAIBalance") }}
        </div>
        <div
          v-if="erc20Tokens[0]"
          class="white-color amount font-body-medium text-right"
        >
          {{ formattedFullUSDBalance(0) }}
        </div>
      </div>

      <div class="align-self-center">
        <button class="btn btn-light ml-auto" @click="depositModal = true">
          {{ $t("account.banner.depositWeth") }}
        </button>
      </div>
    </div>
    <deposit-weth
      :show="depositModal"
      :close="closeDepositModal"
    ></deposit-weth>
  </div>
</template>

<script>
import Vue from "vue";
import Component from "nuxt-class-component";
import copy from "copy-to-clipboard";
import Lottie from "vue-lottie";
import { mapGetters } from "vuex";

import app from "~/plugins/app";
import DepositWeth from "~/components/lego/modals/deposit-weth";
import * as animationData from "~/static/lottie-animations/green-check.json";
import { stripZeros } from "ethereumjs-util";

@Component({
  props: {},
  components: { DepositWeth, Lottie },
  computed: {
    ...mapGetters("account", ["account", "totalMaticNft", "totalMainNft"]),
    ...mapGetters("token", ["totalCurrencyBalance", "erc20Tokens"]),
    ...mapGetters("network", ["networkMeta"]),
  },
  data() {
    return {
      depositModal: false,
    };
  },
  methods: {
    closeDepositModal() {
      this.depositModal = false;
    },

    copyAnimation(show) {
      this.copyAnim = show;
    },

    copyAddress() {
      this.copyAnimation(true);
      copy(this.account.checksumAddress || this.account.address);
      setTimeout(() => {
        this.copyAnimation(false);
      }, 3000);
    },
  },
})
export default class AccountBanner extends Vue {
  defaultOptions = { animationData: animationData.default, loop: false };
  animationSpeed = 2;
  copyAnim = false;

  // Widget event listener
  maticWidgetEventsListener = (event) => {
    let targetedEvents = [
      event.eventTypes.TRANSFER.onReceipt,
      event.eventTypes.DEPOSIT.onReceipt,
      event.eventTypes.WITHDRAW_INIT.onReceipt,
      event.eventTypes.WITHDRAW_CONFIRM.onReceipt,
      event.eventTypes.WITHDRAW_EXIT.onReceipt,
    ];
    if (targetedEvents.includes(event.data.type)) {
      this.$store.dispatch("token/reloadBalances");
    }
  };

  mounted() {
    // Register widget event listner
    window.maticWidgetEventsListener = this.maticWidgetEventsListener;
  }

  formattedFullUSDBalance(index) {
    let currencyBalance = this.totalCurrencyBalance;
    for (let i = 0; i < currencyBalance.length; i++){
      if(currencyBalance[i] && parseFloat(currencyBalance[i])>0){
        currencyBalance[i] = parseFloat(currencyBalance[i].toFixed(3))
      }
      else{
        currencyBalance[i] = "00.00"
      }
    }
    return currencyBalance[index]
  }

  get widgetKey() {
    if (app.uiconfig && app.uiconfig.maticWidgetKey) {
      return app.uiconfig.maticWidgetKey;
    }
    return null;
  }
}
</script>

<style lang="scss" scoped="true">
@import "~assets/css/theme/_theme";

.white-color {
  color: light-color("700");
}
.account-banner {
  background-color: primary-color("600");

  .profile-pic {
    min-width: 64px !important;
    min-height: 64px !important;
  }
}

.copy-wrapper {
  cursor: pointer;
  height: 24px;
  width: 24px;
  z-index: 99;
}

.address-short {
  display: none;
}
.btn {
  min-width: fit-content;
}

@media (max-width: 400px) {
  .address {
    display: none;
  }
  .address-short {
    display: block;
  }
  .left-content {
    flex-direction: column;
  }
  .ms-r-32 {
    margin-right: 0px !important;
  }
  .justify-content-start {
    justify-content: center !important;
  }
  .amount {
    // padding-top: 1rem;
    padding-bottom: 1rem;
  }
}
</style>
