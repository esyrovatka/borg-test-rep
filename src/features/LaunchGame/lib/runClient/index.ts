import { IBorgNode } from "@/widgets/GameItem/types"

import { streamSliceAction } from "@/entities/Stream"

import { AppDispatch } from "@/shared/lib"
import { getToken } from "@/shared/lib/GOG/getToken"
import getSignedLicenses from "@/shared/lib/Steam/getSignedLicenses"

import { getCreds } from "../../game"
import { ILaunchConfig } from "../../types"
import { Ephemeral } from "../ephemeral"
import { Client, ClientAPI, getNetworkStatistics, notifications, Session, Util } from "../streaming-client"
import { createOneDrivePersistence } from "../streaming-client/drive-persistence"
import run from "./run"

const runClient = (
  nodes: IBorgNode[],
  persistenceID: string | null | undefined,
  config: ILaunchConfig,
  timeout: Promise<any>,
  video: HTMLVideoElement,
  dispatch: AppDispatch,
) => {
  const clientApi = new ClientAPI()
  const videoElement = document.getElementById("stream") as HTMLVideoElement
  videoElement.controls = false
  const resume = document.getElementById("video-resume")!
  const containerNotifications = document.getElementById("notifications")
  const isLoggedIn = !!localStorage.getItem("token")

  const signalFactory = (_: any) => new Ephemeral()

  return new Promise(resolve => {
    const clients: Client[] = []

    function killOthers(current: Client) {
      for (let j = 0; j < clients.length; j += 1) {
        if (clients[j] !== current) clients[j].destroy(Client.StopCodes.CONCURRENT_SESSION)
      }
      clients.length = 1
      clients[0] = current
    }

    for (let i = 0; i < nodes.length; i += 1) {
      const offer = nodes[i]
      let stall: number | NodeJS.Timeout = 0
      let stall_reset: number | NodeJS.Timeout = 0
      const client = new Client(
        clientApi,
        signalFactory,
        video,
        (event: any) => {
          switch (event.type) {
            case "exit":
              if (event.code !== Client.StopCodes.CONCURRENT_SESSION) resolve(event.code)
              else clients.removeByValue(client)
              break
            case "stall":
              if (stall !== 0) break
              stall = setTimeout(() => {
                if (!client.exited()) client.destroy(Client.StopCodes.CONNECTION_TIMEOUT)
              }, 30000)
              stall_reset = setTimeout(() => {
                if (!client.exited()) {
                  stall_reset = 0
                }
              })
              console.debug("stall started: ", stall)
              break
            case "frame":
              if (stall !== 0) {
                console.debug(`stall cleared: ${stall}`)
                clearTimeout(stall)
                stall = 0
              }
              if (stall_reset !== 0) {
                console.debug(`stall reset cleared: ${stall_reset}`)
                clearTimeout(stall_reset)
                stall_reset = 0
              }
              break
            case "status":
              if (client.exitCode === Client.StopCodes.CONCURRENT_SESSION) break
              dispatch(streamSliceAction.changeStatus(event.msg!.str))
              resume.style.display = event.msg!.str === "video suspend" ? "inline-block" : "none"
              if (event.msg!.str === "video suspend") video.autoplay = false
              break
            case "chat":
              notifications(event.msg?.str, 30000, containerNotifications)
              break
            default:
              notifications(event.msg?.str, 30000, containerNotifications)
              break
          }
        },
        async (name: string, channel: RTCDataChannel) => {
          switch (name) {
            case "control":
              try {
                await Session.waitForCommandRequest(channel)
                if (client.exited()) break
                const stats = await getNetworkStatistics(channel)
                if (client.exited()) break
                await Session.waitForCommandRequest(channel)
                if (client.exited()) break

                killOthers(client)
                if (client.exited()) break

                const SteamLicenses = isLoggedIn ? await getSignedLicenses() : undefined
                const Cml = isLoggedIn ? await getCreds() : undefined
                const GogToken = isLoggedIn ? await getToken() : undefined

                const launch = {
                  Launch: `borg:games/${config.game}`,
                  // PersistenceRoot: persistenceID,
                  SteamLicenses,
                  GogToken,
                  Cml,
                }

                channel.send(`\x15${JSON.stringify(launch)}`)
                await Session.waitForCommandRequest(channel)
              } catch (error) {
                console.error("Error occurred during control channel processing:", error)
              }

              break
            case "persistence":
              try {
                if (isLoggedIn && persistenceID) {
                  const persistence = createOneDrivePersistence(channel, [persistenceID])
                  console.log("persistence enabled")
                } else {
                  console.warn("persistence not available")
                }
              } catch (error) {
                console.error("Error occurred during persistence channel processing:", error)
              }
              break
            default:
              break
          }
        },
        dispatch,
      )

      clients.push(client)

      const hotkeys = (event: KeyboardEvent) => {
        event.preventDefault()

        if (event.code === "Backquote" && event.ctrlKey && event.altKey) {
          client.destroy(0)
        } else if (event.code === "Enter" && event.ctrlKey && event.altKey) {
          Util.toggleFullscreen(videoElement)
        } else if (event.code === "Slash" && event.ctrlKey && event.altKey) {
          document.getElementById("video-resolution")!.innerText = `${video.videoWidth} x ${video.videoHeight}`
          document.body.classList.toggle("video-overlay")
        }
      }
      document.addEventListener("keydown", hotkeys, true)

      run(offer, timeout, client, clients, resolve)
    }
  })
}

export default runClient
