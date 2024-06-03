import Image from "next/image"
import Link from "next/link"
import { FC, useEffect } from "react"

import ControllerIcon from "@/public/assets/icons/controller.svg"
import PlayIcon from "@/public/assets/icons/play.svg"

import { TrialPlayModal } from "@/features/TrialPlayModal"

import { classNames, useToggleModal } from "@/shared/lib"
import { PrimaryButton, Typography } from "@/shared/ui"

import { IGameBigItemProps } from "../types"
import styles from "./GameBigItem.module.scss"

export const GameBigItem: FC<IGameBigItemProps> = ({ title, poster_src, lastPlayData, id, isSelected }) => {
  const linkToGame = `/game/${id}`
  const { isModalOpen, onCloseModal, onOpenModal } = useToggleModal()

  useEffect(() => {
    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Enter") onOpenModal()
    }

    if (isSelected) window.addEventListener("keydown", handleKeyDown)

    return () => {
      window.removeEventListener("keydown", handleKeyDown)
    }
  }, [isSelected, onOpenModal, isModalOpen])

  return (
    <div className={classNames(styles.item, { [styles.selected]: isSelected })}>
      <div className={classNames(styles["item__picture-corner"], {}, [styles.left])} />
      <div className={classNames(styles["item__picture-corner"], {}, [styles.right])} />

      <TrialPlayModal isModalOpen={isModalOpen} onCloseModal={onCloseModal} />
      <Link href={linkToGame}>
        <Typography weight="six" className={styles.item__title}>
          {title}
        </Typography>
      </Link>

      <Typography weight="five" className={styles.item__info}>
        Last played
        {lastPlayData}
      </Typography>

      <div className={styles.item__picture}>
        <Link href={linkToGame}>
          <Image src={poster_src} alt="poster" width={332} height={186} className={styles.item__image} />
        </Link>
      </div>

      <ControllerIcon className={styles.item__device} />

      <PrimaryButton className={styles.item__btn} onClick={onOpenModal}>
        <PlayIcon className={styles.item__icon} />
      </PrimaryButton>
    </div>
  )
}
