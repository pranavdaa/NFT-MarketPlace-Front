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
        <sort-dropdown
          class="dropdown-filter"
          :sortItems="sortItems"
          :defaultID="1"
          :change="onSortSelect"
        />
      </div>
    </div>

    <div class="row ps-x-16 d-flex justify-content-center text-center">
      <sell-card v-for="order in orderFullList" :key="order.id" :order="order" />
      <no-item
        class="ps-b-120"
        :message="exmptyMsg"
        v-if="orderFullList.length <= 0 && !isLoadingTokens"
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
        :click="loadMore"
      ></button-loader>
    </div>
  </div>
</template>

<script>
import Vue from "vue";
import Component from "nuxt-class-component";
import { mapGetters } from "vuex";
import app from "~/plugins/app";
import getAxios from "~/plugins/axios";
import { VueWatch } from "~/components/decorator";

import SellCard from "~/components/lego/sell-card";
import CategoriesSelector from "~/components/lego/categories-selector";
import SearchBox from "~/components/lego/search-box";
import SortDropdown from "~/components/lego/sort-dropdown";
import OrderModel from "~/components/model/order";
import NoItem from "~/components/lego/no-item";

@Component({
  props: {},
  components: {
    SellCard,
    CategoriesSelector,
    SearchBox,
    SortDropdown,
    NoItem,
  },
  computed: {
    ...mapGetters("page", ["selectedFilters"]),
    ...mapGetters("category", ["categories"]),
    ...mapGetters("token", ["erc20Tokens"]),
  },
  middleware: [],
  mixins: [],
})
export default class Index extends Vue {
  limit = app.uiconfig.defaultPageSize;
  exmptyMsg = {
    title: "Oops! No item found.",
    description: "We didn’t found any item that is on sale.",
    img: true,
  };

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

  orderFullList = [];
  hasNextPage = true;
  displayTokens = 0;
  isLoadingTokens = false;

  showModal = false;

  mounted() {
    this.fetchOrders();
  }

  // Wathers
  @VueWatch("selectedFilters", { immediate: true, deep: true })
  async onFilterChanged() {
    this.hasNextPage = true;
    await this.fetchOrders({ filtering: true });
  }

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

    // Multiple
    // return `&categoryArray=[${this.categories
    // .reduce((value, category) => `${value},${category.id}`, "")
    // .substr(1)}]`; // selected category or all category
  }
  get ifSort() {
    return this.selectedFilters.selectedSort
      ? `&sort=${this.selectedFilters.selectedSort}`
      : "";
  }

  // async

  async fetchOrders(options = {}) {
    // Do not remove data while fetching
    if (this.isLoadingTokens || !this.hasNextPage) {
      return;
    }
    this.isLoadingTokens = true;
    try {
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
        let data = response.data.data.order.map(function (order) {
          return new OrderModel(order);
        });
        if (options && options.filtering) {
          this.orderFullList = data;
        } else {
          this.orderFullList = [...this.orderFullList, ...data];
        }
      }
    } catch (error) {
      console.log(error);
    }
    this.isLoadingTokens = false;
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
