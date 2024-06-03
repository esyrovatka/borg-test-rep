import { useCallback, useEffect, useRef, useState } from "react"

import { isNavBarSelector, keyboardSliceAction } from "@/entities/Keyboard"

import { useAppDispatch, useAppSelector } from "@/shared/lib"

const useHomePage = () => {
  const isNavBar = useAppSelector(isNavBarSelector)
  const [isNavBarNavigate, setIsNavBarNavigate] = useState<boolean>(false)

  const dispatch = useAppDispatch()

  const changeNavigateToNavBar = useCallback(() => {
    dispatch(keyboardSliceAction.onChangeIsNavBar())
  }, [dispatch])

  const [selectedGame, setSelectedGame] = useState<{ row: number | null; item: number }>({
    row: 0,
    item: 1,
  })

  const handleKeyDown = useCallback(
    (event: KeyboardEvent) => {
      switch (event.key) {
        case "ArrowUp":
          event.preventDefault()
          if (isNavBarNavigate) break

          setSelectedGame(prevState => ({
            ...prevState,
            ...((prevState.row !== 4 || prevState.item === 1) && { row: Math.max((prevState.row || 1) - 1, 1) }),
            ...(prevState.item > 1 && { item: prevState.item - 1 }),
          }))
          break
        case "ArrowDown":
          event.preventDefault()
          if (isNavBarNavigate) break

          setSelectedGame(prevState => ({
            ...prevState,
            ...(prevState.row !== 4 && { row: Math.min((prevState.row || 0) + 1, 4) }),
            ...(prevState.row === 4 ? { item: Math.min(prevState.item + 1, 12) } : { item: 1 }),
          }))
          break
        case "ArrowLeft":
          event.preventDefault()

          if (selectedGame.row) {
            if (selectedGame.item === 1) {
              changeNavigateToNavBar()
            } else {
              setSelectedGame(prevState => ({
                ...prevState,
                item: prevState.item - 1,
              }))
            }
          }

          break
        case "ArrowRight":
          event.preventDefault()

          if (isNavBarNavigate) {
            changeNavigateToNavBar()
          } else if (selectedGame.row) {
            setSelectedGame(prevState => ({
              ...prevState,
              item: prevState.item === 12 ? 1 : (prevState.item || 0) + 1,
            }))
          }

          break
        default:
          break
      }
    },
    [changeNavigateToNavBar, isNavBarNavigate, selectedGame.item, selectedGame.row],
  )

  const stopKeyNavigate = useCallback(
    (event: KeyboardEvent) => {
      if (event.key === "Enter") {
        document.removeEventListener("keydown", handleKeyDown)
      }
    },
    [handleKeyDown],
  )

  const returnKeyNavigate = useCallback(
    (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        document.addEventListener("keydown", handleKeyDown)
      }
    },
    [handleKeyDown],
  )

  useEffect(() => {
    document.addEventListener("keydown", handleKeyDown)
    document.addEventListener("keydown", stopKeyNavigate)
    document.addEventListener("keydown", returnKeyNavigate)
    return () => {
      document.removeEventListener("keydown", handleKeyDown)
      document.removeEventListener("keydown", stopKeyNavigate)
      document.removeEventListener("keydown", returnKeyNavigate)
    }
  }, [handleKeyDown, returnKeyNavigate, stopKeyNavigate])

  useEffect(() => {
    setIsNavBarNavigate(isNavBar)
  }, [isNavBar])

  const recentlyPlayedGamesRef = useRef<HTMLDivElement | null>(null)
  const mostPopularGamesRef = useRef<HTMLDivElement | null>(null)
  const newlyAddedGamesRef = useRef<HTMLDivElement | null>(null)
  const immediatelyAvailableGamesRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    const containers: { [key: number]: HTMLDivElement | null } = {
      1: recentlyPlayedGamesRef.current,
      2: mostPopularGamesRef.current,
      3: newlyAddedGamesRef.current,
      4: immediatelyAvailableGamesRef.current,
    }

    if (selectedGame.row !== null && containers[selectedGame.row]) {
      const container = containers[selectedGame.row]
      const sliderTop = container?.offsetTop || 100
      window.scrollTo({
        top: sliderTop - 100,
        behavior: "smooth",
      })
    }
  }, [selectedGame.row])

  return {
    selectedGame,
    recentlyPlayedGamesRef,
    mostPopularGamesRef,
    newlyAddedGamesRef,
    immediatelyAvailableGamesRef,
    handleKeyDown,
    isNavBarNavigate,
  }
}

export default useHomePage
