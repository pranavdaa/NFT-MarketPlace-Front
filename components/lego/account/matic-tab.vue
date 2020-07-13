<template>
  <div class="container-fluid">
    <div class="row ps-y-32 ps-x-16" v-if="true">
      <div
        class="col-12 col-lg cat-switch d-flex ms-b-16 ms-b-lg-0 justify-content-between justify-content-lg-start"
      >
        <categories-selector class="ms-r-16 category-wrapper" />
        <slide-switch :options="switchItems" :onChange="onSwitched" />
      </div>
      <div class="col-12 col-lg search-sort d-flex justify-content-between justify-content-lg-end">
        <search-box class="search-box ms-r-16" placeholder="Search NFT..." :change="(val) => val" />
        <sort-dropdown class="dropdown-filter" :sortItems="sortItems" :change="onSortSelect" />
      </div>
    </div>
    <div class="row ps-x-16 d-flex justify-content-center text-center" v-if="true">
      <sell-card
        v-for="order in orders"
        :key="order.id"
        :order="order"
        @click="orderDetails(order.id)"
      />
    </div>

    <no-item :message="exmptyMsg" v-if="!orders" />
  </div>
</template>

<script>
import Vue from "vue";
import Component from "nuxt-class-component";
import { mapGetters } from "vuex";

import SellCard from "~/components/lego/sell-card";
import CategoriesSelector from "~/components/lego/categories-selector";
import SearchBox from "~/components/lego/search-box";
import SortDropdown from "~/components/lego/sort-dropdown";
import SlideSwitch from "~/components/lego/slide-switch";
import NoItem from "~/components/lego/no-item";

@Component({
  props: {},
  components: {
    SellCard,
    CategoriesSelector,
    SearchBox,
    SortDropdown,
    SlideSwitch,
    NoItem
  },
  computed: {
    ...mapGetters("page", ["selectedFilters"])
  },
  middleware: [],
  mixins: [],
  watch: {
    selectedFilters: {
      handler: async function() {
        // await this.fetchNFTTokens({ filtering: true });
      },
      deep: true
    }
  }
})
export default class MaticTab extends Vue {
  exmptyMsg = {
    title: "Oops! No item found on Matic chain.",
    description: "We didn’t found any item on Matic chain.",
    img: true
  };

  orders = [
    {
      id: 1,
      price: "0.113",
      categories_id: 1,
      erc20tokens_id: 1,
      token: {
        name: "Kitty Kitten cat",
        img_url: "/_nuxt/static/img/dummy-kitty.png",
        owner: "0x840d3719dea3615bcD137a88c2215B3dd4B6330e"
      }
    }
  ];

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

  switchItems = [
    {
      title: "All items",
      count: false,
      selected: true
    },
    {
      title: "On sale",
      count: 12,
      selected: false
    }
  ];
  mounted() {}

  // Handlers
  onSortSelect(item) {
    this.$store.commit("page/selectedSort", item.filter);
  }

  onSwitched(value) {
    this.switchItems[1].selected = value;
    this.switchItems[0].selected = !value;
  }

  // Get
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
  async fetchNFTTokens(options = {}) {
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
