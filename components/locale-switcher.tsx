'use client'

import { useLocale } from 'next-intl'
import { usePathname, useRouter } from '@/i18n/routing'
import { Globe } from 'lucide-react'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

const locales = [
  { value: 'en', label: 'English', flag: '🇺🇸' },
  { value: 'zh', label: '中文', flag: '🇨🇳' },
]

export function LocaleSwitcher() {
  const locale = useLocale()
  const router = useRouter()
  const pathname = usePathname()

  const switchLocale = (newLocale: string) => {
    router.replace(pathname, { locale: newLocale })
  }

  const currentLocale = locales.find((l) => l.value === locale)

  return (
    <Select value={locale} onValueChange={switchLocale}>
      <SelectTrigger className="w-[120px] h-8">
        <Globe className="h-4 w-4 mr-1" />
        <SelectValue placeholder="Language">
          {currentLocale?.flag} {currentLocale?.label}
        </SelectValue>
      </SelectTrigger>
      <SelectContent>
        {locales.map((loc) => (
          <SelectItem key={loc.value} value={loc.value}>
            <span className="flex items-center gap-2">
              <span>{loc.flag}</span>
              <span>{loc.label}</span>
            </span>
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  )
}
