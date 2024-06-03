"use client"

import Image from "next/image"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { FC, useEffect, useState } from "react"

import CloseIcon from "@/public/assets/icons/close.svg"
import LoginIcon from "@/public/assets/icons/log_in.svg"
import LogoutIcon from "@/public/assets/icons/log_out.svg"
import MenuIcon from "@/public/assets/icons/menu.svg"

import { navLinks } from "@/widgets/NavBar/const"

import { navBarAction } from "@/entities/NavBar"
import { getUserDataSelector, logout } from "@/entities/User"

import { classNames, useAppDispatch, useAppSelector } from "@/shared/lib"

import { Button } from "../../Button"
import { Typography } from "../../Typography"
import { IBurgerMenuProps } from "../types"
import styles from "./BurgerMenu.module.scss"

export const BurgerMenu: FC<IBurgerMenuProps> = ({ className }) => {
  const dispatch = useAppDispatch()
  const [isOpen, setIsOpen] = useState<boolean>(false)
  const toggleOpenMenu = () => setIsOpen(prev => !prev)
  const pathname = usePathname()
  const user = useAppSelector(getUserDataSelector)

  const openLoginModal = () => dispatch(navBarAction.onOpenLoginModal())

  useEffect(() => {
    setIsOpen(false)
  }, [pathname])
  return (
    <div className={classNames(styles.menu, {}, [className])}>
      {isOpen ? (
        <CloseIcon className={styles.menu__icon} onClick={toggleOpenMenu} />
      ) : (
        <MenuIcon className={styles.menu__icon} onClick={toggleOpenMenu} />
      )}

      <div className={classNames(styles.menu__content, { [styles.isVisible]: isOpen })}>
        <div className={styles.menu__nav}>
          {navLinks.map(item => (
            <Link
              href={item.href}
              className={classNames(styles["menu__nav--item"], {
                [styles.isStroke]: item.isStroke,
                [styles.isActive]: item.href === pathname,
              })}
              key={`burger-menu-link-${item.id}`}
            >
              <div className={styles["menu__nav--item__icon"]}>{item.icon}</div>
              <Typography className={styles["menu__nav--item__label"]}>{item.label}</Typography>
            </Link>
          ))}
          <div />
        </div>

        <div className={styles.menu__profile}>
          <Image
            src="/assets/img/nav_shadow.webp"
            alt="shadow"
            height={150}
            width={150}
            className={styles.menu__profile__shadow}
          />
          {user ? (
            <div className={styles["menu__profile--info"]}>
              <div className={styles.menu__logout}>
                <Button variant="clear" className={styles["menu__profile-login"]} onClick={() => dispatch(logout())}>
                  <LogoutIcon />
                  <Typography color="gray" weight="five" className={styles.text}>
                    Log out
                  </Typography>
                </Button>
              </div>

              <Link href="/profile">
                <Image
                  className={styles["menu__profile--info__avatar"]}
                  src={user.avatarUrl}
                  alt="avatar"
                  width={48}
                  height={48}
                />
              </Link>

              <div className={styles["menu__profile--info__block"]}>
                <Typography className={styles["menu__profile--info__name"]}>{user.displayName}</Typography>
                <progress
                  className={styles["menu__profile--info__progress"]}
                  max={user.totalMBSpace}
                  value={user.usedMBSpace}
                />
                <Typography className={styles["menu__profile--info__size"]} color="secondary" weight="five">
                  {user.usedMBSpace}
                  mb
                </Typography>
              </div>
            </div>
          ) : (
            <Button variant="clear" className={styles.menu__profile__login} onClick={openLoginModal}>
              <LoginIcon className={styles.menu__profile__icon} />
              Log in
            </Button>
          )}
        </div>
      </div>
    </div>
  )
}
