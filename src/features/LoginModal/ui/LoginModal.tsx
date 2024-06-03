import Image from "next/image"
import { FC } from "react"

import { navBarAction } from "@/entities/NavBar"
import { login } from "@/entities/User"

import { useAppDispatch } from "@/shared/lib"
import { Modal, PrimaryButton, Typography } from "@/shared/ui"

import { ILoginModalProps } from "../types"
import styles from "./LoginModal.module.scss"

export const LoginModal: FC<ILoginModalProps> = ({ isModalOpen }) => {
  const dispatch = useAppDispatch()
  const closeLoginModal = () => dispatch(navBarAction.onCloseLoginModal())

  const handleLogin = () => {
    dispatch(login())
    closeLoginModal()
  }

  return (
    <Modal isOpen={isModalOpen} onClose={closeLoginModal} className={styles.modal}>
      <Image src="/assets/img/OneDrive_logo.webp" alt="OneDrive Logo" width={100} height={64} />

      <Typography weight="six" className={styles.modal__title}>
        Log in via OneDrive
      </Typography>

      <Typography weight="five" size="m" className={styles.modal__text}>
        Welcome to BorgGames
      </Typography>

      <PrimaryButton variant="primary" onClick={handleLogin}>
        Log in
      </PrimaryButton>
    </Modal>
  )
}
