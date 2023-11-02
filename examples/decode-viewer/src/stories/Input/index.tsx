import { FC, useState } from "react"
import "./index.scss"
import {
  AccountIdDecoded,
  BigNumberDecoded,
  BitSequenceDecoded,
  BoolDecoded,
  BytesArrayDecoded,
  BytesSequenceDecoded,
  NumberDecoded,
  StringDecoded,
  VoidDecoded,
} from "./types"

type SimpleType =
  | VoidDecoded["codec"]
  | BoolDecoded["codec"]
  | StringDecoded["codec"]
  | NumberDecoded["codec"]
  | BigNumberDecoded["codec"]

type NotSoSimpleType =
  | BitSequenceDecoded["codec"]
  | BytesSequenceDecoded["codec"]
  | BytesArrayDecoded["codec"]
  | AccountIdDecoded["codec"]

interface InputProps extends SimpleInputProps {
  codec: SimpleType | NotSoSimpleType
}

interface SimpleInputProps extends CommonProps {
  label: string
  value: any
  len?: number
  error?: boolean
}

interface CommonProps {
  input: string
  path: string[]
}

const withHexInput = (
  input: string | number | readonly string[] | undefined,
  path: any[],
) => {
  const [show, setShow] = useState<boolean>(false)
  return (
    <>
      <div style={{ display: show ? "block" : "none" }}>
        <input value={input}></input>
        <input value={path?.join("/")}></input>
      </div>
      <button onClick={() => setShow(!show)}>show</button>
    </>
  )
}

const SimpleInput = ({ label, value, error = false }: SimpleInputProps) => (
  <div className="custom-input-wrapper">
    {label && <div className="label">{label}</div>}
    <input disabled id={Math.random().toString()} value={value} />
    {error && <p className="error">Input filed can't be empty!</p>}
  </div>
)

const Component = ({
  codec,
  value,
  len,
  input,
  path,
  label,
  error,
}: InputProps) => {
  let inputValue = value

  switch (codec) {
    // Here are Simple components that needs more than one input
    case "AccountId":
    case "bitSequence": {
      const entries = Object.entries(inputValue)
      return (
        <>
          <div className="multiple">
            {entries?.map((entry) => (
              <SimpleInput
                label={entry[0]}
                value={entry[1]}
                {...{ input, path }}
              />
            ))}
            {error && <p className="error">Input filed can't be empty!</p>}
            {/* TODO: Fix the following */}
          </div>
          {withHexInput(input, path)}
        </>
      )
    }
    // Here are Simple components
    case "Bytes": {
      inputValue = "[" + Uint8Array.from(Object.values(value)) + "]"
      break
    }
    case "BytesArray": {
      return (
        <div className="multiple">
          <SimpleInput label={label} value={inputValue} {...{ input, path }} />
          <SimpleInput label={"len"} value={len} {...{ input, path }} />
          {/* TODO: Fix the following */}
          {withHexInput(input, path)}
        </div>
      )
    }
    // Default ones
    case "u8":
    case "u16":
    case "u32":
    case "i8":
    case "i16":
    case "i32":
    case "compactNumber":
    case "u64":
    case "u128":
    case "u256":
    case "i64":
    case "i128":
    case "i256":
    case "compactBn":
      inputValue = value.toString()
      break
  }

  return (
    <>
      <SimpleInput label={label} value={inputValue} {...{ input, path }} />
      {/* TODO: Fix the following */}
      {withHexInput(input, path)}
    </>
  )
}

export const Input: FC<InputProps> = (props: InputProps) => {
  return Component(props)
}
