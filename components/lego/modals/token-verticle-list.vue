<template>
  <div class="row ps-y-10">
    <div class="col-12 d-flex ps-t-12 ps-b-12 wrapper-top">
      <div class="left col-md-8">"count" Collectibles</div>
      <div class="right col-md-4">
        <div
          class="check-container"
          :class="{'checked': isSelected}"
          @click="toggleSelection(!isSelected), selectAll()"
        >
          <input type="checkbox" id="selectAllNft" :checked="isSelected" />
          <span class="checkmark align-self-center"></span>
          <label class="form-check-label" for="selectAllNft">Select all</label>
        </div>

      </div>
    </div>
    <div class="col-12 card-wrapper">
      <div class="row no-gutters card-container mt-1 mb-2" v-for="token in tokens" :key="token.id">
        <div class="col-3">
          <div class="token-img">
            <img
              :src="token.category.img_url"
              :alt="token.category.name"
              class="asset-img mx-auto"
              @load="onImageLoad"
            />
          </div>
        </div>
        <div class="col-7 d-flex flex-column justify-content-center text-left">
          <div class="card-name">{{ token.name }}</div>
          <div class="card-category">{{ token.category.name }}</div>
        </div>
        <div class="col-2 d-flex justify-content-center align-items-center">
          <div class="check-box">
            <td>
              <div
                class="check-container"
                :class="{'checked': isSelected}"
                @click="toggleSelection(!isSelected)"
              >
                <input type="checkbox" :checked="isSelected" />
                <span class="checkmark align-self-center"></span>
              </div>
            </td>
          </div>
        </div>
      </div>
    </div>
    <div class="col-md-12 p-0 transaction-details">
      <div class="top ps-t-12 ps-b-12 border-top">
        <div class="transaction-details__inner d-flex">
          <div class="left col-8">
            <img 
            src="tokens" 
            class="icon align-self-center ms-r-12">
            Collectibles selected
          </div>
          <div class="right col-4">"Count"</div>
        </div>
      </div>
      <div class="bottom ps-t-12 ps-b-12 border-top">
        <div class="transaction-details__inner d-flex">
          <div class="left col-8">
            <img src="~/static/img/est-bolt.svg" alt="Bolt" />
            Estimated Transacton fee
          </div>
          <div class="right col-4">$</div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import Vue from "vue";
import Component from "nuxt-class-component";
import { mapGetters } from "vuex";

@Component({
  props: {
    tokens: {
      type: Array,
      required: true,
    },
  },
  data() {
    return {
      selectedTokens: [],
      allSelected: false,
      selectedCategory: '',
    }
  },
  components: {
  },
  computed: {
    ...mapGetters("token", ["erc20Tokens", "selectedERC20Token"]),
  },
  methods: {
  }
})
export default class TokenVerticleList extends Vue {
  isSelected = false;
  userIds = [];

  async mounted() {}

  onImageLoad() {
    try {
      const img = this.$el.querySelector(".asset-img");
      let rgbColor = colorThief.getColor(img);
      if (rgbColor) {
        let hsl = rgbToHsl({
          r: rgbColor[0],
          g: rgbColor[1],
          b: rgbColor[2]
        });
        this.bg = `hsl(${hsl.h},${hsl.s}%,${hsl.l}%)`;
      } else this.bg = "#f3f4f7";
    } catch (error) {}
  }
  
  // Handlers
  toggleSelection(value) {
    this.isSelected = value;
  }

  selectAll() {
    this.userIds = [];
    for (let token in this.tokens) {
      this.userIds.push(this.tokens[token]);
    }
  }
}
</script>
<style lang="scss" scoped>
@import "~assets/css/theme/_theme";
.asset-img {
  max-width: 112px;
  max-height: 160px;
}

.left {
  color: #6e798f;
  line-height: 22px;
  text-align: left;
}
.right {
  color: #6e798f;
  line-height: 22px;
  text-align: right;
}

.check-container {
  display: flex !important;
  display: none;
  justify-content: flex-end;
  &.checked {
    display: flex !important;
  }

  .checkmark {
    position: relative;
    margin-right: 6px;
  }
}

.wrapper-top {
  font-size: 14px;
  line-height: 20px;
}

.transaction-details {
  &__inner {
    padding: 0 15px;
  }

  img {
    height: 24px;
    width: 24px;
  }
}

.card {
  &-wrapper {
    max-height: 350px;
    overflow: scroll;
  }

  &-container {
    background: #f8f9fa;
    border-radius: 12px;
    margin-left: 15px;
    margin-right: 15px;

    .token-img {
      width: 76px;
      height: 76px;
      margin: 2px;
      border-radius: 10px;
      background: white;

      @media (max-width: 446px) {
        width: 55px;
        height: 55px;
      }
      
      img {
        height: 100%;
        width: 100%;
        padding: 5px;
        margin: 0	;
      }
    }
  }
  
  &-name {
    color: #061024;
    font-size: 14px;
    font-weight: 500;
    line-height: 20px;
  }
  
  &-category {
    color: #6e798f;
    font-size: 14px;
    line-height: 20px;
  }
}
</style>