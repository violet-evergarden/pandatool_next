/**
 * 地址验证和处理工具
 */
import { isAddress } from 'viem'

/**
 * 验证是否为有效的 EVM 地址
 * @param address - 要验证的地址
 * @returns 是否有效
 */
export const isValidEvmAddress = (address: string): boolean => {
  if (!address || typeof address !== 'string') return false
  const trimmed = address.trim()

  // 支持 0x 前缀和不带前缀的地址
  const withPrefix = trimmed.startsWith('0x') ? trimmed : `0x${trimmed}`

  // 检查格式: 0x + 40 个十六进制字符
  return /^0x[0-9a-fA-F]{40}$/.test(withPrefix)
}

/**
 * 标准化地址格式 (转小写)
 * @param address - 要标准化的地址
 * @returns 标准化后的地址
 */
export const normalizeAddress = (address: string): `0x${string}` => {
  const trimmed = address.trim().toLowerCase()
  return (trimmed.startsWith('0x') ? trimmed : `0x${trimmed}`) as `0x${string}`
}

/**
 * 截断地址显示
 * @param address - 要截断的地址
 * @param start - 开头保留字符数 (默认 6)
 * @param end - 结尾保留字符数 (默认 4)
 * @returns 截断后的地址字符串
 */
export const truncateAddress = (address: string, start = 6, end = 4): string => {
  if (!address) return ''
  const normalized = normalizeAddress(address)
  return `${normalized.slice(0, start)}...${normalized.slice(-end)}`
}

/**
 * 使用 viem 的 isAddress 进行严格验证
 * @param address - 要验证的地址
 * @returns 是否有效
 */
export const isStrictValidAddress = (address: string): boolean => {
  try {
    return isAddress(address)
  } catch {
    return false
  }
}
