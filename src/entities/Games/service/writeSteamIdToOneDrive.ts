import { PublicClientApplication } from "@azure/msal-browser"
import axios from "axios"

import { configuration, ONE_DRIVE_SCOPES } from "@/shared/const"

export const writeSteamIdToOneDrive = async (steam_id: string) => {
  const pca = new PublicClientApplication(configuration)
  await pca.initialize()
  const accounts = pca.getAllAccounts()
  if (accounts.length > 0) {
    const accessTokenRequest = {
      scopes: ONE_DRIVE_SCOPES,
      account: accounts[0],
    }

    try {
      const tokenResponse = await pca.acquireTokenSilent(accessTokenRequest)

      const fileContent = JSON.stringify({ steam_id })
      await axios.put(`${process.env.NEXT_PUBLIC_ONE_DRIVE_BASE_URL}drive/root:/Borg/user.txt:/content`, fileContent, {
        headers: {
          Authorization: `Bearer ${tokenResponse.accessToken}`,
          "Content-Type": "application/json",
        },
      })
    } catch (err) {
      throw new Error()
    }
  } else {
    throw new Error()
  }
}
