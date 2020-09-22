<template>
  <div class="section position-absolute">
    <div class="modal receive-modal-wrapper" v-bind:class="{ 'show': show }">
      <div class="modal-dialog w-sm-100 align-self-center" role="document">
        <div class="box withdraw-box">
          <div class="box-header justify-content-center">
            <div
              class="font-heading-medium font-semibold text-center align-self-center w-100"
            >{{$t('withdraw.title')}}</div>
            <span
              @click="onCancel()"
              class="left-arrow align-self-center float-right cursor-pointer"
            >
              <svg-sprite-icon
                name="close"
                class="close align-self-center float-left cursor-pointer"
              ></svg-sprite-icon>
            </span>
          </div>
          <div class="box-body">
            <div class="container">
              <div class="row ps-y-10">
                <div class="col-12 d-flex ps-t-12 ps-b-12 wrapper-top">
                  <div class="left col-8 category" v-if="selectedCategory">
                    <img
                      :src="selectedCategory.img_url"
                      :alt="selectedCategory.name"
                      class="icon align-self-center ms-r-12"
                    />
                      {{ selectedTokens.length || 0 }} {{ selectedCategory.name }} Collectibles
                  </div>
                  <div class="right col-4">
                    <div
                      class="check-container"
                      :class="{'checked': isSelected}"
                      @click="toggleSelection(!isSelected), selectAll()"
                    >
                      <input type="checkbox" id="selectAllNft" :checked="isSelected" />
                      <span class="checkmark align-self-center"></span>
                      <label class="form-check-label" for="selectAllNft">Select all</label>
                    </div>
                  </div>
                </div>

                <div class="col-12 card-wrapper">
                  <token-verticle-list
                    v-for="token in tokens" :key="token.id"
                    :token="token"
                    :onSelectNft="onSelectNft"
                    :isSelectedAll="isSelectedAll"
                  />
                </div>

                <div class="col-md-12 p-0 transaction-details">
                <div class="top ps-t-12 ps-b-12 border-top">
                  <div class="transaction-details__inner d-flex">
                    <div class="left col-8" v-if="selectedCategory">
                      <img
                        :src="selectedCategory.img_url"
                        :alt="selectedCategory.name"
                        class="icon align-self-center ms-r-12"
                      />
                      Collectibles selected
                    </div>
                    <div class="right col-4">{{ selectedTokens.length || 0 }}</div>
                  </div>
                </div>
                <div class="bottom ps-t-12 ps-b-12 border-top">
                  <div class="transaction-details__inner d-flex">
                    <div class="left col-8">
                      <img
                        src="~/static/img/est-bolt.svg"
                        alt="Bolt"
                        class="icon align-self-center ms-r-12"
                      />
                      Estimated Transacton fee
                    </div>
                    <div class="right col-4">$</div>
                    </div>
                  </div>
                </div>
              </div>

              <div class="row ps-x-32 ps-b-8" v-if="error">
                <div
                  class="font-body-small text-danger text-center mx-auto"
                  v-html="error"
                ></div>
                <div
                  class="mx-auto text-gray-300 font-caption"
                ></div>
              </div>
              <div class="row p-0">
                <div class="col-12 p-0 d-flex justify-content-space-between">
                  <button-loader
                    class="w-100"
                    :classes="['btn py-4 btn-pay no-top-border-radius']"
                    :block="true"
                    color="primary"
                    :loadingText="'Initializing withdraw'"
                    :loading="isLoading"
                    :text="'Withdraw to Ethereum Network'"
                    :click="onWithConfirmation"
                  ></button-loader>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <withdraw-confirmation-modal
      :show="showWithdrawConfirmation"
      :cancel="() => {this.showWithdrawConfirmation = false}"
    />
    <div class="modal-backdrop" v-bind:class="{ 'show': show }"></div>
  </div>
</template>


<script>
import Vue from "vue";
import Component from "nuxt-class-component";
import { mapGetters } from "vuex";

import getBaseAxios from "~/plugins/axios";
// import { tokenImage } from "~/plugins/helpers/";

import WithdrawConfirmationModal from "~/components/lego/modals/withdraw-confirmation-modal";
import TokenVerticleList from "~/components/lego/modals/token-verticle-list";
@Component({
  props: {
    show: {
      type: Boolean,
      required: false,
      default: false,
    },
    visible: {
      type: Function,
      required: true,
    },
    cancel: {
      type: Function,
      required: true,
    },
    tokens: {
      type: Array,
      required: true,
    },
    selectedCategory: {
      type: Object,
      default: {},
      required: true
    }
  },
  components: {
    WithdrawConfirmationModal,
    TokenVerticleList
  },
  methods: {
  },
  computed: {
    ...mapGetters("account", ["account"]),
    ...mapGetters("network", ["networks", "networkMeta"]),
  },
})
export default class Withdraw extends Vue {
  error = null;
  isLoading = false;
  isSelected = false;
  isSelectedAll = false;
  selectedTokens = [];

  showWithdrawConfirmation = false;

  async mounted() {}

  // get tokenImage() {
  //   return tokenImage;
  // }
  onImageLoad() {
    try {
      const img = this.$el.querySelector(".asset-img");
      let rgbColor = colorThief.getColor(img);
      if (rgbColor) {
        let hsl = rgbToHsl({
          r: rgbColor[0],
          g: rgbColor[1],
          b: rgbColor[2]
        });
        this.bg = `hsl(${hsl.h},${hsl.s}%,${hsl.l}%)`;
      } else this.bg = "#f3f4f7";
    } catch (error) {}
	}

  get maticToken() {
    if (this.userERC20Tokens) {
      return this.userERC20Tokens.find((token) => token.isMatic);
    }
    return null;
  }

  get parentNetwork() {
    return this.networks.main;
  }

  get childNetwork() {
    return this.networks.matic;
  }

  get networkID() {
    return this.childNetwork.chainId;
  }

  // Handlers
  toggleSelection(value) {
    this.isSelected = value;
  }

  selectAll() {
    this.selectedTokens = [];
    this.isSelectedAll = true;

    if (this.isSelected === true) {
      for (let token in this.tokens) {
        let exists = this.selectedTokens.find((t) => t.token_id === token.token_id);
        if (typeof exists == "undefined") {
          this.selectedTokens.push(this.tokens[token]);
        }
      }
    } else {
      this.selectedTokens = [];
      this.isSelectedAll = false;
    }
  }

  onCancel() {
    this.cancel();
  }

  onWithConfirmation() {
    this.showWithdrawConfirmation = true
    this.cancel();
  }

  onSelectNft(token, isSelected) {
    let exists = this.selectedTokens.find((t) => t.token_id === token.token_id);
    if (typeof exists == "undefined" && isSelected === true) {
      this.selectedTokens.push(token);
    } else if (isSelected === false) {
      this.selectedTokens = this.selectedTokens.filter(
        (t) => t.token_id !== token.token_id
      );
      this.isSelected = false
    }
  }
}
</script>

<style lang="scss" scoped>
@import "~assets/css/theme/_theme";

.receive-modal-wrapper {
  font-size: 14px;
  line-height: 20px;
}

.withdraw-box {
  width: 446px;
}

.account-info {
  height: 44px;
  background-color: light-color("400");
  border-top-left-radius: 12px;
  border-top-right-radius: 12px;
  padding: 10px;

  .profile {
    height: 26px;
    width: 26px;
  }

  .font-caption {
    opacity: 0.6;
  }
}

.check-container {
  display: flex !important;
  display: none;
  justify-content: flex-end;
  &.checked {
    display: flex !important;
  }

  .checkmark {
    position: relative;
    margin-right: 6px;
  }
}

.transaction-details {
  &__inner {
    padding: 0 15px;
  }

  .icon {
    height: 24px;
    width: 24px;
  }
}

.left {
  color: #6e798f;
  line-height: 22px;
  text-align: left;
}

.right {
  color: #6e798f;
  line-height: 22px;
  text-align: right;
}
.category {
  background-color: light-color("700");
  box-sizing: border-box;

  .icon {
    width: 24px;
    height: 24px;
  }
}

@media (max-width: 446px) {
  .withdraw-box {
    width: 100%;
  }
  .currency-switch {
    width: 100%;
    margin-left: 0px;
    margin-right: 0px;
  }
}

.pill {
  min-height: 26px;
  border-radius: 13px;

  &.ethereum-pill {
    background-color: supportive-color("100");
  }
  &.matic-pill {
    background-color: primary-color("200");
  }
}

.address-line {
  height: 56px;
  border-radius: 8px;
  padding: 0 6px;
  border: 1px solid light-color("500");
  display: flex;
  background-color: light-color("700");
  .form-control {
    height: 44px;
    border-width: 0px;
    box-shadow: none;
    outline: none;
  }
  .contact-person {
    display: block;
  }
  .contact-person.active {
    display: none;
  }
  &:hover {
    .contact-person-box.active {
      background: light-color("500");
    }
    .contact-person {
      display: none;
    }
    .contact-person.active {
      display: block;
    }
  }
  .right-arrow {
    margin-top: -2px;
  }
}

.contact-person-box {
  height: 44px;
  width: 44px;
  border-radius: $border-radius;
}

.currency-switch {
  @extend .address-line;
  height: 34px;
  box-shadow: 0px 1px 4px rgba(0, 0, 0, 0.08);
  .switch {
    border-radius: 6px;
    height: 26px;
    width: 64px;
    cursor: pointer;
  }
  .switch.active,
  .switch:hover {
    background-color: light-color("500");
  }
}

.currency-switch.precent .switch {
  padding-left: 8px;
  padding-right: 8px;
  width: 50px;
}

.text-currency {
  color: dark-color("600");
}
.text-gray-300 {
  color: dark-color("300");
}
.xl-currency {
  font-weight: 300;
  font-size: 64px;
  line-height: 110%;

  letter-spacing: -0.01em;
}

.btn-pay {
  border-radius: 12px;
}
.powered-by {
  .logo {
    margin-top: -3px;
    height: 14px;
  }
}
</style>