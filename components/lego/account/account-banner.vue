<template>
  <div class="row ps-y-32 ps-x-16 account-banner">
    <div
      class="col-12 col-lg d-flex flex-column flex-md-row justify-content-center justify-content-lg-start"
    >
      <svg-sprite-icon name="profile" class="profile-pic align-self-center" />
      <div
        class="d-flex flex-column align-self-center ps-l-md-16 text-center text-md-left ps-t-16 ps-t-md-0"
      >
        <div class="name ps-b-4 font-heading-small font-semibold">{{account.name}}</div>
        <div class="address font-body-medium">{{account.address.toUpperCase()}}</div>
        <div class="address-short font-body-medium">{{account.shortChecksumAddress}}</div>
      </div>
    </div>
    <div
      class="col-12 col-lg d-flex left-content text-center text-sm-left justify-content-center ps-t-16 ps-t-md-32 ps-t-lg-0 justify-content-lg-end"
    >
      <div class="d-flex flex-column align-self-center ms-r-32 justify-content-start">
        <div class="name ps-b-4 font-heading-small font-semibold">Total NFT</div>
        <div class="amount font-body-medium">{{totalMaticNft+totalMainNft}}</div>
      </div>
      <div class="d-flex flex-column align-self-center ms-r-32 justify-content-start">
        <div class="name ps-b-4 font-heading-small font-semibold">Wallet Balance</div>
        <div class="amount font-body-medium">${{formattedFullUSDBalance}}</div>
      </div>
      <div class="align-self-center">
        <a
          href="https://wallet.matic.today"
          target="_blank"
          class="btn btn-light ml-auto"
        >View Wallet</a>
      </div>
    </div>
  </div>
</template>

<script>
import Vue from "vue";
import Component from "nuxt-class-component";
import { mapGetters } from "vuex";

@Component({
  props: {},
  computed: {
    ...mapGetters("account", ["account", "totalMaticNft", "totalMainNft"]),
    ...mapGetters("token", ["totalCurrencyBalance"]),
    ...mapGetters("network", ["networkMeta"]),
  },
})
export default class AccountBanner extends Vue {
  mounted() {}

  get formattedFullUSDBalance() {
    if (this.totalCurrencyBalance) {
      return parseFloat(this.totalCurrencyBalance.toFixed(3));
    }
    return "00.00";
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
