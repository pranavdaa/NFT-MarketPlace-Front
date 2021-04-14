<template>
  <div>
    <div class="container-fluid ps-y-16" v-if="order.id && !isLoadingDetails">
      <div class="row ps-y-16 ps-x-md-16">
        <div class="col-md-7 d-flex">
          <token-short-info
            class="align-self-center"
            :order="order"
            :category="category"
            v-if="category"
          />
        </div>
        <!-- Remove if-condition when implementing -->
        <div
          v-if="false"
          class="col-md d-flex justify-content-start ps-t-16 ps-t-md-0 justify-content-md-end"
        >
          <wishlist-button :wishlisted="isFavorite" :onClick="addToWishlist" />
          <a class="btn btn-light align-self-center action ms-l-16">
            <img
              src="~/static/icons/active/share.svg"
              alt="favorited"
              class="icon option-icon active"
            />
            <span>Share</span>
          </a>
        </div>
      </div>
      <div class="row ps-y-16 ps-x-md-16 justify-content-center">
        <div class="col-md-8 h-100">
          <div
            class="feature-image d-flex d-lg-flex justify-content-center mb-4"
            v-bind:style="{ background: bg }"
          >
            <video
              controls
              autoplay
              muted
              loop
              height="500px"
              v-if="isVideoFormat"
            >
              <source
                :src="order.token.img_url"
                type="video/webm"
                @error="handleNotVideo"
              />
              <source
                :src="order.token.img_url"
                type="video/ogg"
                @error="handleNotVideo"
              />
              <source
                :src="order.token.img_url"
                type="video/mp4"
                @error="handleNotVideo"
              />
            </video>
            <img
              v-else
              class="asset-img align-self-center"
              :src="order.token.img_url"
              alt="Kitty"
              @load="onImageLoad"
              @error="imageLoadError"
            />
          </div>
          <div
            class="feature-info mobile d-flex d-lg-none flex-column ps-16 ps-lg-40 ms-y-16"
          >
            <h3 class="font-heading-medium font-semibold">
              About {{ order.token.name }}
              {{ isErc1155 ? `( ${order.quantity} )` : "" }}
            </h3>
            <p
              class="font-body-medium"
              :class="{ 'show-less': showMore, 'show-more': !showMore }"
              v-if="orderDescription && orderDescription.length > 200"
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
                class="font-body-small d-flex ps-t-8 font-medium"
                href="#more-info"
                v-if="!showMore"
                @click.prevent="showMore = true"
                >More info</a
              >
              <a
                class="font-body-small d-flex ps-t-8 font-medium"
                href="#more-info"
                v-if="showMore"
                @click.prevent="showMore = false"
                >Show less</a
              >
            </p>
            <p class="font-body-medium" v-else>
              {{ orderDescription }}
            </p>

            <div class="ms-t-16" v-if="showListedDetails">
              <div class="font-body-small text-gray-300 ps-y-4">Listed for</div>
              <div
                class="font-heading-large font-semibold ps-b-16"
                v-if="erc20Token"
              >
                {{ order.price }} {{ erc20Token.symbol }}
              </div>
              <div
                class="font-body-medium ps-b-20"
                v-if="order.type === app.orderTypes.NEGOTIATION"
              >
                Minimum Price:
                <span class="font-semibold">
                  {{ order.min_price }} {{ erc20Token.symbol }}
                </span>
              </div>
              <div
                class="font-body-medium ps-b-20"
                v-if="
                  order.type === app.orderTypes.NEGOTIATION && order.highest_bid
                "
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
              class="btn btn-primary"
              v-if="!isOwnersToken && order.status === 0"
              :disabled="isUser && !validation['balance']"
              @click="buyOrder()"
            >
              {{ buttonVal }}
            </button>
            <div
              class="font-body-small text-danger text-center ps-t-12"
              v-if="
                isInsufficientBalance &&
                !validation['balance'] &&
                order.status === 0
              "
            >
              You have insufficient balance in your account
            </div>
            <div
              class="font-body-medium font-semibold text-primary text-center cursor-pointer ps-t-16"
              v-if="
                isInsufficientBalance &&
                order.status === 0 &&
                (order.type === app.orderTypes.FIXED || !validation['balance'])
              "
              @click="depositModal = true"
            >
              Add Funds
            </div>
            <button
              class="btn btn-light"
              v-if="isOwnersToken && order.status === 0"
              @click="onCancelOrder()"
            >
              Cancel
            </button>
          </div>
          <div class="details-section">
            <div class="d-flex flex-column details-section--dropdown" v-if="category">
              <div class="header-wrapper cursor-pointer py-4 ps-l-16" @click="showCategoryInfo = !showCategoryInfo">
                <h3 class="font-heading-medium font-semibold category m-0">
                  About {{ category.name }}
                  <a
                    class="ps-l-12"
                    :href="category.url"
                    target="_blank"
                    rel="noopener noreferrer"
                    >Visit Website</a
                  >

                  <span
                    class="float-right right-arrow"
                    :class="{ 'down-icon': showCategoryInfo }"
                    v-if="category.description"
                  >
                    <svg-sprite-icon name="right-arrow" />
                  </span>
                </h3>
              </div>
              <p
                class="font-body-medium ps-t-20 ps-l-16"
                v-if="showCategoryInfo && category.description"
              >
                {{ category.description }}
              </p>
            </div>

            <div class="properties details-section--dropdown" v-if="order.token.attributes_metadata">
              <div class="header-wrapper cursor-pointer py-4 ps-l-16" @click="showProperties = !showProperties">
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
              <div class="d-flex flex-row flex-wrap ps-t-16 ps-l-16" v-if="showProperties">
                <div
                  class="col-md-3 p-0 pr-4 justify-content-between"
                  v-bind:key="`${attribute.trait_type}-${attribute.value}`"
                  v-for="attribute in order.token.attributes_metadata"
                >
                  <div class="d-flex flex-column text-center properties-pill p-3 mb-4">
                    <p class="property-title m-0 p-0 text-truncate">
                      {{ attribute.trait_type | pascal }}
                    </p>
                    <p class="property-detail m-0 pt-1 text-truncate">
                      <template v-if="attribute.trait_type === 'birthday'">
                        {{  attribute.value | date-human }}
                      </template>
                      <template v-else>
                        {{  attribute.value | pascal }}
                      </template>
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div
              class="d-flex flex-column ps-y-16 ps-y-md-32 bids"
              v-if="
                order.type !== app.orderTypes.FIXED &&
                bidsFullList &&
                bidsFullList.length
              "
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
              class="font-body-medium"
              :class="{ 'show-less': showMore, 'show-more': !showMore }"
              v-if="orderDescription && orderDescription.length > 200"
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
                class="font-body-small d-flex ps-t-8 font-medium"
                href="#more-info"
                v-if="!showMore"
                @click.prevent="showMore = true"
                >More info</a
              >
              <a
                class="font-body-small d-flex ps-t-8 font-medium"
                href="#more-info"
                v-if="showMore"
                @click.prevent="showMore = false"
                >Show less</a
              >
            </p>
            <p class="font-body-medium" v-else>
              {{ orderDescription }}
            </p>

            <div class="mt-auto" v-if="showListedDetails">
              <div class="font-body-small text-gray-300 ps-y-4">Listed for</div>
              <div
                class="font-heading-large font-semibold ps-b-20"
                v-if="erc20Token"
              >
                {{ order.price }} {{ erc20Token.symbol }}
              </div>
              <div
                class="font-body-medium ps-b-20"
                v-if="order.type === app.orderTypes.NEGOTIATION"
              >
                Minimum Price:
                <span class="font-semibold">
                  {{ order.min_price }} {{ erc20Token.symbol }}
                </span>
              </div>
              <div
                class="font-body-medium ps-b-20"
                v-if="
                  order.type === app.orderTypes.NEGOTIATION && order.highest_bid
                "
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
              class="btn btn-primary"
              v-if="!isOwnersToken && order.status === 0"
              :disabled="isUser && !validation['balance']"
              @click="buyOrder()"
            >
              {{ buttonVal }}
            </button>
            <div
              class="font-body-small text-danger text-center ps-t-12"
              v-if="
                isInsufficientBalance &&
                !validation['balance'] &&
                order.status === 0
              "
            >
              You have insufficient balance in your account
            </div>
            <div
              class="font-body-medium font-semibold text-primary text-center cursor-pointer ps-t-16"
              v-if="
                isInsufficientBalance &&
                order.status === 0 &&
                (order.type === app.orderTypes.FIXED || !validation['balance'])
              "
              @click="depositModal = true"
            >
              Add Funds
            </div>
            <button
              class="btn btn-light"
              v-if="isOwnersToken && order.status === 0"
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
      ></deposit-weth>
      <buy-token
        :show="showBuyToken"
        :order="order"
        :category="category"
        :refreshBids="refreshBids"
        :close="onBuyTokenClose"
        v-if="showBuyToken && order"
      />
      <cancel-confirm
        :show="showCancelConfirm"
        :order="order"
        :category="category"
        :isLoading="isLoading"
        :accept="cancelOrder"
        :close="onCancelOrderClose"
        v-if="showCancelConfirm"
      />
    </div>

    <div class="row ps-x-16 ps-y-120 d-flex justify-content-center text-center">
      <button-loader
        class="mx-auto"
        :loading="isLoadingDetails"
        :loadingText="$t('loading')"
        :text="$t('loadMore')"
        block
        lg
        color="light"
        v-if="isLoadingDetails"
      ></button-loader>
    </div>
  </div>
</template>

<script>
import Vue from "vue";
import Component from "nuxt-class-component";
import getAxios from "~/plugins/axios";
import app from "~/plugins/app";
import { mapGetters } from "vuex";

import OrderModel from "~/components/model/order";
import BidModel from "~/components/model/bid";

import TokenShortInfo from "~/components/lego/token/token-short-info";
import WishlistButton from "~/components/lego/wishlist-button";
import BidderRow from "~/components/lego/bidder-row";
import BuyToken from "~/components/lego/modals/buy-token";
import CancelConfirm from "~/components/lego/modals/cancel-confirm";
import DepositWeth from "~/components/lego/modals/deposit-weth";
import { txShowError } from "~/plugins/helpers/transaction-utils";

import rgbToHsl from "~/plugins/helpers/color-algorithm";
import ColorThief from "color-thief";
const colorThief = new ColorThief();

// 0X
let {
  ContractWrappers,
  ERC20TokenContract,
  OrderStatus,
} = require("@0x/contract-wrappers");
let { generatePseudoRandomSalt, signatureUtils } = require("@0x/order-utils");
let { BigNumber } = require("@0x/utils");
let { Web3Wrapper } = require("@0x/web3-wrapper");
import {
  getRandomFutureDateInSeconds,
  calculateProtocolFee,
} from "~/plugins/helpers/0x-utils";

import { providerEngine } from "~/plugins/helpers/provider-engine";

const ZERO = BigNumber(0);
const TEN = BigNumber(10);

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
    ...mapGetters("category", ["categories"]),
    ...mapGetters("token", ["erc20Tokens"]),
    ...mapGetters("account", ["account", "favouriteOrders"]),
    ...mapGetters("auth", ["user"]),
    ...mapGetters("network", ["networks"]),
  },
  middleware: [],
  mixins: [],
  data() {
    return {
      depositModal: false,
    };
  },

  methods: {
    closeDepositModal() {
      this.depositModal = false;
    },
  },
})
export default class TokenDetail extends Vue {
  bg = "#ffffff";
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
  isVideoFormat = true;

  order = {};

  // initialize
  async mounted() {
    await this.fetchOrder();
  }

  onImageLoad() {
    try {
      const img = this.$el.querySelector(".asset-img");
      // img.crossOrigin = "Anonymous";

      let rgbColor = colorThief.getColor(img);
      if (rgbColor) {
        let hsl = rgbToHsl({
          r: rgbColor[0],
          g: rgbColor[1],
          b: rgbColor[2],
        });
        this.bg = `hsl(${hsl.h},${hsl.s}%,${hsl.l}%)`;
      } else this.bg = "#ffffff";
    } catch (error) {}
  }

  // Get
  get orderDescription() {
    return this.order.token.description;
  }

  get category() {
    return this.categories.filter(
      (item) => item.id === this.order.categories_id
    )[0];
  }

  get isErc1155() {
    return this.order.token_type === "ERC1155";
  }

  get isErc721() {
    return this.order.token_type === "ERC721";
  }

  get app() {
    return app;
  }

  get isUser() {
    return this.user;
  }

  get isInsufficientBalance() {
    return this.user && !this.isOwnersToken;
  }

  get erc20Token() {
    return this.erc20Tokens.filter(
      (token) => token.id === this.order.erc20tokens_id
    )[0];
  }

  get isFavorite() {
    if (this.user && this.favouriteOrders) {
      const order = this.favouriteOrders.filter(
        (order) => order.order_id === this.order.id
      );
      return order.length !== 0;
    }
    return false;
  }

  get isFavoriteId() {
    if (this.user && this.favouriteOrders) {
      const order = this.favouriteOrders.filter(
        (order) => order.order_id === this.order.id
      );
      return order[0].id;
    }
    return false;
  }

  get isOwnersToken() {
    if (this.user && this.order.type !== app.orderTypes.FIXED) {
      return this.user.id === this.order.taker_address;
    } else if (this.user && this.order.type === app.orderTypes.FIXED) {
      return this.user.id === this.order.maker_address;
    }
    return false;
  }

  get buttonVal() {
    return this.order.type === app.orderTypes.FIXED ? "Buy Now" : "Place a Bid";
  }

  get validation() {
    return {
      balance: this.erc20Token.balance.gte(this.order.min_price),
    };
  }

  get showListedDetails() {
    return !(this.order.status === 3);
  }

  // async
  async fetchOrder() {
    if (!this.tokenId || this.isLoadingDetails) {
      return;
    }
    this.isLoadingDetails = true;
    try {
      let response = await getAxios().get(`orders/${this.tokenId}`);
      if (response.status === 200 && response.data.data) {
        let data = new OrderModel(response.data.data);
        this.order = data;
      } else if (response.status === 202 && response.data.data) {
        let data = new OrderModel(response.data.data);
        let sellerAddress = data.seller_users.address;

        this.order = data;
        if (this.account.address === sellerAddress) {
          // Do nothing
        } else {
          let res = await getAxios().post(`orders/validate`, {
            orderId: this.tokenId,
          });

          if (res.status === 200) {
            txShowError(
              "Order Invalid",
              "Order Invalid",
              "This order is no longer valid or has been sold out. Please try to buy some other NFT."
            );
            this.$router.push({ name: "index" });
          }
        }
      }
    } catch (error) {
      console.log(error);
    }

    this.isLoadingDetails = false;
    if (
      Object.keys(this.order).length !== 0 &&
      this.order.type !== app.orderTypes.FIXED
    ) {
      await this.fetchBidders();
    }
  }

  // actions
  buyOrder() {
    if (this.user) {
      this.showBuyToken = true;
    } else {
      this.$router.push({
        name: "login",
        query: { next: `/tokens/${this.order.id}` },
      });
    }
  }
  onBuyTokenClose() {
    this.showBuyToken = false;
  }

  onCancelOrder() {
    this.showCancelConfirm = true;
  }
  onCancelOrderClose() {
    this.showCancelConfirm = false;
  }

  imageLoadError(event) {
    event.target.src = this.category.img_url;
    event.target.style.width = "100px";
  }

  handleNotVideo() {
    this.isVideoFormat = false;
  }

  async cancelOrder() {
    this.isLoading = true;
    try {
      if (this.order.type === app.orderTypes.FIXED) {
        let signedOrder = JSON.parse(this.order.signature);
        const takerAssetAmount = Web3Wrapper.toBaseUnitAmount(
          new BigNumber(this.order.price),
          this.erc20Token.decimal
        );
        signedOrder["makerAssetAmount"] = BigNumber(
          signedOrder.makerAssetAmount
        );
        signedOrder["takerAssetAmount"] = takerAssetAmount;
        signedOrder["expirationTimeSeconds"] = BigNumber(
          signedOrder.expirationTimeSeconds
        );
        signedOrder["makerFee"] = BigNumber(signedOrder.makerFee);
        signedOrder["salt"] = BigNumber(signedOrder.salt);
        signedOrder["takerFee"] = BigNumber(signedOrder.takerFee);

        const chainId = this.networks.matic.chainId;
        const contractWrappers = new ContractWrappers(providerEngine(), {
          chainId: chainId,
        });

        let dataVal = await getAxios().get(
          `orders/exchangedata/encoded?orderId=${this.order.id}&functionName=cancelOrder`
        );

        let zrx = {
          salt: generatePseudoRandomSalt(),
          expirationTimeSeconds: signedOrder.expirationTimeSeconds,
          gasPrice: app.uiconfig.TX_DEFAULTS.gasPrice,
          signerAddress: signedOrder.makerAddress,
          data: dataVal.data.data,
          domain: {
            name: "0x Protocol",
            version: "3.0.0",
            chainId: this.networks.matic.chainId,
            verifyingContract: contractWrappers.contractAddresses.exchange,
          },
        };

        const takerSign = await signatureUtils.ecSignTransactionAsync(
          providerEngine(),
          zrx,
          signedOrder.makerAddress
        );

        if (takerSign) {
          await this.handleCancelOrder(takerSign);
        }
      } else {
        await this.handleCancelOrder();
      }
    } catch (error) {
      console.log(error);
    }
    this.isLoading = false;
    this.onCancelOrderClose();
  }
  async handleCancelOrder(takerSign = null) {
    let data = {};
    if (takerSign) {
      data = {
        taker_signature: JSON.stringify(takerSign),
      };
    }
    try {
      let response = await getAxios().patch(
        `orders/${this.order.id}/cancel`,
        data
      );
      if (response.status === 200) {
        this.$router.push({ name: "account" });
        app.addToast("Order canceled", "You canceled the order successfully", {
          type: "success",
        });
      }
    } catch (error) {
      console.error(error);
      txShowError(error, null, "Something went wrong");
    }
  }

  async addToWishlist() {
    // Add current order to users wishlist if not wishlisted or if it is then remove it
    try {
      if (this.isFavorite) {
        const response = await getAxios().delete(
          `users/favourites/${this.isFavoriteId}`
        );
      } else {
        const response = await getAxios().post("users/favourites", {
          orderId: this.order.id,
        });
      }
      this.$store.dispatch("account/fetchFavoritesOrders");
    } catch (error) {
      if (error.response.status === 401) {
        app.addToast(
          "Signin to add to favourites",
          "You need to login to add token to wishlist",
          {
            type: "info",
          }
        );
      }
    }
  }

  async refreshBids() {
    await this.fetchBidders();
    await this.fetchOrder();
  }

  async fetchBidders() {
    if (this.isLoadingBids || this.order.type === app.orderTypes.FIXED) {
      return;
    }
    try {
      let response;
      response = await getAxios().get(`orders/bids/${this.order.id}`);
      if (response.status === 200 && response.data.data.order) {
        let bids = [];
        response.data.data.order.forEach(function (bid) {
          bid.erc20Token = this.erc20Token;
          bid.order = this.order;
          if (bid.status === 0) {
            // if bid is active
            bids.push(new BidModel(bid));
          }
        }, this);
        this.hasNextPage = response.data.data.has_next_page;
        this.bidsFullList = bids;
      }
    } catch (error) {
      console.log(error);
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
