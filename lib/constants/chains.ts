/**
 * 共享链配置
 * 统一管理所有工具页面使用的链配置
 */

export interface ChainConfig {
  /** 显示标签 */
  label: string
  /** URL 友好的值 (用于 Moralis API) */
  value: string
  /** 链 ID (数字) */
  chainId: number
  /** 完整名称 */
  name: string
}

/**
 * 支持的 EVM 链配置列表
 */
export const CHAIN_CONFIGS: ChainConfig[] = [
  { label: 'BSC', value: 'bsc', chainId: 56, name: 'BNB Smart Chain' },
  { label: 'Ethereum', value: 'eth', chainId: 1, name: 'Ethereum' },
  { label: 'Arbitrum', value: 'arbitrum', chainId: 42161, name: 'Arbitrum One' },
  { label: 'Base', value: 'base', chainId: 8453, name: 'Base' },
  { label: 'Polygon', value: 'polygon', chainId: 137, name: 'Polygon Network' },
]

/**
 * 获取用于 Select 组件的链选项 (使用 string value)
 * 适用于: Moralis API, snapshot-token 页面
 */
export const getChainOptions = () =>
  CHAIN_CONFIGS.map((c) => ({
    label: c.label,
    value: c.value,
    chainId: c.chainId,
  }))

/**
 * 获取用于 GoPlus API 的链选项 (使用 chainId 作为 string value)
 * 适用于: contract-check 页面
 */
export const getChainIdOptions = () =>
  CHAIN_CONFIGS.map((c) => ({
    label: c.label,
    value: String(c.chainId),
    chainName: c.label,
  }))

/**
 * 根据 chainId 获取链配置
 */
export const getChainByChainId = (chainId: number): ChainConfig | undefined => {
  return CHAIN_CONFIGS.find((c) => c.chainId === chainId)
}

/**
 * 根据 value 获取链配置
 */
export const getChainByValue = (value: string): ChainConfig | undefined => {
  return CHAIN_CONFIGS.find((c) => c.value === value)
}

/**
 * 根据链名称获取 chainId
 */
export const getChainIdByName = (name: string): number | undefined => {
  return CHAIN_CONFIGS.find(
    (c) => c.name.toLowerCase() === name.toLowerCase() || c.label.toLowerCase() === name.toLowerCase()
  )?.chainId
}

// ============ Logo 页面专用配置 ============

/**
 * USDT 合约配置 (别名，兼容旧代码)
 */
export const USDT_CONFIG: Record<number, { address: `0x${string}`; decimals: number; symbol: string }> = {
  56: {
    address: '0x55d398326f99059fF775485246999027B3197955',
    decimals: 18,
    symbol: 'USDT',
  },
  97: {
    address: '0x66E972502A34A625828C544a1914E8D8cc2A9dE5',
    decimals: 18,
    symbol: 'USDT',
  },
}

/**
 * 区块链浏览器 URL
 */
export const EXPLORER_URL: Record<number, string> = {
  56: 'https://bscscan.com/tx/',
  97: 'https://testnet.bscscan.com/tx/',
}

/**
 * 接收地址 (用于 USDT 支付)
 */
export const RECEIVER_ADDRESS = '0x6C5Cb68cb68Ef116DD37b429F4d3cA5569B79E6b' as `0x${string}`

/**
 * 测试网白名单地址
 */
export const TESTNET_WHITELIST = '0x8dE09E570fA88531a498525d9f8116a5797A8A4f'

