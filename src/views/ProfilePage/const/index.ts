import { IMyActivityMockDataProps, IPlanProps } from "../types"

export const initialPlansList: IPlanProps[] = [
  {
    id: 1,
    title: "Monthly",
    coast: 24,
    properties: ["Better quality", "Longer sessions", "No wait time", "Family sharing (for my games)"],
  },
  {
    id: 2,
    title: "Yearly",
    coast: 245,
    sales: 15,
    properties: ["Better quality", "Longer sessions", "No wait time", "Family sharing (for my games)"],
  },
]

export const freeUserParams: string[] = [
  "No option for graphics quality settings",
  "Standard sessions",
  "No family sharing (for my games)",
]

export const primaryUserParams: string[] = [
  "Better quality",
  "Longer sessions",
  "No wait time",
  "Family sharing (for my games)",
]

export const myActivityMockData: IMyActivityMockDataProps[] = [
  {
    id: 1,
    game: "Phasmophobia",
    totalPlayedTime: 15,
    lastPlayedDate: "07/12/2023",
    imgSrc: "/assets/img/cover_game_item_1.webp",
  },
  {
    id: 2,
    game: "Half-Life: Alyx",
    totalPlayedTime: 6,
    lastPlayedDate: "12/12/2023",
    imgSrc: "/assets/img/cover_game_item_2.webp",
  },
]

export const settingsConfig = [
  {
    label: "Low (30Mbts/s)",
  },
  {
    label: "Medium (40Mbts/s)",
  },
  {
    label: "High (50Mbts/s)",
  },
  {
    label: "Ultra (60Mbts/s)",
  },
]
