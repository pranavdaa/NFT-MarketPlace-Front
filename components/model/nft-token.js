import Model from "~/components/model/model"
import app from "~/plugins/app"

export default class NFTToken extends Model {

  get name() {
    return `Token ${this.id}`
  }

  get img_url() {
    return "/_nuxt/static/img/dummy-kitty.png";
  }

  get category() {
    const selectedNetwork = app.getSelectedNetwork()
    let networkId = selectedNetwork.id

    const category = app.vuexStore.getters['category/categories'].find(
      c => c.address.toLowerCase() == this.contract.toLowerCase()
    )

    return category
  }

  get categories_id() {
    return this.category.id
  }

  get token() {
    return {
      contract: this.contract,
      token_id: this.token_id,
      name: this.name,
      owner: this.owner,
      img_url: this.img_url
    }
  }

}
