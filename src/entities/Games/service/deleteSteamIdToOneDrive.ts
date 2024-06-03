import { PublicClientApplication } from "@azure/msal-browser"
import { createAsyncThunk } from "@reduxjs/toolkit"
import axios from "axios"

import { gamesAction } from "@/entities/Games"

import { configuration, ONE_DRIVE_SCOPES } from "@/shared/const"

export const deleteSteamIdToOneDrive = createAsyncThunk("games/disconnectSteam", async (_, thunkApi) => {
  const { dispatch } = thunkApi
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

      const fileContent = JSON.stringify({ steam_id: null })
      await axios.put(`${process.env.NEXT_PUBLIC_ONE_DRIVE_BASE_URL}drive/root:/Borg/user.txt:/content`, fileContent, {
        headers: {
          Authorization: `Bearer ${tokenResponse.accessToken}`,
          "Content-Type": "application/json",
        },
      })

      dispatch(gamesAction.disconnectSteam())
    } catch (err) {
      throw new Error()
    }
  } else {
    throw new Error()
  }
})
