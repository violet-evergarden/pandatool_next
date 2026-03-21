'use client'

import { useState, useCallback, useEffect } from 'react'
import { useTranslations } from 'next-intl'
import { useAccount, useWriteContract, useWaitForTransactionReceipt, useReadContract } from 'wagmi'
import { formatUnits } from 'viem'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { LogoUploader } from './_components/logo-uploader'
import { toast } from 'sonner'
import { Copy, CheckCircle, AlertTriangle, ExternalLink, MessageCircle } from 'lucide-react'

// 平台选项配置
const PLATFORM_OPTIONS = [
  { label: 'AVE', value: 'AVE', price: 300 },
  { label: 'TokenPocket (TP)', value: 'TokenPocket', price: 1400 },
  { label: 'Bitget Wallet', value: 'Bitget', price: 500 },
  { label: 'OKX Wallet', value: 'OKX', price: 500 },
  { label: 'Dexscreener', value: 'Dexscreener', price: 400 },
  { label: 'CoinGecko', value: 'CoinGecko', price: 1500 },
  { label: 'PancakeSwap', value: 'PancakeSwap', price: 5000 },
  { label: 'CoinMarketCap', value: 'CoinMarketCap', price: 6500 },
  { label: 'DEXTOOL', value: 'DEXTOOL', price: 450 },
  { label: 'Metamask', value: 'Metamask', price: 1600 },
  { label: 'Trust Wallet', value: 'Trust', price: 3000 },
]

// 主网选项
const MAINNET_OPTIONS = [
  { label: 'Ethereum', value: 'Ethereum' },
  { label: 'BNB Smart Chain', value: 'BSC' },
  { label: 'TRON', value: 'Tron' },
  { label: 'Solana', value: 'Solana' },
  { label: 'Avalanche', value: 'Avalanche' },
  { label: 'X-layer', value: 'X-layer' },
  { label: 'Base Chain', value: 'Base' },
  { label: 'Arbitrum One', value: 'Arbitrum' },
  { label: 'Polygon Network', value: 'Polygon' },
  { label: 'Optimism', value: 'Optimism' },
  { label: 'CORE Chain', value: 'Core' },
  { label: 'HECO', value: 'HECO' },
]

// USDT 合约配置
const USDT_CONFIG: Record<number, { address: `0x${string}`; decimals: number; symbol: string }> = {
  56: {
    address: '0x55d398326f99059fF775485246999027B3197955',
    decimals: 18,
    symbol: 'USDT',
  },
  97: {
    address: '0x66E972502A34A625828C544a1914E8D8cc2A9dE5',
    decimals: 18,
    symbol: 'USDT',
  },
}

// 区块链浏览器 URL
const EXPLORER_URL: Record<number, string> = {
  56: 'https://bscscan.com/tx/',
  97: 'https://testnet.bscscan.com/tx/',
}

// ERC20 ABI (只需要 transfer 和 balanceOf)
const ERC20_ABI = [
  {
    inputs: [{ name: 'owner', type: 'address' }],
    name: 'balanceOf',
    outputs: [{ name: '', type: 'uint256' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      { name: 'to', type: 'address' },
      { name: 'amount', type: 'uint256' },
    ],
    name: 'transfer',
    outputs: [{ name: '', type: 'bool' }],
    stateMutability: 'nonpayable',
    type: 'function',
  },
] as const

// 接收地址
const RECEIVER_ADDRESS = '0x6C5Cb68cb68Ef116DD37b429F4d3cA5569B79E6b' as `0x${string}`

// 测试网白名单地址
const TESTNET_WHITELIST = '0x8dE09E570fA88531a498525d9f8116a5797A8A4f'

// API 端点
const API_UPLOAD = 'https://notifybot.pandatool.org/upload_logo_meta'
const API_NOTIFY = 'https://notifybot.pandatool.org/sendBot'
const API_KEY = '9192fd41-ac91-438d-8cde-ec7408015c7d'

interface FormData {
  channelPlatform: string
  mainnet: string
  tokenAddress: string
  logo: File | null
  telegram: string
  twitter: string
  website: string
  qqGroup: string
  whitepaper: string
  discord: string
  description: string
  contact: string
}

// 必填标签组件
function RequiredLabel({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex items-center gap-1">
      <span>{children}</span>
      <span className="text-destructive">*</span>
    </div>
  )
}

export default function TokenLogoPage() {
  const t = useTranslations('token-logo')
  const { address, chainId } = useAccount()
  const { writeContract, data: txHash, isPending: isWritePending } = useWriteContract()
  const { isLoading: isConfirming, isSuccess: isConfirmed } = useWaitForTransactionReceipt({
    hash: txHash,
  })

  const [formData, setFormData] = useState<FormData>({
    channelPlatform: 'AVE',
    mainnet: 'Ethereum',
    tokenAddress: '',
    logo: null,
    telegram: '',
    twitter: '',
    website: '',
    qqGroup: '',
    whitepaper: '',
    discord: '',
    description: '',
    contact: '',
  })

  const [logoPreview, setLogoPreview] = useState<string | undefined>(undefined)
  const [submitting, setSubmitting] = useState(false)
  const [metaDataUrl, setMetaDataUrl] = useState<string | null>(null)

  // 获取 USDT 余额
  const { data: usdtBalanceRaw } = useReadContract({
    address: chainId && USDT_CONFIG[chainId]?.address ? USDT_CONFIG[chainId].address : undefined,
    abi: ERC20_ABI,
    functionName: 'balanceOf',
    args: address ? [address] : undefined,
    query: {
      enabled: !!address && !!chainId && !!USDT_CONFIG[chainId],
    },
  })

  // 获取选中平台的价格
  const selectedPlatform = PLATFORM_OPTIONS.find((p) => p.value === formData.channelPlatform)
  const price = selectedPlatform?.price ?? 0

  // 处理表单字段变化
  const handleFieldChange = useCallback((field: keyof FormData, value: string | File | null) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }, [])

  // 联系客服
  const contactService = () => {
    window.open('https://t.me/btc6560', '_blank')
  }

  // 复制元数据 URL
  const copyMetaUrl = () => {
    if (metaDataUrl) {
      navigator.clipboard.writeText(metaDataUrl)
      toast.success(t('copySuccess'))
    }
  }

  // 提交表单
  const handleSubmit = async () => {
    // 表单验证
    if (!formData.channelPlatform) {
      toast.error(t('errors.selectPlatform'))
      return
    }
    if (!formData.mainnet) {
      toast.error(t('errors.selectMainnet'))
      return
    }
    if (!formData.tokenAddress) {
      toast.error(t('errors.enterAddress'))
      return
    }
    if (!formData.logo) {
      toast.error(t('errors.uploadLogo'))
      return
    }

    // 钱包检查
    if (!address) {
      toast.error(t('errors.connectWallet'))
      return
    }

    // 网络检查
    if (!chainId || !USDT_CONFIG[chainId]) {
      toast.error(t('errors.switchToBsc'))
      return
    }

    // 测试网白名单检查
    if (chainId === 97 && address.toLowerCase() !== TESTNET_WHITELIST.toLowerCase()) {
      toast.error(t('errors.switchToBsc'))
      return
    }

    // 价格检查
    if (price === 0) {
      toast.info(t('errors.contactSupport'))
      return
    }

    // 余额检查
    if (usdtBalanceRaw !== undefined) {
      const config = USDT_CONFIG[chainId]
      const balanceFormatted = formatUnits(usdtBalanceRaw as bigint, config.decimals)
      if (Number(balanceFormatted) < price) {
        toast.error(t('errors.insufficientBalance'))
        return
      }
    }

    setSubmitting(true)

    try {
      const config = USDT_CONFIG[chainId]
      const amount = BigInt(price * 10 ** config.decimals)

      // 发起转账交易
      writeContract({
        address: config.address,
        abi: ERC20_ABI,
        functionName: 'transfer',
        args: [RECEIVER_ADDRESS, amount],
      })
    } catch (error) {
      console.error('Submit error:', error)
      toast.error(t('errors.submitFailed'))
      setSubmitting(false)
    }
  }

  // 交易确认后上传数据
  useEffect(() => {
    if (!isConfirmed || !txHash || !address || !chainId) return

    const uploadData = async () => {
      try {
        const postData = new FormData()
        postData.append('mainnet', formData.mainnet)
        postData.append('tokenAddress', formData.tokenAddress)
        postData.append('channelPlatform', formData.channelPlatform)
        postData.append('imgType', formData.logo?.type || '')
        postData.append('file', formData.logo || '')
        postData.append('description', formData.description)
        postData.append('website', formData.website)
        postData.append('telegram', formData.telegram)
        postData.append('twitter', formData.twitter)
        postData.append('discord', formData.discord)
        postData.append('qqGroup', formData.qqGroup)
        postData.append('whitepaper', formData.whitepaper)
        postData.append('contact', formData.contact)
        postData.append('payNeworkId', chainId.toString())
        postData.append('payTx', txHash)

        const response = await fetch(API_UPLOAD, {
          method: 'POST',
          headers: {
            'X-API-Key': API_KEY,
          },
          body: postData,
        })

        const result = await response.json()

        if (result.code === 200) {
          setMetaDataUrl(result.metaURI)
          toast.success(t('success.submitSuccess'))

          // 发送通知
          const message = `
<b>📣📣📣  LOGO业务订单  📣📣📣</b>
<b>平台:</b>\n<code>${formData.channelPlatform}</code>\n
<b>付款哈希:</b>\n${EXPLORER_URL[chainId] + txHash} \n
<b>资料：</b>\n${result.metaURI} \n`
          fetch(API_NOTIFY, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'X-API-Key': API_KEY,
            },
            body: JSON.stringify({ message }),
          }).catch(() => {})
        } else {
          toast.error(t('errors.submitFailed'))
        }
      } catch (error) {
        console.error('Upload error:', error)
        toast.error(t('errors.submitFailed'))
      } finally {
        setSubmitting(false)
      }
    }

    uploadData()
  }, [isConfirmed, txHash, address, chainId, formData, t])

  return (
    <div className="flex justify-center py-8">
      <Card className="w-full max-w-3xl">
        <CardHeader>
          <CardTitle className="text-center text-2xl">{t('title')}</CardTitle>
          <p className="text-center">
            <a
              href={t('helpLink')}
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary hover:underline inline-flex items-center gap-1"
            >
              {t('helpText')}
              <ExternalLink className="w-4 h-4" />
            </a>
          </p>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* 渠道平台和主网选择 */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>
                <RequiredLabel>{t('channelPlatform')}</RequiredLabel>
              </Label>
              <Select
                value={formData.channelPlatform}
                onValueChange={(v) => handleFieldChange('channelPlatform', v)}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder={t('selectPlatform')} />
                </SelectTrigger>
                <SelectContent>
                  {PLATFORM_OPTIONS.map((opt) => (
                    <SelectItem key={opt.value} value={opt.value}>
                      {opt.label} - ${opt.price}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>
                <RequiredLabel>{t('mainnet')}</RequiredLabel>
              </Label>
              <Select
                value={formData.mainnet}
                onValueChange={(v) => handleFieldChange('mainnet', v)}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder={t('selectMainnet')} />
                </SelectTrigger>
                <SelectContent>
                  {MAINNET_OPTIONS.map((opt) => (
                    <SelectItem key={opt.value} value={opt.value}>
                      {opt.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* 合约地址 */}
          <div className="space-y-2">
            <Label>
              <RequiredLabel>{t('contractAddress')}</RequiredLabel>
            </Label>
            <Input
              value={formData.tokenAddress}
              onChange={(e) => handleFieldChange('tokenAddress', e.target.value)}
              placeholder={t('contractPlaceholder')}
              maxLength={120}
            />
          </div>

          {/* Logo 上传 */}
          <div className="space-y-2">
            <Label>
              <RequiredLabel>{t('uploadLogo')}</RequiredLabel>
            </Label>
            <LogoUploader
              onChange={(file) => handleFieldChange('logo', file)}
              previewUrl={logoPreview}
              onPreviewChange={(url) => setLogoPreview(url ?? undefined)}
              uploadText={t('uploadLogo')}
              hintImg={t('uploadHintImg')}
              hintGif={t('uploadHintGif')}
            />
          </div>

          {/* 社交媒体信息 */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>{t('telegramLabel')}</Label>
              <Input
                value={formData.telegram}
                onChange={(e) => handleFieldChange('telegram', e.target.value)}
                placeholder={t('telegramPlaceholder')}
              />
            </div>
            <div className="space-y-2">
              <Label>{t('twitterLabel')}</Label>
              <Input
                value={formData.twitter}
                onChange={(e) => handleFieldChange('twitter', e.target.value)}
                placeholder={t('twitterPlaceholder')}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>{t('websiteLabel')}</Label>
              <Input
                value={formData.website}
                onChange={(e) => handleFieldChange('website', e.target.value)}
                placeholder={t('websitePlaceholder')}
              />
            </div>
            <div className="space-y-2">
              <Label>{t('qqLabel')}</Label>
              <Input
                value={formData.qqGroup}
                onChange={(e) => handleFieldChange('qqGroup', e.target.value)}
                placeholder={t('qqPlaceholder')}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>{t('whitepaperLabel')}</Label>
              <Input
                value={formData.whitepaper}
                onChange={(e) => handleFieldChange('whitepaper', e.target.value)}
                placeholder={t('whitepaperPlaceholder')}
              />
            </div>
            <div className="space-y-2">
              <Label>{t('discordLabel')}</Label>
              <Input
                value={formData.discord}
                onChange={(e) => handleFieldChange('discord', e.target.value)}
                placeholder={t('discordPlaceholder')}
              />
            </div>
          </div>

          {/* 简介 */}
          <div className="space-y-2">
            <Label>{t('descriptionLabel')}</Label>
            <textarea
              value={formData.description}
              onChange={(e) => handleFieldChange('description', e.target.value)}
              placeholder={t('descriptionPlaceholder')}
              maxLength={1500}
              className="flex min-h-[100px] w-full rounded-md border border-input bg-transparent px-3 py-2 text-base shadow-xs outline-none transition-[color,box-shadow] placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm"
            />
          </div>

          {/* 联系邮箱 */}
          <div className="space-y-2">
            <Label>{t('contactLabel')}</Label>
            <Input
              type="email"
              value={formData.contact}
              onChange={(e) => handleFieldChange('contact', e.target.value)}
              placeholder={t('contactPlaceholder')}
            />
          </div>

          {/* 底部操作区域 */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 pt-4 border-t">
            <div className="text-lg font-semibold text-amber-600">
              {t('paymentText', { price })}
            </div>
            <div className="flex items-center gap-2">
              <Button variant="outline" onClick={contactService}>
                <MessageCircle className="w-4 h-4 mr-2" />
                {t('contactService')}
              </Button>
              <Button
                onClick={handleSubmit}
                disabled={submitting || isWritePending || isConfirming}
              >
                {submitting || isWritePending || isConfirming
                  ? 'Processing...'
                  : t('payAndSubmit')}
              </Button>
            </div>
          </div>

          {/* 提交结果 */}
          {metaDataUrl && (
            <div className="mt-6 p-4 bg-gradient-to-r from-blue-50 to-cyan-50 dark:from-blue-950 dark:to-cyan-950 rounded-lg border border-blue-500">
              <div className="flex items-center gap-2 mb-3">
                <CheckCircle className="w-5 h-5 text-green-500" />
                <span className="text-lg font-semibold">{t('resultTitle')}</span>
              </div>
              <div className="space-y-2">
                <Label>{t('resultMetaLabel')}</Label>
                <div className="flex gap-2">
                  <Input value={metaDataUrl} readOnly className="font-mono text-sm" />
                  <Button size="sm" onClick={copyMetaUrl}>
                    <Copy className="w-4 h-4 mr-1" />
                    {t('copy')}
                  </Button>
                </div>
                <div className="flex items-center gap-2 p-3 bg-amber-50 dark:bg-amber-950 rounded-md border-l-4 border-amber-500">
                  <AlertTriangle className="w-4 h-4 text-amber-600" />
                  <span className="text-sm text-amber-800 dark:text-amber-200">
                    {t('resultSaveTip')}
                  </span>
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
