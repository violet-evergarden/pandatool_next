/**
 * 支付操作区域组件
 */

import { MessageCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface PaymentSectionProps {
  price: number
  isLoading: boolean
  onSubmit: () => void
  onContactService: () => void
  labels: {
    paymentText: string
    contactService: string
    processing: string
    payAndSubmit: string
  }
}

export function PaymentSection({
  price,
  isLoading,
  onSubmit,
  onContactService,
  labels,
}: PaymentSectionProps) {
  return (
    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 pt-4 border-t">
      <div className="text-lg font-semibold text-amber-600">
        {labels.paymentText.replace('{price}', String(price))}
      </div>
      <div className="flex items-center gap-2">
        <Button variant="outline" onClick={onContactService}>
          <MessageCircle className="w-4 h-4 mr-2" />
          {labels.contactService}
        </Button>
        <Button onClick={onSubmit} disabled={isLoading}>
          {isLoading ? labels.processing : labels.payAndSubmit}
        </Button>
      </div>
    </div>
  )
}
