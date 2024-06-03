export interface IModalProps {
  className?: string
  isOpen: boolean
  onClose: () => void
}

export interface IPortalProps {
  element?: HTMLElement
}
