import { useEffect, useMemo, useRef, useState } from "react"

import { toast } from "react-toastify"

import {
  isDisabledPageNavigateSelector,
  isHeaderSearchSelector,
  isNavBarSelector,
  keyboardSliceAction,
} from "@/entities/Keyboard"

import { useAppDispatch, useAppSelector } from "@/shared/lib"
import { useKeyboardNavigate, useWindowSize } from "@/shared/lib/hooks"

import { MOBILE_BREAKPOINT, TABLET_BREAKPOINT } from "../const"

const useHomePage = () => {
  const dispatch = useAppDispatch()
  const isNavBarNavigate = useAppSelector(isNavBarSelector)
  const isHeaderSearch = useAppSelector(isHeaderSearchSelector)
  const [isNavigateEnabled, setIsNavigateEnabled] = useState<boolean>(true)
  const { width: screenWidth } = useWindowSize()
  const [gamepadConnected, setGamepadConnected] = useState<boolean>(false)

  const isNavDisabled = useAppSelector(isDisabledPageNavigateSelector)

  const stepCount = useMemo(() => {
    if (screenWidth < MOBILE_BREAKPOINT) return 1
    if (screenWidth < TABLET_BREAKPOINT) return 2
    return 3
  }, [screenWidth])

  const changeNavigateToNavBar = () => dispatch(keyboardSliceAction.onChangeIsNavBar())

  const [selectedGame, setSelectedGame] = useState<{ row: number; item: number }>({
    row: 0,
    item: 1,
  })

  const arrowUp = () => {
    if (!isNavigateEnabled) return
    if (isNavBarNavigate) return
    if (isNavDisabled) return
    if (selectedGame.row === 1) {
      dispatch(keyboardSliceAction.onChangeIsHeaderSearch())
      setSelectedGame(prev => ({ ...prev, row: 0 }))
    } else {
      setSelectedGame(prevState => ({
        ...prevState,
        ...((prevState.row !== 4 || prevState.item < 4) && { row: (prevState.row || 1) - 1, item: 1 }),
        ...(prevState.item > 3 && { item: prevState.item - stepCount }),
      }))
    }
  }

  const arrowDown = () => {
    if (!isNavigateEnabled) return
    if (isHeaderSearch) return
    if (isNavBarNavigate) return
    if (isNavDisabled) return
    setSelectedGame(prevState => ({
      ...prevState,
      ...(prevState.row !== 4 && { row: (prevState.row || 0) + 1 }),
      ...(prevState.row === 4 ? { item: Math.min(prevState.item + stepCount, 12) } : { item: 1 }),
    }))
  }

  const arrowLeft = () => {
    if (!isNavigateEnabled) return
    if (isHeaderSearch) return
    if (isNavDisabled) return
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
  }

  const arrowRight = () => {
    if (!isNavigateEnabled) return
    if (isHeaderSearch) return
    if (isNavDisabled) return
    if (isNavBarNavigate) {
      changeNavigateToNavBar()
    } else if (selectedGame.row) {
      setSelectedGame(prevState => ({
        ...prevState,
        item: prevState.item === 12 ? 1 : (prevState.item || 0) + 1,
      }))
    }
  }

  const { gamepad } = useKeyboardNavigate({
    arrowDownAction: arrowDown,
    arrowUpAction: arrowUp,
    arrowLeftAction: arrowLeft,
    arrowRightAction: arrowRight,
  })

  useEffect(() => {
    if (gamepad && !gamepadConnected) {
      setGamepadConnected(true)
      toast.success("gamepad connect")
    }

    if (!gamepad && gamepadConnected) {
      setGamepadConnected(false)
      toast.info("gamepad disconnect")
    }
  }, [gamepad, gamepadConnected])

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
    isNavBarNavigate,
  }
}

export default useHomePage
