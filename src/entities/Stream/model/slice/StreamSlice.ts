import { createSlice, PayloadAction } from "@reduxjs/toolkit"

import { EConnection, IStreamProps } from "../types"

const initialState: IStreamProps = {
  videoContainer: null,
  streamElement: null,
  status: "",
  connection: EConnection.OK,
}

const StreamSlice = createSlice({
  name: "StreamSlice",
  initialState,
  reducers: {
    selectStreamElement: (state, action: PayloadAction<any>) => {
      return {
        ...state,
        streamElement: action.payload,
      }
    },
    changeStatus: (state, action: PayloadAction<string>) => {
      return {
        ...state,
        status: action.payload,
      }
    },

    onChangeConnection: (state, action: PayloadAction<EConnection>) => {
      state.connection = action.payload
    },
  },
})

export const { reducer: streamSliceReducer, actions: streamSliceAction } = StreamSlice
