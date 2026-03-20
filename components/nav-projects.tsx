"use client"

import { type LucideIcon, Plus } from "lucide-react"
import { useTranslations } from 'next-intl'
import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"

export interface NavProject {
  nameKey: string
  url: string
  icon?: LucideIcon
}

export function NavProjects({
  projects,
}: {
  projects: NavProject[]
}) {
  const t = useTranslations('navigation.menu')

  return (
    <SidebarGroup className="group-data-[collapsible=icon]:hidden">
      <SidebarGroupLabel>{t('projects')}</SidebarGroupLabel>
      <SidebarMenu>
        {projects.map((project) => (
          <SidebarMenuItem key={project.nameKey}>
            <SidebarMenuButton asChild tooltip={t(project.nameKey)}>
              <a href={project.url}>
                {project.icon && <project.icon />}
                <span>{t(project.nameKey)}</span>
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
        ))}
        <SidebarMenuItem>
          <SidebarMenuButton tooltip={t('addProject')}>
            <Plus />
            <span>{t('addProject')}</span>
          </SidebarMenuButton>
        </SidebarMenuItem>
      </SidebarMenu>
    </SidebarGroup>
  )
}
