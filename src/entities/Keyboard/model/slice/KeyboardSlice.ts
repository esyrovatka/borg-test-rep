import { createSlice } from "@reduxjs/toolkit"

import { IKeyboardSliceProps } from "../types"

const initialState: IKeyboardSliceProps = {
  isNavBar: false,
  isHeaderSearch: false,
  isDisabledPageNavigate: false,
}

const KeyboardSlice = createSlice({
  name: "KeyboardSlice",
  initialState,
  reducers: {
    onChangeIsNavBar: state => {
      state.isNavBar = !state.isNavBar
    },

    onChangeIsHeaderSearch: state => {
      state.isHeaderSearch = !state.isHeaderSearch
    },

    onDisabledPageNavigate: (state, payload) => {
      state.isDisabledPageNavigate = payload.payload
    },
  },
})

export const { reducer: keyboardSliceReducer, actions: keyboardSliceAction } = KeyboardSlice
