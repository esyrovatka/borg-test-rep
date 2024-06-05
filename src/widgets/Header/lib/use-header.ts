"use client"

import { usePathname, useRouter } from "next/navigation"
import { useEffect, useRef, useState } from "react"

import { IGameItemProps } from "@/widgets/GameItem/types"

import { gamesAction, immediatelyAvailableGames } from "@/entities/Games"
import { isHeaderSearchSelector, keyboardSliceAction } from "@/entities/Keyboard"
import { isNavBarOpenSelector } from "@/entities/NavBar"

import { useAppDispatch, useAppSelector, useDebounce } from "@/shared/lib"
import { useKeyboardNavigate } from "@/shared/lib/hooks"

const useHeader = () => {
  const pathname = usePathname()
  const dispatch = useAppDispatch()
  const isNavBarOpenOpen = useAppSelector(isNavBarOpenSelector)
  const isHeaderSearch = useAppSelector(isHeaderSearchSelector)
  const [isEmptySearch, setIsEmptySearch] = useState<boolean>(false)
  const [searchResult, setSearchResult] = useState<IGameItemProps[]>([])
  const [searchValue, setSearchValue] = useState<string>("")
  const [keyboardVisible, setKeyboardVisible] = useState(true)
  const inputRef = useRef<HTMLInputElement>()
  const itemRefs = useRef<HTMLAnchorElement[]>([])
  const { push: navigate } = useRouter()

  const findGames = useDebounce((value: string) => {
    dispatch(gamesAction.filterGames(value))
    if (value) {
      const checkTitle = (obj: IGameItemProps) => obj.title.toLowerCase().includes(value.toLowerCase())
      const filteredArray = immediatelyAvailableGames.filter(checkTitle)
      setIsEmptySearch(!filteredArray.length)
      return setSearchResult(filteredArray)
    }
    setIsEmptySearch(false)
    return setSearchResult([])
  }, 2000)

  const [selectedGameIdx, setIsSelectedGameIdx] = useState<number | null>(null)

  const arrowDown = () => {
    if (!isHeaderSearch) return
    if (searchResult.length && selectedGameIdx !== searchResult.length - 1) {
      setIsSelectedGameIdx(prev => (prev !== null ? prev + 1 : 0))
    } else {
      dispatch(keyboardSliceAction.onChangeIsHeaderSearch())
      setIsEmptySearch(false)
      setSearchValue("")
      setSearchResult([])
      itemRefs.current = []
      setIsSelectedGameIdx(null)
    }
  }

  const arrowUp = () => {
    if (!isHeaderSearch) return
    setIsSelectedGameIdx(prev => (prev ? prev - 1 : 0))
  }

  const enterAction = () => {
    if (searchResult.length && selectedGameIdx !== null) {
      navigate(`/game/${searchResult[selectedGameIdx].id}`)
    }
  }

  const { gamepad } = useKeyboardNavigate({
    arrowDownAction: arrowDown,
    arrowUpAction: arrowUp,
    enterAction,
  })

  useEffect(() => {
    setSearchValue("")
    setSearchResult([])
    dispatch(gamesAction.filterGames(""))
  }, [dispatch, pathname])

  const handleChange = (value: string) => {
    setSearchValue(value)
    findGames(value)
  }

  useEffect(() => {
    setKeyboardVisible(isHeaderSearch && !!gamepad)
  }, [gamepad, isHeaderSearch])

  useEffect(() => {
    if (isHeaderSearch) {
      inputRef.current?.focus()
    } else {
      inputRef.current?.blur()
    }
  }, [isHeaderSearch])

  useEffect(() => {
    if (selectedGameIdx && itemRefs.current[selectedGameIdx]) {
      itemRefs.current[selectedGameIdx].scrollIntoView({ behavior: "smooth", block: "nearest" })
    }
  }, [selectedGameIdx])

  return {
    isEmptySearch,
    searchResult,
    findGames,
    searchValue,
    handleChange,
    isNavBarOpenOpen,
    inputRef,
    keyboardVisible,
    selectedGameIdx,
    itemRefs,
  }
}

export default useHeader
