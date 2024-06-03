import { makeRequest } from "@/shared/lib"

export const completeLogin = async (code: string) => {
  const AUTH_ENDPOINT = "https://borg-ephemeral.azurewebsites.net/cors/minecraft/"
  const CREDS_URL = "special/approot:/Games/Minecraft/cml-creds.json"

  const completionUrl = `${AUTH_ENDPOINT}await/${encodeURIComponent(code)}`
  const completion = await fetch(completionUrl, { method: "POST" })
  if (!completion.ok) {
    let error = ""
    try {
      error = await completion.text()
    } catch (e) {
      throw new Error()
    }
    if (completion.status === 401 && error) throw new Error(error)
    if (error) error = `\r\n${error}`
    throw new Error(`HTTP ${completion.status}: ${completion.statusText} ${error}`)
  }
  const session = await completion.json()
  const save = await makeRequest(`${CREDS_URL}:/content`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(session),
  })
  if (!save.ok) throw new Error(`Failed to save MC account: HTTP ${save.status}: ${save.statusText}`)
}
