import { ReactElement, ReactNode } from "react"

export interface INavLinkProps {
  id: number
  icon: ReactElement
  label: string
  href: string
  isStroke?: boolean
}

export interface IActionButtonProps {
  isActive: boolean
  isSelected: boolean
  handleClick: () => void
  text: string
  icon?: ReactNode
}
