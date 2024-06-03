import { createSlice, PayloadAction } from "@reduxjs/toolkit"

import { immediatelyAvailableGames, mostPopularGames, newlyAddedGames, recentlyPlayedGames } from "../const"
import { IGamesSchema, TMockGames } from "../types"

const initialState: IGamesSchema = {
  gamesPlatform: {
    steam: { connect: false, games: [], logo: "/assets/img/steam.webp", logoConnect: "/assets/icons/steam_logo.svg" },
    gog: {
      connect: false,
      games: [],
      logo: "/assets/icons/gog_com_logo.svg",
      logoConnect: "/assets/icons/steam_logo.svg",
    },
    epic: {
      connect: false,
      games: [],
      logo: "/assets/icons/Epic_Games_logo.svg",
      logoConnect: "/assets/icons/steam_logo.svg",
    },
  },
  mostPopularGames,
  newlyAddedGames,
  immediatelyAvailableGames,
  recentlyPlayedGames,
}
const GamesSlice = createSlice({
  name: "games",
  initialState,
  reducers: {
    connectSteam: (state, action: PayloadAction<any[]>) => {
      state.gamesPlatform.steam.connect = true
      state.gamesPlatform.steam.games = action.payload
    },

    disconnectSteam: state => {
      state.gamesPlatform.steam.connect = false
      state.gamesPlatform.steam.games = []
    },

    filterGames: (state, action: PayloadAction<string>) => {
      const checkTitle = (obj: TMockGames) => obj.title.toLowerCase().includes(action.payload.toLowerCase())
      const filteredMostPopularGames = mostPopularGames.filter(checkTitle)
      const filteredNewlyAddedGames = newlyAddedGames.filter(checkTitle)
      const filteredImmediatelyAvailableGames = immediatelyAvailableGames.filter(checkTitle)
      const filteredRecentlyPlayedGames = recentlyPlayedGames.filter(checkTitle)
      state.mostPopularGames = filteredMostPopularGames
      state.newlyAddedGames = filteredNewlyAddedGames
      state.immediatelyAvailableGames = filteredImmediatelyAvailableGames
      state.recentlyPlayedGames = filteredRecentlyPlayedGames
    },
  },
})

export const { reducer: gamesReducer, actions: gamesAction } = GamesSlice
