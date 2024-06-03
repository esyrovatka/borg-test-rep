import { wait } from "./util"

export async function notifications(message: string, timeout_ms?: number, containerNotifications?: HTMLElement | null) {
  const notification = document.createElement("div")
  notification.className = "notification"
  notification.textContent = message
  containerNotifications?.appendChild(notification)
  notification.addEventListener("click", () => {
    notification.classList.remove("show")
  })

  await wait(1)

  notification.classList.add("show")

  if (timeout_ms) {
    await wait(timeout_ms)
    notification.classList.remove("show")
    await wait(1000)
    notification.remove()
  }
}
