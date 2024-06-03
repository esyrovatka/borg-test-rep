"use client"

import { FC } from "react"

import { isNavBarOpenSelector } from "@/entities/NavBar"

import { classNames, useAppSelector } from "@/shared/lib"
import { Typography } from "@/shared/ui"

import styles from "./Footer.module.scss"

export const Footer: FC = () => {
  const isNavBarOpen = useAppSelector(isNavBarOpenSelector)
  const currentYear = new Date().getFullYear()
  return (
    <footer className={classNames(styles.footer, { [styles.isOpen]: isNavBarOpen })}>
      <Typography color="secondary" weight="five" className={styles.footer__text}>
        © Borg Queen, LLC
        {` ${currentYear}`}
      </Typography>
    </footer>
  )
}
