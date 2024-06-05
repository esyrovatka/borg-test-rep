"use client"

import { FC, useCallback, useState } from "react"

import CopyIcon from "@/public/assets/icons/copy.svg"
import PlayIcon from "@/public/assets/icons/play.svg"
import RentPCIcon from "@/public/assets/icons/your_PC.svg"

import { Loader } from "@/views/MyGamesPage/ui"

import { launchGame } from "@/features/LaunchGame"
import { beginLogin } from "@/features/LaunchGame/game"
import { IMinecraftLoginInit } from "@/features/LaunchGame/game/beginLogin"

import { keyboardSliceAction } from "@/entities/Keyboard"
import { getStreamElemSelector } from "@/entities/Stream"

import { classNames, useAppDispatch, useAppSelector } from "@/shared/lib"
import { useKeyboardNavigate } from "@/shared/lib/hooks"
import { Modal, PrimaryButton, Typography } from "@/shared/ui"

import { deviceList } from "../const"
import { IChooseDeviceModalProps } from "../types"
import styles from "./ChooseDeviceModal.module.scss"

export const ChooseDeviceModal: FC<IChooseDeviceModalProps> = ({ isOpen, onClose, title }) => {
  const videoElement = useAppSelector(getStreamElemSelector)
  const dispatch = useAppDispatch()
  const [isMinecraftCodeVisible, setIsMinecraftCodeVisible] = useState<boolean>(false)
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [msRes, setMsRes] = useState<IMinecraftLoginInit>()
  const [isShowMsg, setIsShowMsg] = useState<boolean>(false)
  const startGame = () => {
    launchGame(title, videoElement, dispatch, msRes)
  }

  const handleClose = useCallback(() => {
    onClose()
    dispatch(keyboardSliceAction.onDisabledPageNavigate(false))
  }, [onClose, dispatch])

  const handleClick = async () => {
    if (title === "Minecraft") {
      setIsLoading(true)
      const msRes = await beginLogin()
      setMsRes(msRes)
      setIsLoading(false)
      setIsMinecraftCodeVisible(true)
    } else {
      startGame()
    }
  }

  const onCopy = useCallback(() => {
    if (msRes?.code) {
      navigator.clipboard.writeText(msRes?.code)
      setIsShowMsg(true)
      setTimeout(() => {
        setIsShowMsg(false)
      }, 1000)
    }
  }, [msRes])

  const [selectedDeviceIndex, setSelectedDeviceIndex] = useState<number | null>(null)

  useKeyboardNavigate({
    enterAction: () => launchGame(title, videoElement, dispatch),
    escapeAction: handleClose,
    arrowUpAction: () => setSelectedDeviceIndex(prev => (prev ? prev - 1 : 1)),
    arrowDownAction: () => setSelectedDeviceIndex(prev => (!prev ? 1 : 0)),
  })

  return (
    <Modal className={styles.modal} isOpen={isOpen} onClose={handleClose}>
      {isLoading && <Loader withText={false} />}
      {isMinecraftCodeVisible && !isLoading && (
        <>
          <Typography weight="seven">Sign in with your Microsoft account to play Minecraft</Typography>
          <Typography>Copy the code and enter it on the login page</Typography>
          <div className={styles.modal__code} onClick={onCopy}>
            <Typography className={classNames(styles["modal__code--msg"], { [styles.visible]: isShowMsg })}>
              Copied
            </Typography>
            <Typography>{msRes?.code}</Typography>

            <CopyIcon />
          </div>
          <PrimaryButton onClick={startGame} variant="primary">
            Microsoft Login
          </PrimaryButton>
        </>
      )}

      {!isMinecraftCodeVisible && !isLoading && (
        <>
          <Typography weight="seven" className={styles.modal__title}>
            Choose the device
          </Typography>
          <Typography color="secondary" weight="five" className={styles.modal__text}>
            To start please, select the device on which you want to play this game
          </Typography>
          {deviceList.map((item, i) => (
            <div
              key={`available-device-${item.title}`}
              className={classNames(styles.modal__content, {
                [styles.inactive]: selectedDeviceIndex !== null && i !== selectedDeviceIndex,
              })}
            >
              <div className={styles.modal__content__info}>
                <div className={styles.modal__content__icon}>
                  <RentPCIcon />
                </div>
                <div>
                  <Typography weight="seven">Window</Typography>
                  <Typography weight="five">{item.title}</Typography>
                  <Typography weight="five" color="secondary" className={styles.modal__content__date}>
                    {`Connected - ${item.lastConnected}`}
                  </Typography>
                </div>
              </div>
              <PrimaryButton onClick={handleClick}>
                <PlayIcon className={styles.modal__icon} />
              </PrimaryButton>
            </div>
          ))}
        </>
      )}
    </Modal>
  )
}
