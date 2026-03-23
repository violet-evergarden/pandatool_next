/**
 * Logo 页面常量配置
 */

import type { PlatformOption, MainnetOption } from '../_types'

/** 平台选项配置（含价格） */
export const PLATFORM_OPTIONS: PlatformOption[] = [
  { label: 'AVE', value: 'AVE', price: 300 },
  { label: 'TokenPocket (TP)', value: 'TokenPocket', price: 1400 },
  { label: 'Bitget Wallet', value: 'Bitget', price: 500 },
  { label: 'OKX Wallet', value: 'OKX', price: 500 },
  { label: 'Dexscreener', value: 'Dexscreener', price: 400 },
  { label: 'CoinGecko', value: 'CoinGecko', price: 1500 },
  { label: 'PancakeSwap', value: 'PancakeSwap', price: 5000 },
  { label: 'CoinMarketCap', value: 'CoinMarketCap', price: 6500 },
  { label: 'DEXTOOL', value: 'DEXTOOL', price: 450 },
  { label: 'Metamask', value: 'Metamask', price: 1600 },
  { label: 'Trust Wallet', value: 'Trust', price: 3000 },
]

/** 主网选项 */
export const MAINNET_OPTIONS: MainnetOption[] = [
  { label: 'Ethereum', value: 'Ethereum' },
  { label: 'BNB Smart Chain', value: 'BSC' },
  { label: 'TRON', value: 'Tron' },
  { label: 'Solana', value: 'Solana' },
  { label: 'Avalanche', value: 'Avalanche' },
  { label: 'X-layer', value: 'X-layer' },
  { label: 'Base Chain', value: 'Base' },
  { label: 'Arbitrum One', value: 'Arbitrum' },
  { label: 'Polygon Network', value: 'Polygon' },
  { label: 'Optimism', value: 'Optimism' },
  { label: 'CORE Chain', value: 'Core' },
  { label: 'HECO', value: 'HECO' },
]

/** 默认表单数据 */
export const DEFAULT_FORM_DATA = {
  channelPlatform: 'AVE',
  mainnet: 'Ethereum',
  tokenAddress: '',
  logo: null,
  telegram: '',
  twitter: '',
  website: '',
  qqGroup: '',
  whitepaper: '',
  discord: '',
  description: '',
  contact: '',
}

/** ERC20 ABI (只需要 transfer 和 balanceOf) */
export const ERC20_ABI = [
  {
    inputs: [{ name: 'owner', type: 'address' }],
    name: 'balanceOf',
    outputs: [{ name: '', type: 'uint256' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      { name: 'to', type: 'address' },
      { name: 'amount', type: 'uint256' },
    ],
    name: 'transfer',
    outputs: [{ name: '', type: 'bool' }],
    stateMutability: 'nonpayable',
    type: 'function',
  },
] as const
