<template>
  <div>
    <div
      class="category d-flex ps-x-16 ps-y-12 cursor-pointer w-100"
      @click="showCategory = !showCategory"
    >
      <img
        :src="selectedCategory.icon"
        :alt="selectedCategory.title"
        class="icon align-self-center ms-r-12"
      />
      <div class="font-body-small align-self-center font-medium">{{selectedCategory.title}}</div>
      <span class="down-icon align-self-center d-flex justify-content-center ps-l-12 ml-auto">
        <svg-sprite-icon class="align-self-center" name="right-arrow"></svg-sprite-icon>
      </span>
    </div>
    <div class="modal fade show" v-if="showCategory">
      <div class="container-fluid ms-l-16 ms-l-lg-32 ms-t-32">
        <div class="row categories d-flex flex-column ps-12">
          <div
            class="category d-flex ps-x-16 ps-y-12 cursor-pointer"
            v-for="category in categories"
            :key="category.title"
            @click="selectCategory(category)"
          >
            <img :src="category.icon" :alt="category.title" class="icon align-self-center ms-r-12" />
            <div class="font-body-small align-self-center font-medium">{{category.title}}</div>
            <div class="count ps-l-12 font-body-medium ml-auto">{{category.count}}</div>
          </div>
        </div>
      </div>
    </div>
    <div class="modal-backdrop" v-bind:class="{ 'show': showCategory }"></div>
  </div>
</template>

<script>
import Vue from "vue";

import Component from "nuxt-class-component";

@Component({
  props: {}
})
export default class CategoriesSelector extends Vue {
  categories = [
    {
      icon: require("~/assets/svg/category.svg"),
      title: "All Categories",
      count: 3224
    },
    {
      icon: require("~/assets/svg/cryptokitty.svg"),
      title: "Cryptokitty",
      count: 352
    },
    {
      icon: require("~/assets/svg/gods-unchain.svg"),
      title: "Gods Unchain",
      count: 1243
    }
  ];
  showCategory = false;
  selectedCategory = this.categories[0];
  mounted() {}

  selectCategory(category) {
    this.selectedCategory = category;
    this.showCategory = false;
  }
}
</script>

<style lang="scss" scoped="true">
@import "~assets/css/theme/_theme";
.category {
  width: fit-content;
  background-color: light-color("700");
  border-radius: $border-radius-xl;
  border: 1px solid light-color("400");
  box-sizing: border-box;

  .icon {
    width: 20px;
    height: 20px;
  }

  .down-icon {
    width: 24px;
    height: 24px;
    .svg-sprite-icon {
      width: 10px;
      height: 14px;
      fill: rgba(dark-color("700"), 0.4);
      transform: rotate(90deg);
    }
  }
  .count {
    color: dark-color("300");
  }
}

.modal.show {
  padding: 0px !important;
}
.container-fluid {
  padding-top: $navbar-local-height;

  .categories {
    max-width: 348px;
    width: 100%;
    border-radius: $border-radius-xl;
    background-color: light-color("700");
    .category {
      border: none;
      width: 100%;
      &:hover {
        background: light-color("600");
      }
    }
  }
}

@media (max-width: 767px) {
  .container-fluid {
    margin-left: auto;
    margin-right: auto;
    .row {
      margin: 0px !important;
    }
    .categories {
      max-width: 100%;
      width: 100%;
    }
  }
}
</style>
