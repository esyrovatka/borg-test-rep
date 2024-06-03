/* eslint-disable no-param-reassign */
import { createSlice, PayloadAction } from "@reduxjs/toolkit"

import { getCurrentUser } from "../model/getCurrentUser"
import { login } from "../model/login"
import { IUserData, IUserSchema } from "../types"

const initialState: IUserSchema = {
  isLoading: true,
  error: undefined,
  userData: undefined,
  _inited: false,
}

export const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setUserData: (state, action: PayloadAction<IUserData>) => {
      state.userData = action.payload
    },
    logout: state => {
      state.userData = undefined
    },
  },

  extraReducers: builder => {
    builder
      .addCase(getCurrentUser.pending, state => {
        state.error = undefined
        state.isLoading = true
      })
      .addCase(getCurrentUser.fulfilled, (state, action: PayloadAction<IUserData>) => {
        state.isLoading = false
        state.userData = action.payload
        state._inited = true
      })
      .addCase(getCurrentUser.rejected, (state, action: PayloadAction<string | undefined>) => {
        state.error = action.payload
        state.isLoading = false
        state._inited = true
      })

      .addCase(login.pending, state => {
        state.error = undefined
        state.isLoading = true
      })
      .addCase(login.fulfilled, (state, action: PayloadAction<IUserData>) => {
        state.isLoading = false
        state.userData = action.payload
      })
      .addCase(login.rejected, (state, action: PayloadAction<string | undefined>) => {
        state.error = action.payload
        state.isLoading = false
      })
  },
})

export const { reducer: userReducer, actions: userActions } = userSlice
