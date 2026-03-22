'use client'

import { useState, useCallback, useRef, useMemo } from 'react'
import { useTranslations } from 'next-intl'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { toast } from 'sonner'
import { Search, Download, AlertTriangle, CheckCircle, XCircle, Lock } from 'lucide-react'
import { getChainIdOptions, getChainByChainId } from '@/lib/constants/chains'
import { isValidEvmAddress, normalizeAddress } from '@/lib/utils/address'
import {
  handleBaseInfo,
  handleSecurityInfo,
  handleMarketInfo,
  handleHolderInfo,
  getHolderTop10Percent,
  isOwnershipRenounced,
  type ContractData,
} from './_utils/data-processor'

export default function ContractCheckPage() {
  const t = useTranslations('contract-check')
  const chainOptions = useMemo(() => getChainIdOptions(), [])

  const [selectedChain, setSelectedChain] = useState('56')
  const [address, setAddress] = useState('')
  const [loading, setLoading] = useState(false)
  const [exporting, setExporting] = useState(false)
  const [showResult, setShowResult] = useState(false)
  const [data, setData] = useState<ContractData | null>(null)
  const pdfRef = useRef<HTMLDivElement>(null)

  // Check if it's PandaToken
  const checkPandaToken = useCallback(async (addr: string, chainId: string): Promise<boolean> => {
    try {
      const res = await fetch(`/api/etherscan?chainId=${chainId}&address=${addr}&action=getsourcecode`)
      const result = await res.json()
      if (result.result && result.result[0]) {
        return result.result[0].ContractName === 'PandaToken'
      }
    } catch (error) {
      console.error('Error checking PandaToken:', error)
    }
    return false
  }, [])

  // Fetch contract data
  const handleSearch = useCallback(async () => {
    if (!address.trim()) {
      toast.error(t('errors.invalidAddress'))
      return
    }

    const normalizedAddress = normalizeAddress(address.trim())
    if (!isValidEvmAddress(normalizedAddress)) {
      toast.error(t('errors.invalidAddress'))
      return
    }

    setLoading(true)
    setShowResult(false)

    try {
      // Check PandaToken
      const isPandaTool = await checkPandaToken(normalizedAddress, selectedChain)

      // Fetch from GoPlus API via proxy
      const response = await fetch(`/api/goplus?chainId=${selectedChain}&address=${normalizedAddress}`)

      const result = await response.json()

      if (result.code !== 1 || !result.result || Object.keys(result.result).length === 0) {
        toast.error(t('noData'))
        setLoading(false)
        return
      }

      const contractData = result.result[normalizedAddress] as ContractData
      contractData.is_panda_tool = isPandaTool
      contractData.chain_name = getChainByChainId(Number(selectedChain))?.label || ''

      setData(contractData)
      setShowResult(true)
      toast.success(`${t('found')}: ${contractData.token_name || 'Unknown'} (${contractData.token_symbol || 'UNKNOWN'})`)
    } catch (error) {
      console.error('Search error:', error)
      toast.error(t('errors.networkError'))
    } finally {
      setLoading(false)
    }
  }, [address, selectedChain, t, checkPandaToken])

  // Export PDF
  const handleExportPDF = useCallback(async () => {
    if (!showResult || !pdfRef.current) {
      toast.error(t('errors.searchFirst'))
      return
    }

    setExporting(true)

    try {
      // Dynamic import for client-side only
      const html2canvas = (await import('html2canvas')).default
      const { jsPDF } = await import('jspdf')

      const canvas = await html2canvas(pdfRef.current, {
        useCORS: true,
        scale: 1.5,
        scrollY: -window.scrollY,
      })

      const imgData = canvas.toDataURL('image/jpeg', 0.7)
      const pdf = new jsPDF('p', 'mm', 'a4', true)

      const pageWidth = 210
      const pageHeight = 297
      const imgWidth = pageWidth
      const imgHeight = (canvas.height * imgWidth) / canvas.width

      let heightLeft = imgHeight
      let position = 0

      pdf.addImage(imgData, 'JPEG', 0, position, imgWidth, imgHeight)
      heightLeft -= pageHeight

      while (heightLeft > 0) {
        pdf.addPage()
        position = heightLeft - imgHeight
        pdf.addImage(imgData, 'JPEG', 0, position, imgWidth, imgHeight)
        heightLeft -= pageHeight
      }

      const fileName = `[PandaTool]${data?.token_symbol || 'contract'}_Audit_Report.pdf`
      pdf.save(fileName)
      toast.success(t('pdfExported'))
    } catch (error) {
      console.error('Export error:', error)
      toast.error(t('errors.exportFailed'))
    } finally {
      setExporting(false)
    }
  }, [showResult, data, t])

  // Get color classes for badge
  const getBadgeVariant = useCallback((color?: string): "default" | "secondary" | "destructive" | "outline" => {
    switch (color) {
      case 'success':
        return 'default'
      case 'danger':
        return 'destructive'
      case 'warning':
        return 'secondary'
      default:
        return 'outline'
    }
  }, [])

  const getBadgeColorClass = useCallback((color?: string): string => {
    switch (color) {
      case 'success':
        return 'bg-green-500 hover:bg-green-600'
      case 'danger':
        return 'bg-red-500 hover:bg-red-600'
      case 'warning':
        return 'bg-yellow-500 hover:bg-yellow-600 text-black'
      default:
        return ''
    }
  }, [])

  // Process data with memoization
  const baseInfo = useMemo(() => data ? handleBaseInfo(data, t) : [], [data, t])
  const securityInfo = useMemo(() => data ? handleSecurityInfo(data, t) : [], [data, t])
  const marketInfo = useMemo(() => data ? handleMarketInfo(data) : null, [data])
  const holderInfo = useMemo(() => data ? handleHolderInfo(data) : null, [data])
  const holderTop10Percent = useMemo(() => data ? getHolderTop10Percent(data.holders).toFixed(2) : '0.00', [data])
  const ownershipRenounced = useMemo(() => data ? isOwnershipRenounced(data.owner_address) : false, [data])
  const isPandaTool = useMemo(() => data?.is_panda_tool || false, [data])

  return (
    <div className="flex justify-center py-8">
      <Card className="w-full max-w-4xl">
        <CardHeader>
          <CardTitle className="text-center text-2xl">{t('title')}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Tips */}
          <Alert>
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>{t('tips')}</AlertDescription>
          </Alert>

          {/* Search Area */}
          <div className="flex flex-col sm:flex-row gap-2">
            <Select value={selectedChain} onValueChange={setSelectedChain}>
              <SelectTrigger className="w-full sm:w-[140px]">
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
            <Input
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              placeholder={t('searchPlaceholder')}
              className="flex-1"
            />
            <Button onClick={handleSearch} disabled={loading} className="w-full sm:w-[130px]">
              <Search className="w-4 h-4 mr-2" />
              {loading ? t('searching') : t('search')}
            </Button>
          </div>

          {/* Export Button */}
          {showResult && (
            <div className="flex justify-end">
              <Button
                variant="outline"
                onClick={handleExportPDF}
                disabled={exporting || loading}
              >
                <Download className="w-4 h-4 mr-2" />
                {exporting ? t('exporting') : t('exportPDF')}
              </Button>
            </div>
          )}

          {/* PDF Content */}
          {showResult && data && (
            <div ref={pdfRef} className="space-y-4">
              {/* PDF Header */}
              <div className="flex items-center justify-between border-b pb-4">
                <div className="flex items-center gap-3">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src="/favicon.ico" alt="logo" className="w-8 h-8 rounded" />
                  <span className="text-xl font-bold">PandaTool</span>
                </div>
                <div>
                  <div className="text-lg font-semibold">{t('reportTitle')}</div>
                  <div className="text-sm text-muted-foreground">
                    {t('contractAddress')}: {address}
                  </div>
                </div>
              </div>
              <div className="text-xs text-red-500">{t('disclaimer')}</div>

              {/* Basic Info */}
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg">{t('basicInfo')}</CardTitle>
                </CardHeader>
                <CardContent>
                  {baseInfo.map((item, index) => (
                    <div
                      key={index}
                      className="flex justify-between items-center py-2 border-b last:border-b-0"
                    >
                      <span className="text-muted-foreground">{item.name}</span>
                      <Badge
                        variant={getBadgeVariant(item.color)}
                        className={getBadgeColorClass(item.color)}
                      >
                        {item.tags}
                      </Badge>
                    </div>
                  ))}
                </CardContent>
              </Card>

              {/* Security Analysis */}
              <Card className="relative overflow-hidden">
                <div className="absolute inset-0 bg-black/5 z-0" />
                <div className="relative z-10">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg">{t('securityAnalysis')}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    {/* Ownership Status Banner */}
                    <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center z-20">
                      {isPandaTool ? (
                        <div className="flex flex-col items-center">
                          <CheckCircle className="w-12 h-12 text-green-500" />
                          <span className="text-green-600 font-bold mt-2">{t('status.noRiskFound')}</span>
                        </div>
                      ) : ownershipRenounced ? (
                        <div className="flex flex-col items-center">
                          <CheckCircle className="w-12 h-12 text-green-500" />
                          <span className="text-green-600 font-bold mt-2">{t('status.ownershipRenounced')}</span>
                        </div>
                      ) : (
                        <div className="flex flex-col items-center">
                          <XCircle className="w-12 h-12 text-red-500" />
                          <span className="text-red-600 font-bold mt-2">{t('status.ownershipNotRenounced')}</span>
                        </div>
                      )}
                    </div>
                    <div className="opacity-30">
                      {securityInfo.map((item, index) => (
                        <div
                          key={index}
                          className="flex justify-between items-center py-2 border-b last:border-b-0"
                        >
                          <span>{item.name}</span>
                          <Badge
                            variant={getBadgeVariant(item.color)}
                            className={getBadgeColorClass(item.color)}
                          >
                            {item.value}
                          </Badge>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </div>
              </Card>

              {/* LP Information */}
              {marketInfo && marketInfo.length > 0 && (
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg">
                      {t('lpHoldersCount', { count: data.lp_holder_count || marketInfo.length })}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {marketInfo.map((item, index) => (
                      <div key={index} className="border-b pb-3 last:border-b-0">
                        <div className="flex items-start gap-3">
                          <span className="flex-shrink-0 w-6 h-6 rounded-full bg-blue-500 text-white text-xs flex items-center justify-center">
                            {index + 1}
                          </span>
                          <div className="flex-1 space-y-1">
                            <Badge variant="outline" className="font-mono text-xs">
                              {item.address}
                            </Badge>
                            <div className="flex flex-wrap gap-2">
                              <Badge variant="secondary">
                                {Number(item.balance).toFixed(2)} {t('values.lp')}
                              </Badge>
                              <Badge variant="outline">
                                {t('ratio')}: {(Number(item.percent) * 100).toFixed(2)}%
                              </Badge>
                              {item.tag && (
                                <Badge className="bg-green-500">{item.tag}</Badge>
                              )}
                              {item.is_locked === 1 && (
                                <Lock className="w-4 h-4 text-red-500" />
                              )}
                            </div>
                            {item.locked_detail && item.locked_detail.length > 0 && (
                              <div className="flex flex-wrap gap-2 mt-1">
                                {item.locked_detail.map((lock, lockIndex) => (
                                  <Badge key={lockIndex} variant="destructive" className="text-xs">
                                    {t('unlockDate')}: {lock.end_time.substring(0, 10)} | {t('amount')}: {Number(lock.amount).toFixed(2)}
                                  </Badge>
                                ))}
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </CardContent>
                </Card>
              )}

              {/* Holder Information */}
              {holderInfo && holderInfo.length > 0 && (
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg">
                      {t('holdersCount', {
                        hold: data.holder_count || holderInfo.length,
                        p: holderTop10Percent
                      })}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {holderInfo.map((item, index) => (
                      <div key={index} className="border-b pb-3 last:border-b-0">
                        <div className="flex items-start gap-3">
                          <span className="flex-shrink-0 w-6 h-6 rounded-full bg-blue-500 text-white text-xs flex items-center justify-center">
                            {index + 1}
                          </span>
                          <div className="flex-1 space-y-1">
                            <Badge variant="outline" className="font-mono text-xs">
                              {item.address}
                            </Badge>
                            {item.tag && (
                              <Badge className="bg-green-500 mr-2">{item.tag}</Badge>
                            )}
                            <div className="flex flex-wrap gap-2">
                              <Badge variant="secondary">
                                {Number(item.balance).toFixed(2)} {data.token_symbol}
                              </Badge>
                              <Badge variant="outline">
                                {t('ratio')}: {(Number(item.percent) * 100).toFixed(2)}%
                              </Badge>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </CardContent>
                </Card>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
