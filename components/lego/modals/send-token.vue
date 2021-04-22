<template>
  <div class="section position-absolute">
    <div class="modal-backdrop show" />
    <div class="modal transaction-prog-modal show">
      <div
        class="modal-dialog w-sm-100 align-self-center"
        role="document"
      >
        <div class="box in-process-box">
          <div class="box-body">
            <div class="container-fluid">
              <nav
                class="row tabs nav bottom-border no-border-radius d-flex col-md-12 px-0 mx-0"
              >
                <a
                  class="nav-item col ps-y-24 px-0 text-center nav-link font-body-medium font-medium active"
                >Token Transfer</a>
              </nav>
              <div
                class="row ps-x-16 ps-x-md-32 ps-x-lg-40 ps-y-32 bottom-border"
              >
                <div
                  v-if="isErc1155"
                  class="d-flex align-self-center ps-b-8"
                >
                  <div
                    class="align-self-center font-heading-small font-semibold"
                  >
                    Enter Quantity to sale
                  </div>
                </div>
                <div
                  v-if="isErc1155"
                  class="d-flex ml-auto align-self-center ps-b-8"
                >
                  <div class="font-body-small text-gray-500 ms-l-4">
                    Available : {{ nftToken.amount }}
                  </div>
                </div>
                <div
                  v-if="isErc1155"
                  class="col-md-12 p-0"
                >
                  <Textfield
                    v-if="isErc1155"
                    type="text"
                    placeholder="0"
                    :value="erc1155Amount"
                    :disabled="isLoading"
                    @input="handleERC1155Amount"
                  />
                  <div
                    v-if="dirty && error === 'invalidQuantity'"
                    class="w-100 font-caption error-text ps-t-12"
                  >
                    Valid quantity is required
                  </div>
                  <br>
                </div>

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
                    :disabled="isLoading"
                    @input="handleAddressInput"
                  />
                  <div
                    v-if="dirty || error"
                    class="w-100 font-caption error-text ps-t-12"
                  >
                    <span v-if="error === 'selectMatic'">
                      Please select the {{ childNetwork.name }} Network in
                      Metamask (<a
                        href="https://docs.matic.network/docs/develop/metamask/config-matic/#matic-mainnet"
                        target="_blank"
                        rel="noopener noreferrer"
                      >guide</a>)
                    </span>
                    <span
                      v-if="
                        error !== 'selectMatic' && error !== 'invalidQuantity'
                      "
                    >
                      {{ error }}
                    </span>
                  </div>
                </div>
              </div>
              <div
                v-if="dirty && false"
                class="row ps-x-16 ps-x-md-32 ps-x-lg-40 d-flex error"
              />
              <div class="row ps-x-16 ps-x-md-32 ps-x-lg-40 ps-y-32 d-flex">
                <button-loader
                  :text="$t('cancel')"
                  :click="close"
                  block
                  lg
                  color="light"
                  :disabled="isLoading"
                />
                <button-loader
                  class="ml-auto"
                  :loading="isLoading"
                  :loadingText="$t('transferring')"
                  :text="$t('transfer')"
                  block
                  lg
                  color="primary"
                  :click="transferToken"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Vue from 'vue'
import Component from 'nuxt-class-component'
import { mapGetters } from 'vuex'
import Web3 from 'web3'

import app from '~/plugins/app'
import BigNumber from '~/plugins/bignumber'
import getAxios from '~/plugins/axios'

import { FormValidator } from '~/components/mixin'
import { Textfield } from '@maticnetwork/matic-design-system'
import { isValidAddress } from 'ethereumjs-util'

import { providerEngine } from '~/plugins/helpers/provider-engine'
import { registerNetwork } from '~/plugins/helpers/metamask-utils'
import { txShowError } from '~/plugins/helpers/transaction-utils'

const { getTypedData } = require('~/plugins/meta-tx')

const { ERC721TokenContract } = require('@0x/contract-wrappers')

const ZERO = BigNumber(0)

@Component({
  props: {
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
    ...mapGetters('token', ['selectedERC20Token']),
    ...mapGetters('account', ['account']),
    ...mapGetters('auth', ['user']),
    ...mapGetters('network', ['networks', 'networkMeta']),
    ...mapGetters('category', ['categories']),
  },
  methods: {},
  mixins: [FormValidator],
})
export default class SendToken extends Vue {
  isLoading = false;
  dirty = false;
  error = '';
  toAddress = null;
  erc1155Amount = null;

  mounted() {
    this.$logger.track('mounted:transfer-token', this.nftToken)
  }

  handleAddressInput(input) {
    this.dirty = false
    this.toAddress = input
  }

  handleERC1155Amount(input) {
    this.dirty = false
    this.erc1155Amount = input
  }

  async metamaskValidation() {
    const web3obj = new Web3(window.ethereum)
    const chainId = await web3obj.eth.getChainId()
    if (chainId !== this.networks.matic.chainId) {
      // try {
      //   await registerNetwork();
      //   return true;
      // } catch (error) {
        this.error = "selectMatic";
        return false;
      // }
    }
    return true
  }

  async transferToken() {
    this.isLoading = true
    this.$logger.track('click:transfer-token', {
      isValidAddress: this.isValidAddress,
      isValidOwner: this.validation.owner,
    })
    if (!this.isValidAddress) {
      this.error = this.$t('invalid.address')
      this.isLoading = false
      this.dirty = true
      return false
    }
    if (!this.validation.owner) {
      this.dirty = true
      this.error = this.$t('invalid.owner')
      this.isLoading = false
      return false
    }

    if (this.isErc1155 && !this.validation.erc1155Amount) {
      this.error = 'invalidQuantity'
      this.isLoading = false
      this.dirty = true
      return false
    }
    this.$logger.track('validations-passed:transfer-token', {
      isValidAddress: this.isValidAddress,
      isValidOwner: this.validation.owner,
    })

    this.dirty = false
    this.error = ''

    try {
      const nftContract = this.nftToken.category.getAddress(
        this.networks.matic.chainId,
      )
      const decimalnftTokenId = this.nftToken.token_id
      let quantity = null
      let erc721TokenCont = null

      if (this.isErc721) {
        // ERC721 contract
        erc721TokenCont = new ERC721TokenContract(
          nftContract,
          providerEngine(),
        )

        // Owner of current token
        const owner = await erc721TokenCont
          .ownerOf(new BigNumber(decimalnftTokenId))
          .callAsync()
        const isOwnerOfToken =
          owner.toLowerCase() === this.account.address.toLowerCase()

        this.$logger.track('ownership-for-erc721:transfer-token', {
          isOwnerOfToken: isOwnerOfToken,
        })

        if (!isOwnerOfToken) {
          txShowError(
            null,
            'You are no owner of this token',
            'You are no longer owner of this token, refresh to update the data',
          )
          this.isLoading = false
          this.close()
          return
        }
      } else {
        // ERC1155 contract
        quantity = this.erc1155Amount
      }

      if (this.category.isMetaTx) {
        const matic = new Web3(this.networks.matic.rpc)
        let data = null
        if (this.isErc721) {
          data = await matic.eth.abi.encodeFunctionCall(
            {
              name: 'safeTransferFrom',
              type: 'function',
              inputs: [
                {
                  name: 'from',
                  type: 'address',
                },
                {
                  name: 'to',
                  type: 'address',
                },
                {
                  name: 'tokenId',
                  type: 'uint256',
                },
              ],
            },
            [this.account.address, this.toAddress, decimalnftTokenId],
          )
        } else {
          data = await matic.eth.abi.encodeFunctionCall(
            {
              name: 'safeTransferFrom',
              type: 'function',
              inputs: [
                {
                  name: 'from',
                  type: 'address',
                },
                {
                  name: 'to',
                  type: 'address',
                },
                {
                  name: 'id',
                  type: 'uint256',
                },
                {
                  name: 'amount',
                  type: 'uint256',
                },
                {
                  name: 'data',
                  type: 'bytes',
                },
              ],
            },
            [
              this.account.address,
              this.toAddress,
              decimalnftTokenId,
              quantity,
              '0x',
            ],
          )
        }

        this.$logger.track('meta-tx-signing:transfer-token', {
          data: data,
        })

        const { sig } = await this.executeMetaTx(data)

        const tx = {
          intent: sig,
          fnSig: data,
          from: this.account.address,
          contractAddress: matic.utils.toChecksumAddress(
            this.category.categoriesaddresses.find(
              (category) => category.chain_id === this.networks.matic.chainId,
            ).address,
          ),
        }

        if (tx) {
          try {
            this.$logger.track('service-call-execute-meta-tx:transfer-token')
            const response = await getAxios().post(`orders/executeMetaTx`, tx)
            this.refreshNFTTokens()
            if (response.status === 200) {
              // console.log("Transfer receipt: " + response);
              app.addToast(
                'Transferred',
                'You successfully transferred the token',
                {
                  type: 'success',
                },
              )
              this.close()
              this.$logger.track('success-meta-tx:transfer-token')
              return true
            }
          } catch (error) {
            console.error(error)
            txShowError(null, 'Failed to Transfer', 'Failed to transfer asset')
          }
        }
      } else {
        if (!(await this.metamaskValidation())) {
          this.isLoading = false
          return
        }
        this.$logger.track('non-meta-tx-start:transfer-token')

        if (this.isErc721) {
          const erc721TransferTxHash = await erc721TokenCont
            .safeTransferFrom1(
              this.account.address,
              this.toAddress,
              new BigNumber(decimalnftTokenId),
            )
            .sendTransactionAsync({
              from: this.account.address,
              gas: 1000000,
            })
          if (erc721TransferTxHash) {
            // console.log("Transfer Hash", erc721TransferTxHash);
            this.refreshNFTTokens()
            setTimeout(() => {
              this.refreshNFTTokens()
            }, 10000)

            app.addToast(
              'Transferred successfully',
              'You successfully transferred the token',
              {
                type: 'success',
              },
            )
            this.close()
            this.$logger.track('success-non-meta-tx-ERC721:transfer-token')
            return true
          }
          txShowError(error, 'Failed to transfer', 'Failed to transfer token')
        } else {
          const web3 = new Web3(window.ethereum)
          const erc1155TokenCont = new web3.eth.Contract(
            this.networkMeta.abi('ChildERC1155', 'pos'),
            nftContract,
          )
          const erc1155TransferTxHash = await erc1155TokenCont.methods
            .safeTransferFrom(
              this.account.address,
              this.toAddress,
              decimalnftTokenId,
              quantity,
              '0x',
            )
            .send({
              from: this.account.address,
              gas: 1000000,
            })
          if (erc1155TransferTxHash) {
            this.refreshNFTTokens()
            setTimeout(() => {
              this.refreshNFTTokens()
            }, 10000)

            app.addToast(
              'Transferred successfully',
              'You successfully transferred the token',
              {
                type: 'success',
              },
            )
            this.close()
            this.$logger.track('success-non-meta-tx-ERC1155:transfer-token')
            return true
          }
          txShowError(error, 'Failed to transfer', 'Failed to transfer token')
        }
      }
    } catch (error) {
      console.error(error);
      if (
        error.message.includes(
          "MetaMask is having trouble connecting to the network"
        )
      ) {
        txShowError(error, null, "Please Try Again");
      } else {
        txShowError(error, null, "Something went wrong");
      }
    }
    this.isLoading = false
  }

  async executeMetaTx(functionSig) {
    const matic = new Web3(this.networks.matic.rpc)
    const address = matic.utils.toChecksumAddress(this.account.address)
    const data = await matic.eth.abi.encodeFunctionCall(
      {
        name: 'getNonce',
        type: 'function',
        inputs: [
          {
            name: 'user',
            type: 'address',
          },
        ],
      },
      [address],
    )
    const _nonce = await matic.eth.call({
      to: matic.utils.toChecksumAddress(
        this.category.categoriesaddresses.find(
          (category) => category.chain_id === this.networks.matic.chainId,
        ).address,
      ),
      data,
    })
    const dataToSign = getTypedData({
      name: this.category.name,
      version: '1',
      salt: app.uiconfig.SALT,
      verifyingContract: matic.utils.toChecksumAddress(
        this.category.categoriesaddresses.find(
          (category) => category.chain_id === this.networks.matic.chainId,
        ).address,
      ),
      nonce: parseInt(_nonce),
      from: address,
      functionSignature: functionSig,
    })
    const msgParams = [address, JSON.stringify(dataToSign)]
    const sign = await window.ethereum.request({
      method: 'eth_signTypedData_v3',
      params: msgParams,
    })
    return {
      sig: sign,
    }
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
        this.account.address.toLowerCase(),
      erc1155Amount: this.isErc1155
        ? new BigNumber(this.erc1155Amount).lte(
          new BigNumber(this.nftToken.amount),
        ) &&
          new BigNumber(parseFloat(this.erc1155Amount)).eq(
            new BigNumber(parseInt(this.erc1155Amount)),
          ) &&
          new BigNumber(parseInt(this.erc1155Amount)).gt(ZERO)
        : true,
    }
  }

  get isErc1155() {
    return this.nftToken.type === 'ERC1155'
  }

  get isErc721() {
    return this.nftToken.type === 'ERC721'
  }

  get category() {
    return this.categories.find(
      (category) =>
        category.address.toLowerCase() === this.nftToken.contract.toLowerCase(),
    )
  }
}
</script>

<style lang="scss" scoped>
@import "~assets/css/theme/_theme";

.text-gray-500 {
  color: dark-color("500");
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

@media (max-width: 570px) {
  .box {
    max-width: 100%;
  }
}
</style>
