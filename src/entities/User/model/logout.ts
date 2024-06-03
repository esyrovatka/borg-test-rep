import { PublicClientApplication } from "@azure/msal-browser"
import { createAsyncThunk } from "@reduxjs/toolkit"

import { userActions } from "@/entities/User"

import { configuration } from "@/shared/const"

export const logout = createAsyncThunk<any>("user/logout", async (_, thunkApi) => {
  const { dispatch } = thunkApi
  const pca = new PublicClientApplication(configuration)
  await pca.initialize()
  await pca.logoutPopup()
  localStorage.removeItem("token")
  dispatch(userActions.logout())
})
