"use client"

import { useCallback, useEffect, useRef, useState } from "react"

const useGamepad = () => {
  const [gamepad, setGamepad] = useState<Gamepad | null>(null)
  const [buttons, setButtons] = useState<boolean[] | undefined>([])
  const [axes, setAxes] = useState<readonly number[] | undefined>([])
  const [gamepadConnected, setGamepadConnected] = useState<boolean>(false)

  const previousButtons = useRef<boolean[] | undefined>()
  const previousAxes = useRef<readonly number[] | undefined>()

  const updateGamepadStatus = useCallback(() => {
    if (!gamepad) return

    const newGamepad = navigator.getGamepads()[0]
    const newButtons = newGamepad?.buttons.map(button => button.pressed)
    const newAxes = newGamepad?.axes

    if (JSON.stringify(newButtons) !== JSON.stringify(previousButtons.current)) {
      setButtons(newButtons)
      previousButtons.current = newButtons
    }

    if (JSON.stringify(newAxes) !== JSON.stringify(previousAxes.current)) {
      setAxes(newAxes)
      previousAxes.current = newAxes
    }
  }, [gamepad])

  const connectHandler = useCallback((event: GamepadEvent) => {
    setGamepad(event.gamepad)
  }, [])

  const disconnectHandler = () => {
    setGamepad(null)
  }

  useEffect(() => {
    window.addEventListener("gamepadconnected", connectHandler)
    window.addEventListener("gamepaddisconnected", disconnectHandler)

    return () => {
      window.removeEventListener("gamepadconnected", connectHandler)
      window.removeEventListener("gamepaddisconnected", disconnectHandler)
    }
  }, [connectHandler])

  useEffect(() => {
    let interval: NodeJS.Timeout | undefined

    if (gamepad) {
      interval = setInterval(updateGamepadStatus, 100)
    }

    return () => clearInterval(interval)
  }, [gamepad, updateGamepadStatus])

  return { buttons, axes, gamepad }
}

export default useGamepad
