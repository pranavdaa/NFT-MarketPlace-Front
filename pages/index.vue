<template>
  <div class="container-fluid p-0 m-0 fixed">
    <div class="row p-0 m-0">
      <div
        class="col container-fluid sidebar-container d-none d-lg-block sticky-top"
      >
        <category-sidebar
          :countFor="0"
          :isLoading="isLoadingTokens"
        />
      </div>
      <div class="col container-fluid content-container">
        <div class="row ps-y-16 ps-x-16 sticky-top tab-header">
          <div
            class="col-12 col-lg cat-switch d-flex d-lg-none ms-b-16 ms-b-lg-0 justify-content-between justify-content-lg-start"
          >
            <categories-selector
              :countFor="0"
              class="category-wrapper"
            />
          </div>
          <div
            class="col-12 col-lg cat-switch d-none d-lg-flex ms-b-16 ms-b-lg-0 justify-content-between justify-content-lg-start"
          >
            <div
              v-if="!selectedCategory"
              class="category d-flex ps-x-16 ps-y-8 cursor-pointer"
            >
              <img
                :src="allCategory.img_url"
                :alt="allCategory.name"
                class="icon align-self-center ms-r-12"
              >
              <div class="font-body-large align-self-center font-medium">
                {{ allCategory.name }}
              </div>
              <div class="count ps-l-12 font-body-large ml-auto">
                {{ allCategory.count }} {{ $t("collectibles") }}
              </div>
            </div>
            <div
              v-if="selectedCategory"
              class="category d-flex ps-x-16 ps-y-8 cursor-pointer"
            >
              <img
                :src="selectedCategory.img_url"
                :alt="selectedCategory.name"
                class="icon align-self-center ms-r-12"
              >
              <div class="font-body-large align-self-center font-medium">
                {{ selectedCategory.name }}
              </div>
              <div class="count ps-l-12 font-body-large ml-auto">
                {{
                  selectedCategory.count ||
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
            <search-box
              class="search-box ms-r-0 ms-r-sm-6"
              placeholder="Search NFT..."
              :change="(val) => (searchInput = val)"
            />
            <sort-dropdown
              class="dropdown-filter ms-l-0 ms-l-sm-6"
              :sortItems="sortItems"
              :change="onSortSelect"
            />
          </div>
        </div>

        <div
          class="row ps-x-16 ps-y-40 d-flex justify-content-center justify-content-lg-start"
        >
          <no-item
            v-if="orderFullList.length <= 0 && !isLoadingTokens"
            class="ps-b-120"
            :message="exmptyMsg"
          />
          <no-item
            v-else-if="searchedTokens.length === 0 && !isLoadingTokens"
            class="ps-b-120"
            :message="this.$t('searchNotFound')"
          />

          <sell-card
            v-for="order in searchedTokens"
            :key="order.id"
            :order="order"
            :searchInput="searchInput"
          />
        </div>
        <div
          class="row ps-x-16 ps-y-40 d-flex justify-content-center text-center"
        >
          <!-- matic loader here -->
          <button-loader
            v-if="
              (hasNextPage && searchedTokens && searchedTokens.length > 0) ||
                isLoadingTokens
            "
            class="mx-auto"
            :loading="isLoadingTokens"
            :loadingText="$t('loading')"
            :text="$t('loadMore')"
            block
            lg
            color="light"
            :click="loadMore"
          />
        </div>
      </div>
    </div>

    <notification-modal
      v-if="showNotification"
      @close="onNotificationClose"
    />
  </div>
</template>

<script>
import Vue from "vue";
import Component from "nuxt-class-component";
import { mapGetters, mapState } from "vuex";
import app from "~/plugins/app";
import { fuzzysearch } from "~/plugins/helpers/index";
import { fuzzySearchResult } from "~/plugins/helpers/index";
import getAxios from "~/plugins/axios";
import { VueWatch, VueDebounce } from "~/components/decorator";

import SellCard from "~/components/lego/sell-card";
import CategoriesSelector from "~/components/lego/categories-selector";
import SearchBox from "~/components/lego/search-box";
import SortDropdown from "~/components/lego/sort-dropdown";
import OrderModel from "~/components/model/order";
import NoItem from "~/components/lego/no-item";

import CategorySidebar from "~/components/lego/account/category-sidebar";
import NotificationModal from '~/components/lego/notification-modal'

@Component({
  props: {},
  components: {
    SellCard,
    CategoriesSelector,
    SearchBox,
    SortDropdown,
    NoItem,
    CategorySidebar,
    NotificationModal,
  },
  computed: {
    ...mapGetters('page', ['selectedFilters', 'selectedCategory']),
    ...mapState('page', ['isCategoryFetching']),
    ...mapGetters('category', ['categories', 'allCategory']),
    ...mapGetters('token', ['erc20Tokens']),
  },
  middleware: [],
  mixins: [],
})
export default class Index extends Vue {
  limit = app.uiconfig.defaultPageSize;
  searchInput = null;
  fuzzysearch = fuzzysearch;
  exmptyMsg = {
    title: 'Oops! No item found.',
    description: 'We didn’t found any item that is on sale.',
    img: true,
  };
  showNotification = false;

  sortItems = [
    {
      id: 0,
      name: 'Newest',
      filter: '-created',
    },
    {
      id: 1,
      name: 'Oldest',
      filter: '+created',
    },
    {
      id: 2,
      name: 'Price low to high',
      filter: '+usd_price',
    },
    {
      id: 3,
      name: 'Price high to low',
      filter: '-usd_price',
    },
  ];

  orderFullList = [];
  hasNextPage = true;
  displayTokens = 0;
  isLoadingTokens = false;

  showModal = false;

  mounted() {
    // this.updateCategories();
    // this.fetchOrders();
    this.$store.dispatch("token/reloadBalances");

    if (!localStorage.getItem('WalletSwapFeature')) {
      this.onNotificationOpen();
    }
  }

  // Wathers
  @VueWatch('selectedFilters', { immediate: true, deep: true })
  @VueDebounce(500)
  async onFilterChanged() {
    if (this.isCategoryFetching) {
      return
    }
    this.hasNextPage = true
    this.orderFullList.length = 0
    this.$store.commit('page/setIsCategoryFetching', true)
    await this.fetchOrders({ filtering: true })
    this.$store.commit('page/setIsCategoryFetching', false)
  }

  // handlers
  onSortSelect(item) {
    this.$store.commit('page/selectedSort', item.filter)
  }

  onNotificationOpen() {
    this.showNotification = true;
    localStorage.setItem('WalletSwapFeature', true);
  }

  onNotificationClose() {
    this.showNotification = false;
  }

  onModalShow() {
    this.showModal = true
  }

  onModalClose() {
    this.showModal = false
  }

  // Get
  get displayedTokens() {
    return this.orderFullList || []
  }

  get searchedTokens() {
    const searchedTokensList = []

    if (this.searchInput !== null && this.orderFullList.length > 0) {
      this.orderFullList.forEach((order) => {
        if (
          fuzzysearch(this.searchInput, order.name) ||
          fuzzysearch(this.searchInput, order.tokens_id)
        ) {
          searchedTokensList.push(order)
        }
      })
    } else {
      return this.orderFullList
    }

    return searchedTokensList
  }

  get ifCategory() {
    return this.selectedFilters.selectedCategory
      ? `&categoryArray=[${this.selectedFilters.selectedCategory.id}]`
      : '&categoryArray=[]'
  }

  get ifSort() {
    return this.selectedFilters.selectedSort
      ? `&sort=${this.selectedFilters.selectedSort}`
      : `&sort=${this.sortItems[0].filter}`
  }

  // async

  async fetchOrders(options = {}) {
    // Do not remove data while fetching
    if (this.isLoadingTokens || !this.hasNextPage) {
      return
    }
    this.isLoadingTokens = true
    try {
      let response
      let offset = this.orderFullList.length

      if (options && options.filtering) {
        // Start from page one with new filter
        offset = 0
      }

      // Fetch tokens with pagination and filters
      if (this.searchInput !== null && this.searchInput.length > 0) {
        // with search
        response = await getAxios().get(
          `orders/?offset=${offset}&limit=${this.limit}${this.ifCategory}${this.ifSort}`,
        )
      } else {
        // without search
        response = await getAxios().get(
          `orders/?offset=${offset}&limit=${this.limit}${this.ifCategory}${this.ifSort}`,
        )
      }

      if (response && response.status === 200 && response.data.data.order) {
        this.hasNextPage = response.data.data.has_next_page
        const data = response.data.data.order.map(function(order) {
          return new OrderModel(order)
        })
        if (options && options.filtering) {
          this.orderFullList = data
        } else {
          this.orderFullList = [...this.orderFullList, ...data]
        }
      }
    } catch (error) {
      console.log(error)
    }
    this.isLoadingTokens = false
  }

  updateCategories() {
    this.$store.dispatch('category/fetchCategories')
  }

  async loadMore() {
    await this.fetchOrders()
  }
}
</script>

<style lang="scss" scoped>
@import "~assets/css/theme/_theme";

.sticky-top {
  &.tab-header {
    top: $navbar-local-height !important;
    background-color: light-color("700");
  }
  &.sidebar-container {
    top: $navbar-local-height !important;
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
  height: 90vh;
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
