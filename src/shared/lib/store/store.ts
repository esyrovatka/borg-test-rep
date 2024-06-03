import { configureStore } from "@reduxjs/toolkit"

import { gamesReducer } from "@/entities/Games"
import { keyboardSliceReducer } from "@/entities/Keyboard"
import { navBarReducer } from "@/entities/NavBar"
import { streamSliceReducer } from "@/entities/Stream"
import { userReducer } from "@/entities/User"

export const makeStore = () => {
  return configureStore({
    reducer: {
      navBar: navBarReducer,
      user: userReducer,
      games: gamesReducer,
      stream: streamSliceReducer,
      keyboard: keyboardSliceReducer,
    },
  })
}
