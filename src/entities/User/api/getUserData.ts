import axios from "axios"

import { IUserData } from "../types"

const getMsAvatar = async (accessToken: string, user: IUserData) => {
  try {
    const { data: photoResponse } = await axios.get(`${process.env.NEXT_PUBLIC_ONE_DRIVE_BASE_URL}photo/$value`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
      responseType: "arraybuffer",
    })
    const avatarUrl = `data:image/jpeg;base64,${Buffer.from(photoResponse, "binary").toString("base64")}`
    user.avatarUrl = avatarUrl
  } catch (err) {
    user.avatarUrl = "/assets/img/user_avatar.webp"
  }
}

const getMsUserInfo = async (accessToken: string, user: IUserData) => {
  try {
    const { data: profileInfo } = await axios.get(`${process.env.NEXT_PUBLIC_ONE_DRIVE_BASE_URL}`, {
      headers: { Authorization: `Bearer ${accessToken}` },
    })
    user.displayName = profileInfo.displayName
  } catch (err) {
    console.error(err)
  }
}

const getMsStorageInfo = async (accessToken: string, user: IUserData) => {
  try {
    const { data: driveInfoResponse } = await axios.get(`${process.env.NEXT_PUBLIC_ONE_DRIVE_BASE_URL}drive`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    })
    const totalMBSpace = (driveInfoResponse.quota.total / (1024 * 1024)).toFixed(1)
    const usedMBSpace = (driveInfoResponse.quota.used / (1024 * 1024)).toFixed(1)
    user.totalMBSpace = Number(totalMBSpace)
    user.usedMBSpace = Number(usedMBSpace)
  } catch (err) {
    console.error(err)
  }
}

const getInfoFromOneDrive = async (accessToken: string) => {
  try {
    const filesResponse = await axios.get(`${process.env.NEXT_PUBLIC_ONE_DRIVE_BASE_URL}drive/root/children`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    })
    const folderName = "Borg"
    const fileName = "user.txt"
    const folder = filesResponse.data.value.find((item: any) => item.folder && item.name === folderName)

    try {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_ONE_DRIVE_BASE_URL}drive/items/${folder.id}/children`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        },
      )

      const file = response.data.value.find((item: any) => !item.folder && item.name === fileName) as any

      try {
        const { data: responseFileContent } = await axios.get(file["@microsoft.graph.downloadUrl"])
        return responseFileContent.steam_id
      } catch (err) {
        throw new Error()
      }
    } catch (err) {
      throw new Error()
    }
  } catch (err) {
    console.error("steam not connect ")
    return null
  }
}

export const getUserData = async (accessToken: string) => {
  const user = {} as IUserData

  await getMsUserInfo(accessToken, user)
  await getMsAvatar(accessToken, user)
  await getMsStorageInfo(accessToken, user)
  const res = await getInfoFromOneDrive(accessToken)
  if (res) user.steam_id = res

  return user
}
