import { FC } from "react"

import SettingsIcon from "@/public/assets/icons/settings.svg"

import { classNames } from "@/shared/lib"
import { Button, Typography } from "@/shared/ui"

import { IActionButtonProps } from "../types"
import styles from "./NavBar.module.scss"

const ActionButton: FC<IActionButtonProps> = ({ isActive, isSelected, handleClick, text, icon }) => {
  return (
    <Button
      variant="clear"
      className={classNames(styles["nav__profile-login"], {
        [styles.isActive]: isActive,
        [styles.isSelected]: isSelected,
      })}
      onClick={handleClick}
    >
      {icon || <SettingsIcon />}
      <Typography color="gray" weight="five" className={styles.text}>
        {text}
      </Typography>
    </Button>
  )
}

export default ActionButton
