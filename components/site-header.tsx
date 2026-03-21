'use client'

import { useAccount, useConnect, useDisconnect, useSwitchChain } from 'wagmi'
import { useTranslations } from 'next-intl'
import { useSyncExternalStore } from 'react'
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

// 使用 useSyncExternalStore 检测客户端环境，避免水合错误
const emptySubscribe = () => () => {}
const getSnapshot = () => true
const getServerSnapshot = () => false

function NetworkSwitcher() {
  const { chain } = useAccount()
  const { switchChain, chains, isPending } = useSwitchChain()
  const t = useTranslations('network')

  // 检测是否在客户端
  const isClient = useSyncExternalStore(emptySubscribe, getSnapshot, getServerSnapshot)

  // 服务端渲染时显示占位文本，客户端渲染时显示实际值
  const displayText = isClient ? (chain?.name ?? t('selectNetwork')) : t('selectNetwork')

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="sm" disabled={isPending}>
          {displayText}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuLabel>{t('switchNetwork')}</DropdownMenuLabel>
        <DropdownMenuSeparator />
        {chains?.map((c) => (
          <DropdownMenuItem
            key={c.id}
            onClick={() => switchChain?.({ chainId: c.id })}
            disabled={c.id === chain?.id}
          >
            {c.name}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

function WalletButton() {
  const { address, isConnected } = useAccount()
  const { connect, connectors, isPending: connectPending } = useConnect()
  const { disconnect } = useDisconnect()
  const t = useTranslations('wallet')

  // 检测是否在客户端
  const isClient = useSyncExternalStore(emptySubscribe, getSnapshot, getServerSnapshot)

  // 截断地址显示
  const truncatedAddress = address
    ? `${address.slice(0, 6)}...${address.slice(-4)}`
    : ''

  // 服务端渲染时始终显示未连接状态，客户端渲染时显示实际状态
  const showConnected = isClient && isConnected

  if (!showConnected) {
    return (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button size="sm" disabled={connectPending}>
            {connectPending ? t('connecting') : t('connect')}
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuLabel>{t('selectConnector')}</DropdownMenuLabel>
          <DropdownMenuSeparator />
          {connectors.map((connector) => (
            <DropdownMenuItem
              key={connector.uid}
              onClick={() => connect({ connector })}
              disabled={connectPending}
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
        <Button variant="secondary" size="sm">
          {truncatedAddress}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuLabel>{t('options')}</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={() => disconnect()}>
          {t('disconnect')}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/60">
      <div className="container flex h-14 items-center justify-between">
        <div className="flex items-center gap-2">
          <SidebarTrigger />
          <Separator orientation="vertical" className="h-6" />
          <h1 className="text-xl font-bold">Panda Tool</h1>
        </div>
        <div className="flex items-center gap-2">
          <LocaleSwitcher />
          <NetworkSwitcher />
          <WalletButton />
        </div>
      </div>
    </header>
  )
}
