import * as Msg from "../msg"

export interface IConnectionAPI {
  connectionUpdate: (update: any) => void
}

export interface IClientEvent {
  type: string
  msg?: Msg.ICursorMessage | { str: string } | any
}

export interface IShutterEvent extends IClientEvent {
  enabled: boolean
}

export enum StopCodes {
  CONNECTION_TIMEOUT = 4080,
  CONCURRENT_SESSION = 4090,
  GENERAL_ERROR = 4500,
}

export interface IExitEvent extends IClientEvent {
  code: StopCodes
}

export class ClientAPI implements IConnectionAPI {
  // eslint-disable-next-line class-methods-use-this
  connectionUpdate(data: any) {
    console.warn(data)
  }
}

interface ICfgProps {
  network_video_container: number
  app_ss_endpoint: string
  app_ss_port: number
  server_resolution_x: number
  server_resolution_y: number
}

export type PartialCfgProps = Partial<ICfgProps>
