import { ButtonHTMLAttributes } from "react"

export interface IButtonVariantProps {
  variant?: "fill" | "primary"
}

export interface IButtonProps extends ButtonHTMLAttributes<HTMLButtonElement>, IButtonVariantProps {
  isDisabled?: boolean
  className?: string
}
