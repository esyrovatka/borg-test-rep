import Image from "next/image"
import { FC, useCallback, useEffect, useState } from "react"

import { ConfirmModal } from "@/features/ConfirmModal"

import { classNames, useToggleModal } from "@/shared/lib"
import { Button, PrimaryButton, Typography } from "@/shared/ui"

import { freeUserParams, initialPlansList, primaryUserParams } from "../../const"
import { IPlanProps } from "../../types"
import styles from "./Plan.module.scss"

export const Plan: FC = () => {
  const [selectedPlan, setSelectedPlan] = useState<IPlanProps>(initialPlansList[0])
  const isSelectedPlan = useCallback((id: number): boolean => selectedPlan.id === id, [selectedPlan.id])

  const [isUserHavePlan, setIsUserHavePlan] = useState<boolean>(false)
  const [userParams, setUserParams] = useState<string[]>(freeUserParams)

  useEffect(() => {
    setUserParams(isUserHavePlan ? primaryUserParams : freeUserParams)
  }, [isUserHavePlan])

  const { isModalOpen, onCloseModal, onOpenModal } = useToggleModal()

  const changePlan = (id: number) => () => {
    if (isSelectedPlan(id)) return
    const newPlan = initialPlansList.find(plan => plan.id === id) as IPlanProps
    setSelectedPlan(newPlan)
  }

  return (
    <div className={styles.plan}>
      <div className={styles.plan__info}>
        <div className={styles.plan__description}>
          {isUserHavePlan ? (
            <Image
              className={styles.plan__info__image}
              src="/assets/img/sub_premium.webp"
              alt="user"
              width={88}
              height={88}
            />
          ) : (
            <Image
              className={styles.plan__info__image}
              src="/assets/img/sub_free_user.webp"
              alt="user"
              width={88}
              height={88}
            />
          )}

          <div className={styles.plan__info__params}>
            <Typography className={styles.plan__title} weight="seven">
              {isUserHavePlan ? "Premium user" : "Free user"}
            </Typography>

            {userParams.map(param => (
              <Typography
                key={`user-plan-params-${param}`}
                className={classNames(styles.plan__info__text, { [styles.color]: isUserHavePlan })}
                color="secondary"
              >
                {param}
              </Typography>
            ))}
          </div>
        </div>

        {isUserHavePlan && (
          <div className={styles.plan__subscription}>
            <Typography weight="five" color="secondary" className={styles.plan__subscription__text}>
              Next billing date:
              <span className={styles["plan__color--text"]}>12/30/2023</span>
            </Typography>

            <Button className={styles.plan__subscription__btn} variant="clear" onClick={onOpenModal}>
              Cancel subscription
            </Button>

            <ConfirmModal
              isOpen={isModalOpen}
              onClose={onCloseModal}
              func={() => setIsUserHavePlan(false)}
              title="Cancel subscription?"
              text="Are you sure you want to cancel your subscription, you can still access it until Apr 29, 2024"
            />
          </div>
        )}
      </div>

      <div className={styles.plan__separator} />

      <div className={styles.plan__selection}>
        <div className={styles.plan__choice}>
          {initialPlansList.map(plan => (
            <div key={`profile-plan-list-${plan.id}`}>
              <Typography
                weight="five"
                color={isSelectedPlan(plan.id) ? "primary" : "secondary"}
                onClick={changePlan(plan.id)}
                className={classNames(styles.plan__variant, { [styles.isSelected]: isSelectedPlan(plan.id) })}
              >
                {plan.title}
              </Typography>
              {plan.sales && <div className={styles.plan__choice__sale}>{`${plan.sales}%`}</div>}
            </div>
          ))}
        </div>

        <div className={styles["plan__selected--info"]}>
          <div>
            <Typography weight="five" className={styles.plan__name}>
              Premium user
            </Typography>
            <Typography weight="seven" className={styles.plan__coast}>{`${selectedPlan.coast}$`}</Typography>
          </div>

          <div>
            {isUserHavePlan ? (
              <Typography weight="five" color="secondary" className={styles.plan__active}>
                Don&apos;t delay and extend your subscription to have access to games for a longer period!
              </Typography>
            ) : (
              selectedPlan.properties.map(property => (
                <Typography
                  className={classNames(styles.plan__info__text, { [styles.color]: true })}
                  color="secondary"
                  key={`plan-${selectedPlan.id}-property-${property}`}
                >
                  {property}
                </Typography>
              ))
            )}
          </div>
        </div>

        <PrimaryButton className={styles.plan__btn} variant="primary" onClick={() => setIsUserHavePlan(true)}>
          {isUserHavePlan ? "Extend" : "Upgrade"}
        </PrimaryButton>
      </div>
    </div>
  )
}
