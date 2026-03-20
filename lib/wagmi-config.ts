import { http, createConfig } from 'wagmi'
import { injected, walletConnect } from '@wagmi/connectors'

export const config = createConfig({
  chains: [
    {
      id: 1,
      name: 'Ethereum',
      nativeCurrency: { name: 'Ether', symbol: 'ETH', decimals: 18 },
      rpcUrls: {
        default: { http: ['https://eth.llamarpc.com'] },
      },
      blockExplorers: {
        default: { name: 'Etherscan', url: 'https://etherscan.io' },
      },
    },
    {
      id: 137,
      name: 'Polygon',
      nativeCurrency: { name: 'MATIC', symbol: 'MATIC', decimals: 18 },
      rpcUrls: {
        default: { http: ['https://polygon.llamarpc.com'] },
      },
      blockExplorers: {
        default: { name: 'PolygonScan', url: 'https://polygonscan.com' },
      },
    },
    {
      id: 42161,
      name: 'Arbitrum',
      nativeCurrency: { name: 'Ether', symbol: 'ETH', decimals: 18 },
      rpcUrls: {
        default: { http: ['https://arbitrum.llamarpc.com'] },
      },
      blockExplorers: {
        default: { name: 'Arbiscan', url: 'https://arbiscan.io' },
      },
    },
    {
      id: 10,
      name: 'Optimism',
      nativeCurrency: { name: 'Ether', symbol: 'ETH', decimals: 18 },
      rpcUrls: {
        default: { http: ['https://optimism.llamarpc.com'] },
      },
      blockExplorers: {
        default: { name: 'Optimism Explorer', url: 'https://optimistic.etherscan.io' },
      },
    },
    {
      id: 8453,
      name: 'Base',
      nativeCurrency: { name: 'Ether', symbol: 'ETH', decimals: 18 },
      rpcUrls: {
        default: { http: ['https://base.llamarpc.com'] },
      },
      blockExplorers: {
        default: { name: 'BaseScan', url: 'https://basescan.org' },
      },
    },
  ],
  connectors: [
    injected(),
    walletConnect({
      projectId: process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID || '',
    }),
  ],
  transports: {
    [1]: http(),
    [137]: http(),
    [42161]: http(),
    [10]: http(),
    [8453]: http(),
  },
})

// 暴露链 ID 供组件使用
export const chainIds = {
  ethereum: 1,
  polygon: 137,
  arbitrum: 42161,
  optimism: 10,
  base: 8453,
}
