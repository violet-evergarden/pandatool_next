/**
 * Logo 页面类型定义
 */

/** 平台选项 */
export interface PlatformOption {
  label: string
  value: string
  price: number
}

/** 主网选项 */
export interface MainnetOption {
  label: string
  value: string
}

/** 表单数据 */
export interface LogoFormData {
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

/** 表单字段名 */
export type LogoFormField = keyof LogoFormData

/** 提交状态 */
export type SubmitStatus = 'idle' | 'paying' | 'uploading' | 'success' | 'error'

/** 验证结果 */
export interface ValidationResult {
  valid: boolean
  errorKey?: string
}
