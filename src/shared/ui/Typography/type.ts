import { HTMLAttributes } from "react"

type TTypographySize = "xs" | "s" | "m" | "l" | "xl" | "xxl" | "xxxl" | "initial"
type TTypographyColor = "primary" | "secondary" | "white" | "gray" | "light" | "warning"
type TTypographyWeight = "four" | "five" | "six" | "seven" | "eight" | "nine"
type TTypographyTag = "h1" | "h2" | "h3" | "h4" | "p"

export interface ITypographyProps extends HTMLAttributes<HTMLParagraphElement> {
  size?: TTypographySize
  color?: TTypographyColor
  weight?: TTypographyWeight
  className?: string
  tag?: TTypographyTag
}
