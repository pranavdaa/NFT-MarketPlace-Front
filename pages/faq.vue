<template>
  <div class="container fixed faq">
    <div class="row faq-container">
      <div class="col-12">
        <h2 class="collapsible-head">FAQ</h2>
        <div class="section">
          <div class="accordion w-100">
            <accordion-item :accordionItem="accordion">
              <template slot="accordion-header">
                <div class="font-body-medium">
                  NFT Marketplace URL ?
                </div>
                <span class="spin">+</span>
              </template>

              <template slot="accordion-content">
                <div class="font-body-medium ps-t-20 text-gray-500">
                  <a href="https://matic.opensea.io/" target="_blank"
                    >https://matic.opensea.io/</a
                  >
                </div>
              </template>
            </accordion-item>

            <accordion-item
              :accordionItem="accordion"
              v-for="faq in FAQS"
              :key="faq.index"
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
import Vue from "vue";
import Component from "nuxt-class-component";

import AccordionItem from "~/components/lego/accordion-item";

const FAQS = [
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
  },
  {
    question: "How to move NFT's from Ethereum to Matic ? ",
    answer:
      "There is a bulk deposit option available on the NFT marketplace. Using that option, multiple tokens that belong to the same NFT category can be deposited from the Ethereum to Matic chain. This mechanism is facilitated by the PoS bridge that is built across Ethereum and Matic"
  },
  {
    question: "Which network to use ? ",
    answer:
      "Users can choose to stay on the Ethereum network itself throughout their session on the NFT Marketplace. The NFT Marketplace is network agnostic enabled and all transactions are gas-less"
  },
  {
    question:
      "Do I need to have NFT and ERC20 tokens on Matic N/w to use the NFT Marketplace ?",
    answer:
      "Yes, the assets should be present on the Matic chain in order to place orders or buy orders. If there are no assets, then they can be brought to Matic from Ethereum Mainnet by bulk depositing."
  },
  {
    question: "Which ERC20 tokens are supported ? ",
    answer:
      "Currently only WETH and DAI are the supported ERC20 tokens, using which NFT's can be purchased. "
  },
  {
    question: "How to list NFT's in the NFT Marketplace ? ",
    answer:
      "From the items on Matic section under the 'My Accounts' tab, the NFT asset balance can be viewed. Clicking on one of the tokens will redirect to a pop up that will have options to place Fixed Price and Negotiation orders."
  },
  {
    question: "What is a FIXED and NEGOTIATION order ?",
    answer:
      "Fixed Price orders lets the seller place the order for a fixed price and this order can be bought only for that mentioned price. Negotiation orders lets the seller set a minimum price and an expected price for the sell order. The buyers then can start placing bids based on the minimum price. Accepting or rejecting the bid depends on the seller."
  },
  {
    question: "Can I bulk deposit NFT's ? ",
    answer:
      "Yes. Bulk deposit option is available to move assets from Ethereum to Matic. It helps save transaction fees as well as time."
  },
  {
    question: "Where can I see the order history ? ",
    answer:
      "Order history can be viewed under the Orders section in the 'My Accounts' tab"
  },
  {
    question: "How to see the Deposit/Withdraw history ? ",
    answer:
      "Deposit & Withdraw history can be viewed under the Deposit & Withdraw section in the 'My Account' tab"
  },
  {
    question:
      "What is the underlying DEX protocol being used for NFT marketplace ? ",
    answer: "The 0x protocol is being used for this purpose."
  },
  {
    question: "How to view NFT's available for sale ?",
    answer:
      "The active orders or the NFT's for sale can be viewed from the 'Discover' tab"
  },
  {
    question: "What are the different ways to get ERC20 tokens on Matic ? ",
    answer:
      "They can be deposited from Ethereum to Matic using the Matic web wallet ( https://wallet.matic.network/ ) or bought directly on the Matic chain using Transank Fiat on ramp solution. You can also receive tokens from any other address on Matic chain that has the ERC20 tokens. "
  },
  {
    question: "What can be used to buy NFT's ? ",
    answer:
      "ERC20 tokens are required to buy the NFT's on the NFT Marketplace. Currently only WETH and DAI are supported."
  },
  {
    question:
      "Do I need to have MATIC on Matic Network to use the NFT marketplace ? ",
    answer:
      "No. The NFT marketplace is meta transaction enabled and all the transactions are gas-less. However, some NFT's that exist only on the Matic chain do not have Matic meta-transaction support and hence MATIC tokens will be required to pay for gas when dealing with such tokens. "
  },
  {
    question: "How to place a sell order ? ",
    answer:
      "Sell order can be placed by clicking on any token from the Items on Matic section of the 'My Accounts' tab. You can either place a Fixed or Negotiation order. "
  },
  {
    question: "How to place bids ? ",
    answer:
      "Bids can be placed by clicking on the orders marked as Negotiation from the Discover page of the nFT-Marketplace"
  },
  {
    question: "How to cancel orders ?",
    answer:
      "The cancel button is available only on the 'order detail' page. Order detail page can be viewed by clicking on the order from the discover page or also by clicking on 'View order' button on the tokens that appear in the items on Matic section of the my accounts tab. You can also view the order detail page by clicking on the order from the order history section under my accounts"
  },
  {
    question: "How to accept/reject bids ? ",
    answer:
      "You can accept/reject bids by moving to the order detail page and clicking on accept/reject from the bid list that appears on the order detail page. "
  },
  {
    question: "Items on Matic vs Items on Ethereum ? ",
    answer:
      "The NFT's that you own on Matic will appear in the Items on Matic section and the NFT's that you own on Ethereum shall appear in the Items on Ethereum section"
  },
  {
    question: "How to bulk withdraw ? ",
    answer:
      "Bulk withdraw is a feature that lets you move multiple NFT's that belong to the same category from Matic to Ethereum by using the PoS bridge that is built across the Matic and Ethereum network. You will have to move to the individual category view in order see the bulk withdraw option."
  },
  {
    question: "What do I do in if checkpoint not happening ? ",
    answer: "What do I do in if checkpoint not happening ? "
  },
  {
    question: "What do I do in if checkpoint not happening ? ",
    answer:
      "Please ensure that you have logged into the same account from which you had logged in. If you still cant find it, please raise a ticket on our support system."
  },
  {
    question: "What can I do if the transaction taking too long ?",
    answer:
      "Ethereum transactions take time depending on network congestion. Kindly wait or increase the gas price to speed up the transaction "
  },
  {
    question: "Can I change gas limit or gas price ? ",
    answer:
      "Gas price can be varied but gas limit should not be changed as it it set by the application based on some calculations. "
  }
];

@Component({
  components: {
    AccordionItem
  }
})
export default class Faq extends Vue {
  FAQS = FAQS;
  accordion = {
    count: 0,
    active: null
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
