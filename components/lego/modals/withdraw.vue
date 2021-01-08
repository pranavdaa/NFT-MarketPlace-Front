<template>
  <div class="section position-absolute">
    <div
      class="modal receive-modal-wrapper"
      v-bsl="show"
      v-bind:class="{ show: show && !hidden }"
    >
      <div class="modal-dialog w-sm-100 align-self-center" role="document">
        <div class="box withdraw-box">
          <div class="box-header justify-content-center">
            <div
              class="font-heading-medium font-semibold text-center align-self-center w-100"
            >
              {{ $t("withdraw.title") }}
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
                    :loadingText="'Initializing withdraw'"
                    :loading="isLoading"
                    :text="'Withdraw to Ethereum Network'"
                    :click="initWithdraw"
                    :disabled="selectedTokens.length <= 0"
                  ></button-loader>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <withdraw-confirmation-modal
      v-if="showWithdrawConfirmation && withdrawTransaction"
      :show="showWithdrawConfirmation"
      :transaction="withdrawTransaction"
      :isBurning="isLoading"
      :burnHash="burnTransactionHash"
      :selectedTokens="selectedTokens"
      :category="category || lastCategory"
      :cancel="onCloseConfirmWithdraw"
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
import Web3 from "web3";

import getAxios from "~/plugins/axios";
import { getWalletProvider } from "~/plugins/helpers/providers";
const MaticPOSClient = require("@maticnetwork/maticjs").MaticPOSClient;
const { getTypedData } = require("~/plugins/meta-tx");

import WithdrawConfirmationModal from "~/components/lego/modals/withdraw-confirmation-modal";
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
    WithdrawConfirmationModal,
    TokenVerticleList,
  },
  methods: {},
  computed: {
    ...mapGetters("account", ["account"]),
    ...mapGetters("network", ["networks", "networkMeta"]),
    ...mapGetters("page", ["selectedCategory"]),
  },
})
export default class Withdraw extends Vue {
  error = null;
  isLoading = false;
  hidden = false;
  selectingTokens = false;
  selectedTokens = [];
  showWithdrawConfirmation = false;
  burnTransactionHash = null;
  withdrawTransaction = null;
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
    return this.childNetwork.chainId;
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
      primaryProvider: "matic",
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
      posRootChainManager: this.networkMeta.Main.POSContracts
        .RootChainManagerProxy,
      posERC20Predicate: this.networkMeta.Main.POSContracts.ERC20PredicateProxy,
      posERC721Predicate: this.networkMeta.Main.POSContracts
        .ERC721PredicateProxy,
    });
  }

  // Handlers
  onCancel() {
    this.cancel();
  }
  onSelectionChange(tokens) {
    this.selectedTokens = tokens;
  }
  onSignatureDenied() {
    this.showWithdrawConfirmation = false;
    this.isLoading = false;
    this.hidden = false;
  }

  async prepareMetaTx(network, ERC721Address, name, tokenIds, address) {
    let web3 = new Web3(network.rpc);
    let encodedFunction = await web3.eth.abi.encodeFunctionCall(
      {
        name: "withdrawBatch",
        type: "function",
        inputs: [
          {
            name: "tokenIds",
            type: "uint256[]",
          },
        ],
      },
      [tokenIds]
    );

    let { sig } = await this.requestSignature(
      network,
      ERC721Address,
      name,
      address,
      encodedFunction
    );

    if (!sig) return false;

    return {
      intent: sig,
      fnSig: encodedFunction,
      from: address,
      contractAddress: ERC721Address,
    };
  }

  async requestSignature(network, ERC721Address, name, address, functionSig) {
    try {
      const child_provider = new Web3.providers.HttpProvider(network.rpc);
      const mumbai = new Web3(child_provider);

      let data = await mumbai.eth.abi.encodeFunctionCall(
        {
          name: "getNonce",
          type: "function",
          inputs: [
            {
              name: "user",
              type: "address",
            },
          ],
        },
        [address]
      );
      let _nonce = await mumbai.eth.call({
        to: ERC721Address,
        data,
      });
      const dataToSign = getTypedData({
        name: name,
        version: "1",
        salt: app.uiconfig.SALT,
        verifyingContract: ERC721Address,
        nonce: parseInt(_nonce),
        from: address,
        functionSignature: functionSig,
      });
      const msgParams = [address, JSON.stringify(dataToSign)];
      let sign = await window.ethereum.request({
        method: "eth_signTypedData_v3",
        params: msgParams,
      });
      return {
        sig: sign,
      };
    } catch (error) {
      // console.log(error);
    }

    this.onSignatureDenied()
    return { sig: null };
  }

  async executeMetaTx(network, ERC721Address, name, tokenIds, address) {
    let tx = await this.prepareMetaTx(
      network,
      ERC721Address,
      name,
      tokenIds,
      address
    );
    if (tx) {
      try {
        let response = await getAxios().post(`orders/executeMetaTx`, tx);
        if (response.status === 200) {
          // To send transction receipt
          return response.data.data;
        }
      } catch (error) {
        app.addToast(
          "Failed to init withdraw",
          "You need to sign the transaction to start withdraw",
          {
            type: "failure",
          }
        );
        throw error;
      }
    }
  }

  async initWithdraw() {
    if (this.isLoading || this.selectedTokens.length <= 0) {
      return;
    }

    try {
      this.isLoading = true;
      this.error = null;
      this.onShowWithdrawConfirmation();

      const network = this.networks.matic;
      const ERC721 = Web3.utils.toChecksumAddress(
        this.selectedTokens[0].contract
      );
      const name = this.category.name;
      const address = Web3.utils.toChecksumAddress(this.account.address);
      const token_ids = this.selectedTokenIds;

      this.withdrawTransaction = {};
      this.withdrawTransaction["token_array"] = token_ids;
      this.withdrawTransaction["type"] = "WITHDRAW";
      this.withdrawTransaction["category_id"] = this.category.id;

      // Network agnostic calls
      let txHash = await this.executeMetaTx(
        network,
        ERC721,
        name,
        token_ids,
        address
      );

      // TODO make sure this txHash is the transaction receipt if not then
      // fetch from the Web3 call need blockNumber and txHash

      if (txHash) {
        this.burnTransactionHash = txHash.transactionHash;
        this.withdrawTransaction["txhash"] = txHash.transactionHash;

        await this.handleBurnTransaction(txHash);
        this.isLoading = false;
      }
    } catch (error) {
      // console.log(error);
      this.error = error.message;
      this.isLoading = false;
      this.showWithdrawConfirmation = false;
      this.hidden = false;
    }
  }
  async handleBurnTransaction(txHash) {
    console.log("Burn txhash", txHash);
    this.withdrawTransaction["block_number"] = txHash.blockNumber.toString();
    let response = await getAxios().post(
      "assetmigrate",
      this.withdrawTransaction
    );
    this.refreshBalance();
    if (response.status === 200) {
      this.withdrawTransaction = response.data.data;
    }
  }

  onCloseConfirmWithdraw() {
    this.showWithdrawConfirmation = false;
    this.cancel();
  }
  onShowWithdrawConfirmation() {
    this.showWithdrawConfirmation = true;
    this.hidden = true;
  }
}
</script>

<style lang="scss" scoped>
@import "~assets/css/theme/_theme";

.receive-modal-wrapper {
  font-size: 14px;
  line-height: 20px;
}

.withdraw-box {
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

.check-container {
  display: flex !important;
  display: none;
  justify-content: flex-end;
  &.checked {
    display: flex !important;
  }

  .checkmark {
    position: relative;
    margin-right: 6px;
  }
}

.transaction-details {
  &__inner {
    padding: 0 15px;
  }

  .icon {
    height: 24px;
    width: 24px;
  }
}

.left {
  color: #6e798f;
  line-height: 22px;
  text-align: left;
}

.right {
  color: #6e798f;
  line-height: 22px;
  text-align: right;
}
.category {
  background-color: light-color("700");
  box-sizing: border-box;

  .icon {
    width: 24px;
    height: 24px;
  }
}

@media (max-width: 446px) {
  .withdraw-box {
    width: 100%;
  }
}

.text-gray-300 {
  color: dark-color("300");
}

.btn-pay {
  border-radius: 12px;
}
</style>
