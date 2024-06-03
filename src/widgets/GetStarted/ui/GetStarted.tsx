import Image from "next/image"

import { Card, Typography } from "@/shared/ui"

import { downloadAppLink } from "../const"
import styles from "./GetStarted.module.scss"

export const GetStarted = () => {
  return (
    <Card className={styles.wrapper}>
      <div className={styles.wrapper__info}>
        <Typography className={styles.wrapper__title} weight="seven">
          Get started
        </Typography>
        <Typography className={styles.wrapper__text} weight="five">
          You need to install the node on a gaming-capable Windows PC in order to join the Borg network.
        </Typography>
      </div>

      <a href={downloadAppLink} target="blank" rel="nofollow noindex">
        <Image src="/assets/img/MS_banner.webp" alt="ms" width={231} height={80} />
      </a>
    </Card>
  )
}
