export { selectIsUserInitedSelector, selectUserIsLoadingSelector, getUserDataSelector } from "./selectors/userSelectors"
export type { IUserData, IUserSchema } from "./types"
export { logout, login, getCurrentUser } from "./model"
export { userReducer, userActions } from "./slice/userSlice"
