import { createClient } from "../packages/substrate-client/dist"
import {
  ScProvider, //, WellKnownChain
} from "../packages/sc-provider"

// const wellKnownChains: ReadonlySet<string> = new Set<WellKnownChain>(
//   Object.values(WellKnownChain),
// )

export async function connect(
  _nodeName: string,
  networkInfo: any,
  parachainId?: string,
) {
  const customChainSpec = require(networkInfo.chainSpecPath)
  let provider = ScProvider(JSON.stringify(customChainSpec))
  return createClient(provider)
}
