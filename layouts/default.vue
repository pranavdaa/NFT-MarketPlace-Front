<template>
  <div v-if="!isMobileDevice" class="container-fluid p-0">
    <navbar-section />
    <div class="content-container">
      <div class="nuxt-section">
        <nuxt />
      </div>
    </div>
    <toast></toast>
  </div>
  <div v-else class="mobile-view-disabled">
    <h1 class="text-center warning-symbol">⚠️</h1>
    <h1 class="text-center title ms-b-20">Oops!</h1>
    <div class="font-body-large description">
      <p>This app is not available for mobile devices currently.</p>
      <p class="ms-t-12">
        We are working hard to enable it in the future. In the meantime, please
        open this site on your laptop or desktop device.
      </p>
    </div>
  </div>
</template>

<script>
import NavbarSection from "~/components/navbar";
import Toast from "~/components/toast";

export default {
  components: {
    NavbarSection,
    Toast,
  },

  created() {
    this.isMobileDevice = window.innerWidth < 768;
  },
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
.content-container {
  margin-top: $navbar-local-height;
}

.mobile-view-disabled {
  background: #fff;
  height: 100vh;
  padding: 30% 15% 10%;

  .title {
    color: rgb(32, 33, 36);
  }
  .description {
    color: #5f6368;
  }

  .warning-symbol {
    font-size: 4rem;
  }
}

@media (max-width: 768px) {
  .logo-container {
    height: 60px;
    box-shadow: 0px 5px 8px 0px rgba(0, 0, 0, 0.05);
  }
}
</style>
