import { useRouter } from "next/navigation"
import { FC } from "react"

import { Button, Modal, PrimaryButton, Typography } from "@/shared/ui"

import { IExpiredTrialTimeModalProps } from "../types"
import styles from "./ExpiredTrialTimeModal.module.scss"

export const ExpiredTrialTimeModal: FC<IExpiredTrialTimeModalProps> = ({ isModalOpen, onCloseModal }) => {
  const router = useRouter()
  const homeNavigate = () => router.push("/")
  return (
    <Modal isOpen={isModalOpen} onClose={onCloseModal} className={styles.modal}>
      <Typography weight="seven" className={styles.modal__title}>
        Your trial has expired
      </Typography>
      <Typography weight="five" color="secondary" className={styles.modal__text}>
        Your trial version has expired. You can log in to your account to continue playing without limitations.
      </Typography>
      <Typography weight="five" color="secondary" className={styles.modal__register}>
        If you still don&apos;t have an account,
        <b className={styles.modal__primary}> Register here</b>
      </Typography>

      <PrimaryButton variant="primary">Log in</PrimaryButton>

      <Button variant="clear" className={styles.modal__primary} onClick={homeNavigate}>
        Exit
      </Button>
    </Modal>
  )
}
