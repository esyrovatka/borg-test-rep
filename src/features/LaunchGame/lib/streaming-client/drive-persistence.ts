import { makeRequest } from "@/shared/lib"

function codeResponse(channel: RTCDataChannel, code: number, text: string) {
  channel.send(
    JSON.stringify({
      status: code,
      body: btoa(text),
    }),
  )
}

const forbidden = (channel: RTCDataChannel, text: string) => codeResponse(channel, 403, text)
const unauthorized = (channel: RTCDataChannel, text: string) => codeResponse(channel, 401, text)
const invalidArg = (channel: RTCDataChannel, text: string) => codeResponse(channel, 400, text)

function bytesToBase64(bytes: Uint8Array) {
  const binString = Array.from(bytes, x => String.fromCodePoint(x)).join("")
  return btoa(binString)
}

function strToBase64(str: string) {
  return bytesToBase64(new TextEncoder().encode(str))
}

function odataError(channel: RTCDataChannel, httpCode: number, errorCode: string, message: string) {
  channel.send(
    JSON.stringify({
      status: httpCode,
      contentType: "application/json",
      body: strToBase64(
        JSON.stringify({
          error: {
            code: errorCode,
            message,
          },
        }),
      ),
    }),
  )
}

const canonicalize = (id: string) => decodeURIComponent(id)

function blobToBase64(blob: Blob) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onloadend = () => {
      const val = reader.result as string
      return resolve(val.substring(val.indexOf(",") + 1))
    }
    reader.onerror = reject
    reader.readAsDataURL(blob)
  })
}

async function blobToObject(blob: Blob) {
  const json = await blob.text()
  return JSON.parse(json)
}

async function base64ToArrayBuffer(base64: string) {
  const dataUrl = `data:application/octet-stream;base64,${base64}`
  const result = await fetch(dataUrl)
  const res = await result.arrayBuffer()
  return res
}

function parseRequest(path: string, method: string) {
  const parts = path.substring(1).split("/")
  if (parts[0] !== "") throw new RangeError("Invalid path")

  const url = parts.slice(3).join("/")

  if (parts.length === 3 && parts[1] === "me" && parts[2] === "drive") return new Request("")

  if (parts.length < 5 || parts[1] !== "drives" || parts[3] !== "items") throw new RangeError("Invalid path")
  const [, , drive, , item] = parts
  const request = new Request(url) as any
  request.drive = drive
  request.item = item

  if (parts.length === 5) {
    request.returnItems = true
    return request
  }

  if (parts.length === 6) {
    switch (parts[5]) {
      case "children":
      case "copy":
        request.returnItems = true
        return request
      case "content":
      case "createUploadSession":
        return request
      default:
        throw new RangeError("Invalid path")
    }
  }

  if (parts.length === 7) {
    if (!request.item.endsWith(":")) throw new RangeError("Invalid path")
    request.item = request.item.substring(0, request.item.length - 1)
    const nameColon = parts[5]
    if (!nameColon.endsWith(":")) throw new RangeError("Invalid path")
    switch (parts[6]) {
      case "content":
        request.returnItems = method.toUpperCase() === "PUT"
        return request
      case "createUploadSession":
        return request
      default:
        throw new RangeError("Invalid path")
    }
  }

  throw new RangeError("Invalid path")
}

const isTypeJson = (contentType: string | null) => contentType && contentType.startsWith("application/json")

export function createOneDrivePersistence(channel: RTCDataChannel, persistenceArr: any[] = []) {
  const items = new Set()
  let _messageHandler: {
    (this: RTCDataChannel, ev: MessageEvent<any>): any
    (event: {
      target: any
      data: string
    }): Promise<void | { status: number; body: unknown; location: string | null; contentType: string | null }>
  }

  function addItem(id: string) {
    const canonical = canonicalize(id)
    items.add(canonical)
  }

  function allowed(id: string) {
    const canonical = canonicalize(id)
    return items.has(canonical)
  }

  async function updateMapper(location: any, bytes: Blob | null) {
    if (location) {
      console.error("Unexpected location", location)
    }
    try {
      if (bytes === null) return
      const object = await blobToObject(bytes)

      if ("id" in object) addItem(object.id)
      if ("resourceId" in object) addItem(object.resourceId)
      // eslint-disable-next-line no-restricted-syntax
      if ("value" in object) for (const item of object.value) if ("id" in item) addItem(item.id)
    } catch (e) {
      console.warn("Failed to parse response", e)
    }
  }

  async function forward(event: { target: any; data: string }) {
    const channel = event.target
    const request = JSON.parse(event.data)
    try {
      if (request.options?.body) request.options.body = await base64ToArrayBuffer(request.options.body)
      const method = request.options?.method?.trim().toUpperCase() ?? "GET"
      const u = new URL(request.uri)
      console.debug(method, request.uri)
      const MONITOR_PREFIX = "https://api.onedrive.com/v1.0/monitor/"

      let call
      switch (u.protocol) {
        case "bcd:":
          call = parseRequest(u.pathname, method)
          break
        case "https:":
          if (request.uri.startsWith(MONITOR_PREFIX)) call = new Request(request.uri)
          else return unauthorized(channel, "globalAccess")
          break
        default:
          return invalidArg(channel, "protocol")
      }
      if ((call?.drive && !allowed(call.drive)) || (call?.item && !allowed(call.item))) {
        return forbidden(channel, "drive or item")
      }

      const response = await makeRequest(call.url, request.options)
      const location = response.headers.get("Location")
      const contentType = response.headers.get("Content-Type")
      const body = await response.blob()
      const MAX_CONTENT_SIZE = 128 * 1024

      if (body.size > MAX_CONTENT_SIZE) {
        console.error(request.uri, "content too large", body.size)
        return odataError(
          channel,
          502,
          "responseTooLarge",
          `The ${body.size} bytes response body is too large. The maximum size is ${MAX_CONTENT_SIZE} bytes.`,
        )
      }

      if (response.ok && call.returnItems) await updateMapper(location, isTypeJson(contentType) ? body : null)

      const result = {
        status: response.status,
        body: await blobToBase64(body),
        location,
        contentType,
      }
      channel.send(JSON.stringify(result))
      console.debug(method, request.uri, response.status)
      return result
    } catch (e) {
      console.error(request.uri, e)
      channel.send(
        JSON.stringify({
          status: 502,
          contentType: "application/json",
          body: strToBase64(JSON.stringify(e)),
        }),
      )
      throw e
    }
  }

  channel.addEventListener("message", forward)

  function destroy() {
    channel.removeEventListener("message", _messageHandler)
  }

  _messageHandler = forward

  persistenceArr?.map(id => addItem(id))

  return {
    addItem,
    allowed,
    destroy,
  }
}
