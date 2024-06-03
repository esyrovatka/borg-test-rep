import { PartialCfgProps } from "./types"

const cfgDefaults = (cfg: PartialCfgProps): PartialCfgProps => {
  if (!cfg) cfg = {}

  cfg.network_video_container = 2

  if (!cfg.app_ss_endpoint) cfg.app_ss_endpoint = "borg.games"

  if (!cfg.app_ss_port) cfg.app_ss_port = 443

  if (!cfg.server_resolution_x && !cfg.server_resolution_y) {
    const w = window.screen.width
    const h = window.screen.height

    cfg.server_resolution_x = 1920
    cfg.server_resolution_y = 1080

    if (w >= 800 && h >= 600 && w <= 1920 && h <= 1080) {
      cfg.server_resolution_x = w
      cfg.server_resolution_y = h
    }
  }

  return cfg
}

export default cfgDefaults
