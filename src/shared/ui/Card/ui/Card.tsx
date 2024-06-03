import { FC, PropsWithChildren } from "react"

import { classNames } from "@/shared/lib"

import { ICardProps } from "../types"
import styles from "./Card.module.scss"

export const Card: FC<PropsWithChildren<ICardProps>> = ({ children, className }) => {
  return <div className={classNames(styles.card, {}, [className])}>{children}</div>
}
