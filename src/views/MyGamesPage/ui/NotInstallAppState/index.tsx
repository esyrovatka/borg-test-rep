import Image from "next/image"
import { useRouter } from "next/navigation"
import { FC } from "react"

import { PrimaryButton, Typography } from "@/shared/ui"

import styles from "./NotInstallAppState.module.scss"

export const NotInstallAppState: FC = () => {
  const router = useRouter()

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
        Looking for your games?
      </Typography>
      <Typography className={styles.wrapper__text} color="light" weight="five">
        To start playing, please, download and setup our Microsoft application that will help you to play games
        installed on your computer
      </Typography>

      <PrimaryButton variant="primary" onClick={() => router.push("/setup")}>
        Download desktop app
      </PrimaryButton>
    </div>
  )
}
