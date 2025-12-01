import { useEffect, useState } from "react"

export function useDebounce<T>(value: T, delay?: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value)

  useEffect(() => {
    // Set a timer to update the value after (delay) milliseconds
    const timer = setTimeout(() => {
      setDebouncedValue(value)
    }, delay || 500)

    // If the user types again before the timer ends, clear it and restart
    return () => {
      clearTimeout(timer)
    }
  }, [value, delay])

  return debouncedValue
}