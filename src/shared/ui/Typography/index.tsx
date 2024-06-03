import { FC, PropsWithChildren } from "react"

import { classNames } from "@/shared/lib"

import { ITypographyProps } from "./type"
import styles from "./Typography.module.scss"

export const Typography: FC<PropsWithChildren<ITypographyProps>> = props => {
  const { className, children, size = "initial", color = "white", weight = "four", tag = "p", ...otherProps } = props
  switch (true) {
    case tag === "h1":
      return (
        <h1
          className={classNames(styles.text, {}, [className, styles[size], styles[color], styles[weight]])}
          {...otherProps}
        >
          {children}
        </h1>
      )

    case tag === "h2":
      return (
        <h2
          className={classNames(styles.text, {}, [className, styles[size], styles[color], styles[weight]])}
          {...otherProps}
        >
          {children}
        </h2>
      )

    case tag === "h3":
      return (
        <h3
          className={classNames(styles.text, {}, [className, styles[size], styles[color], styles[weight]])}
          {...otherProps}
        >
          {children}
        </h3>
      )

    case tag === "h4":
      return (
        <h4
          className={classNames(styles.text, {}, [className, styles[size], styles[color], styles[weight]])}
          {...otherProps}
        >
          {children}
        </h4>
      )

    case tag === "p":
      return (
        <p
          className={classNames(styles.text, {}, [className, styles[size], styles[color], styles[weight]])}
          {...otherProps}
        >
          {children}
        </p>
      )

    default:
      return null
  }
}
