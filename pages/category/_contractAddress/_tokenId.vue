<template>
  <div class="container-fluid p-0">
    <nft-detail
      v-if="chainId"
      :tokenId="tokenId"
      :chainId="chainId"
      :contractAddress="contractAddress"
    />
  </div>
</template>

<script>
import Vue from 'vue'
import Component from 'nuxt-class-component'

import NftDetail from '~/components/lego/token/nft-detail'

@Component({
  props: {},
  components: {
    NftDetail,
  },
  middleware: [],
  mixins: [],
})
export default class Token extends Vue {
  get contractAddress() {
    return this.$route.params.contractAddress
  }

  get tokenId() {
    return this.$route.params.tokenId
  }

  get chainId() {
    return this.$route.query.chainId
  }
}
</script>

<style lang="scss" scoped>
@import "~assets/css/theme/_theme";
</style>
