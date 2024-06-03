import { toast } from "react-toastify"

import { navBarAction } from "@/entities/NavBar"

import { AppDispatch } from "@/shared/lib"

import ensureSyncFolders from "../api/ensureSyncFolders"
import { getNodes } from "../api/getNodes"
import { completeLogin } from "../game"
import { IMinecraftLoginInit } from "../game/beginLogin"
import { ILaunchConfig } from "../types"
import runClient from "./runClient"
import { timeout } from "./timeout"

const launchGame = async (
  title: string,
  video: HTMLVideoElement | null,
  dispatch: AppDispatch,
  msRes?: IMinecraftLoginInit,
) => {
  if (!video) return

  const gameName = title.split(" ")
  const isDemo = title.includes("demo")

  const token = localStorage.getItem("token")
  if (!token && !isDemo) {
    dispatch(navBarAction.onOpenLoginModal())
    return
  }

  let game = gameName[0].toLowerCase() + (isDemo ? "?demo=true" : "")

  if (msRes) {
    window.open(msRes.location, "_blank")
    await completeLogin(msRes.code)
    game = "minecraft?trial=1"
  }
  const uri = new URL(`borg:games/${game}`)

  if (uri.searchParams.get("trial") === "1") toast.warn("Trial mode: 5 minutes", { autoClose: 30000 })

  const nodes = await getNodes({ verMin: "0.2.40" })

  if (!nodes.length) {
    toast.error("Unfortunately, all nodes for joining are occupied, please wait until it becomes free.")
    return
  }

  const time_out = timeout(1000 * 60 * 5)
  let persistenceID: string | undefined
  if (token) {
    persistenceID = await ensureSyncFolders(uri, token)
  }

  const handlePopState = () => {
    alert("Are you sure you want to exit the game?")
    window.location.reload()
  }

  window.addEventListener("popstate", handlePopState)

  try {
    const config: ILaunchConfig = { game }
    if (!config.sessionId) config.sessionId = crypto.randomUUID()

    document.body.classList.add("video")
    video.controls = false
    window.history.pushState({ videoPlaying: true }, "", `/${game}`)

    const code = await runClient(nodes, persistenceID, config, time_out, video, dispatch)

    if (code !== 0) {
      const message = code instanceof Error ? code.message || `Unexpected error: ${code}` : `Exit code: ${code}`
      toast.error(message)
    }
  } catch (e) {
    alert(e)
  } finally {
    document.body.classList.remove("video")
    video.src = ""
    video.load()
    window.removeEventListener("popstate", handlePopState)
  }
}

export default launchGame
