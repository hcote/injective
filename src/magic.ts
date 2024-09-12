import { Magic } from "magic-sdk";
import { CosmosExtension } from "@magic-ext/cosmos";

export const magic = new Magic("pk_live_8D40A7E251F283ED", {
  extensions: [
    new CosmosExtension({
      rpcUrl: "https://testnet.sentry.tm.injective.network:443",
      chain: "inj",
    }),
  ],
});
