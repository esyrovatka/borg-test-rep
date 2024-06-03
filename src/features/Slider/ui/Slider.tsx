"use client"

import { FC, useEffect, useId, useRef } from "react"
import { Swiper, SwiperRef, SwiperSlide } from "swiper/react"

import ArrowIcon from "@/public/assets/icons/arrow_left.svg"

import { Typography } from "@/shared/ui"

import { ISliderProps } from "../types"
import styles from "./Slider.module.scss"
import "swiper/css"
import "swiper/css/navigation"

export const Slider: FC<ISliderProps> = ({ list, SlideItem, title, isSelectedSlider, selectedItem }) => {
  const sliderRef = useRef<SwiperRef | null>(null)
  const swiperId = useId()

  const handlePrev = () => sliderRef.current?.swiper.slidePrev()
  const handleNext = () => sliderRef.current?.swiper.slideNext()

  useEffect(() => {
    const slider = sliderRef.current
    if (isSelectedSlider && selectedItem && slider) {
      slider.swiper.slideToLoop(selectedItem - 1)
    }
  }, [selectedItem, isSelectedSlider])

  return (
    <div className={styles.slider}>
      <Typography tag="h2" size="xl" weight="five">
        {title}
      </Typography>
      <div>
        <Swiper
          id={isSelectedSlider ? swiperId : ""}
          className={styles.slider__swiper}
          ref={sliderRef}
          loop
          slidesPerView="auto"
          spaceBetween={30}
        >
          {list.map((item, i) => (
            <SwiperSlide key={item.id} className={styles.slider__slide}>
              <SlideItem
                title={item.title}
                poster_src={item.poster_src}
                id={item.id}
                availableDevice={item.availableDevice}
                lastPlayData={item?.lastPlayData}
                isSelected={isSelectedSlider && selectedItem === i + 1}
              />
            </SwiperSlide>
          ))}
        </Swiper>
      </div>

      <div className={styles.slider__nav}>
        <div className={styles["slider__nav-next"]} onClick={handlePrev}>
          <ArrowIcon className={styles["slider__nav-next__icon"]} />
        </div>
        <div className={styles["slider__nav-prev"]} onClick={handleNext}>
          <ArrowIcon className={styles["slider__nav-prev__icon"]} />
        </div>
      </div>
    </div>
  )
}
