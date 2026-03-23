/**
 * 结果展示组件
 */

import { Copy, CheckCircle, AlertTriangle } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'

interface ResultSectionProps {
  metaDataUrl: string
  onCopy: () => void
  labels: {
    resultTitle: string
    resultMetaLabel: string
    copy: string
    resultSaveTip: string
  }
}

export function ResultSection({ metaDataUrl, onCopy, labels }: ResultSectionProps) {
  if (!metaDataUrl) return null

  return (
    <div className="mt-6 p-4 bg-gradient-to-r from-blue-50 to-cyan-50 dark:from-blue-950 dark:to-cyan-950 rounded-lg border border-blue-500">
      <div className="flex items-center gap-2 mb-3">
        <CheckCircle className="w-5 h-5 text-green-500" />
        <span className="text-lg font-semibold">{labels.resultTitle}</span>
      </div>
      <div className="space-y-2">
        <Label>{labels.resultMetaLabel}</Label>
        <div className="flex gap-2">
          <Input value={metaDataUrl} readOnly className="font-mono text-sm" />
          <Button size="sm" onClick={onCopy}>
            <Copy className="w-4 h-4 mr-1" />
            {labels.copy}
          </Button>
        </div>
        <div className="flex items-center gap-2 p-3 bg-amber-50 dark:bg-amber-950 rounded-md border-l-4 border-amber-500">
          <AlertTriangle className="w-4 h-4 text-amber-600" />
          <span className="text-sm text-amber-800 dark:text-amber-200">
            {labels.resultSaveTip}
          </span>
        </div>
      </div>
    </div>
  )
}
