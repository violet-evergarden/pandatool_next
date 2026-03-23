/**
 * Logo 页面表单验证工具
 */

import type { LogoFormData, ValidationResult } from '../_types'

export type { ValidationResult }

/** 验证必填字段 */
export function validateRequiredFields(formData: LogoFormData): ValidationResult {
  if (!formData.channelPlatform) {
    return { valid: false, errorKey: 'errors.selectPlatform' }
  }
  if (!formData.mainnet) {
    return { valid: false, errorKey: 'errors.selectMainnet' }
  }
  if (!formData.tokenAddress) {
    return { valid: false, errorKey: 'errors.enterAddress' }
  }
  if (!formData.logo) {
    return { valid: false, errorKey: 'errors.uploadLogo' }
  }
  return { valid: true }
}

/** 验证钱包状态 */
export function validateWalletState(
  address: `0x${string}` | undefined,
  chainId: number | undefined,
  usdtConfigExists: boolean,
  isTestnetWhitelisted: boolean
): ValidationResult {
  if (!address) {
    return { valid: false, errorKey: 'errors.connectWallet' }
  }
  if (!chainId || !usdtConfigExists) {
    return { valid: false, errorKey: 'errors.switchToBsc' }
  }
  if (!isTestnetWhitelisted) {
    return { valid: false, errorKey: 'errors.switchToBsc' }
  }
  return { valid: true }
}

/** 验证余额 */
export function validateBalance(
  balanceRaw: bigint | undefined,
  price: number,
  decimals: number
): ValidationResult {
  if (balanceRaw === undefined) {
    return { valid: true } // 余额未知时跳过检查
  }

  const balanceFormatted = Number(balanceRaw) / 10 ** decimals
  if (balanceFormatted < price) {
    return { valid: false, errorKey: 'errors.insufficientBalance' }
  }
  return { valid: true }
}

/** 验证价格 */
export function validatePrice(price: number): ValidationResult {
  if (price === 0) {
    return { valid: false, errorKey: 'errors.contactSupport' }
  }
  return { valid: true }
}
