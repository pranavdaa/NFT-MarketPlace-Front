<template>
  <div class="row ps-y-32 ps-x-16 account-banner">
    <div
      class="col-12 col-lg d-flex flex-column flex-md-row justify-content-center justify-content-lg-start"
    >
      <svg-sprite-icon name="profile" class="profile-pic align-self-center" />
      <div
        class="d-flex flex-column align-self-center ps-l-md-16 text-center text-md-left ps-t-16 ps-t-md-0"
      >
        <div class="name ps-b-4 font-heading-small font-semibold">
          {{ account.name }}
        </div>
        <div class="address font-body-medium">
          {{ account.address.toUpperCase() }}
        </div>
        <div class="address-short font-body-medium">
          {{ account.shortChecksumAddress }}
        </div>
      </div>
    </div>
    <div
      class="col-12 col-lg d-flex left-content text-center text-sm-left justify-content-center ps-t-16 ps-t-md-32 ps-t-lg-0 justify-content-lg-end"
    >
      <div
        class="d-flex flex-column align-self-center ms-r-32 justify-content-start"
      >
        <div class="name ps-b-4 font-heading-small font-semibold">
          {{ $t("account.banner.totalNft") }}
        </div>
        <div class="amount font-body-medium">
          {{ totalMaticNft + totalMainNft }}
        </div>
      </div>
      <div
        class="d-flex flex-column align-self-center ms-r-32 justify-content-start"
      >
        <div class="name ps-b-4 font-heading-small font-semibold">
          {{ $t("account.banner.balance") }}
        </div>
        <div v-if="erc20Tokens[0]" class="amount font-body-medium">
          {{ formattedFullUSDBalance }} {{ erc20Tokens[0].symbol }}
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
import { mapGetters } from "vuex";
import app from "~/plugins/app";
import DepositWeth from "~/components/lego/modals/deposit-weth";

@Component({
  props: {},
  components: { DepositWeth },
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
  },
})
export default class AccountBanner extends Vue {
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

  get formattedFullUSDBalance() {
    if (this.totalCurrencyBalance) {
      return parseFloat(this.totalCurrencyBalance.toFixed(3));
    }
    return "00.00";
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
.account-banner {
  background-color: primary-color("600");
  color: light-color("700");

  .profile-pic {
    min-width: 64px !important;
    min-height: 64px !important;
  }
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
