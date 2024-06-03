import { FC, PropsWithChildren, useEffect, useState } from "react"

import CloseIcon from "@/public/assets/icons/close-icon.svg"

import { classNames, Mods } from "@/shared/lib"

import { MODAL_ANIMATION_DELAY } from "../const"
import { IModalProps } from "../types"
import { Portal } from "./components/Portal"
import styles from "./Modal.module.scss"

export const Modal: FC<PropsWithChildren<IModalProps>> = props => {
  const { className, children, isOpen, onClose } = props
  const [isOpening, setIsOpening] = useState(false)
  const [isClosing, setIsClosing] = useState(false)
  const [isMounted, setIsMounted] = useState(false)

  useEffect(() => {
    if (isOpen && !isMounted) {
      setIsOpening(true)
      setIsMounted(true)
      setTimeout(() => {
        setIsOpening(false)
      }, MODAL_ANIMATION_DELAY)
    } else if (!isOpen && isMounted) {
      setIsClosing(true)
      setTimeout(() => {
        setIsClosing(false)
        setIsMounted(false)
      }, MODAL_ANIMATION_DELAY)
    }
  }, [isOpen, isMounted])

  useEffect(() => {
    const handleKeyClose = (event: KeyboardEvent) => event.key === "Escape" && onClose()
    window.addEventListener("keydown", handleKeyClose)
    return () => {
      window.addEventListener("keydown", handleKeyClose)
    }
  }, [onClose])

  const mods: Mods = {
    [styles.isOpen]: isMounted,
    [styles.isClosing]: isClosing,
    [styles.isOpening]: isOpening,
  }

  if (!isMounted) return null

  return (
    <Portal>
      <div className={classNames(styles.Modal, mods)}>
        <div className={styles.overlay} onClick={onClose}>
          <div className={classNames(styles.content, {}, [className])} onClick={e => e.stopPropagation()}>
            <div className={styles.cross} onClick={onClose}>
              <CloseIcon />
            </div>
            {children}
          </div>
        </div>
      </div>
    </Portal>
  )
}
