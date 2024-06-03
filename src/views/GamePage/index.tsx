"use client"

import Image from "next/image"
import Link from "next/link"
import { FC, useState } from "react"

import ArrowDownIcon from "@/public/assets/icons/arrow_down.svg"
import ControllerIcon from "@/public/assets/icons/controller.svg"
import PlayIcon from "@/public/assets/icons/play.svg"
import { useSelector } from "react-redux"

import { GameItem } from "@/widgets/GameItem"

import { Slider } from "@/features/Slider"

import { isNavBarOpenSelector } from "@/entities/NavBar"

import { classNames } from "@/shared/lib"
import { Button, PrimaryButton, Typography } from "@/shared/ui"

import { recentlyPlayedGames } from "../HomePage/const"
import { mockData } from "./const"
import styles from "./GamePage.module.scss"
import { IGamePageProps } from "./types"

export const GamePage: FC<IGamePageProps> = ({ id }) => {
  const [isVisibleFullDescription, setIsVisibleFullDescription] = useState(false)
  const onToggleVisibleFullDescription = () => setIsVisibleFullDescription(prev => !prev)

  const { lastPlayData, description, gameImageSrc, gameDescriptionImageSrc, gameImagesSrc, title } = mockData
  const isNavBarOpen = useSelector(isNavBarOpenSelector)

  return (
    <div className={classNames(styles.wrapper, { [styles.isNavBarOpen]: isNavBarOpen })}>
      <div className={styles.wrapper__breadcrumbs}>
        <Link href="/">
          <Typography color="gray" className={styles.wrapper__breadcrumbs__text}>
            Home
          </Typography>
        </Link>

        <Typography color="gray">/</Typography>
        <Typography className={styles.wrapper__breadcrumbs__text}>{title}</Typography>
      </div>

      <div className={styles.wrapper__media}>
        <Image src={gameImageSrc} alt="game poster" width={345} height={173} className={styles.wrapper__media__image} />

        <ControllerIcon className={styles.wrapper__media__device} />

        <div className={styles.wrapper__media__gallery}>
          {gameImagesSrc.map(item => (
            <Image src={item} alt="image" key={`game-images-tablet-${item}`} width={139} height={83} />
          ))}
        </div>
      </div>

      <div className={styles.wrapper__title}>
        <Typography>{title}</Typography>

        <div className={styles.wrapper__title__badge}>
          <Typography color="gray">Last played: </Typography>
          <Typography>{lastPlayData}</Typography>
        </div>
      </div>

      <PrimaryButton variant="primary" className={styles.wrapper__btn}>
        <PlayIcon className={styles.icon} />
        Play
      </PrimaryButton>

      <div
        className={classNames(styles.wrapper__description, {
          [styles.isOpen]: isVisibleFullDescription,
        })}
      >
        <Image
          src={gameDescriptionImageSrc}
          alt="game description"
          width={345}
          height={193}
          className={styles.wrapper__description__image}
        />

        <div>
          <Typography tag="h2" size="xl" weight="seven">
            Game Description
          </Typography>

          <Typography color="light" className={styles.wrapper__description__text}>
            {description}
          </Typography>

          <Button variant="clear" className={styles.wrapper__description__btn} onClick={onToggleVisibleFullDescription}>
            Read more
            <ArrowDownIcon className={styles.wrapper__description__icon} />
          </Button>
        </div>
      </div>

      <div className={styles.wrapper__gallery}>
        {gameImagesSrc.map(src => (
          <Image src={src} alt="image" key={`game-images-${src}`} width={110} height={66} />
        ))}
      </div>

      <Slider title="Recently played games" list={recentlyPlayedGames} SlideItem={GameItem} />
    </div>
  )
}
