"use client"

import Image from "next/image"
import Link from "next/link"

import HideBarIcon from "@/public/assets/icons/hide_menu.svg"
import LoginIcon from "@/public/assets/icons/log_in.svg"
import LogoutIcon from "@/public/assets/icons/log_out.svg"
import OpenBarIcon from "@/public/assets/icons/open_menu_button.svg"

import { LoginModal } from "@/features/LoginModal"

import { classNames } from "@/shared/lib"
import { Typography } from "@/shared/ui"

import { navLinks } from "../const"
import { useNavBar } from "../lib"
import ActionButton from "./ActionButton"
import styles from "./NavBar.module.scss"

export const NavBar = () => {
  const {
    item,
    isNavBarNavigate,
    isOpenMenu,
    toggleOpenMenu,
    isModalOpen,
    user,
    pathname,
    profileNavigate,
    openLoginModal,
    handleLogout,
  } = useNavBar()

  const activeHref = "/profile"

  return (
    <div className={classNames(styles.nav, { [styles.close]: !isOpenMenu })}>
      <LoginModal isModalOpen={isModalOpen} />
      <HideBarIcon className={classNames(styles.icon, {}, [styles.hide])} onClick={toggleOpenMenu} />
      <OpenBarIcon className={classNames(styles.icon, {}, [styles.open])} onClick={toggleOpenMenu} />

      <div className={styles.nav__menu}>
        <div className={styles.nav__menu__logo}>
          <Image src="/assets/img/logo.webp" alt="logo" height={40} width={35} />
          <Image
            src="/assets/img/logo_shadow.webp"
            alt="shadow"
            height={128}
            width={128}
            className={styles.nav__menu__logo__shadow}
          />
        </div>

        <div className={styles.nav__menu__links}>
          {navLinks.map((link, i) => (
            <Link
              href={link.href}
              key={`nav-menu-link-${link.id}`}
              className={classNames(styles.nav__menu__links__item, {
                [styles.isStroke]: link.isStroke,
                [styles.isActive]: link.href === pathname,
                [styles.isSelected]: isNavBarNavigate && i === item - 1,
              })}
            >
              {link.icon}
              <Typography color="gray" weight="five" className={styles.text}>
                {link.label}
              </Typography>
            </Link>
          ))}
        </div>
      </div>

      <div className={classNames(styles.nav__profile, { [styles.isLogin]: !!user })}>
        <Image
          src="/assets/img/nav_shadow.webp"
          alt="shadow"
          height={150}
          width={150}
          className={styles.nav__profile__shadow}
        />
        {user ? (
          <div className={styles.nav__logout}>
            <ActionButton
              isActive={pathname === activeHref}
              isSelected={isNavBarNavigate && item === 4}
              handleClick={profileNavigate}
              text="Settings"
            />

            <ActionButton
              isActive={false}
              isSelected={isNavBarNavigate && item === 5}
              handleClick={handleLogout}
              icon={<LogoutIcon />}
              text="Log out"
            />
          </div>
        ) : (
          <div className={styles.nav__settings}>
            <ActionButton
              isActive={pathname === activeHref}
              isSelected={isNavBarNavigate && item === 4}
              handleClick={profileNavigate}
              text="Settings"
            />
          </div>
        )}

        {user ? (
          <div
            className={classNames(styles["nav__profile--info"], {
              [styles.isSelected]: isNavBarNavigate && item === 6,
            })}
            onClick={profileNavigate}
          >
            <Image
              className={styles["nav__profile--info__avatar"]}
              src={user.avatarUrl}
              alt="avatar"
              width={48}
              height={48}
            />

            <div className={styles["nav__profile--info__block"]}>
              <Typography className={styles["nav__profile--info__name"]}>{user.displayName}</Typography>
              <progress
                className={styles["nav__profile--info__progress"]}
                max={user.totalMBSpace}
                value={user.usedMBSpace}
              />
              <Typography className={styles["nav__profile--info__size"]} color="secondary" weight="five">
                {user.usedMBSpace}
                mb
              </Typography>
            </div>
          </div>
        ) : (
          <ActionButton
            isActive={false}
            isSelected={isNavBarNavigate && item === 5}
            handleClick={openLoginModal}
            icon={<LoginIcon />}
            text="Log in"
          />
        )}
      </div>
    </div>
  )
}
