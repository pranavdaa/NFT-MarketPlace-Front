<template>
  <div class="container-fluid">
    <div class="row ps-y-32 ps-x-16" v-if="true">
      <div
        class="col-12 col-lg cat-switch d-flex ms-b-16 ms-b-lg-0 justify-content-between justify-content-lg-start"
      >
        <categories-selector class="ms-r-16 category-wrapper" />
      </div>
      <div class="col-12 col-lg search-sort d-flex justify-content-between justify-content-lg-end">
        <search-box class="search-box ms-r-16" placeholder="Search NFT..." :change="(val) => val" />
        <sort-dropdown class="dropdown-filter" :sortItems="sortItems" :change="(val) => val" />
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
    ...mapGetters("account", ["favouriteOrders"]),
  },
  middleware: [],
  mixins: [],
})
export default class FavoriteTab extends Vue {
  orders = [
    {
      id: 1,
      price: "0.113",
      categories_id: 1,
      erc20tokens_id: 1,
      token: {
        name: "Kitty Kitten cat",
        img_url: "/_nuxt/static/img/dummy-kitty.png",
        owner: "0x840d3719dea3615bcD137a88c2215B3dd4B6330e",
      },
    },
  ];

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

  exmptyMsg = {
    title: "Oops! No favorite item found.",
    description: "We didn’t found any item in your favorite list.",
    img: true,
  };

  mounted() {}
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
