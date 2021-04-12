<template>
  <div class="toast-container font-body-medium">
    <div :key="item.id" class="tt" v-for="item in toasts">
      <div class="tt-header d-flex" v-if="!item.details">
        <div class="tt-header-container d-flex mr-auto">
          <div class="mr-3">
            <svg-sprite-icon
              name="dummy"
              class="tt-icon align-self-center"
              :class="item.type"
            ></svg-sprite-icon>
          </div>
          <div class="align-self-center">{{ item.title }}</div>
        </div>
        <div
          class="tt-close-container d-flex align-self-stretch justify-content-center"
          @click="removeToast(item)"
        >
          <svg-sprite-icon
            v-if="item.closeButton"
            name="close"
            class="align-self-center close-icon"
          ></svg-sprite-icon>
          <div
            class="text-button font-body-medium font-medium align-self-center"
            v-if="!item.closeButton"
          >
            Dismiss
          </div>
        </div>
      </div>

      <div class="tt-details-header d-flex" v-if="item.details">
        <div class="mr-3">
          <svg-sprite-icon
            name="dummy"
            class="tt-icon align-self-center"
            :class="item.type"
          ></svg-sprite-icon>
        </div>
        <div class="tt-body-container w-100">
          <div class="font-semibold mb-2">{{ item.title }}</div>
          <div class="mb-4">{{ item.details }}</div>
          <div class="d-flex justify-content-end">
            <button class="btn btn-sm btn-light mr-2" v-if="item.acceptButton">
              Accept
            </button>
            <button class="btn btn-sm" @click="removeToast(item)">
              Dismiss
            </button>
          </div>
        </div>
      </div>
      <!-- <div class="tt-body" v-if="item.details">
        <a target="_blank" v-if="item.link" :href="item.link" rel="noopener noreferrer">{{ item.details }}</a>
        <span v-if="!item.link">{{ item.details }}</span>
      </div>-->
    </div>
  </div>
</template>

<script>
import Vue from "vue";
import Component from "nuxt-class-component";
import app from "~/plugins/app";

@Component({
  props: {},
  components: {},
})
export default class Toast extends Vue {
  toasts = null;

  constructor() {
    super();
    this.toasts = [];
  }

  mounted() {
    // new toast
    app.bus.$on("toast:add", (title, options) => {
      if (title) {
        options = options || {};
        options.title = title;
        options.type = options.type || "success";
        options.id = `${Date.now()}:${this.toasts.length}`;

        this.toasts.unshift(options);
        if (!options.sticky) {
          options._tid = setTimeout(
            this.removeToast,
            options.timeout || 3000,
            options
          );
        }
      }
    });
  }

  removeToast(t) {
    for (let i = 0; i < this.toasts.length; i += 1) {
      if (this.toasts[i].id === t.id) {
        this.toasts[i]._tid && clearTimeout(this.toasts[i]._tid);
        this.toasts.splice(i, 1);
        break;
      }
    }
  }
}
</script>

<style lang="scss" scoped="true">
@import "~assets/css/theme/_theme";

$toast-width: 400px;

// scss
.toast-container {
  position: fixed;
  width: $toast-width;
  right: 15px;
  bottom: 15px;
  z-index: 1900;
}

.tt {
  background-color: dark-color("700");
  color: light-color("700");
  border-radius: $border-radius-lg;
  margin-top: 10px;

  .tt-header-container {
    padding: 16px;
  }

  .tt-details-header {
    padding: 16px;
  }

  .tt-close-container {
    padding-left: 20px;
    padding-right: 20px;
    cursor: pointer;
    padding: 16px;
    border-top-right-radius: $border-radius-lg;
    border-bottom-right-radius: $border-radius-lg;

    &:hover {
      background-color: dark-color("600");
    }

    .close-icon {
      width: 12px;
      height: 12px;
      fill: light-color("100");
    }

    .text-button {
      color: light-color("700");
    }
  }
}

.tt-body {
  padding: 16px;
}

.tt-icon {
  width: 24px;
  height: 24px;
  fill: light-color("700");

  &.success {
    fill: theme-color("success");
  }

  &.danger {
    fill: theme-color("danger");
  }

  &.warning {
    fill: theme-color("warning");
  }
}
</style>
