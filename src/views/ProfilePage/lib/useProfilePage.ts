import { useEffect, useState } from "react"

import axios from "axios"

import { deleteSteamIdToOneDrive, gamesAction, getGamesSelector, writeSteamIdToOneDrive } from "@/entities/Games"
import { isNavBarOpenSelector } from "@/entities/NavBar"
import { getUserDataSelector, IUserData, selectUserIsLoadingSelector } from "@/entities/User"

import { useAppDispatch, useAppSelector } from "@/shared/lib"

import { TPlatformTypes } from "../types"

export const useProfilePage = () => {
  const isNavBarOpenOpen = useAppSelector(isNavBarOpenSelector)
  const userData = useAppSelector(getUserDataSelector)
  const isUserLoad = useAppSelector(selectUserIsLoadingSelector)
  const platformGames = useAppSelector(getGamesSelector)
  const dispatch = useAppDispatch()
  const [user, setUser] = useState<IUserData | undefined>(undefined)
  useEffect(() => {
    if (!isUserLoad) setUser(userData)
  }, [isUserLoad, userData])

  const steamConnect = () => {
    const steamBaseApi = "https://steamcommunity.com/openid/login"
    const { host } = window.location
    const hostUrl = `https://${host}/profile`
    const hostArg = encodeURIComponent(hostUrl)
    const steamBaseApiParams =
      // eslint-disable-next-line max-len
      `openid.ns=http://specs.openid.net/auth/2.0&openid.claimed_id=http://specs.openid.net/auth/2.0/identifier_select&openid.identity=http://specs.openid.net/auth/2.0/identifier_select&openid.return_to=${hostArg}&openid.realm=${hostArg}&openid.mode=checkid_setup`

    window.location.href = `${steamBaseApi}?${steamBaseApiParams}`
  }

  const gogConnect = async () => {}
  const epicConnect = async () => {}

  const handleConnect = async (platform: TPlatformTypes) => {
    switch (platform) {
      case "steam":
        return steamConnect()
      case "gog":
        return gogConnect()
      case "epic":
        return epicConnect()
      default:
        return null
    }
  }

  const handleDisconnect = async (platform: TPlatformTypes) => {
    if (platform === "steam") dispatch(deleteSteamIdToOneDrive())
  }

  useEffect(() => {
    const connectSteam = async () => {
      const params = new URLSearchParams(window.location.search)
      const steamId = params.get("openid.claimed_id")?.split("/").pop() || userData?.steam_id

      if (steamId) {
        if (!userData?.steam_id) await writeSteamIdToOneDrive(steamId)
        const { data } = await axios.get(
          `https://api.steampowered.com/IPlayerService/GetOwnedGames/v1/?key=${process.env.NEXT_PUBLIC_STEAM_API_KEY}&steamid=${steamId}&format=json`,
        )
        dispatch(gamesAction.connectSteam(data.response.games))
      }
    }

    if (!isUserLoad) connectSteam()
  }, [dispatch, isUserLoad, userData?.steam_id])
  return { isNavBarOpenOpen, user, isUserLoad, handleConnect, platformGames, handleDisconnect }
}
