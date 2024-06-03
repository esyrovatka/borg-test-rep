import { TStateSchema } from "@/shared/lib"

export const isNavBarOpenSelector = (state: TStateSchema) => state?.navBar.isOpen
export const isLoginModalOpenSelector = (state: TStateSchema) => state?.navBar.isLoginModalOpen
