import Image from "next/image"

import { useSelector } from "react-redux"

import { GetStarted } from "@/widgets/GetStarted"

import { isNavBarOpenSelector } from "@/entities/NavBar"

import { classNames } from "@/shared/lib"
import { Card, Typography } from "@/shared/ui"

import { requirementConfig, setupList } from "../const"
import { RequirementBlock } from "./RequirementBlock/RequirementBlock"
import styles from "./SetupPage.module.scss"

export const SetupPage = () => {
  const isNavBarOpen = useSelector(isNavBarOpenSelector)

  return (
    <div className={classNames(styles.wrapper, { [styles.isOpen]: isNavBarOpen })}>
      <GetStarted />

      <div className={styles.wrapper__setup}>
        <Typography className={styles["wrapper__setup--title"]} weight="six">
          How to setup Borg node?
        </Typography>

        <Card className={styles["wrapper__setup--info"]}>
          <Typography className={styles["wrapper__setup--info__title"]} weight="six">
            What is a Borg node?
          </Typography>

          <Typography className={styles["wrapper__setup--info__text"]} weight="six" color="light">
            Borg.games is a P2P cloud gaming service where games run on idling computers all over the world. You can
            join your computer to the Borg network to offer its idle resources. In return Borg.games will provide
            various benefits, including but not limited to:
          </Typography>

          <ul className={styles["wrapper__setup--info__list"]}>
            {setupList.map(item => (
              <li key={`setup-list-item-${item}`}>{item}</li>
            ))}
          </ul>
        </Card>
      </div>

      <div className={styles.wrapper__configure}>
        <Typography className={styles["wrapper__setup--title"]} weight="six">
          Configure
        </Typography>

        <Typography className={styles.wrapper__configure__text}>
          During technical preview app interface might change often and will not match the picture exactly
        </Typography>

        <Image
          className={styles.wrapper__configure__image}
          src="/assets/img/node_status.webp"
          alt="img"
          width={650}
          height={477}
        />
      </div>

      {requirementConfig.map(({ num, title, text }) => (
        <RequirementBlock num={num} title={title} text={text} key={`setup-requirement-item-${title}`} />
      ))}

      <div className={styles.wrapper__validate}>
        <Typography className={styles["wrapper__setup--title"]} weight="six">
          Validate public node status
        </Typography>

        <Typography weight="five" className={styles.wrapper__validate__text} color="light">
          Once all the requirements are met it might be necessary to restart the Borg node app or your whole PC. Borg
          app shows in the system tray next to the clock as a red icon:
          <br />
          To exit the app right-click on the icon and select &quot;Exit&quot;
        </Typography>

        <Typography weight="five" className={styles.wrapper__validate__text} color="light">
          After the app is restarted and some time passes you should see the following message:
        </Typography>

        <Image
          className={styles.wrapper__validate__image}
          src="/assets/img/node_status_ok.webp"
          alt="img"
          width={345}
          height={194}
        />

        <Typography weight="five" className={styles.wrapper__validate__text} color="light">
          If you are certain all requirements are met, but the Sandbox still does not start, please contact support.
        </Typography>
      </div>

      <GetStarted />
    </div>
  )
}
