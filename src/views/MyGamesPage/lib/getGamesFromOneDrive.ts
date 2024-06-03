import axios from "axios"

import { IMyGamesProps, IOneDriveItemProps } from "../types"

const appsFolderUrl = "special/apps/children"
const borgGameFolderName = "Borg"
const borgPCName = "PCs"

export const getGamesFromOneDrive = async (token: string) => {
  const oneDriveBaseUrl = `${process.env.NEXT_PUBLIC_ONE_DRIVE_BASE_URL}drive/`

  try {
    const headers = { headers: { Authorization: `Bearer ${token}` } }

    const { data: rootResponse } = await axios.get(`${oneDriveBaseUrl}${appsFolderUrl}`, headers)

    const borgFolder = rootResponse.value.find((item: IOneDriveItemProps) => item.name === borgGameFolderName)
    if (!borgFolder) return []

    const { data: borgResponse } = await axios.get(`${oneDriveBaseUrl}items/${borgFolder.id}/children`, headers)

    const pcsFolder = borgResponse.value.find((item: IOneDriveItemProps) => item.name === borgPCName)
    if (!pcsFolder) return []

    const PCsResponse = await axios.get(`${oneDriveBaseUrl}items/${pcsFolder.id}/children`, headers)
    const { value } = PCsResponse.data

    const result: IMyGamesProps[] = []
    await Promise.all(
      value.map(async (item: IOneDriveItemProps) => {
        if (!item.folder) {
          const { data } = await axios.get(item["@microsoft.graph.downloadUrl"])
          result.push(...data)
        }
      }),
    )

    return result
  } catch (error) {
    return []
  }
}
