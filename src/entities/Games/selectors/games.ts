import { TStateSchema } from "@/shared/lib"

export const getSteamGamesSelector = (state: TStateSchema) => state?.games.gamesPlatform.steam
export const getGamesSelector = (state: TStateSchema) => state?.games.gamesPlatform
export const getMostPopularGamesSelector = (state: TStateSchema) => state?.games.mostPopularGames
export const getNewlyAddedGamesSelector = (state: TStateSchema) => state?.games.newlyAddedGames
export const getImmediatelyAvailableGamesSelector = (state: TStateSchema) => state?.games.immediatelyAvailableGames
export const getRecentlyPlayedGamesSelector = (state: TStateSchema) => state?.games.recentlyPlayedGames
