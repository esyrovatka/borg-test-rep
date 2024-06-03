export function timeout<T>(time_ms: number): Promise<T> {
  let rejectFunc: ((reason: Error) => void) | null = null

  const promise = new Promise<T>((_, reject) => {
    rejectFunc = reject
    setTimeout(() => {
      if (rejectFunc) rejectFunc(new Error("Timeout"))
    }, time_ms)
  })

  return promise
}
