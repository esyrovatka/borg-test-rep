import { TStateSchema } from "@/shared/lib"

export const getStreamElemSelector = (state: TStateSchema) => state?.stream.streamElement
export const getStreamStatusSelector = (state: TStateSchema) => state?.stream.status
export const getStreamConnectionSelector = (state: TStateSchema) => state?.stream.connection
