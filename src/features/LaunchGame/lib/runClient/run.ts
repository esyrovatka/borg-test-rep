import { IBorgNode } from "../../types"
import { Client } from "../streaming-client/Client"

const run = async (
  offer: IBorgNode,
  timeout: Promise<string>,
  client: Client,
  clients: Client[],
  resolve: (value: unknown) => void,
) => {
  try {
    const info = JSON.parse(offer.peer_connection_offer)
    const sdp = JSON.parse(info.Offer)
    const encoder_bitrate = parseInt(localStorage.getItem("encoder_bitrate")!, 10) || 1

    await Promise.race([timeout, client.connect(offer.session_id, sdp, { encoder_bitrate })])
  } catch (e) {
    if (clients.removeByValue(client) && clients.length === 0) resolve(e)
  }
}

export default run
