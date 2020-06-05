<template>
  <div class="container p-0">
    <navbar-section v-if="!query.embed" />
    <div class="content-container">
      <div class="nuxt-section" :class="{'embed':!!query.embed}">
        <nuxt />
      </div>
    </div>
    <!-- <footer-section /> -->
    <!-- <toast></toast> -->
    <!-- <wallet-connect-modal></wallet-connect-modal> -->
  </div>
</template>

<script>
// import FooterSection from "~/components/footer";
import NavbarSection from "~/components/navbar";
// import Toast from "~/components/toast";
// import WalletConnectModal from "~/components/lego/walletconnect-modal";

export default {
  components: {
    // FooterSection,
    NavbarSection
    // Toast,
    // WalletConnectModal
  },
  head() {
    return {
      bodyAttrs: {
        class: this.$route.query.embed ? "embed" : ""
      }
    };
  },
  data() {
    return {
      query: {}
    };
  },
  mounted() {
    this.query = this.$route.query;
  }
};
</script>

<style lang="scss" scoped="true">
@import "~assets/css/theme/_theme";

.nuxt-section {
  margin-top: $navbar-local-height;
}

.logo-container {
  height: 100px;
  background-color: theme-color("primary");
}

.logo {
  height: 26px;
}

.logo-name {
  height: 24px;
}

@media (max-width: 768px) {
  .logo-container {
    height: 60px;
    box-shadow: 0px 5px 8px 0px rgba(0, 0, 0, 0.05);
  }

  .content-container {
    width: 100%;
    margin-top: $navbar-local-height;
    margin-left: 0px;
  }
}
</style>
