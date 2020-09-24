<template>
  <div class="section position-absolute">
    <div
      class="modal receive-modal-wrapper"
      v-bind:class="{ show: show && !hidden }"
    >
      <div class="modal-dialog w-sm-100 align-self-center" role="document">
        <div class="box deposit-box">
          <div class="box-header justify-content-center">
            <div
              class="font-heading-medium font-semibold text-center align-self-center w-100"
            >
              {{ $t("deposit.title") }}
            </div>
            <span
              @click="onCancel()"
              class="left-arrow align-self-center float-right cursor-pointer"
            >
              <svg-sprite-icon
                name="close"
                class="close align-self-center float-left cursor-pointer"
              ></svg-sprite-icon>
            </span>
          </div>
          <div class="box-body">
            <div class="container">
              <token-verticle-list
                :v-if="showTokenList"
                :tokens="tokens"
                :preSelectedTokens="preSelectedTokens"
                :category="category || lastCategory"
                :onSelectionChange="onSelectionChange"
              />

              <div class="row ps-x-32 ps-b-8" v-if="error">
                <div
                  class="font-body-small text-danger text-center mx-auto"
                  v-html="error"
                ></div>
                <div class="mx-auto text-gray-300 font-caption"></div>
              </div>
              <div class="row p-0">
                <div class="col-12 p-0 d-flex justify-content-space-between">
                  <button-loader
                    class="w-100"
                    :classes="['btn py-4 btn-pay no-top-border-radius']"
                    :block="true"
                    color="primary"
                    :loadingText="'Initializing deposit'"
                    :loading="isLoading"
                    :text="'Deposit to Ethereum Network'"
                    :click="approveForDeposit"
                  ></button-loader>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <!-- <choose-token :show="selectToken" :cancel="onTokenClose" /> -->
    <deposit-confirmation-modal
      :show="showDepositConfirmation"
      :isApproving="isLoading"
      :category="category || lastCategory"
      :selectedTokens="selectedTokens"
      :cancel="onCloseConfirmDeposit"
      :refreshBalance="refreshBalance"
    />
    <div class="modal-backdrop" v-bind:class="{ show: show }"></div>
  </div>
</template>


<script>
import Vue from "vue";
import Component from "nuxt-class-component";
import { mapGetters } from "vuex";
import app from "~/plugins/app";

import getBaseAxios from "~/plugins/axios";
import { getWalletProvider } from "~/plugins/helpers/providers";
const MaticPOSClient = require("@maticnetwork/maticjs").MaticPOSClient;

import DepositConfirmationModal from "~/components/lego/modals/deposit-confirmation-modal";
import TokenVerticleList from "~/components/lego/modals/token-verticle-list";

@Component({
  props: {
    show: {
      type: Boolean,
      required: false,
      default: false,
    },
    visible: {
      type: Function,
      required: true,
    },
    cancel: {
      type: Function,
      required: true,
    },
    tokens: {
      type: Array,
      required: true,
    },
    refreshBalance: {
      type: Function,
      required: true,
    },
    preSelectedTokens: {
      type: Array,
      required: false,
      default: () => [],
    },
  },
  components: {
    DepositConfirmationModal,
    TokenVerticleList,
  },
  methods: {},
  computed: {
    ...mapGetters("account", ["account"]),
    ...mapGetters("network", ["networks", "networkMeta"]),
    ...mapGetters("page", ["selectedCategory"]),
  },
})
export default class Deposit extends Vue {
  error = null;
  isLoading = false;
  selectingTokens = false;
  hidden = false;
  selectedTokens = [];
  showDepositConfirmation = false;
  lastCategory = {};

  async mounted() {
    this.selectedTokens = this.preSelectedTokens;
  }

  // Getters
  get showTokenList() {
    return this.show && this.selectingTokens;
  }
  get parentNetwork() {
    return this.networks.main;
  }
  get childNetwork() {
    return this.networks.matic;
  }
  get networkID() {
    return this.parentNetwork.chainId;
  }
  get category() {
    if (this.selectedCategory) {
      this.lastCategory = this.selectedCategory;
      return this.selectedCategory;
    } else if (this.selectedTokens && this.selectedTokens.length > 0) {
      this.lastCategory = this.selectedTokens[0].category;
      return this.selectedTokens[0].category;
    }
    return null;
  }

  getMaticPOS() {
    const maticProvider = getWalletProvider({
      networks: this.networks,
      primaryProvider: "child",
    });
    const parentProvider = getWalletProvider({
      networks: this.networks,
      primaryProvider: "main",
    });

    return new MaticPOSClient({
      network: app.uiconfig.matic.deployment.network,
      version: app.uiconfig.matic.deployment.version,
      parentProvider,
      maticProvider,
    });
  }

  // Handlers
  onCancel() {
    this.cancel();
  }
  onSelectionChange(tokens) {
    this.selectedTokens = tokens;
  }
  async approveForDeposit() {
    if (this.isLoading || this.selectedTokens.length <= 0) {
      return;
    }

    try {
      this.isLoading = true;
      this.showDepositConfirmation = true;
      this.hidden = true;

      const maticPoS = this.getMaticPOS();
      const ERC721 = this.selectedTokens[0].contract;

      const isApproved = await maticPoS.isApprovedAllERC721ForDeposit(
        ERC721,
        this.account.address,
        {
          from: this.account.address,
        }
      );
      if (isApproved) {
        this.isLoading = false;
      } else {
        let txHash = await maticPoS.approveAllERC721ForDeposit(ERC721, {
          from: this.account.address,
        });
        if (txHash) {
          console.log("approve transaction", txHash);
          this.isLoading = false;
        }
      }
    } catch (error) {
      console.log(error);
      this.error = error.message;
      this.isLoading = false;
      this.showDepositConfirmation = false;
      this.hidden = false;
    }
  }
  onCloseConfirmDeposit() {
    this.showDepositConfirmation = false;
    this.cancel();
  }
}
</script>

<style lang="scss" scoped>
@import "~assets/css/theme/_theme";

.deposit-box {
  width: 446px;
}

.account-info {
  height: 44px;
  background-color: light-color("400");
  border-top-left-radius: 12px;
  border-top-right-radius: 12px;
  padding: 10px;

  .profile {
    height: 26px;
    width: 26px;
  }

  .font-caption {
    opacity: 0.6;
  }
}

@media (max-width: 446px) {
  .deposit-box {
    width: 100%;
  }
  .currency-switch {
    width: 100%;
    margin-left: 0px;
    margin-right: 0px;
  }
}

.pill {
  min-height: 26px;
  border-radius: 13px;

  &.ethereum-pill {
    background-color: supportive-color("100");
  }
  &.matic-pill {
    background-color: primary-color("200");
  }
}

.address-line {
  height: 56px;
  border-radius: 8px;
  padding: 0 6px;
  border: 1px solid light-color("500");
  display: flex;
  background-color: light-color("700");
  .form-control {
    height: 44px;
    border-width: 0px;
    box-shadow: none;
    outline: none;
  }
  .contact-person {
    display: block;
  }
  .contact-person.active {
    display: none;
  }
  &:hover {
    .contact-person-box.active {
      background: light-color("500");
    }
    .contact-person {
      display: none;
    }
    .contact-person.active {
      display: block;
    }
  }
  .right-arrow {
    margin-top: -2px;
  }
}

.contact-person-box {
  height: 44px;
  width: 44px;
  border-radius: $border-radius;
}

.currency-switch {
  @extend .address-line;
  height: 34px;
  box-shadow: 0px 1px 4px rgba(0, 0, 0, 0.08);
  .switch {
    border-radius: 6px;
    height: 26px;
    width: 64px;
    cursor: pointer;
  }
  .switch.active,
  .switch:hover {
    background-color: light-color("500");
  }
}

.currency-switch.precent .switch {
  padding-left: 8px;
  padding-right: 8px;
  width: 50px;
}

.text-currency {
  color: dark-color("600");
}
.text-gray-300 {
  color: dark-color("300");
}
.xl-currency {
  font-weight: 300;
  font-size: 64px;
  line-height: 110%;

  letter-spacing: -0.01em;
}

.btn-pay {
  border-radius: 12px;
}
.powered-by {
  .logo {
    margin-top: -3px;
    height: 14px;
  }
}
</style>