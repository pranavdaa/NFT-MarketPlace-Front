<template>
  <div class="container-fluid">
    <div class="row ps-y-32 ps-x-16">
      <div class="col-md d-flex ms-b-16 ms-b-md-0 justify-content-center justify-content-md-start">
        <categories-selector class="category-wrapper" />
      </div>
      <div class="col-md d-flex ms-b-16 ms-b-md-0 justify-content-center">
        <search-box class="search-box w-100" placeholder="Search NFT..." :change="(val) => val" />
      </div>
      <div class="col-md d-flex justify-content-center justify-content-md-end">
        <sort-dropdown class="dropdown-filter" :sortItems="sortItems" :change="onSortSelect" />
      </div>
    </div>

    <div class="row ps-x-16 d-flex justify-content-center text-center">
      <sell-card
        v-for="order in orders"
        :key="order.id"
        :order="order"
        @click="orderDetails(order.id)"
      />
    </div>

    <div class="row ps-x-16 ps-y-40 d-flex justify-content-center text-center">
      <button-loader
        class="mx-auto"
        :loading="isLoadingTokens"
        :loadingText="$t('loading')"
        :text="$t('loadMore')"
        block
        lg
        v-if="hasNextPage"
        color="light"
        :click="onModalShow"
      ></button-loader>
    </div>
    <!-- <buy-token :show="showModal" :close="onModalClose" :order="orders[0]" /> -->
    <place-bid :show="showModal" :bid="true" :close="onModalClose" :order="orders[0]" />
  </div>
</template>

<script>
import Vue from "vue";
import Component from "nuxt-class-component";
import { mapGetters } from "vuex";
import app from "~/plugins/app";
import getAxios from "~/plugins/axios";

import SellCard from "~/components/lego/sell-card";
import CategoriesSelector from "~/components/lego/categories-selector";
import SearchBox from "~/components/lego/search-box";
import SortDropdown from "~/components/lego/sort-dropdown";
import BuyToken from "~/components/lego/modals/buy-token";
import PlaceBid from "~/components/lego/modals/place-bid";

@Component({
  props: {},
  components: {
    SellCard,
    CategoriesSelector,
    SearchBox,
    SortDropdown,
    BuyToken,
    PlaceBid
  },
  computed: {
    ...mapGetters("page", ["selectedFilters"])
  },
  middleware: [],
  mixins: [],
  watch: {
    selectedFilters: {
      handler: async function() {
        await this.fetchOrders({ filtering: true });
      },
      deep: true
    }
  }
})
export default class Index extends Vue {
  orders = [
    {
      id: 1,
      price: "0.113",
      minprice: "12.4",
      categories_id: 1,
      erc20tokens_id: 1,
      token: {
        name: "Kitty Kitten cat",
        img_url: "/_nuxt/static/img/dummy-kitty.png",
        owner: "0x840d3719dea3615bcD137a88c2215B3dd4B6330e",
        description:
          "Your asset will be sell at this price. It will be available for sale in marketplace until you cancel it."
      }
    }
  ];

  limit = app.uiconfig.defaultPageSize;

  sortItems = [
    {
      id: 0,
      name: "Popular",
      filter: "-views"
    },
    {
      id: 1,
      name: "Newest",
      filter: "-created"
    },
    {
      id: 2,
      name: "Oldest",
      filter: "+created"
    },
    {
      id: 3,
      name: "Price low to high",
      filter: "+price"
    },
    {
      id: 4,
      name: "Price high to low",
      filter: "-price"
    }
  ];

  orderFullList = [];
  hasNextPage = true;
  displayTokens = 0;
  isLoadingTokens = false;

  showModal = false;

  mounted() {}

  // handlers
  onSortSelect(item) {
    this.$store.commit("page/selectedSort", item.filter);
  }

  onModalShow() {
    this.showModal = true;
  }
  onModalClose() {
    this.showModal = false;
  }

  // Get
  get displayedTokens() {
    return this.orderFullList || [];
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

  async fetchOrders(options = {}) {
    // Tobe removed
    this.orders = [...this.orders, ...this.orders];
    // Do not remove data while fetching
    if (this.isLoadingTokens || this.hasNextPage) {
      return;
    }
    this.isLoadingTokens = true;
    let response;
    let offset = this.orderFullList.length;

    if (options && options.filtering) {
      // Start from page one with new filter
      offset = 0;
    }

    // Fetch tokens with pagination and filters
    if (this.searchInput != null && this.searchInput.length > 0) {
      // with search
      response = await getAxios().get(
        `orders/?offset=${offset}&limit=${this.limit}${this.ifCategory}${this.ifSort}`
      );
    } else {
      // without search
      response = await getAxios().get(
        `orders/?offset=${offset}&limit=${this.limit}${this.ifCategory}${this.ifSort}`
      );
    }

    if (response.status === 200 && response.data.data.order) {
      this.hasNextPage = response.data.data.has_next_page;
      if (options && options.filtering) {
        this.orderFullList = response.data.data.order;
        return;
      }
      this.orderFullList = [...this.orderFullList, ...response.data.data];
    }
  }

  async loadMore() {
    await this.fetchOrders();
  }
}
</script>

<style>
.search-box {
  max-width: 264px;
  width: 100%;
}
@media (max-width: 768px) {
  .search-box {
    max-width: 100%;
    width: 100%;
  }
  .category-wrapper {
    width: 100%;
  }
}
</style>
