import { FC } from "react"

import { Card, Typography } from "@/shared/ui"

import { IRequirementBlockProps } from "../../types"
import styles from "./RequirementBlock.module.scss"

export const RequirementBlock: FC<IRequirementBlockProps> = ({ num, title, text }) => {
  return (
    <div className={styles.block}>
      <Typography className={styles.block__number} weight="seven" color="primary">
        {num}
      </Typography>

      <Card className={styles.block__card}>
        <Typography className={styles.block__title} weight="six">
          {title}
        </Typography>
        <Typography className={styles.block__text} weight="five" color="secondary">
          {text}
        </Typography>
      </Card>
    </div>
  )
}
