<template>
  <div class="container fixed faq">
    <div class="row faq-container">
      <div class="col-12">
        <h2 class="collapsible-head">FAQ</h2>
        <div class="section">
          <accordion>
            <accordion-item v-for="faq in FAQS" :key="faq.index">
              <template slot="accordion-header">
                <div class="font-body-medium">
                  {{ faq.question }}
                </div>
                <span class="spin">+</span>
              </template>

              <template slot="accordion-content">
                <div
                  class="font-body-medium ps-t-20 text-gray-500"
                  v-html="faq.answer"
                ></div>
              </template>
            </accordion-item>
          </accordion>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Vue from "vue";
import Component from "nuxt-class-component";

import Accordion from "~/components/lego/accordion";
import AccordionItem from "~/components/lego/accordion-item";

const FAQS = [
  {
    question: "NFT Marketplace URL ?",
    answer: `<a href="https://matic.opensea.io/" target="_blank">https://matic.opensea.io/</a>`
  },
  {
    question: "Support Query Link - Telgram, Discord ?",
    answer:
      "It has been decided to handle all support queries using a ticketing system. Links should be available soon."
  },
  {
    question: "Supported Wallets ?",
    answer: "Metamask"
  },
  {
    question: "What is NFT Marketplace ?",
    answer:
      "It is a exchange platform for ERC721 and ERC1155 collectibles. Users can place sell orders and also buy the different orders placed by others on the platform. It is on the matic platform and facilitates gas-less meta-transactions. This simply means users can exchange their game assets without paying any transaction fees. All they need is ERC20 tokens."
  }
];

@Component({
  components: {
    Accordion,
    AccordionItem
  }
})
export default class Faq extends Vue {
  FAQS = FAQS;
}
</script>

<style lang="scss" scoped>
@import "~assets/css/theme/_theme";
.faq {
  &-container {
    .collapsible-head {
      margin-top: 2rem;
    }
  }
}

.text-gray-500 {
  color: dark-color("500");
}
</style>
