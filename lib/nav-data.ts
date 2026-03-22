import {
  type LucideIcon,
  Sparkles,
  Wrench,
} from "lucide-react"

export interface Link {
  titleKey: string
  url?: string
  icon?: LucideIcon
  items?: Link[]
}

export interface NavItem extends Link {
  titleKey: string
  url: string
  icon?: LucideIcon
  items?: Link[]
}

export interface NavMain {
  titleKey: string
  url: string
  icon?: LucideIcon
  items?: NavItem[]
}

export interface NavData {
  navMain: NavMain[]
}

export const navData: NavData = {
  navMain: [
    {
      titleKey: "examples",
      url: "/examples",
      icon: Sparkles,
      items: [
        {
          titleKey: "uiComponents",
          url: "/examples",
        },
        {
          titleKey: "ethersAdapter",
          url: "/examples/ethers-adapter",
        },
      ],
    },
    {
      titleKey: "tool",
      url: "/tool",
      icon: Wrench,
      items: [
        {
          titleKey: "logo",
          url: "/tool/logo",
        },
        {
          titleKey: "snapshotToken",
          url: "/tool/snapshot-token",
        },
      ],
    },
  ],
}
