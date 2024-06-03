/* eslint-disable no-restricted-syntax */

/* eslint-disable lines-between-class-members */
import { EConnection, streamSliceAction } from "@/entities/Stream"

import { AppDispatch } from "@/shared/lib"

import * as Enum from "../enum"
import * as Msg from "../msg"
import * as Util from "../util"
import { Input } from "../input"
import RTC from "../rtc"
import { ISignal } from "../signal"
import { VideoPlayer } from "../video"
import cfgDefaults from "./cfgDefaults"
import isVideoInactive from "./isVideoInactive"
import { IClientEvent, IConnectionAPI, IExitEvent, IShutterEvent, StopCodes } from "./types"

class Client {
  rtc: RTC | null | undefined
  signal: ISignal
  isConnected: boolean
  videoPlayer: VideoPlayer
  input: Input
  connected: Promise<unknown>
  private connectedResolve!: (value: unknown) => void
  private connectedReject!: (reason?: any) => void
  private pingInterval: null | number | any
  video: HTMLVideoElement
  private listeners: any[]
  onEvent: (event: IClientEvent) => void
  channelOpen: (name: string, channel: RTCDataChannel) => void
  paused: boolean
  private _reinitTimeout?: number | any
  pingLast: null | number
  pingMax: null | number
  private api: IConnectionAPI
  stallTimeout: number
  element: Element
  stream?: MediaStream
  iceServers?: any[]
  private configureRTC?: (rtc: RTCPeerConnection) => void
  exitCode?: number
  logInterval?: number
  dispatch: AppDispatch

  constructor(
    api: IConnectionAPI,
    signalFactory: (exit: (code: number) => void) => ISignal,
    element: Element,
    onEvent: (event: IClientEvent) => void,
    channelOpen: (name: string, channel: RTCDataChannel) => void,
    dispatch: AppDispatch,
  ) {
    this.dispatch = dispatch
    this.api = api
    this.onEvent = onEvent
    this.channelOpen = channelOpen
    this.isConnected = false
    this.connected = new Promise((resolve, reject) => {
      this.connectedResolve = resolve
      this.connectedReject = reject
    })
    this.rtc = null
    this.pingInterval = null
    this.listeners = []
    this.pingMax = null
    this.pingLast = null
    this.iceServers = []
    this.video = element as HTMLVideoElement
    this.element = element
    this.paused = false
    this.stallTimeout = 1000
    this.videoPlayer = new VideoPlayer(this.video, () => {
      this.rtc!.send(Msg.reinit(), 0)
    })
    this.signal = signalFactory((code: number) => {
      this.destroy(code === 4001 ? Enum.Warning.PeerGone : code)
    })
    this.input = new Input(this.video, buf => {
      if (this.isConnected) this.rtc!.send(buf, 0)
    })
    this.listeners.push(
      Util.addListener(window, "beforeunload", () => {
        this.destroy(0)
        return null
      }),
    )
    this.listeners.push(
      Util.addListener(this.video, "playing", () => {
        this._status("")
      }),
    )
    for (const event of ["abort", "ended", "stalled", "suspend", "waiting"]) {
      this.listeners.push(
        Util.addListener(this.video, event, () => {
          if (!this.exited() && this.isConnected) this.rtc!.send(Msg.reinit(), 0)
          this._status(`video ${event}`)
        }),
      )
    }
    this.listeners.push(
      Util.addListener(this.video, "error", () => {
        if (!this.exited() && this.isConnected) this.rtc!.send(Msg.reinit(), 0)
        this._status(`video error: ${this.video.error!.message}`)
      }),
    )
  }

  _dispatchEvent(buf: ArrayBufferLike) {
    const msg = Msg.unpack(buf) as Msg.ICursorMessage
    switch (msg.type) {
      case Enum.Msg.Cursor:
        this.input.setMouseMode(msg.relative, msg.hidden)
        if (msg.data) this.input.setCursor(msg.data, msg.hotX, msg.hotY)
        break
      case Enum.Msg.Abort:
        console.log("Server Abort", msg.data0)
        this.destroy(msg.data0)
        break
      case Enum.Msg.Shutter:
        this.onEvent({ type: "shutter", enabled: !!msg.data0 } as IShutterEvent)
        break
      case Enum.Msg.Status:
        this.onEvent({ type: "status", msg })
        break
      case Enum.Msg.Chat:
        this.onEvent({ type: "chat", msg })
        break
      default:
        break
    }
  }

  async connect(sessionId: string, serverOffer: RTCSessionDescriptionInit, cfg: any) {
    cfg = cfgDefaults(cfg)
    cfg = this.signal.cfgDefaults(cfg)

    const onRTCCandidate = (candidateJSON: string) => {
      this.signal.sendCandidate(candidateJSON)
    }
    let networkStatistics: any

    const onControlOpen = async () => {
      this._status("connected\n\nwaiting for reply...")
      const channel = this.rtc!.channels[0]
      try {
        networkStatistics = await this.channelOpen("control", channel)
      } catch (e) {
        this.connectedReject(e)
      }
      if (this.exited()) return
      this._status("waiting for video...")
      channel.onmessage = event => {
        this._dispatchEvent(event.data)
      }
      this.isConnected = true
      this.connectedResolve(networkStatistics)
      this.paused = false
      this.listeners.push(
        Util.addListener(document, "visibilitychange", () => {
          if (document.hidden) {
            this.video.pause()
            this.paused = true
            this.rtc!.send(Msg.block(), 0)
          } else {
            this.video.play()
            this.paused = false
            this.rtc!.send(Msg.reinit(), 0)
          }
          this.onEvent({ type: "pause", msg: { str: this.paused.toString() } })
        }),
      )
      this.rtc!.send(Msg.config(cfg), 0)
      this.rtc!.send(Msg.init(), 0)
      this.pingInterval = setInterval(() => {
        this._ping()
      }, 1000)
      this._setReinitTimeout()
      this.listeners.push(
        Util.addListener(this.video, "timeupdate", () => {
          this.onEvent({ type: "frame" })
          clearTimeout(this._reinitTimeout)
          this._setReinitTimeout()
        }),
      )
      if (this.stream) {
        this.video.srcObject = this.stream
        this.video.play()
      }
      this.input.attach()
      this.onEvent({ type: "connect" })
    }

    const cert = await RTCPeerConnection.generateCertificate({
      name: "RSASSA-PKCS1-v1_5",
      hash: "SHA-256",
      modulusLength: 2048,
      publicExponent: new Uint8Array([1, 0, 1]),
    } as RsaHashedKeyGenParams)

    const props = {
      serverOffer,
      attemptId: this.signal.getAttemptId(),
      onCandidate: onRTCCandidate,
      iceServers: this.iceServers,
      certificates: [cert],
    }

    this.rtc = new RTC(props)

    this.rtc.rtc.addEventListener("datachannel", event => {
      const { channel } = event
      console.log("datachannel", channel.label, channel.id, channel.readyState)
      switch (channel.label) {
        case "control":
          this.rtc!.setChannel(0, channel)
          onControlOpen()
          break
        case "persistence":
          this.channelOpen("persistence", channel)
          break
        default:
          console.error("Unknown datachannel", channel.label)
          break
      }
    })

    this.rtc.rtc.ontrack = event => {
      if (event.track.kind !== "video") return
      const [firstStream] = event.streams
      this.stream = firstStream
      this.stream.addEventListener("removetrack", event => {
        console.debug("removetrack", event)
      })
    }
    if (this.configureRTC) {
      this.configureRTC(this.rtc.rtc)
      this.rtc.configureRTC = this.configureRTC
    }
    const myAnswer = await this.rtc.createAnswer()
    if (isVideoInactive(myAnswer.sdp!)) throw new Error("Browser does not support necessary video codec")
    this._status("connecting...")
    this.signal.connect(cfg, sessionId, myAnswer, (candidate: string) => {
      this.rtc!.setRemoteCandidate(candidate)
    })
    await this.connected
  }

  setConfig(config: any) {
    if (!this.isConnected) return
    this.rtc!.send(Msg.config(config), 0)
  }

  _setReinitTimeout() {
    this._reinitTimeout = setTimeout(() => {
      if (!this.exited() && !this.paused) {
        this.onEvent({ type: "stall" })
        console.debug("timeupdate stalled")
        this.rtc!.send(Msg.reinit(), 0)
        this._setReinitTimeout()
      }
    }, this.stallTimeout)
  }
  async _ping() {
    const channel = this.rtc!.channels[0]
    const tag = Math.floor(Math.random() * 0x60000000)
    const start = performance.now()
    let completed = false
    const roundtrip = new Promise<number>((resolve, reject) => {
      function responseListener(event: MessageEvent<ArrayBuffer>) {
        const end = performance.now()
        if (end - start > 30000) {
          channel.removeEventListener("message", responseListener)
          // eslint-disable-next-line prefer-promise-reject-errors
          reject("timeout")
          return
        }
        const msg = Msg.unpack(event.data)
        if (msg.type !== Enum.Msg.Ping || msg.data0 !== tag) {
          return
        }
        channel.removeEventListener("message", responseListener)
        resolve(end)
      }
      channel.addEventListener("message", responseListener)
      setTimeout((_resolve: any, reject: (arg0: string) => void) => {
        channel.removeEventListener("message", responseListener)
        if (!completed) {
          console.error(`ping timeout ${tag}`)
          reject("timeout")
        }
      }, 30000)
    })

    this.rtc!.send(Msg.ping(tag), 0)

    try {
      const end = await roundtrip
      completed = true
      const roundtrip_ms = end - start
      this.pingLast = roundtrip_ms
      if (this.pingMax === null || roundtrip_ms > this.pingMax) {
        this.pingMax = roundtrip_ms
      }

      const highPingLimit = 220

      const connection = roundtrip_ms > highPingLimit ? EConnection.POOR : EConnection.OK
      this.dispatch(streamSliceAction.onChangeConnection(connection))
    } catch (e) {
      if (e === "timeout") return
      throw e
    }
  }

  exited() {
    return Object.prototype.hasOwnProperty.call(this, "exitCode")
  }
  _status(msg: string) {
    console.log("status:", msg)
    this.onEvent({ type: "status", msg: { str: msg || "test" } })
  }

  destroy(code: number) {
    if (this.exited()) {
      console.warn(`exit reentry ${code} after ${this.exitCode}`)
    }
    this.exitCode = code
    Util.removeListeners(this.listeners)
    this.signal.close(code >= 3000 && code < 5000 ? code : 1000)
    if (code !== Client.StopCodes.CONCURRENT_SESSION) {
      this.video.pause()
    }
    this.videoPlayer.destroy()
    this.input.detach()
    if (this.pingInterval !== null) {
      clearInterval(this.pingInterval)
      this.pingInterval = null
    }
    if (this.isConnected) {
      clearInterval(this.logInterval)
      this.rtc!.send(Msg.abort(code), 0)
    }
    this.api.connectionUpdate({
      state_str: "LSC_EXIT",
      attempt_id: this.signal.getAttemptId(),
      exit_code: code,
    })
    this.rtc?.close()
    this.isConnected = false
    this.onEvent({ type: "exit", code } as IExitEvent)
  }

  static StopCodes = StopCodes
}

export default Client
