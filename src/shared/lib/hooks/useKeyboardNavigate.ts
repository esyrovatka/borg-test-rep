import { useCallback, useEffect } from "react"

import { AxisValue, GamepadButton } from "@/shared/types"

import useGamepad from "./useGamepad"

interface IKeyboardNavigateProps {
  arrowUpAction?: () => void
  arrowDownAction?: () => void
  arrowLeftAction?: () => void
  arrowRightAction?: () => void
  enterAction?: () => void
  escapeAction?: () => void
}

const useKeyboardNavigate = ({
  arrowUpAction,
  arrowDownAction,
  arrowLeftAction,
  arrowRightAction,
  enterAction,
  escapeAction,
}: IKeyboardNavigateProps) => {
  const { buttons, axes, gamepad } = useGamepad()

  const arrowUp = useCallback(() => {
    arrowUpAction?.()
  }, [arrowUpAction])

  const arrowDown = useCallback(() => {
    arrowDownAction?.()
  }, [arrowDownAction])

  const arrowLeft = useCallback(() => {
    arrowLeftAction?.()
  }, [arrowLeftAction])

  const arrowRight = useCallback(() => {
    arrowRightAction?.()
  }, [arrowRightAction])

  const enterKey = useCallback(() => {
    enterAction?.()
  }, [enterAction])

  const escapeKey = useCallback(() => {
    escapeAction?.()
  }, [escapeAction])

  const handleKeyDown = useCallback(
    (event: KeyboardEvent) => {
      switch (event.key) {
        case "ArrowUp":
          event.preventDefault()
          arrowUp()
          break
        case "ArrowDown":
          event.preventDefault()
          arrowDown()
          break
        case "ArrowLeft":
          event.preventDefault()
          arrowLeft()
          break
        case "ArrowRight":
          event.preventDefault()
          arrowRight()
          break
        case "Enter":
          event.preventDefault()
          enterKey()
          break
        case "Escape":
          event.preventDefault()
          escapeKey()
          break
        default:
          break
      }
    },
    [arrowDown, arrowLeft, arrowRight, arrowUp, enterKey, escapeKey],
  )

  useEffect(() => {
    document.addEventListener("keydown", handleKeyDown)

    return () => {
      document.removeEventListener("keydown", handleKeyDown)
    }
  }, [handleKeyDown])

  useEffect(() => {
    if (buttons?.length) {
      buttons.forEach((pressed: boolean, index: number) => {
        if (pressed) {
          if (index === GamepadButton.DOWN) arrowDown()
          if (index === GamepadButton.LEFT) arrowLeft()
          if (index === GamepadButton.RIGHT) arrowRight()
          if (index === GamepadButton.UP) arrowUp()
          if (index === GamepadButton.ENTER) enterKey()
          if (index === GamepadButton.ESCAPE) escapeKey()
        }
      })
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [buttons])

  const detectAxisMovement = (axisValue: number, index: number): AxisValue => {
    if (index === 0) {
      // X-axis
      if (axisValue < -0.5) return AxisValue.LEFT
      if (axisValue > 0.5) return AxisValue.RIGHT
    } else if (index === 1) {
      // Y-axis
      if (axisValue < -0.5) return AxisValue.UP
      if (axisValue > 0.5) return AxisValue.DOWN
    }
    return AxisValue.DEFAULT
  }

  useEffect(() => {
    if (axes?.length) {
      axes.forEach((axis, index) => {
        const action = detectAxisMovement(axis, index)
        if (action !== AxisValue.DEFAULT) {
          if (action === AxisValue.LEFT) arrowLeft()
          if (action === AxisValue.UP) arrowUp()
          if (action === AxisValue.DOWN) arrowDown()
          if (action === AxisValue.RIGHT) arrowRight()
        }
      })
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [axes])
  return { gamepad }
}

export default useKeyboardNavigate
