import localstore from 'store';

export const config = localstore.namespace('config');
export const accounts = localstore.namespace('accounts');
export const wallets = localstore.namespace('wallets');
export function clearStore() {
  config.clearAll();
  accounts.clearAll();
  wallets.clearAll();
}
