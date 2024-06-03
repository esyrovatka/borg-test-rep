export enum EConnection {
  OK = "ok",
  POOR = "poor",
}

export interface IStreamProps {
  videoContainer: HTMLDivElement | null
  streamElement: HTMLVideoElement | null
  status: string
  connection: EConnection
}
