<template>
  <nav class="navbar navbar-expand-lg fixed-top p-0">
    <div class="container-fluid h-100">
      <div class="row mx-auto ps-x-16 w-100 h-100">
        <nuxt-link
          class="logo-container d-flex"
          :to="{ name: 'index' }"
        >
          <button
            class="navbar-toggler"
            role="button"
            type="button"
            :class="{ open: openMenu }"
            @click.prevent.stop="handleOpenMenu(!openMenu)"
          >
            <svg-sprite-icon
              name="grabber"
              class="icon navbar-toggler-icon"
            />
            <svg-sprite-icon
              name="close"
              class="icon close-icon"
            />
          </button>
          <div class="d-flex">
            <div class="d-flex">
              <img
                src="~assets/img/open-sea-logo.svg"
                alt="Open Sea Logo"
                class="logo align-self-center"
              >
            </div>
            <div
              class="d-flex flex-column justify-content-center logo-desc-container"
            >
              <div>
                <span class="logo-title">OpenSea</span>
                <span class="logo-product-name">L2</span>
                <span class="tag">BETA</span>
              </div>
              <div class="logo-description">
                Powered by Matic Network
              </div>
            </div>
          </div>
        </nuxt-link>
        <div
          class="navbar-collapse collapse d-flex col p-0 justify-content-center"
          :class="{ show: openMenu }"
          @click="handleOpenMenu(!openMenu)"
        >
          <ul class="navbar-nav main-nav mx-md-auto">
            <li class="nav-item">
              <nuxt-link
                class="nav-link d-flex justify-content-lg-center"
                :to="{ name: 'index' }"
                :class="{ active: checkIfNestedRoute('index') }"
              >
                <span class="align-self-center">{{ $t("home.title") }}</span>
              </nuxt-link>
            </li>
            <li class="nav-item">
              <nuxt-link
                class="nav-link d-flex justify-content-lg-center"
                :to="{ name: 'account' }"
                :class="{ active: checkIfNestedRoute('account') }"
              >
                <span class="align-self-center">{{ $t("account.title") }}</span>
              </nuxt-link>
            </li>
            <li class="nav-item">
              <nuxt-link
                class="nav-link d-flex justify-content-lg-center"
                :to="{ name: 'faq' }"
                :class="{ active: checkIfNestedRoute('faq') }"
              >
                <span class="align-self-center">{{ $t("faq.title") }}</span>
              </nuxt-link>
            </li>
            <li class="nav-item">
              <a
                class="nav-link d-flex justify-content-lg-center"
                href="https://wallet-support.matic.network/portal/en/newticket"
                rel="noopener noreferrer"
                target="_blank"
              >
                <span class="align-self-center">{{ $t("support.title") }}</span>
              </a>
            </li>
            <li class="nav-item d-md-none">
              <div
                v-if="user"
                class="d-flex ms-x-16 nav-profile-container align-self-center"
                @click.prevent.stop="handleOpenProfile(!openProfile)"
              >
                <img src="~assets/svg/metamask.svg">
                <span class="navbar-user-address">
                  {{ formattedUserAddress }}
                </span>

                <span
                  class="down-icon align-self-center d-none d-md-flex justify-content-center"
                >
                  <svg-sprite-icon
                    class="align-self-center"
                    name="right-arrow"
                  />
                </span>
              </div>
            </li>
            <li class="nav-item d-md-none">
              <nuxt-link
                v-if="!user"
                class="ms-x-16 align-self-center btn btn-primary login-button d-flex"
                role="button"
                :to="{ name: 'login' }"
              >
                <span class="d-flex with-icon">
                  <svg-sprite-icon
                    name="login"
                    class="align-self-center"
                  />
                </span>
                <span>{{ $t("login") }}</span>
              </nuxt-link>
            </li>
            <div class="extra-links">
              <li class="nav-item">
                <a
                  class="nav-link d-flex justify-content-lg-center"
                  href="#"
                  rel="noopener noreferrer"
                  target="_blank"
                >
                  <span class="align-self-center">{{ $t("whatsNew") }}</span>
                </a>
              </li>
              <li class="nav-item">
                <a
                  class="nav-link d-flex justify-content-lg-center"
                  href="#"
                  rel="noopener noreferrer"
                  target="_blank"
                >
                  <span class="align-self-center">{{ $t("helpCenter") }}</span>
                </a>
              </li>
            </div>
          </ul>
        </div>
        <div class="d-none d-sm-flex profile-navbar ml-auto ps-l-16">
          <div
            v-if="user && false"
            class="d-flex align-self-center"
          >
            <nuxt-link
              class="nav-link d-flex"
              :to="{ name: 'index-notification' }"
              :class="{ active: checkIfNestedRoute('index-notification') }"
            >
              <span class="notification-icon d-flex justify-content-center">
                <svg-sprite-icon
                  name="notification"
                  class="align-self-center"
                />
              </span>
            </nuxt-link>
          </div>
          <div
            v-if="user"
            class="d-flex nav-profile-container align-self-center"
            @click.prevent.stop="handleOpenProfile(!openProfile)"
          >
            <img src="~assets/svg/metamask.svg">
            <span class="navbar-user-address">
              {{ formattedUserAddress }}
            </span>

            <span
              class="down-icon align-self-center d-none d-md-flex justify-content-center"
            >
              <svg-sprite-icon
                class="align-self-center"
                name="right-arrow"
              />
            </span>
          </div>

          <ul
            v-if="!user"
            class="navbar-nav right-nav ps-x-16 pr-1"
          >
            <li class="nav-item d-flex">
              <nuxt-link
                class="align-self-center btn btn-primary login-button d-flex"
                role="button"
                :to="{ name: 'login' }"
              >
                <span class="d-flex with-icon">
                  <svg-sprite-icon
                    name="login"
                    class="align-self-center"
                  />
                </span>
                <span>{{ $t("login") }}</span>
              </nuxt-link>
            </li>
          </ul>
        </div>
      </div>
    </div>
    <!-- Profile Dropdown -->
    <div
      v-if="openProfile"
      v-click-outside="() => (openProfile = false)"
      class="profile-dropdown-menu no-top-border-radius dropdown-menu dropdown-menu-right show"
    >
      <div class="profile-container">
        <div class="d-flex ps-16 ps-md-32">
          <span class="profile-icon profile-with-status align-self-center">
            <svg-sprite-icon
              name="profile"
              class="profile-logo"
            />
            <!-- <svg-sprite-icon v-if="!userProfilePic" name="profile" class="profile-logo"></svg-sprite-icon> -->
            <!-- <img v-if="userProfilePic" :src="userProfilePic" :alt="formattedUserAddress" /> -->
            <div class="profile-status d-none">
              <svg
                class="status-icon"
                width="32"
                height="32"
                viewBox="0 0 32 32"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <g filter="url(#filter0_d)">
                  <circle
                    cx="16"
                    cy="15"
                    r="12"
                    fill="white"
                  />
                </g>
                <path
                  fill-rule="evenodd"
                  clip-rule="evenodd"
                  d="M19.6095 11H21.3335C22.0688 11 22.6668 11.598 22.6668 12.3333V19.6667C22.6668 20.402 22.0688 21 21.3335 21H10.6668C9.9315 21 9.3335 20.402 9.3335 19.6667V12.3333C9.3335 11.598 9.9315 11 10.6668 11H12.3908L14.1955 9.19534C14.2573 9.13331 14.3308 9.08412 14.4117 9.05059C14.4925 9.01707 14.5793 8.99988 14.6668 9H17.3335C17.4211 8.99988 17.5078 9.01707 17.5887 9.05059C17.6696 9.08412 17.743 9.13331 17.8048 9.19534L19.6095 11ZM12.6668 15.6667C12.6668 17.4733 14.1935 19 16.0002 19C17.8068 19 19.3335 17.4733 19.3335 15.6667C19.3335 13.86 17.8068 12.3333 16.0002 12.3333C14.1935 12.3333 12.6668 13.86 12.6668 15.6667ZM14 15.6665C14 14.5825 14.916 13.6665 16 13.6665C17.084 13.6665 18 14.5825 18 15.6665C18 16.7505 17.084 17.6665 16 17.6665C14.916 17.6665 14 16.7505 14 15.6665Z"
                  fill="#6E798F"
                />
                <defs>
                  <filter
                    id="filter0_d"
                    x="0"
                    y="0"
                    width="32"
                    height="32"
                    filterUnits="userSpaceOnUse"
                    color-interpolation-filters="sRGB"
                  >
                    <feFlood
                      flood-opacity="0"
                      result="BackgroundImageFix"
                    />
                    <feColorMatrix
                      in="SourceAlpha"
                      type="matrix"
                      values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
                    />
                    <feOffset dy="1" />
                    <feGaussianBlur stdDeviation="2" />
                    <feColorMatrix
                      type="matrix"
                      values="0 0 0 0 0.0235294 0 0 0 0 0.0627451 0 0 0 0 0.141176 0 0 0 0.12 0"
                    />
                    <feBlend
                      mode="normal"
                      in2="BackgroundImageFix"
                      result="effect1_dropShadow"
                    />
                    <feBlend
                      mode="normal"
                      in="SourceGraphic"
                      in2="effect1_dropShadow"
                      result="shape"
                    />
                  </filter>
                </defs>
              </svg>
            </div>
          </span>
          <div class="ps-l-20 profile-details w-100">
            <div class="d-flex w-100">
              <div class="font-body-small font-medium">
                {{ formattedUserAddress }}
              </div>
              <div class="font-caption ml-auto text-gray">
                {{ rootChainNetwork.name || rootChainNetwork.key }}
              </div>
            </div>
            <div
              v-if="account"
              class="d-flex justify-content-center ps-t-12"
              @click.stop.prevent="copyAddress"
            >
              <div class="profile-address d-flex w-100">
                <div
                  class="col p-0 d-none d-md-block address mr-auto align-self-center"
                >
                  {{ account.address }}
                </div>
                <div
                  class="col p-0 d-block d-md-none address mr-auto align-self-center"
                >
                  {{ account.shortChecksumAddress }}
                </div>
                <div class="copy-wrapper justify-content-center">
                  <svg-sprite-icon
                    v-if="copyAnim === false"
                    class="copy-icon align-self-center"
                    name="copy"
                  />

                  <lottie
                    v-if="copyAnim === true"
                    class="copy-anim align-self-center"
                    :options="defaultOptions"
                    :width="24"
                    :height="24"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="dropdown-divider" />
        <div class="d-flex ps-6 ps-md-12">
          <ul class="profile-option-list w-100">
            <li
              class="option-item"
              @click="openQrCode = !openQrCode"
            >
              <div class="d-flex">
                <div class="align-self-center">
                  <img
                    src="~/static/icons/qr-code.svg"
                    alt="qr-code"
                    class="option-icon inactive"
                  >
                  <img
                    src="~/static/icons/active/qr-code.svg"
                    alt="qr-code"
                    class="option-icon active"
                  >
                </div>
                <div
                  class="option-text font-body-medium align-self-center ps-x-16"
                >
                  Show QR Code
                </div>
                <div
                  class="align-elf-center d-flex justify-content-center ml-auto"
                >
                  <svg
                    class="align-self-center right-arrow"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M13.2929 12L8 6.70706L9.41421 5.29285L16.1213 12L9.41421 18.7071L8 17.2928L13.2929 12Z"
                      fill="#B4B7BD"
                    />
                  </svg>
                </div>
              </div>
            </li>

            <li
              class="option-item"
              @click="openLogout = true"
            >
              <div class="d-flex">
                <div class="align-self-center">
                  <img
                    src="~/static/icons/logout.svg"
                    alt="qr-code"
                    class="option-icon inactive"
                  >
                  <img
                    src="~/static/icons/active/logout.svg"
                    alt="qr-code"
                    class="option-icon active"
                  >
                </div>
                <div
                  class="option-text font-body-medium align-self-center ps-x-16"
                >
                  Logout
                </div>
                <div
                  class="align-elf-center d-flex justify-content-center ml-auto"
                >
                  <svg
                    class="align-self-center right-arrow"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M13.2929 12L8 6.70706L9.41421 5.29285L16.1213 12L9.41421 18.7071L8 17.2928L13.2929 12Z"
                      fill="#B4B7BD"
                    />
                  </svg>
                </div>
              </div>
            </li>
          </ul>
        </div>
      </div>
    </div>
    <!-- ./ Profile Dropdown -->
    <receive-qr-code
      v-if="user"
      :show="openQrCode"
      :uri="account.address"
      :close="qrClose"
    />
    <logout-confirm
      :show="openLogout"
      :logout="logout"
      :close="logoutClose"
    />
  </nav>
</template>

<script>
import Vue from 'vue'
import { mapGetters } from 'vuex'
import Component from 'nuxt-class-component'

import copy from 'copy-to-clipboard'
import Lottie from 'vue-lottie'

import ReceiveQrCode from '~/components/lego/receive-qr-code'
import LogoutConfirm from '~/components/lego/logout-confirm'

import * as animationData from '~/static/lottie-animations/green-check.json'

@Component({
  props: {},
  components: { Lottie, ReceiveQrCode, LogoutConfirm },
  computed: {
    ...mapGetters('auth', ['user']),
    ...mapGetters('account', ['account']),
    ...mapGetters('network', ['selectedNetwork', 'rootChainNetwork']),
  },
  methods: {},
})
export default class Navbar extends Vue {
  defaultOptions = { animationData: animationData.default, loop: false };
  animationSpeed = 2;
  openMenu = false;
  openProfile = false;
  copyAnim = false;
  authenticated = false;
  isAnonymous = false;
  nextNetwork = null;
  confirmLoading = false;
  openQrCode = false;
  openLogout = false;

  currentNetwork = {
    key: 'matic',
    name: 'Matic',
  };

  checkIfNestedRoute(...names) {
    if (this.$route && this.$route.name) {
      for (let index = 0; index < names.length; index++) {
        const name = names[index]
        if (this.$route.name.startsWith(name)) {
          return true
        }
      }
    }
    return false
  }

  copyAnimation(show) {
    this.copyAnim = show
  }

  copyAddress() {
    this.copyAnimation(true)
    copy(this.account.checksumAddress || this.account.address)
    setTimeout(() => {
      this.copyAnimation(false)
    }, 3000)
  }

  handleOpenMenu(status) {
    if (status) {
      this.openMenu = true
      this.openProfile = !this.openMenu
    } else {
      this.openMenu = this.openProfile = false
    }
  }

  handleOpenProfile(status) {
    if (status) {
      this.openProfile = true
      this.openMenu = !this.openProfile
    } else {
      this.openMenu = this.openProfile = false
    }
  }

  qrClose() {
    this.openQrCode = false
  }

  logoutClose() {
    this.openLogout = false
  }

  get formattedUserAddress() {
    if (this.account && this.account.address) {
      if (this.account.name) {
        return this.account.name
      }

      const start = this.account.address.slice(0, 4)
      const length = this.account.address.length
      const end = this.account.address.slice(length - 4)
      return start + '...' + end
    }
    return ''
  }

  get userProfilePic() {
    try {
      return user.photoURL
    } catch (error) {
      return false
    }
  }

  async logout() {
    await this.$store.dispatch('auth/logout')
    this.$router.push({ name: 'index' })
    this.openLogout = false
  }
}
</script>

<style lang="scss" scoped>
@import "~assets/css/theme/_theme";

.col {
  flex-basis: 0 !important;
  flex-grow: 1 !important;
}

.tag {
  background: primary-color("200");
  border-radius: 3px;
  color: primary-color("600");
  font-size: font-size("body-small");
  font-weight: 500;
  padding: 4px 5px;
}

.logo-container {
  .logo {
    height: 40px;
  }

  .logo-desc-container {
    margin-left: 12px;

    .logo-title {
      color: #3291e9;
    }
    .logo-product-name {
      color: dark-color("300");
    }
    .logo-description {
      font-size: font-size("body-small");
      color: dark-color("500");
    }
  }
}

.user-name,
.network-method {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.navbar {
  height: $navbar-local-height;
  background-color: light-color("700");
  box-shadow: 0px 2px 4px rgba(0, 0, 0, 0.05);

  .navbar-toggler {
    outline: none;
    border: none;
    padding: 0px;
    padding-right: 24px;

    .icon {
      fill: dark-color("700");
      height: 16px;
      width: 16px;
    }

    .close-icon {
      display: none;
    }

    &.open {
      .navbar-toggler-icon {
        display: none;
      }

      .close-icon {
        display: inline-block;
      }
    }
  }

  .navbar-collapse {
    height: 100%;
  }

  .navbar-nav,
  .nav-item {
    height: 100%;
  }

  .right-nav {
    padding-right: 30px;
    .nav-item {
      padding-right: 0px;
    }
  }

  .main-nav {
    background-color: light-color("700");

    .nav-link {
      height: 100%;
      padding-left: 15px;
      padding-right: 15px;
      color: dark-color("500");
      padding-bottom: 2px;
      &.active {
        @include font-setting("body-medium", "medium");
        border-bottom: 2px solid $link-color;
        padding-bottom: 0px;
        color: $link-color;
      }
    }
  }

  .extra-links {
    display: none;
  }

  .login-button {
    span.with-icon {
      margin-right: 7px;
    }

    svg {
      height: 20px;
      width: 20px;
      fill: light-color("700");
      transform: rotate(180deg);
    }
  }

  .notification-icon {
    position: relative;
    height: 40px;
    width: 40px;
    border-radius: 50%;
    &:hover {
      background-color: light-color("500");
    }

    cursor: pointer;
    .svg-sprite-icon {
      position: absolute;
      height: 20px;
      width: 16px;
    }
  }

  .nav-profile-container {
    cursor: pointer;
    background: light-color("500");
    padding: 10px 18px 10px 14px;
    border-radius: 24px;

    .navbar-user-address {
      @include font-setting("body-medium", "400");
      margin: 0 13px 0 10px;
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
  }
}

.profile-navbar {
  height: 100%;
  border-left: 1px solid light-color("500");

  .network-switch-nav {
    border-right: 1px solid light-color("500");
  }

  .profile-with-status {
    display: flex;

    .profile-logo {
      width: 32px;
      height: 32px;
      border-radius: 20px;
    }
    .profile-status {
      position: absolute;
      align-self: flex-end;
      z-index: 22;
    }
    .status-icon {
      width: 10px;
      height: 10px;
    }
    .status-icon.matic circle {
      fill: primary-color("500");
    }
    .status-icon.main circle {
      fill: green-color("500");
    }
    .status-icon.other circle {
      fill: dark-color("700");
    }
  }
}

.profile-dropdown-menu {
  // width: 446px;
  position: absolute;
  right: 0;
  color: dark-color("700");
  border-radius: 16px;
  max-width: 445px;
  width: 100%;

  .logout-dropdown-item {
    padding: 24px;
  }

  .profile-address {
    background-color: light-color("500");
    border-radius: 4px;
    padding: 0 12px;
    height: 34px;
    cursor: pointer;
    white-space: nowrap;

    overflow: hidden;
    text-overflow: ellipsis;

    .address {
      font-weight: 500;
      font-size: 10px;
      letter-spacing: 0.04em;
      text-transform: uppercase;
      color: dark-color("300");
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }
    &:hover .copy-wrapper {
      display: flex;
    }
  }

  .copy-wrapper {
    display: none;
    height: 34px;
    width: 34px;
    background: #dcdfe6;
    border-radius: 4px;
    margin-left: -22px;
    margin-right: -12px;
    z-index: 99;
  }
  .copy-icon {
    fill: dark-color("300");
  }

  .logout-icon {
    fill: dark-color("500");
    width: 20px;
    height: 20px;
    margin-right: 5px;
  }
  .profile-container {
    .profile-icon {
      width: 64px;
      height: 64px;
    }
    .profile-with-status {
      display: flex;

      .profile-logo {
        width: 64px;
        height: 64px;
      }
      .profile-status {
        position: absolute;
        align-self: flex-end;
        z-index: 22;
        margin-left: 36px;
        margin-top: 4px;
      }
    }
  }

  .profile-option-list {
    list-style: none;
    margin: 0;
    padding: 0;
  }
  .option-item {
    padding: 12px 20px;
    border-radius: 4px;
    cursor: pointer;

    .option-text {
      color: dark-color("500");
    }

    .option-icon.active {
      display: none;
    }
    .option-icon.inactive {
      display: block;
    }

    .right-arrow {
      height: 24px;
      width: 24px;
    }

    &:hover {
      background-color: light-color("600");

      .option-text {
        color: primary-color("600");
      }
      .option-icon.inactive {
        display: none;
      }
      .option-icon.active {
        display: block;
      }

      .right-arrow path {
        fill: primary-color("600");
      }
    }
  }
}

@media (max-width: 992px) {
  .navbar {
    .navbar-collapse {
      display: none !important;
      position: fixed;
      top: $navbar-local-height;
      bottom: 0;
      left: 0;
      right: 0;
      height: auto;
      background-color: rgba(dark-color("700"), 0.3);
      width: 100%;
      height: auto;

      &.show {
        display: block !important;

        .main-nav {
          background-color: light-color("700");
          width: 100%;
          flex-direction: column;
          height: auto;
          border-top: 1px solid light-color("500");
          border-bottom-left-radius: 12px;
          border-bottom-right-radius: 12px;
          padding-bottom: 8px;

          .nav-link {
            padding: 10px 20px;
            &.active {
              border-bottom: 0;
            }
          }
        }

        .extra-links {
          display: none;
          // border-top: 1px solid light-color("500");
        }
      }
    }

    .navbar-nav {
      flex-direction: row;
    }
  }
}

@media (max-width: 768px) {
  .network-switch-dropdown,
  .profile-dropdown-menu,
  .profile-address,
  .profile-details {
    width: 100% !important;
  }
}

@media (max-width: 420px) {
  .product-text {
    display: none;
  }
}
</style>
