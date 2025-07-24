import { useState, useEffect, useRef } from 'react'

function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState(value)
  const handler = useRef<number | undefined>(undefined)

  useEffect(() => {
    if (handler.current !== undefined) {
      clearTimeout(handler.current)
    }

    handler.current = window.setTimeout(() => {
      setDebouncedValue(value)
    }, delay)

    return () => {
      if (handler.current !== undefined) {
        clearTimeout(handler.current)
      }
    }
  }, [value, delay])

  return debouncedValue
}


type Props = {
  value: string
  onChange: (val: string) => void
  debounceDelay?: number
}

export default function SearchBar({ value, onChange, debounceDelay = 400 }: Props) {
  const [input, setInput] = useState(value)
  const debouncedInput = useDebounce(input, debounceDelay)

  useEffect(() => {
    onChange(debouncedInput)
  }, [debouncedInput, onChange])

  return (
    <input
      type="text"
      aria-label="Search people"
      value={input}
      onChange={e => setInput(e.target.value)}
      placeholder="Search people..."
      className="w-full rounded border p-2"
    />
  )
}
