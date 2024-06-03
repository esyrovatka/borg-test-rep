import Image from "next/image"
import { FC } from "react"

import EditIcon from "@/public/assets/icons/edit.svg"
import LinkIcon from "@/public/assets/icons/link_external.svg"

import { IUserData } from "@/entities/User"

import { classNames } from "@/shared/lib"
import { Typography } from "@/shared/ui"

import styles from "./ProfileCard.module.scss"

export const ProfileCard: FC<{ user?: IUserData }> = ({ user }) => {
  return (
    <div className={styles.card}>
      <div className={styles.card__info}>
        <Image src={user?.avatarUrl || "/assets/img/user_avatar.webp"} alt="avatar" width={100} height={100} />

        <div className={styles.card__profile}>
          <div className={styles.card__title}>
            <Typography className={styles.card__name} weight="six">
              {user?.displayName}
            </Typography>

            <Typography color="primary" className={styles.card__edit}>
              <EditIcon />
              Edit profile
            </Typography>
          </div>

          <div className={styles.card__storage}>
            <div className={styles["card__drive--storage"]}>
              <LinkIcon className={styles["card__drive--storage__icon"]} />

              <Typography weight="five" className={styles["card__drive--storage__text"]}>
                One drive storage
              </Typography>

              <progress
                className={styles["card__drive--storage__progress"]}
                max={user?.totalMBSpace}
                value={user?.usedMBSpace}
              />

              <Typography className={styles["card__drive--storage__info"]} weight="five">
                {user?.usedMBSpace}
                mb/
                {user?.totalMBSpace ? (user.totalMBSpace / 1000).toFixed() : 0}
                gb
              </Typography>
            </div>

            <div className={classNames(styles["card__games--info"], { [styles.isTablet]: true })}>
              <div className={styles["card__games--info__item"]}>
                <Typography color="gray" className={styles["card__games--info__title"]} weight="five">
                  Total time played
                </Typography>
                <Typography className={styles["card__games--info__text"]} weight="six">
                  15 hours
                </Typography>
              </div>

              <div className={styles["card__games--info__item"]}>
                <Typography color="gray" className={styles["card__games--info__title"]} weight="five">
                  Games played
                </Typography>
                <Typography className={styles["card__games--info__text"]} weight="six">
                  4 hours
                </Typography>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className={classNames(styles["card__games--info"], { [styles.isMobile]: true })}>
        <div className={styles["card__games--info__item"]}>
          <Typography color="gray" className={styles["card__games--info__title"]} weight="five">
            Total time played
          </Typography>
          <Typography className={styles["card__games--info__text"]} weight="six">
            15 hours
          </Typography>
        </div>

        <div className={styles["card__games--info__item"]}>
          <Typography color="gray" className={styles["card__games--info__title"]} weight="five">
            Games played
          </Typography>
          <Typography className={styles["card__games--info__text"]} weight="six">
            4 hours
          </Typography>
        </div>
      </div>
    </div>
  )
}
