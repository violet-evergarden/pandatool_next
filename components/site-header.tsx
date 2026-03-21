'use client'

import { useAccount, useConnect, useDisconnect, useSwitchChain } from 'wagmi'
import { useTranslations } from 'next-intl'
import { useSyncExternalStore } from 'react'
import { Wallet, ChevronDown } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { LocaleSwitcher } from '@/components/locale-switcher'
import { SidebarTrigger } from '@/components/ui/sidebar'
import { Separator } from '@/components/ui/separator'
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
} from '@/components/ui/breadcrumb'
import { usePathname } from 'next/navigation'

// 使用 useSyncExternalStore 检测客户端环境，避免水合错误
const emptySubscribe = () => () => {}
const getSnapshot = () => true
const getServerSnapshot = () => false

// 面包屑导航
function HeaderBreadcrumb() {
  const pathname = usePathname()
  const t = useTranslations('navigation.menu')

  // 从路径中提取面包屑
  const getPathSegments = () => {
    // 移除 locale 前缀
    const pathWithoutLocale = pathname.replace(/^\/(zh|en)/, '') || '/'
    const segments = pathWithoutLocale.split('/').filter(Boolean)

    if (segments.length === 0) {
      return [{ label: t('dashboard'), href: '/' }]
    }

    return segments.map((segment, index) => {
      const href = '/' + segments.slice(0, index + 1).join('/')
      // 尝试翻译，如果没有则使用原始文本
      const label = t(segment as never) || segment
      return { label, href }
    })
  }

  const segments = getPathSegments()
  const isClient = useSyncExternalStore(emptySubscribe, getSnapshot, getServerSnapshot)

  if (!isClient) {
    return <div className="h-6 w-32 bg-muted animate-pulse rounded" />
  }

  return (
    <Breadcrumb>
      <BreadcrumbList>
        {segments.map((segment, index) => (
          <BreadcrumbItem key={segment.href}>
            {index === segments.length - 1 ? (
              <BreadcrumbPage className="font-medium">
                {segment.label}
              </BreadcrumbPage>
            ) : (
              <BreadcrumbLink href={segment.href}>
                {segment.label}
              </BreadcrumbLink>
            )}
          </BreadcrumbItem>
        ))}
      </BreadcrumbList>
    </Breadcrumb>
  )
}

// 网络切换器
function NetworkSwitcher() {
  const { chain } = useAccount()
  const { switchChain, chains, isPending } = useSwitchChain()
  const t = useTranslations('network')

  const isClient = useSyncExternalStore(emptySubscribe, getSnapshot, getServerSnapshot)
  const displayText = isClient ? (chain?.name ?? t('selectNetwork')) : t('selectNetwork')

  // 获取链的颜色
  const getChainColor = (chainId?: number) => {
    const colors: Record<number, string> = {
      1: 'bg-blue-500',      // Ethereum
      137: 'bg-purple-500',  // Polygon
      42161: 'bg-sky-500',   // Arbitrum
      10: 'bg-red-500',      // Optimism
      8453: 'bg-blue-600',   // Base
    }
    return chainId ? colors[chainId] || 'bg-gray-500' : 'bg-gray-400'
  }

  // 服务端渲染时使用默认颜色，避免水合错误
  const chainColor = isClient ? getChainColor(chain?.id) : 'bg-gray-400'

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          disabled={isPending}
          className="gap-2 min-w-[120px] justify-start"
        >
          <span className={`w-2 h-2 rounded-full ${chainColor}`} />
          <span className="truncate">{displayText}</span>
          <ChevronDown className="h-4 w-4 ml-auto opacity-50" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-[180px]">
        <DropdownMenuLabel>{t('switchNetwork')}</DropdownMenuLabel>
        <DropdownMenuSeparator />
        {chains?.map((c) => (
          <DropdownMenuItem
            key={c.id}
            onClick={() => switchChain?.({ chainId: c.id })}
            disabled={c.id === chain?.id}
            className="gap-2"
          >
            <span className={`w-2 h-2 rounded-full ${getChainColor(c.id)}`} />
            {c.name}
            {c.id === chain?.id && (
              <span className="ml-auto text-xs text-muted-foreground">✓</span>
            )}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

// 钱包按钮
function WalletButton() {
  const { address, isConnected } = useAccount()
  const { connect, connectors, isPending: connectPending } = useConnect()
  const { disconnect } = useDisconnect()
  const t = useTranslations('wallet')

  const isClient = useSyncExternalStore(emptySubscribe, getSnapshot, getServerSnapshot)

  const truncatedAddress = address
    ? `${address.slice(0, 6)}...${address.slice(-4)}`
    : ''

  const showConnected = isClient && isConnected

  if (!showConnected) {
    return (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button size="sm" disabled={connectPending} className="gap-2">
            <Wallet className="h-4 w-4" />
            {connectPending ? t('connecting') : t('connect')}
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-50">
          <DropdownMenuLabel>{t('selectConnector')}</DropdownMenuLabel>
          <DropdownMenuSeparator />
          {connectors.map((connector) => (
            <DropdownMenuItem
              key={connector.uid}
              onClick={() => connect({ connector })}
              disabled={connectPending}
              className="cursor-pointer"
            >
              {connector.name}
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
    )
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="secondary" size="sm" className="gap-2">
          <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
          <code className="text-xs font-mono">{truncatedAddress}</code>
          <ChevronDown className="h-4 w-4 opacity-50" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-[200px]">
        <DropdownMenuLabel className="font-mono text-xs text-muted-foreground">
          {address}
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={() => disconnect()} className="cursor-pointer text-red-500 focus:text-red-500">
          {t('disconnect')}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/60">
      <div className="flex h-14 items-center px-4 lg:px-6">
        {/* 左侧：侧边栏触发器 + 面包屑 */}
        <div className="flex items-center gap-2 flex-1">
          <SidebarTrigger className="-ml-1" />
          <Separator orientation="vertical" className="h-6 mr-2" />
          <HeaderBreadcrumb />
        </div>

        {/* 右侧：操作按钮 */}
        <div className="flex items-center gap-2">
          <LocaleSwitcher />
          <Separator orientation="vertical" className="h-6 mx-1" />
          <NetworkSwitcher />
          <WalletButton />
        </div>
      </div>
    </header>
  )
}
