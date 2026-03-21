import {
  type LucideIcon,
  LayoutDashboard,
  FolderKanban,
  BarChart3,
  Settings,
  Frame,
  Map,
  Briefcase,
  Sparkles,
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

export interface Team {
  nameKey: string
  logo: LucideIcon
  planKey: string
}

export interface NavData {
  teams: Team[]
  navMain: NavMain[]
}

export const navData: NavData = {
  teams: [
    {
      nameKey: "acmeInc",
      logo: Frame,
      planKey: "enterprise",
    },
    {
      nameKey: "monstersInc",
      logo: Briefcase,
      planKey: "startup",
    },
    {
      nameKey: "starkIndustries",
      logo: Map,
      planKey: "pro",
    },
  ],
  navMain: [
    {
      titleKey: "dashboard",
      url: "/dashboard",
      icon: LayoutDashboard,
    },
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
      titleKey: "projects",
      url: "/projects",
      icon: FolderKanban,
      items: [
        {
          titleKey: "activeProjects",
          url: "/projects/active",
        },
        {
          titleKey: "archived",
          url: "/projects/archived",
        },
      ],
    },
    {
      titleKey: "analytics",
      url: "/analytics",
      icon: BarChart3,
      items: [
        {
          titleKey: "overview",
          url: "/analytics/overview",
        },
        {
          titleKey: "reports",
          url: "/analytics/reports",
        },
        {
          titleKey: "realtime",
          url: "/analytics/realtime",
        },
      ],
    },
    {
      titleKey: "settings",
      url: "/settings",
      icon: Settings,
      items: [
        {
          titleKey: "general",
          url: "/settings/general",
        },
        {
          titleKey: "team",
          url: "/settings/team",
        },
        {
          titleKey: "billing",
          url: "/settings/billing",
        },
      ],
    },
  ],
}
