import {
  type LucideIcon,
  LayoutDashboard,
  FolderKanban,
  BarChart3,
  Settings,
  Frame,
  Map,
  PieChart,
  Briefcase,
  Sparkles,
} from "lucide-react"

export interface Link {
  titleKey: string  // 翻译键
  url?: string
  icon?: LucideIcon
  isActive?: boolean
  items?: Link[]
}

export interface NavItem extends Link {
  titleKey: string
  url: string
  icon?: LucideIcon
  isActive?: boolean
  items?: Link[]
}

export interface NavMain {
  titleKey: string
  url: string
  icon?: LucideIcon
  isActive?: boolean
  items?: NavItem[]
}

export interface NavProject {
  nameKey: string
  url: string
  icon?: LucideIcon
}

export interface Team {
  nameKey: string
  logo: LucideIcon
  planKey: string
}

export interface User {
  name: string
  email: string
  avatar: string
}

export interface NavLink {
  titleKey: string
  href: string
}

export interface NavData {
  user: User
  teams: Team[]
  navMain: NavMain[]
  projects: NavProject[]
}

export const navData: NavData = {
  user: {
    name: "Jane Doe",
    email: "jane@example.com",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Jane",
  },
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
  projects: [
    {
      nameKey: "ecommercePlatform",
      url: "/projects/ecommerce",
      icon: PieChart,
    },
    {
      nameKey: "mobileApp",
      url: "/projects/mobile",
      icon: FolderKanban,
    },
    {
      nameKey: "marketingSite",
      url: "/projects/marketing",
      icon: Map,
    },
  ],
}
