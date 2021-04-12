import app from "~/plugins/app";
import { config as configStore } from "~/plugins/localstore";

import MetamaskProvider from "@maticnetwork/metamask-provider";
import WalletConnectProvider from "@maticnetwork/walletconnect-provider";
import Portis from "@portis/web3";

export function getWalletProvider({ networks, primaryProvider }) {
  let network = null;

  if (primaryProvider === "main") {
    network = networks.main;
  } else if (primaryProvider === "matic") {
    network = networks.matic;
  } else {
    return null;
  }

  let provider = null;
  switch (configStore.get("loginStrategy")) {
    case app.strategies.METAMASK:
      window.ethereum.enable();
      provider = new MetamaskProvider(window.ethereum, {
        url: network.rpc,
      });
      break;

    case app.strategies.PORTIS:
      provider = new Portis(app.uiconfig.portis.dappId, {
        nodeUrl: network.rpc,
        chainId: network.chainId,
      }).provider;
      break;

    default:
      provider = new WalletConnectProvider({
        host: network.rpc,
      });
      break;
  }

  return provider;
}
