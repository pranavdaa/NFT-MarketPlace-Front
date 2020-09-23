<template>
  <div class="section position-absolute">
    <div class="modal receive-modal-wrapper" v-bind:class="{ 'show': show }">
      <div class="modal-dialog w-sm-100 align-self-center" role="document">
        <div class="box deposit-box">
          <div class="box-header justify-content-center">
            <div
              class="font-heading-medium font-semibold align-self-center w-100 text-center"
            >{{$t('deposit.title')}}</div>
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
            <div class="container p-0">
              <div class="col-12 ps-x-40 ps-b-20 ps-t-16 container-wrapper font-body-small">
                <div
                  class="ps-b-20 ps-t-18 text-white"
                >{{selectedTokens.length || 0}} Collectibles selected</div>
                <div class="container card-list hide-scrollbar d-flex p-0">
                  <div
                    class="token-img d-flex ms-x-6 ps-4 justify-content-center"
                    v-for="token in selectedTokens"
                    :key="token.token_id"
                  >
                    <img class="align-self-center" :src="token.img_url" :alt="token.name" />
                  </div>
                </div>
              </div>
            </div>
            <div class="container">
              <div class="row ps-x-40 ps-b-60">
                <div class="col-12 p-0">
                  <div class="mark-wrapper check float-left">
                    <img
                      src="~/static/img/yellow-check.svg"
                      alt="In Progress"
                      v-if="transactionStatus === STATUS.INITIATING"
                    />
                    <img
                      src="~/static/img/green-check.svg"
                      alt="Green Check"
                      v-if="transactionStatus >= STATUS.INITIATED"
                    />
                  </div>
                  <div class="float-left body-medium ps-2 ms-l-12 d-flex">
                    <span
                      class="ps-t-2"
                      v-if="transactionStatus === STATUS.INITIATING"
                    >Deposit Initializing...</span>
                    <span
                      class="ps-t-2"
                      v-if="transactionStatus >= STATUS.INITIATED"
                    >Deposit Initialized</span>
                  </div>
                </div>
                <div class="col-12 p-0">
                  <div class="float-left process-msg font-caption text-gray ms-l-12 ms-b-2 ps-l-24"></div>
                </div>
                <div class="col-12 p-0">
                  <div
                    class="mark-wrapper float-left"
                    :class="{'check': transactionStatus >= STATUS.INITIATED}"
                  >
                    <img
                      v-if="transactionStatus === STATUS.INITIATED"
                      class="ms-l-2"
                      src="~/static/img/information-check.svg"
                      alt="Green Check"
                    />
                    <img
                      v-if="transactionStatus === STATUS.DEPOSITING"
                      src="~/static/img/yellow-check.svg"
                      alt="Green Check"
                    />
                    <img
                      v-if="transactionStatus >= STATUS.DEPOSITED"
                      src="~/static/img/green-check.svg"
                      alt="Green Check"
                    />
                  </div>
                  <div
                    class="float-left body-medium ps-2 ps-t-4 ms-l-12"
                  >Deposit on Ethereum Transaction</div>
                </div>
                <div class="col-12 p-0">
                  <div class="float-left process-msg font-caption text-gray ms-l-12 ms-b-2 ps-l-24">
                    <div class="ps-b-16">
                      <span
                        v-if="transactionStatus === STATUS.INITIATED"
                      >Please confirm the transaction to complete the deposit.</span>
                      <span
                        v-if="transactionStatus === STATUS.DEPOSITING"
                      >Waiting for 12 block confirmation. It may take upto 5 min.</span>
                      <a
                        v-if="transactionStatus >= STATUS.DEPOSITING && transactionHash"
                        href="transactionHash"
                        :title="transactionHash"
                      >View on etherscan</a>
                    </div>
                  </div>
                </div>
                <div class="col-12 p-0">
                  <div
                    class="mark-wrapper float-left"
                    :class="{'check': transactionStatus >= STATUS.DEPOSITED }"
                  >
                    <img
                      v-if="transactionStatus >= STATUS.DEPOSITED"
                      src="~/static/img/green-check.svg"
                      alt="Green Check"
                    />
                  </div>
                  <div class="float-left body-medium ps-2 ms-l-12">Deposit Completed</div>
                </div>
                <div class="col-12 p-0">
                  <div class="float-left font-caption text-gray ms-l-12 ms-b-2 ps-l-24">
                    <span
                      v-if="transactionStatus >= STATUS.DEPOSITED"
                    >It will take ~2 minute to reflate in your account.</span>
                  </div>
                </div>
              </div>
              <div class="row" v-if="error">
                <div class="col-12 ps-x-32 text-center text-red">
                  <div class="font-body-small text-red text-center mx-auto" v-html="error"></div>
                </div>
              </div>
              <div class="row p-0">
                <div class="col-12 p-0 d-flex justify-content-space-between">
                  <button-loader
                    class="w-100"
                    :classes="['btn py-4 btn-pay no-top-border-radius']"
                    :block="true"
                    :text="'Confirm Deposit'"
                    color="primary"
                    :loadingText="'Confirming deposit'"
                    :click="deposit"
                    :loading="isLoading"
                    v-if="transactionStatus === STATUS.INITIATED || transactionStatus > STATUS.CONFIRMING"
                  ></button-loader>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="modal-backdrop" v-bind:class="{ 'show': show }"></div>
  </div>
</template>


<script>
import Vue from "vue";
import Component from "nuxt-class-component";
import { mapGetters } from "vuex";
import app from "~/plugins/app";

import { getWalletProvider } from "~/plugins/helpers/providers";
const MaticPOSClient = require("@maticnetwork/maticjs").MaticPOSClient;

const STATUS = {
  INITIATING: 0,
  INITIATED: 1,
  DEPOSITING: 2,
  DEPOSITED: 3,
};

@Component({
  props: {
    show: {
      type: Boolean,
      required: false,
      default: true,
    },
    isApproving: {
      type: Boolean,
      required: false,
      default: true,
    },
    selectedTokens: {
      type: Array,
      required: true,
    },
    cancel: {
      type: Function,
      required: true,
    },
  },
  components: {},
  methods: {},
  computed: {
    ...mapGetters("account", ["account"]),
    ...mapGetters("network", ["networks", "networkMeta"]),
    ...mapGetters("page", ["selectedCategory"]),
  },
})
export default class DepositConfirmationModal extends Vue {
  STATUS = STATUS;

  selectToken = false;
  isLoading = false;
  isExited = false;
  error = null;
  transactionHash = null;

  async mounted() {}

  // Getter
  get status() {
    return status;
  }

  get transactionStatus() {
    if (this.isApproving) {
      return STATUS.INITIATING;
    } else if (!this.isApproving && !this.isLoading) {
      return STATUS.INITIATED;
    } else if (!this.isApproving && this.isLoading) {
      return STATUS.DEPOSITING;
    } else return STATUS.DEPOSITED;
  }

  get parentNetwork() {
    return this.networks.main;
  }

  get childNetwork() {
    return this.networks.matic;
  }

  get networkId() {
    return this.parentNetwork.chainId;
  }

  get selectedTokenIds() {
    let token_ids = [];
    if (this.selectedTokens && this.selectedTokens.length > 0) {
      this.selectedTokens.forEach((token) => token_ids.push(token.token_id));
    }
    return token_ids;
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
    console.log({
      posRootChainManager: this.networkMeta.Main.POSContracts
        .RootChainManagerProxy,
      posERC20Predicate: this.networkMeta.Main.POSContracts.ERC20PredicateProxy,
      posERC721Predicate: this.networkMeta.Main.POSContracts
        .ERC721PredicateProxy,
    });

    return new MaticPOSClient({
      network: app.uiconfig.matic.deployment.network,
      version: app.uiconfig.matic.deployment.version,
      parentProvider,
      maticProvider,
      posRootChainManager: this.networkMeta.Main.POSContracts
        .RootChainManagerProxy,
      posERC20Predicate: this.networkMeta.Main.POSContracts.ERC20PredicateProxy,
      posERC721Predicate: this.networkMeta.Main.POSContracts
        .ERC721PredicateProxy,
    });
  }

  async deposit() {
    if (this.isLoading || this.isApproving) {
      return;
    }

    try {
      this.isLoading = true;

      const maticPoS = this.getMaticPOS();
      const ERC721 = this.selectedCategory.getAddress(this.networkID);
      const token_ids = this.selectedTokenIds;

      console.log(ERC721);
      console.log(token_ids);

      let txHash = await maticPoS.depositBatchERC721ForUser(
        ERC721,
        this.account.address,
        token_ids,
        {
          from: this.account.address,
          onTransactionHash: (txHash) => {
            this.transactionHash = txHash;
          },
        }
      );
      if (txHash) {
        handleDeposit(txHash);
      }
    } catch (error) {
      console.log(error);
      this.error = error.message;
    }
  }

  handleDeposit(txHash) {
    // API hit to store
  }

  onCancel() {
    this.cancel();
  }
}
</script>

<style lang="scss" scoped>
@import "~assets/css/theme/_theme";

.deposit-box {
  width: 446px;
}

@media (max-width: 446px) {
  .deposit-box {
    width: 100%;
  }
}
.label {
  color: dark-color("500");
}
.amount {
  color: dark-color("700");
}

.bottom-border {
  border-bottom: 1px solid light-color("500");
}

.mark-wrapper:not(.check) {
  width: 20px;
  height: 20px;
  border-radius: 50%;
  border: 1px solid light-color("400");
  margin: 2px;
}
.mark-wrapper.check {
  width: 24px;
  height: 24px;
}

.process-msg {
  border-left: 1px solid light-color("400");
  min-height: 18px;
}
.text-gray {
  color: dark-color("300");
}
.text-red {
  color: red-color("600");
}

.btn-pay {
  border-radius: 12px;
}

.container-wrapper {
  background: dark-color("300");
  text-align: left;
  margin-bottom: 24px;

  .card-list {
    overflow-x: auto;
    -ms-overflow-style: none;
    scrollbar-width: none;
  }

  &::-webkit-scrollbar {
    display: none;
  }
}

.token-img {
  min-width: 76px;
  min-height: 76px;
  width: 76px;
  height: 76px;
  background: white;
  border-radius: 10px;

  img {
    max-height: 76px;
    max-width: 76px;
    height: 100%;
    width: auto;
  }
}
</style>