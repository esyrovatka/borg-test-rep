import { PublicClientApplication } from "@azure/msal-browser"
import { createAsyncThunk } from "@reduxjs/toolkit"

import { configuration, ONE_DRIVE_SCOPES } from "@/shared/const"

import { getUserData } from "../api/getUserData"
import { EUserErrors, IUserData } from "../types"

export const login = createAsyncThunk<IUserData, void, { rejectValue: EUserErrors }>(
  "user/login",
  async (_, thunkApi) => {
    const { rejectWithValue } = thunkApi
    const pca = new PublicClientApplication(configuration)
    await pca.initialize()

    const loginResult = await pca.loginPopup({
      scopes: ONE_DRIVE_SCOPES,
      redirectUri: window.location.origin,
    })

    const accessTokenRequest = {
      scopes: ONE_DRIVE_SCOPES,
      account: loginResult.account,
    }

    try {
      const { accessToken } = await pca.acquireTokenSilent(accessTokenRequest)
      localStorage.setItem("token", accessToken)
      return getUserData(accessToken)
    } catch (err) {
      return rejectWithValue(EUserErrors.UNAUTHORIZED)
    }
  },
)
