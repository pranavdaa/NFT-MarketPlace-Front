<template>
  <div class="section position-absolute">
    <div
      class="modal-backdrop"
      :class="{ show: show && displayed }"
    />
    <div
      v-bsl="show"
      class="modal transaction-prog-modal"
      :class="{
        show: show && displayed,
        'hide-modal': showApproveModal && depositModal,
      }"
    >
      <div
        class="modal-dialog w-sm-100 align-self-center"
        role="document"
      >
        <div class="box in-process-box">
          <div class="box-body">
            <div
              class="close-wrapper"
              @click="close()"
            >
              <svg-sprite-icon
                name="close-modal"
                class="close"
              />
            </div>
            <div class="container-fluid ps-t-20">
              <div class="row ps-y-32">
                <div
                  class="w-100 d-flex flex-column ps-x-16 ps-x-sm-32 ps-x-lg-40"
                >
                  <h3 class="font-heading-medium font-semibold">
                    <a
                      :href="order.external_link"
                      target="_blank"
                      rel="noopener noreferrer"
                      class="text-gray-900"
                    >{{ order.token.name }}
                      {{ isErc1155 ? "( " + order.quantity + " )" : "" }}
                    </a>
                  </h3>
                  <img
                    class="asset-img mx-auto ps-b-20"
                    :src="order.token.img_url"
                    alt="order.token.name"
                    @load="onImageLoad"
                    @error="imageLoadError"
                  >
                  <div
                    v-if="order.type === orderTypes.FIXED"
                    class="mt-auto w-100 d-flex flex-column fixed-price"
                  >
                    <div
                      v-if="dirty && !validation['balance']"
                      class="error-text font-caption text-center ps-y-16"
                    >
                      {{ errorMessage }}
                      <div class="ps-t-16">
                        <NuxtLink
                          class="text-center font-semibold text-primary-600"
                          :to="{ name: 'account' }"
                        >
                          Add funds to your account here
                        </NuxtLink>
                      </div>
                    </div>

                    <div class="font-body-small text-gray-300 mt-auto ps-y-4">
                      Listed for
                    </div>
                    <div
                      v-if="erc20Token"
                      class="font-heading-large font-semibold"
                    >
                      {{ order.price }} {{ erc20Token.symbol }}
                    </div>
                    <div
                      v-if="erc20Token"
                      class="font-heading-medium font-semibold ps-b-20 text-gray-300"
                    >
                      {{ priceInUSD }}
                    </div>
                    <!-- <div
                      class="font-heading-large font-semibold ps-b-20"
                      v-if="erc20Token"
                    >{{order.getPrice().toString(10)}} {{erc20Token.symbol}}</div>-->
                    <button-loader
                      class
                      :loading="isLoading"
                      :loadingText="'Buying'"
                      :text="'Buy now'"
                      block
                      primary
                      lg
                      color="primary"
                      :click="buyFixedOrder"
                    />
                  </div>
                  <div
                    v-if="order.type === orderTypes.NEGOTIATION"
                    class="mt-auto w-100 d-flex flex-column fixed-price-negotiation"
                  >
                    <div
                      v-if="dirty && !validation['balance']"
                      class="error-text font-caption ps-y-16"
                    >
                      {{ errorMessage }}
                    </div>

                    <div class="d-flex justify-content-between">
                      <div>
                        <div class="font-body-small text-gray-300 ps-y-4">
                          Listed for
                        </div>
                        <div
                          v-if="erc20Token"
                          class="font-heading-large font-semibold"
                        >
                          {{ order.price }} {{ erc20Token.symbol }}
                        </div>
                        <div
                          v-if="erc20Token"
                          class="font-heading-medium font-semibold ps-b-20 text-gray-300"
                        >
                          {{ priceInUSD }}
                        </div>
                      </div>

                      <div
                        v-if="order.highest_bid"
                        class="text-right"
                      >
                        <div class="font-body-small text-gray-300 ps-y-4">
                          Last offer
                        </div>
                        <div class="font-heading-large font-semibold">
                          {{ order.highest_bid }} {{ erc20Token.symbol }}
                        </div>
                        <div
                          v-if="erc20Token"
                          class="font-heading-medium font-semibold ps-b-20 text-gray-300"
                        >
                          {{ lastPriceInUSD }}
                        </div>
                      </div>

                      <div
                        v-else
                        class="text-right"
                      >
                        <div class="font-body-small text-gray-300 ps-y-4">
                          Min Price
                        </div>
                        <div class="font-heading-large font-semibold">
                          {{ order.min_price }} {{ erc20Token.symbol }}
                        </div>
                        <div
                          v-if="erc20Token"
                          class="font-heading-medium font-semibold ps-b-20 text-gray-300"
                        >
                          {{ minPriceInUSD }}
                        </div>
                      </div>
                    </div>

                    <!-- <div
                        class="font-heading-large font-semibold ps-b-20"
                        v-if="erc20Token"
                      >{{order.getPrice().toString(10)}} {{erc20Token.symbol}}</div>-->
                    <!-- <div
                        class="font-heading-large font-semibold ps-b-20 ml-auto"
                        v-if="erc20Token"
                      >{{order.getMinPrice().toString(10)}} {{erc20Token.symbol}}</div>-->
                    <!-- </div> -->
                    <div class="d-flex">
                      <!-- <div class="w-50 ps-r-12"> -->
                      <!-- <button class="btn btn-primary btn-block ps-y-20">Buy Now</button> -->
                      <!-- <button-loader
                          class
                          :loading="isLoading"
                          :loadingText="'Buying'"
                          :text="'Buy now'"
                          block
                          primary
                          lg
                          color="primary"
                          :click="buyFixedOrder"
                        ></button-loader>
                      </div>-->
                      <div class="w-100">
                        <button
                          class="btn btn-primary btn-block btn-lg"
                          @click="makeOffer()"
                        >
                          Make an offer
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
                <div
                  v-if="order.type === orderTypes.AUCTION"
                  class="mt-auto w-100 d-flex flex-column auction ps-x-16 ps-x-sm-32 ps-x-lg-40 ps-y-40"
                >
                  <div
                    v-if="dirty && !validation['balance']"
                    class="error-text font-caption ps-y-16"
                  >
                    {{ errorMessage }}
                  </div>
                  <div class="d-flex justify-content-between">
                    <div class="font-body-small text-gray-300 ps-y-4">
                      Minimum bid
                    </div>
                    <div class="font-body-small text-gray-300 ml-auto ps-y-4">
                      Highest bid
                    </div>
                  </div>
                  <div class="d-flex justify-content-between">
                    <div
                      v-if="erc20Token && order.lowest_bid"
                      class="font-heading-large font-semibold ps-b-20"
                    >
                      {{ order.lowest_bid }} {{ erc20Token.symbol }}
                    </div>
                    <div
                      v-if="erc20Token && !order.lowest_bid"
                      class="font-heading-large font-semibold ps-b-20"
                    >
                      {{ order.price }} {{ erc20Token.symbol }}
                    </div>
                    <div
                      v-if="erc20Token && order.highest_bid"
                      class="font-heading-large font-semibold ps-b-20 ml-auto"
                    >
                      {{ order.highest_bid }} {{ erc20Token.symbol }}
                    </div>
                    <div
                      v-if="erc20Token && !order.highest_bid"
                      class="font-heading-large font-semibold ps-b-20 ml-auto"
                    >
                      {{ order.price }} {{ erc20Token.symbol }}
                    </div>
                  </div>
                  <div class="d-flex time-wrapper ps-8 justify-content-between">
                    <div
                      class="d-flex flex-column text-center align-self-center ps-x-8"
                    >
                      <div class="font-heading-small font-semibold">
                        {{ timeRemaining.days }}
                      </div>
                      <div class="font-caption">
                        Days
                      </div>
                    </div>
                    <div
                      class="d-flex flex-column text-center align-self-center ps-x-8"
                    >
                      <div class="font-heading-small font-semibold">
                        {{ timeRemaining.hours }}
                      </div>
                      <div class="font-caption">
                        Hrs
                      </div>
                    </div>
                    <div
                      class="d-flex flex-column text-center align-self-center ps-x-8"
                    >
                      <div class="font-heading-small font-semibold">
                        {{ timeRemaining.mins }}
                      </div>
                      <div class="font-caption">
                        Mins
                      </div>
                    </div>
                    <div
                      class="d-flex flex-column text-center align-self-center ps-x-8"
                    >
                      <div class="font-heading-small font-semibold">
                        {{ timeRemaining.secs }}
                      </div>
                      <div class="font-caption">
                        Secs
                      </div>
                    </div>

                    <div class="d-flex">
                      <button
                        class="btn btn-light btn-block ps-x-24 ps-x-sm-40"
                        @click="makeOffer()"
                      >
                        Bid Now
                      </button>
                    </div>
                  </div>
                  <div
                    class="font-body-small text-gray-500 ps-t-20 text-center"
                  >
                    The highest bidder will automatically win in
                    {{ remainingTimeinWords }}.
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <place-bid
      v-if="showMakeOffer"
      :show="showMakeOffer"
      :executeBidOrOffer="executeBidOrOffer"
      :executeDeposit="executeDeposit"
      :order="order"
      :inProcess="isLoading"
      :bid="isBid"
      :close="closeMakeOffer"
    />

    <approve-process
      v-if="showApproveModal"
      :close="closeApproveModal"
      :approveClicked="approveClickedFunc"
      :signClicked="signClickedFunc"
      :isApprovedStatus="isApprovedStatus"
      :approveLoading="approveLoading"
      :isSignedStatus="isSignedStatus"
      :signLoading="signLoading"
      :modalTexts="approvalModalText"
      :networkChangeNeeded="error === 'selectMatic'"
    />

    <deposit-weth
      :show="depositModal"
      :close="closeDepositModal"
    />
  </div>
</template>

<script>
import Vue from 'vue'
import Component from 'nuxt-class-component'
import { mapGetters } from 'vuex'
import Web3 from 'web3'

import app from '~/plugins/app'
import moment from 'moment'
import { FormValidator } from '~/components/mixin'
import InputToken from '~/components/lego/input-token'
import getAxios from '~/plugins/axios'

import { parseBalance } from '~/plugins/helpers/token-utils'
import { formatUSDValue } from '~/plugins/helpers/index'
import PlaceBid from '~/components/lego/modals/place-bid'
import ApproveProcess from '~/components/lego/modals/approve-process'
import DepositWeth from '~/components/lego/modals/deposit-weth'
import { registerNetwork } from '~/plugins/helpers/metamask-utils'

import { providerEngine } from '~/plugins/helpers/provider-engine'
import { txShowError } from '~/plugins/helpers/transaction-utils'

const { getTypedData } = require('~/plugins/meta-tx')

// 0X
const {
  ContractWrappers,
  ERC20TokenContract,
  OrderStatus,
} = require('@0x/contract-wrappers')
const { generatePseudoRandomSalt, signatureUtils } = require('@0x/order-utils')
const { BigNumber } = require('@0x/utils')
const { Web3Wrapper } = require('@0x/web3-wrapper')

const ZERO = BigNumber(0)
const TEN = BigNumber(10)

@Component({
  props: {
    show: {
      type: Boolean,
      required: true,
    },
    order: {
      type: Object,
      require: true,
    },
    category: {
      type: Object,
      required: true,
    },
    close: {
      type: Function,
      required: true,
    },
    refreshBids: {
      type: Function,
      required: false,
      default: () => {},
    },
  },
  components: { InputToken, PlaceBid, ApproveProcess, DepositWeth },
  computed: {
    ...mapGetters('token', ['erc20Tokens', 'selectedERC20Token']),
    ...mapGetters('network', ['networks']),
    ...mapGetters('account', ['account']),
    ...mapGetters('auth', ['user']),
  },
  methods: {},
  mixins: [FormValidator],
})
export default class BuyToken extends Vue {
  activeTab = 0;
  duration = 0;
  negotiation = false;
  isLoading = false;
  showMore = false;
  displayed = true;
  error = '';

  showMakeOffer = false;

  dirty = false;
  errorMessage = "You don't have sufficient balance to buy this order";

  tabs = [
    {
      id: 0,
      title: 'Fixed Price',
      subtitle: 'Set price',
      description:
        'Your asset will be sold at this price. It will be available for sale in marketplace until you cancel it.',
      commission: '',
      btnTitle: 'Submit to Marketplace',
    },
    {
      id: 1,
      title: 'Sell in Auction',
      subtitle: 'Set minimum bid',
      description:
        'Your asset will be sold at this price. It will be available for sale in marketplace until you cancel it.',
      commission: '',
      btnTitle: 'Submit to Marketplace',
    },
  ];

  showApproveModal = false;
  isApprovedStatus = false;
  isSignedStatus = false;
  approveLoading = false;
  signLoading = false;
  makerAmount = null;
  depositModal = false;

  mounted() {
    this.$logger.track('mounted:buy-token', {order: this.order.id, category: this.category})
  }

  onImageLoad() {
    try {
      const img = this.$el.querySelector('.asset-img')
      const rgbColor = colorThief.getColor(img)
      if (rgbColor) {
        const hsl = rgbToHsl({
          r: rgbColor[0],
          g: rgbColor[1],
          b: rgbColor[2],
        })
        this.bg = `hsl(${hsl.h},${hsl.s}%,${hsl.l}%)`
      } else {
        this.bg = '#f3f4f7'
      }
    } catch (error) {}
  }

  convertPriceToUSD(amount) {
    const amountVal = new BigNumber(amount)
    const usdVal = new BigNumber(this.erc20Token.usd)
    const result = amountVal.times(usdVal)
    return result
  }

  closeDepositModal() {
    this.depositModal = false
    this.close()
  }

  // handler
  tokenImage(token) {
    return require('~/static/tokens/' + token.toUpperCase() + '.svg')
  }

  closeApproveModal() {
    this.showApproveModal = false
    this.close()
  }

  imageLoadError(event) {
    event.target.src = this.category.img_url
    event.target.style.width = '100px'
  }

  // get
  get erc20Token() {
    return this.erc20Tokens.filter(
      (token) => token.id === this.order.erc20tokens_id,
    )[0]
  }

  get isErc1155() {
    return this.order.token_type === 'ERC1155'
  }

  get isErc721() {
    return this.order.token_type === 'ERC721'
  }

  get approvalModalText() {
    return {
      approve: {
        title: 'Approve',
        subText: `Approve 0x contract to transfer your ${this.erc20Token.symbol}`,
      },
      sign: {
        title: 'Sign buy order',
        subText: '',
      },
    }
  }

  get orderTypes() {
    return app.orderTypes
  }

  get priceInUSD() {
    return this.order.usd_price
      ? formatUSDValue(parseFloat(this.order.usd_price))
      : '$0'
  }

  get minPriceInUSD() {
    const equivalentUSD = this.convertPriceToUSD(this.order.min_price)
    return isNaN(equivalentUSD) ? '$0' : formatUSDValue(equivalentUSD)
  }

  get lastPriceInUSD() {
    const equivalentUSD = this.convertPriceToUSD(this.order.highest_bid)
    return isNaN(equivalentUSD) ? '$0' : formatUSDValue(equivalentUSD)
  }

  get isBid() {
    if (this.order.type === app.orderTypes.AUCTION) {
      return true
    }
    return false
  }

  get timeRemaining() {
    if (this.order.type !== app.orderTypes.AUCTION) {
      return {}
    }

    const expiry = moment(this.order.expiry_date)
    const current = moment()
    const diff = moment.duration(expiry.diff(current))

    return {
      days: diff.days(),
      hours: diff.hours(),
      mins: diff.minutes(),
      secs: diff.seconds(),
    }
  }

  get remainingTimeinWords() {
    let wordings = ''
    if (this.timeRemaining) {
      if (this.timeRemaining.days > 0) {
        wordings = `${this.timeRemaining.days} days`
      } else if (this.timeRemaining.hours > 0) {
        wordings = `${this.timeRemaining.hours} hours`
      } else if (this.timeRemaining.mins > 0) {
        wordings = `${this.timeRemaining.mins} mins`
      } else if (this.timeRemaining.secs > 0) {
        wordings = `${this.timeRemaining.secs} seconds`
      }
    }
    return wordings
  }

  // action
  get validation() {
    return {
      balance: this.erc20Token.balance.gte(this.order.price),
    }
  }

  async checkApprovestatus() {
    this.approveLoading = true

    if (this.order.type === this.orderTypes.NEGOTIATION) {
      try {
        const yearInSec = moment().add(365, 'days').format('x')
        const chainId = this.networks.matic.chainId
        const erc20Address = this.order.erc20tokens.erc20tokensaddresses[0]
          .address

        const makerAddress = this.account.address
        const contractWrappers = new ContractWrappers(providerEngine(), {
          chainId,
        })

        let expirationTimeSeconds = new BigNumber(yearInSec)
        if (this.order.expiry_date) {
          expirationTimeSeconds = new BigNumber(
            moment(this.order.expiry_date).format('x'),
          )
        }

        const matic = new Web3(this.networks.matic.rpc)
        const erc20TokenCont = new ERC20TokenContract(
          erc20Address,
          providerEngine(),
        )

        const allowance = await erc20TokenCont
          .allowance(
            makerAddress,
            contractWrappers.contractAddresses.erc20Proxy,
          )
          .callAsync()

        this.isApprovedStatus = allowance.gt(ZERO)
        this.approveLoading = false
      } catch (error) {
        console.error(error)
        this.approveLoading = false
        txShowError(error, null, 'Something went wrong')
      }
    } else if (this.order.type === this.orderTypes.FIXED) {
      try {
        const takerAddress = this.account.address
        const erc20Address = this.erc20Token.address
        const takerAssetAmount = Web3Wrapper.toBaseUnitAmount(
          new BigNumber(this.order.price),
          this.erc20Token.decimal,
        )
        const signedOrder = JSON.parse(this.order.signature)
        const contractWrappers = new ContractWrappers(providerEngine(), {
          chainId: signedOrder.chainId,
        })

        // Check Approve 0x
        const matic = new Web3(this.networks.matic.rpc)
        const erc20TokenCont = new ERC20TokenContract(
          erc20Address,
          providerEngine(),
        )

        const allowance = await erc20TokenCont
          .allowance(
            takerAddress,
            contractWrappers.contractAddresses.erc20Proxy,
          )
          .callAsync()

        this.isApprovedStatus = allowance.gt(ZERO)
        this.approveLoading = false
      } catch (error) {
        console.error(error)
        this.approveLoading = false
        txShowError(error, null, 'Something went wrong')
      }
    }
  }

  async approveClickedFunc() {
    this.approveLoading = true
    this.error = ''
    this.$logger.track('approve-start:buy-token')

    if (this.order.type === this.orderTypes.NEGOTIATION) {
      try {
        this.$logger.track('approve-start-negotiation:buy-token')
        const yearInSec = moment().add(365, 'days').format('x')
        const chainId = this.networks.matic.chainId
        const nftContract = this.order.categories.categoriesaddresses[0]
          .address
        const nftTokenId = this.order.tokens_id
        const erc20Address = this.order.erc20tokens.erc20tokensaddresses[0]
          .address
        const isMetaTx = this.order.erc20tokens.isMetaTx
        const makerAddress = this.account.address
        // const takerAddress = this.account.address;
        const makerAssetAmount = this.makerAmount.toString(10)
        const takerAssetAmount = new BigNumber(1)
        const decimalnftTokenId = this.order.tokens_id
        const contractWrappers = new ContractWrappers(providerEngine(), {
          chainId,
        })

        let expirationTimeSeconds = new BigNumber(yearInSec)
        if (this.order.expiry_date) {
          expirationTimeSeconds = new BigNumber(
            moment(this.order.expiry_date).format('x'),
          )
        }
        this.$logger.track('approve-start-negotiation-0x:buy-token')
        const isApproved = this.approve0x(
          contractWrappers,
          erc20Address,
          makerAddress,
          isMetaTx,
        )
          .then((result) => {
            this.$logger.track('approve-negotiation-success:buy-token')
            this.isApprovedStatus = result
            this.approveLoading = false
          })
          .catch((e) => {
            this.approveLoading = false
          })
      } catch (error) {
        console.error(error)
        this.approveLoading = false
        txShowError(error, null, 'Something went wrong')
      }
    } else if (this.order.type === this.orderTypes.FIXED) {
      try {
        this.$logger.track('approve-start-fixed:buy-token')
        const chainId = this.networks.matic.chainId
        const takerAddress = this.account.address
        const erc20Address = this.erc20Token.address
        const isMetaTx = this.erc20Token.isMetaTx
        const takerAssetAmount = Web3Wrapper.toBaseUnitAmount(
          new BigNumber(this.order.price),
          this.erc20Token.decimal,
        )
        const signedOrder = JSON.parse(this.order.signature)
        const contractWrappers = new ContractWrappers(providerEngine(), {
          chainId: signedOrder.chainId,
        })

        signedOrder.makerAssetAmount = BigNumber(
          signedOrder.makerAssetAmount,
        )
        signedOrder.takerAssetAmount = takerAssetAmount
        signedOrder.expirationTimeSeconds = BigNumber(
          signedOrder.expirationTimeSeconds,
        )
        signedOrder.makerFee = BigNumber(signedOrder.makerFee)
        signedOrder.salt = BigNumber(signedOrder.salt)
        signedOrder.takerFee = BigNumber(signedOrder.takerFee)
        console.log(signedOrder)

        // Check Approve 0x, Approve if not
        this.$logger.track('approve-start-fixed-0x:buy-token')
        const isApproved = await this.approve0x(
          contractWrappers,
          erc20Address,
          takerAddress,
          isMetaTx,
        )
        this.$logger.track('approve-fixed-success:buy-token')
        this.isApprovedStatus = isApproved
        this.approveLoading = false
      } catch (error) {
        console.error(error)
        this.approveLoading = false
        txShowError(error, null, 'Something went wrong')
      }
    }
  }

  async signClickedFunc() {
    this.signLoading = true
    this.$logger.track('sign-start:buy-token')
    if (this.order.type === this.orderTypes.NEGOTIATION) {
      try {
        const yearInSec = moment().add(365, 'days').format('x')
        const chainId = this.networks.matic.chainId
        const nftContract = this.order.categories.categoriesaddresses[0]
          .address
        const nftTokenId = this.order.tokens_id
        const erc20Address = this.order.erc20tokens.erc20tokensaddresses[0]
          .address

        const makerAddress = this.account.address
        // const takerAddress = this.account.address;
        const makerAssetAmount = this.makerAmount.toString(10)
        let takerAssetAmount = null
        const decimalnftTokenId = this.order.tokens_id
        const contractWrappers = new ContractWrappers(providerEngine(), {
          chainId,
        })

        let expirationTimeSeconds = new BigNumber(yearInSec)
        if (this.order.expiry_date) {
          expirationTimeSeconds = new BigNumber(
            moment(this.order.expiry_date).format('x'),
          )
        }

        const exchangeAddress = contractWrappers.contractAddresses.exchange
        const erc20TokenCont = new ERC20TokenContract(
          erc20Address,
          providerEngine(),
        )

        const makerAssetData = await contractWrappers.devUtils
          .encodeERC20AssetData(erc20Address)
          .callAsync()
        let takerAssetData = null

        if (this.isErc1155) {
          takerAssetAmount = new BigNumber(this.order.quantity)
          takerAssetData = await contractWrappers.devUtils
            .encodeERC1155AssetData(
              nftContract,
              [new BigNumber(decimalnftTokenId)],
              [new BigNumber(this.order.quantity)],
              '0x',
            )
            .callAsync()
        } else {
          takerAssetAmount = new BigNumber(1)
          takerAssetData = await contractWrappers.devUtils
            .encodeERC721AssetData(
              nftContract,
              new BigNumber(decimalnftTokenId),
            )
            .callAsync()
        }

        const orderTemplate = {
          chainId: chainId,
          exchangeAddress,
          makerAddress: makerAddress,
          takerAddress: app.uiconfig.NULL_ADDRESS,
          senderAddress: app.uiconfig.NULL_ADDRESS,
          feeRecipientAddress: app.uiconfig.NULL_ADDRESS,
          expirationTimeSeconds: expirationTimeSeconds,
          salt: generatePseudoRandomSalt(),
          makerAssetAmount,
          takerAssetAmount,
          makerAssetData,
          takerAssetData,
          makerFeeAssetData: app.uiconfig.NULL_BYTES,
          takerFeeAssetData: app.uiconfig.NULL_BYTES,
          makerFee: ZERO,
          takerFee: ZERO,
        }
        this.$logger.track('signing-start-negotiation:buy-token')
        const signedOrder = await signatureUtils.ecSignOrderAsync(
          providerEngine(),
          orderTemplate,
          makerAddress,
        )
        this.$logger.track('sign-metamask-complete-negotiation:buy-token')
        if (signedOrder) {
          const data = {}
          data.bid = parseBalance(
            makerAssetAmount,
            this.order.erc20tokens.decimal,
          ).toString(10)
          data.signature = JSON.stringify(signedOrder)

          // Store bid with signature
          this.$logger.track('sign-server-start-negotiation:buy-token')
          const response = await getAxios().patch(
            `orders/${this.order.id}/buy`,
            data,
          )

          if (response.status === 200 && response.data) {
            this.refreshBids()
            app.addToast(
              'Offered/bided successfully',
              'Your offer/bid has been successfully submitted',
              {
                type: 'success',
              },
            )
            this.$logger.track(
              'sign-server-complete-bid-negotiation:buy-token',
            )

            this.isSignedStatus = true
            this.signLoading = false
            this.close()
          }
        }
      } catch (error) {
        console.log(error)
        this.isSignedStatus = false
        this.signLoading = false
        txShowError(error, null, 'Something went wrong')
      }
    } else if (this.order.type === this.orderTypes.FIXED) {
      try {
        const chainId = this.networks.matic.chainId
        const takerAddress = this.account.address
        const erc20Address = this.erc20Token.address
        const takerAssetAmount = Web3Wrapper.toBaseUnitAmount(
          new BigNumber(this.order.price),
          this.erc20Token.decimal,
        )
        const signedOrder = JSON.parse(this.order.signature)
        const contractWrappers = new ContractWrappers(providerEngine(), {
          chainId: signedOrder.chainId,
        })

        const [
          { orderStatus, orderHash },
          remainingFillableAmount,
          isValidSignature,
        ] = await contractWrappers.devUtils
          .getOrderRelevantState(signedOrder, signedOrder.signature)
          .callAsync()
        this.$logger.track('validation-start-fixed:buy-token', {
          orderStatus,
          remainingFillableAmount,
          isValidSignature,
        })
        console.log('is fillable', {
          orderStatus,
          orderHash,
          remainingFillableAmount,
          isValidSignature,
          fill: OrderStatus.Fillable,
        })
        if (
          orderStatus === OrderStatus.Fillable &&
          remainingFillableAmount.isGreaterThan(0) &&
          isValidSignature
        ) {
          this.$logger.track('sign-server-fixed-fill-order:buy-token')
          const dataVal = await getAxios().get(
            `orders/exchangedata/encoded?orderId=${this.order.id}&functionName=fillOrder`,
          )
          this.$logger.track('sign-server-complete-fill-order:buy-token')
          const zrx = {
            salt: generatePseudoRandomSalt(),
            expirationTimeSeconds: signedOrder.expirationTimeSeconds,
            gasPrice: app.uiconfig.TX_DEFAULTS.gasPrice,
            signerAddress: takerAddress,
            data: dataVal.data.data,
            domain: {
              name: '0x Protocol',
              version: '3.0.0',
              chainId: this.networks.matic.chainId,
              verifyingContract: contractWrappers.contractAddresses.exchange,
            },
          }
          this.$logger.track('metamask-sign-fixed-start:buy-token')
          const takerSign = await signatureUtils.ecSignTransactionAsync(
            providerEngine(),
            zrx,
            takerAddress,
          )
          this.$logger.track('metamask-sign-fixed-complete:buy-token')
          if (takerSign) {
            this.$logger.track('handle-buy-final-sign-fixed:buy-token')
            await this.handleBuyToken(takerSign)
            this.$logger.track('buy-final-sign-fixed-success:buy-token')
          }
        } else {
          this.$logger.track('buy-already-sold-fixed:buy-token', {
            orderStatus,
            remainingFillableAmount,
            isValidSignature,
          })
          console.log('Order is already sold')
          const res = await getAxios().post(`orders/validate`, {
            orderId: this.order.id,
          })
          if (res.status === 200) {
            txShowError(
              null,
              'Order Invalid',
              'This order is no longer valid or has been sold out. Please try to buy some other NFT.',
            )
            this.$router.push({ name: 'index' })
          }
        }
      } catch (error) {
        console.log(error)
        this.isSignedStatus = false
        this.signLoading = false
        txShowError(error, null, 'Something went wrong')
      }
    }
  }

  async executeBidOrOffer(maker_amount) {
    this.makerAmount = maker_amount
    this.showApproveModal = true
    this.checkApprovestatus()
    this.showMakeOffer = false
  }

  async executeDeposit() {
    this.depositModal = true
    this.showMakeOffer = false
  }

  makeOffer() {
    this.$store.commit('token/selectedERC20Token', this.erc20Token)
    this.showMakeOffer = true
    this.displayed = false
  }

  closeMakeOffer() {
    this.showMakeOffer = false
    this.displayed = true
    this.close()
  }

  async buyFixedOrder() {
    if (this.order.type !== app.orderTypes.FIXED) {
      this.isLoading = false
      return
    }

    if (!this.isValid) {
      this.isLoading = false
      this.dirty = true
      return
    }

    this.showApproveModal = true
    this.displayed = false
    this.checkApprovestatus()
  }

  async approve0x(contractWrappers, erc20Address, takerAddress, isMetaTx) {
    const matic = new Web3(this.networks.matic.rpc)
    const erc20TokenCont = new ERC20TokenContract(
      erc20Address,
      providerEngine(),
    )

    const allowance = await erc20TokenCont
      .allowance(takerAddress, contractWrappers.contractAddresses.erc20Proxy)
      .callAsync()
    this.$logger.track('approving-0x:buy-token', { allowance })
    if (!allowance.gt(ZERO)) {
      if (isMetaTx) {
        const data = await matic.eth.abi.encodeFunctionCall(
          {
            name: 'approve',
            type: 'function',
            inputs: [
              {
                name: 'spender',
                type: 'address',
              },
              {
                name: 'amount',
                type: 'uint256',
              },
            ],
          },
          [
            contractWrappers.contractAddresses.erc20Proxy,
            '115792089237316195423570985008687907853269984665640564039457584007913129639935',
          ],
        )

        const { sig } = await this.executeMetaTx(data)

        const tx = {
          intent: sig,
          fnSig: data,
          from: this.account.address,
          contractAddress: matic.utils.toChecksumAddress(
            this.order.erc20tokens.erc20tokensaddresses[0].address,
          ),
        }

        if (tx) {
          try {
            const response = await getAxios().post(`orders/executeMetaTx`, tx)
            if (response.status === 200) {
              this.$logger.track(
                'approving-0x-complete-non-meta-tx:buy-token',
                { response },
              )
              console.log('Approved')
              app.addToast('Approved', 'You successfully approved', {
                type: 'success',
              })
              return true
            }
          } catch (error) {
            console.log(error)
            txShowError(
              null,
              'Failed to approve',
              'You need to approve the transaction to sale the NFT',
            )
          }
        }
        return false
      } else {
        if (!(await this.metamaskValidation())) {
          this.approveLoading = false
          return false
        }
        try {
          const amount = new BigNumber(
            '0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff',
          )
          const erc20Approve = await erc20TokenCont
            .approve(contractWrappers.contractAddresses.erc20Proxy, amount)
            .sendTransactionAsync({
              from: this.account.address,
              gas: 100000,
              gasPrice: 1000000000,
            })
          if (erc20Approve) {
            console.log('Approved')
            app.addToast('Approved', 'You successfully approved', {
              type: 'success',
            })
            this.$logger.track('approving-0x-complete-non-meta-tx:buy-token', {
              erc20Approve,
            })
            return true
          }
        } catch (error) {
          console.log(error);
          if (
            error.message.includes(
              'MetaMask is having trouble connecting to the network'
            )
          ) {
            txShowError(error, null, 'Please Try Again');
          } else {
            txShowError(
              null,
              'Failed to approve',
              'You need to approve the transaction to sale the NFT'
            );
          }
        }
        return false
      }
    }
    return true
  }

  async metamaskValidation() {
    const web3obj = new Web3(window.ethereum)
    const chainId = await web3obj.eth.getChainId()
    if (chainId !== this.networks.matic.chainId) {
      // try {
      //   await registerNetwork();
      //   return true;
      // } catch (error) {
        this.error = 'selectMatic';
        return false;
      // }
    }
    return true
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
        this.order.erc20tokens.erc20tokensaddresses[0].address,
      ),
      data,
    })
    const dataToSign = getTypedData({
      name: this.order.erc20tokens.name,
      version: '1',
      salt: app.uiconfig.SALT,
      verifyingContract: matic.utils.toChecksumAddress(
        this.order.erc20tokens.erc20tokensaddresses[0].address,
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

  async handleBuyToken(takerSign) {
    try {
      const data = {
        taker_signature: JSON.stringify(takerSign),
      }
      const response = await getAxios().patch(
        `orders/${this.order.id}/buy`,
        data,
      )
      if (response.status === 200) {
        app.addToast(
          'Order bought successfully',
          'You bought the order successfully',
          {
            type: 'success',
          },
        )
        this.$router.push({ name: 'account' })
        this.close()
      }
    } catch (error) {
      console.log(error)
      txShowError(
        null,
        'Failed to buy order',
        'Something went wrong while buying order',
      )
    }
    this.$store.dispatch('category/fetchCategories')
  }
}
</script>

<style lang="scss" scoped>
@import "~assets/css/theme/_theme";

.asset-img {
  max-width: 300px;
  max-height: 300px;
}

.hide-modal {
  opacity: 0;
}

.text-gray-900 {
  color: dark-color("900");
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

.show-more {
  .dots {
    display: inline;
  }
  .more {
    display: none;
  }
}
.show-less {
  .dots {
    display: none;
  }
  .more {
    display: inline;
  }
}

.auction {
  background-color: light-color("600");
  margin-bottom: -32px;
  border-bottom-left-radius: $default-card-box-border-radius;
  border-bottom-right-radius: $default-card-box-border-radius;
}

.time-wrapper {
  background-color: primary-color("600");
  color: light-color("700");
  border-radius: $default-card-box-border-radius;

  .font-caption {
    opacity: 0.6;
    padding-top: 4px;
  }
}
.error-text {
  color: red-color("500");
}

.box {
  max-width: 446px;
  width: 446px;
  &,
  .box-body,
  .container-fluid,
  .row {
    min-height: 500px;
  }
  .box-body {
    position: relative;
    border-radius: $default-card-box-border-radius;
    .close-wrapper {
      top: 20px;
      right: 20px;
      z-index: 1;
      position: absolute;
      cursor: pointer;
      .close {
        width: 38px !important;
        height: 38px !important;
      }
    }
  }
}

@media (max-width: 446px) {
  .box {
    max-width: 100%;
  }
}
</style>
