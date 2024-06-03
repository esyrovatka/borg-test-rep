const isVideoInactive = (sdp: string) => {
  const videoInactiveRegex = /m=video\s+0\s+/
  return videoInactiveRegex.test(sdp)
}

export default isVideoInactive
