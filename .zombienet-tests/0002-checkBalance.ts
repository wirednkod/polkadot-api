import { Tuple, compact, metadata } from "../packages/substrate-bindings/dist"
import { getDynamicBuilder } from "../packages/substrate-codegen/dist"
import { connect } from "./utils"

const ALICE = "5GrwvaEF5zXb26Fz9rcQpDWS57CtERHpNehXCPcNoHGKutQY"

export async function run(_nodeName: string, networkInfo: any) {
  const { chainHead } = await connect(networkInfo)

  const opaqueMeta = Tuple(compact, metadata)

  let aliceBalance: number = 0

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
        requested = true

        let response = await chainHeadFollower.call(
          latestFinalized,
          "Metadata_metadata",
          "",
        )

        const [, metadata] = opaqueMeta.dec(response)
        if (metadata.metadata.tag === "v14") {
          const dynamicBuilder = getDynamicBuilder(metadata.metadata.value)
          const storageAccount = dynamicBuilder.buildStorage(
            "System",
            "Account",
          )
          // make the storage call with the storageAccount.enc()
          console.log("storageAccount", storageAccount.enc(ALICE))
          console.log("latestFinalized", latestFinalized)

          let result = await chainHeadFollower.storage(
            latestFinalized,
            "value",
            storageAccount.enc(ALICE),
            null,
          )
          console.log("-------> some: ", result)
          let result2 = storageAccount.dec(result as string)
          console.log("-------> result: ", result2)
          aliceBalance = result2?.data?.free
          console.log("-------> aliceBalance: ", aliceBalance)
          resolve(chainHeadFollower.unfollow())
        }

        chainHeadFollower.unpin([latestFinalized])
      },
      reject,
    )
  })
  return aliceBalance
}
