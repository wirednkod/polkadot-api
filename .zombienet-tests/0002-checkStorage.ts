import {
  Storage,
  u32,
  // AccountId,
  // Struct,
  // Twox64Concat,
  // Vector,
} from "../packages/substrate-bindings"

import { connect } from "./utils"

export async function run(nodeName: string, networkInfo: any) {
  const { chainHead } = await connect(nodeName, networkInfo)
  let count = 0

  await new Promise(async (resolve, reject) => {
    let requested = false
    const chainHeadFollower = chainHead(
      true,
      (event) => {
        if (event.type === "newBlock") {
          chainHeadFollower.unpin([event.blockHash])
          return
        }
        if (requested || event.type !== "initialized") return
        const latestFinalized = event.finalizedBlockHash
        requested = true

        const stakingStorage = Storage("Staking")
        const currentEra = stakingStorage("CurrentEra", u32.dec)

        console.log(`----- 1 --------> : ${JSON.stringify(currentEra)}`)
        console.log(`----- 2 --------> : ${currentEra.enc()}`)

        chainHeadFollower
          .storage(
            latestFinalized,
            "descendantsValues",
            event.finalizedBlockHash,
            null,
          )
          .then((some) => {
            // console.log("-------> ", some)
            resolve(chainHeadFollower.unfollow())
          })
          .catch((err) => console.log("eRR", err))
        chainHeadFollower.unpin([latestFinalized])
      },
      reject,
    )
  })
  return count
}
