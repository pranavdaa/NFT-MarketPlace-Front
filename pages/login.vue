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
              <div class="font-heading-medium font-semibold ps-16 ps-md-32">
                {{ $t("login") }}
              </div>
              <div class="container">
                <div class="row ps-x-32" v-if="false">
                  <div
                    class="col-12 login-with no-bottom-border-radius ps-16 ps-md-20"
                    :class="{ 'cursor-pointer': !loading }"
                  >
                    <div class="d-flex">
                      <div class="logo-wallet-connect d-flex align-self-center">
                        <img
                          src="~/assets/img/walletconnect.svg"
                          alt="wallet connect"
                          class="align-self-center"
                        />
                      </div>
                      <div
                        class="d-flex flex-column text-left align-self-center ps-l-20"
                      >
                        <span class="font-heading font-semibold">{{
                          $t("walletConnect")
                        }}</span>
                        <span class="font-body-small text-gray">{{
                          $t("walletConnectMsg")
                        }}</span>
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
                    :class="{ 'cursor-pointer': !loading }"
                    @click="loginWithMetamask"
                  >
                    <div class="d-flex">
                      <div class="logo-metamask d-flex align-self-center">
                        <img
                          src="~/assets/img/metamask.svg"
                          alt="Metamask"
                          class="align-self-center"
                        />
                      </div>
                      <div
                        class="d-flex flex-column text-left align-self-center ps-l-20"
                      >
                        <span class="font-heading font-semibold">{{
                          $t("metamask.title")
                        }}</span>
                        <span class="font-body-small text-gray">{{
                          $t("webConnectMsg")
                        }}</span>
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
                    :class="{ 'cursor-pointer': !loading }"
                  >
                    <div class="d-flex">
                      <div class="logo-portis d-flex align-self-center">
                        <img
                          src="~/assets/img/portis.svg"
                          alt="portis"
                          class="align-self-center"
                        />
                      </div>
                      <div
                        class="d-flex flex-column text-left align-self-center ps-l-20"
                      >
                        <span class="font-heading font-semibold">{{
                          $t("portis")
                        }}</span>
                        <span class="font-body-small text-gray">{{
                          $t("webConnectMsg")
                        }}</span>
                      </div>
                      <svg-sprite-icon
                        name="right-arrow"
                        class="right-arrow align-self-center font-gray ml-auto"
                      />
                    </div>
                  </div>
                </div>
                <div
                  class="row justify-content-center wallet-download-info ms-t-32"
                >
                  {{ $t("downloadWallet") }}
                  <a
                    href="https://metamask.io/download.html"
                    target="_blank"
                    class="link-color ps-l-4"
                    >{{ $t("downloadHere") }}</a
                  >
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="metamask-network-error m-2" v-if="metamaskNetworkError">
          Select the {{ networks.main.name }} Network in the Metamask
        </div>
      </div>
    </div>
    <connecting-metamask :loaded="metamaskLoading" />
  </div>
</template>

<script>
import Vue from "vue";
import Component from "nuxt-class-component";
import Web3 from "web3";
import moment from "moment";
import { mapGetters } from "vuex";
import ethUtil from "ethereumjs-util";
// import Portis from "@portis/web3";

import {
  isMetamask,
  getDefaultAccount,
  personalSign,
  signTypedData,
  isMetamaskLocked,
} from "~/plugins/helpers/metamask-utils";
import app from "~/plugins/app";
import { config as configStore } from "~/plugins/localstore";
// import { getWalletConnectProvider } from "~/plugins/helpers/walletconnect-utils";

import { NextNavigation } from "~/components/mixin";
import { VueWatch } from "~/components/decorator";
// import WalletConnectModal from "~/components/lego/walletconnect-modal";
import ConnectingMetamask from "~/components/lego/connecting-metamask";

@Component({
  layout: "blank",
  components: {
    // WalletConnectModal,
    ConnectingMetamask,
  },
  mixins: [NextNavigation],
  computed: {
    ...mapGetters("network", ["networks", "selectedNetwork"]),
  },
})
export default class Login extends Vue {
  loading = false;
  loaded = false;
  metamaskLoading = false;
  error = false;
  sessionData = null;
  sessionCreated = false;
  metamaskNetworkError = false;

  // query params
  queryParams = {};

  async mounted() {
    this.nextRoute = this.nextRoute || { name: "index" };
    this.queryParams = this.$route.query;
    this.loaded = true;
  }

  // actions
  getLoginTypedData(address, timestamp) {
    return {
      types: {
        EIP712Domain: [
          { name: "name", type: "string" },
          { name: "host", type: "string" },
          { name: "version", type: "string" },
          { name: "chainId", type: "uint256" },
          { name: "verifyingContract", type: "address" },
        ],
        Test: [{ name: "owner", type: "string" }],
      },
      domain: {
        name: "Opensea on Matic",
        host: '',
        version: "1",
        verifyingContract: "0x0",
        chainId: this.networks.main.chainId,
      },
      primaryType: "Test",
      message: {
        owner: address,
      },
    };
  }

  // Metamask
  async loginWithMetamask() {
    if (this.loading) {
      return;
    }
    this.metamaskLoading = true;

    this.error = null;

    if (!isMetamask()) {
      return;
    }

    const isLocked = await isMetamaskLocked();
    if (isLocked) {
      this.error = this.$t("metamask.lockedMessage");
      this.metamaskLoading = false;
      return;
    }
    if (
      window.ethereum.chainId !=
      "0x" + this.networks.main.chainId.toString(16)
    ) {
      this.metamaskNetworkError = true;
      this.metamaskLoading = false;
      return;
    } else {
      this.metamaskNetworkError = false;
    }

    const from = await getDefaultAccount();

    if (from) {
      this.loading = true;
      try {
        const timestamp = moment().unix();
        const result = await signTypedData(
          from.toLowerCase(),
          this.getLoginTypedData(from.toLowerCase(), timestamp),
          window.ethereum
        );

        if (result.result) {
          const options = {
            strategy: app.strategies.METAMASK,
          };

          // set login strategy
          configStore.set("loginStrategy", app.strategies.METAMASK);

          // login with metamask
          await this.login(from, result.result, options);
        }
      } catch (e) {
        // ignore error
      }

      this.loading = false;
    }
    this.metamaskLoading = false;
  }

  async login(address, signature, options) {
    this.loading = true;

    try {
      // login
      await this.$store.dispatch("auth/doLogin", {
        address,
        signature,
      });

      this.moveToNext();
    } catch (e) {
      this.error =
        (e.response && e.response.data && e.response.data.message) || e.message;
    }

    this.loading = false;
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
.metamask-network-error {
  color: red-color("600");
}
</style>
