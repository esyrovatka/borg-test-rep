export const makeRequest = async (url: string, options?: RequestInit) => {
  const token = localStorage.getItem("token")
  if (!token) throw new Error("Not logged in")

  if (!options) options = {}
  options.headers = new Headers(options.headers)
  options.headers.set("Authorization", `Bearer ${token}`)
  if (!url.startsWith("https://")) url = `https://graph.microsoft.com/v1.0/me/drive/${url}`
  const result = await fetch(url, options)

  return result
}
