import MyGamesIcon from "@/public/assets/icons/games.svg"
import HomeIcon from "@/public/assets/icons/home.svg"
import RentPCIcon from "@/public/assets/icons/your_PC.svg"

import { INavLinkProps } from "../types"

export const navLinks: INavLinkProps[] = [
  {
    id: 1,
    icon: <HomeIcon />,
    label: "Home",
    href: "/",
  },
  {
    id: 2,
    icon: <MyGamesIcon />,
    label: "My Games",
    href: "/myGames",
  },
  {
    id: 3,
    icon: <RentPCIcon />,
    label: "Rent your PC",
    href: "/setup",
    isStroke: true,
  },
]
