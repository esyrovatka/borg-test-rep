import { download } from "@/shared/lib"

export const getCreds = async () => {
  const CREDS_URL = "special/approot:/Games/Minecraft/cml-creds.json"

  const response = await download(CREDS_URL)
  if (response === null) return null

  const result = await response.json()
  return result
}
