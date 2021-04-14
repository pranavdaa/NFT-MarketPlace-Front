<template>
  <div
    v-if="defaultSelectedToken"
    class="input-container ps-4 d-flex"
  >
    <input
      v-model="inputAmount"
      class="unstyle-input form-control align-self-center"
      :class="{ 'is-invalid': isInvalid }"
      type="number"
      min="0"
      :step="integer ? '1' : 'any'"
      :placeholder="placeholder"
      :disabled="disabled"
      @keypress="validateDecimals"
    >
    <div
      class="token-btn font-caps font-medium d-flex align-self-center ps-12"
      :class="{ 'cursor-pointer': !disableToken }"
      @click="selectToken()"
    >
      <img
        v-if="
          !!tokenImage(defaultSelectedToken.symbol) &&
            defaultSelectedToken.symbol
        "
        :src="tokenImage(defaultSelectedToken.symbol)"
        :alt="defaultSelectedToken.name"
        class="token-icon align-self-center"
      >
      <span class="font-body-small font-medium align-self-center ps-l-4">{{
        defaultSelectedToken.symbol
      }}</span>
      <svg-sprite-icon
        v-if="!disableToken"
        name="right-arrow"
        class="ms-l-8 align-self-center"
      />
    </div>
    <token-list
      :show="showTokenList"
      :close="onTokenClosed"
    />
  </div>
</template>

<script>
import Vue from 'vue'
import Component from 'nuxt-class-component'
import { mapGetters } from 'vuex'
import BigNumber from '~/plugins/bignumber'

import TokenList from '~/components/lego/modals/token-list'
import { tokenImage } from '~/plugins/helpers/'
import { VueDebounce, VueWatch } from '~/components/decorator'

const ZERO = new BigNumber(0)
const TEN = new BigNumber(10)

@Component({
  props: {
    value: {
      type: Number,
      default: null,
    },
    placeholder: {
      type: String,
      default: 'Amount',
    },
    change: {
      type: Function,
      required: true,
    },
    integer: {
      type: Boolean,
      required: false,
      default: false,
    },
    disabled: {
      type: Boolean,
      required: false,
      default: false,
    },
    isInvalid: {
      type: Boolean,
      required: false,
      default: false,
    },
    disableToken: {
      type: Boolean,
      required: false,
      default: false,
    },
  },
  components: { TokenList },
  mixins: [],
  computed: {
    ...mapGetters('token', ['erc20Tokens', 'selectedERC20Token']),
  },
})
export default class InputToken extends Vue {
  inputAmount = null;
  showTokenList = false;
  tokenImage = tokenImage;

  @VueWatch('value', { immediate: true })
  valueChanged(value) {
    this.inputAmount = value

    // change amount
    this.change && this.change(this.amount)
  }

  @VueWatch('inputAmount')
  @VueDebounce()
  inputAmountChanged(amount) {
    // not allow negative values
    if (typeof amount === 'object' && amount.lt(ZERO)) {
      this.inputAmount = null
    }
    // notify parent
    this.change && this.change(this.amount)
  }

  get amount() {
    let result = null
    if (
      this.inputAmount !== undefined &&
      this.inputAmount !== null &&
      this.inputAmount.toString().trim() !== ''
    ) {
      BigNumber.config({ EXPONENTIAL_AT: 1e9 })
      this.inputAmount = new BigNumber(parseFloat(this.inputAmount))
      const decimals = new BigNumber(this.defaultSelectedToken.decimal)
      result = this.inputAmount.times(TEN.pow(decimals))
    }

    return result
  }

  get defaultSelectedToken() {
    if (this.selectedERC20Token) {
      return this.selectedERC20Token
    } else if (this.erc20Tokens && this.erc20Tokens.length > 0) {
      return this.erc20Tokens[0]
    }

    return null
  }

  selectToken() {
    if (!this.disableToken) {
      this.showTokenList = true
    }
  }

  onTokenClosed() {
    this.showTokenList = false
    // this.amount;
  }

  validateDecimals($event) {
    // limiting decimal places
    const value = $event.target.value
    if (value && value.toString().split('.')[1]) {
      const decimals = $event.target.value.toString().split('.')[1].length || 0
      if (decimals > this.defaultSelectedToken.decimal) {
        $event.preventDefault()
      }
    }
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
