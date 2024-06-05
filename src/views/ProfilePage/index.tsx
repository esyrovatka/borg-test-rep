import { classNames } from "@/shared/lib"

import { Loader } from "../MyGamesPage/ui"
import { useProfilePage } from "./lib/useProfilePage"
import styles from "./ProfilePage.module.scss"
import { GameStores, MyActivity, Plan, ProfileCard, Settings } from "./ui"

export const ProfilePage = () => {
  const { isNavBarOpenOpen, user, isUserLoad, handleConnect, platformGames, handleDisconnect } = useProfilePage()

  if (isUserLoad) return <Loader />

  return (
    <div className={classNames(styles.wrapper, { [styles.isOpen]: isNavBarOpenOpen })}>
      {!user && <Settings />}
      {user && (
        <>
          <ProfileCard user={user} />
          <Plan />
          <GameStores platformGames={platformGames} handleConnect={handleConnect} handleDisconnect={handleDisconnect} />
          <Settings />
          <MyActivity />
        </>
      )}
    </div>
  )
}
