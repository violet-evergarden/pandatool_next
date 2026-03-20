import { type LucideIcon } from "lucide-react"

export interface Link {
  title: string
  url?: string
  icon?: LucideIcon
  isActive?: boolean
  items?: Link[]
}

export interface NavItem extends Link {
  title: string
  url: string
  icon?: LucideIcon
  isActive?: boolean
  items?: Link[]
}

export interface NavMain {
  title: string
  url: string
  icon?: LucideIcon
  isActive?: boolean
  items?: NavItem[]
}

export interface NavProject {
  name: string
  url: string
  icon?: LucideIcon
}

export interface Team {
  name: string
  logo: LucideIcon | string
  plan: string
}

export interface User {
  name: string
  email: string
  avatar: string
}

export interface NavLink {
  title: string
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
      name: "Acme Inc",
      logo: "Acme",
      plan: "Enterprise",
    },
    {
      name: "Monsters Inc",
      logo: "Monsters",
      plan: "Startup",
    },
    {
      name: "Stark Industries",
      logo: "Stark",
      plan: "Pro",
    },
  ],
  navMain: [
    {
      title: "Dashboard",
      url: "/dashboard",
      isActive: true,
    },
    {
      title: "Projects",
      url: "/projects",
      items: [
        {
          title: "Active Projects",
          url: "/projects/active",
        },
        {
          title: "Archived",
          url: "/projects/archived",
        },
      ],
    },
    {
      title: "Analytics",
      url: "/analytics",
      items: [
        {
          title: "Overview",
          url: "/analytics/overview",
        },
        {
          title: "Reports",
          url: "/analytics/reports",
        },
        {
          title: "Real-time",
          url: "/analytics/realtime",
        },
      ],
    },
    {
      title: "Settings",
      url: "/settings",
      items: [
        {
          title: "General",
          url: "/settings/general",
        },
        {
          title: "Team",
          url: "/settings/team",
        },
        {
          title: "Billing",
          url: "/settings/billing",
        },
      ],
    },
  ],
  projects: [
    {
      name: "E-commerce Platform",
      url: "/projects/ecommerce",
    },
    {
      name: "Mobile App",
      url: "/projects/mobile",
    },
    {
      name: "Marketing Site",
      url: "/projects/marketing",
    },
  ],
}
