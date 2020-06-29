<template>
  <div class="input-container ps-4 d-flex">
    <input
      class="unstyle-input form-control align-self-center"
      :class="{'is-invalid': isInvalid}"
      type="number"
      :step="integer ? '1' : 'any'"
      :placeholder="placeholder"
      v-model="inputAmount"
    />
    <div
      class="token-btn font-caps font-medium d-flex align-self-center ps-12"
      :class="{'cursor-pointer': !disableToken}"
      @click="selectToken()"
    >
      <img src="~/static/tokens/MATIC.svg" alt="Matic Network" class="token-icon align-self-center" />
      <span class="font-body-small font-medium align-self-center ps-l-4">MATIC</span>
      <svg-sprite-icon name="right-arrow" class="ms-l-8 align-self-center" v-if="!disableToken" />
    </div>
    <token-list :show="showTokenList" :close="onTokenClosed" />
  </div>
</template>

<script>
import Vue from "vue";
import Component from "nuxt-class-component";
import TokenList from "~/components/lego/modals/token-list";

import app from "~/plugins/app";

// mixins
import { VueDebounce, VueWatch } from "~/components/decorator";

@Component({
  props: {
    value: {
      type: Number,
      default: null
    },
    placeholder: {
      type: String,
      default: "Amount"
    },
    change: {
      type: Function,
      required: true
    },
    integer: {
      type: Boolean,
      required: false,
      default: false
    },
    isInvalid: {
      type: Boolean,
      required: false,
      default: false
    },
    disableToken: {
      type: Boolean,
      required: false,
      default: false
    }
  },
  components: { TokenList },
  mixins: [],
  computed: {}
})
export default class InputMaticView extends Vue {
  inputAmount = null;
  showTokenList = false;

  @VueWatch("value", { immediate: true })
  valueChanged(value) {
    this.inputAmount = value;

    // change amount
    this.change && this.change(this.amount);
  }

  @VueWatch("inputAmount")
  @VueDebounce()
  inputAmountChanged(amount) {
    // notify parent
    this.change && this.change(this.amount);
  }

  get amount() {
    let result = null;
    if (
      this.inputAmount !== undefined &&
      this.inputAmount !== null &&
      this.inputAmount.toString().trim() !== ""
    ) {
      // this.inputAmount = new BigNumber(parseFloat(this.inputAmount));
      // const decimals = new BigNumber(app.maticDecimals);
      // result = this.inputAmount.times(TenBalance.pow(decimals));
      result = this.inputAmount;
    }

    return result;
  }

  selectToken() {
    if (!this.disableToken) {
      this.showTokenList = true;
    }
  }

  onTokenClosed() {
    this.showTokenList = false;
  }
}
</script>


<style lang="scss" scoped="">
@import "~assets/css/theme/_theme";

.is-invalid {
  .form-control {
    border-color: $danger;
  }
}

.input-container {
  position: relative;
  border: 1px solid light-color("400");
  box-sizing: border-box;
  border-radius: 8px;
  .form-control {
    width: 75%;
    height: 42px;
    padding-top: 0px;
    padding-bottom: 0px;
    box-shadow: none;
    -moz-appearance: textfield;
  }
  .token-btn {
    margin-left: auto;
    background: light-color("500");
    color: dark-color("700");
    height: 100%;
    border-radius: 4px;

    .token-icon {
      height: 24px;
      width: 24px;
    }

    .svg-sprite-icon {
      width: 10px;
      height: 14px;
      fill: rgba(dark-color("700"), 0.4);
      transform: rotate(90deg);
    }
  }
}
</style>
