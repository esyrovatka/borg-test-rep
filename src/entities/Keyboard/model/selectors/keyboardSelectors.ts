import { TStateSchema } from "@/shared/lib"

export const isNavBarSelector = (state: TStateSchema) => state?.keyboard?.isNavBar
export const isHeaderSearchSelector = (state: TStateSchema) => state?.keyboard?.isHeaderSearch
export const isDisabledPageNavigateSelector = (state: TStateSchema) => state?.keyboard?.isDisabledPageNavigate
