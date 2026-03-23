'use client'

import { useCallback, useMemo } from 'react'
import { useTranslations } from 'next-intl'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { ExternalLink } from 'lucide-react'
import { LogoUploader } from './_components/logo-uploader'
import { toast } from 'sonner'
import {
  RequiredLabel,
  PlatformMainnetFields,
  SocialLinksFields,
  ResultSection,
  PaymentSection,
} from './_components'
import { PLATFORM_OPTIONS } from './_constants'
import { useLogoForm } from './_hooks/useLogoForm'
import { useLogoPayment } from './_hooks/useLogoPayment'

export default function TokenLogoPage() {
  const t = useTranslations('token-logo')

  // 表单状态
  const { formData, logoPreview, updateField, updatePreview } = useLogoForm()

  // 获取选中平台的价格
  const selectedPlatform = useMemo(
    () => PLATFORM_OPTIONS.find((p) => p.value === formData.channelPlatform),
    [formData.channelPlatform]
  )
  const price = selectedPlatform?.price ?? 0

  // 支付逻辑
  const { submitPayment, isLoading, metaDataUrl } = useLogoPayment({
    formData,
    price,
    t,
  })

  // 联系客服
  const contactService = useCallback(() => {
    window.open('https://t.me/btc6560', '_blank')
  }, [])

  // 复制元数据 URL
  const copyMetaUrl = useCallback(() => {
    if (metaDataUrl) {
      navigator.clipboard.writeText(metaDataUrl)
      toast.success(t('copySuccess'))
    }
  }, [metaDataUrl, t])

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
          <PlatformMainnetFields
            channelPlatform={formData.channelPlatform}
            mainnet={formData.mainnet}
            onPlatformChange={(v) => updateField('channelPlatform', v)}
            onMainnetChange={(v) => updateField('mainnet', v)}
            labels={{
              channelPlatform: t('channelPlatform'),
              mainnet: t('mainnet'),
              selectPlatform: t('selectPlatform'),
              selectMainnet: t('selectMainnet'),
            }}
          />

          {/* 合约地址 */}
          <div className="space-y-2">
            <Label>
              <RequiredLabel>{t('contractAddress')}</RequiredLabel>
            </Label>
            <Input
              value={formData.tokenAddress}
              onChange={(e) => updateField('tokenAddress', e.target.value)}
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
              onChange={(file) => updateField('logo', file)}
              previewUrl={logoPreview}
              onPreviewChange={updatePreview}
              uploadText={t('uploadLogo')}
              hintImg={t('uploadHintImg')}
              hintGif={t('uploadHintGif')}
            />
          </div>

          {/* 社交媒体信息 */}
          <SocialLinksFields
            telegram={formData.telegram}
            twitter={formData.twitter}
            website={formData.website}
            qqGroup={formData.qqGroup}
            whitepaper={formData.whitepaper}
            discord={formData.discord}
            onChange={(field, value) => updateField(field as any, value)}
            labels={{
              telegramLabel: t('telegramLabel'),
              telegramPlaceholder: t('telegramPlaceholder'),
              twitterLabel: t('twitterLabel'),
              twitterPlaceholder: t('twitterPlaceholder'),
              websiteLabel: t('websiteLabel'),
              websitePlaceholder: t('websitePlaceholder'),
              qqLabel: t('qqLabel'),
              qqPlaceholder: t('qqPlaceholder'),
              whitepaperLabel: t('whitepaperLabel'),
              whitepaperPlaceholder: t('whitepaperPlaceholder'),
              discordLabel: t('discordLabel'),
              discordPlaceholder: t('discordPlaceholder'),
            }}
          />

          {/* 简介 */}
          <div className="space-y-2">
            <Label>{t('descriptionLabel')}</Label>
            <textarea
              value={formData.description}
              onChange={(e) => updateField('description', e.target.value)}
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
              onChange={(e) => updateField('contact', e.target.value)}
              placeholder={t('contactPlaceholder')}
            />
          </div>

          {/* 底部操作区域 */}
          <PaymentSection
            price={price}
            isLoading={isLoading}
            onSubmit={submitPayment}
            onContactService={contactService}
            labels={{
              paymentText: t('paymentText', { price }),
              contactService: t('contactService'),
              processing: t('processing'),
              payAndSubmit: t('payAndSubmit'),
            }}
          />

          {/* 提交结果 */}
          <ResultSection
            metaDataUrl={metaDataUrl || ''}
            onCopy={copyMetaUrl}
            labels={{
              resultTitle: t('resultTitle'),
              resultMetaLabel: t('resultMetaLabel'),
              copy: t('copy'),
              resultSaveTip: t('resultSaveTip'),
            }}
          />
        </CardContent>
      </Card>
    </div>
  )
}
