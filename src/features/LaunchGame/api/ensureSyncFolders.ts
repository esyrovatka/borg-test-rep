import axios from "axios"

const ensureSyncFolders = async (game: URL, token: string): Promise<string> => {
  const oneDriveBaseUrl = `${process.env.NEXT_PUBLIC_ONE_DRIVE_BASE_URL}drive/`
  const gamePathParts = game.pathname.split("/").slice(1)
  const headers = { headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" } }
  if (gamePathParts.length === 0) throw new Error("Invalid game path")

  let gameDir = gamePathParts[0]
  let platform = null

  if (gamePathParts.length === 1) {
    if (gameDir === "minecraft") gameDir = "Minecraft"
    else if (gameDir === "factorio") gameDir = "Factorio"
  } else {
    switch (gameDir) {
      case "gog":
      case "GOG":
        gameDir = `GOG/${gamePathParts[1]}`
        platform = "GOG"
        break
      default:
        throw new Error("Invalid game path")
    }
  }
  const body = JSON.stringify({ folder: {} })
  const url = `special/approot:/Games/${gameDir}`

  let id = ""
  try {
    const { data } = await axios.put(`${oneDriveBaseUrl}${url}`, body, headers)
    id = data.id
  } catch (err: any) {
    if (err.response.status === 409) {
      const { data } = await axios.get(`${oneDriveBaseUrl}${url}`, headers)
      id = data.id
    }
  }
  return id
}

export default ensureSyncFolders
