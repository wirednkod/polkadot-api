import { connect } from "./utils"

export async function run(_nodeName: string, networkInfo: any) {
  const { chainHead } = await connect(networkInfo)

  let count = 0

  await new Promise((resolve, reject) => {
    const chainHeadFollower = chainHead(
      true,
      (event) => {
        if (event.type === "finalized" && ++count === 2) {
          resolve(chainHeadFollower.unfollow())
        }
      },
      reject,
    )
  })
  return count
}
