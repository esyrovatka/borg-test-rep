import Image from "next/image"
import Link from "next/link"
import { FC, useCallback } from "react"

import ControllerIcon from "@/public/assets/icons/controller.svg"
import PlayIcon from "@/public/assets/icons/play.svg"

import { ChooseDeviceModal } from "@/features/ChooseDeviceModal"

import { isDisabledPageNavigateSelector, keyboardSliceAction } from "@/entities/Keyboard"
import { getUserDataSelector } from "@/entities/User"

import { classNames, useAppDispatch, useAppSelector, useToggleModal } from "@/shared/lib"
import { useKeyboardNavigate } from "@/shared/lib/hooks"
import { Button, Typography } from "@/shared/ui"

import { availableGames } from "../const"
import { EGameStatus, IGameItemProps } from "../types"
import styles from "./GameItem.module.scss"

export const GameItem: FC<IGameItemProps> = ({ title, poster_src, id, status, isSelected }) => {
  const { isModalOpen, onOpenModal, onCloseModal } = useToggleModal()
  const linkToGame = `/game/${id}`
  const isUser = useAppSelector(getUserDataSelector)
  const dispatch = useAppDispatch()
  const isAvailableGame = availableGames.includes(title)
  const isNavDisabled = useAppSelector(isDisabledPageNavigateSelector)

  const handleOpen = useCallback(() => {
    dispatch(keyboardSliceAction.onDisabledPageNavigate(true))
    onOpenModal()
  }, [dispatch, onOpenModal])

  useKeyboardNavigate({
    enterAction: isSelected && !isNavDisabled ? handleOpen : () => {},
  })

  return (
    <div className={styles.item}>
      {isModalOpen && <ChooseDeviceModal isOpen={isModalOpen} onClose={onCloseModal} title={title} />}
      <div className={classNames(styles.item__content, { [styles.selected]: isSelected })}>
        <Link href={linkToGame}>
          <Image className={styles.item__image} src={poster_src} alt="cover" width={320} height={180} />
        </Link>

        {!isUser && !title.includes("demo") && (
          <Typography weight="seven" className={styles.item__notes}>
            Log in required
          </Typography>
        )}

        <ControllerIcon className={styles.item__device} />
      </div>

      <div className={styles.item__info}>
        <Link href={linkToGame}>
          <Typography weight="six" color="light" className={styles.item__title}>
            {title}
          </Typography>
          {status && (
            <Typography
              weight="six"
              color="light"
              className={classNames(styles.item__status, {
                [styles.error]: status === EGameStatus.UNSUPPORTED,
                [styles.success]: status === EGameStatus.OK,
              })}
            >
              {`(${status})`}
            </Typography>
          )}
        </Link>

        <Button onClick={handleOpen} isDisabled={!isAvailableGame}>
          <PlayIcon />
          Play
        </Button>
      </div>
    </div>
  )
}
