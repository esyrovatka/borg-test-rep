import { FC, useCallback, useState } from "react"

import CloseIcon from "@/public/assets/icons/close.svg"

import { classNames } from "@/shared/lib"
import { Typography } from "@/shared/ui"

import { INotificationProps } from "../types"
import styles from "./Notification.module.scss"

export const Notification: FC<INotificationProps> = ({ isVisible, time = 5 }) => {
  const [isActive, setIsActive] = useState<boolean>(isVisible)

  const onCloseNotification = useCallback(() => {
    setIsActive(false)
  }, [])

  return (
    <div className={classNames(styles.notification, { [styles.isActive]: isActive })}>
      <div className={styles.notification__content}>
        <CloseIcon onClick={onCloseNotification} className={styles.notification__close} />
        <Typography color={time === 5 ? "primary" : "warning"}>{`${time}  minutes trial started.`}</Typography>
        <Typography>
          <b>
            <u>Log in </u>
          </b>
          to your account to continue playing the full version of the game!
        </Typography>
      </div>
    </div>
  )
}
