import Model from '~/components/model/model'
import app from '~/plugins/app'

export default class NFTToken extends Model {
  get name() {
    return `Token ${this.token_id}`
  }

  get img_url() {
    if (this.image) {
      return this.image
    }
    return ''
  }

  get category() {
    const category = app.vuexStore.getters['category/categories'].find(
      (c) =>
        c.getAddress(this.chainId).toLowerCase() === this.contract.toLowerCase(),
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
      img_url: this.img_url,
      attributes_metadata: this.attributes ?
        typeof (this.attributes) === 'string' ?
          JSON.parse(this.attributes) : this.attributes
        : [],
    }
  }
}
