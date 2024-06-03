// Infer the type of makeStore
import { IGamesSchema } from "@/entities/Games"
import { IKeyboardSliceProps } from "@/entities/Keyboard"
import { TNavBarTypes } from "@/entities/NavBar"
import { IStreamProps } from "@/entities/Stream"
import { IUserSchema } from "@/entities/User"

import { makeStore } from "."

export type AppStore = ReturnType<typeof makeStore>
// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<AppStore["getState"]>
export type AppDispatch = AppStore["dispatch"]

export type TStateSchema = {
  navBar: TNavBarTypes
  user: IUserSchema
  games: IGamesSchema
  stream: IStreamProps
  keyboard: IKeyboardSliceProps
}
