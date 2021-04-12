<template>
  <div class="col-md-12 d-flex ps-x-0 ms-y-8">
    <div class="d-flex align-self-center bidder-wrapper ps-y-24">
      <svg-sprite-icon
        name="profile"
        class="profile-logo align-self-center"
      ></svg-sprite-icon>
      <div
        class="d-flex message flex-column align-self-center ps-x-16 ps-l-md-0 ps-r-md-16"
      >
        <div class="font-body-small">
          Bid by
          <a
            class="account-name"
            href
            @click.prevent
            :title="bid.users.address"
            >{{ shortChecksumAddress }}</a
          >
        </div>
        <div class="font-caption text-gray-300">
          {{ remainingTimeinWords }} ago
        </div>
      </div>
      <div class="d-flex ml-auto ms-r-16 ps-t-16 ps-t-sm-0">
        <div class="ps-y-12 ps-x-16">
          <span
            class="ps-y-8 ps-x-16 font-body-small font-medium price-pill text-nowrap"
            >{{ bid.price }} {{ bid.erc20Token.symbol }}</span
          >
        </div>

        <button
          class="btn btn-light btn-deny align-self-center ms-r-12 ps-x-16"
          v-if="isUsersBid && this.bid.order.status === 0"
          @click="onCancel()"
        >
          Cancel
        </button>

        <button
          class="btn btn-light btn-deny align-self-center ms-r-12 ps-x-16"
          v-if="isOwnersToken && this.bid.order.status === 0"
          @click="onDeny()"
        >
          Deny
        </button>
        <button
          v-if="isOwnersToken && this.bid.order.status === 0"
          class="btn btn-light align-self-center ps-x-16"
          @click="onAccept()"
        >
          Accept
        </button>
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
import Web3 from "web3";

import app from "~/plugins/app";
import getAxios from "~/plugins/axios";

import BidConfirmation from "~/components/lego/modals/bid-confirmation";
import { txShowError } from "~/plugins/helpers/transaction-utils";

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
      required: true,
    },
  },
  components: { BidConfirmation },
  computed: {
    ...mapGetters("account", ["account"]),
    ...mapGetters("auth", ["user"]),
    ...mapGetters("network", ["networks", "networkMeta"]),
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

    return false;
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

  get isErc1155() {
    return this.order.token_type === "ERC1155";
  }

  get isErc721() {
    return this.order.token_type === "ERC721";
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
    return wordings || "1 second";
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
    this.showCancelBid = true;
  }
  onCancelClose() {
    this.showCancelBid = false;
  }

  async acceptBid() {
    // Exchange the nft with this user
    this.$logger.track("accept-bid-start:bid-options");
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

        let takerAssetAmount = null;
        if (this.isErc1155) {
          takerAssetAmount = new BigNumber(this.order.quantity);
        } else {
          takerAssetAmount = new BigNumber(1);
        }
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

        let tokenContract = null;
        if (this.isErc721) {
          tokenContract = new ERC721TokenContract(
            nftContract,
            providerEngine()
          );

          // Owner of current token
          const owner = await tokenContract
            .ownerOf(new BigNumber(nftTokenId))
            .callAsync();
          const isOwnerOfToken =
            owner.toLowerCase() === this.account.address.toLowerCase();
          if (!isOwnerOfToken) {
            txShowError(
              null,
              "You are no owner of this token",
              "You are no longer owner of this token, refresh to update the data"
            );
            this.isLoading = false;
            this.onAcceptClose();
            return;
          }
        } else {
          let matic = new Web3(this.networks.matic.rpc);
          tokenContract = new matic.eth.Contract(
            this.networkMeta.abi("ChildERC1155", "pos"),
            nftContract
          );
        }

        // Check Approve 0x, Approve if not
        this.$logger.track("accept-bid-approve-start:bid-options");
        const isApproved = await this.approve0x(
          tokenContract,
          contractWrappers,
          takerAddress
        );
        if (!isApproved) {
          this.$logger.track("accept-bid-not-approved:bid-options");
          return;
        }

        this.$logger.track("accept-bid-approved:bid-options");
        const [
          { orderStatus, orderHash },
          remainingFillableAmount,
          isValidSignature,
        ] = await contractWrappers.devUtils
          .getOrderRelevantState(signedOrder, signedOrder.signature)
          .callAsync();

        this.$logger.track("accept-bid-order-validation:bid-options", {
          orderStatus,
          remainingFillableAmount,
          isValidSignature,
        });
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
          this.$logger.track("accept-bid-fill-order:bid-options");
          let dataVal = await getAxios().get(
            `orders/exchangedata/encodedbid?bidId=${this.bid.id}&functionName=fillOrder`
          );
          this.$logger.track("accept-bid-fill-order-complete:bid-options");
          let zrx = {
            salt: generatePseudoRandomSalt(),
            expirationTimeSeconds: signedOrder.expirationTimeSeconds,
            gasPrice: app.uiconfig.TX_DEFAULTS.gasPrice,
            signerAddress: takerAddress,
            data: dataVal.data.data,
            domain: {
              name: "0x Protocol",
              version: "3.0.0",
              chainId: this.networks.matic.chainId,
              verifyingContract: contractWrappers.contractAddresses.exchange,
            },
          };
          this.$logger.track("accept-metamask-sign-start:bid-options");
          const takerSign = await signatureUtils.ecSignTransactionAsync(
            providerEngine(),
            zrx,
            takerAddress
          );
          this.$logger.track("accept-metamask-sign-complete:bid-options");
          if (takerSign) {
            this.$logger.track("handle-bid-accept-sign:bid-options");
            await this.handleBidAccept(takerSign);
            this.$logger.track("bid-accept-sign-completed:bid-options");
          }
        }
      } catch (error) {
        // throw error;
        console.error(error);
        txShowError(error, null, "Something went wrong");
      }
    }
    this.isLoading = false;
    this.onAcceptClose();
  }

  async handleBidAccept(takerSign) {
    if (this.bid.users.id != this.user.id && takerSign) {
      try {
        let data = {
          taker_signature: JSON.stringify(takerSign),
        };
        let response = await getAxios().patch(
          `orders/${this.bid.id}/execute`,
          data
        );
        if (response.status === 200) {
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
      this.$store.dispatch("category/fetchCategories");
    }
  }

  async approve0x(tokenContract, contractWrappers, makerAddress) {
    try {
      // Check if token is approved to 0x
      let isApprovedForAll;
      const nftContract = this.order.categories.categoriesaddresses[0].address;
      if (this.isErc721) {
        isApprovedForAll = await tokenContract
          .isApprovedForAll(
            makerAddress,
            contractWrappers.contractAddresses.erc721Proxy
          )
          .callAsync();
      } else {
        isApprovedForAll = await tokenContract.methods
          .isApprovedForAll(
            makerAddress,
            contractWrappers.contractAddresses.erc1155Proxy
          )
          .call();
      }
      console.log("Approving 1", isApprovedForAll);
      if (!isApprovedForAll) {
        if (this.isErc721) {
          console.log("Approving 2", {
            isApprovedForAll,
            tokenContract: tokenContract,
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
              gas: 100000,
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
          txShowError(
            error,
            "Failed to approve",
            "You need to approve the transaction to sale the NFT"
          );
        } else {
          let maticWeb3 = new Web3(window.ethereum);
          let contract = new maticWeb3.eth.Contract(
            this.networkMeta.abi("ChildERC1155", "pos"),
            nftContract
          );

          console.log("Approving 2", {
            isApprovedForAll,
            tokenContract: contract,
            erc1155Proxy: contractWrappers.contractAddresses.erc1155Proxy,
            makerAddress: makerAddress,
          });

          const makerERC1155ApprovalTxHash = await cont
            .setApprovalForAll(
              contractWrappers.contractAddresses.erc1155Proxy,
              true
            )
            .send({
              from: makerAddress,
              gas: 100000,
              gasPrice: 1000000000,
            });
          console.log("Approving 2");
          if (makerERC1155ApprovalTxHash) {
            console.log("Approve Hash", makerERC1155ApprovalTxHash);
            app.addToast("Approved", "You successfully approved", {
              type: "success",
            });
            return true;
          }
          txShowError(
            error,
            "Failed to approve",
            "You need to approve the transaction to sale the NFT"
          );
        }
      }
      return true;
    } catch (error) {
      throw error;
      return false;
    }
  }

  async denyBid() {
    this.$logger.track("deny-bid-start:bid-options");
    if (this.bid.order.taker_address == this.user.id) {
      try {
        let response = await getAxios().patch(
          `orders/bid/${this.bid.id}/cancel`
        );
        if (response.status === 200) {
          this.$logger.track("deny-bid-success:bid-options");
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
        txShowError(error, null, "Something went wrong");
      }
    }
  }

  async cancelBid() {
    this.isLoading = true;
    this.$logger.track("cancel-bid-start:bid-options");
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
        this.$logger.track("cancel-bid-api-cancel-order:bid-options");
        let dataVal = await getAxios().get(
          `orders/exchangedata/encodedbid?bidId=${this.bid.id}&functionName=cancelOrder`
        );
        this.$logger.track("cancel-bid-api-cancel-order-completed:bid-options");
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
        this.$logger.track("cancel-bid-metamask-start:bid-options");
        const takerSign = await signatureUtils.ecSignTransactionAsync(
          providerEngine(),
          zrx,
          signedOrder.makerAddress
        );
        this.$logger.track("cancel-bid-metamask-complete:bid-options");
        if (takerSign) {
          this.$logger.track("handle-cancel-bid-start-taker-sign:bid-options");
          await this.handleCancelBid(takerSign);
          this.$logger.track(
            "handle-cancel-bid-completed-taker-sign:bid-options"
          );
        }
      } else {
        this.$logger.track("handle-cancel-bid-start:bid-options");
        await this.handleCancelBid();
        this.$logger.track("handle-cancel-bid-completed:bid-options");
      }
    } catch (error) {
      console.log(error);
    }
    this.isLoading = false;
    this.onCancelClose();
  }
  async handleCancelBid(takerSign) {
    if (this.bid.users.id == this.user.id && takerSign) {
      try {
        let data = {
          taker_signature: JSON.stringify(takerSign),
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
        txShowError(error, null, "Something went wrong");
      }
    }
    this.$store.dispatch("category/fetchCategories");
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
