import { ForwardedRef, forwardRef, useEffect, useRef, useState } from "react"

import EyeIcon from "@/public/assets/icons/eye.svg"
import EyeOffIcon from "@/public/assets/icons/eye_off.svg"

import { classNames, getRandomId } from "@/shared/lib"

import { Button } from "../Button"
import styles from "./Input.module.scss"
import { TInputProps, TInputType } from "./types"

export const Input = forwardRef((props: TInputProps, ref?: ForwardedRef<HTMLInputElement>) => {
  const {
    type = "text",
    label,
    isDisabled = false,
    className,
    error,
    value,
    onChange,
    name,
    withEdit,
    icon,
    ...otherProps
  } = props
  const inputIdRef = useRef<string>()

  useEffect(() => {
    inputIdRef.current = getRandomId("input")
  }, [])
  const containerClassName = classNames(styles.container, { [styles.incorrect]: error, [styles.disabled]: isDisabled })

  const [inputType, setInputType] = useState<TInputType>(type)

  const changeType = () => {
    if (inputType === "text") setInputType("password")
    if (inputType === "password") setInputType("text")
  }
  return (
    <div className={containerClassName}>
      {label && (
        <label htmlFor={inputIdRef.current} className={styles.label}>
          {label}
          {withEdit && (
            <Button variant="clear" className={styles.edit}>
              Edit
            </Button>
          )}
        </label>
      )}

      <div className={styles.inputContainer}>
        {icon && <div className={classNames(styles.icon, {}, [styles.start])}>{icon}</div>}
        <input
          id={inputIdRef.current}
          ref={ref}
          onChange={e => onChange(e.target.value, name || "")}
          value={value}
          type={inputType}
          className={classNames(styles.input, { [styles.withIcon]: !!icon }, [className])}
          {...otherProps}
        />

        {type === "password" && (
          <Button variant="clear" onClick={changeType} className={classNames(styles.icon, {}, [styles.end])}>
            {inputType === "password" ? <EyeIcon /> : <EyeOffIcon />}
          </Button>
        )}
      </div>

      {!!error && <p className={styles.error}>{error}</p>}
    </div>
  )
})
