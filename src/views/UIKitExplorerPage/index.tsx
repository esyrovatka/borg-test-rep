import { useEffect, useState } from "react"

import PlayIcon from "@/public/assets/icons/play.svg"

import { useToggleModal } from "@/shared/lib"
import { Button, Input, Modal, PrimaryButton, Typography } from "@/shared/ui"

import { IUserTypeProps } from "./types"
import styles from "./UIKitExplorerPage.module.scss"

export const UIKitExplorerPage = () => {
  const [error, setErrors] = useState<IUserTypeProps>({
    email: "",
    password: "",
  })

  const [user, setUser] = useState<IUserTypeProps>({
    email: "",
    password: "",
  })

  const changeValue = (val: string, name: string) => {
    setUser(prev => {
      return { ...prev, [name]: val }
    })
  }

  useEffect(() => {
    if (user.email.length > 3) {
      setErrors({ email: "Error description here", password: "" })
    } else {
      setErrors({
        email: "",
        password: "",
      })
    }
  }, [user.email])

  const { isModalOpen, onCloseModal, onOpenModal } = useToggleModal()

  return (
    <>
      <Modal isOpen={isModalOpen} onClose={onCloseModal} className={styles.modal}>
        <PrimaryButton variant="primary">Log in</PrimaryButton>
      </Modal>
      <div className={styles.wrapper}>
        <Typography tag="h1" size="xl" weight="five">
          Recently played games
        </Typography>

        <Button variant="clear" onClick={onOpenModal}>
          Open Modal
        </Button>

        <Button>
          <PlayIcon className={styles.icon} />
          Play
        </Button>

        <Button variant="clear">
          <Typography>Play</Typography>
        </Button>
        <PrimaryButton>
          <PlayIcon className={styles.icon} />
        </PrimaryButton>

        <PrimaryButton isDisabled>
          <PlayIcon className={styles.icon} />
        </PrimaryButton>

        <PrimaryButton variant="primary">
          <PlayIcon className={styles.icon} />
          Play
        </PrimaryButton>

        <Input
          name="email"
          error={error.email}
          label="Email"
          value={user.email}
          onChange={changeValue}
          placeholder="email"
        />
        <Input
          name="password"
          error={error.password}
          label="Password"
          value={user.password}
          onChange={changeValue}
          placeholder="email"
          type="password"
        />

        <Input
          withEdit
          name="password"
          error={error.password}
          label="Password"
          value={user.password}
          onChange={changeValue}
          placeholder="email"
          type="password"
        />
      </div>
    </>
  )
}
