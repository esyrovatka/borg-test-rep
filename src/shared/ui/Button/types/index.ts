import { ButtonHTMLAttributes } from "react"

export interface IButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  isDisabled?: boolean
  variant?: "fill" | "outlined" | "clear"
  color?: "primary" | "white" | "black" | "cancel"
  className?: string
}
