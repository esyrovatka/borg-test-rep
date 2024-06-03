import { download, makeRequest } from "../index"

interface ISignedLicenseList {
  LicensesUtf8: string
  Signature: string
}

interface ISteamLicense {
  AppID?: number
  PackageID?: number
}

let licenseBlob: ISignedLicenseList | null = null

async function saveLicenses(signedLicenseList: ISignedLicenseList): Promise<ISteamLicense[]> {
  const licenses = JSON.parse(atob(signedLicenseList.LicensesUtf8))

  const saveResponse = await makeRequest("special/approot:/Games/Steam.json:/content", {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(signedLicenseList),
  })
  if (!saveResponse.ok) console.warn("Failed to save Steam login: ", saveResponse.status, saveResponse.statusText)
  else licenseBlob = signedLicenseList

  localStorage.removeItem("STEAM_LICENSES")

  return licenses
}

async function getSignedLicenses() {
  const isLoggedIn = localStorage.getItem("token")

  if (licenseBlob === null) {
    if (!isLoggedIn) return null
    const response = await download("special/approot:/Games/Steam.json")
    if (response === null) {
      const stored = localStorage.getItem("STEAM_LICENSES")
      if (stored) {
        licenseBlob = JSON.parse(stored)
        await saveLicenses(licenseBlob!)
        return licenseBlob
      }
      return null
    }

    try {
      licenseBlob = await response.json()
    } catch (e) {
      console.error("corrupted Steam license list file Games/Steam.json", e)
      return null
    }
  }

  return licenseBlob
}

export default getSignedLicenses
