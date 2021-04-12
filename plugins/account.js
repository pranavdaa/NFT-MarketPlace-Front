import utils from 'ethereumjs-util';
import ETHAccount from 'ethereumjs-wallet';

import { accounts as accountStore } from '~/plugins/localstore';

const N_FACTOR = 1024;

export default class Account extends ETHAccount {
  constructor(priv, pub) {
    if (priv) {
      priv = utils.stripHexPrefix(priv); // eslint-disable-line no-param-reassign
      priv = priv.length === 32 ? priv : Buffer(priv, 'hex'); // eslint-disable-line no-param-reassign
    }
    super(priv, pub);
  }

  static generate(icapDirect) {
    return ETHAccount.generate(icapDirect);
  }

  static fromPrivateKey(priv) {
    return new Account(priv);
  }

  static fromV3(input, password, nonStrict) {
    return ETHAccount.fromV3(input, password, nonStrict);
  }

  saveLocally(password, extraData) {
    if (!this.getPrivateKey()) {
      return;
    }

    const address = this.getAddressString().toLowerCase();
    const keystore = this.toV3(password, {
      kdf: 'scrypt',
      n: N_FACTOR,
    });

    // set data local store
    accountStore.set(
      address,
      JSON.stringify({
        keystore,
        ...extraData,
      })
    );
  }
}
