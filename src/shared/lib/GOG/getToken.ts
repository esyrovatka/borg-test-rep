import { download, makeRequest } from "../index"

const TOKENS_KEY = "gog-tokens"
const TOKENS_URL = "special/approot:/Stores/gog-tokens.json"

async function saveTokens() {
  const save = await makeRequest(`${TOKENS_URL}:/content`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: localStorage.getItem(TOKENS_KEY),
  })
  if (!save.ok) throw new Error(`Failed to save GOG account: HTTP ${save.status}: ${save.statusText}`)
}

export async function getToken() {
  const AUTH_ENDPOINT = "https://borg-ephemeral.azurewebsites.net/cors/gog/"
  let tokens = JSON.parse(localStorage.getItem(TOKENS_KEY)!)

  if (tokens === null) {
    const response = await download(TOKENS_URL)
    if (response === null) {
      return null
    }
    tokens = await response.json()
  }

  // TODO skip refresh if token is still valid
  try {
    const refreshUrl = `${AUTH_ENDPOINT}refresh`
    const refresh = await fetch(refreshUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(tokens),
    })
    if (!refresh.ok) {
      let error = ""
      try {
        error = await refresh.text()
      } catch (e) {
        console.log(e)
      }
      if (refresh.status === 401 && error) throw new Error(error)
      if (error) error = `\r\n${error}`
      throw new Error(`HTTP ${refresh.status}: ${refresh.statusText} ${error}`)
    }
    tokens = await refresh.json()
  } catch (e) {
    console.error("error refreshing token", e)
  }

  localStorage.setItem("gog-tokens", JSON.stringify(tokens))

  try {
    await saveTokens()
  } catch (e) {
    console.error("error saving tokens", e)
  }

  return tokens.access_token
}
