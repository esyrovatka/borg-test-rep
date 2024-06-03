export enum EGameStatus {
  UNSUPPORTED = "unsupported",
  OK = "OK",
}

export interface IGameItemProps {
  title: string
  poster_src: string
  id: number
  availableDevice: string[]
  lastPlayData?: string
  status?: EGameStatus
  isSelected?: boolean
}

export interface IBorgNode {
  session_id: string
  peer_connection_offer: string
}
