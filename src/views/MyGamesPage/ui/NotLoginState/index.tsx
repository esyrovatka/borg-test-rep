import Image from "next/image"
import { FC } from "react"

import { navBarAction } from "@/entities/NavBar"

import { useAppDispatch } from "@/shared/lib"
import { PrimaryButton, Typography } from "@/shared/ui"

import styles from "./NotLoginState.module.scss"

export const NotLoginState: FC = () => {
  const dispatch = useAppDispatch()
  const openLoginModal = () => dispatch(navBarAction.onOpenLoginModal())
  return (
    <div className={styles.wrapper}>
      <Image
        className={styles.wrapper__image}
        src="/assets/img/my_games_not_loged_in.webp"
        alt="not login"
        width={120}
        height={120}
      />
      <Typography className={styles.wrapper__title} weight="seven">
        Seems like you don&apos;t have any games in your library yet
      </Typography>
      <Typography className={styles.wrapper__text} color="light" weight="five">
        Install the game you would like to play on your device and make sure it appears in our desktop application Borg
      </Typography>

      <PrimaryButton variant="primary" onClick={openLoginModal}>
        Log in
      </PrimaryButton>
    </div>
  )
}
