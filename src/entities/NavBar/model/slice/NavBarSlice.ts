import { createSlice } from "@reduxjs/toolkit"

import { TNavBarTypes } from "../types"

const initialState: TNavBarTypes = {
  isOpen: true,
  isLoginModalOpen: false,
}

const NavBarSlice = createSlice({
  name: "NavBarSlice",
  initialState,
  reducers: {
    toggleOpenNavBar: state => {
      state.isOpen = !state.isOpen
    },

    onOpenLoginModal: state => {
      state.isLoginModalOpen = true
    },

    onCloseLoginModal: state => {
      state.isLoginModalOpen = false
    },
  },
})

export const { reducer: navBarReducer, actions: navBarAction } = NavBarSlice
