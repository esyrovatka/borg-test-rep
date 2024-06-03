import { FC, useEffect, useRef, useState } from "react"

import SearchIcon from "@/public/assets/icons/search.svg"

import { Button, Input } from "@/shared/ui"

import { IMobileSearchProps } from "../types"
import styles from "./MobileSearch.module.scss"

export const MobileSearch: FC<IMobileSearchProps> = ({ value, onChange }) => {
  const [isOpen, setIsOpen] = useState<boolean>(false)
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.disabled = false
      inputRef.current.focus()
    }
  }, [isOpen])

  const handleButtonClick = () => setIsOpen(true)

  const handleInputBlur = () => {
    setIsOpen(false)
    if (inputRef.current) {
      inputRef.current.disabled = true
    }
  }

  return (
    <div className={styles.search}>
      {isOpen ? (
        <Input
          ref={inputRef}
          className={styles.mobileSearch__input}
          onBlur={handleInputBlur}
          value={value}
          onChange={onChange}
          icon={<SearchIcon />}
        />
      ) : (
        <Button variant="clear" onClick={handleButtonClick} className={styles.mobileSearch__icon}>
          <SearchIcon />
        </Button>
      )}
    </div>
  )
}
