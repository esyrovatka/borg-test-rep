import Image from "next/image"
import { FC, SetStateAction, useEffect, useState } from "react"

import { Button, Typography } from "@/shared/ui"

import { IGameStoresProps, IStoreProps, TPlatformTypes } from "../../types"
import styles from "./GameStores.module.scss"

export const GameStores: FC<IGameStoresProps> = ({ platformGames, handleConnect, handleDisconnect }) => {
  const [connectedStores, setConnectedStores] = useState<IStoreProps[]>([])
  const [unconnectedStores, setUnconnectedStores] = useState<IStoreProps[]>([])
  useEffect(() => {
    const connected: SetStateAction<IStoreProps[]> = []
    const unconnected: SetStateAction<IStoreProps[]> = []

    Object.keys(platformGames).forEach(platform => {
      if (platformGames[platform].connect) {
        connected.push({ ...platformGames[platform], platform: platform as TPlatformTypes })
      } else {
        unconnected.push({ ...platformGames[platform], platform: platform as TPlatformTypes })
      }
    })
    setConnectedStores(connected)
    setUnconnectedStores(unconnected)
  }, [platformGames])
  return (
    <div className={styles.wrapper}>
      <Typography weight="seven" className={styles.wrapper__title}>
        Accounts
      </Typography>

      <div className={styles.wrapper__content}>
        <div>
          {!!connectedStores.length && <Typography className={styles.wrapper__content__title}>Connected</Typography>}
          <div className={styles.wrapper__content__list}>
            {connectedStores.map(item => (
              <div className={styles.wrapper__card} key={`connected-store-${item.platform}`}>
                <Image
                  className={styles.wrapper__card__logo}
                  src={item.logoConnect || ""}
                  alt="logo"
                  width={64}
                  height={64}
                />
                <div>
                  <Typography>{item.platform}</Typography>
                  <Button
                    onClick={() => handleDisconnect(item.platform)}
                    className={styles.wrapper__card__btn}
                    variant="clear"
                  >
                    Disconnect
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {!!unconnectedStores.length && !!connectedStores.length && <div className={styles.wrapper__content__decider} />}

        <div>
          {unconnectedStores.length && (
            <Typography className={styles.wrapper__content__title}>Not connected</Typography>
          )}
          <div className={styles.wrapper__content__list}>
            {unconnectedStores.map(item => (
              <div className={styles.wrapper__card} key={`unconnected-store-${item.platform}`}>
                <Image className={styles.wrapper__card__logo} src={item.logo} alt="logo" width={64} height={64} />
                <div>
                  <Typography>{item.platform}</Typography>
                  <Button
                    onClick={() => handleConnect(item.platform)}
                    className={styles.wrapper__card__btn}
                    variant="clear"
                  >
                    Connect
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
