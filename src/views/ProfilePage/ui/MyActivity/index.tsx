import Image from "next/image"
import { FC } from "react"

import { Typography } from "@/shared/ui"

import { myActivityMockData } from "../../const"
import styles from "./MyActivity.module.scss"

export const MyActivity: FC = () => {
  return (
    <div className={styles.activity}>
      <Typography weight="six" className={styles.activity__title}>
        My activity
      </Typography>

      <div className={styles.activity__content}>
        {myActivityMockData.map(item => (
          <div key={`activity-item-${item.id}`} className={styles.activity__card}>
            <Image src={item.imgSrc} width={330} height={185} alt="game" />

            <div className={styles["activity__card--content"]}>
              <Typography weight="seven" className={styles.activity__card__title}>
                {item.game}
              </Typography>
              <Typography color="secondary" weight="five" className={styles.activity__card__text}>
                Played in total:
                <span className={styles.activity__card__green}>
                  {` ${item.totalPlayedTime} `}
                  hours
                </span>
              </Typography>
              <Typography color="secondary" weight="five" className={styles.activity__card__text}>
                Last played:
                <span className={styles.activity__card__white}>{` ${item.lastPlayedDate}`}</span>
              </Typography>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
