import { createSlice } from "@reduxjs/toolkit"

import { IKeyboardSliceProps } from "../types"

const initialState: IKeyboardSliceProps = {
  isNavBar: false,
}

const KeyboardSlice = createSlice({
  name: "KeyboardSlice",
  initialState,
  reducers: {
    onChangeIsNavBar: state => {
      state.isNavBar = !state.isNavBar
    },
  },
})

export const { reducer: keyboardSliceReducer, actions: keyboardSliceAction } = KeyboardSlice
