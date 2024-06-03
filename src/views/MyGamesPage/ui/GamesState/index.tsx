import { FC } from "react"

import { GameItem } from "@/widgets/GameItem"

import { IGamesStateProps } from "../../types"
import styles from "./GamesState.module.scss"

export const GamesState: FC<IGamesStateProps> = ({ list }) => {
  const defaultPoster = "/assets/img/default_game.webp"
  return (
    <div className={styles.wrapper}>
      {list.map(item => (
        <GameItem
          key={`my-games-list-${item.Uri}`}
          title={item.title || item.Title || "My Game Title"}
          poster_src={item.poster_src || defaultPoster}
          id={item.id}
          availableDevice={item.availableDevice}
          status={item.Support}
        />
      ))}
    </div>
  )
}
