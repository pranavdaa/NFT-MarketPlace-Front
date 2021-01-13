<template>
  <div class="section position-absolute">
    <div class="modal-backdrop" v-bind:class="{ show: show }"></div>
    <div class="modal transaction-prog-modal" v-bind:class="{ show: show, 'hide-modal': showApproveModal }">
      <div class="modal-dialog w-sm-100 align-self-center" role="document">
        <div class="box in-process-box">
          <div class="box-body">
            <div class="container-fluid">
              <nav
                class="row tabs nav bottom-border no-border-radius d-flex col-md-12 px-0 mx-0"
              >
                <a
                  class="nav-item col ps-y-24 px-0 text-center nav-link font-body-medium"
                  :class="{ 'active font-medium': activeTab === tab.id }"
                  v-for="tab in tabs"
                  :key="tab.id"
                  @click.prevent="changeTab(tab.id)"
                  >{{ tab.title }}</a
                >
              </nav>
              <div
                class="row ps-x-16 ps-x-md-32 ps-x-lg-40 ps-y-32 bottom-border"
              >
                <div
                  class="col-md-12 px-0 font-heading-small font-semibold ps-b-8"
                >
                  {{ tabs[activeTab].subtitle }}
                </div>
                <div
                  class="col-md-12 px-0 ps-b-16 font-body-small text-gray-500"
                >
                  {{ tabs[activeTab].description }}
                </div>

                <div class="col-md-12 p-0">
                  <input-token
                    :placeholder="'0.00'"
                    :integer="true"
                    :change="changePrice"
                    :disableToken="isLoading"
                    :disabled="isLoading"
                  />
                  <div
                    class="col-md-12 font-body-small ps-t-12 ps-x-8 text-gray-300 ps-x-0"
                  >
                    ~ {{ priceInUSDFormatted }}
                  </div>
                  <div
                    class="w-100 font-caption error-text ps-t-12"
                    v-if="dirty && !validation['price']"
                  >
                    Valid amount required
                  </div>
                </div>
              </div>

              <div
                class="row ps-x-16 ps-x-md-32 ps-x-lg-40 ps-y-32 bottom-border d-flex"
                v-if="activeTab === 0"
              >
                <div class="d-flex align-self-center">
                  <div
                    class="align-self-center font-heading-small font-semibold"
                  >
                    Allow Negotiation?
                  </div>
                  <svg-sprite-icon
                    name="questionmark-black"
                    class="icon ms-l-4"
                  />
                </div>
                <div class="d-flex ml-auto align-self-center">
                  <label class="switch align-self-center">
                    <input type="checkbox" v-model="negotiation" />
                    <span class="slider round"></span>
                  </label>
                </div>
                <transition name="fade">
                  <div class="col-md-12 p-0" v-if="negotiation">
                    <div class="w-100 font-body-small ps-y-12 text-gray-500">
                      Set minimum price
                    </div>
                    <div class="w-100 p-0">
                      <input-token
                        :placeholder="'0.00'"
                        :integer="true"
                        :change="changeMinPrice"
                        :disableToken="true"
                        :disabled="isLoading"
                      />
                      <div
                        class="col-md-12 font-body-small ps-t-12 ps-x-8 text-gray-300 ps-x-0"
                      >
                        ~ {{ minPriceInUSDFormatted }}
                      </div>
                    </div>
                    <div
                      class="w-100 font-caption error-text ps-t-4"
                      v-if="dirty && !validation['minPrice']"
                    >
                      Valid amount is required for minimum price
                    </div>
                  </div>
                </transition>
              </div>
              <div
                class="row ps-x-16 ps-x-md-32 ps-x-lg-40 ps-y-32 bottom-border d-flex"
                v-if="activeTab === 1"
              >
                <div class="d-flex align-self-center">
                  <div
                    class="align-self-center font-heading-small font-semibold"
                  >
                    Set Expiration Date
                  </div>
                  <svg-sprite-icon
                    name="questionmark-black"
                    class="icon ms-l-4"
                  />
                </div>
                <div class="d-flex ml-auto align-self-center">
                  <span
                    class="time-pill font-body-small"
                    :class="{ active: duration === EXPIRY_DURATION.ONE_WEEK }"
                    @click="changeDuration(EXPIRY_DURATION.ONE_WEEK)"
                    >1 week</span
                  >
                  <span
                    class="time-pill font-body-small"
                    :class="{ active: duration === EXPIRY_DURATION.ONE_MONTH }"
                    @click="changeDuration(EXPIRY_DURATION.ONE_MONTH)"
                    >1 month</span
                  >
                  <span
                    class="time-pill font-body-small"
                    :class="{ active: duration === EXPIRY_DURATION.CUSTOM }"
                    @click="changeDuration(EXPIRY_DURATION.CUSTOM)"
                    >Custom</span
                  >
                </div>
                <div class="col-md-12 ps-x-0 ps-t-24">
                  <input
                    class="form-control form-control-inline float-left w-auto ps-y-0"
                    type="date"
                    :min="minimumDate"
                    v-model="auction_date"
                    :change="onAuctionDateTimeChange()"
                    @click="toCustom()"
                  />
                  <input
                    class="form-control form-control-inline float-right w-auto ps-y-0"
                    type="time"
                    v-model="auction_time"
                    :change="onAuctionDateTimeChange()"
                    @click="toCustom()"
                  />
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
                  :loadingText="$t('submittingToMarketplace')"
                  :text="$t('submitToMarketplace')"
                  block
                  lg
                  color="primary"
                  :click="submitToMarketplace"
                ></button-loader>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <approve-process
      :show="showApproveModal"
      :close="closeApproveModal"
      :approveClicked="approveClickedFunc"
      :signClicked="signClickedFunc"
      :isApprovedStatus="isApprovedStatus"
      :approveLoading="approveLoading"
      :isSignedStatus="isSignedStatus"
      :signLoading="signLoading"
      :modalTexts="approvalModalText"
      :networkChangeNeeded="showNetworkChangeNeeded"
    ></approve-process>
  </div>
</template>

<script>
import Vue from "vue";
import Component from "nuxt-class-component";
import { mapGetters } from "vuex";
import { formatUSDValue } from "~/plugins/helpers/index";
import Web3 from "web3";
import moment from "moment";

import app from "~/plugins/app";
import getAxios from "~/plugins/axios";
import BigNumber from "~/plugins/bignumber";

import { FormValidator } from "~/components/mixin";
import InputToken from "~/components/lego/input-token";
import { parseBalance } from "~/plugins/helpers/token-utils";
import ApproveProcess from "~/components/lego/modals/approve-process";

const { getTypedData } = require("~/plugins/meta-tx");

// 0X
let {
  ContractWrappers,
  ERC721TokenContract,
  OrderStatus,
} = require("@0x/contract-wrappers");
let { generatePseudoRandomSalt, signatureUtils } = require("@0x/order-utils");
// let { BigNumber } = require("@0x/utils");
let { Web3Wrapper } = require("@0x/web3-wrapper");
import { getRandomFutureDateInSeconds } from "~/plugins/helpers/0x-utils";

import { providerEngine } from "~/plugins/helpers/provider-engine";

const EXPIRY_DURATION = {
  ONE_WEEK: 0,
  ONE_MONTH: 1,
  CUSTOM: 2,
};

const ZERO = BigNumber(0);
const TEN = BigNumber(10);

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
  components: { InputToken, ApproveProcess },
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
export default class SellToken extends Vue {
  activeTab = 0;
  duration = 0;
  negotiation = false;
  isLoading = false;
  dirty = false;
  error = "";
  expiry_date_time = "";
  auction_time = moment().format("HH:mm");
  auction_date = moment().add(1, "days").format("YYYY-MM-DD");
  minimumDate = this.auction_date;
  showApproveModal = false;
  isApprovedStatus = false;
  isSignedStatus = false;
  approveLoading = false;
  signLoading = false;
  showNetworkChangeNeeded = false;

  approvalModalText = {
    approve: {
      title: 'Approve',
      subText: 'Approve 0x contract to transfer your NFT'
    },
    sign: {
      title: 'Sign sell order',
      subText: 'Sign sell transaction'
    }
  }

  price = 0;
  minPrice = 0;

  tabs = [
    {
      id: 0,
      title: "Fixed Price",
      subtitle: "Set price",
      description:
        "Your asset will be sold at this price. It will be available for sale in marketplace until you cancel it.",
      commission: "",
      btnTitle: "List for Sale",
    },
  ];

  mounted() {
    // initialize duration
    this.changeDuration(this.EXPIRY_DURATION.ONE_WEEK);
  }

  // Handlers
  changeTab(num) {
    this.activeTab = num;
  }

  toCustom() {
    // Set current time to minimum
    if (this.duration !== this.EXPIRY_DURATION.CUSTOM) {
      this.changeDuration(EXPIRY_DURATION.CUSTOM);
    }
  }
  onAuctionDateTimeChange() {
    this.expiry_date_time = moment(`${this.auction_date} ${this.auction_time}`);
    return false;
  }

  changeDuration(num) {
    this.duration = num;
    let date;
    // Change the date and time according
    if (num === this.EXPIRY_DURATION.ONE_WEEK) {
      date = moment().add(7, "days");
    } else if (num === this.EXPIRY_DURATION.ONE_MONTH) {
      date = moment().add(30, "days");
    } else {
      date = moment().add(15, "days");
    }
    this.auction_date = date.format("YYYY-MM-DD");
    this.auction_time = date.format("HH:mm");
  }

  changePrice(value) {
    this.dirty = false;
    this.price = value;
  }
  changeMinPrice(value) {
    this.dirty = false;
    this.minPrice = value;
  }

  closeApproveModal() {
    this.showApproveModal = false;
    this.close();
  }

  convertPriceToUSD(amount) {
    let result =
      parseBalance(amount, this.selectedERC20Token.decimal).toString(10) *
      this.selectedERC20Token.usd;

    return result
  }

  // action
  async approveStatus() {
    this.approveLoading = true;
    try {

      const nftContract = this.nftToken.category.getAddress(
        this.networks.matic.chainId
      );
      const makerAddress = this.account.address;
      const chainId = this.networks.matic.chainId;
      const contractWrappers = new ContractWrappers(providerEngine(), {
        chainId: chainId,
      });

      const erc721TokenCont = new ERC721TokenContract(
        nftContract,
        providerEngine()
      );

      const isApprovedForAll = await erc721TokenCont
      .isApprovedForAll(
        makerAddress,
        contractWrappers.contractAddresses.erc721Proxy
      )
      .callAsync();

      this.isApprovedStatus = isApprovedForAll;
      this.approveLoading = false;

    }
    catch (error) {
      console.log(error);
      this.approveLoading = false
      app.addToast("Something went wrong", error.message.substring(0, 60), {
        type: "failure",
      });
    }

  }

  async approveClickedFunc() {
    this.approveLoading = true;

    try {
      const yearInSec = moment().add(365, "days").format("x");
      const expiry_date_time = this.expiry_date_time
        ? this.expiry_date_time.format("x")
        : 0;
      const orderType = this.orderType;
      const nftContract = this.nftToken.category.getAddress(
        this.networks.matic.chainId
      );
      // const nftTokenId = this.nftToken.token_id;
      const erc20Address = this.selectedERC20Token.address;
      const makerAddress = this.account.address;
      const makerAssetAmount = new BigNumber(1);
      const takerAssetAmount = this.price.toString(10);
      const chainId = this.networks.matic.chainId;
      const minPrice = this.minPrice;
      const decimalnftTokenId = this.nftToken.token_id;
      const contractWrappers = new ContractWrappers(providerEngine(), {
        chainId: chainId,
      });

      // ERC721 contract
      const erc721TokenCont = new ERC721TokenContract(
        nftContract,
        providerEngine()
      );

      console.log(nftContract);
      console.log(providerEngine());
      console.log(erc721TokenCont);

      // Check Approve 0x, Approve if not
      const isApproved = await this.approve0x(
        erc721TokenCont,
        contractWrappers,
        makerAddress
      );

      this.isApprovedStatus = isApproved;
      this.approveLoading = false;
    } catch (error) {
      console.log(error);
      this.approveLoading = false
      app.addToast("Something went wrong", error.message.substring(0, 60), {
        type: "failure",
      });
    }
  }

  async signClickedFunc() {
    this.signLoading = true;

    try {
      const yearInSec = moment().add(365, "days").format("x");
      const expiry_date_time = this.expiry_date_time
        ? this.expiry_date_time.format("x")
        : 0;
      const orderType = this.orderType;
      const nftContract = this.nftToken.category.getAddress(
        this.networks.matic.chainId
      );
      // const nftTokenId = this.nftToken.token_id;
      const erc20Address = this.selectedERC20Token.address;
      const makerAddress = this.account.address;
      const makerAssetAmount = new BigNumber(1);
      const takerAssetAmount = this.price.toString(10);
      const chainId = this.networks.matic.chainId;
      const minPrice = this.minPrice;
      const decimalnftTokenId = this.nftToken.token_id;
      const contractWrappers = new ContractWrappers(providerEngine(), {
        chainId: chainId,
      });

      const makerAssetData = await contractWrappers.devUtils
        .encodeERC721AssetData(nftContract, new BigNumber(decimalnftTokenId))
        .callAsync();
      const takerAssetData = await contractWrappers.devUtils
        .encodeERC20AssetData(erc20Address)
        .callAsync();

      const exchangeAddress = contractWrappers.contractAddresses.exchange;

      let expirationTimeSeconds = new BigNumber(yearInSec);
      if (orderType === app.orderTypes.AUCTION) {
        expirationTimeSeconds = new BigNumber(expiry_date_time);
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
      };

      // Sign if FIXED order
      let signedOrder = "";
      if (orderType === app.orderTypes.FIXED) {
        signedOrder = await signatureUtils.ecSignOrderAsync(
          providerEngine(),
          orderTemplate,
          makerAddress
        );
      }
      // add extra info
      orderTemplate.orderType = orderType;
      orderTemplate.expiry_date_time = expiry_date_time;

      await this.handleSellSign(orderTemplate, signedOrder);
    } catch (error) {
      console.log(error);
      this.signLoading = false;
      app.addToast("Something went wrong", error.message.substring(0, 60), {
        type: "failure",
      });
    }
  }

  async submitToMarketplace() {
    this.isLoading = true;
    if (!this.isValid) {
      this.dirty = true;
      this.isLoading = false;
      return;
    }
    this.dirty = false;
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
      this.showApproveModal = true;
      this.approveStatus();

    } catch (error) {
      console.error(error);
      app.addToast("Something went wrong", error.message.substring(0, 60), {
        type: "failure",
      });
    }
    this.isLoading = false;
  }

  async approve0x(erc721TokenCont, contractWrappers, makerAddress) {
    // Check if token is approved to 0x
    let matic = new Web3(this.networks.matic.rpc);
    const isApprovedForAll = await erc721TokenCont
      .isApprovedForAll(
        makerAddress,
        contractWrappers.contractAddresses.erc721Proxy
      )
      .callAsync();
    if (!isApprovedForAll) {
      if (!this.category.isMetaTx) {
        if (
          window.ethereum.chainId ===
          "0x" + this.networks.matic.chainId.toString(16)
        ) {
          const makerERC721ApprovalTxHash = await erc721TokenCont
            .setApprovalForAll(contractWrappers.contractAddresses.erc721Proxy, true)
            .sendTransactionAsync({
              from: makerAddress,
              gas: 8000000,
              gasPrice: 1000000000,
            });

          if (makerERC721ApprovalTxHash) {
            console.log("Approve Hash", makerERC721ApprovalTxHash);
            app.addToast(
              "Approved successfully",
              "You successfully approved the token to put on sale",
              {
                type: "success",
              }
            );
            return true;
          }
          app.addToast(
            "Failed to approve",
            "You need to approve the transaction to sale the NFT",
            {
              type: "failure",
            }
          );
        } else {
          this.showNetworkChangeNeeded = true;
          // app.addToast(
          //   "Change network",
          //   "Please change the network to Matic",
          //   {
          //     type: "failure",
          //   }
          // );

          return false;
        }
      } else {
        let data = await matic.eth.abi.encodeFunctionCall(
          {
            name: "setApprovalForAll",
            type: "function",
            inputs: [
              {
                name: "operator",
                type: "address",
              },
              {
                name: "approved",
                type: "bool",
              },
            ],
          },
          [contractWrappers.contractAddresses.erc721Proxy, true]
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
          try {
            let response = await getAxios().post(`orders/executeMetaTx`, tx);
            if (response.status === 200) {
              console.log("Approved");
              app.addToast("Approved", "You successfully approved", {
                type: "success",
              });
              return true;
            }
          } catch (error) {
            console.log(error);
            app.addToast(
              "Failed to approve",
              "You need to approve the transaction to sale the NFT",
              {
                type: "failure",
              }
            );
          }
        }
      }
      return false;
    }
    return true;
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

  async handleSellSign(data, signedOrder) {
    // Create Object to pass as data to post request
    let formData = {
      type: data.orderType,
      chain_id: `${this.networks.matic.chainId}`,
    };

    if (formData.type === app.orderTypes.FIXED) {
      formData.maker_address = this.user.id;
      formData.maker_token = this.nftToken.categories_id;
      formData.maker_token_id = this.nftToken.token_id;
      formData.taker_token = this.selectedERC20Token.id;
      formData.signature = JSON.stringify(signedOrder);
      formData.price = parseBalance(
        this.price,
        this.selectedERC20Token.decimal
      ).toString(10);
      formData.usd_price = this.priceInUSD.toString();
    } else if (formData.type === app.orderTypes.NEGOTIATION) {
      formData.taker_address = this.user.id;
      formData.taker_token = this.nftToken.categories_id;
      formData.taker_token_id = this.nftToken.token_id;
      formData.maker_token = this.selectedERC20Token.id;
      formData.price = parseBalance(
        this.price,
        this.selectedERC20Token.decimal
      ).toString(10);
      formData.usd_price = this.priceInUSD.toString();
      formData.min_price = parseBalance(
        this.minPrice,
        this.selectedERC20Token.decimal
      ).toString(10);
    } else if (formData.type === app.orderTypes.AUCTION) {
      formData.taker_address = this.user.id;
      formData.taker_token = this.nftToken.categories_id;
      formData.taker_token_id = this.nftToken.token_id;
      formData.expiry_date = data.expiry_date_time;
      formData.maker_token = this.selectedERC20Token.id;
      formData.min_price = parseBalance(
        this.price,
        this.selectedERC20Token.decimal
      ).toString(10);
    }

    try {
      let response = await getAxios().post("orders", formData);
      if (response.status === 200) {
        this.refreshNFTTokens();
        app.addToast(
          "Sell order added successfully",
          "Your NFT successfully added on sale",
          {
            type: "success",
          }
        );
        this.$store.dispatch("account/fetchActiveOrders");
        this.isSignedStatus = true;
        this.signLoading = false;
        this.close();
      }
    } catch (error) {
      console.error(error);
      app.addToast(
        "Sell order failed to add",
        "Failed to add you NFT on sale",
        {
          type: "failure",
        }
      );
      this.isSignedStatus = false;
    }
    this.$store.dispatch("category/fetchCategories");
  }

  // Get
  get validation() {
    return {
      owner:
        this.nftToken.owner.toLowerCase() ===
        this.account.address.toLowerCase(),
      price: !!this.price && this.price.gt(ZERO),
      minPrice: this.negotiation
        ? !!this.minPrice &&
          this.minPrice.lt(this.price) &&
          this.minPrice.gt(ZERO)
        : true,
    };
  }
  get EXPIRY_DURATION() {
    return EXPIRY_DURATION;
  }

  get orderType() {
    if (this.activeTab === 0 && this.negotiation) {
      return app.orderTypes.NEGOTIATION;
    } else if (this.activeTab === 0 && !this.negotiation) {
      return app.orderTypes.FIXED;
    } else if (this.activeTab === 1) {
      return app.orderTypes.AUCTION;
    }
  }

  get category() {
    return this.categories.find(
      (category) =>
        category.address.toLowerCase() === this.nftToken.contract.toLowerCase()
    );
  }

  get priceInUSD() {
    let equivalentUSD = this.convertPriceToUSD(this.price)
    return isNaN(equivalentUSD) ? 0 : equivalentUSD
  }

  get priceInUSDFormatted() {
    let equivalentUSD = this.convertPriceToUSD(this.price)
    return isNaN(equivalentUSD) ? '$0' : formatUSDValue(equivalentUSD)
  }

  get minPriceInUSDFormatted() {
    let equivalentUSD = this.convertPriceToUSD(this.minPrice)
    return isNaN(equivalentUSD) ? '$0' : formatUSDValue(equivalentUSD)
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
