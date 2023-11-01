import { useState } from "react"
import { Button } from "./stories/Button"
import "./App.css"

const App = () => {
  const [count, setCount] = useState(0)

  return (
    <>
      <h1>Vite + React</h1>
      <div className="card">
        <Button
          backgroundColor="#ccc"
          onClick={() => setCount((count) => count + 1)}
          label={`count is ${count}`}
        />
        <p>
          Edit <code>src/App.tsx</code> and save to test HMR
        </p>
      </div>
      <p className="read-the-docs">
        Click on the Vite and React logos to learn more
      </p>
    </>
  )
}

export default App
