/* eslint-disable lines-between-class-members */

interface RTCProps {
  serverOffer: RTCSessionDescriptionInit
  attemptId: string
  onCandidate: (candidateJSON: string) => void
  iceServers?: RTCIceServer[]
  certificates?: RTCCertificate[]
}

class RTC {
  rtc: RTCPeerConnection
  private onCandidate: (candidateJSON: string) => void
  channels: { [id: number]: RTCDataChannel }
  serverOffer: RTCSessionDescriptionInit
  offer: RTCLocalSessionDescriptionInit | null
  started: null | Promise<void>
  configureRTC: ((rtc: RTCPeerConnection) => void) | undefined
  attemptId: string
  sdp: Record<string, any> | null

  constructor(props: RTCProps) {
    const { serverOffer, attemptId, onCandidate, iceServers = [], certificates = [] } = props
    this.onCandidate = onCandidate
    this.attemptId = attemptId
    this.serverOffer = serverOffer
    this.started = null
    this.sdp = null
    this.channels = {}
    this.offer = null

    this.rtc = new RTCPeerConnection({
      iceServers: [{ urls: "stun:stun.l.google.com:19302" }, { urls: "stun:stunserver.org:3478" }, ...iceServers],
      certificates,
    })

    this.rtc.onicecandidate = event => {
      const { candidate } = event.candidate || {}
      if (candidate) {
        console.info("candidate", event.candidate)
        const carray = candidate.replace("candidate:", "").split(" ")
        if (carray[2]?.toLowerCase() === "udp") {
          this.onCandidate(JSON.stringify(event.candidate))
        } else {
          console.warn("ignoring non-udp candidate", candidate)
        }
      } else {
        console.info("no more ICE candidates")
      }
    }
  }

  close() {
    Object.values(this.channels).forEach(channel => channel.close())
    this.rtc.close()
  }

  addChannel(
    name: string,
    id: number,
    onOpen: (this: RTCDataChannel, ev: Event) => any,
    onMessage: (this: RTCDataChannel, ev: MessageEvent<any>) => any,
  ) {
    console.log("start")
    const channel = this.rtc.createDataChannel(name, { id })
    channel.binaryType = "arraybuffer"
    channel.onopen = onOpen
    channel.onmessage = onMessage
    this.channels[id] = channel
    console.log("end")
  }

  setChannel(id: number, channel: RTCDataChannel) {
    channel.binaryType = "arraybuffer"
    this.channels[id] = channel
  }

  async createAnswer() {
    await this.rtc.setRemoteDescription(this.serverOffer)
    this.offer = await this.rtc.createAnswer()
    return this.offer
  }

  send(buf: ArrayBuffer, id: number) {
    this.channels[id].send(buf)
  }

  async setRemoteCandidate(candidate: string) {
    if (!this.started) {
      try {
        if (!this.offer) {
          throw new Error("offer is null")
        }
        await this.rtc.setLocalDescription(this.offer)
        console.log("setLocalDescription", this.offer)
      } catch (e) {
        console.error("setLocalDescription failed", e)
      }
      this.started = Promise.resolve()
    }

    await this.started

    const remoteCandidate = JSON.parse(candidate)
    await this.rtc.addIceCandidate(remoteCandidate)
  }
}

export default RTC
