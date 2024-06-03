import { useState } from "react"

export const useToggleModal = () => {
  const [isModalOpen, setModalOpen] = useState<boolean>(false)

  const onOpenModal = () => setModalOpen(true)

  const onCloseModal = () => setModalOpen(false)

  const onToggleModal = () => setModalOpen(isModalOpen => !isModalOpen)

  return {
    isModalOpen,
    onCloseModal,
    onOpenModal,
    onToggleModal,
  }
}
