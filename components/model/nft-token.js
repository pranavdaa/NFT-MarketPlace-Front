import Model from "~/components/model/model"
import app from "~/plugins/app"
import Web3 from "web3"

export default class NFTToken extends Model {

  get name() {
    return `Token ${this.token_id}`
  }

  get img_url() {
    if (this.image) {
      return this.image
    }
    return "";
  }

  get category() {
    const category = app.vuexStore.getters['category/categories'].find(
      c => c.getAddress(this.chainId).toLowerCase() == this.contract.toLowerCase()
    )
    return category
  }

  get categories_id() {
    return this.category.id
  }

  get metaAttributes() {
    const formattedMetaAttr = this.attributes.map(element => {
      element = { ...element, trait_type: element.trait_type.replace(/_/g, ' ') }

      if (element.trait_type === 'generation') {
        element = { ...element, value: element.value.replace(/_/g, ' ').replace(/\b\w/g , char => char.toUpperCase()) }
      }

      return element
    })

    return formattedMetaAttr
  }

  get token() {
    return {
      contract: this.contract,
      token_id: this.token_id,
      name: this.name,
      owner: this.owner,
      img_url: this.img_url,
      attributes_metadata: this.metaAttributes,
    }
  }

}
