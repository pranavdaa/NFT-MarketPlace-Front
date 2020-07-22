<template>
  <div class="col-md-12 d-flex ps-x-0 ms-y-8">
    <div class="d-flex align-self-center bidder-wrapper ps-y-24">
      <svg-sprite-icon name="profile" class="profile-logo align-self-center"></svg-sprite-icon>
      <div class="d-flex message flex-column align-self-center ps-x-16 ps-l-md-0 ps-r-md-16">
        <div class="font-body-small">
          Bid by
          <a
            class="account-name"
            href
            @click.prevent
            :title="bid.users.address"
          >{{shortChecksumAddress}}</a>
        </div>
        <div class="font-caption text-gray-300">2 days ago</div>
      </div>
      <div class="d-flex ml-auto ms-r-16 ps-t-16 ps-t-sm-0">
        <div class="ps-y-12 ps-x-16">
          <span
            class="ps-y-8 ps-x-16 font-body-small font-medium price-pill text-nowrap"
          >{{bid.price}} {{bid.erc20Token.symbol}}</span>
        </div>
        <button
          class="btn btn-light btn-deny align-self-center ms-r-12 ps-x-16"
          @click="onDeny()"
          v-if="showAction"
        >Deny</button>
        <button
          class="btn btn-light align-self-center ps-x-16"
          @click="onAccept()"
          v-if="showAction"
        >Accept</button>
      </div>
    </div>

    <accept-bid
      :show="showAcceptBid"
      :bid="bid"
      :isLoading="isLoading"
      :accept="acceptBid"
      :close="onAcceptClose"
    />
  </div>
</template>

<script>
import Vue from "vue";
import Component from "nuxt-class-component";
import { mapGetters } from "vuex";
import BidModel from "~/components/model/bid";
import { toChecksumAddress } from "ethereumjs-util";
import app from "~/plugins/app";

import getAxios from "~/plugins/axios";

import AcceptBid from "~/components/lego/modals/accept-bid";

// 0X
let {
  ContractWrappers,
  ERC20TokenContract,
  OrderStatus
} = require("@0x/contract-wrappers");
let { generatePseudoRandomSalt, signatureUtils } = require("@0x/order-utils");
let { BigNumber } = require("@0x/utils");
let { Web3Wrapper } = require("@0x/web3-wrapper");
import {
  getRandomFutureDateInSeconds,
  calculateProtocolFee
} from "~/plugins/helpers/0x-utils";

import { providerEngine } from "~/plugins/helpers/provider-engine";

const ZERO = BigNumber(0);
const TEN = BigNumber(10);

@Component({
  props: {
    bid: {
      type: BidModel,
      required: true
    },
    refreshBids: {
      type: Function,
      required: false,
      default: () => {}
    }
  },
  components: { AcceptBid },
  computed: {
    ...mapGetters("account", ["account"]),
    ...mapGetters("auth", ["user"]),
    ...mapGetters("network", ["networks"])
  }
})
export default class BidderRow extends Vue {
  showAcceptBid = false;
  isLoading = false;
  mounted() {}

  // Get
  get shortChecksumAddress() {
    if (!this.bid.users.address) {
      return null;
    }
    const a = toChecksumAddress(this.bid.users.address);
    return `${a.slice(0, 6)}...${a.slice(38, 42)}`;
  }

  get order() {
    return this.bid.order;
  }

  get erc20Token() {
    return this.bid.erc20Token;
  }

  get showAction() {
    if (this.order.type === app.orderTypes.AUCTION) {
      return true;
    }
  }

  // Actions
  onAccept() {
    this.showAcceptBid = true;
  }
  onAcceptClose() {
    this.showAcceptBid = false;
  }

  async acceptBid() {
    // Exchange the nft with this user
    this.isLoading = true;
    if (this.order.taker_address == this.user.id) {
      try {
        const chainId = this.networks.matic.chainId;
        const nftContract = this.order.categories.categoriesaddresses[0]
          .address;
        const nftTokenId = this.order.tokens_id;
        const erc20Address = this.order.erc20tokens.erc20tokensaddresses[0]
          .address;

        const makerAddress = this.bid.users.address;
        const takerAddress = this.account.address;

        const takerAssetAmount = new BigNumber(1);
        // const makerAssetAmount = Web3Wrapper.toBaseUnitAmount(
        //   new BigNumber(this.bid.price),
        //   this.order.erc20tokens.decimal
        // );
        let signedOrder = JSON.parse(this.bid.signature);
        console.log(signedOrder);
        const contractWrappers = new ContractWrappers(providerEngine(), {
          chainId: signedOrder.chainId
        });

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
        console.log(signedOrder);

        const [
          { orderStatus, orderHash },
          remainingFillableAmount,
          isValidSignature
        ] = await contractWrappers.devUtils
          .getOrderRelevantState(signedOrder, signedOrder.signature)
          .callAsync();
        console.log("is fillable", {
          orderStatus,
          orderHash,
          remainingFillableAmount,
          isValidSignature,
          fill: OrderStatus.Fillable
        });

        let txHash;
        // is user is owner then do accept the bid
        txHash = await contractWrappers.exchange
          .fillOrder(signedOrder, takerAssetAmount, signedOrder.signature)
          .awaitTransactionSuccessAsync({
            from: takerAddress,
            gas: 8000000,
            gasPrice: 10000000000,
            value: calculateProtocolFee([signedOrder])
          });
        if (txHash) {
          console.log(txHash);
          const data = {
            maker_amount: this.bid.price,
            tx_hash: txHash.transactionHash
          };
          // On success
          let response = await getAxios().patch(
            `orders/${this.bid.id}/execute`,
            data
          );
          if (response.status === 200) {
            this.refreshBids();
            app.addToast(
              "Accepted successfully",
              "You accepted the bid for your order",
              {
                type: "success"
              }
            );
          }
        }
      } catch (error) {
        console.log(error);
        app.addToast(
          "Failed to accept",
          "Something went wrong while accepting bid",
          {
            type: "failure"
          }
        );
      }
    }
    this.isLoading = false;
    this.onAcceptClose();
  }

  async approve0x(erc721TokenCont, contractWrappers, makerAddress) {
    // Check if token is approved to 0x
    const isApprovedForAll = await erc721TokenCont
      .isApprovedForAll(
        makerAddress,
        contractWrappers.contractAddresses.erc721Proxy
      )
      .callAsync();

    if (!isApprovedForAll) {
      const makerERC721ApprovalTxHash = await erc721TokenCont
        .setApprovalForAll(contractWrappers.contractAddresses.erc721Proxy, true)
        .sendTransactionAsync({
          from: makerAddress,
          gas: 8000000,
          gasPrice: 1000000000
        });
      console.log("Approve Hash", makerERC721ApprovalTxHash);
      if (makerERC721ApprovalTxHash) {
        return true;
      }
      return false;
    }
    return true;
  }

  async onDeny() {
    // Deny the users bid
    // check user is owner
    if (this.bid.order.maker_address == this.user.id) {
      try {
        let response = await getAxios().patch(
          `orders/bid/${this.bid.id}/cancel`
        );
        if (response.status === 200) {
          this.refreshBids();
        }
      } catch (error) {
        console.log(error);
      }
    }
  }
}
</script>

<style lang="scss" scoped="true">
@import "~assets/css/theme/_theme";

.bidder-wrapper {
  width: 100%;
  border: 1px solid light-color("500");
  border-radius: $default-card-box-border-radius;
  .img-wrapper {
    display: flex;
    width: 80px;
    min-height: 80px;
    padding: 0.5rem;
    border-radius: $default-card-box-border-radius;
    .asset-img {
      width: 100%;
    }
  }
}
.price-pill {
  background-color: light-color("500");
  border-radius: 18px;
}
.profile-logo {
  width: 32px !important;
  height: 32px !important;
  margin-left: 1rem;
  margin-right: 1rem;
}
.btn {
  height: fit-content !important;
  white-space: nowrap;
}
.btn-deny {
  color: red-color("600");
}
.text-gray-300 {
  color: dark-color("300");
}

@media (max-width: 768px) {
  .img-wrapper {
    width: 70px !important;
    min-height: 70px !important;
  }
}
@media (max-width: 580px) {
  .bidder-wrapper {
    padding-top: 1rem;
    padding-bottom: 1rem;
  }
  .profile-logo {
    display: none !important;
  }
}
@media (max-width: 440px) {
  .bidder-wrapper {
    flex-direction: column;
    .message {
      margin-right: auto;
    }
  }
}
</style>
