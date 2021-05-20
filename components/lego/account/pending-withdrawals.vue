<template>
  <div
    v-if="transactions.length > 0"
    class="section"
  >
    <div class="box transaction-widget">
      <div
        class="box-header d-flex justify-content-center justify-content-md-between ps-sm-32 ps-20"
      >
        <div class="font-heading-medium font-medium p-0">
          Pending Withdrawals
        </div>
      </div>

      <div
        v-if="transactions"
        class="box-body"
      >
        <div
          class="table table-wrapper wallet-transactions no-border selectable"
        >
          <div class="table">
            <div class="table-body">
              <div
                v-for="transaction in transactions"
                :key="transaction.txhash"
                class="table-row no-border p-0"
                @click="selectTransaction(transaction)"
              >
                <div
                  class="table-row-in-row bottom-separator ps-l-0 ps-r-md-20 ps-r-4 ms-l-lg-32 ms-l-16 w-100"
                >
                  <div class="table-column col ps-l-0">
                    {{ transaction.txhash }}
                  </div>
                  <div
                    class="table-column col ml-auto ms-r-md-8 ms-r-0 justify-content-end"
                  >
                    <div class="text-right">
                      <div
                        class="font-heading-small text-gray"
                        :class="{ 'text-red': true }"
                      >
                        {{ transaction.type }}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div
          v-if="false"
          class="no-transaction-card-wrapper d-flex justify-content-center"
        >
          <div class="text-center align-self-center">
            <div class="font-heading-small font-semibold ms-t-12">
              No pending withdrawals
            </div>
            <div class="font-body-small ms-t-8">
              You do not have any pending withdraw process
            </div>
          </div>
        </div>
      </div>
    </div>
    <withdraw-confirmation-modal
      v-if="showWithdrawConfirmation && selectedTransaction"
      :show="showWithdrawConfirmation"
      :transaction="selectedTransaction"
      :isBurning="false"
      :burnHash="selectedTransaction.txhash"
      :selectedTokens="selectedTokens"
      :category="category"
      :cancel="onCloseConfirmWithdraw"
      :refreshBalance="refreshTransactionAndBalance"
    />
  </div>
</template>

<script>
import Vue from 'vue'
import Component from 'nuxt-class-component'
import { mapGetters } from 'vuex'

import WithdrawConfirmationModal from '~/components/lego/modals/withdraw-confirmation-modal'

@Component({
  props: {
    tokens: {
      type: Array,
      required: false,
    },
    refreshBalance: { type: Function, required: true },
  },
  computed: {
    ...mapGetters('account', ['account', 'pendingWithdrawals']),
    ...mapGetters('auth', ['userId']),
    ...mapGetters('category', ['categories']),
  },
  components: { WithdrawConfirmationModal },
  middleware: [],
  mixins: ['auth'],
})
export default class PendingWithdrawalsList extends Vue {
  selectedTransaction = null;
  showWithdrawConfirmation = null;

  async mounted() {
    this.$store.dispatch('account/fetchPendingWithdrawals')
  }

  selectTransaction(transaction) {
    this.selectedTransaction = transaction
    this.onShowWithdrawConfirmation()
  }

  onShowWithdrawConfirmation() {
    this.showWithdrawConfirmation = true
  }

  onCloseConfirmWithdraw() {
    this.showWithdrawConfirmation = false
  }

  refreshTransactionAndBalance() {
    this.refreshBalance()
    this.$store.dispatch('account/fetchPendingWithdrawals')
  }

  get transactions() {
    if (this.pendingWithdrawals && this.pendingWithdrawals.length > 0) {
      return this.pendingWithdrawals
    }
    return []
  }

  get category() {
    if (
      this.categories &&
      this.categories.length > 0 &&
      this.selectedTransaction
    ) {
      return this.categories.find(
        (c) => c.id === this.selectedTransaction.categories_id,
      )
    }
  }

  get selectedTokens() {
    if (this.tokens && this.tokens.length > 0 && this.selectedTransaction) {
      return this.tokens.filter((token) =>
        this.selectedTransaction.token_array.includes(token.token_id),
      )
    }
  }
}
</script>

<style lang="scss" scoped>
@import "~assets/css/theme/_theme";
.no-transaction-card-wrapper {
  height: 332px;
  border-radius: $border-radius-xl;
  border: 1px dashed light-color("500");
}
.refresh {
  width: 20px;
  height: 20px;
}
.table-body {
  border-bottom-right-radius: 12px !important;
  border-bottom-left-radius: 12px !important;
}
.text-green {
  color: green-color("600") !important;
}
.text-red {
  color: red-color("600") !important;
}
@media (max-width: 768px) {
  .transaction-widget,
  .no-transaction-card-wrapper {
    width: 100%;
  }
}
</style>
