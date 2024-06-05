"use client"

import Image from "next/image"
import Link from "next/link"
import { ForwardedRef } from "react"

import SearchIcon from "@/public/assets/icons/search.svg"
import logo from "@/public/assets/img/logo.webp"
import logo_shadow from "@/public/assets/img/logo_shadow.webp"
import Keyboard from "react-simple-keyboard"
import "react-simple-keyboard/build/css/index.css"

import { MobileSearch } from "@/features/MobileSearch"

import { classNames } from "@/shared/lib"
import { BurgerMenu, Input, Typography } from "@/shared/ui"

import { useHeader } from "../lib"
import styles from "./Header.module.scss"

export const Header = () => {
  const {
    isEmptySearch,
    searchResult,
    searchValue,
    handleChange,
    isNavBarOpenOpen,
    inputRef,
    keyboardVisible,
    selectedGameIdx,
    itemRefs,
  } = useHeader()

  return (
    <div className={classNames(styles.navBar, { [styles.isOpen]: isNavBarOpenOpen })}>
      <Image src={logo_shadow} alt="logo" width={75} height={75} className={styles.shadow} />
      <Image src={logo} alt="logo" width={40} height={40} className={styles.logo} />
      <MobileSearch value={searchValue} onChange={handleChange} />
      <div className={styles.tabletSearch}>
        <Input
          value={searchValue}
          onChange={handleChange}
          icon={<SearchIcon />}
          ref={inputRef as ForwardedRef<HTMLInputElement>}
        />
      </div>
      <div
        className={classNames(styles.navBar__result, { [styles.isVisible]: !!searchResult.length || isEmptySearch })}
      >
        <div className={styles["navBar__result--list"]}>
          {isEmptySearch && (
            <div className={styles["navBar__result--list__item"]}>
              <Typography>No matching titles found</Typography>
            </div>
          )}
          {searchResult.map((item, idx) => (
            <Link
              href={`/game/${item.id}`}
              key={`search-results-item-${item.id}`}
              className={classNames(styles["navBar__result--list__item"], { [styles.active]: selectedGameIdx === idx })}
              // @ts-ignore-next-line
              // eslint-disable-next-line no-return-assign
              ref={el => (itemRefs.current[idx] = el)}
            >
              <Image
                src={item.poster_src}
                alt="logo"
                width={64}
                height={36}
                className={styles["navBar__result--list__image"]}
              />
              <Typography>{item.title}</Typography>
            </Link>
          ))}
        </div>
      </div>

      {/* START TODO: return keyboard when add gamepad navigate */}

      {keyboardVisible && false && (
        <div
          className={classNames(styles.navBar__keyboard, {
            [styles.withResult]: !!searchResult.length || isEmptySearch,
          })}
        >
          <Keyboard onChange={handleChange} inputName="input" layoutName="default" physicalKeyboardHighlight />
        </div>
      )}

      {/* END TODO: return keyboard when add gamepad navigate */}

      <BurgerMenu className={styles.burger} />
    </div>
  )
}
