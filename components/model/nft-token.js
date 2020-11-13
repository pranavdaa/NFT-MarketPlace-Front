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

  // adding temporarily for development without api
  // remove this getter once API is ready
  get attributes() {
    return [
      {
        "trait_type": "title",
        "value": "Origin",
        "display_type": null,
        "max_value": null,
        "trait_count": 3802,
        "order": null
      },
      {
        "trait_type": "skill",
        "value": 31,
        "display_type": null,
        "max_value": null,
        "trait_count": 38646,
        "order": null
      },
      {
        "trait_type": "parts",
        "value": "raven",
        "display_type": null,
        "max_value": null,
        "trait_count": 7245,
        "order": null
      },
      {
        "trait_type": "speed",
        "value": 46,
        "display_type": null,
        "max_value": null,
        "trait_count": 3404,
        "order": null
      },
      {
        "trait_type": "morale",
        "value": 54,
        "display_type": null,
        "max_value": null,
        "trait_count": 1700,
        "order": null
      },
      {
        "trait_type": "hp",
        "value": 33,
        "display_type": null,
        "max_value": null,
        "trait_count": 1269,
        "order": null
      },
      {
        "trait_type": "parts",
        "value": "doubletalk",
        "display_type": null,
        "max_value": null,
        "trait_count": 3429,
        "order": null
      },
      {
        "trait_type": "parts",
        "value": "lagging",
        "display_type": null,
        "max_value": null,
        "trait_count": 3356,
        "order": null
      },
    ]
  }

  get token() {
    return {
      contract: this.contract,
      token_id: this.token_id,
      name: this.name,
      owner: this.owner,
      img_url: this.img_url,
      attributes_metadata: this.attributes,
    }
  }

}
