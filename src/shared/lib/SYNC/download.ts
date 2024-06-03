import { makeRequest } from "./makeRequest"

export const download = async (url: string) => {
  if (url.endsWith(":/content")) throw new RangeError()
  const response = (await makeRequest(`${url}?select=id,@microsoft.graph.downloadUrl`)) as any
  if (response.status === 404) return null
  if (!response.ok) throw new Error(`Failed to download ${url}: ${response.status}: ${response.statusText}`)
  const item = await response.json()
  const realUrl = item["@microsoft.graph.downloadUrl"]
  const res = await fetch(realUrl)

  return res
}
