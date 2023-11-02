import { ChangeEvent, Dispatch, SetStateAction, useState } from "react"

interface HookReturn {
  value: string
  error: boolean
  onChange: (e: ChangeEvent<HTMLInputElement>) => void
  setError: Dispatch<SetStateAction<boolean>>
}

export const useInput = (initialValue: string): HookReturn => {
  const [value, setValue] = useState<string>(initialValue)
  const [error, setError] = useState<boolean>(false)

  const handleChange = (e: ChangeEvent<HTMLInputElement>): void => {
    setValue(e.target.value)
  }

  return {
    value,
    error,
    onChange: handleChange,
    setError,
  }
}
