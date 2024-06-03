"use client"

import Image from "next/image"
import Link from "next/link"
import { useSearchParams } from "next/navigation"
import { useEffect, useState } from "react"

import SearchIcon from "@/public/assets/icons/search.svg"
import logo from "@/public/assets/img/logo.webp"
import logo_shadow from "@/public/assets/img/logo_shadow.webp"

import { IGameItemProps } from "@/widgets/GameItem/types"

import { MobileSearch } from "@/features/MobileSearch"

import { gamesAction, immediatelyAvailableGames } from "@/entities/Games"
import { isNavBarOpenSelector } from "@/entities/NavBar"

import { classNames, useAppDispatch, useAppSelector, useDebounce } from "@/shared/lib"
import { BurgerMenu, Input, Typography } from "@/shared/ui"

import styles from "./Header.module.scss"

export const Header = () => {
  const dispatch = useAppDispatch()
  const [searchValue, setSearchValue] = useState<string>("")
  const [isEmptySearch, setIsEmptySearch] = useState<boolean>(false)
  const [searchResult, setSearchResult] = useState<IGameItemProps[]>([])

  const findGames = useDebounce((value: string) => {
    dispatch(gamesAction.filterGames(value))
    if (value) {
      const checkTitle = (obj: IGameItemProps) => obj.title.toLowerCase().includes(value.toLowerCase())
      const filteredArray = immediatelyAvailableGames.filter(checkTitle)
      setIsEmptySearch(!filteredArray.length)
      return setSearchResult(filteredArray)
    }
    setIsEmptySearch(false)
    return setSearchResult([])
  }, 2000)

  const handleChange = (value: string) => {
    setSearchValue(value)
    findGames(value)
  }

  const isNavBarOpenOpen = useAppSelector(isNavBarOpenSelector)
  const searchParams = useSearchParams()

  useEffect(() => {
    setSearchValue("")
    setSearchResult([])
    dispatch(gamesAction.filterGames(""))
  }, [dispatch, searchParams])

  return (
    <div className={classNames(styles.navBar, { [styles.isOpen]: isNavBarOpenOpen })}>
      <Image src={logo_shadow} alt="logo" width={75} height={75} className={styles.shadow} />
      <Image src={logo} alt="logo" width={40} height={40} className={styles.logo} />
      <MobileSearch value={searchValue} onChange={handleChange} />
      <div className={styles.tabletSearch}>
        <Input value={searchValue} onChange={handleChange} icon={<SearchIcon />} />
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
          {searchResult.map(item => (
            <Link
              href={`/game/${item.id}`}
              key={`search-results-item-${item.id}`}
              className={styles["navBar__result--list__item"]}
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
      <BurgerMenu className={styles.burger} />
    </div>
  )
}
