'use client'

import { useState, useCallback } from 'react'
import { useTranslations } from 'next-intl'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { toast } from 'sonner'
import { Search, Download, ExternalLink } from 'lucide-react'

// 链选项配置
const CHAIN_OPTIONS = [
  { label: 'BSC', value: 'bsc', chainId: 56 },
  { label: 'Ethereum', value: 'eth', chainId: 1 },
  { label: 'Base', value: 'base', chainId: 8453 },
  { label: 'Polygon', value: 'polygon', chainId: 137 },
  { label: 'Arbitrum', value: 'arbitrum', chainId: 42161 },
]

// 快速选项
const QUICK_OPTIONS = [
  { label: 'TOP100', value: 100 },
  { label: 'TOP500', value: 500 },
  { label: 'TOP1,000', value: 1000 },
  { label: 'TOP2,000', value: 2000 },
  { label: 'TOP5,000', value: 5000 },
  { label: 'TOP10,000', value: 10000 },
]

// Moralis API Key
const MORALIS_API_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJub25jZSI6IjE3OGJiYjZlLTcyYTEtNDc0OC04MTllLWRiMWY5OTUxOTNmOSIsIm9yZ0lkIjoiNDY3MTA2IiwidXNlcklkIjoiNDgwNTQzIiwidHlwZUlkIjoiZjMxMWU5MzAtNTY0Mi00OGU1LTllMjctNjhhMmMzY2NmMGUwIiwidHlwzSI6IlBST0pFQ1QiLCJpYXQiOiJ3NTY0'

interface TokenStats {
  name: string
  symbol: string
  holders: number | null
}

export default function SnapshotTokenPage() {
  const t = useTranslations('snapshot-token')
  const locale = typeof window !== 'undefined' ? 'en' : 'zh'

  const [selectedChain, setSelectedChain] = useState('bsc')
  const [tokenAddress, setTokenAddress] = useState('')
  const [tokenStats, setTokenStats] = useState<TokenStats | null>(null)
  const [showConfig, setShowConfig] = useState(false)
  const [loading, setLoading] = useState(false)
  const [exporting, setExporting] = useState(false)

  // 快照配置
  const [quickSelected, setQuickSelected] = useState(500)
  const [quickCustom, setQuickCustom] = useState(500)
  const [minHolding, setMinHolding] = useState<number | undefined>(undefined)
  const [exportFormat, setExportFormat] = useState<'csv' | 'txt'>('txt')

  // 吜索 Token
  const handleSearch = useCallback(async () => {
    if (!tokenAddress.trim()) {
      toast.error(t('errors.invalidAddress'))
      return
    }

    // 验证地址格式
    const address = tokenAddress.trim()
    if (!/^(0x)?[0-9a-fA-F]{40}$/i.test(address)) {
      toast.error(t('errors.invalidAddress'))
      return
    }

    setLoading(true)

    try {
      // 获取持有者数量
      const holdersResponse = await fetch(
        `https://deep-index.moralis.io/api/v2.2/erc20/${tokenAddress.trim()}/holders?chain=${selectedChain}`,
        {
          method: 'GET',
          headers: {
            accept: 'application/json',
            'X-API-Key': MORALIS_API_KEY,
          },
        }
      )

      if (!holdersResponse.ok) {
        throw new Error('Failed to fetch holders')
      }

      const holdersData = await holdersResponse.json()

      // 获取 Token 元数据
      const metadataResponse = await fetch(
        `https://deep-index.moralis.io/api/v2.2/erc20/metadata?addresses=${tokenAddress.trim()}&chain=${selectedChain}`,
        {
          method: 'GET',
          headers: {
            accept: 'application/json',
            'X-API-Key': MORALIS_API_KEY,
          },
        }
      )

      let name = 'Unknown'
      let symbol = 'UNKNOWN'

      if (metadataResponse.ok) {
        const metadata = await metadataResponse.json()
        if (metadata && metadata[0]) {
          name = metadata[0].name || 'Unknown'
          symbol = metadata[0].symbol || 'UNKNOWN'
        }
      }

      const holders = holdersData.totalHolders || 0

      setTokenStats({ name, symbol, holders })
      setShowConfig(true)
      toast.success(`Found: ${name} (${symbol}) - ${holders} holders`)
    } catch (error) {
      console.error('Search error:', error)
      toast.error(t('errors.networkError'))
    } finally {
      setLoading(false)
    }
  }, [selectedChain, tokenAddress, t])

  // 执行快照
  const handleSnapshot = useCallback(async () => {
    const topCount = quickCustom || 0
    if (topCount <= 0 || topCount > 10000) {
      toast.error(t('errors.invalidTop'))
      return
    }

    setExporting(true)

    try {
      const exportData: Array<{ address: string; amount: string }> = []
      const baseUrl = `https://deep-index.moralis.io/api/v2.2/erc20/${tokenAddress.trim()}/owners?chain=${selectedChain}&order=DESC`
      let cursor = ''
      let remaining = topCount

      // 分页获取数据
      while (remaining > 0) {
        const pageSize = Math.min(100, remaining)
        const pageUrl = `${baseUrl}&page_size=${pageSize}${cursor ? `&cursor=${encodeURIComponent(cursor)}` : ''}`

        const response = await fetch(pageUrl, {
          method: 'GET',
          headers: {
            accept: 'application/json',
            'X-API-Key': MORALIS_API_KEY,
          },
        })

        if (!response.ok) {
          throw new Error(`HTTP ${response.status}`)
        }

        const data = await response.json()
        const list = Array.isArray(data.result) ? data.result : []

        for (let i = 0; i < list.length && exportData.length < topCount; i++) {
          exportData.push({
            address: list[i].owner_address,
            amount: list[i].balance_formatted,
          })
        }

        remaining = Math.max(0, topCount - exportData.length)

        if (!data.cursor || list.length === 0) {
          break
        }
        cursor = data.cursor
      }

      // 生成文件
      const timestamp = new Date().toISOString().slice(0, 19).replace(/[:T]/g, '-')
      const fileNameBase = `${tokenStats?.symbol || 'token'}_holders_${selectedChain}_${timestamp}`

      if (exportFormat === 'csv') {
        const csv = buildCsv(exportData)
        downloadFile(csv, `${fileNameBase}.csv`, 'text/csv;charset=utf-8;')
      } else {
        const txt = buildTxt(exportData)
        downloadFile(txt, `${fileNameBase}.txt`, 'text/plain;charset=utf-8;')
      }

      toast.success(`Exported ${exportData.length} holders`)
    } catch (error) {
      console.error('Snapshot error:', error)
      toast.error(t('errors.networkError'))
    } finally {
      setExporting(false)
    }
  }, [selectedChain, tokenAddress, quickCustom, exportFormat, tokenStats, t])

  // 构建 CSV 内容
  function buildCsv(rows: Array<{ address: string; amount: string }>): string {
    const header = ['address', 'amount']
    const lines = [header.join(',')]

    for (const row of rows) {
      const safe = (val: string) => {
        const s = String(val).replace(/"/g, '""')
        return /[",\n]/.test(s) ? `"${s}"` : s
      }
      lines.push([safe(row.address || ''), safe(row.amount || '')].join(','))
    }

    // 加 UTF-8 BOM，防止 Excel 中文乱码
    return '\uFEFF' + lines.join('\n')
  }

  // 构建 TXT 内容
  function buildTxt(rows: Array<{ address: string; amount: string }>): string {
    return rows
      .map((row) => `${row.address || ''},${row.amount != null ? row.amount : ''}`)
      .join('\n')
  }

  // 下载文件
  function downloadFile(content: string, filename: string, mime: string): void {
    const blob = new Blob([content], { type: mime })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = filename
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  // 帮助链接
  const helpLink = locale === 'zh' ? t('helpLinkZh') : t('helpLinkEn')

  return (
    <div className="flex justify-center py-8">
      <Card className="w-full max-w-3xl">
        <CardHeader>
          <CardTitle className="text-center text-2xl">{t('title')}</CardTitle>
          <p className="text-center">
            <a
              href={helpLink}
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary hover:underline inline-flex items-center gap-1"
            >
              {t('tutorial')}
              <ExternalLink className="w-4 h-4" />
            </a>
          </p>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* 搜索区域 */}
          <div className="flex flex-col sm:flex-row gap-2">
            <Select value={selectedChain} onValueChange={setSelectedChain}>
              <SelectTrigger className="w-full sm:w-[140px]">
                <SelectValue placeholder={t('selectPlaceholder')} />
              </SelectTrigger>
              <SelectContent>
                {CHAIN_OPTIONS.map((chain) => (
                  <SelectItem key={chain.value} value={chain.value}>
                    {chain.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Input
              value={tokenAddress}
              onChange={(e) => setTokenAddress(e.target.value)}
              placeholder={t('searchPlaceholder')}
              className="flex-1"
            />
            <Button onClick={handleSearch} disabled={loading} className="w-full sm:w-[130px]">
              <Search className="w-4 h-4 mr-2" />
              {loading ? '...' : t('search')}
            </Button>
          </div>

          {/* 统计信息 */}
          {tokenStats && (
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <Card>
                <CardContent className="pt-4">
                  <div className="text-sm text-muted-foreground">{t('tokenName')}</div>
                  <div className="text-lg font-semibold truncate">{tokenStats.name || '?'}</div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="pt-4">
                  <div className="text-sm text-muted-foreground">{t('tokenSymbol')}</div>
                  <div className="text-lg font-semibold">{tokenStats.symbol || '?'}</div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="pt-4">
                  <div className="text-sm text-muted-foreground">{t('holders')}</div>
                  <div className="text-lg font-semibold">{tokenStats.holders?.toLocaleString() || '?'}</div>
                </CardContent>
              </Card>
            </div>
          )}

          {/* 配置区域 */}
          {showConfig && tokenStats && (
            <>
              {/* 快速筛选 */}
              <div>
                <div className="font-semibold mb-2">
                  {t('quickFilter')}
                  <span className="text-muted-foreground text-sm ml-1">{t('maxHint')}</span>
                </div>
                <div className="flex flex-wrap gap-2 mb-2">
                  {QUICK_OPTIONS.map((opt) => (
                    <Button
                      key={opt.value}
                      variant={quickSelected === opt.value ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => {
                        setQuickSelected(opt.value)
                        setQuickCustom(opt.value)
                      }}
                    >
                      {opt.label}
                    </Button>
                  ))}
                  <Input
                    type="number"
                    min={1}
                    max={10000}
                    value={quickCustom}
                    onChange={(e) => setQuickCustom(Number(e.target.value))}
                    placeholder="1-10000"
                    className="w-full sm:w-[200px]"
                  />
                </div>
              </div>

              {/* 最小持有量 */}
              <div>
                <div className="font-semibold mb-2">{t('customMinHolding')}</div>
                <Input
                  type="number"
                  min={0}
                  value={minHolding ?? ''}
                  onChange={(e) => setMinHolding(e.target.value ? Number(e.target.value) : undefined)}
                  placeholder="10"
                  className="w-full sm:w-[200px]"
                />
              </div>

              {/* 导出格式 */}
              <div>
                <div className="font-semibold mb-2">{t('exportFormat')}</div>
                <div className="flex gap-2">
                  <Button
                    variant={exportFormat === 'csv' ? 'default' : 'outline'}
                    onClick={() => setExportFormat('csv')}
                  >
                    {t('csv')}
                  </Button>
                  <Button
                    variant={exportFormat === 'txt' ? 'default' : 'outline'}
                    onClick={() => setExportFormat('txt')}
                  >
                    {t('txt')}
                  </Button>
                </div>
              </div>

              {/* 快照按钮 */}
              <Button
                className="w-full h-12 text-lg"
                onClick={handleSnapshot}
                disabled={exporting}
              >
                <Download className="w-5 h-5 mr-2" />
                {exporting ? 'Processing...' : t('snapshotNow')}
              </Button>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
