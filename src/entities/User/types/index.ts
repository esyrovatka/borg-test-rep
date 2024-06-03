export interface IUserData {
  displayName: string
  avatarUrl: string
  totalMBSpace: number
  usedMBSpace: number
  steam_id?: string
}

export interface IUserSchema {
  userData?: IUserData
  isLoading: boolean
  error?: string
  _inited: boolean
}

export enum EUserErrors {
  UNAUTHORIZED = "UNAUTHORIZED",
  UNEXPECTED_ERROR = "UNEXPECTED_ERROR",
}

export const userErrors: Record<EUserErrors, string> = {
  [EUserErrors.UNAUTHORIZED]: "Unauthorized",
  [EUserErrors.UNEXPECTED_ERROR]: "Unexpected Error",
}
