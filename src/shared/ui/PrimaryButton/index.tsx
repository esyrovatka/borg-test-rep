import { FC, PropsWithChildren } from "react"

import { classNames } from "@/shared/lib"

import styles from "./PrimaryButton.module.scss"
import { IButtonProps } from "./types"

export const PrimaryButton: FC<PropsWithChildren<IButtonProps>> = props => {
  const { children, variant = "fill", className, isDisabled = false, ...otherProps } = props

  return (
    <button
      className={classNames(styles.btn, { [styles.disabled]: isDisabled }, [className, styles[variant]])}
      {...otherProps}
    >
      {children}
      <div className={classNames(styles.corner, {}, [styles.left])} />
      <div className={classNames(styles.corner, {}, [styles.right])} />
    </button>
  )
}
