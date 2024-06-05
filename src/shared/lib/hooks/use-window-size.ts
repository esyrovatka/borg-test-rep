"use client"

import { useLayoutEffect, useState } from "react"

const useWindowSize = () => {
  const [windowSize, setWindowSize] = useState<{ width: number; height: number }>({
    width: 0,
    height: 0,
  })

  useLayoutEffect(() => {
    setWindowSize({
      width: window.innerWidth,
      height: window.innerHeight,
    })

    const handleResize = () => {
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight,
      })
    }

    window.addEventListener("resize", handleResize)

    return () => window.removeEventListener("resize", handleResize)
  }, [])

  return windowSize
}

export default useWindowSize
