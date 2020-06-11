<template>
  <div class="container-fluid py-4 mt-5" v-show="loaded">
    <div class="row justify-content-center">
      <div class="col-md-6 login-container text-center">
        <div class="matic-logo">
          <img src="~/assets/img/logo.svg" alt="Matic Network" />
          <img src="~/assets/img/logo-name.svg" alt="Matic Network" />
        </div>
        <div class="container-fluid d-flex justify-content-center">
          <div class="box ms-t-40 login-box">
            <div class="box-body">
              <div class="font-heading-medium font-semibold ps-16 ps-md-32">Login</div>
              <div class="container">
                <div class="row ps-x-32">
                  <div
                    class="col-12 login-with no-bottom-border-radius ps-16 ps-md-20"
                    :class="{'cursor-pointer': !loading}"
                  >
                    <div class="d-flex">
                      <div class="logo-wallet-connect d-flex align-self-center">
                        <img
                          src="~/assets/img/walletconnect.svg"
                          alt="wallet connect"
                          class="align-self-center"
                        />
                      </div>
                      <div class="d-flex flex-column text-left align-self-center ps-l-20">
                        <span class="font-heading font-semibold">WalletConnect</span>
                        <span class="font-body-small text-gray">Connect using mobile wallet</span>
                      </div>
                      <svg-sprite-icon
                        name="right-arrow"
                        class="right-arrow align-self-center font-gray ml-auto"
                      />
                    </div>
                  </div>
                </div>
                <div class="row ps-x-32">
                  <div
                    class="col-12 login-with no-top-border-radius ps-16 ps-md-20"
                    :class="{'cursor-pointer': !loading}"
                  >
                    <div class="d-flex">
                      <div class="logo-metamask d-flex align-self-center">
                        <img
                          src="~/assets/img/metamask.svg"
                          alt="Metamask"
                          class="align-self-center"
                        />
                      </div>
                      <div class="d-flex flex-column text-left align-self-center ps-l-20">
                        <span class="font-heading font-semibold">Metamask</span>
                        <span class="font-body-small text-gray">Connect using browser wallet</span>
                      </div>
                      <svg-sprite-icon
                        name="right-arrow"
                        class="right-arrow align-self-center font-gray ml-auto"
                      />
                    </div>
                  </div>
                </div>
                <div class="row ps-x-32" v-if="false">
                  <div
                    class="col-12 login-with no-top-border-radius ps-16 ps-md-20"
                    :class="{'cursor-pointer': !loading}"
                  >
                    <div class="d-flex">
                      <div class="logo-portis d-flex align-self-center">
                        <img src="~/assets/img/portis.svg" alt="portis" class="align-self-center" />
                      </div>
                      <div class="d-flex flex-column text-left align-self-center ps-l-20">
                        <span class="font-heading font-semibold">Portis</span>
                        <span class="font-body-small text-gray">Connect using browser wallet</span>
                      </div>
                      <svg-sprite-icon
                        name="right-arrow"
                        class="right-arrow align-self-center font-gray ml-auto"
                      />
                    </div>
                  </div>
                </div>
                <div class="row justify-content-center wallet-download-info ms-t-32">
                  Don't have wallet?
                  <a
                    href="https://matic.network/wallet"
                    target="_blank"
                    class="link-color ps-l-2"
                  >Download here</a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <connecting-metamask :loaded="metamaskLoading" />
  </div>
</template>

<script>
import Vue from "vue";
import Component from "nuxt-class-component";

import { NextNavigation } from "~/components/mixin";

import ConnectingMetamask from "~/components/lego/connecting-metamask";

@Component({
  layout: "blank",
  components: {
    ConnectingMetamask
  },
  mixins: [NextNavigation],
  computed: {}
})
export default class Login extends Vue {
  loading = false;
  loaded = false;
  metamaskLoading = false;

  // query params
  queryParams = {};

  async mounted() {
    this.nextRoute = this.nextRoute || { name: "index" };
    this.queryParams = this.$route.query;
    this.loaded = true;
  }
}
</script>

<style lang="scss" scoped="">
@import "~assets/css/theme/_theme";

.login-box {
  width: 446px !important;
}
.login-with {
  border: 1px solid light-color("500");
  box-sizing: border-box;
  border-radius: 8px;
}
.logo-wallet-connect,
.logo-metamask,
.logo-portis {
  width: 56px;
  height: 56px;
  border-radius: 50%;
}
.logo-wallet-connect {
  background-color: primary-color("100");
}
.logo-metamask {
  background-color: red-color("100");
}
.logo-portis {
  background-color: primary-color("100");
}

#right-arrow > svg > path {
  fill: #b4b7bd !important;
}
.wallet-download-info {
  border-top: 1px solid light-color("400");
  padding: 32px 10px;
  color: dark-color("100");
  @include font-setting("body-medium", "medium");
}
</style>
