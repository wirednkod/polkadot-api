import { FC } from "react"
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

import { u32 } from "@polkadot-api/substrate-bindings"

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

const SimpleInput = ({
  label,
  value,
  input,
  path,
  error = false,
}: SimpleInputProps) => (
  <div className={`custom-input-wrapper`}>
    {label && <div className="label">{label}</div>}
    <input disabled id={Math.random().toString()} value={value} />
    {error && <p className="error">Input filed can't be empty!</p>}
    {/* TODO: Fix the following */}
    <div style={{ display: "block" }}>
      {input} {path}
    </div>
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
        <div className={`multiple`}>
          {entries?.map((entry) => (
            <SimpleInput
              label={entry[0]}
              value={entry[1]}
              {...{ input, path }}
            />
          ))}
          {error && <p className="error">Input filed can't be empty!</p>}
        </div>
      )
    }
    // Here are Simple components
    case "Bytes": {
      inputValue = Uint8Array.from(Object.values(value))
      break
    }
    case "BytesArray": {
      inputValue = u32.dec(value)
      return (
        <div className={`multiple`}>
          <SimpleInput label={label} value={inputValue} {...{ input, path }} />
          <SimpleInput label={"len"} value={len} {...{ input, path }} />
        </div>
      )
    }
    // Default ones
    // case "_void":
    // case "bool":
    // case "str" | "char":
    // case "u8" | "u16" | "u32" | "i8" | "i16" | "i32" | "compactNumber":
    // case ""u64" | "u128" | "u256" | "i64" | "i128" | "i256" | "compactBn":
    // case "_void":
  }

  return <SimpleInput label={label} value={inputValue} {...{ input, path }} />
}

export const Input: FC<InputProps> = (props: InputProps) => {
  return Component(props)
}
