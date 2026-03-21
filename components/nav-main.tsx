"use client"

import { type LucideIcon, ChevronRight } from "lucide-react"
import { useTranslations } from 'next-intl'
import { usePathname } from 'next/navigation'
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible"
import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
} from "@/components/ui/sidebar"

export interface NavMainItem {
  titleKey: string
  url: string
  icon?: LucideIcon
  items?: {
    titleKey: string
    url: string
  }[]
}

export function NavMain({
  items,
}: {
  items: NavMainItem[]
}) {
  const t = useTranslations('navigation.menu')
  const pathname = usePathname()

  // 检查路径是否匹配（移除 locale 前缀后比较）
  const isPathActive = (url: string) => {
    // pathname 格式: /zh/examples/ethers-adapter
    // url 格式: /examples 或 /examples/ethers-adapter
    return pathname === url || pathname.startsWith(url + '/')
  }

  // 检查菜单项是否 active（包括子菜单）
  const isItemActive = (item: NavMainItem) => {
    if (isPathActive(item.url)) return true
    if (item.items?.some(subItem => isPathActive(subItem.url))) return true
    return false
  }

  return (
    <SidebarGroup>
      <SidebarGroupLabel>{t('platform')}</SidebarGroupLabel>
      <SidebarMenu>
        {items.map((item) => {
          const hasSubItems = item.items && item.items.length > 0
          const title = t(item.titleKey)
          const isActive = isItemActive(item)

          // 没有子菜单的简单菜单项
          if (!hasSubItems) {
            return (
              <SidebarMenuItem key={item.titleKey}>
                <SidebarMenuButton tooltip={title} asChild isActive={isActive}>
                  <a href={item.url}>
                    {item.icon && <item.icon />}
                    <span>{title}</span>
                  </a>
                </SidebarMenuButton>
              </SidebarMenuItem>
            )
          }

          // 有子菜单的可折叠菜单项
          return (
            <Collapsible
              key={item.titleKey}
              asChild
              defaultOpen={isActive}
              className="group/collapsible"
            >
              <SidebarMenuItem>
                <CollapsibleTrigger asChild>
                  <SidebarMenuButton tooltip={title} isActive={isActive}>
                    {item.icon && <item.icon />}
                    <span>{title}</span>
                    <ChevronRight className="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
                  </SidebarMenuButton>
                </CollapsibleTrigger>
                <CollapsibleContent>
                  <SidebarMenuSub>
                    {item.items?.map((subItem) => (
                      <SidebarMenuSubItem key={subItem.titleKey}>
                        <SidebarMenuSubButton asChild isActive={isPathActive(subItem.url)}>
                          <a href={subItem.url}>
                            <span>{t(subItem.titleKey)}</span>
                          </a>
                        </SidebarMenuSubButton>
                      </SidebarMenuSubItem>
                    ))}
                  </SidebarMenuSub>
                </CollapsibleContent>
              </SidebarMenuItem>
            </Collapsible>
          )
        })}
      </SidebarMenu>
    </SidebarGroup>
  )
}
