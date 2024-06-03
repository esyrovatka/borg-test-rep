export type TGamesPlatformProps = {
  [key: string]: { connect: boolean; games: any[]; logo: string; logoConnect?: string }
}
export type TMockGames = {
  id: number
  title: string
  poster_src: string
  availableDevice: string[]
  lastPlayData?: string
  connect?: boolean
}

export interface IGamesSchema {
  gamesPlatform: TGamesPlatformProps
  mostPopularGames: TMockGames[]
  newlyAddedGames: TMockGames[]
  immediatelyAvailableGames: TMockGames[]
  recentlyPlayedGames: TMockGames[]
}
