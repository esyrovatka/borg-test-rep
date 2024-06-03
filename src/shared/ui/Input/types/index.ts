import { InputHTMLAttributes, ReactElement } from "react"

export type TInputType = "text" | "number" | "email" | "password"

type HtmlInputProps = Omit<InputHTMLAttributes<HTMLInputElement>, "value" | "onChange">

export type TInputProps = HtmlInputProps & {
  type?: TInputType
  name?: string
  label?: string
  isDisabled?: boolean
  className?: string
  error?: string
  value?: string | number
  onChange: (value: string, name: string) => void
  withEdit?: boolean
  icon?: ReactElement
}
