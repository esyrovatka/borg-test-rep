export interface IConfirmModalProps {
  isOpen: boolean
  onClose: () => void
  title: string
  text?: string
  func?: () => void
}
