<template>
  <div v-if="categories && categories.length > 0">
    <div class="container-fluid p-0 m-0">
      <div class="row categories d-flex flex-column m-0 p-0">
        <div
          class="category d-flex ps-x-16 ps-y-12 cursor-pointer"
          :class="{ active: !selectedCategory }"
          @click="selectCategory(allCategory)"
        >
          <img
            :src="allCategory.img_url"
            :alt="allCategory.name"
            class="icon-all align-self-center"
          />
          <div class="font-body-medium align-self-center text-nowrap ms-l-12">
            {{ allCategory.name }}
          </div>
          <div class="count ps-l-12 font-body-medium ml-auto align-self-center">
            <span v-if="!isLoading || allCategory.count || !isTab">{{
              allCount
            }}</span>
            <span v-if="isLoading && !allCategory.count && isTab">{{
              allCount
            }}</span>
          </div>
        </div>
        <div
          class="category d-flex ps-x-16 ps-y-12 cursor-pointer"
          :class="{
            active: selectedCategory && category.id == selectedCategory.id,
          }"
          v-for="category in categories"
          :key="category.name"
          @click="selectCategory(category)"
        >
          <img
            :src="category.img_url"
            :alt="category.name"
            class="icon align-self-center ms-r-12"
          />
          <div class="font-body-medium align-self-center">
            {{ category.name }}
          </div>
          <div
            class="count ps-l-12 font-body-medium ml-auto align-self-center"
            v-if="!isLoading || category.count || !isTab"
          >
            <span v-if="SHOW_COUNT.ORDER == countFor">
              {{ category.count || 0 }}
            </span>
            <span v-if="SHOW_COUNT.MAIN == countFor">
              {{ category.mainCount || 0 }}
            </span>
            <span v-if="SHOW_COUNT.MATIC == countFor">
              {{ category.maticCount || 0 }}
            </span>
          </div>
          <div
            class="count ps-l-12 font-body-medium ml-auto align-self-center"
            v-if="isLoading && !allCategory.count && isTab"
          >
            0
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Vue from "vue";
import Component from "nuxt-class-component";

import { mapGetters } from "vuex";
import app from "~/plugins/app";
import getAxios from "~/plugins/axios";

const SHOW_COUNT = { ORDER: 0, MATIC: 1, MAIN: 2 };

@Component({
  props: {
    countFor: {
      type: Number,
      required: false,
      default: 0,
    },
    isTab: {
      type: Boolean,
      required: false,
      default: false,
    },
    isLoading: {
      type: Boolean,
      required: false,
      default: false,
    },
  },
  computed: {
    ...mapGetters("page", ["selectedCategory"]),
    ...mapGetters("category", ["categories", "allCategory"]),
  },
})
export default class CategoriesSelector extends Vue {
  showCategory = false;
  SHOW_COUNT = SHOW_COUNT;
  async mounted() {}

  // Actions
  selectCategory(category) {
    if (category.isAll) {
      this.$store.commit("page/selectedCategory", null);
      return;
    }

    this.$store.commit("page/selectedCategory", category);
    this.showCategory = false;
  }

  get allCount() {
    if (
      this.SHOW_COUNT.MATIC == this.countFor &&
      !this.isLoading &&
      this.isTab
    ) {
      return (
        this.categories.reduce((total, category) => {
          if (category.maticCount) {
            total = total + parseInt(category.maticCount);
          }
          return total;
        }, 0) || 0
      );
    } else if (
      this.SHOW_COUNT.MAIN == this.countFor &&
      !this.isLoading &&
      this.isTab
    ) {
      return (
        this.categories.reduce((total, category) => {
          if (category.mainCount) {
            total = total + parseInt(category.mainCount);
          }
          return total;
        }, 0) || 0
      );
    } else if (!this.isTab) {
      console.log("all");
      return this.allCategory.count || 0;
    }
    return 0;
  }

  // Getters
  get defaultSelectedCategory() {
    if (this.selectedCategory) {
      return this.selectedCategory;
    }
    return this.allCategory;
  }
}
</script>

<style lang="scss" scoped="true">
@import "~assets/css/theme/_theme";
.category {
  background-color: light-color("700");
  border-radius: $border-radius-xl;
  box-sizing: border-box;

  .icon-all {
    width: 24px;
    height: 24px;
    margin: 4px;
  }
  .icon {
    width: 32px;
    height: 32px;
  }
  .count {
    color: dark-color("300") !important;
  }
}

.container-fluid {
  .categories {
    width: 100%;
    border-radius: $border-radius-xl;
    background-color: light-color("700");
    .category {
      border: none;
      width: 100%;
      &:hover,
      &.active {
        background: light-color("600");
      }
    }
  }
}

@media (max-width: 768px) {
}
</style>
