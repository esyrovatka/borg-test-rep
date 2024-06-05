import { FC, useCallback } from "react"

import { keyboardSliceAction } from "@/entities/Keyboard"

import { useAppDispatch } from "@/shared/lib"
import { Button, Modal, PrimaryButton, Typography } from "@/shared/ui"

import { ITrialPlayModalProps } from "../types"
import styles from "./TrialPlayModal.module.scss"

export const TrialPlayModal: FC<ITrialPlayModalProps> = ({ isModalOpen, onCloseModal }) => {
  const dispatch = useAppDispatch()
  const handleClose = useCallback(() => {
    onCloseModal()
    dispatch(keyboardSliceAction.onDisabledPageNavigate(false))
  }, [onCloseModal, dispatch])

  return (
    <Modal isOpen={isModalOpen} onClose={handleClose} className={styles.modal}>
      <Typography weight="seven" className={styles.modal__title}>
        Please login to start playing
      </Typography>
      <Typography weight="five" color="secondary" className={styles.modal__text}>
        To start playing this game you need to login first in to your BorgGames account
      </Typography>
      <Typography weight="five" color="secondary" className={styles.modal__register}>
        If you still don&apos;t have an account,
        <b className={styles.modal__green}> Register here</b>
      </Typography>

      <PrimaryButton variant="primary">Log in</PrimaryButton>

      <Button variant="clear" className={styles.modal__trial}>
        Play trial version
      </Button>
    </Modal>
  )
}
