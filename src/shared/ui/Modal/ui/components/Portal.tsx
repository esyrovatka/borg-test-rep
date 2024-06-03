import { FC, PropsWithChildren } from "react"

import { createPortal } from "react-dom"

import { IPortalProps } from "../../types"

export const Portal: FC<PropsWithChildren<IPortalProps>> = props => {
  const { children, element = document.body } = props

  return createPortal(children, element)
}
