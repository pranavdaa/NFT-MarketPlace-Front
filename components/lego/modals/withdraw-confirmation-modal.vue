<template>
  <div class="section position-absolute">
    <PreventUnload
      :when="transactionStatus === STATUS.EXITING && !!this.transactionHash"
      message="Please stay on this page until the withdraw transaction is confirmed on Ethereum!"
    />
    <div
      v-bsl="show"
      class="modal receive-modal-wrapper"
      :class="{ show: show }"
    >
      <div
        class="modal-dialog w-sm-100 align-self-center"
        role="document"
      >
        <div class="box withdraw-box">
          <div class="box-header justify-content-center">
            <div
              class="font-heading-medium font-semibold align-self-center w-100 text-center"
            >
              {{ $t("withdraw.title") }}
            </div>
            <span
              class="left-arrow align-self-center float-right cursor-pointer"
              :class="{
                'disabled-cursor':
                  transactionStatus === STATUS.EXITING && transactionHash,
              }"
              @click="onCancel()"
            >
              <svg-sprite-icon
                name="close"
                class="close align-self-center float-left"
              />
            </span>
          </div>
          <div class="box-body">
            <div class="container p-0">
              <div
                class="col-12 ps-x-40 ps-b-20 ps-t-16 container-wrapper font-body-small"
              >
                <div class="d-flex ps-t-18">
                  <img
                    class="cate-icon align-self-center ms-r-8"
                    :src="category.img_url"
                  >
                  <div class="text-white align-self-center">
                    {{ transaction.token_array.length }} Collectibles
                  </div>
                </div>
                <div
                  class="container ms-t-20 card-list hide-scrollbar d-flex p-0"
                >
                  <div
                    v-for="token in selectedTokens"
                    :key="token.token_id"
                    class="token-img d-flex ms-x-6 ps-4 justify-content-center"
                  >
                    <img
                      class="align-self-center"
                      :src="token.img_url"
                      :alt="token.name"
                    >
                  </div>
                </div>
              </div>
            </div>
            <div class="container">
              <div class="row ps-x-40 ps-b-60">
                <div class="col-12 p-0">
                  <div class="mark-wrapper check float-left">
                    <img
                      v-if="transactionStatus === STATUS.BURNING"
                      src="~/static/img/yellow-check.svg"
                      alt="In Progress"
                    >
                    <img
                      v-if="transactionStatus >= STATUS.CHECKPOINTING"
                      src="~/static/img/green-check.svg"
                      alt="Green Check"
                    >
                  </div>
                  <div class="float-left body-medium ps-2 ms-l-12 d-flex">
                    <span
                      v-if="transactionStatus === STATUS.BURNING"
                      class="ps-t-0"
                    >{{ "Withdraw Initializing..." }}</span>
                    <span
                      v-if="transactionStatus >= STATUS.CHECKPOINTING"
                      class="ps-t-2"
                    >{{ "Withdraw Initialized" }}</span>
                  </div>
                </div>
                <div class="col-12 p-0">
                  <div
                    class="float-left process-msg font-caption text-gray ms-l-12 ms-b-2 ps-l-24"
                  >
                    <div class="ps-b-16">
                      <span v-if="transactionStatus === STATUS.BURNING">
                        {{
                          "It will take a few seconds for the transaction to complete"
                        }}
                      </span>
                      <a
                        v-if="
                          transactionStatus >= STATUS.BURNING &&
                            transaction.txhash
                        "
                        :href="maticExplorerURL"
                        rel="noopener noreferrer"
                        target="_blank"
                        :title="transaction.txhash"
                      >{{ $t("viewOnMaticscan") }}</a>
                    </div>
                  </div>
                </div>
                <div class="col-12 p-0">
                  <div
                    class="mark-wrapper float-left"
                    :class="{
                      check: transactionStatus >= STATUS.CHECKPOINTING,
                    }"
                  >
                    <img
                      v-if="transactionStatus === STATUS.CHECKPOINTING"
                      src="~/static/img/yellow-check.svg"
                      alt="Green Check"
                    >
                    <img
                      v-if="transactionStatus >= STATUS.CHECKPOINTED"
                      src="~/static/img/green-check.svg"
                      alt="Green Check"
                    >
                  </div>
                  <div class="float-left body-medium ps-2 ps-t-0 ms-l-12">
                    {{ "Checkpoint on Ethereum" }}
                  </div>
                </div>
                <div class="col-12 p-0">
                  <div
                    class="float-left process-msg font-caption text-gray ms-l-12 ms-b-2 ps-l-24"
                  >
                    <div class="ps-b-16">
                      <span v-if="transactionStatus === STATUS.CHECKPOINTING">
                        {{
                          "Waiting for Checkpoint to be reached on Ethereum. Approx time taken will be ~34 minutes"
                        }}
                      </span>
                    </div>
                  </div>
                </div>
                <div class="col-12 p-0">
                  <div
                    class="mark-wrapper float-left"
                    :class="{
                      check: transactionStatus >= STATUS.CHECKPOINTED,
                    }"
                  >
                    <img
                      v-if="transactionStatus === STATUS.CHECKPOINTED"
                      class="ms-l-2 ms-y-2"
                      src="~/static/img/information-check.svg"
                      alt="Green Check"
                    >
                    <img
                      v-if="transactionStatus === STATUS.EXITING"
                      src="~/static/img/yellow-check.svg"
                      alt="Green Check"
                    >
                    <img
                      v-if="transactionStatus >= STATUS.EXITED"
                      src="~/static/img/green-check.svg"
                      alt="Green Check"
                    >
                  </div>
                  <div class="float-left body-medium ps-2 ps-t-0 ms-l-12">
                    {{ "Exit transaction on Ethereum" }}
                  </div>
                </div>
                <div class="col-12 p-0">
                  <div
                    class="float-left process-msg font-caption text-gray ms-l-12 ms-b-2 ps-l-24"
                  >
                    <div class="ps-b-8">
                      <span v-if="transactionStatus === STATUS.CHECKPOINTED">
                        {{
                          "Please confirm the transaction to complete the Withdraw."
                        }}
                      </span>
                      <span v-if="transactionStatus === STATUS.EXITING">{{
                        "Transactions on Ethereum sometimes take longer based on network congestion. Please wait or increase the gas price "
                      }}</span>
                      <a
                        v-if="
                          transactionStatus >= STATUS.EXITING && transactionHash
                        "
                        :href="mainExplorerURL"
                        rel="noopener noreferrer"
                        target="_blank"
                        :title="transactionHash"
                      >{{ $t("viewOnEtherscan") }}</a>
                    </div>
                    <div
                      v-if="
                        transactionStatus === STATUS.EXITING && transactionHash
                      "
                      class="ps-b-16 text-red font-semibold"
                    >
                      {{ $t("preventUserWithdrawModalClose") }}
                    </div>
                  </div>
                </div>
                <div class="col-12 p-0">
                  <div
                    class="mark-wrapper float-left"
                    :class="{ check: transactionStatus >= STATUS.EXITED }"
                  >
                    <img
                      v-if="transactionStatus >= STATUS.EXITED"
                      src="~/static/img/green-check.svg"
                      alt="Green Check"
                    >
                  </div>
                  <div class="float-left body-medium ps-2 ms-l-12">
                    {{ "Withdraw completed" }}
                  </div>
                </div>
                <div class="col-12 p-0">
                  <div
                    class="float-left font-caption text-gray ms-l-12 ms-b-2 ps-l-24"
                  >
                    <span
                      v-if="transactionStatus >= STATUS.EXITED"
                      class="ps-l-2"
                    >
                      {{
                        "It will take ~2 minutes for the NFT to appear in your Ethereum account."
                      }}
                    </span>
                  </div>
                </div>
              </div>
              <div class="row">
                <div class="col-12 ps-x-32 text-center text-red">
                  <div
                    class="font-body-small text-red text-center mx-auto"
                    v-html="error"
                  />
                </div>
              </div>
              <div
                v-if="transactionStatus !== STATUS.EXITED"
                class="row p-0"
              >
                <div class="col-12 p-0 d-flex justify-content-space-between">
                  <button-loader
                    class="w-100"
                    :classes="['btn py-4 btn-pay no-top-border-radius']"
                    :block="true"
                    :text="'Finish Withdraw'"
                    color="primary"
                    :loading="isLoading"
                    :click="exit"
                    :loadingText="'Finishing withdraw'"
                    :disabled="
                      !(
                        transactionStatus >= STATUS.CHECKPOINTED &&
                        transactionStatus < STATUS.EXITED
                      )
                    "
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div
      class="modal-backdrop"
      :class="{ show: show }"
    />
  </div>
</template>

<script>
import Vue from 'vue'
import Component from 'nuxt-class-component'
import { mapGetters } from 'vuex'
import app from '~/plugins/app'
import getAxios from '~/plugins/axios'
import Dagger from '@maticnetwork/dagger'
import Decoder from 'eth-decoder'
import BigNumber from '~/plugins/bignumber'
import { VueWatch } from '~/components/decorator'

import { getWalletProvider } from '~/plugins/helpers/providers'

import PreventUnload from 'vue-prevent-unload'
const MaticPOSClient = require('@maticnetwork/maticjs').MaticPOSClient

const STATUS = {
  BURNING: 0,
  CHECKPOINTING: 1,
  CHECKPOINTED: 2,
  EXITING: 3,
  EXITED: 4,
}

@Component({
  props: {
    show: {
      type: Boolean,
      required: false,
      default: true,
    },
    isBurning: {
      type: Boolean,
      required: true,
    },
    transaction: {
      type: Object,
      required: true,
    },
    selectedTokens: {
      type: Array,
      required: true,
    },
    category: {
      type: Object,
      required: true,
    },
    refreshBalance: {
      type: Function,
      required: true,
    },
    cancel: {
      type: Function,
      required: true,
    },
  },
  components: {
    PreventUnload,
  },
  methods: {},
  computed: {
    ...mapGetters('account', ['account']),
    ...mapGetters('network', ['networks', 'networkMeta']),
  },
})
export default class WithdrawConfirmationModal extends Vue {
  STATUS = STATUS;

  selectToken = false;
  isLoading = false;
  error = null;
  transactionHash = null;
  isExited = false;
  isCheckpointed = false;

  // Checkpoint
  dagger = null;
  ROOT_CONTRACT = null;
  FUNCTION =
    '0xba5de06d22af2685c6c7765f60067f7d2b08c2d29f53cdf14d67f6d1c9bfb527';

  DAGGER_EVENT = null;
  DAGGER_URL = null;
  rootChainDecoder = null;
  childERC20Decoder = null;

  async mounted() {
    await this.initCheckpointCheck()
  }

  @VueWatch('isBurning', { immediate: true, deep: true })
  async onBurnChange(val) {
    if (!this.isBurning) {
      await this.initCheckpointCheck()
    }
  }

  async initCheckpointCheck() {
    await this.checkForCheckPointInclusion()
    if (this.isCheckpointed) {
      try {
        this.dagger.off(DAGGER_EVENT, this.handleCheckpointCreation)
      } catch (error) {}
    } else {
      this.ROOT_CONTRACT = this.networks.main.contracts.RootChainProxy
      this.DAGGER_EVENT = `latest:log/${this.ROOT_CONTRACT}/filter/${this.FUNCTION}/#`
      this.DAGGER_URL = this.networks.main.daggerEndpoint
      this.rootChainDecoder = new Decoder.LogDecoder([
        this.networkMeta.abi('RootChain'),
      ])
      this.childERC20Decoder = new Decoder.LogDecoder([
        this.networkMeta.abi('ChildERC20'),
      ])
      this.dagger = new Dagger(this.DAGGER_URL)
      this.dagger.on(this.DAGGER_EVENT, this.handleCheckpointCreation)
    }
  }

  // Getter
  get transactionStatus() {
    if (this.isBurning) {
      return STATUS.BURNING
    } else if (
      !this.isBurning &&
      !this.isCheckpointed &&
      !this.isLoading &&
      !this.isExited
    ) {
      return STATUS.CHECKPOINTING
    } else if (
      !this.isBurning &&
      this.isCheckpointed &&
      !this.isLoading &&
      !this.isExited
    ) {
      return STATUS.CHECKPOINTED
    } else if (
      !this.isBurning &&
      this.isCheckpointed &&
      this.isLoading &&
      !this.isExited
    ) {
      return STATUS.EXITING
    } else if (
      !this.isBurning &&
      this.isCheckpointed &&
      !this.isLoading &&
      this.isExited
    ) {
      return STATUS.EXITED
    }
  }

  get parentNetwork() {
    return this.networks.main
  }

  get childNetwork() {
    return this.networks.matic
  }

  get networkId() {
    return this.parentNetwork.chainId
  }

  get maticExplorerURL() {
    if (app.uiconfig.maticExplorer && this.transaction.txhash) {
      return `${app.uiconfig.maticExplorer}tx/${this.transaction.txhash}`
    }
    return null
  }

  get mainExplorerURL() {
    if (app.uiconfig.mainExplorer) {
      return `${app.uiconfig.mainExplorer}tx/${this.transactionHash}`
    }
    return null
  }

  // Actions
  async checkForCheckPointInclusion() {
    try {
      if (this.transaction.status === 1) {
        this.isCheckpointed = true
        return
      }
      if (this.transaction.status === 0) {
        const { data } = await getAxios().get(
          `${this.networks.main.watcherUrl}/header/included/${this.transaction.block_number}`,
        )
        if (data && data.status === 'success') {
          // const nextStatus = this.STATUS.CHECKPOINTED
          this.handleCheckpointInclusion()
        }
      }
    } catch (error) {}
  }

  getMaticPOS() {
    const maticProvider = getWalletProvider({
      networks: this.networks,
      primaryProvider: 'matic',
    })
    const parentProvider = getWalletProvider({
      networks: this.networks,
      primaryProvider: 'main',
    })
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
    })
  }

  async exit() {
    if (this.isLoading || this.isBurning) {
      return
    }

    try {
      this.isLoading = true
      this.error = null
      const maticPoS = this.getMaticPOS()
      const burnHash = this.transaction.txhash

      const exited = await maticPoS.isBatchERC721ExitProcessed(burnHash)
      if (exited) {
        console.log('exited before')
        await this.handleExitedTokens()
        this.isLoading = false
        this.cancel()
        return
      }

      const txHash = await maticPoS.exitBatchERC721(burnHash, {
        from: this.account.address,
        onTransactionHash: (txHash) => {
          this.transactionHash = txHash
        },
        onReceipt: async(txHash) => {
          console.log('exited now')
          await this.handleExit(txHash)
          this.isLoading = false
        },
      })
    } catch (error) {
      this.isLoading = false
      this.error = error.message
    }
  }

  async handleCheckpointCreation(checkpoint) {
    try {
      const parsedLogs = this.rootChainDecoder.decodeLogs([checkpoint])
      const endLog = parsedLogs[0].args.end
      const end = new BigNumber(endLog._hex)
      const blockNumber = BigNumber(this.transaction.block_number)
      if (blockNumber.lte(end) && this.transaction.status === 0) {
        // const nextStatus = this.STATUS.CHECKPOINTED
        this.handleCheckpointInclusion()
        this.dagger.off(DAGGER_EVENT, this.handleCheckpointCreation)
      }
    } catch (e) {
      // silent
    }
  }

  async handleCheckpointInclusion() {
    if (!this.transaction.id) {
      return
    }
    try {
      const data = {
        status: 1,
      }
      const response = await getAxios().put(
        `assetmigrate/${this.transaction.id}`,
        data,
      )
      if (response.status === 200) {
        this.isCheckpointed = true
      }
    } catch (error) {}
  }

  async handleExit(txHash) {
    console.log('Withdraw exit', txHash)
    try {
      const data = {
        exit_txhash: this.transactionHash,
        status: 2,
      }
      const response = await getAxios().put(
        `assetmigrate/${this.transaction.id}`,
        data,
      )
      if (response.status === 200) {
        this.isExited = true
        this.refreshBalance()
      }
    } catch (error) {}
  }

  async handleExitedTokens() {
    try {
      const data = {
        exit_txhash: 'TX EXITED EXTERNALLY',
        status: 2,
      }
      const response = await getAxios().put(
        `assetmigrate/${this.transaction.id}`,
        data,
      )
      if (response.status === 200) {
        this.isExited = true
        this.refreshBalance()
      }
    } catch (error) {}
  }

  onCancel() {
    if (this.transactionStatus === STATUS.EXITING && this.transactionHash) {
      {
        return
      }
      this.cancel()
    }
  }
}
</script>

<style lang="scss" scoped>
@import "~assets/css/theme/_theme";

.withdraw-box {
  width: 446px;
}

@media (max-width: 446px) {
  .withdraw-box {
    width: 100%;
  }
}
.cate-icon {
  height: 24px;
  width: 24px;
  border-radius: 50%;
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
.disabled-cursor {
  cursor: default !important;
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
