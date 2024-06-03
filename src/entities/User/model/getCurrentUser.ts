import { PublicClientApplication } from "@azure/msal-browser"
import { createAsyncThunk } from "@reduxjs/toolkit"

import { IUserData } from "@/entities/User"

import { configuration, ONE_DRIVE_SCOPES } from "@/shared/const"

import { getUserData } from "../api/getUserData"
import { EUserErrors } from "../types"

export const getCurrentUser = createAsyncThunk<IUserData, void, { rejectValue: EUserErrors }>(
  "user/getCurrentUser",
  async (_, thunkApi) => {
    const { rejectWithValue } = thunkApi

    const pca = new PublicClientApplication(configuration)
    await pca.initialize()
    const accounts = pca.getAllAccounts()

    if (accounts.length > 0) {
      const accessTokenRequest = {
        scopes: ONE_DRIVE_SCOPES,
        account: accounts[0],
      }

      try {
        const { accessToken } = await pca.acquireTokenSilent(accessTokenRequest)
        localStorage.setItem("token", accessToken)
        return getUserData(accessToken)
      } catch (err) {
        localStorage.removeItem("token")
        return rejectWithValue(EUserErrors.UNAUTHORIZED)
      }
    } else {
      return rejectWithValue(EUserErrors.UNAUTHORIZED)
    }
  },
)
