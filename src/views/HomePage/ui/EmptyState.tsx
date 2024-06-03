import Image from "next/image"
import { FC } from "react"

import { Typography } from "@/shared/ui"

import styles from "./EmptyState.module.scss"

export const EmptyState: FC = () => {
  return (
    <div className={styles.empty}>
      <div>
        <Image src="/assets/img/search_empty.webp" alt="search" width={230} height={224} />
        <Typography weight="five" color="secondary" className={styles.empty__text}>
          No games were found for your request
        </Typography>
      </div>
    </div>
  )
}
