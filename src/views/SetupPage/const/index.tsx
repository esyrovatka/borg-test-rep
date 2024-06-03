import { IRequirementBlockProps } from "../types"

export const setupList: string[] = [
  "money",
  "premium access to our cloud gaming service",
  "early access to games",
  "early access to cloud gaming features",
  "special content",
  "member discounts",
]

export const requirementConfig: IRequirementBlockProps[] = [
  {
    num: 1,
    title: "GPU/H.264 encoder",
    text: `OPTIONAL: GPU appears to be supported - during the technical preview only NVidia GPUs are fully supported.
     If you have an NVidia GPU, and still see an error, try installing the latest driver.
    Non-NVidia GPUs might work, but the user experience and performance will be degraded.`,
  },
  {
    num: 2,
    title: "Sandbox",
    text: `Running a full Borg node requires Windows Sandbox to be installed.
     Windows Sandbox in turn needs a Windows component called Hyper-V to be installed
      and virtualization enabled in UEFI/BIOS`,
  },
]
