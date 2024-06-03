/* eslint-disable class-methods-use-this */

/* eslint-disable no-await-in-loop */

/* eslint-disable lines-between-class-members */
import { wait } from "./streaming-client/util"

const API = "https://borg-ephemeral.azurewebsites.net/ephemeral/"

export interface IBorgNode {
  session_id: string
  peer_connection_offer: string
}

export class Ephemeral {
  sessionId?: string
  secret?: string
  endpoint: string
  stopCode: number
  answer?: RTCLocalSessionDescriptionInit
  private onCandidate: any
  async connect(cfg: any, sessionId: string, answer: RTCLocalSessionDescriptionInit, onCandidate: any) {
    this.onCandidate = onCandidate
    this.sessionId = sessionId
    this.answer = answer
    await this.submitAnswer()
    this.fetchCandidates().then(() => console.debug("candidates fetch stopped"))
  }

  async submitAnswer() {
    const headers = this.makeHeaders()
    const response = await fetch(`${this.endpoint + this.sessionId}/answer`, {
      method: "PUT",
      headers,
      body: JSON.stringify(this.answer),
    })
    if (!response.ok) throw new Error("Failed to submit answer")
  }
  async sendCandidate(candidateJSON: string) {
    const headers = this.makeHeaders()
    const response = await fetch(`${this.endpoint + this.sessionId}/answerIce`, {
      method: "PUT",
      headers,
      body: candidateJSON,
    })
    if (!response.ok) throw new Error("Failed to submit ICE candidate")
  }

  async fetchCandidates() {
    const seen = new Set()
    const options: RequestInit = {}
    if (this.secret) options.headers = { Secret: this.secret }
    while (this.stopCode === 0) {
      console.log("get", this.endpoint + this.sessionId)
      const response = await fetch(this.endpoint + this.sessionId, options)
      if (!response.ok) return
      //  throw new Error("Failed to fetch ICE candidates")
      const session = await response.json()
      let done = false
      // eslint-disable-next-line no-restricted-syntax
      for (const candidate of session.offerIce) {
        await this.onCandidate(candidate, null)
        seen.add(candidate)
        const obj = JSON.parse(candidate)
        if (obj && !obj.candidate) {
          done = true
        }
      }
      if (done) return
      await wait(1000)
    }
  }

  cfgDefaults(cfg: any) {
    if (!cfg) cfg = {}
    return structuredClone(cfg)
  }

  getAttemptId() {
    console.warn("getAttemptId stub")
    return "41"
  }
  private makeHeaders() {
    const headers: { "Content-Type": string; Secret?: string } = {
      "Content-Type": "text/plain",
    }
    if (this.secret) headers.Secret = this.secret
    return headers
  }
  constructor(endpoint?: string | null, secret?: string | null) {
    this.endpoint = endpoint || API
    if (secret) this.secret = secret
    this.stopCode = 0
  }
  close(code: number) {
    this.stopCode = code
  }
}
