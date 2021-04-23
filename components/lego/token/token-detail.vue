<template>
  <div>
    <div
      v-if="order.id && !isLoadingDetails"
      class="container-fluid ps-y-16"
    >
      <div class="row ps-y-16 ps-x-md-16 justify-content-between">
        <div class="col-md-7 d-flex">
          <token-short-info
            v-if="category"
            class="align-self-center"
            :order="order"
            :category="category"
          />
        </div>
        <!-- Remove if-condition when implementing -->
        <div
          v-if="false"
          class="col-md d-flex justify-content-start ps-t-16 ps-t-md-0 justify-content-md-end"
        >
          <wishlist-button
            :wishlisted="isFavorite"
            :onClick="addToWishlist"
          />
          <a class="btn btn-light align-self-center action ms-l-16">
            <img
              src="~/static/icons/active/share.svg"
              alt="favorited"
              class="icon option-icon active"
            >
            <span>Share</span>
          </a>
        </div>
        <a :href="createOpenseaUrl" rel="noopener noreferrer" target="_blank" class="align-self-center">
          <img src="~/static/icons/opensea.svg" class="os-icon ps-r-16" alt="OS">
        </a>
      </div>
      <div class="row ps-y-16 ps-x-md-16 justify-content-center">
        <div class="col-md-8 h-100">
          <div
            class="feature-image d-flex d-lg-flex justify-content-center mb-4"
            :style="{ background: bg }"
          >
            <img
              v-if="checkImageFormat(order.token.img_url) || isNotVideoFormat"
              class="asset-img align-self-center"
              :src="order.token.img_url"
              alt="Token Image"
              @load="onImageLoad"
              @error="imageLoadError"
            >
            <video
              v-else
              autoplay
              muted
              loop
              height="500px"
              :poster="order.token.img_url"
            >
              <source
                :src="order.token.img_url"
                type="video/webm"
              >
              <source
                :src="order.token.img_url"
                type="video/ogg"
              >
              <source
                :src="order.token.img_url"
                type="video/mp4"
                @error="handleNotVideo"
              >
            </video>
          </div>
          <div
            class="feature-info mobile d-flex d-lg-none flex-column ps-16 ps-lg-40 ms-y-16"
          >
            <h3 class="font-heading-medium font-semibold">
              About {{ order.token.name }}
              {{ isErc1155 ? `( ${order.quantity} )` : "" }}
            </h3>
            <p
              v-if="orderDescription && orderDescription.length > 200"
              class="font-body-medium"
              :class="{ 'show-less': showMore, 'show-more': !showMore }"
            >
              {{ orderDescription.slice(0, orderDescription.length / 2) }}
              <span class="dots">...</span>
              <span class="more">{{
                orderDescription.slice(
                  orderDescription.length / 2,
                  orderDescription.length
                )
              }}</span>
              <a
                v-if="!showMore"
                class="font-body-small d-flex ps-t-8 font-medium"
                href="#more-info"
                @click.prevent="showMore = true"
              >More info</a>
              <a
                v-if="showMore"
                class="font-body-small d-flex ps-t-8 font-medium"
                href="#more-info"
                @click.prevent="showMore = false"
              >Show less</a>
            </p>
            <p
              v-else
              class="font-body-medium"
            >
              {{ orderDescription }}
            </p>

            <div
              v-if="showListedDetails"
              class="ms-t-16"
            >
              <div class="font-body-small text-gray-300 ps-y-4">
                Listed for
              </div>
              <div
                v-if="erc20Token"
                class="font-heading-large font-semibold ps-b-16"
              >
                {{ order.price }} {{ erc20Token.symbol }}
              </div>
              <div
                v-if="order.type === app.orderTypes.NEGOTIATION"
                class="font-body-medium ps-b-20"
              >
                Minimum Price:
                <span class="font-semibold">
                  {{ order.min_price }} {{ erc20Token.symbol }}
                </span>
              </div>
              <div
                v-if="
                  order.type === app.orderTypes.NEGOTIATION && order.highest_bid
                "
                class="font-body-medium ps-b-20"
              >
                Last Offer:
                <span class="font-semibold">
                  {{ order.highest_bid }} {{ erc20Token.symbol }}
                </span>
              </div>
              <!-- <div
                class="font-heading-large font-semibold ps-b-20"
                v-if="erc20Token"
              >{{order.getPrice().toString(10)}} {{erc20Token.symbol}}</div>-->
            </div>
            <button
              v-if="!isOwnersToken && order.status === 0"
              class="btn btn-primary"
              :disabled="isUser && !validation['balance']"
              @click="buyOrder()"
            >
              {{ buttonVal }}
            </button>
            <div
              v-if="
                isInsufficientBalance &&
                  !validation['balance'] &&
                  order.status === 0
              "
              class="font-body-small text-danger text-center ps-t-12"
            >
              You have insufficient balance in your account
            </div>
            <div
              v-if="
                isInsufficientBalance &&
                  order.status === 0 &&
                  (order.type === app.orderTypes.FIXED || !validation['balance'])
              "
              class="font-body-medium font-semibold text-primary text-center cursor-pointer ps-t-16"
              @click="depositModal = true"
            >
              Add Funds
            </div>
            <button
              v-if="isOwnersToken && order.status === 0"
              class="btn btn-light"
              @click="onCancelOrder()"
            >
              Cancel
            </button>
          </div>
          <div class="details-section">
            <div
              v-if="category"
              class="d-flex flex-column details-section--dropdown"
            >
              <div
                class="header-wrapper cursor-pointer py-4 ps-l-16"
                @click="showCategoryInfo = !showCategoryInfo"
              >
                <h3 class="font-heading-medium font-semibold category m-0">
                  About {{ category.name }}
                  <a
                    class="ps-l-12"
                    :href="category.url"
                    target="_blank"
                    rel="noopener noreferrer"
                  >Visit Website</a>

                  <span
                    v-if="category.description"
                    class="float-right right-arrow"
                    :class="{ 'down-icon': showCategoryInfo }"
                  >
                    <svg-sprite-icon name="right-arrow" />
                  </span>
                </h3>
              </div>
              <p
                v-if="showCategoryInfo && category.description"
                class="font-body-medium ps-t-20 ps-l-16"
              >
                {{ category.description }}
              </p>
            </div>

            <div
              v-if="order.token.attributes_metadata"
              class="properties details-section--dropdown"
            >
              <div
                class="header-wrapper cursor-pointer py-4 ps-l-16"
                @click="showProperties = !showProperties"
              >
                <h3 class="font-heading-medium font-semibold m-0">
                  Properties
                  <span
                    class="float-right right-arrow"
                    :class="{ 'down-icon': showProperties }"
                  >
                    <svg-sprite-icon name="right-arrow" />
                  </span>
                </h3>
              </div>
              <div
                v-if="showProperties"
                class="d-flex flex-row flex-wrap ps-t-16 ps-l-16"
              >
                <div
                  v-for="attribute in order.token.attributes_metadata"
                  :key="`${attribute.trait_type}-${attribute.value}`"
                  class="col-md-3 p-0 pr-4 justify-content-between"
                >
                  <div
                    class="d-flex flex-column text-center properties-pill p-3 mb-4"
                  >
                    <p
                      class="property-title m-0 p-0 text-truncate"
                    >
                      {{ attribute.trait_type | pascal }}
                    </p>
                    <p
                      class="property-detail m-0 pt-1 text-truncate"
                    >
                      <template
                        v-if="attribute.trait_type === 'birthday'"
                      >
                        {{  attribute.value | date-human }}
                      </template>
                      <template
                        v-else
                      >
                        {{  attribute.value | pascal }}
                      </template>
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div
              v-if="
                order.type !== app.orderTypes.FIXED &&
                  bidsFullList &&
                  bidsFullList.length
              "
              class="d-flex flex-column ps-y-16 ps-y-md-32 bids"
            >
              <h3 class="font-heading-medium font-semibold category">
                Bidding history
              </h3>
              <p class="font-body-medium ps-t-20">
                <bidder-row
                  v-for="bid in bidsFullList"
                  :key="bid.id"
                  :bid="bid"
                  :refreshBids="refreshBids"
                  :isOwnersToken="isOwnersToken"
                />
              </p>
            </div>
          </div>
        </div>

        <div class="col-md-4 d-none d-lg-flex h-100">
          <div class="feature-info d-flex flex-column ps-16 ps-lg-40 w-100">
            <h3 class="font-heading-medium font-semibold">
              About {{ order.token.name }}
              {{ isErc1155 ? `( ${order.quantity} )` : "" }}
            </h3>
            <p
              v-if="orderDescription && orderDescription.length > 200"
              class="font-body-medium"
              :class="{ 'show-less': showMore, 'show-more': !showMore }"
            >
              {{ orderDescription.slice(0, orderDescription.length / 2) }}
              <span class="dots">...</span>
              <span class="more">{{
                orderDescription.slice(
                  orderDescription.length / 2,
                  orderDescription.length
                )
              }}</span>
              <a
                v-if="!showMore"
                class="font-body-small d-flex ps-t-8 font-medium"
                href="#more-info"
                @click.prevent="showMore = true"
              >More info</a>
              <a
                v-if="showMore"
                class="font-body-small d-flex ps-t-8 font-medium"
                href="#more-info"
                @click.prevent="showMore = false"
              >Show less</a>
            </p>
            <p
              v-else
              class="font-body-medium"
            >
              {{ orderDescription }}
            </p>

            <div
              v-if="showListedDetails"
              class="mt-auto"
            >
              <div class="font-body-small text-gray-300 ps-y-4">
                Listed for
              </div>
              <div
                v-if="erc20Token"
                class="font-heading-large font-semibold ps-b-20"
              >
                {{ order.price }} {{ erc20Token.symbol }}
              </div>
              <div
                v-if="order.type === app.orderTypes.NEGOTIATION"
                class="font-body-medium ps-b-20"
              >
                Minimum Price:
                <span class="font-semibold">
                  {{ order.min_price }} {{ erc20Token.symbol }}
                </span>
              </div>
              <div
                v-if="
                  order.type === app.orderTypes.NEGOTIATION && order.highest_bid
                "
                class="font-body-medium ps-b-20"
              >
                Last Offer:
                <span class="font-semibold">
                  {{ order.highest_bid }} {{ erc20Token.symbol }}
                </span>
              </div>
              <!-- <div
                class="font-heading-large font-semibold ps-b-20"
                v-if="erc20Token"
              >{{order.getPrice().toString(10)}} {{erc20Token.symbol}}</div>-->
            </div>
            <button
              v-if="!isOwnersToken && order.status === 0"
              class="btn btn-primary"
              :disabled="isUser && !validation['balance']"
              @click="buyOrder()"
            >
              {{ buttonVal }}
            </button>
            <div
              v-if="
                isInsufficientBalance &&
                  !validation['balance'] &&
                  order.status === 0
              "
              class="font-body-small text-danger text-center ps-t-12"
            >
              You have insufficient balance in your account
            </div>
            <div
              v-if="
                isInsufficientBalance &&
                  order.status === 0 &&
                  (order.type === app.orderTypes.FIXED || !validation['balance'])
              "
              class="font-body-medium font-semibold text-primary text-center cursor-pointer ps-t-16"
              @click="depositModal = true"
            >
              Add Funds
            </div>
            <button
              v-if="isOwnersToken && order.status === 0"
              class="btn btn-light"
              @click="onCancelOrder()"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
      <deposit-weth
        :show="depositModal"
        :close="closeDepositModal"
      />
      <buy-token
        v-if="showBuyToken && order"
        :show="showBuyToken"
        :order="order"
        :category="category"
        :refreshBids="refreshBids"
        :close="onBuyTokenClose"
      />
      <cancel-confirm
        v-if="showCancelConfirm"
        :show="showCancelConfirm"
        :order="order"
        :category="category"
        :isLoading="isLoading"
        :accept="cancelOrder"
        :close="onCancelOrderClose"
      />
    </div>

    <div class="row ps-x-16 ps-y-120 d-flex justify-content-center text-center">
      <button-loader
        v-if="isLoadingDetails"
        class="mx-auto"
        :loading="isLoadingDetails"
        :loadingText="$t('loading')"
        :text="$t('loadMore')"
        block
        lg
        color="light"
      />
    </div>
  </div>
</template>

<script>
import Vue from 'vue'
import Component from 'nuxt-class-component'
import getAxios from '~/plugins/axios'
import app from '~/plugins/app'
import { mapGetters } from 'vuex'

import OrderModel from '~/components/model/order'
import BidModel from '~/components/model/bid'

import TokenShortInfo from '~/components/lego/token/token-short-info'
import WishlistButton from '~/components/lego/wishlist-button'
import BidderRow from '~/components/lego/bidder-row'
import BuyToken from '~/components/lego/modals/buy-token'
import CancelConfirm from '~/components/lego/modals/cancel-confirm'
import DepositWeth from '~/components/lego/modals/deposit-weth'
import { txShowError } from '~/plugins/helpers/transaction-utils'

import rgbToHsl from '~/plugins/helpers/color-algorithm'
import ColorThief from 'color-thief'

import { providerEngine } from '~/plugins/helpers/provider-engine'
const colorThief = new ColorThief()

const imageExtensions = ['gif', 'png', 'svg', 'jpg', 'jpeg']

// 0X
const {
  ContractWrappers,
} = require('@0x/contract-wrappers')
const { generatePseudoRandomSalt, signatureUtils } = require('@0x/order-utils')
const { BigNumber } = require('@0x/utils')
const { Web3Wrapper } = require('@0x/web3-wrapper')

@Component({
  props: {
    tokenId: {
      type: [Number, String],
      required: false,
    },
  },
  components: {
    TokenShortInfo,
    WishlistButton,
    BidderRow,
    BuyToken,
    CancelConfirm,
    DepositWeth,
  },
  computed: {
    ...mapGetters('category', ['categories']),
    ...mapGetters('token', ['erc20Tokens']),
    ...mapGetters('account', ['account', 'favouriteOrders']),
    ...mapGetters('auth', ['user']),
    ...mapGetters('network', ['networks']),
  },
  middleware: [],
  mixins: [],
  data() {
    return {
      depositModal: false,
    }
  },

  methods: {
    closeDepositModal() {
      this.depositModal = false
    },
  },
})
export default class TokenDetail extends Vue {
  bg = '#ffffff';
  showMore = false;
  showCategoryInfo = true;
  showProperties = true;
  showBuyToken = false;
  showCancelConfirm = false;

  limit = app.uiconfig.defaultPageSize;
  bidsFullList = [];
  hasNextPage = true;
  isLoadingBids = false;
  isLoadingDetails = false;
  isLoading = false;
  isNotVideoFormat = false;

  order = {};

  // initialize
  async mounted() {
    await this.fetchOrder()
  }

  onImageLoad() {
    try {
      const img = this.$el.querySelector('.asset-img')
      // img.crossOrigin = "Anonymous";

      const rgbColor = colorThief.getColor(img)
      if (rgbColor) {
        const hsl = rgbToHsl({
          r: rgbColor[0],
          g: rgbColor[1],
          b: rgbColor[2],
        })
        this.bg = `hsl(${hsl.h},${hsl.s}%,${hsl.l}%)`
      } else {
        this.bg = '#ffffff'
      }
    } catch (error) {}
  }

  // Get
  get orderDescription() {
    return this.order.token.description
  }

  get category() {
    return this.categories.filter(
      (item) => item.id === this.order.categories_id,
    )[0]
  }

  get isErc1155() {
    return this.order.token_type === 'ERC1155'
  }

  get isErc721() {
    return this.order.token_type === 'ERC721'
  }

  get app() {
    return app
  }

  get isUser() {
    return this.user
  }

  get isInsufficientBalance() {
    return this.user && !this.isOwnersToken
  }

  get erc20Token() {
    return this.erc20Tokens.filter(
      (token) => token.id === this.order.erc20tokens_id,
    )[0]
  }

  get isFavorite() {
    if (this.user && this.favouriteOrders) {
      const order = this.favouriteOrders.filter(
        (order) => order.order_id === this.order.id,
      )
      return order.length !== 0
    }
    return false
  }

  get isFavoriteId() {
    if (this.user && this.favouriteOrders) {
      const order = this.favouriteOrders.filter(
        (order) => order.order_id === this.order.id,
      )
      return order[0].id
    }
    return false
  }

  get isOwnersToken() {
    if (this.user && this.order.type !== app.orderTypes.FIXED) {
      return this.user.id === this.order.taker_address
    } else if (this.user && this.order.type === app.orderTypes.FIXED) {
      return this.user.id === this.order.maker_address
    }
    return false
  }

  get buttonVal() {
    return this.order.type === app.orderTypes.FIXED ? 'Buy Now' : 'Place a Bid'
  }

  get validation() {
    return {
      balance: this.erc20Token.balance.gte(this.order.min_price),
    }
  }

  get showListedDetails() {
    return !(this.order.status === 3)
  }

  get createOpenseaUrl() {
    return `https://opensea.io/assets/matic/${this.order.categories.categoriesaddresses[0].address}/${this.order.tokens_id}`
  }

  // async
  async fetchOrder() {
    if (!this.tokenId || this.isLoadingDetails) {
      return
    }
    this.isLoadingDetails = true
    try {
      const response = await getAxios().get(`orders/${this.tokenId}`)
      if (response.status === 200 && response.data.data) {
        const data = new OrderModel(response.data.data)
        this.order = data
      } else if (response.status === 202 && response.data.data) {
        const data = new OrderModel(response.data.data)
        const sellerAddress = data.seller_users.address

        this.order = data
        if (this.account.address === sellerAddress) {
          // Do nothing
        } else {
          const res = await getAxios().post(`orders/validate`, {
            orderId: this.tokenId,
          })

          if (res.status === 200) {
            txShowError(
              'Order Invalid',
              'Order Invalid',
              'This order is no longer valid or has been sold out. Please try to buy some other NFT.',
            )
            this.$router.push({ name: 'index' })
          }
        }
      }
    } catch (error) {
      console.log(error)
    }

    this.isLoadingDetails = false
    if (
      Object.keys(this.order).length !== 0 &&
      this.order.type !== app.orderTypes.FIXED
    ) {
      await this.fetchBidders()
    }
  }

  // actions
  buyOrder() {
    if (this.user) {
      this.showBuyToken = true
    } else {
      this.$router.push({
        name: 'login',
        query: { next: `/tokens/${this.order.id}` },
      })
    }
  }

  onBuyTokenClose() {
    this.showBuyToken = false
  }

  onCancelOrder() {
    this.showCancelConfirm = true
  }

  onCancelOrderClose() {
    this.showCancelConfirm = false
  }

  imageLoadError(event) {
    event.target.src = this.category.img_url
    event.target.style.width = '100px'
  }

  checkImageFormat(imgUrl) {
    let imgExt = imgUrl.substr((imgUrl.lastIndexOf('.') + 1))
    if (imageExtensions.includes(imgExt)) {
      return true
    }

    return false
  }

  handleNotVideo() {
    const image = new Image()
    image.src = this.order.token.img_url
    image.onload = () => { this.isNotVideoFormat = true }
    image.onerror = () => {
      const image = document.createElement('img')
      image.src = this.category.img_url;
      document.querySelector('.feature-image').appendChild(image)
      image.style.width = '200px'
      image.style.height = '200px'
      image.classList.add("asset-img", "align-self-center")
      document.getElementsByTagName("VIDEO")[0].style.display = "none"
    }
  }

  async cancelOrder() {
    this.isLoading = true
    try {
      if (this.order.type === app.orderTypes.FIXED) {
        const signedOrder = JSON.parse(this.order.signature)
        const takerAssetAmount = Web3Wrapper.toBaseUnitAmount(
          new BigNumber(this.order.price),
          this.erc20Token.decimal,
        )
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

        const chainId = this.networks.matic.chainId
        const contractWrappers = new ContractWrappers(providerEngine(), {
          chainId: chainId,
        })

        const dataVal = await getAxios().get(
          `orders/exchangedata/encoded?orderId=${this.order.id}&functionName=cancelOrder`,
        )

        const zrx = {
          salt: generatePseudoRandomSalt(),
          expirationTimeSeconds: signedOrder.expirationTimeSeconds,
          gasPrice: app.uiconfig.TX_DEFAULTS.gasPrice,
          signerAddress: signedOrder.makerAddress,
          data: dataVal.data.data,
          domain: {
            name: '0x Protocol',
            version: '3.0.0',
            chainId: this.networks.matic.chainId,
            verifyingContract: contractWrappers.contractAddresses.exchange,
          },
        }

        const takerSign = await signatureUtils.ecSignTransactionAsync(
          providerEngine(),
          zrx,
          signedOrder.makerAddress,
        )

        if (takerSign) {
          await this.handleCancelOrder(takerSign)
        }
      } else {
        await this.handleCancelOrder()
      }
    } catch (error) {
      console.log(error)
    }
    this.isLoading = false
    this.onCancelOrderClose()
  }

  async handleCancelOrder(takerSign = null) {
    let data = {}
    if (takerSign) {
      data = {
        taker_signature: JSON.stringify(takerSign),
      }
    }
    try {
      const response = await getAxios().patch(
        `orders/${this.order.id}/cancel`,
        data,
      )
      if (response.status === 200) {
        this.$router.push({ name: 'account' })
        app.addToast('Order canceled', 'You canceled the order successfully', {
          type: 'success',
        })
      }
    } catch (error) {
      console.error(error)
      txShowError(error, null, 'Something went wrong')
    }
  }

  async addToWishlist() {
    // Add current order to users wishlist if not wishlisted or if it is then remove it
    try {
      if (this.isFavorite) {
        const response = await getAxios().delete(
          `users/favourites/${this.isFavoriteId}`,
        )
      } else {
        const response = await getAxios().post('users/favourites', {
          orderId: this.order.id,
        })
      }
      this.$store.dispatch('account/fetchFavoritesOrders')
    } catch (error) {
      if (error.response.status === 401) {
        app.addToast(
          'Signin to add to favourites',
          'You need to login to add token to wishlist',
          {
            type: 'info',
          },
        )
      }
    }
  }

  async refreshBids() {
    await this.fetchBidders()
    await this.fetchOrder()
  }

  async fetchBidders() {
    if (this.isLoadingBids || this.order.type === app.orderTypes.FIXED) {
      return
    }
    try {
      let response
      response = await getAxios().get(`orders/bids/${this.order.id}`)
      if (response.status === 200 && response.data.data.order) {
        const bids = []
        response.data.data.order.forEach(function(bid) {
          bid.erc20Token = this.erc20Token
          bid.order = this.order
          if (bid.status === 0) {
            // if bid is active
            bids.push(new BidModel(bid))
          }
        }, this)
        this.hasNextPage = response.data.data.has_next_page
        this.bidsFullList = bids
      }
    } catch (error) {
      console.log(error)
    }
  }
}
</script>

<style lang="scss" scoped>
@import "~assets/css/theme/_theme";
.feature-image {
  width: 100%;
  padding-top: 3.75rem;
  padding-bottom: 3.75rem;
  min-height: 500px;
  border-radius: $default-card-box-border-radius;

  .asset-img {
    max-width: 90%;
    max-height: 380px;
  }
}

.os-icon {
  height: 64px;
  width: 64px;
}

.feature-info {
  &.mobile {
    min-height: auto;
  }

  border: 1px solid #f3f4f7;
  border-radius: $default-card-box-border-radius;
}
.action {
  .option-icon {
    margin-top: -3px;
    margin-right: 4px;
  }
}
.details-section {
  &--dropdown {
    border: 1px solid light-color("500");
    border-radius: 6px;
    margin-bottom: 20px;

    .header-wrapper {
      background-color: light-color("500");
    }
  }
}
.right-arrow {
  width: 24px;
  height: 24px;
  .svg-sprite-icon {
    width: 10px;
    height: 14px;
    fill: rgba(dark-color("700"), 0.4);
  }
  &.down-icon {
    .svg-sprite-icon {
      transform: rotate(90deg);
    }
  }
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

.text-gray-300 {
  color: dark-color("300");
}

.properties {
  .properties-pill {
    background: primary-color("100");
    border: 1px solid primary-color("300");
    border-radius: 8px;
  }
  .property-title {
    @include font-setting("body-medium", "700");
    font-weight: 600;
  }
  .property-detail {
    @include font-setting("body-large", "500");
    color: dark-color("500");
  }
}

@media (max-width: 768px) {
  .feature-image {
    min-height: auto;
  }
}
</style>
