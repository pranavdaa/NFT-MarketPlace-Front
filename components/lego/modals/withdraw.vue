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
              <token-verticle-list :tokens="tokens" :category="selectedCategory" />

              <div class="row ps-x-32 ps-b-8" v-if="error">
                <div class="font-body-small text-danger text-center mx-auto" v-html="error"></div>
                <div class="mx-auto text-gray-300 font-caption"></div>
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
    <!-- <choose-token :show="selectToken" :cancel="onTokenClose" /> -->
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
  },
  components: {
    WithdrawConfirmationModal,
    TokenVerticleList,
  },
  methods: {},
  computed: {
    ...mapGetters("account", ["account"]),
    ...mapGetters("network", ["networks", "networkMeta"]),
    ...mapGetters("page", ["selectedCategory"]),
  },
})
export default class Withdraw extends Vue {
  selectToken = false;
  error = null;
  isLoading = false;

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
          b: rgbColor[2],
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

  onCancel() {
    this.cancel();
  }

  onWithConfirmation() {
    this.showWithdrawConfirmation = true;
    this.cancel();
  }
}
</script>

<style lang="scss" scoped>
@import "~assets/css/theme/_theme";

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