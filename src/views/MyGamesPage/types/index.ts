import { EGameStatus } from "@/widgets/GameItem"

export interface IMyGamesProps {
  id: number
  title: string
  poster_src: string
  availableDevice: string[]
  Uri?: string
  Title?: string
  Support?: EGameStatus
}

export interface IOneDriveItemProps {
  name: string
  folder?: { childCount: number }
  "@microsoft.graph.downloadUrl": string
}

export interface INotLoginStateProps {
  mockLoginFunc: () => void
}

export interface INotInstallAppStateProps {
  mockDownloadAppFunc: () => void
}

export interface IEmptyStateProps {
  mockAddGamesFunc: () => void
}

export interface IGamesStateProps {
  list: IMyGamesProps[]
}
