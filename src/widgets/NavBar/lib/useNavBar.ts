import { usePathname, useRouter } from "next/navigation"
import { useCallback, useEffect, useState } from "react"

import { isNavBarSelector } from "@/entities/Keyboard"
import { isLoginModalOpenSelector, navBarAction } from "@/entities/NavBar"
import { getCurrentUser, getUserDataSelector, IUserData, logout, selectUserIsLoadingSelector } from "@/entities/User"

import { useAppDispatch, useAppSelector } from "@/shared/lib"

import { navLinks } from "../const"

const useNavBar = () => {
  const isNavBarNavigate = useAppSelector(isNavBarSelector)
  const [item, setItem] = useState<number>(1)
  const { push: navigate } = useRouter()
  const profileNavigate = () => navigate("/profile")

  const [isOpenMenu, setIsOpenMenu] = useState<boolean>(true)
  const [user, setUser] = useState<IUserData | undefined>(undefined)
  const userData = useAppSelector(getUserDataSelector)
  const isUserLoad = useAppSelector(selectUserIsLoadingSelector)
  const isModalOpen = useAppSelector(isLoginModalOpenSelector)
  const pathname = usePathname()
  const dispatch = useAppDispatch()
  const openLoginModal = () => dispatch(navBarAction.onOpenLoginModal())
  const handleLogout = () => dispatch(logout())

  const commonKeyboardNavigateConfig = navLinks.map((link, index) => ({
    item: index + 1,
    onclick: () => navigate(link.href),
  }))

  const keyboardUserNavigateConfig = [
    ...commonKeyboardNavigateConfig,
    { item: commonKeyboardNavigateConfig.length + 1, onclick: profileNavigate },
    { item: commonKeyboardNavigateConfig.length + 2, onclick: handleLogout },
    { item: commonKeyboardNavigateConfig.length + 3, onclick: profileNavigate },
  ]

  const keyboardEmptyUserNavigateConfig = [
    ...commonKeyboardNavigateConfig,
    { item: commonKeyboardNavigateConfig.length + 1, onclick: profileNavigate },
    { item: commonKeyboardNavigateConfig.length + 2, onclick: openLoginModal },
  ]

  const config = user ? keyboardUserNavigateConfig : keyboardEmptyUserNavigateConfig

  const toggleOpenMenu = () => {
    setIsOpenMenu(prev => !prev)
    dispatch(navBarAction.toggleOpenNavBar())
  }

  useEffect(() => {
    if (!isUserLoad) setUser(userData)
  }, [isUserLoad, userData])

  useEffect(() => {
    dispatch(getCurrentUser())
  }, [dispatch])

  const handleKeyDown = useCallback(
    (event: KeyboardEvent) => {
      if (!isNavBarNavigate) return

      if (event.key === "Enter") config[item - 1].onclick()

      if (event.key === "ArrowUp") {
        setItem(prevState => prevState - 1 || config.length)
      }

      if (event.key === "ArrowDown") {
        setItem(prevState => (prevState === config.length ? 1 : prevState + 1))
      }
    },
    [config, isNavBarNavigate, item],
  )

  useEffect(() => {
    document.addEventListener("keydown", handleKeyDown)
    return () => {
      document.removeEventListener("keydown", handleKeyDown)
    }
  }, [handleKeyDown])

  useEffect(() => {
    if (!isNavBarNavigate) document.removeEventListener("keydown", handleKeyDown)
  }, [isNavBarNavigate, handleKeyDown])

  return {
    item,
    isNavBarNavigate,
    isOpenMenu,
    toggleOpenMenu,
    isModalOpen,
    user,
    pathname,
    profileNavigate,
    openLoginModal,
    handleLogout,
  }
}

export default useNavBar
