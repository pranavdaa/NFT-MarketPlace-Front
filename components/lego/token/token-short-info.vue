<template>
  <div class="d-flex short-info">
    <div class="profile-img-wrapper align-self-center">
      <img :src="category.img_url" :alt="category.name" />
      <div class="profile-status d-flex justify-content-center ps-2 ms-l-40">
        <svg-sprite-icon name="profile" class="status-icon align-self-center" />
      </div>
    </div>
    <div class="profile-info-wrapper align-self-center d-flex flex-column ps-16">
      <h1 class="font-heading-medium font-semibold ms-b-8">{{order.token.name}} {{order.token_type==='ERC1155'? '('+ order.quantity +')': ''}}</h1>
      <div class="font-body-small owner-info">
        Owned by
        <a href @click.prevent>{{shortAddress}}</a> in
        <a
          :href="order.external_link"
          target="_blank"
          rel="noopener noreferrer"
          >{{category.name}}
        </a>
      </div>
    </div>
  </div>
</template>

<script>
import Vue from "vue";
import Component from "nuxt-class-component";

@Component({
  props: {
    order: {
      type: Object,
      required: false
    },
    category: {
      type: Object,
      required: true
    }
  },
  components: {},
  computed: {},
  middleware: [],
  mixins: []
})
export default class TokenShortInfo extends Vue {
  mounted() {}

  get shortAddress() {
    const address = this.order.token.owner;
    if (address) {
      const addressStart = address.slice(0, 4);
      const addressEnd = address.slice(address.length - 4);
      return addressStart + "..." + addressEnd;
    }
    return null;
  }
}
</script>

<style lang="scss" scoped>
@import "~assets/css/theme/_theme";
.short-info {
  .profile-img-wrapper {
    display: flex;
    width: 68px;

    img {
      width: 52px;
      height: 52px;
      border-radius: 20px;
    }
    .profile-status {
      position: absolute;
      align-self: flex-end;
      background: light-color("700");
      border-radius: 50%;
    }
    .status-icon {
      width: 24px;
      height: 24px;
    }
  }
  .profile-info-wrapper {
    .owner-info {
      color: dark-color("500");
    }
  }
}
</style>
