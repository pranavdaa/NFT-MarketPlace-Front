<template>
  <div class="container-fluid p-0 m-0 fixed">
    <div class="row p-0 m-0">
      <div
        class="col container-fluid sidebar-container d-none d-lg-block sticky-top"
      >
        <category-sidebar
          :countFor="1"
          :isTab="true"
          :isLoading="isLoadingTokens"
        />
      </div>
      <div class="col container-fluid content-container">
        <div class="row ps-y-16 ps-x-16 sticky-top tab-header">
          <div
            class="col-12 col-lg cat-switch d-flex d-lg-none ms-b-16 ms-b-lg-0 justify-content-between justify-content-lg-start"
          >
            <categories-selector :countFor="1" class="category-wrapper" />
          </div>
          <div
            class="col-12 col-lg cat-switch d-none d-lg-flex ms-b-16 ms-b-lg-0 justify-content-between justify-content-lg-start"
          >
            <div
              class="category d-flex ps-x-16 ps-y-8 cursor-pointer"
              v-if="!selectedCategory"
            >
              <img
                :src="allCategory.img_url"
                :alt="allCategory.name"
                class="icon align-self-center ms-r-12"
              />
              <div class="font-body-large align-self-center font-medium">
                {{ allCategory.name }}
              </div>
              <div class="count ps-l-12 font-body-large ml-auto">
                {{ totalMaticNft }} {{ $t("collectibles") }}
              </div>
            </div>
            <div
              class="category d-flex ps-x-16 ps-y-8 cursor-pointer"
              v-if="selectedCategory"
            >
              <img
                :src="selectedCategory.img_url"
                :alt="selectedCategory.name"
                class="icon align-self-center ms-r-12"
              />
              <div class="font-body-large align-self-center font-medium">
                {{ selectedCategory.name }}
              </div>
              <div class="count ps-l-12 font-body-large ml-auto">
                {{
                  selectedCategory.maticCount ||
                  (displayedTokens && displayedTokens.length) ||
                  0
                }}
                {{ $t("collectibles") }}
              </div>
            </div>
          </div>
          <div
            class="col-12 col-lg search-sort d-flex justify-content-between justify-content-lg-end"
          >
            <sort-dropdown
              class="dropdown-filter"
              :sortItems="sortItems"
              :change="onSortSelect"
              v-if="false"
            />
            <search-box
              class="search-box"
              placeholder="Search in items"
              :change="(val) => (searchInput = val)"
            />
            <button
              v-if="selectedCategory"
              class="btn btn-primary ps-x-32 ms-l-sm-20 ms-t-16 ms-t-sm-0 text-nowrap"
              @click.prevent="onWithdraw()"
              :disabled="!selectedCategory.isOpenseaCompatible"
            >
              {{
                $t("maticTab.withdrawBtn", {
                  count:
                    selectedTokens && selectedTokens.length
                      ? selectedTokens.length
                      : "",
                })
              }}
            </button>
          </div>
        </div>

        <no-item
          class="ps-b-120"
          :message="exmptyMsg"
          v-if="
            displayedTokens && displayedTokens.length <= 0 && !isLoadingTokens
          "
        />

        <div
          class="row ps-x-16 d-flex justify-content-center justify-content-lg-start text-center ps-b-60"
          v-if="displayedTokens && displayedTokens.length > 0"
        >
          <no-item
            class="ps-b-120"
            :message="this.$t('searchNotFound')"
            v-if="searchedTokens.length === 0"
          />

          <NFTTokenCard
            v-for="token in searchedTokens"
            :key="token.id"
            :token="token"
            :isSelected="token.isSelected"
            :isAllCategories="!selectedCategory"
            :onSelectToken="onSelectToken"
            :onWithdraw="onWithdraw"
            :onSell="onSellToken"
            :searchInput="searchInput"
            :totalSelected="selectedTokens.length"
          />
        </div>

        <sell-token
          class="text-left"
          :show="showSellModal"
          :close="onCloseSellModal"
          :nftToken="selectedToken"
          v-if="showSellModal"
          :refreshNFTTokens="refreshNFTTokens"
        />

        <withdraw
          v-if="
            (selectedCategory && showWithdrawModal) ||
            (selectedTokens.length > 0 && showWithdrawModal)
          "
          :show="showWithdrawModal"
          :visible="onWithdraw"
          :cancel="onWithdrawClose"
          :tokens="selectedCateTokens"
          :preSelectedTokens="preSelectedTokens"
          :refreshBalance="refreshBalance"
        />

        <div
          class="row ps-x-16 ps-y-40 d-flex justify-content-center text-center"
        >
          <!-- matic loader here -->
          <button-loader
            class="mx-auto"
            :loading="isLoadingTokens"
            :loadingText="$t('loading')"
            :text="$t('loadMore')"
            block
            lg
            v-if="
              (hasNextPage && displayedTokens && displayedTokens.length > 0) ||
              isLoadingTokens
            "
            color="light"
          ></button-loader>
        </div>
        <pending-withdrawals
          :tokens="displayedTokens"
          :refreshBalance="refreshBalance"
        />
      </div>
    </div>
  </div>
</template>

<script>
import Vue from "vue";
import Component from "nuxt-class-component";
import { mapGetters } from "vuex";
import getAxios from "~/plugins/axios";
import app from "~/plugins/app";
import { fuzzysearch } from "~/plugins/helpers/index";
import { fuzzySearchResult } from "~/plugins/helpers/index";

import NFTTokenModel from "~/components/model/nft-token";

import SellCard from "~/components/lego/sell-card";
import CategoriesSelector from "~/components/lego/categories-selector";
import SearchBox from "~/components/lego/search-box";
import SortDropdown from "~/components/lego/sort-dropdown";
import SlideSwitch from "~/components/lego/slide-switch";
import NoItem from "~/components/lego/no-item";
import CategorySidebar from "~/components/lego/account/category-sidebar";
import NFTTokenCard from "~/components/lego/nft-token-card";
import PendingWithdrawals from "~/components/lego/account/pending-withdrawals";
import SellToken from "~/components/lego/modals/sell-token";
import Withdraw from "~/components/lego/modals/withdraw";

@Component({
  props: {},
  components: {
    SellCard,
    CategoriesSelector,
    SearchBox,
    SortDropdown,
    SlideSwitch,
    NoItem,
    NFTTokenCard,
    SellToken,
    CategorySidebar,
    Withdraw,
    PendingWithdrawals,
  },
  computed: {
    ...mapGetters("page", ["selectedFilters", "selectedCategory"]),
    ...mapGetters("category", ["categories", "allCategory"]),
    ...mapGetters("account", ["account", "userOrders", "totalMaticNft"]),
    ...mapGetters("auth", ["user"]),
    ...mapGetters("network", ["networks"]),
  },
  middleware: [],
  mixins: [],
  watch: {
    selectedFilters: {
      handler: async function () {
        // disabled api call on category change
        // this.fetchNFTTokens({ filtering: true });
      },
      deep: true,
    },
  },
})
export default class MaticNewTab extends Vue {
  // Modals
  showSellModal = false;
  showWithdrawModal = false;
  selectedToken = null;
  selectedTokens = [];
  searchInput = null;
  maxTokenSelection = app.uiconfig.maxBulkDeposit;

  tokensFullList = [];
  hasNextPage = true;
  displayTokens = 0;
  isLoadingTokens = false;
  limit = 20;
  fuzzysearch = fuzzysearch;

  mounted() {
    this.fetchNFTTokens();
  }

  // Handlers
  onSortSelect(item) {
    this.$store.commit("page/selectedSort", item.filter);
  }
  onSellToken(token) {
    this.selectedToken = token;
    this.showSellModal = true;
  }
  onCloseSellModal() {
    this.showSellModal = false;
  }
  onWithdraw(token = null) {
    if (token) {
      this.selectedTokens = [token];
    }
    this.showWithdrawModal = true;
  }
  onWithdrawClose() {
    this.selectedTokens = [];
    if (this.tokens && this.tokens.length > 0) {
      this.tokens.forEach((token) => (token.isSelected = false));
    }
    this.showWithdrawModal = false;
  }
  refreshBalance() {
    this.fetchNFTTokens({ filtering: true });
    this.fetchEthereumCount();
    this.$store.dispatch("account/fetchPendingWithdrawals");
  }
  onSelectToken(token) {
    let exists = this.selectedTokens.find((t) => t.token_id === token.token_id);
    if (typeof exists == "undefined") {
      if (
        this.selectedTokens &&
        this.selectedTokens.length < this.maxTokenSelection
      ) {
        this.selectedTokens.push(token);
      }
    } else {
      this.selectedTokens = this.selectedTokens.filter(
        (t) => t.token_id !== token.token_id
      );
    }
  }

  // Async
  async fetchEthereumCount() {
    try {
      let response;

      response = await getAxios().get(
        `tokens/balance?userId=${this.user.id}&chainId=${this.mainChainId}`
      );

      if (response.status === 200 && response.data.count) {
        this.$store.commit("account/totalMainNft", response.data.count);
      }
    } catch (error) {
      // console.log(error);
    }
  }

  async fetchNFTTokens(options = {}) {
    if (this.isLoadingTokens || (!this.hasNextPage && !options.filtering)) {
      // ignore if already fetching
      return;
    }
    this.isLoadingTokens = true;
    try {
      let response;
      let offset = this.tokensFullList.length;

      if (options && options.filtering) {
        // Start from page one with new filter
        offset = 0;
      }

      // Fetch tokens with pagination and filters
      response = await getAxios().get(
        `tokens/balance?userId=${this.user.id}&chainId=${this.chainId}${this.ifCategory}${this.ifSort}&offset=${offset}&limit=${this.limit}`
      );

      if (response.status === 200 && response.data.data) {
        // Update total token number
        this.$store.commit("account/totalMaticNft", response.data.count);
        // Check for next page
        // this.hasNextPage = response.data.data.has_next_page;
        this.hasNextPage = false;

        let tokens = [];
        let balances = {};
        let i = 0;
        response.data.data.forEach((token) => {
          i++;
          token.id = i;
          token.chainId = this.chainId;
          tokens.push(new NFTTokenModel(token));
          if (Object.keys(balances).includes(token.contract)) {
            balances[token.contract]++;
          } else {
            balances[token.contract] = 1;
          }
        });
        this.$store.commit("category/addUsersMaticCount", balances);
        if (options && options.filtering) {
          this.tokensFullList = tokens;
          this.isLoadingTokens = false;
          return;
        }
        this.tokensFullList = [...this.tokensFullList, ...tokens];
      }
    } catch (error) {
      // console.log(error);
    }
    this.isLoadingTokens = false;
  }

  async fetchNotifications() {
    try {
      let activityResponse = await getAxios().get(
        `users/notification/${this.user.id}`
      );

      if (activityResponse.status === 200 && activityResponse.data.data) {
        this.$store.commit(
          "account/totalUnreadActivity",
          activityResponse.data.data.unread_count
        );
      }
    } catch (error) {
      // console.log(error);
    }
  }

  async refreshNFTTokens() {
    this.hasNextPage = true;
    await this.fetchNFTTokens({ filtering: true });
    await this.fetchNotifications();
  }

  // Getters
  get displayedTokens() {
    let tokens = [];
    if (
      this.selectedTokenIds &&
      this.selectedTokenIds.length > 0 &&
      this.tokensFullList &&
      this.tokensFullList.length > 0
    ) {
      this.tokensFullList.forEach((token) => {
        token.isSelected = this.selectedTokenIds.includes(token.token_id);
        tokens.push(token);
      });
    } else {
      tokens = [];
      this.tokensFullList.forEach((token) => {
        token.isSelected = false;
        tokens.push(token);
      });
    }
    if (this.selectedCategory && this.tokensFullList) {
      return tokens.filter(
        (t) =>
          t.contract.toLowerCase() ===
          this.selectedCategory.maticAddress.toLowerCase()
      );
    }
    return tokens || [];
  }
  get searchedTokens() {
    if (this.searchInput !== null && this.displayedTokens.length > 0) {
      return fuzzySearchResult(this.searchInput, this.displayedTokens)
    } else {
      return this.displayedTokens;
    }
  }
  get selectedTokenIds() {
    let token_ids = [];
    if (this.selectedTokens && this.selectedTokens.length > 0) {
      this.selectedTokens.forEach((token) => token_ids.push(token.token_id));
    }
    return token_ids;
  }
  get selectedCateTokens() {
    if (this.selectedCategory && this.tokensFullList) {
      return this.sellableTokens.filter(
        (t) =>
          t.contract.toLowerCase() ===
          this.selectedCategory.maticAddress.toLowerCase()
      );
    }
    if (this.selectedTokens.length > 0) {
      return this.sellableTokens.filter(
        (t) =>
          t.contract.toLowerCase() ===
          this.selectedTokens[0].contract.toLowerCase()
      );
    }
    return [];
  }
  get preSelectedTokens() {
    if (this.selectedTokens && this.selectedTokens.length > 0) {
      return this.selectedTokens;
    }
    return this.selectedCateTokens;
  }
  get sellableTokens() {
    if (this.tokensFullList) {
      return this.tokensFullList.filter((t) => !t.active_order);
    }
    return [];
  }
  get ifCategory() {
    return this.selectedFilters.selectedCategory
      ? `&categoryArray=[${this.selectedFilters.selectedCategory.id}]`
      : "&categoryArray=[]";
  }
  get ifSort() {
    return this.selectedFilters.selectedSort
      ? `&sort=${this.selectedFilters.selectedSort}`
      : "";
  }
  get chainId() {
    return this.networks.matic.chainId;
  }
  get mainChainId() {
    return this.networks.main.chainId;
  }
  get exmptyMsg() {
    return {
      title: this.$t("maticTab.empty.title"),
      description: this.$t("maticTab.empty.description"),
      img: true,
    };
  }
  get sortItems() {
    return [
      {
        id: 0,
        name: this.$t("sort.popular"),
        filter: "-views",
      },
      {
        id: 1,
        name: this.$t("sort.newest"),
        filter: "-created",
      },
      {
        id: 2,
        name: this.$t("sort.oldest"),
        filter: "+created",
      },
    ];
  }
}
</script>

<style lang="scss" scoped>
@import "~assets/css/theme/_theme";

.sticky-top {
  &.tab-header {
    top: 126px !important;
    background-color: light-color("700");
  }
  &.sidebar-container {
    top: 126px !important;
    background-color: light-color("700");
    overflow-x: hidden;
    overflow-y: scroll;
  }
}
.category {
  background-color: light-color("700");
  box-sizing: border-box;

  .icon {
    width: 24px;
    height: 24px;
  }
  .count {
    color: dark-color("300") !important;
  }
}
.search-box {
  max-width: 264px;
  width: 100%;
}
.dropdown-filter,
.search-box {
  height: 44px;
}

.sidebar-container {
  padding: 12px !important;
  max-width: 348px;
  height: 100%;
  border-right: 1px solid light-color("500");
  max-height: 77vh;
  min-height: 77vh;
  border-right: 1px solid #f3f4f7;
  overflow-y: scroll;

  /* Hide scrollbar for Chrome, Safari and Opera */
  &::-webkit-scrollbar {
    display: none;
  }
  -ms-overflow-style: none; /* IE and Edge */
  scrollbar-width: none; /* Firefox */
}

@media (max-width: 768px) {
  .sticky-top {
    &.tab-header {
      position: relative;
      top: 0 !important;
      z-index: inherit;
    }
  }
  .category-wrapper {
    width: 100% !important;
    // margin: 0 !important;
  }
  .search-box {
    max-width: 100%;
    width: 100%;
  }
}

@media (max-width: 520px) {
  .search-sort,
  .cat-switch {
    justify-content: center;
    flex-direction: column;
  }

  .dropdown-filter {
    margin-top: 16px;
  }
}
</style>
