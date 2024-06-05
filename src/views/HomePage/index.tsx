import { GameBigItem } from "@/widgets/GameBigItem";
import { GameItem } from "@/widgets/GameItem";

import { Slider } from "@/features/Slider";

import {
  getImmediatelyAvailableGamesSelector,
  getMostPopularGamesSelector,
  getNewlyAddedGamesSelector,
  getRecentlyPlayedGamesSelector,
} from "@/entities/Games";
import { isNavBarOpenSelector } from "@/entities/NavBar";

import { classNames, useAppSelector } from "@/shared/lib";
import { Typography } from "@/shared/ui";

import styles from "./HomePage.module.scss";
import { useHomePage } from "./lib";
import { EmptyState } from "./ui/EmptyState";

export const HomePage = () => {
  const isNavBarOpenOpen = useAppSelector(isNavBarOpenSelector);
  const mostPopularGames = useAppSelector(getMostPopularGamesSelector);
  const newlyAddedGames = useAppSelector(getNewlyAddedGamesSelector);
  const immediatelyAvailableGames = useAppSelector(getImmediatelyAvailableGamesSelector);
  const recentlyPlayedGames = useAppSelector(getRecentlyPlayedGamesSelector);
  const { selectedGame, recentlyPlayedGamesRef, mostPopularGamesRef, newlyAddedGamesRef, immediatelyAvailableGamesRef, isNavBarNavigate } =
    useHomePage();

  console.log("here test env::", process.env.NEXT_PUBLIC_BORG_URL);

  if (!recentlyPlayedGames.length && !immediatelyAvailableGames.length && !newlyAddedGames.length && !mostPopularGames.length) {
    return <EmptyState />;
  }

  return (
    <div className={classNames(styles.wrapper, { [styles.isOpen]: isNavBarOpenOpen })}>
      {!!recentlyPlayedGames.length && (
        <div ref={recentlyPlayedGamesRef}>
          <Slider
            title="Recently played games"
            list={recentlyPlayedGames}
            SlideItem={GameBigItem}
            isSelectedSlider={selectedGame.row === 1 && !isNavBarNavigate}
            selectedItem={selectedGame.item}
          />
        </div>
      )}
      {!!mostPopularGames.length && (
        <div ref={mostPopularGamesRef}>
          <Slider
            title="Most Popular Games"
            list={mostPopularGames}
            SlideItem={GameItem}
            isSelectedSlider={selectedGame.row === 2 && !isNavBarNavigate}
            selectedItem={selectedGame.item}
          />
        </div>
      )}

      {!!newlyAddedGames.length && (
        <div ref={newlyAddedGamesRef}>
          <Slider
            title="Newly added"
            list={newlyAddedGames}
            SlideItem={GameItem}
            isSelectedSlider={selectedGame.row === 3 && !isNavBarNavigate}
            selectedItem={selectedGame.item}
          />
        </div>
      )}

      {!!immediatelyAvailableGames.length && (
        <Typography tag="h2" size="xl" weight="five">
          All Games
        </Typography>
      )}
      <div className={styles.wrapper__games} ref={immediatelyAvailableGamesRef}>
        {immediatelyAvailableGames?.map((item, i) => (
          <GameItem
            key={`immediately-available-games-${item.id}`}
            title={item.title}
            poster_src={item.poster_src}
            id={item.id}
            availableDevice={item.availableDevice}
            isSelected={selectedGame.row === 4 && selectedGame.item === i + 1 && !isNavBarNavigate}
          />
        ))}
      </div>
    </div>
  );
};
