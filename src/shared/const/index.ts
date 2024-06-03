import { Configuration } from "@azure/msal-browser"

export const configuration: Configuration = {
  auth: {
    clientId: process.env.NEXT_PUBLIC_MS_CLIENT_ID as string,
    authority: "https://login.microsoftonline.com/consumers",
  },
}
export const ONE_DRIVE_SCOPES = ["user.read", "files.readwrite.appfolder", "openid", "profile", "offline_access"]
