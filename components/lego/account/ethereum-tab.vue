<template>
  <div class="container-fluid">
    <item-banner class="ms-y-32" v-if="false" />
    <div class="row ps-y-32 ps-x-16">
      <div
        class="col-12 col-lg cat-switch d-flex ms-b-16 ms-b-lg-0 justify-content-between justify-content-lg-start"
      >
        <categories-selector class="ms-r-16 category-wrapper" />
      </div>
      <div class="col-12 col-lg search-sort d-flex justify-content-between justify-content-lg-end">
        <search-box class="search-box ms-r-16" placeholder="Search NFT..." :change="(val) => val" />
      </div>
    </div>
    <div
      class="row ps-x-16 d-flex justify-content-center text-center ps-b-60"
      v-if="displayedTokens && displayedTokens.length > 0"
    >
      <sell-card
        v-for="token in displayedTokens"
        :key="token.id"
        :onlyToken="true"
        :moveToMatic="moveToMatic"
        :order="token"
      />
    </div>

    <no-item
      class="ps-b-120"
      :message="exmptyMsg"
      v-if="displayedTokens.length <= 0 && !isLoadingTokens"
    />
    <MoveToMatic
      :show="showMoveToMatic"
      v-if="showMoveToMatic"
      :token="selectedToken"
      :close="closeMoveToMatic"
      :refreshNFTTokens="refreshNFTTokens"
    />
  </div>
</template>

<script>
import Vue from "vue";
import Component from "nuxt-class-component";
import { mapGetters } from "vuex";
import getAxios from "~/plugins/axios";
import app from "~/plugins/app";

import NFTTokenModel from "~/components/model/nft-token";
import SellCard from "~/components/lego/sell-card";
import CategoriesSelector from "~/components/lego/categories-selector";
import SearchBox from "~/components/lego/search-box";
import NoItem from "~/components/lego/no-item";
import ItemBanner from "~/components/lego/account/item-banner";
import MoveToMatic from "~/components/lego/modals/move-to-matic";

import { getWalletProvider } from "~/plugins/helpers/providers";
const MaticPOSClient = require("@maticnetwork/maticjs").MaticPOSClient;

@Component({
  props: {},
  components: {
    SellCard,
    CategoriesSelector,
    SearchBox,
    NoItem,
    ItemBanner,
    MoveToMatic,
  },
  computed: {
    ...mapGetters("page", ["selectedFilters"]),
    ...mapGetters("category", ["categories"]),
    ...mapGetters("account", ["account"]),
    ...mapGetters("auth", ["user"]),
    ...mapGetters("network", ["networks", "networkMeta"]),
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
export default class EthereumTab extends Vue {
  selectedToken = null;
  sortItems = [
    {
      id: 0,
      name: "Popular",
      filter: "-views",
    },
    {
      id: 1,
      name: "Newest",
      filter: "-created",
    },
    {
      id: 2,
      name: "Oldest",
      filter: "+created",
    },
    {
      id: 3,
      name: "Price low to high",
      filter: "+price",
    },
    {
      id: 4,
      name: "Price high to low",
      filter: "-price",
    },
  ];
  tokensFullList = [];
  hasNextPage = true;
  displayTokens = 0;
  isLoadingTokens = false;

  showMoveToMatic = false;

  exmptyMsg = {
    title: "Oops! No item found on Ethereum chain.",
    description: "We didn’t found any item on Ethereum chain.",
    img: true,
  };

  mounted() {
    this.fetchNFTTokens();
  }

  // Handlers
  onSortSelect(item) {
    this.$store.commit("page/selectedSort", item.filter);
  }

  // Get
  get displayedTokens() {
    if (this.tokensFullList.length) {
      return this.tokensFullList;
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

  // async
  async refreshNFTTokens() {
    await this.fetchNFTTokens();
  }

  async fetchNFTTokens(options = {}) {
    // Do not remove data while fetching
    if (this.isLoadingTokens) {
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
        this.$store.commit("account/totalMainNft", response.data.count);

        let tokens = [];
        let i = 0;
        response.data.data.forEach((token) => {
          i++;
          if (token.contract == "0x12Ee2605AF9F3784eeA033C7DfB66E5Acd67F8d6")
            return;
          token.id = i;
          token.chainId = this.chainId;
          tokens.push(new NFTTokenModel(token));
        });
        if (options && options.filtering) {
          this.tokensFullList = tokens;
          return;
        }
        this.tokensFullList = [...tokens];
      }
    } catch (error) {
      console.log(error);
    }
    this.isLoadingTokens = false;
  }

  get chainId() {
    return this.networks.main.chainId;
  }

  moveToMatic(token) {
    this.selectedToken = token;
    this.showMoveToMatic = true;
  }
  closeMoveToMatic() {
    this.showMoveToMatic = false;
  }
}
</script>

<style lang="scss" scoped>
@import "~assets/css/theme/_theme";

.search-box {
  max-width: 264px;
  width: 100%;
}

.count-wrapper {
  height: 24px;
  width: 24px;
  background-color: primary-color("600");
  color: light-color("700");
  border-radius: 50%;
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
