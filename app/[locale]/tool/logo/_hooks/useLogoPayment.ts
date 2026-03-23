/**
 * Logo 支付与上传逻辑 Hook
 */

import { useState, useCallback, useEffect } from 'react'
import { useAccount, useWriteContract, useWaitForTransactionReceipt, useReadContract } from 'wagmi'
import { toast } from 'sonner'
import { USDT_CONFIG, TESTNET_WHITELIST, RECEIVER_ADDRESS } from '@/lib/constants/chains'
import { ERC20_ABI } from '../_constants'
import { buildOrderMessage } from '../_utils/notification'
import {
  validateRequiredFields,
  validateWalletState,
  validatePrice,
  validateBalance,
} from '../_utils/validation'
import type { LogoFormData } from '../_types'

interface UseLogoPaymentOptions {
  formData: LogoFormData
  price: number
  t: (key: string) => string
}

export function useLogoPayment({ formData, price, t }: UseLogoPaymentOptions) {
  const { address, chainId } = useAccount()
  const { writeContract, data: txHash, isPending: isWritePending } = useWriteContract()
  const { isLoading: isConfirming, isSuccess: isConfirmed } = useWaitForTransactionReceipt({
    hash: txHash,
  })

  const [submitting, setSubmitting] = useState(false)
  const [metaDataUrl, setMetaDataUrl] = useState<string | null>(null)

  // 获取 USDT 配置
  const usdtConfig = chainId ? USDT_CONFIG[chainId] : undefined

  // 获取 USDT 余额
  const { data: usdtBalanceRaw } = useReadContract({
    address: usdtConfig?.address,
    abi: ERC20_ABI,
    functionName: 'balanceOf',
    args: address ? [address] : undefined,
    query: {
      enabled: !!address && !!usdtConfig,
    },
  })

  /** 提交支付 */
  const submitPayment = useCallback(() => {
    // 1. 验证必填字段
    const fieldResult = validateRequiredFields(formData)
    if (!fieldResult.valid) {
      toast.error(t(fieldResult.errorKey!))
      return
    }

    // 2. 验证钱包状态
    const isTestnetWhitelisted =
      chainId !== 97 || address?.toLowerCase() === TESTNET_WHITELIST.toLowerCase()
    const walletResult = validateWalletState(
      address,
      chainId,
      !!usdtConfig,
      isTestnetWhitelisted
    )
    if (!walletResult.valid) {
      toast.error(t(walletResult.errorKey!))
      return
    }

    // 3. 验证价格
    const priceResult = validatePrice(price)
    if (!priceResult.valid) {
      toast.info(t(priceResult.errorKey!))
      return
    }

    // 4. 验证余额
    const balanceResult = validateBalance(
      usdtBalanceRaw as bigint | undefined,
      price,
      usdtConfig!.decimals
    )
    if (!balanceResult.valid) {
      toast.error(t(balanceResult.errorKey!))
      return
    }

    setSubmitting(true)

    try {
      const amount = BigInt(price * 10 ** usdtConfig!.decimals)
      writeContract({
        address: usdtConfig!.address,
        abi: ERC20_ABI,
        functionName: 'transfer',
        args: [RECEIVER_ADDRESS, amount],
      })
    } catch (error) {
      console.error('Submit error:', error)
      toast.error(t('errors.submitFailed'))
      setSubmitting(false)
    }
  }, [formData, address, chainId, price, usdtBalanceRaw, usdtConfig, writeContract, t])

  // 交易确认后上传数据
  useEffect(() => {
    if (!isConfirmed || !txHash || !address || !chainId || !usdtConfig) return

    let isMounted = true

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

        const response = await fetch('/api/logo/upload', {
          method: 'POST',
          body: postData,
        })

        const result = await response.json()

        if (!isMounted) return

        if (result.code === 200) {
          setMetaDataUrl(result.metaURI)
          toast.success(t('success.submitSuccess'))

          // 发送通知
          const message = buildOrderMessage(
            formData.channelPlatform,
            txHash,
            result.metaURI,
            chainId
          )

          fetch('/api/logo/notify', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ message }),
          }).catch(() => {})
        } else {
          toast.error(t('errors.submitFailed'))
        }
      } catch (error) {
        if (!isMounted) return
        console.error('Upload error:', error)
        toast.error(t('errors.submitFailed'))
      } finally {
        if (isMounted) {
          setSubmitting(false)
        }
      }
    }

    uploadData()

    return () => {
      isMounted = false
    }
  }, [isConfirmed, txHash, address, chainId, formData, usdtConfig, t])

  const isLoading = submitting || isWritePending || isConfirming

  return {
    submitPayment,
    isLoading,
    metaDataUrl,
  }
}
