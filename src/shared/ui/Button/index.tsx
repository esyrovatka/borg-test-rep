import { FC, PropsWithChildren } from "react"

import { classNames } from "@/shared/lib"

import styles from "./Button.module.scss"
import { IButtonProps } from "./types"

export const Button: FC<PropsWithChildren<IButtonProps>> = props => {
  const { children, variant = "outlined", color = "white", className, isDisabled = false, ...otherProps } = props

  return (
    <button
      className={classNames(styles.btn, { [styles.disabled]: isDisabled }, [className, styles[variant], styles[color]])}
      disabled={isDisabled}
      {...otherProps}
    >
      {children}
    </button>
  )
}
