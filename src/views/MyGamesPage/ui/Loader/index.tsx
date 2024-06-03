import { FC } from "react"

import { classNames } from "@/shared/lib"
import { Typography } from "@/shared/ui"

import styles from "./Loader.module.scss"

export const Loader: FC<{ withText?: boolean }> = ({ withText = true }) => {
  return (
    <div className={styles.loader}>
      <div className={classNames(styles.loader__square, { [styles.isFirst]: true })} />

      {withText && (
        <Typography weight="six" color="secondary" className={styles.loader__text}>
          Please wait, we downloading your list of the games ...
        </Typography>
      )}
    </div>
  )
}
