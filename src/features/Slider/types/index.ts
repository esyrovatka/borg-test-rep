import { ReactNode } from "react"

import { IGameItemProps } from "@/widgets/GameItem/types"

export interface ISliderProps {
  list: IGameItemProps[]
  SlideItem: (props: IGameItemProps) => ReactNode
  title: string
  isSelectedSlider?: boolean
  selectedItem?: number | null
}
