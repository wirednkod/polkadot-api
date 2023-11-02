import { Input } from "./stories/Input"
import "./App.css"
import { useEffect, useState } from "react"
// import sampleData from "./sample.json"
import { _void, str, Struct } from "@polkadot-api/substrate-bindings"
import { ComplexDecoded, EnumDecoded } from "./types"

export const App = () => {
  const [typed, setTyped] = useState<string | undefined>()

  useEffect(() => {}, [])
  return (
    <>
      <h1>Vite + React</h1>
      <Input
        onChange={(e) => {
          console.log(e.target.value)
          setTyped(e.target.value)
        }}
        label={""}
        value={typed}
        type={undefined}
      />
    </>
  )
}

export default App
