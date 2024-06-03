import { useCallback, useEffect, useState } from "react"

import { isNavBarOpenSelector } from "@/entities/NavBar"
import { getUserDataSelector, selectUserIsLoadingSelector } from "@/entities/User"

import { classNames, useAppSelector } from "@/shared/lib"
import { Typography } from "@/shared/ui/Typography"

import { getGamesFromOneDrive } from "./lib/getGamesFromOneDrive"
import styles from "./MyGamesPage.module.scss"
import { IMyGamesProps } from "./types"
import { EmptyState, GamesState, Loader, NotInstallAppState, NotLoginState } from "./ui"

export const MyGamesPage = () => {
  const isNavBarOpenOpen = useAppSelector(isNavBarOpenSelector)
  const isUserLoad = useAppSelector(selectUserIsLoadingSelector)
  const userData = useAppSelector(getUserDataSelector)
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [isDownloadApp, setIsDownloadApp] = useState<boolean>(false)
  const [myGames, setMyGames] = useState<IMyGamesProps[]>([])

  const getGames = useCallback(async () => {
    const token = localStorage.getItem("token")
    if (token) {
      setIsLoading(true)
      const result = await getGamesFromOneDrive(token)
      setMyGames(result)
      setIsDownloadApp(!!result.length)
      setIsLoading(false)
    }
  }, [])

  useEffect(() => {
    getGames()
  }, [getGames])

  const content = useCallback(() => {
    if (isLoading || isUserLoad) return <Loader />
    if (!userData) return <NotLoginState />
    if (!isDownloadApp) return <NotInstallAppState />
    if (!myGames.length) return <EmptyState />
    return <GamesState list={myGames} />
  }, [isLoading, isUserLoad, userData, isDownloadApp, myGames])

  return (
    <div className={classNames(styles.wrapper, { [styles.isOpen]: isNavBarOpenOpen })}>
      <Typography weight="seven" className={styles.wrapper__title}>
        My Games
      </Typography>
      {content()}
    </div>
  )
}
