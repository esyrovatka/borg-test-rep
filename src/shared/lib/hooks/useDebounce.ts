import { useCallback, useRef } from "react"

interface ICallbackProps<T> {
  (...args: T[]): void
}

export function useDebounce<T>(callback: ICallbackProps<T>, delay: number): ICallbackProps<T> {
  const timer = useRef<NodeJS.Timeout | null>(null)

  return useCallback(
    (...args: T[]) => {
      if (timer.current) clearTimeout(timer.current)

      timer.current = setTimeout(() => {
        callback(...args)
      }, delay)
    },
    [callback, delay]
  )
}
