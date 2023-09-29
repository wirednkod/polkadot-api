import { Tuple, compact, metadata } from "../packages/substrate-bindings/dist"
import { connect } from "./utils"

const ALICE = "5GrwvaEF5zXb26Fz9rcQpDWS57CtERHpNehXCPcNoHGKutQY"

export async function run(_nodeName: string, networkInfo: any) {
  const { chainHead } = await connect(networkInfo)

  const opaqueMeta = Tuple(compact, metadata)

  let count = 0

  await new Promise(async (resolve, reject) => {
    let requested = false
    const chainHeadFollower = chainHead(
      true,
      async (event) => {
        if (event.type === "newBlock") {
          chainHeadFollower.unpin([event.blockHash])
          return
        }
        if (requested || event.type !== "initialized") return
        const latestFinalized = event.finalizedBlockHash

        // Call metadata
        let response = await chainHeadFollower.header(latestFinalized)

        console.log("response", response)

        // if (1 === 1) {
        resolve(chainHeadFollower.unfollow())
        // }
      },
      reject,
    )
  })
}
