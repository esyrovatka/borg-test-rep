import axios, { AxiosRequestConfig } from "axios"

import { IBorgNode, INodeFilter } from "../types"

export async function getNodes(
  filter?: INodeFilter,
  Secret?: string,
  endpoint: string = process.env.NEXT_PUBLIC_BORG_URL || "",
): Promise<IBorgNode[]> {
  const options: AxiosRequestConfig = Secret ? { headers: { Secret } } : {}

  let uri = `${endpoint}offers`
  const searchParams = new URLSearchParams()

  if (filter) {
    if (filter.verMin) searchParams.append("verMin", filter.verMin)
    if (filter.verMax) searchParams.append("verMax", filter.verMax)
    if (filter.features) searchParams.append("features", filter.features.join(","))
  }

  const filterQuery = searchParams.toString()
  if (filterQuery) uri += `?${filterQuery}`

  try {
    const { data } = await axios.get<IBorgNode[]>(uri, options)
    return data
  } catch (error) {
    console.error("Error fetching nodes:", error)
    return []
  }
}
