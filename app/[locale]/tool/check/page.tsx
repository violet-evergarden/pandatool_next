'use client'

import { useCallback, useMemo, useState } from 'react'
import { useTranslations } from 'next-intl'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { toast } from 'sonner'
import { Search } from 'lucide-react'

// ============ 常量配置 ============

interface ChainConfig {
  label: string
  value: string
  chainId: number
  name: string
}

const CHAIN_CONFIGS: ChainConfig[] = [
  { label: 'BSC', value: '56', chainId: 56, name: 'BNB Smart Chain' },
  { label: 'Ethereum', value: '1', chainId: 1, name: 'Ethereum' },
  { label: 'Arbitrum', value: '42161', chainId: 42161, name: 'Arbitrum One' },
  { label: 'Base', value: '8453', chainId: 8453, name: 'Base' },
  { label: 'Polygon', value: '137', chainId: 137, name: 'Polygon Network' },
]

const getChainIdOptions = () =>
  CHAIN_CONFIGS.map((c) => ({
    label: c.label,
    value: String(c.chainId),
    chainName: c.label,
  }))

// ============ 工具函数 ============

const isValidEvmAddress = (address: string): boolean => {
  if (!address || typeof address !== 'string') return false
  const trimmed = address.trim()
  const withPrefix = trimmed.startsWith('0x') ? trimmed : `0x${trimmed}`
  return /^0x[0-9a-fA-F]{40}$/.test(withPrefix)
}

const normalizeAddress = (address: string): `0x${string}` => {
  const trimmed = address.trim().toLowerCase()
  return (trimmed.startsWith('0x') ? trimmed : `0x${trimmed}`) as `0x${string}`
}

// ============ 类型定义 ============

type TFunction = (key: string, params?: Record<string, string | number | Date>) => string

interface ContractData {
  chain_name: string
  token_name?: string
  token_symbol?: string
  total_supply?: string
  creator_address?: string
  owner_address?: string
  is_open_source?: string
  buy_tax?: string
  sell_tax?: string
  is_honeypot?: string
  is_mintable?: string
  is_proxy?: string
  trading_cooldown?: string
  transfer_pausable?: string
  is_whitelisted?: string
  is_blacklisted?: string
  selfdestruct?: string
  can_take_back_ownership?: string
  holders?: HolderItem[]
  holder_count?: string
  lp_holders?: MarketInfoItem[]
  lp_holder_count?: string
  dex?: Array<{ name: string; liquidity: string; pair: string }>
  is_panda_tool?: boolean
}

interface BaseInfoItem {
  name: string
  value: string
  tags?: string
  color?: 'success' | 'danger' | 'orange' | 'default'
}

interface SecurityInfoItem {
  name: string
  value: string
  color?: 'success' | 'danger' | 'orange' | 'default'
}

interface HolderItem {
  address: string
  tag: string
  is_contract: number
  balance: string
  percent: string
  is_locked: number
  locked_detail?: Array<{
    amount: string
    end_time: string
    opt_time: string
  }>
}

type MarketInfoItem = HolderItem

// ============ 数据处理函数 ============

function handleBaseInfo(data: ContractData, t: TFunction): BaseInfoItem[] {
  const res: BaseInfoItem[] = []

  res.push({
    name: t('labels.network'),
    value: '',
    tags: data.chain_name,
  })

  if (data.token_name) {
    res.push({
      name: t('labels.tokenName'),
      value: '',
      tags: data.token_name,
    })
  }

  if (data.token_symbol) {
    res.push({
      name: t('labels.tokenSymbol'),
      value: '',
      tags: data.token_symbol,
    })
  }

  if (data.total_supply) {
    res.push({
      name: t('labels.totalSupply'),
      value: '',
      tags: data.total_supply,
    })
  }

  if (data.creator_address) {
    const subAddr =
      data.creator_address.substring(0, 6) +
      '...' +
      data.creator_address.substring(36, 42)
    res.push({
      name: t('labels.creatorAddress'),
      value: data.creator_address,
      tags: subAddr,
    })
  }

  if (data.owner_address) {
    const isRenounced =
      data.owner_address === '0x000000000000000000000000000000000000dead' ||
      data.owner_address === '0x0000000000000000000000000000000000000000' ||
      data.owner_address === ''
    res.push({
      name: t('labels.ownerAddress'),
      value: '',
      tags: isRenounced ? t('values.ownershipRenounced') : t('values.ownershipNotRenounced'),
      color: isRenounced ? 'success' : 'danger',
    })
  }

  if (data.is_open_source) {
    const isOpen = data.is_open_source === '1'
    res.push({
      name: t('labels.isOpenSource'),
      value: '',
      tags: isOpen ? t('values.openSource') : t('values.notOpenSource'),
      color: isOpen ? 'success' : 'danger',
    })
  }

  return res
}

function handleSecurityInfo(data: ContractData, t: TFunction): SecurityInfoItem[] {
  const res: SecurityInfoItem[] = []
  const isPandaTool = data.is_panda_tool || false

  if (data.buy_tax !== undefined) {
    const tax = Number(data.buy_tax) * 100
    res.push({
      name: t('labels.buyTax'),
      value: `${tax}%`,
      color: 'default',
    })
  }

  if (data.sell_tax !== undefined) {
    const tax = Number(data.sell_tax) * 100
    res.push({
      name: t('labels.sellTax'),
      value: `${tax}%`,
      color: 'default',
    })
  }

  if (data.is_honeypot !== undefined) {
    const isHoneypot = data.is_honeypot === '1'
    res.push({
      name: t('labels.isHoneypot'),
      value: isPandaTool ? t('values.safe') : (isHoneypot ? t('values.honeypot') : t('values.safe')),
      color: isPandaTool || !isHoneypot ? 'success' : 'danger',
    })
  }

  if (data.is_mintable !== undefined) {
    const isMintable = data.is_mintable === '1'
    res.push({
      name: t('labels.isMintable'),
      value: isMintable ? t('values.mintable') : t('values.notMintable'),
      color: isMintable ? 'danger' : 'success',
    })
  }

  if (data.is_proxy !== undefined) {
    const isProxy = data.is_proxy === '1'
    res.push({
      name: t('labels.isProxy'),
      value: isProxy ? t('values.proxy') : t('values.notProxy'),
      color: isProxy ? 'danger' : 'success',
    })
  }

  if (data.trading_cooldown !== undefined) {
    const hasCooldown = data.trading_cooldown === '1'
    res.push({
      name: t('labels.tradingCooldown'),
      value: hasCooldown ? t('values.cooldown') : t('values.noCooldown'),
      color: hasCooldown ? 'danger' : 'success',
    })
  }

  if (data.transfer_pausable !== undefined) {
    const isPausable = data.transfer_pausable === '1'
    res.push({
      name: t('labels.transferPausable'),
      value: isPandaTool ? t('values.safe') : (isPausable ? t('values.pausable') : t('values.safe')),
      color: isPandaTool || !isPausable ? 'success' : 'danger',
    })
  }

  if (data.is_whitelisted !== undefined) {
    const hasWhitelist = data.is_whitelisted === '1'
    res.push({
      name: t('labels.isWhitelisted'),
      value: isPandaTool ? t('values.safe') : (hasWhitelist ? t('values.hasWhitelist') : t('values.noWhitelist')),
      color: isPandaTool || !hasWhitelist ? 'success' : 'orange',
    })
  }

  if (data.is_blacklisted !== undefined) {
    const hasBlacklist = data.is_blacklisted === '1'
    res.push({
      name: t('labels.isBlacklisted'),
      value: isPandaTool ? t('values.safe') : (hasBlacklist ? t('values.hasBlacklist') : t('values.noBlacklist')),
      color: isPandaTool || !hasBlacklist ? 'success' : 'orange',
    })
  }

  if (data.selfdestruct !== undefined) {
    const canSelfDestruct = data.selfdestruct === '1'
    res.push({
      name: t('labels.selfDestruct'),
      value: canSelfDestruct ? t('values.canSelfDestruct') : t('values.cannotSelfDestruct'),
      color: canSelfDestruct ? 'danger' : 'success',
    })
  }

  if (data.can_take_back_ownership !== undefined) {
    const canTakeBack = data.can_take_back_ownership === '1'
    res.push({
      name: t('labels.canTakeBackOwnership'),
      value: canTakeBack ? t('values.canTakeBack') : t('values.cannotTakeBack'),
      color: canTakeBack ? 'danger' : 'success',
    })
  }

  return res
}

function handleMarketInfo(data: ContractData): MarketInfoItem[] | null {
  return data.lp_holders || null
}

function handleHolderInfo(data: ContractData): HolderItem[] | null {
  return data.holders || null
}

function getHolderTop10Percent(holders: HolderItem[] | undefined): number {
  if (!holders || holders.length === 0) return 0
  return holders.slice(0, 10).reduce((sum, holder) => sum + Number(holder.percent) * 1, 0) * 100
}

// ============ Badge 颜色 ============

const getBadgeVariant = (color?: string): "default" | "secondary" | "destructive" | "outline" => {
  switch (color) {
    case 'success':
      return 'default'
    case 'danger':
      return 'destructive'
    case 'orange':
      return 'secondary'
    default:
      return 'outline'
  }
}

const getBadgeColorClass = (color?: string): string => {
  switch (color) {
    case 'success':
      return 'bg-green-500 hover:bg-green-600'
    case 'danger':
      return 'bg-red-500 hover:bg-red-600'
    case 'orange':
      return 'bg-yellow-500 hover:bg-yellow-600 text-black'
    default:
      return ''
  }
}

// ============ PDF HTML 生成 ============

function generatePdfHtml(
  data: ContractData,
  baseInfo: BaseInfoItem[],
  securityInfo: SecurityInfoItem[],
  marketInfo: MarketInfoItem[] | null,
  holderInfo: HolderItem[] | null,
  t: TFunction
): string {
  const styles = {
    page: 'font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; font-size: 12px; color: #1a1a1a; background: #fff; padding: 0; line-height: 1.5;',
    header: 'display: flex; align-items: center; justify-content: space-between; padding-bottom: 12px; border-bottom: 1px solid #e5e5e5; margin-bottom: 20px;',
    brand: 'display: flex; align-items: center; gap: 8px; font-size: 14px; font-weight: bold;',
    disclaimer: 'font-size: 10px; color: #888;',
    section: 'margin-bottom: 24px;',
    sectionTitle: 'font-size: 13px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.05em; margin-bottom: 12px; padding-left: 8px; border-left: 3px solid #1a1a1a;',
    grid: 'display: grid; grid-template-columns: 1fr 1fr; gap: 8px;',
    infoRow: 'display: flex; justify-content: space-between; align-items: center; padding: 8px 12px; border: 1px solid #e5e5e5; border-radius: 8px;',
    infoLabel: 'font-size: 11px; color: #666;',
    infoValue: 'font-size: 11px; font-family: monospace; max-width: 60%; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;',
    badge: (color?: string): string => {
      const base = 'display: inline-block; padding: 2px 10px; border-radius: 9999px; font-size: 10px; font-weight: 600;'
      switch (color) {
        case 'success': return base + ' background: #22c55e; color: #fff;'
        case 'danger': return base + ' background: #ef4444; color: #fff;'
        case 'orange': return base + ' background: #eab308; color: #000;'
        default: return base + ' background: #f1f1f1; color: #333;'
      }
    },
    securityRow: 'display: flex; justify-content: space-between; align-items: center; padding: 10px 16px; border-bottom: 1px solid #f0f0f0;',
    securityLabel: 'font-size: 11px; color: #666;',
    table: 'width: 100%; border-collapse: collapse;',
    th: 'text-align: left; padding: 8px 12px; font-size: 10px; color: #888; font-weight: 600; border-bottom: 2px solid #e5e5e5; text-transform: uppercase;',
    td: 'padding: 8px 12px; font-size: 11px; border-bottom: 1px solid #f0f0f0;',
    rank: (index: number): string => {
      const base = 'display: inline-flex; align-items: center; justify-content: center; width: 24px; height: 24px; border-radius: 6px; color: #fff; font-size: 11px; font-weight: 700;'
      return base + (index < 3 ? ' background: #f59e0b;' : ' background: #94a3b8;')
    },
    bar: (width: number, color: string): string => {
      return `height: 6px; border-radius: 9999px; background: ${color}; width: ${Math.min(width, 100)}%;`
    },
    barTrack: 'height: 6px; border-radius: 9999px; background: #f1f1f1; width: 100%;',
    lockTag: 'display: inline-flex; align-items: center; gap: 4px; padding: 2px 8px; border-radius: 6px; background: #ffe4e6; color: #e11d48; font-size: 10px; margin-top: 6px;',
    card: 'border: 1px solid #e5e5e5; border-radius: 12px; padding: 12px 16px; margin-bottom: 8px;',
  }

  // 基本信息
  const basicInfoHtml = baseInfo.map(item => `
    <div style="${styles.infoRow}">
      <span style="${styles.infoLabel}">${item.name}</span>
      ${item.color
        ? `<span style="${styles.badge(item.color)}">${item.tags || item.value}</span>`
        : `<span style="${styles.infoValue}" title="${item.value || item.tags}">${item.tags || item.value}</span>`
      }
    </div>
  `).join('')

  // 安全检测
  const securityHtml = securityInfo.map(item => `
    <div style="${styles.securityRow}">
      <span style="${styles.securityLabel}">${item.name}</span>
      <span style="${styles.badge(item.color)}">${item.value}</span>
    </div>
  `).join('')

  // LP Holders
  let lpHoldersHtml = ''
  if (marketInfo && marketInfo.length > 0) {
    const rows = marketInfo.slice(0, 5).map((item, index) => {
      const percent = (Number(item.percent) * 100).toFixed(2)
      const shortAddr = `${item.address.slice(0, 6)}...${item.address.slice(-4)}`
      const barColor = '#34d399'
      return `
        <div style="${styles.card}">
          <div style="display: flex; align-items: center; gap: 12px;">
            <span style="${styles.rank(index)}">${index + 1}</span>
            <div style="flex: 1;">
              <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 6px;">
                <code style="font-size: 12px;">${shortAddr}</code>
                ${item.tag ? `<span style="font-size: 10px; padding: 1px 6px; border-radius: 9999px; background: #d1fae5; color: #059669;">${item.tag}</span>` : ''}
                ${item.is_contract === 1 ? '<span style="font-size: 10px; padding: 1px 6px; border-radius: 9999px; background: #ede9fe; color: #7c3aed;">Contract</span>' : ''}
              </div>
              <div style="display: flex; align-items: center; gap: 8px;">
                <div style="${styles.barTrack}">
                  <div style="${styles.bar(Number(percent), barColor)}"></div>
                </div>
                <span style="font-size: 11px; font-weight: 600; width: 50px; text-align: right;">${percent}%</span>
              </div>
            </div>
          </div>
        </div>
      `
    }).join('')
    lpHoldersHtml = `
      <div style="${styles.section}">
        <div style="${styles.sectionTitle}">${t('lpHoldersCount', { count: data.lp_holder_count || marketInfo.length })}</div>
        ${rows}
      </div>
    `
  }

  // Token Holders
  let holdersHtml = ''
  if (holderInfo && holderInfo.length > 0) {
    const rows = holderInfo.slice(0, 10).map((item, index) => {
      const percent = (Number(item.percent) * 100).toFixed(2)
      const shortAddr = `${item.address.slice(0, 6)}...${item.address.slice(-4)}`
      const balance = Number(item.balance).toLocaleString('en-US', { maximumFractionDigits: 2 })
      const barColor = index < 3 ? '#f59e0b' : '#3b82f6'
      const lockHtml = item.is_locked === 1 && item.locked_detail && item.locked_detail.length > 0
        ? `<div style="margin-top: 8px; padding-top: 8px; border-top: 1px solid #f0f0f0; display: flex; flex-wrap: wrap; gap: 6px;">
            ${item.locked_detail.map(lock =>
              `<span style="${styles.lockTag}">&#128274; ${t('unlockDate')}: ${lock.end_time.substring(0, 10)}</span>`
            ).join('')}
          </div>`
        : ''
      return `
        <div style="${styles.card}">
          <div style="display: flex; align-items: center; gap: 12px;">
            <span style="${styles.rank(index)}">${index + 1}</span>
            <div style="flex: 1;">
              <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 6px;">
                <code style="font-size: 12px;">${shortAddr}</code>
                ${item.tag ? `<span style="font-size: 10px; padding: 1px 6px; border-radius: 9999px; background: #d1fae5; color: #059669;">${item.tag}</span>` : ''}
                ${item.is_contract === 1 ? '<span style="font-size: 10px; padding: 1px 6px; border-radius: 9999px; background: #ede9fe; color: #7c3aed;">Contract</span>' : ''}
                <span style="margin-left: auto; font-size: 11px; color: #888;">${balance} <span style="color: #555;">${data.token_symbol}</span></span>
              </div>
              <div style="display: flex; align-items: center; gap: 8px;">
                <div style="${styles.barTrack}">
                  <div style="${styles.bar(Number(percent) * 3, barColor)}"></div>
                </div>
                <span style="font-size: 11px; font-weight: 600; width: 50px; text-align: right;">${percent}%</span>
              </div>
            </div>
          </div>
          ${lockHtml}
        </div>
      `
    }).join('')
    holdersHtml = `
      <div style="${styles.section}">
        <div style="${styles.sectionTitle}">${t('holdersCount', { count: data.holder_count || holderInfo.length })}</div>
        ${rows}
      </div>
    `
  }

  return `<!DOCTYPE html>
<html>
<head><meta charset="utf-8"></head>
<body style="${styles.page}">
  <div style="${styles.header}">
    <div style="${styles.brand}">
      <img src="https://pandatool.org/favicon.ico" width="20" height="20" />
      <span>PandaTool</span>
    </div>
    <span style="${styles.disclaimer}">&#9888;&#65039; ${t('disclaimer')}</span>
  </div>

  <div style="${styles.section}">
    <div style="${styles.sectionTitle}">${t('basicInfo')}</div>
    <div style="${styles.grid}">
      ${basicInfoHtml}
    </div>
  </div>

  <div style="${styles.section}">
    <div style="${styles.sectionTitle}">${t('securityInfo')}</div>
    <div style="border: 1px solid #e5e5e5; border-radius: 12px; overflow: hidden;">
      ${securityHtml}
    </div>
  </div>

  ${lpHoldersHtml}
  ${holdersHtml}
</body>
</html>`
}

// ============ 页面组件 ============

export default function ContractCheckPage() {
  const t = useTranslations('check')
  const chainOptions = useMemo(() => getChainIdOptions(), [])

  const [selectedChain, setSelectedChain] = useState('56')
  const [contractAddress, setContractAddress] = useState('0x0E09FaBB73Bd3Ade0a17ECC321fD13a19e81cE82')
  const [data, setData] = useState<ContractData | null>(null)
  const [loading, setLoading] = useState(false)
  const [exporting, setExporting] = useState(false)

  const handleSearch = useCallback(async () => {
    if (!contractAddress.trim()) {
      toast.error(t('errors.invalidAddress'))
      return
    }

    const address = contractAddress.trim()
    if (!isValidEvmAddress(address)) {
      toast.error(t('errors.invalidAddress'))
      return
    }

    const normalizedAddress = normalizeAddress(address)
    setLoading(true)
    setData(null)

    try {
      const res = await fetch(
        `/api/goplus?chainId=${selectedChain}&address=${normalizedAddress}`
      )

      if (!res.ok) {
        throw new Error('Failed to fetch')
      }

      const response = await res.json()

      // GoPlus API 返回格式: { code: 1, message: "OK", result: { [address]: ContractData } }
      if (response.code === 1 && response.result) {
        const addressKey = Object.keys(response.result)[0]
        if (addressKey && response.result[addressKey]) {
          const contractData = response.result[addressKey] as ContractData
          // 添加链名称
          const chainConfig = CHAIN_CONFIGS.find(c => c.chainId === Number(selectedChain))
          contractData.chain_name = chainConfig?.name || selectedChain
          setData(contractData)
          toast.success(t('searchSuccess'))
        } else {
          setData(null)
          toast.error(t('noData'))
        }
      } else {
        setData(null)
        toast.error(t('errors.networkError'))
      }
    } catch (error) {
      console.error('Search error:', error)
      toast.error(t('errors.networkError'))
    } finally {
      setLoading(false)
    }
  }, [selectedChain, contractAddress, t])

  const baseInfo = useMemo(() => data ? handleBaseInfo(data, t) : [], [data, t])
  const securityInfo = useMemo(() => data ? handleSecurityInfo(data, t) : [], [data, t])
  const marketInfo = useMemo(() => data ? handleMarketInfo(data) : null, [data])
  const holderInfo = useMemo(() => data ? handleHolderInfo(data) : null, [data])
  const holderTop10Percent = useMemo(() => data ? getHolderTop10Percent(data.holders) : 0, [data])

  // ============ 导出 PDF（服务端 Puppeteer）============

  const exportPDF = useCallback(async () => {
    if (!data) {
      toast.error(t('errors.exportFailed'))
      return
    }

    setExporting(true)
    try {
      const html = generatePdfHtml(data, baseInfo, securityInfo, marketInfo, holderInfo, t)

      const res = await fetch('/api/generate-pdf', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ html }),
      })

      if (!res.ok) throw new Error('PDF generation failed')

      const blob = await res.blob()
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `【PandaTool】${data.token_symbol || 'contract'}_Report.pdf`
      a.click()
      URL.revokeObjectURL(url)

      toast.success(t('pdfExported'))
    } catch {
      toast.error(t('errors.exportFailed'))
    } finally {
      setExporting(false)
    }
  }, [data, t, baseInfo, securityInfo, marketInfo, holderInfo])

  return (
    <div className="mx-auto max-w-6xl space-y-8 px-4 py-6">
     

      <div className="grid gap-8 xl:grid-cols-12">
        <div className="space-y-6 xl:col-span-8">
          {/* Search Area */}
          <div className="animate-fade-in-delay-1 space-y-5">
            <div className="flex items-center gap-3">
              <div className="h-5 w-1 rounded-full bg-foreground" />
              <h2 className="text-sm font-semibold uppercase tracking-wider">{t('searchContract')}</h2>
            </div>

            <div className="flex flex-col sm:flex-row gap-2">
              <div className="group space-y-2">
                <Label className="text-xs font-medium text-muted-foreground transition-colors group-focus-within:text-foreground">
                  {t('selectChainLabel')}
                </Label>
                <Select value={selectedChain} onValueChange={setSelectedChain}>
                  <SelectTrigger className="w-full sm:w-[140px] h-11 rounded-lg border-border/60">
                    <SelectValue placeholder={t('selectChain')} />
                  </SelectTrigger>
                  <SelectContent>
                    {chainOptions.map((chain) => (
                      <SelectItem key={chain.value} value={chain.value}>
                        {chain.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="group flex-1 space-y-2">
                <Label className="text-xs font-medium text-muted-foreground transition-colors group-focus-within:text-foreground">
                  {t('contractAddressLabel')}
                </Label>
                <Input
                  value={contractAddress}
                  onChange={(e) => setContractAddress(e.target.value)}
                  placeholder={t('searchPlaceholder')}
                  className="h-11 rounded-lg border-border/60 bg-transparent font-mono  transition-all duration-200 focus:border-foreground focus:ring-1 focus:ring-foreground/20"
                />
              </div>
              <div className="flex items-end">
                <Button onClick={handleSearch} disabled={loading} className="w-full sm:w-[130px] h-11">
                  <Search className="w-4 h-4 mr-2" />
                  {loading ? t('searching') : t('search')}
                </Button>
              </div>
            </div>
          </div>

          {/* Results */}
          {data && (
            <>
              {/* <NoticeCard variant="error" title={t('tips')} /> */}

              {/* PDF 导出内容 */}
              <div>
              {/* PDF Header */}
              <div className="flex items-center justify-between border-b border-border/40 pb-3 mb-4">
                <div className="flex items-center gap-2">
                  <img src="/favicon.ico" alt="logo" className="w-6 h-6" />
                  <span className="text-sm font-bold">PandaTool</span>
                </div>
                <span className="text-[10px] text-muted-foreground">&#9888;&#65039; {t('disclaimer')}</span>
              </div>

              <div className="avoid-break space-y-4 py-5">
                <div className="flex items-center gap-3">
                  <div className="h-5 w-1 rounded-full bg-foreground" />
                  <h2 className="text-sm font-semibold uppercase tracking-wider">{t('basicInfo')}</h2>
                </div>
                <div className="grid gap-3 sm:grid-cols-2">
                  {baseInfo.map((item, index) => (
                    <div key={index} className="flex justify-between items-center p-3 rounded-lg border border-border/60 bg-card">
                      <span className="text-xs text-muted-foreground">{item.name}</span>
                      {item.color ? (
                        <Badge variant={getBadgeVariant(item.color)} className={getBadgeColorClass(item.color)}>
                          {item.tags}
                        </Badge>
                      ) : (
                        <span className="text-xs font-mono truncate max-w-[60%]" title={item.tags}>{item.tags}</span>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Security Info - 紧凑列表样式 */}
              <div className="avoid-break space-y-4 py-5">
                <div className="flex items-center gap-3">
                  <div className="h-5 w-1 rounded-full bg-foreground" />
                  <h2 className="text-sm font-semibold uppercase tracking-wider">{t('securityInfo')}</h2>
                </div>
                <div className="overflow-hidden rounded-xl border border-border/40 bg-gradient-to-br from-card via-card to-muted/20">
                  {securityInfo.map((item, index) => {
                    const isSuccess = item.color === 'success'
                    const isDanger = item.color === 'danger'
                    const dotColor = isSuccess ? 'bg-green-500' : (isDanger ? 'bg-red-500' : 'bg-amber-500')
                    const textColor = isSuccess ? 'text-white' : (isDanger ? 'text-white' : 'text-black')

                    return (
                      <div
                        key={index}
                        className={`flex items-center justify-between px-4 py-3 border-b border-border/20 last:border-0 hover:bg-muted/30 transition-colors duration-200 group`}
                      >
                        <span className="text-xs text-muted-foreground flex-1">{item.name}</span>
                        <span className={`px-3 py-1 rounded-full text-[10px] font-medium ${dotColor} ${textColor}`}>
                          {item.value}
                        </span>
                      </div>
                    )
                  })}
                </div>
              </div>

              {/* LP Holders - 现代卡片样式 */}
              {marketInfo && marketInfo.length > 0 && (
                <div className="avoid-break space-y-4 py-5">
                  <div className="flex items-center gap-3">
                    <div className="h-5 w-1 rounded-full bg-foreground" />
                    <h2 className="text-sm font-semibold uppercase tracking-wider">{t('lpHoldersCount', { count: data.lp_holder_count || marketInfo.length })}</h2>
                  </div>
                  <div className="space-y-2">
                    {marketInfo.slice(0, 5).map((item, index) => {
                      const percent = (Number(item.percent) * 100).toFixed(2)
                      const shortAddr = `${item.address.slice(0, 6)}...${item.address.slice(-4)}`
                      const rankColor = index < 3 ? 'from-amber-400 to-orange-500' : 'from-slate-400 to-slate-500'
                      const barColor = 'from-emerald-400 to-teal-400'

                      return (
                        <div
                          key={index}
                          className="group relative overflow-hidden rounded-xl border border-border/40 bg-gradient-to-r from-card via-card to-muted/10 hover:border-border/60 transition-all duration-300"
                        >
                          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-transparent to-muted/5" />

                          <div className="relative p-4">
                            <div className="flex items-center gap-3">
                              {/* 排名徽章 */}
                              <div className={`flex-shrink-0 w-8 h-8 rounded-lg bg-gradient-to-br ${rankColor} flex items-center justify-center shadow-lg`}>
                                <span className="text-white text-sm font-bold">{index + 1}</span>
                              </div>

                              {/* 地址和占比 */}
                              <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-2 mb-1">
                                  <code className="font-mono text-sm text-foreground/90">{shortAddr}</code>
                                  {item.tag && (
                                    <span className="px-2 py-0.5 rounded-full text-[10px] bg-emerald-500/20 text-emerald-400 font-medium">{item.tag}</span>
                                  )}
                                  {item.is_contract === 1 && (
                                    <span className="px-2 py-0.5 rounded-full text-[10px] bg-violet-500/20 text-violet-400 font-medium">Contract</span>
                                  )}
                                </div>

                                {/* 占比进度条 */}
                                <div className="flex items-center gap-3">
                                  <div className="flex-1 h-1.5 rounded-full bg-muted overflow-hidden">
                                    <div
                                      className={`h-full rounded-full bg-gradient-to-r ${barColor} transition-all duration-500`}
                                      style={{ width: `${Math.min(Number(percent), 100)}%` }}
                                    />
                                  </div>
                                  <span className="text-xs font-semibold text-foreground tabular-nums w-14 text-right">{percent}%</span>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      )
                    })}
                  </div>
                </div>
              )}

              {/* Token Holders - 现代卡片样式 */}
              {holderInfo && holderInfo.length > 0 && (
                <div className="avoid-break space-y-4 py-5">
                  <div className="flex items-center gap-3">
                    <div className="h-5 w-1 rounded-full bg-foreground" />
                    <h2 className="text-sm font-semibold uppercase tracking-wider">{t('holdersCount', { count: data.holder_count || holderInfo.length })}</h2>
                  </div>
                  <div className="space-y-2">
                    {holderInfo.slice(0, 10).map((item, index) => {
                      const percent = (Number(item.percent) * 100).toFixed(2)
                      const shortAddr = `${item.address.slice(0, 6)}...${item.address.slice(-4)}`
                      const balance = Number(item.balance).toLocaleString('en-US', { maximumFractionDigits: 2 })
                      const rankColor = index < 3 ? 'from-amber-400 to-orange-500' : 'from-slate-400 to-slate-500'
                      const barColor = index < 3 ? 'from-amber-400 to-orange-500' : 'from-blue-500 to-cyan-400'

                      return (
                        <div
                          key={index}
                          className="group relative overflow-hidden rounded-xl border border-border/40 bg-gradient-to-r from-card via-card to-muted/10 hover:border-border/60 transition-all duration-300"
                        >
                          {/* 排名背景装饰 */}
                          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-transparent to-muted/5" />

                          <div className="relative p-4">
                            <div className="flex items-center gap-3">
                              {/* 排名徽章 */}
                              <div className={`flex-shrink-0 w-8 h-8 rounded-lg bg-gradient-to-br ${rankColor} flex items-center justify-center shadow-lg`}>
                                <span className="text-white text-sm font-bold">{index + 1}</span>
                              </div>

                              {/* 地址和信息 */}
                              <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-2 mb-1">
                                  <code className="font-mono text-sm text-foreground/90">{shortAddr}</code>
                                  {item.tag && (
                                    <span className="px-2 py-0.5 rounded-full text-[10px] bg-emerald-500/20 text-emerald-400 font-medium">{item.tag}</span>
                                  )}
                                  {item.is_contract === 1 && (
                                    <span className="px-2 py-0.5 rounded-full text-[10px] bg-violet-500/20 text-violet-400 font-medium">Contract</span>
                                  )}
                                  {/* 余额移到地址行右侧 */}
                                  <span className="ml-auto text-xs text-muted-foreground tabular-nums">
                                    {balance} <span className="text-foreground/60">{data.token_symbol}</span>
                                  </span>
                                </div>

                                {/* 进度条单独一行 */}
                                <div className="flex items-center gap-3">
                                  <div className="flex-1 h-1.5 rounded-full bg-muted overflow-hidden">
                                    <div
                                      className={`h-full rounded-full bg-gradient-to-r ${barColor} transition-all duration-500`}
                                      style={{ width: `${Math.min(Number(percent) * 3, 100)}%` }}
                                    />
                                  </div>
                                  <span className="text-xs font-semibold text-foreground tabular-nums w-14 text-right">{percent}%</span>
                                </div>
                              </div>
                            </div>

                            {/* 锁仓信息 */}
                            {item.is_locked === 1 && item.locked_detail && item.locked_detail.length > 0 && (
                              <div className="mt-3 pt-3 border-t border-border/30 flex flex-wrap gap-2">
                                {item.locked_detail.map((lock, lockIndex) => (
                                  <span
                                    key={lockIndex}
                                    className="inline-flex items-center gap-1.5 px-2 py-1 rounded-lg bg-rose-500/10 text-rose-400 text-[10px] font-medium"
                                  >
                                    <span className="w-1.5 h-1.5 rounded-full bg-rose-400 animate-pulse" />
                                    {t('unlockDate')}: {lock.end_time.substring(0, 10)}
                                  </span>
                                ))}
                              </div>
                            )}
                          </div>
                        </div>
                      )
                    })}
                  </div>
                </div>
              )}
              </div>
            </>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-6 xl:col-span-4">
          <div className="animate-fade-in-delay-2 rounded-xl border border-border/60 bg-card p-5">
            <h3 className="text-sm font-semibold tracking-wide">{t('summary')}</h3>
            <p className="mt-1 text-[11px] text-muted-foreground">{t('summaryHint')}</p>

            {data && (
              <div className="mt-5 space-y-2">
                <div className="flex items-center justify-between rounded-lg bg-muted/40 px-3 py-2.5">
                  <span className="text-xs text-muted-foreground">{t('labels.network')}</span>
                  <span className="text-xs font-semibold">{data.chain_name}</span>
                </div>
                <div className="flex items-center justify-between rounded-lg bg-muted/40 px-3 py-2.5">
                  <span className="text-xs text-muted-foreground">{t('labels.tokenSymbol')}</span>
                  <span className="text-xs font-semibold">{data.token_symbol || '-'}</span>
                </div>
                <div className="flex items-center justify-between rounded-lg bg-muted/40 px-3 py-2.5">
                  <span className="text-xs text-muted-foreground">{t('holdersLabel')}</span>
                  <span className="text-xs font-semibold">{data.holder_count || holderInfo?.length || 0}</span>
                </div>
                <div className="flex items-center justify-between rounded-lg bg-muted/40 px-3 py-2.5">
                  <span className="text-xs text-muted-foreground">{t('top10Ratio')}</span>
                  <span className="text-xs font-semibold">{holderTop10Percent.toFixed(2)}%</span>
                </div>
              </div>
            )}

            <div className="mt-5">
              <Button
                className="w-full h-12"
                onClick={() => exportPDF()}
                disabled={exporting || !data}
              >
                {exporting ? t('exporting') : t('exportPDF')}
              </Button>
            </div>
          </div>

        </div>
      </div>
    </div>
  )
}
