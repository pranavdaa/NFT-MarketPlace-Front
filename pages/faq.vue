<template>
  <div class="container fixed faq">
    <div class="row faq-container">
      <div class="col-12">
        <h2 class="collapsible-head">
          FAQ
        </h2>
        <div class="section">
          <div class="accordion w-100">
            <accordion-item :accordionItem="accordion">
              <template slot="accordion-header">
                <div class="font-body-medium">
                  How do I access OpenSea’s Matic marketplace?
                </div>
                <span class="spin">+</span>
              </template>

              <template slot="accordion-content">
                <div class="font-body-medium ps-t-20 text-gray-500">
                  OpenSea's Matic marketplace is currently accessible at
                  <a
                    href="https://matic.opensea.io/"
                    target="_blank"
                  >matic.opensea.io</a>. In the near future, we plan to integrate Matic assets
                  directly into the core OpenSea marketplace at
                  <a
                    href="https://https://opensea.io"
                    target="_blank"
                  >opensea.io</a>.
                </div>
              </template>
            </accordion-item>

            <accordion-item :accordionItem="accordion">
              <template slot="accordion-header">
                <div class="font-body-medium">
                  How can I get customer support if I run into issues while
                  using this marketplace?
                </div>
                <span class="spin">+</span>
              </template>

              <template slot="accordion-content">
                <div class="font-body-medium ps-t-20 text-gray-500">
                  We are creating a dedicated ticketing system to handle
                  incoming support requests. In the meantime, please send
                  support requests
                  <a
                    href="https://wallet-support.matic.network/portal/en/newticket
"
                    target="_blank"
                  >here</a>
                  and include the word 'Opensea' in your ticket.
                </div>
              </template>
            </accordion-item>

            <accordion-item :accordionItem="accordion">
              <template slot="accordion-header">
                <div class="font-body-medium">
                  Which wallets are supported for use with this marketplace?
                </div>
                <span class="spin">+</span>
              </template>

              <template slot="accordion-content">
                <div class="font-body-medium ps-t-20 text-gray-500">
                  <a
                    href="https://metamask.io/"
                    target="_blank"
                  >MetaMask</a> is
                  currently supported as our recommended wallet provider, as the
                  connection to Matic is more seamless than with most other
                  wallets. We'll be evaluating other wallets soon.
                </div>
              </template>
            </accordion-item>

            <accordion-item :accordionItem="accordion">
              <template slot="accordion-header">
                <div class="font-body-medium">
                  How to get ETH/DAI on Matic?
                </div>
                <span class="spin">+</span>
              </template>

              <template slot="accordion-content">
                <div class="font-body-medium ps-t-20 text-gray-500">
                  You can follow this
                  <a
                    href="https://docs.matic.network/docs/develop/wallets/matic-web-wallet/deposit-eth-dai-on-matic"
                    target="_blank"
                  >guide</a>
                  to understand how to get ETH/DAI on Matic. They can also be
                  purchased directly on the Matic chain using the fiat on-ramp
                  provider
                  <a
                    href="https://global.transak.com/"
                    target="_blank"
                  >Transak</a>
                </div>
              </template>
            </accordion-item>

            <accordion-item
              v-for="faq in FAQS"
              :key="faq.index"
              :accordionItem="accordion"
            >
              <template slot="accordion-header">
                <div class="font-body-medium">
                  {{ faq.question }}
                </div>
                <span class="spin">+</span>
              </template>

              <template slot="accordion-content">
                <div class="font-body-medium ps-t-20 text-gray-500">
                  {{ faq.answer }}
                </div>
              </template>
            </accordion-item>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Vue from 'vue'
import Component from 'nuxt-class-component'

import AccordionItem from '~/components/lego/accordion-item'

const FAQS = [
  {
    question: "What's an 'NFT marketplace'?",
    answer:
      "An NFT marketplace is an exchange platform for ERC721 and ERC1155 collectibles. Users can place sell orders and also buy different listings placed by others on the platform. This marketplace is on the Matic platform, which facilitates gas-less meta-transactions. This means users can exchange their game assets without paying transaction fees: all that's needed to complete the exchange are ERC20 tokens.",
  },
  {
    question: 'How do I migrate NFTs from Ethereum to Matic?',
    answer:
      'There is a bulk deposit option available on the NFT marketplace. Using that option, multiple tokens that belong to the same NFT category can be deposited to the Matic chain from Ethereum. This mechanism is facilitated by the PoS bridge that is built across Ethereum and Matic.',
  },
  {
    question: 'Which network should I use while on this marketplace?',
    answer:
      'You can either stay on the Ethereum network or the Matic network. The NFT marketplace is network-agnostic and all transactions are gas-less.',
  },
  {
    question:
      'Do I need to have NFT and ERC20 tokens on Matic in order to use the marketplace?',
    answer:
      "Yes, you should have assets present on the Matic chain in order to sell or buy items. If you don't have assets on Matic, they can be deposited to Matic from Ethereum through the bulk deposit process (see question above: 'How do I migrate NFTs from Ethereum to Matic').",
  },
  {
    question:
      'How can I buy NFTs on this marketplace? Which ERC20 tokens are supported?',
    answer: 'You can purchase NFTs on this marketplace with ETH and DAI.',
  },
  {
    question: 'How do I list NFTs for sale in this marketplace?',
    answer:
      "Under the Matic section in the 'My Account' tab, you can view your NFT assets. Clicking on one of these NFTs will redirect you to a pop-up that will allow you to place Fixed Price and Negotiation listings, or 'orders.'",
  },
  {
    question: "What is a 'fixed price order' versus a 'negotiation order'?",
    answer:
      'Fixed Price orders allow the seller to place the order for a fixed price. This asset can then be purchased only for that price. Negotiation orders allow the seller to set a minimum price and an expected price for the sale. The buyers can then place bids based on the minimum price. The seller is able to decide whether to accept or reject each bid.',
  },
  {
    question: 'Why is it recommended to bulk deposit my NFTs?',
    answer:
      'By using the bulk deposit option to move assets from Ethereum to Matic, you can save transaction fees as well as time.',
  },
  {
    question: 'Where can I find my order history?',
    answer:
      "Your order history is viewable under the Orders section in the 'My Account' tab.",
  },
  {
    question: 'How can I see my deposit and withdrawal history?',
    answer:
      "Deposit and withdrawal history can be viewed under the Deposit & Withdraw section in the 'My Account' tab.",
  },
  {
    question:
      'What is the underlying DEX (decentralized exchange) protocol that is being used for this marketplace?',
    answer: 'We are using the 0x protocol for this marketplace.',
  },
  {
    question: 'How do I view the NFTs that are available for sale?',
    answer: "The NFTs for sale can be viewed from the 'Discover' tab.",
  },
  {
    question: "What can be used to buy NFT's ? ",
    answer:
      "ERC20 tokens are required to buy the NFT's on the NFT Marketplace. Currently only ETH and DAI are supported.",
  },
  {
    question: 'How can I get ERC20 tokens on Matic?',
    answer:
      'ERC20 tokens can be deposited from Ethereum to Matic using the Matic web wallet or can be purchased directly on the Matic chain using the fiat on-ramp provider Transak. You can also receive tokens from any other address on Matic that has ERC20 tokens.',
  },
  {
    question:
      'Do I need to have the MATIC token on the Matic network to use this marketplace?',
    answer:
      'In most cases, you do not. This marketplace is meta-transaction-enabled and each of the transactions are gas-less. However, some NFTs that exist only on the Matic chain do not have Matic meta-transaction support, and when dealing with these tokens MATIC tokens will be required to pay for gas.',
  },
  {
    question: 'How do I place a sell order?',
    answer:
      "A sell order can be placed by clicking on any token from the 'Items on Matic' section of the 'My Accounts' tab. You will be able to place either a Fixed Price order or a Negotiation order.",
  },
  {
    question: 'How do I place bids ? ',
    answer:
      "Bids can be placed by clicking on the orders marked as Negotiation orders from the 'Discover' page of the marketplace.",
  },
  {
    question: 'How do I cancel orders ?',
    answer:
      "The cancel button is available only on the 'order detail' page. The order detail page can be viewed by clicking on the order from the 'Discover' page or also by clicking on the 'View Order' button on each NFT that appears in the 'Items on Matic' section of the 'My Accounts' tab. You can also view the order detail page by clicking on the order from the 'Order History' section of the 'My Accounts' tab.",
  },
  {
    question: 'How do I accept/reject bids ? ',
    answer:
      "You can accept and reject bids from the order detail page by clicking on 'accept' or 'reject' from the bid list.",
  },
  {
    question:
      'Where can I see which of my NFTs are on Matic and which of my NFTs are on Ethereum?',
    answer:
      "The NFTs that you own on Matic will appear in the 'Items on Matic' section of the 'My Accounts' tab, whereas the items that you own on Ethereum will appear in the 'Items on Ethereum' section of the 'My Accounts' tab.",
  },
  {
    question: 'How do I bulk withdraw from this marketplace?',
    answer:
      'Bulk withdrawal is a feature that allows you to move multiple NFTs that belong to the same category from Matic to Ethereum. This is done using the PoS bridge that is built across the Matic and Ethereum network. You will have to move to the individual category view in order to see the bulk withdrawal option.',
  },
  {
    question: 'What can I do if a transaction is taking too long?',
    answer:
      'Ethereum transactions can take longer periods of time to complete depending on network congestion. Please wait or increase the gas price to speed up the transaction.',
  },
  {
    question: 'Can I change the gas limit or the gas price?',
    answer:
      "The gas price can be changed, but the gas limit should not be changed as it's calculated by the wallet or app.",
  },
]

@Component({
  components: {
    AccordionItem,
  },
})
export default class Faq extends Vue {
  FAQS = FAQS;
  accordion = {
    count: 0,
    active: null,
  };
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

.accordion {
  list-style: none;
  margin: 0;
  padding: 0;
}

.text-gray-500 {
  color: dark-color("500");
}
</style>
