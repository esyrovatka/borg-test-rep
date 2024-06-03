/* eslint-disable class-methods-use-this */

/* eslint-disable no-bitwise */

/* eslint-disable lines-between-class-members */
// Util modules
import * as Enum from "./enum"
import * as Msg from "./msg"
import * as Util from "./util"
import { GamepadManager } from "./gamepad"

interface IScreenScaling {
  mouseMultiX: number
  mouseMultiY: number
  mouseOffsetX: number
  mouseOffsetY: number
  frameW: number
  frameH: number
}

function clientToServerX(clientX: number, m: IScreenScaling) {
  let serverX = Math.round((clientX - m.mouseOffsetX) * m.mouseMultiX)

  if (serverX === m.frameW - 1) serverX = m.frameW
  if (serverX > m.frameW) serverX = m.frameW
  if (serverX < 0) serverX = 0

  return serverX
}

function clientToServerY(clientY: number, m: IScreenScaling) {
  let serverY = Math.round((clientY - m.mouseOffsetY) * m.mouseMultiY)

  if (serverY === m.frameH - 1) serverY = m.frameH
  if (serverY > m.frameH) serverY = m.frameH
  if (serverY < 0) serverY = 0

  return serverY
}

function getAxisValue(value: number) {
  return value > 0 ? value * 32767 : value * 32768
}

export class Input {
  [x: string]: any
  element: HTMLVideoElement
  m!: IScreenScaling
  gamepad: null | GamepadManager
  mouseRelative: boolean
  private blockNextEsc: boolean
  send: (data: ArrayBuffer) => void
  keyFilter: (event: KeyboardEvent) => boolean = () => true
  private listeners: Util.IUtilListener[]
  cursorClass: string | null
  private styles: HTMLStyleElement[]
  private cache: { [base64: string]: string }
  private cursorId: number

  constructor(element: HTMLVideoElement, send: (data: ArrayBuffer) => void) {
    this.send = send
    this.element = element
    this.gamepad = null
    this.cursorClass = null
    this.mouseRelative = false
    this.blockNextEsc = false
    this.listeners = []
    this.cache = {}
    this.styles = []
    this.cursorId = 0
    this._windowMath()
  }

  _mouseMovement(event: MouseEvent) {
    if (!this.m) return

    // edit: let relative mouse only work with locked pointer
    // if (this.mouseRelative && !document.pointerLockElement)
    //  return;
    // }

    let relative = false
    let x = 0
    let y = 0

    if (document.pointerLockElement) {
      relative = true
      x = event.movementX
      y = event.movementY
      if (x === 0 && y === 0) return
    } else {
      // edit: use offset coordinates not client coordinates
      x = clientToServerX(event.offsetX, this.m)
      y = clientToServerY(event.offsetY, this.m)
    }

    this.send(Msg.motion(relative, x, y))
  }

  // eslint-disable-next-line class-methods-use-this, consistent-return
  _mouseButton(event: MouseEvent) {
    const down = event.type === "mousedown"
    let button = 0
    const target = event.target as HTMLElement
    if (!document.pointerLockElement) {
      if (this.mouseRelative) target.requestPointerLock()
    }
    if (down && event.button === 0 && event.ctrlKey && event.shiftKey) {
      return target.requestPointerLock()
    }
    switch (event.button) {
      case 0:
        button = 1
        break
      case 1:
        button = 2
        break
      case 2:
        button = 3
        break
      case 3:
        button = 4
        break
      case 4:
        button = 5
        break
      default:
        break
    }
    this.send(Msg.mouse(button, down))
  }

  _touch(event: TouchEvent) {
    const down = event.type === "touchstart"
    const touch = event.changedTouches[0]
    const x = clientToServerX(touch.clientX, this.m)
    const y = clientToServerY(touch.clientY, this.m)
    this.send(Msg.motion(false, x, y))
    this.send(Msg.mouse(1, down))
  }

  _key(event: KeyboardEvent) {
    event.preventDefault()

    if (!this.keyFilter(event)) return

    if (
      (event.code === "F5" && event.ctrlKey) ||
      (event.code === "KeyI" && event.ctrlKey && event.shiftKey) ||
      event.code === "F11"
    ) {
      return
    }

    const code = Enum.Scancodes[event.code]

    if (code) {
      let mod = 0

      if (event.getModifierState("NumLock")) {
        mod |= 0x00001000
      }

      if (event.getModifierState("CapsLock")) {
        mod |= 0x00002000
      }

      this.send(Msg.kb(code, mod, event.type === "keydown"))
    }
  }

  _mouseWheel(event: WheelEvent) {
    event.preventDefault()

    // edit: make macOS touchpad scrollable by changing 100 to 2, as int32 is used in msg
    // FIXME: what's the delta when using mouse on macOS or other platforms?
    this.send(Msg.mouseWheel(event.deltaX, event.deltaY, event.deltaZ))
  }

  // eslint-disable-next-line class-methods-use-this
  _contextMenu(event: Event) {
    event.preventDefault()
  }

  _button(index: number, button: number, value: number) {
    if (button === 6 || button === 7) {
      this.send(Msg.axis(button - 2, getAxisValue(value), index))
    } else {
      const mapped = Enum.Mapping[button]

      if (mapped !== undefined) this.send(Msg.button(mapped, value, index))
    }
  }

  _axis(index: number, axis: number, value: number) {
    this.send(Msg.axis(axis, getAxisValue(value), index))
  }

  _unplug(index: number) {
    this.send(Msg.unplug(index))
  }

  _pointerLock() {
    if (!document.pointerLockElement && !this.blockNextEsc) {
      this.send(Msg.kb(41, 0, true))
      this.send(Msg.kb(41, 0, false))
    }

    this.blockNextEsc = false
  }

  _exitPointerLock() {
    if (document.pointerLockElement) {
      this.blockNextEsc = true
      document.exitPointerLock()
    }
  }

  _windowMath() {
    const windowW = this.element.offsetWidth
    const windowH = this.element.offsetHeight
    const frameW = this.element.videoWidth
    const frameH = this.element.videoHeight

    const multi = Math.min(windowW / frameW, windowH / frameH)
    const vpWidth = frameW * multi
    const vpHeight = frameH * multi

    this.m = {
      mouseMultiX: frameW / vpWidth,
      mouseMultiY: frameH / vpHeight,
      mouseOffsetX: Math.max((windowW - vpWidth) / 2.0, 0),
      mouseOffsetY: Math.max((windowH - vpHeight) / 2.0, 0),
      frameW,
      frameH,
    }
  }

  _setCursorVisibility(show: boolean) {
    this.element.style.cursor = show ? "" : "none"
  }

  _clearCursors() {
    const head = document.querySelector("head")!

    // eslint-disable-next-line no-restricted-syntax
    for (const style of this.styles) head.removeChild(style)

    if (this.cursorClass) this.element.classList.remove(this.cursorClass)
  }

  setMouseMode(relative: boolean, hidden: boolean) {
    this._setCursorVisibility(!hidden)
    this.mouseRelative = relative
    console.info("mouse mode", relative ? "relative" : "absolute", "visible: ", !hidden)

    if (this.mouseRelative) {
      // eslint-disable-next-line no-use-before-define
      requestPointerLock(this.element)
    } else {
      this._exitPointerLock()
    }
  }

  setCursor(data: string, hotX: number, hotY: number) {
    if (!this.cache[data]) {
      this.cache[data] = `cursor-x-${this.cursorId}`

      const style = document.createElement("style")
      style.type = "text/css"
      style.innerHTML = `.cursor-x-${this.cursorId + 1} {cursor: url(data:image/png;base64,${data}) ${hotX} ${hotY}, auto;}`
      document.querySelector("head")!.appendChild(style)

      this.styles.push(style)
    }

    if (this.cursorClass) {
      this.element.classList.replace(this.cursorClass, this.cache[data])
    } else {
      this.element.classList.add(this.cache[data])
    }

    this.cursorClass = this.cache[data]
  }

  attach() {
    this.gamepad = new GamepadManager(this._button.bind(this), this._axis.bind(this), this._unplug.bind(this))

    this.listeners.push(Util.addListener(this.element, "resize", this._windowMath, this))
    this.listeners.push(Util.addListener(this.element, "mousemove", this._mouseMovement, this))
    this.listeners.push(Util.addListener(this.element, "mousedown", this._mouseButton, this))
    this.listeners.push(Util.addListener(this.element, "mouseup", this._mouseButton, this))
    this.listeners.push(Util.addListener(this.element, "touchstart", this._touch, this))
    this.listeners.push(Util.addListener(this.element, "touchend", this._touch, this))
    // edit: use standard event although there is no difference
    this.listeners.push(Util.addListener(this.element, "wheel", this._mouseWheel, this))
    this.listeners.push(Util.addListener(this.element, "contextmenu", this._contextMenu, this))
    this.listeners.push(Util.addListener(document, "pointerlockchange", this._pointerLock, this))
    this.listeners.push(Util.addListener(window, "keydown", this._key, this))
    this.listeners.push(Util.addListener(window, "keyup", this._key, this))
    this.listeners.push(Util.addListener(window, "resize", this._windowMath, this))
  }

  detach() {
    Util.removeListeners(this.listeners)

    this._setCursorVisibility(true)
    this._exitPointerLock()
    this._clearCursors()

    if (this.gamepad) this.gamepad.destroy()
  }
}

function requestPointerLock(element: Element) {
  element.requestPointerLock()
}
