<template>
  <div class="section position-absolute">
    <div class="modal-backdrop" v-bind:class="{ 'show': show }"></div>
    <div class="modal add-token-modal-wrapper" v-bind:class="{ 'show': show }">
      <div class="modal-dialog w-sm-100 align-self-center" role="document">
        <div class="box accept-box">
          <div
            class="box-body"
            v-bind:style="{background: 'linear-gradient( 180deg,'+bg+' 0%, rgba(236, 235, 223, 0) 80%)'}"
          >
            <div class="close-wrapper" @click="close()">
              <svg-sprite-icon name="close-modal" class="close" />
            </div>
            <div class="container-fluid text-center" v-if="token">
              <div class="row">
                <div class="col-md-12 ps-y-32">
                  <img
                    class="asset-img mx-auto"
                    :src="token.img_url"
                    alt="kitty"
                    @load="onImageLoad"
                  />
                </div>
                <div class="col-md-12 ps-t-8 ps-b-40">
                  <div class="font-heading-large title font-semibold">{{token.name}}</div>
                </div>

                <div class="col-md-12 ps-t-8 ps-b-40 ps-x-40">
                  <button-loader
                    class="ml-auto"
                    :loading="isLoading"
                    :loadingText="loadingText"
                    :text="'Confirm'"
                    block
                    lg
                    color="primary"
                    :click="depositNFT"
                  ></button-loader>
                </div>
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
import app from "~/plugins/app";

import rgbToHsl from "~/plugins/helpers/color-algorithm";
import ColorThief from "color-thief";
const colorThief = new ColorThief();

import { getWalletProvider } from "~/plugins/helpers/providers";
const MaticPOSClient = require("@maticnetwork/maticjs").MaticPOSClient;

@Component({
  props: {
    show: {
      type: Boolean,
      required: true,
    },
    token: {
      type: Object,
      required: true,
    },
    close: {
      type: Function,
      required: true,
    },
  },
  components: {},
  computed: {
    ...mapGetters("account", ["account"]),
    ...mapGetters("auth", ["user"]),
    ...mapGetters("network", ["networks", "networkMeta"]),
  },
})
export default class MoveToMatic extends Vue {
  bg = "#f3f4f7";
  isLoading = false;
  loadingText = "Depositing...";

  mounted() {}

  onImageLoad() {
    try {
      const img = this.$el.querySelector(".asset-img");
      let rgbColor = colorThief.getColor(img);
      if (rgbColor) {
        let hsl = rgbToHsl({
          r: rgbColor[0],
          g: rgbColor[1],
          b: rgbColor[2],
        });
        this.bg = `hsl(${hsl.h},${hsl.s}%,${hsl.l}%)`;
      } else this.bg = "#f3f4f7";
    } catch (error) {}
  }
  // PoS withdraw
  async getMaticPOS() {
    let parentProvider = getWalletProvider({
      networks: this.networks,
      primaryProvider: "main",
    });

    let maticProvider = getWalletProvider({
      networks: this.networks,
      primaryProvider: "matic",
    });

    return await new MaticPOSClient({
      network: app.uiconfig.matic.deployment.network,
      version: app.uiconfig.matic.deployment.version,
      parentProvider: parentProvider,
      maticProvider: maticProvider,
      posRootChainManager: this.networkMeta.Main.POSContracts
        .RootChainManagerProxy,
      posERC20Predicate: this.networkMeta.Main.POSContracts.ERC20PredicateProxy,
      posERC721Predicate: this.networkMeta.Main.POSContracts
        .ERC721PredicateProxy,
      parentDefaultOptions: { from: this.account.address },
      maticDefaultOptions: { from: this.account.address },
    });
  }

  async getApproved(maticPOS, contract, tokenId) {
    try {
      const contractObj = new maticPOS.web3Client.parentWeb3.eth.Contract(
        this.networkMeta.abi("DummyERC721", "pos"),
        contract
      );
      const approved = await contractObj.methods.getApproved(tokenId).call();
      if (
        this.networkMeta.Main.POSContracts.ERC721PredicateProxy === approved
      ) {
        return true;
      }
    } catch (error) {}
    return false;
  }

  async approveNFT(maticPOS, contract, tokenId) {
    this.loadingText = "Approving";
    try {
      // Check if token is approved to matic deposit address
      const allowed = await this.getApproved(maticPOS, contract, tokenId);
      if (allowed) {
        return true;
      }
      const txHash = await maticPOS.approveERC721ForDeposit(contract, tokenId);
      if (txHash) {
        console.log("Approved : ", txHash);
        app.addToast(
          "Token approved successfully",
          "Your successfully token approved for deposit.",
          { type: "success" }
        );
        return true;
      }
    } catch (error) {
      console.error(error);
      app.addToast(
        "Failed to approve",
        "Something went wrong while approving NFT for deposit.",
        { type: "failure" }
      );
    }
    return false;
  }

  async depositNFT() {
    this.isLoading = true;
    try {
      const contract = this.token.category.getAddress(this.token.chainId);
      const tokenId = this.token.token_id;
      const maticPOS = await this.getMaticPOS();

      const approve = await this.approveNFT(maticPOS, contract, tokenId);

      if (approve) {
        this.loadingText = "Depositing";
        const txHash = await maticPOS.depositERC721ForUser(
          contract,
          this.account.address,
          tokenId
        );
        if (txHash) {
          console.log("Deposited : ", txHash);
          app.addToast(
            "Token deposited successfully",
            "Your token deposited successfully to matic network, it will take 3-5 minute to appear on matic network",
            { type: "success" }
          );
          this.close();
        }
      }
    } catch (error) {
      console.error(error);
      app.addToast(
        "Failed to deposit",
        "Something went wrong while depositing token",
        { type: "failure" }
      );
    }
    this.isLoading = false;
  }
}
</script>

<style lang="scss" scoped>
@import "~assets/css/theme/_theme";

.asset-img {
  max-width: 112px;
  max-height: 160px;
}
.last-offer {
  color: dark-color("500");
}
.short-descr {
  color: dark-color("300");
}

.box {
  max-width: 446px;
  width: 100%;
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