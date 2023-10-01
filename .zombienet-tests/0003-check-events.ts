import { connect } from "./utils"

export async function run(_nodeName: string, networkInfo: any) {
  const { chainHead } = await connect(networkInfo)

  let initialized = false

  let finalizedCount = 0
  let finalized = false

  let newBlockCount = 0
  let newBlock = false

  let bestBlockCount = 0
  let bestBlock = false

  await new Promise((resolve, reject) => {
    let requested = false
    const chainHeadFollower = chainHead(
      true,
      (event) => {
        console.log("event", event.type)

        if (event.type === "newBlock" && ++newBlockCount === 2) {
          chainHeadFollower.unpin([event.blockHash])
          newBlock = true
          return
        }

        if (initialized || event.type === "initialized") {
          initialized = true
          return
        }

        if (event.type === "finalized" && ++finalizedCount === 2) {
          finalized = true
        }

        if (event.type === "bestBlockChanged" && ++bestBlockCount === 5) {
          bestBlock = true
        }

        if (finalized && newBlock && bestBlock) {
          resolve(chainHeadFollower.unfollow())
        } else {
          return
        }
      },
      reject,
    )
  })
}
