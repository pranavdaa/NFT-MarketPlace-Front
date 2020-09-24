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
        <div class="font-caption text-gray-300">{{remainingTimeinWords}} ago</div>
      </div>
      <div class="d-flex ml-auto ms-r-16 ps-t-16 ps-t-sm-0">
        <div class="ps-y-12 ps-x-16">
          <span
            class="ps-y-8 ps-x-16 font-body-small font-medium price-pill text-nowrap"
          >{{bid.price}} {{bid.erc20Token.symbol}}</span>
        </div>

        <button
          class="btn btn-light btn-deny align-self-center ms-r-12 ps-x-16"
          v-if="isUsersBid && this.bid.order.status === 0"
          @click="onCancel()"
        >Cancel</button>

        <button
          class="btn btn-light btn-deny align-self-center ms-r-12 ps-x-16"
          v-if="isOwnersToken && this.bid.order.status === 0"
          @click="onDeny()"
        >Deny</button>
        <button
          v-if="isOwnersToken && this.bid.order.status === 0"
          class="btn btn-light align-self-center ps-x-16"
          @click="onAccept()"
        >Accept</button>
      </div>
    </div>

    <bid-confirmation
      :show="showAcceptBid"
      :bid="bid"
      :isLoading="isLoading"
      :accept="acceptBid"
      :close="onAcceptClose"
    />
    <bid-confirmation
      :show="showDenyBid"
      :bid="bid"
      :isLoading="isLoading"
      :accept="denyBid"
      :close="onDenyClose"
      :btnTexts="denyButtonTexts"
    />
    <bid-confirmation
      :show="showCancelBid"
      :bid="bid"
      :isLoading="isLoading"
      :accept="cancelBid"
      :close="onCancelClose"
      :btnTexts="cancelButtonTexts"
    />
  </div>
</template>

<script>
import Vue from "vue";
import Component from "nuxt-class-component";
import { mapGetters } from "vuex";
import BidModel from "~/components/model/bid";
import { toChecksumAddress } from "ethereumjs-util";
import moment from "moment";

import app from "~/plugins/app";
import getAxios from "~/plugins/axios";

import BidConfirmation from "~/components/lego/modals/bid-confirmation";

// 0X
let {
  ContractWrappers,
  ERC20TokenContract,
  ERC721TokenContract,
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
    bid: {
      type: BidModel,
      required: true,
    },
    refreshBids: {
      type: Function,
      required: false,
      default: () => {},
    },
    isOwnersToken: {
      type: Boolean,
      required: true
    }
  },
  components: { BidConfirmation },
  computed: {
    ...mapGetters("account", ["account"]),
    ...mapGetters("auth", ["user"]),
    ...mapGetters("network", ["networks"]),
  },
})
export default class BidderRow extends Vue {
  showAcceptBid = false;
  showDenyBid = false;
  showCancelBid = false;
  isLoading = false;
  denyButtonTexts = { title: "Deny", loadingTitle: "Denying..." };
  cancelButtonTexts = { title: "Cancel", loadingTitle: "Cancelling..." };
  mounted() {}

  // Get
  get isUsersBid() {
    if (this.user && this.bid) {
      return this.user.id === this.bid.users.id;
    }

    return false
  }

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

  get timeRemaining() {
    const expiry = moment(this.bid.updated);
    const current = moment();
    const diff = moment.duration(expiry.diff(current));

    return {
      days: Math.abs(diff.days()),
      hours: Math.abs(diff.hours()),
      mins: Math.abs(diff.minutes()),
      secs: Math.abs(diff.seconds()),
    };
  }

  get remainingTimeinWords() {
    let wordings = "";
    if (this.timeRemaining) {
      if (this.timeRemaining.days > 0) {
        wordings = `${this.timeRemaining.days} days`;
      } else if (this.timeRemaining.hours > 0) {
        wordings = `${this.timeRemaining.hours} hours`;
      } else if (this.timeRemaining.mins > 0) {
        wordings = `${this.timeRemaining.mins} mins`;
      } else if (this.timeRemaining.secs > 0) {
        wordings = `${this.timeRemaining.secs} seconds`;
      }
    }
    return wordings;
  }

  // Actions
  onAccept() {
    this.showAcceptBid = true;
  }
  onAcceptClose() {
    this.showAcceptBid = false;
  }
  onDeny() {
    this.showDenyBid = true;
  }
  onDenyClose() {
    this.showDenyBid = false;
  }
  onCancel() {
    this.showCancelBid = true
  }
  onCancelClose() {
    this.showCancelBid = false
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
        const contractWrappers = new ContractWrappers(providerEngine(), {
          chainId: signedOrder.chainId,
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

        // ERC721 contract
        const erc721TokenCont = new ERC721TokenContract(
          nftContract,
          providerEngine()
        );

        // Owner of current token
        const owner = await erc721TokenCont
          .ownerOf(new BigNumber(nftTokenId))
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
          this.onAcceptClose();
          return;
        }

        // Check Approve 0x, Approve if not
        const isApproved = await this.approve0x(
          erc721TokenCont,
          contractWrappers,
          takerAddress
        );
        if (!isApproved) {
          return;
        }

        const [
          { orderStatus, orderHash },
          remainingFillableAmount,
          isValidSignature,
        ] = await contractWrappers.devUtils
          .getOrderRelevantState(signedOrder, signedOrder.signature)
          .callAsync();

        console.log("is fillable", {
          orderStatus,
          orderHash,
          remainingFillableAmount,
          isValidSignature,
          fill: OrderStatus.Fillable,
        });

        if (
          orderStatus === OrderStatus.Fillable &&
          remainingFillableAmount.isGreaterThan(0) &&
          isValidSignature
        ) {
          console.log("Fillable");

          let dataVal = await getAxios().get(`orders/exchangedata/encodedbid?bidId=${this.bid.id}&functionName=fillOrder`)

          let zrx = {
            salt: generatePseudoRandomSalt(),
            expirationTimeSeconds: signedOrder.expirationTimeSeconds,
            gasPrice: 10000000000,
            signerAddress: takerAddress,
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
            takerAddress
          );

          if(takerSign) {
            await this.handleBidAccept(takerSign);
          }
        }
      } catch (error) {
        throw error;
        console.error(error);
        app.addToast("Something went wrong", error.message.substring(0, 60), {
          type: "failure",
        });
      }
    }
    this.isLoading = false;
    this.onAcceptClose();
  }

  async handleBidAccept(takerSign) {
    if (this.bid.users.id != this.user.id && takerSign) {
      try {
        let data = {
          taker_signature: JSON.stringify(takerSign)
        };
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
              type: "success",
            }
          );
          this.$router.push({ name: "account" });
        }
      } catch (error) {}
    }
  }

  async approve0x(erc721TokenCont, contractWrappers, makerAddress) {
    try {
      // Check if token is approved to 0x
      const isApprovedForAll = await erc721TokenCont
        .isApprovedForAll(
          makerAddress,
          contractWrappers.contractAddresses.erc721Proxy
        )
        .callAsync();
      console.log("Approving 1", isApprovedForAll);
      if (!isApprovedForAll) {
        console.log("Approving 2", {
          isApprovedForAll,
          erc721TokenCont: erc721TokenCont,
          erc721Proxy: contractWrappers.contractAddresses.erc721Proxy,
          makerAddress: makerAddress,
        });
        const makerERC721ApprovalTxHash = await erc721TokenCont
          .setApprovalForAll(
            contractWrappers.contractAddresses.erc721Proxy,
            true
          )
          .sendTransactionAsync({
            from: makerAddress,
            gas: 8000000,
            gasPrice: 1000000000,
          });
        console.log("Approving 2");
        if (makerERC721ApprovalTxHash) {
          console.log("Approve Hash", makerERC721ApprovalTxHash);
          app.addToast("Approved", "You successfully approved", {
            type: "success",
          });
          return true;
        }
        app.addToast(
          "Failed to approve",
          "You need to approve the transaction to sale the NFT",
          {
            type: "failure",
          }
        );
      }
      return true;
    } catch (error) {
      throw error;
      return false;
    }
  }

  async denyBid() {
    if (this.bid.order.taker_address == this.user.id) {
      try {
        let response = await getAxios().patch(
          `orders/bid/${this.bid.id}/cancel`
        );
        if (response.status === 200) {
          app.addToast(
            "Bid declined successfully",
            "You declined bid successfully",
            {
              type: "success",
            }
          );
          this.refreshBids();
        }
      } catch (error) {
        console.error(error);
        app.addToast("Something went wrong", error.message.substring(0, 60), {
          type: "failure",
        });
      }
    }
  }

  async cancelBid() {
    this.isLoading = true;
    try {
      if (this.order.type === app.orderTypes.NEGOTIATION) {
        let signedOrder = JSON.parse(this.bid.signature);
        const takerAssetAmount = Web3Wrapper.toBaseUnitAmount(
          new BigNumber(this.bid.price),
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

        let dataVal = await getAxios().get(`orders/exchangedata/encodedbid?bidId=${this.bid.id}&functionName=cancelOrder`)

        let zrx = {
          salt: generatePseudoRandomSalt(),
          expirationTimeSeconds: signedOrder.expirationTimeSeconds,
          gasPrice: 10000000000,
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

        if(takerSign) {
          await this.handleCancelBid(takerSign);
        }
      } else {
        await this.handleCancelBid();
      }
    } catch(error) {
      console.log(error);
    }
    this.isLoading = false;
    this.onCancelClose();
  }
  async handleCancelBid(takerSign) {
    if (this.bid.users.id == this.user.id && takerSign) {
      try {
        let data = {
          taker_signature: JSON.stringify(takerSign)
        };
        let response = await getAxios().patch(
          `orders/bid/${this.bid.id}/cancel`,
          data
        );
        if (response.status === 200) {
          app.addToast(
            "Bid cancelled successfully",
            "You cancelled your bid successfully",
            {
              type: "success",
            }
          );
          this.refreshBids();
        }
      } catch (error) {
        console.error(error);
        app.addToast("Something went wrong", error.message.substring(0, 60), {
          type: "failure",
        });
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
