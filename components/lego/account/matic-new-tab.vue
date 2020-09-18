<template>
  <div class="container-fluid p-0 m-0">
    <div class="row p-0 m-0">
      <div class="col container-fluid sidebar-container fixed">
        <category-sidebar />
      </div>
      <div class="col container-fluid content-container">
        <div class="row ps-y-16 ps-x-16 sticky-top tab-header">
          <div
            class="col-12 col-lg cat-switch d-flex ms-b-16 ms-b-lg-0 justify-content-between justify-content-lg-start"
          >
            <div class="category d-flex ps-x-16 ps-y-8 cursor-pointer" v-if="!selectedCategory">
              <img
                :src="allCategory.img_url"
                :alt="allCategory.name"
                class="icon align-self-center ms-r-12"
              />
              <div class="font-body-large align-self-center font-medium">{{allCategory.name}}</div>
              <div
                class="count ps-l-12 font-body-large ml-auto"
              >{{allCategory.count}} {{$t("collectibles")}}</div>
            </div>
            <div class="category d-flex ps-x-16 ps-y-8 cursor-pointer" v-if="selectedCategory">
              <img
                :src="selectedCategory.img_url"
                :alt="selectedCategory.name"
                class="icon align-self-center ms-r-12"
              />
              <div class="font-body-large align-self-center font-medium">{{selectedCategory.name}}</div>
              <div
                class="count ps-l-12 font-body-large ml-auto"
              >{{selectedCategory.count||0}} {{$t("collectibles")}}</div>
            </div>
          </div>
          <div
            class="col-12 col-lg search-sort d-flex justify-content-between justify-content-lg-end"
          >
            <sort-dropdown class="dropdown-filter" :sortItems="sortItems" :change="onSortSelect" />
            <search-box
              class="search-box ms-l-20"
              placeholder="Search in items"
              :change="(val) => val"
              v-if="!selectedCategory"
            />
            <button
              v-if="selectedCategory"
              class="btn btn-primary ps-x-32 ms-l-sm-20 ms-t-16 ms-t-sm-0 text-nowrap"
            >{{$t('ethereumTab.depositBtn', {count: selectedCategory.count || 0})}}</button>
          </div>
        </div>

        <no-item
          class="ps-b-120"
          :message="exmptyMsg"
          v-if="!displayedTokens && displayedTokens.length <= 0"
        />

        <div
          class="row ps-x-16 d-flex justify-content-center text-center ps-b-60"
          v-if="displayedTokens && displayedTokens.length > 0"
        >
          <NFTTokenCard
            v-for="token in displayedTokens"
            :key="token.id"
            :token="token"
            :isAllCategories="!selectedCategory"
          />
        </div>

        <div class="row ps-x-16 ps-y-40 d-flex justify-content-center text-center">
          <!-- matic loader here -->
          <button-loader
            class="mx-auto"
            :loading="isLoadingTokens"
            :loadingText="$t('loading')"
            :text="$t('loadMore')"
            block
            lg
            v-if="hasNextPage"
            color="light"
          ></button-loader>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Vue from "vue";
import Component from "nuxt-class-component";
import { mapGetters } from "vuex";
import getAxios from "~/plugins/axios";

import NFTTokenModel from "~/components/model/nft-token";

import SellCard from "~/components/lego/sell-card";
import CategoriesSelector from "~/components/lego/categories-selector";
import SearchBox from "~/components/lego/search-box";
import SortDropdown from "~/components/lego/sort-dropdown";
import SlideSwitch from "~/components/lego/slide-switch";
import NoItem from "~/components/lego/no-item";
import CategorySidebar from "~/components/lego/account/category-sidebar";
import NFTTokenCard from "~/components/lego/nft-token-card";

import SellToken from "~/components/lego/modals/sell-token";

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
  },
  computed: {
    ...mapGetters("page", ["selectedFilters", "selectedCategory"]),
    ...mapGetters("category", ["categories", "allCategory"]),
    ...mapGetters("account", ["account", "userOrders"]),
    ...mapGetters("auth", ["user"]),
    ...mapGetters("network", ["networks"]),
  },
  middleware: [],
  mixins: [],
  watch: {
    selectedFilters: {
      handler: async function () {},
      deep: true,
    },
  },
})
export default class MaticNewTab extends Vue {
  // Modals
  showSellModal = false;
  selectedToken = null;

  tokensFullList = [];
  hasNextPage = true;
  displayTokens = 0;
  isLoadingTokens = false;
  switchOnOff = false;
  limit = 20;

  mounted() {
    this.fetchNFTTokens();
  }

  // Handlers
  onSortSelect(item) {
    this.$store.commit("page/selectedSort", item.filter);
  }
  sellToken(id) {
    this.selectedToken = this.tokensFullList.find((token) => token.id == id);
    this.showSellModal = true;
  }
  onCloseSellModal() {
    this.showSellModal = false;
  }

  // Async
  async fetchNFTTokens(options = {}) {
    if (this.isLoadingTokens || !this.hasNextPage) {
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
        `tokens/balance?userId=${this.user.id}&chainId=${this.chainId}`
      );

      if (response.status === 200 && response.data.data) {
        // Update total token number
        this.$store.commit("account/totalMaticNft", response.data.count);
        // Check for next page
        // this.hasNextPage = response.data.data.has_next_page;
        this.hasNextPage = false;

        let tokens = [];
        let i = 0;
        response.data.data.forEach((token) => {
          i++;
          token.id = i;
          token.chainId = this.chainId;
          tokens.push(new NFTTokenModel(token));
        });
        if (options && options.filtering) {
          this.tokensFullList = tokens;
          return;
        }
        this.tokensFullList = [...this.tokensFullList, ...tokens];
      }
    } catch (error) {
      console.log(error);
    }
    this.isLoadingTokens = false;
  }

  // Getters
  get displayedTokens() {
    // if (this.switchOnOff === true) {
    //   if (this.selectedFilters.selectedCategory) {
    //     return this.userOrders;
    //   }
    //   return this.userOrders || [];
    // }
    // if (this.tokensFullList) {
    // return this.tokensFullList.filter((token) => token.active_order);
    // }
    return this.tokensFullList || [];
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
  get exmptyMsg() {
    if (this.switchOnOff) {
      return {
        title: "Oops! No item on sale.",
        description: "We didn’t find any item you put on sale.",
        img: true,
      };
    }
    return {
      title: "Oops! No item found on Matic chain.",
      description: "We didn’t found any item on Matic chain.",
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
      {
        id: 3,
        name: this.$t("sort.priceLowtoHigh"),
        filter: "+price",
      },
      {
        id: 4,
        name: this.$t("sort.priceHightoLow"),
        filter: "-price",
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
}

@media (max-width: 768px) {
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
