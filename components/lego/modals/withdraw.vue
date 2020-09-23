<template>
  <div class="section position-absolute">
    <div class="modal receive-modal-wrapper" v-bind:class="{ 'show': show && !hidden }">
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
              <token-verticle-list
                :v-if="showTokenList"
                :tokens="tokens"
                :preSelectedTokens="preSelectedTokens"
                :category="selectedCategory || {}"
                :onSelectionChange="onSelectionChange"
              />

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
                    :click="initWithdraw"
                    :disabled="selectedTokens.length <= 0"
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
      :initialising="isLoading"
      :selectedTokens="selectedTokens"
      :cancel="onCloseConfirmWithdraw"
    />
    <div class="modal-backdrop" v-bind:class="{ 'show': show }"></div>
  </div>
</template>


<script>
import Vue from "vue";
import Component from "nuxt-class-component";
import { mapGetters } from "vuex";

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
    preSelectedTokens: {
      type: Array,
      required: false,
      default: () => [],
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
  error = null;
  isLoading = false;
  hidden = false;
  selectingTokens = false;
  selectedTokens = [];
  showWithdrawConfirmation = false;

  async mounted() {
    this.selectedTokens = this.preSelectedTokens;
  }

  // Getters
  get showTokenList() {
    return this.show && this.selectingTokens;
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
  onSelectionChange(tokens) {
    this.selectedTokens = tokens;
  }

  onCancel() {
    this.cancel();
  }

  onCloseConfirmWithdraw() {
    this.showWithdrawConfirmation = false;
    this.cancel();
  }

  onShowWithdrawConfirmation() {
    this.showWithdrawConfirmation = true;
    this.hidden = true;
  }

  // withdraw init
  async validation() {
    // TODO : Check the metamask selected chain id
    // TODO : Other validation
    return true;
  }

  async initWithdraw() {
    if (
      this.isLoading ||
      this.selectedTokens.length <= 0 ||
      !(await this.validation())
    ) {
      return;
    }

    this.isLoading = true;

    // TODO : start bulk withdraw for selected tokens

    // when process starts hide the token list and show the status on confirmation withdraw
    this.onShowWithdrawConfirmation();
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
}

.text-gray-300 {
  color: dark-color("300");
}

.btn-pay {
  border-radius: 12px;
}
</style>