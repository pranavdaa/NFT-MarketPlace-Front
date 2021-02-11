<template>
  <div class="section position-absolute">
    <div class="modal-backdrop" v-bind:class="{ show: show }"></div>
    <div class="modal transaction-prog-modal" v-bind:class="{ show: show }">
      <div class="modal-dialog w-sm-100 align-self-center" role="document">
        <div class="box in-process-box">
          <div class="box-body">
            <div class="container-fluid">
                <nav
                    class="row tabs nav bottom-border no-border-radius d-flex col-md-12 px-0 mx-0"
                >
                    <a
                    class="nav-item col ps-y-24 px-0 text-center nav-link font-body-medium font-medium active"
                    >Token Transfer</a
                    >
                </nav>
                <div
                    class="row ps-x-16 ps-x-md-32 ps-x-lg-40 ps-y-32 bottom-border"
                >
                    <div
                    class="col-md-12 px-0 font-heading-small font-semibold ps-b-8"
                    >
                    Add address
                    </div>
                    <div
                    class="col-md-12 px-0 ps-b-16 font-body-small text-gray-500"
                    >
                    Your asset will be transferred to this address.
                    </div>

                    <div class="col-md-12 p-0">
                        <Textfield
                            type="text"
                            placeholder="Enter receiver address"
                            hint-text="Enter only matic network address"
                            :value="toAddress"
                            @input="handleAddressInput"
                        />
                        <div
                            class="w-100 font-caption error-text ps-t-12"
                            v-if="(dirty || error)"
                        >
                            <span v-if="error === 'selectMatic'">
                                Please select the {{ childNetwork.name }} Network in
                                Metamask (<a
                                href="https://docs.matic.network/docs/develop/metamask/config-matic/#matic-mainnet"
                                target="_blank"
                                rel="noopener noreferrer"
                                >guide</a>)
                            </span>
                            <span v-else>
                                {{ error }}
                            </span>
                        </div>
                        
                    </div>
                </div>
                <div
                    class="row ps-x-16 ps-x-md-32 ps-x-lg-40 d-flex error"
                    v-if="dirty && false"
                ></div>
                <div class="row ps-x-16 ps-x-md-32 ps-x-lg-40 ps-y-32 d-flex">
                    <button-loader
                    :text="$t('cancel')"
                    :click="close"
                    block
                    lg
                    color="light"
                    :disabled="isLoading"
                    ></button-loader>
                    <button-loader
                    class="ml-auto"
                    :loading="isLoading"
                    :loadingText="$t('transferring')"
                    :text="$t('transfer')"
                    block
                    lg
                    color="primary"
                    :click="transferToken"
                    ></button-loader>
                </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Vue from "vue";
import Component from "nuxt-class-component";
import { mapGetters } from "vuex";
import Web3 from "web3";

import app from "~/plugins/app";
import BigNumber from "~/plugins/bignumber";

import { FormValidator } from "~/components/mixin";

const { getTypedData } = require("~/plugins/meta-tx");

// 0X
let {
  ERC721TokenContract,
} = require("@0x/contract-wrappers");
import {
  Textfield,
} from '@maticnetwork/matic-design-system'
import { isValidAddress } from 'ethereumjs-util'

import { providerEngine } from "~/plugins/helpers/provider-engine";

const ZERO = BigNumber(0);

@Component({
  props: {
    show: {
      type: Boolean,
      required: true,
    },
    nftToken: {
      type: Object,
      required: true,
    },
    close: {
      type: Function,
      required: true,
    },
    refreshNFTTokens: {
      type: Function,
      required: false,
      default: () => {},
    },
  },
  components: { Textfield },
  computed: {
    ...mapGetters("token", ["selectedERC20Token"]),
    ...mapGetters("account", ["account"]),
    ...mapGetters("auth", ["user"]),
    ...mapGetters("network", ["networks"]),
    ...mapGetters("category", ["categories"]),
  },
  methods: {},
  mixins: [FormValidator],
})
export default class SendToken extends Vue {
    isLoading = false;
    dirty = false;
    error = "";
    toAddress = null;

    mounted() {}

    handleAddressInput(input) {
        this.dirty = false
        this.toAddress = input
    }

    async metamaskValidation() {
        const web3obj = new Web3(window.ethereum)
        const chainId = await web3obj.eth.getChainId()
        if (chainId !== this.networks.matic.chainId) {
            this.metamaskValidation = false
            this.error = 'selectMatic'
            return false
        }
        this.metamaskValidation = true
        return true
    }

    async transferToken(){
        this.isLoading = true;
        if (!this.isValidAddress) {
            this.error = this.$t('invalid.address')
            this.isLoading = false
            this.dirty = true;
            return false
        }
        if(!this.validation['owner']){
            this.dirty = true
            this.error = this.$t('invalid.owner')
            this.isLoading = false
            return false
        }

        if (!(await this.metamaskValidation())) {
            this.isLoading = false
            return
        }

        this.dirty = false;
        this.error = ""

        try {
            const nftContract = this.nftToken.category.getAddress(
                this.networks.matic.chainId
            );
            const decimalnftTokenId = this.nftToken.token_id;

            // ERC721 contract
            const erc721TokenCont = new ERC721TokenContract(
                nftContract,
                providerEngine()
            );

            // Owner of current token
            const owner = await erc721TokenCont
                .ownerOf(new BigNumber(decimalnftTokenId))
                .callAsync();
            const isOwnerOfToken =
                owner.toLowerCase() === this.account.address.toLowerCase();
            if (!isOwnerOfToken) {
                app.addToast(
                "You are no owner of this token",
                "You are no longer owner of this token, refresh to update the data",
                {
                    type: "failure",
                }
                );
                this.isLoading = false;
                this.close();
                return;
            }
            console.log(erc721TokenCont)

            if(this.category.isMetaTx){

                let matic = new Web3(this.networks.matic.rpc);
                let data = await matic.eth.abi.encodeFunctionCall(
                {
                    name: "safeTransferFrom",
                    type: "function",
                    inputs: [
                        {
                            name: "from",
                            type: "address",
                        },
                        {
                            name: "to",
                            type: "address",
                        },
                        {
                            name: "tokenId",
                            type: "uint256",
                        },
                    ],
                },
                [this.account.address, this.toAddress, decimalnftTokenId]
                );

                let { sig } = await this.executeMetaTx(data);

                let tx = {
                    intent: sig,
                    fnSig: data,
                    from: this.account.address,
                    contractAddress: matic.utils.toChecksumAddress(
                        this.category.categoriesaddresses.find(
                        (category) => category.chain_id == this.networks.matic.chainId
                        ).address
                    ),
                };

                if (tx) {
                    console.log("Transfer Hash", tx);
                    app.addToast(
                    "Transferred successfully",
                    "You successfully transferred the token to "+ this.toAddress,
                    {
                        type: "success",
                    }
                    );
                    this.close()
                    return true;
                }
                app.addToast(
                    "Failed to transfer",
                    "Failed to transfer token",
                    {
                        type: "failure",
                    }
                );

            } else {
                const erc721TransferTxHash = await erc721TokenCont
                .safeTransferFrom(this.account.address, this.toAddress, decimalnftTokenId)
                .sendTransactionAsync({
                    from: this.account.address,
                    gas: 8000000,
                    gasPrice: 1000000000,
                });
                if (erc721TransferTxHash) {
                    console.log("Transfer Hash", erc721TransferTxHash);
                    app.addToast(
                    "Transferred successfully",
                    "You successfully transferred the token to "+ this.toAddress,
                    {
                        type: "success",
                    }
                    );
                    this.close()
                    return true;
                }
                app.addToast(
                    "Failed to transfer",
                    "Failed to transfer token",
                    {
                        type: "failure",
                    }
                );
            }

        } catch (error) {
            console.error(error);
            app.addToast("Something went wrong", error.message.substring(0, 60), {
                type: "failure",
            });
        }
        this.isLoading = false;

    }

    async executeMetaTx(functionSig) {
        let matic = new Web3(this.networks.matic.rpc);
        let address = matic.utils.toChecksumAddress(this.account.address);
        let data = await matic.eth.abi.encodeFunctionCall(
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
        let _nonce = await matic.eth.call({
        to: matic.utils.toChecksumAddress(
            this.category.categoriesaddresses.find(
            (category) => category.chain_id == this.networks.matic.chainId
            ).address
        ),
        data,
        });
        const dataToSign = getTypedData({
        name: this.category.name,
        version: "1",
        salt: app.uiconfig.SALT,
        verifyingContract: matic.utils.toChecksumAddress(
            this.category.categoriesaddresses.find(
            (category) => category.chain_id == this.networks.matic.chainId
            ).address
        ),
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
    }

    // Get
    get isValidAddress() {
        return this.toAddress && isValidAddress(this.toAddress)
    }

    get childNetwork() {
        return this.networks.matic
    }

    get validation() {
        return {
        owner:
            this.nftToken.owner.toLowerCase() ===
            this.account.address.toLowerCase()
        };
    }

    get category() {
        return this.categories.find(
        (category) =>
            category.address.toLowerCase() === this.nftToken.contract.toLowerCase()
        );
    }

}
</script>

<style lang="scss" scoped>
@import "~assets/css/theme/_theme";

.hide-modal {
  opacity: 0;
}

.text-gray-500 {
  color: dark-color("500");
}
.text-gray-300 {
  color: dark-color("300");
}
.time-pill {
  background-color: light-color("500");
  color: dark-color("700");
  padding-left: 1rem;
  padding-right: 1rem;
  padding-top: 0.5rem;
  padding-bottom: 0.5rem;
  margin-left: 0.75rem;
  margin-right: 0.75rem;
  border-radius: 20px;
  cursor: pointer;

  &.active {
    background-color: dark-color("700");
    color: light-color("700");
  }
}

.icon {
  width: 24px !important;
  height: 24px !important;
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.5s;
}
.fade-enter, .fade-leave-to /* .fade-leave-active below version 2.1.8 */ {
  opacity: 0;
}

.box {
  max-width: 570px;
  width: 570px;
  .box-body {
    position: relative;
    border-radius: $default-card-box-border-radius;
  }
}

.error-text {
  color: red-color("400");
}
.ps-y-0 {
  padding-top: 0px !important;
  padding-bottom: 0px !important;
}

@media (max-width: 570px) {
  .box {
    max-width: 100%;
  }
}
</style>
