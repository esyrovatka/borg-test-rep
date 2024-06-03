import { TStateSchema } from "@/shared/lib"

export const getUserDataSelector = (state: TStateSchema) => state?.user.userData
export const selectUserIsLoadingSelector = (state: TStateSchema) => state?.user.isLoading
export const selectUserErrorSelector = (state: TStateSchema) => state?.user.error
export const selectIsUserInitedSelector = (state: TStateSchema) => state?.user._inited
