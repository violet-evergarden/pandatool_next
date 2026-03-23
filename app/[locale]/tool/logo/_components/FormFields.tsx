/**
 * 平台和主网选择组件
 */

import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { RequiredLabel } from './RequiredLabel'
import { PLATFORM_OPTIONS, MAINNET_OPTIONS } from '../_constants'

interface PlatformMainnetFieldsProps {
  channelPlatform: string
  mainnet: string
  onPlatformChange: (value: string) => void
  onMainnetChange: (value: string) => void
  labels: {
    channelPlatform: string
    mainnet: string
    selectPlatform: string
    selectMainnet: string
  }
}

export function PlatformMainnetFields({
  channelPlatform,
  mainnet,
  onPlatformChange,
  onMainnetChange,
  labels,
}: PlatformMainnetFieldsProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {/* 渠道平台 */}
      <div className="space-y-2">
        <Label>
          <RequiredLabel>{labels.channelPlatform}</RequiredLabel>
        </Label>
        <Select value={channelPlatform} onValueChange={onPlatformChange}>
          <SelectTrigger className="w-full">
            <SelectValue placeholder={labels.selectPlatform} />
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

      {/* 主网 */}
      <div className="space-y-2">
        <Label>
          <RequiredLabel>{labels.mainnet}</RequiredLabel>
        </Label>
        <Select value={mainnet} onValueChange={onMainnetChange}>
          <SelectTrigger className="w-full">
            <SelectValue placeholder={labels.selectMainnet} />
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
  )
}
