import { useRouter } from "next/navigation"
import { FC, useEffect, useRef, useState } from "react"

import { classNames } from "@/shared/lib"
import { Modal, PrimaryButton, Typography } from "@/shared/ui"

import { IWaitForStartGameModalProps } from "../types"
import styles from "./WaitForStartGameModal.module.scss"

export const WaitForStartGameModal: FC<IWaitForStartGameModalProps> = ({
  isModalOpen,
  onCloseModal,
  queue = 10,
  time = 8,
}) => {
  const router = useRouter()
  const onProfilePageOpen = () => router.push("/profile")

  const [timeLeft, setTimeLeft] = useState(time)

  const timer = useRef<NodeJS.Timeout | null>(null)

  useEffect(() => {
    if (isModalOpen) setTimeLeft(time)
  }, [isModalOpen, time])

  useEffect(() => {
    if (isModalOpen) {
      timer.current = setInterval(() => {
        setTimeLeft(prevTime => prevTime - 1)
      }, 1000)
    } else {
      clearInterval(timer.current!)
    }

    return () => {
      clearInterval(timer.current!)
    }
  }, [isModalOpen])

  useEffect(() => {
    // TODO: launch game when start game work
    if (timeLeft === 0) onCloseModal()
  }, [timeLeft, onCloseModal])

  return (
    <Modal isOpen={isModalOpen} onClose={onCloseModal} className={styles.modal}>
      <Typography weight="seven" className={styles.modal__title}>
        Starting the game
      </Typography>
      <Typography weight="five" color="secondary" className={styles.modal__text}>
        Please wait. Place in the queue:
        {queue}
      </Typography>
      <Typography weight="five" color="primary" className={styles.modal__time}>
        Estimated waiting time:
        <b className={styles.modal__time__param}>{` ${timeLeft} minutes`}</b>
      </Typography>
      <div className={styles.modal__loader}>
        <div className={classNames(styles.modal__loader__square, { [styles.isFirst]: true })} />
      </div>
      <Typography weight="five" color="secondary">
        Tired of waiting in queue? Upgrade to premium now
      </Typography>

      <PrimaryButton variant="primary" onClick={onProfilePageOpen}>
        Upgrade to premium
      </PrimaryButton>
    </Modal>
  )
}
