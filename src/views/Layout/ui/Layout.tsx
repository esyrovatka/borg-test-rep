"use client"

import { FC, PropsWithChildren, useEffect, useRef, useState } from "react"

import { Footer, Header, NavBar } from "@/widgets"

import { ConnectionNotification } from "@/features/ConnectionNotification"

import { EConnection, getStreamConnectionSelector, getStreamStatusSelector, streamSliceAction } from "@/entities/Stream"

import { classNames, useAppDispatch, useAppSelector, useHideKeyScroll } from "@/shared/lib"
import { Typography } from "@/shared/ui"

import styles from "./Layout.module.scss"

const Layout: FC<PropsWithChildren> = ({ children }) => {
  const refStreamElem = useRef<HTMLVideoElement | null>(null)
  const dispatch = useAppDispatch()
  const streamStatus = useAppSelector(getStreamStatusSelector)
  const connection = useAppSelector(getStreamConnectionSelector)
  const [streamConnection, setStreamConnection] = useState<EConnection>()
  const [status, setStatus] = useState<string>("")

  useHideKeyScroll()

  useEffect(() => {
    setStatus(streamStatus)
  }, [streamStatus])

  useEffect(() => {
    setStreamConnection(connection)
  }, [connection])

  useEffect(() => {
    const streamElem = refStreamElem.current
    if (streamElem) dispatch(streamSliceAction.selectStreamElement(streamElem))
  }, [dispatch])

  return (
    <>
      <div className={styles.stream} id="stream">
        <div className="video-container">
          <div id="notifications" />
        </div>
        <ConnectionNotification connection={streamConnection} />
        {status && (
          <div id="status" className={classNames(styles.stream__status, { [styles.isTest]: status === "test" })}>
            <Typography>{status}</Typography>
          </div>
        )}

        <video disablePictureInPicture autoPlay id="stream" className={styles.stream__video} ref={refStreamElem}>
          <track kind="captions" srcLang="en" label="english_captions" />
        </video>
        <button className="action" type="button" id="video-resume" style={{ display: "none" }}>
          Resume
        </button>
        <div id="notifications" className={styles.stream__notifications} />
      </div>

      <div className={styles.layout}>
        <div className={styles.navBar}>
          <NavBar />
        </div>
        <div className={styles.main}>
          <Header />
          {children}
        </div>
      </div>
      <Footer />
    </>
  )
}

export default Layout
