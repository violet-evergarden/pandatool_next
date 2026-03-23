/**
 * 社交链接字段组件
 */

import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

interface SocialLinksFieldsProps {
  telegram: string
  twitter: string
  website: string
  qqGroup: string
  whitepaper: string
  discord: string
  onChange: (field: string, value: string) => void
  labels: {
    telegramLabel: string
    telegramPlaceholder: string
    twitterLabel: string
    twitterPlaceholder: string
    websiteLabel: string
    websitePlaceholder: string
    qqLabel: string
    qqPlaceholder: string
    whitepaperLabel: string
    whitepaperPlaceholder: string
    discordLabel: string
    discordPlaceholder: string
  }
}

export function SocialLinksFields({
  telegram,
  twitter,
  website,
  qqGroup,
  whitepaper,
  discord,
  onChange,
  labels,
}: SocialLinksFieldsProps) {
  return (
    <>
      {/* 第一行: Telegram, Twitter */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label>{labels.telegramLabel}</Label>
          <Input
            value={telegram}
            onChange={(e) => onChange('telegram', e.target.value)}
            placeholder={labels.telegramPlaceholder}
          />
        </div>
        <div className="space-y-2">
          <Label>{labels.twitterLabel}</Label>
          <Input
            value={twitter}
            onChange={(e) => onChange('twitter', e.target.value)}
            placeholder={labels.twitterPlaceholder}
          />
        </div>
      </div>

      {/* 第二行: Website, QQ */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label>{labels.websiteLabel}</Label>
          <Input
            value={website}
            onChange={(e) => onChange('website', e.target.value)}
            placeholder={labels.websitePlaceholder}
          />
        </div>
        <div className="space-y-2">
          <Label>{labels.qqLabel}</Label>
          <Input
            value={qqGroup}
            onChange={(e) => onChange('qqGroup', e.target.value)}
            placeholder={labels.qqPlaceholder}
          />
        </div>
      </div>

      {/* 第三行: Whitepaper, Discord */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label>{labels.whitepaperLabel}</Label>
          <Input
            value={whitepaper}
            onChange={(e) => onChange('whitepaper', e.target.value)}
            placeholder={labels.whitepaperPlaceholder}
          />
        </div>
        <div className="space-y-2">
          <Label>{labels.discordLabel}</Label>
          <Input
            value={discord}
            onChange={(e) => onChange('discord', e.target.value)}
            placeholder={labels.discordPlaceholder}
          />
        </div>
      </div>
    </>
  )
}
