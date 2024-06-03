import { TGamesPlatformProps } from "@/entities/Games"

export type TPlatformTypes = "steam" | "gog" | "epic"
export interface IPlanProps {
  id: number
  title: string
  coast: number
  sales?: number
  properties: string[]
}

export interface IMyActivityMockDataProps {
  id: number
  game: string
  totalPlayedTime: number
  lastPlayedDate: string
  imgSrc: string
}

export interface IStoreProps {
  connect: boolean
  games: any[]
  platform: TPlatformTypes
  logo: string
  logoConnect?: string
}

export interface IGameStoresProps {
  platformGames: TGamesPlatformProps
  handleConnect: (platform: TPlatformTypes) => void
  handleDisconnect: (platform: TPlatformTypes) => void
}
