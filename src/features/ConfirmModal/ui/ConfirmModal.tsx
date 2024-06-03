import { FC } from "react"

import { classNames } from "@/shared/lib"
import { Button, Modal, Typography } from "@/shared/ui"

import { IConfirmModalProps } from "../types"
import styles from "./ConfirmModal.module.scss"

export const ConfirmModal: FC<IConfirmModalProps> = ({ isOpen, onClose, func, title, text }) => {
  const handleConfirm = () => {
    func?.()
    onClose()
  }

  return (
    <Modal className={styles.modal} isOpen={isOpen} onClose={onClose}>
      <Typography weight="seven" className={styles.modal__title}>
        {title}
      </Typography>
      {text && (
        <Typography weight="six" className={styles.modal__text}>
          {text}
        </Typography>
      )}

      <div className={styles["modal__btn--group"]}>
        <Button color="cancel" onClick={handleConfirm} className={styles.modal__btn}>
          Yes
        </Button>
        <Button
          color="primary"
          onClick={onClose}
          className={classNames(styles.modal__btn, { [styles.isCancel]: true })}
        >
          No
        </Button>
      </div>
    </Modal>
  )
}
