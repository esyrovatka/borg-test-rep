import Image from "next/image"
import Link from "next/link"
import { FC, useCallback } from "react"

import ControllerIcon from "@/public/assets/icons/controller.svg"
import PlayIcon from "@/public/assets/icons/play.svg"

import { TrialPlayModal } from "@/features/TrialPlayModal"

import { isDisabledPageNavigateSelector, keyboardSliceAction } from "@/entities/Keyboard"

import { classNames, useAppDispatch, useAppSelector, useToggleModal } from "@/shared/lib"
import { useKeyboardNavigate } from "@/shared/lib/hooks"
import { PrimaryButton, Typography } from "@/shared/ui"

import { IGameBigItemProps } from "../types"
import styles from "./GameBigItem.module.scss"

export const GameBigItem: FC<IGameBigItemProps> = ({ title, poster_src, lastPlayData, id, isSelected }) => {
  const linkToGame = `/game/${id}`
  const { isModalOpen, onCloseModal, onOpenModal } = useToggleModal()
  const dispatch = useAppDispatch()
  const isNavDisabled = useAppSelector(isDisabledPageNavigateSelector)

  const handleOpen = useCallback(() => {
    dispatch(keyboardSliceAction.onDisabledPageNavigate(true))
    onOpenModal()
  }, [dispatch, onOpenModal])

  useKeyboardNavigate({
    enterAction: isSelected && !isNavDisabled ? handleOpen : () => {},
  })

  return (
    <div className={classNames(styles.item, { [styles.selected]: isSelected })}>
      <div className={classNames(styles["item__picture-corner"], {}, [styles.left])} />
      <div className={classNames(styles["item__picture-corner"], {}, [styles.right])} />

      {isModalOpen && <TrialPlayModal isModalOpen={isModalOpen} onCloseModal={onCloseModal} />}
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
