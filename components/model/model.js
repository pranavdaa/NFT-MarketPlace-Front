export default class Model {
  // constructor
  constructor(data = {}) {
    // treat data as properties
    Object.keys(data).forEach((key) => {
      Object.defineProperty(this, key, {
        enumerable: key !== '.value' && key !== '.key' && key !== '_id',
        configurable: false,
        writable: true,
        value: data[key],
      });
    });
  }
}
