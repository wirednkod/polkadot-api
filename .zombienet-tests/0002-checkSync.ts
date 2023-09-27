import { connect } from "./utils"

export async function run(nodeName: string, networkInfo: any) {
  const { chainHead } = await connect(nodeName, networkInfo, "100")
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

        chainHeadFollower
          .storage(
            latestFinalized,
            "descendantsValues",
            event.finalizedBlockHash,
            null,
          )
          .then((some) => {
            console.log("-------> ", some)
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
