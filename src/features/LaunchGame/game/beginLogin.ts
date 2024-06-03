const AUTH_ENDPOINT = "https://borg-ephemeral.azurewebsites.net/cors/minecraft/"

export interface IMinecraftLoginInit {
  code: string
  location: string
}

export async function beginLogin(): Promise<IMinecraftLoginInit> {
  const response = await fetch(`${AUTH_ENDPOINT}login`, { method: "POST" })
  const code = await response.text()
  const location = response.headers.get("Location")!
  return { code, location }
}
