<template>
  <div class="container-fluid p-0">
    <nft-detail v-if="tokenId" :tokenId="tokenId" :chainId="chainId" />
  </div>
</template>

<script>
import Vue from "vue";
import Component from "nuxt-class-component";

import NftDetail from "~/components/lego/token/nft-detail";

@Component({
  props: {},
  components: {
    NftDetail
  },
  middleware: [],
  mixins: []
})
export default class Token extends Vue {
  tokenId = null;

  mounted() {
    this.tokenId = this.$route.params.tokenId;
    this.chainId = this.$route.params.chainId;
  }
}
</script>

<style lang="scss" scoped>
@import "~assets/css/theme/_theme";
</style>