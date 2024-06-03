import { FC } from "react"

import ConnectionStatus from "@/public/assets/icons/bar_chart.svg"

import { classNames } from "@/shared/lib"
import { Typography } from "@/shared/ui"

import { IConnectionNotificationProps } from "../types"
import styles from "./ConnectionNotification.module.scss"

export const ConnectionNotification: FC<IConnectionNotificationProps> = ({ connection }) => {
  return (
    <div className={classNames(styles.notification, { [styles.isVisible]: connection === "poor" })}>
      <ConnectionStatus />
      <Typography weight="seven" className={styles.notification__text}>
        Poor connection
      </Typography>
    </div>
  )
}
