import { connect } from "./utils"
import { WellKnownChain } from "../packages/sc-provider"
import polkadotInfo from "./chain-info/polkadot"

export async function run(nodeName: string, networkInfo: any) {
  const { chainHead } = await connect(WellKnownChain.polkadot, polkadotInfo)
  let count = 0

  await new Promise(async (resolve, reject) => {
    const chainHeadFollower = chainHead(
      true,
      (event) => {
        if (event.event === "finalized" && ++count === 2) {
          resolve(chainHeadFollower.unfollow())
        }
      },
      reject,
    )
  })
  return count
}
