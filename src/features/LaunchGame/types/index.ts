export interface ILaunchConfig {
  game: string
  nodeMin?: string
  nodeMax?: string
  sessionId?: string
}

export interface OneDriveFolder {
  id: string
}

export interface IBorgNode {
  session_id: string
  peer_connection_offer: string
}

export interface INodeFilter {
  verMin?: string
  verMax?: string
  features?: string[]
}
