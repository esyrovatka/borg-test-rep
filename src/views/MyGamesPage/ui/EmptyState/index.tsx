import Image from "next/image"
import { FC } from "react"

import { Typography } from "@/shared/ui"

import styles from "./EmptyState.module.scss"

export const EmptyState: FC = () => {
  return (
    <div className={styles.wrapper}>
      <Image
        className={styles.wrapper__image}
        src="/assets/img/bag-dynamic-color.webp"
        alt="not login"
        width={120}
        height={120}
      />
      <Typography className={styles.wrapper__title} weight="seven">
        Looking for your games?
      </Typography>
      <Typography className={styles.wrapper__text} color="light" weight="five">
        Login with Microsoft account to see games on your PCs
      </Typography>
    </div>
  )
}
