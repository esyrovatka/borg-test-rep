import { FC, useRef } from "react"
import { Swiper, SwiperRef, SwiperSlide } from "swiper/react"

import ArrowIcon from "@/public/assets/icons/arrow_left.svg"

import { classNames } from "@/shared/lib"
import { Typography } from "@/shared/ui"

import { settingsConfig } from "../../const"
import styles from "./Settings.module.scss"
import "./swiper.scss"
import "swiper/css"
import "swiper/css/navigation"
import "swiper/css/pagination"
import { Pagination } from "swiper/modules"

export const Settings: FC = () => {
  const sliderRef = useRef<SwiperRef | null>(null)
  const handlePrev = () => sliderRef.current?.swiper.slidePrev()
  const handleNext = () => sliderRef.current?.swiper.slideNext()

  return (
    <div className={styles.settings}>
      <Typography weight="seven" className={styles.settings__title}>
        Settings
      </Typography>

      <div className={styles.settings__params}>
        <Typography weight="six" className={styles.settings__params__title}>
          Graphics quality
        </Typography>

        <Swiper
          modules={[Pagination]}
          pagination={{
            el: "#swiper-pagination",
            type: "bullets",
          }}
          ref={sliderRef}
          className={styles.settings__slider}
          slidesPerView={1}
        >
          {settingsConfig.map(item => (
            <SwiperSlide key={`settings-quality-${item.label}`} className={styles.settings__slider__slide}>
              <Typography weight="six" color="light" className={styles.settings__slider__text}>
                {item.label}
              </Typography>
            </SwiperSlide>
          ))}

          <div className={styles.settings__slider__pagination} id="swiper-pagination" />
          <ArrowIcon onClick={handlePrev} className={classNames(styles.settings__slider__nav)} />
          <ArrowIcon
            onClick={handleNext}
            className={classNames(styles.settings__slider__nav, { [styles.isNext]: true })}
          />
        </Swiper>
      </div>
    </div>
  )
}
