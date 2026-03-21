import { http, createConfig } from 'wagmi'
import { mainnet, bsc, arbitrum, base, polygon } from 'wagmi/chains'
import { injected, walletConnect } from '@wagmi/connectors'
import type { Chain } from 'wagmi/chains'

// Define custom chains
const coreChain: Chain = {
  id: 1116,
  name: 'Core Mainnet',
  nativeCurrency: { name: 'CORE', symbol: 'CORE', decimals: 18 },
  rpcUrls: {
    default: { http: ['https://rpc.coredao.org'] },
  },
  blockExplorers: {
    default: { name: 'CoreScan', url: 'https://scan.coredao.org' },
  },
  testnet: false,
}

const xLayerChain: Chain = {
  id: 196,
  name: 'X Layer',
  nativeCurrency: { name: 'OKB', symbol: 'OKB', decimals: 18 },
  rpcUrls: {
    default: { http: ['https://rpc.ankr.com/xlayer'] },
  },
  blockExplorers: {
    default: { name: 'OKLink', url: 'https://www.oklink.com/zh-hans/x-layer' },
  },
  testnet: false,
}

const seiChain: Chain = {
  id: 1329,
  name: 'Sei Network',
  nativeCurrency: { name: 'SEI', symbol: 'SEI', decimals: 18 },
  rpcUrls: {
    default: { http: ['https://evm-rpc.sei-apis.com'] },
  },
  blockExplorers: {
    default: { name: 'SeiStream', url: 'https://seistream.app' },
  },
  testnet: false,
}

const bscTestnetChain: Chain = {
  id: 97,
  name: 'BSC Testnet',
  nativeCurrency: { name: 'TBNB', symbol: 'TBNB', decimals: 18 },
  rpcUrls: {
    default: { http: ['https://data-seed-prebsc-2-s1.binance.org:8545'] },
  },
  blockExplorers: {
    default: { name: 'BSCScan', url: 'https://testnet.bscscan.com' },
  },
  testnet: true,
}

// All chains
const chains = [
  mainnet,
  bsc,
  arbitrum,
  base,
  polygon,
  coreChain,
  xLayerChain,
  seiChain,
  bscTestnetChain,
] as const

// Configure transports for each chain
const transports: Record<number, ReturnType<typeof http()>> = Object.from {
  [mainnet.id]: http(),
  [bsc.id]: http(),
  [arbitrum.id]: http(),
  [base.id]: http(),
  [polygon.id]: http(),
  [coreChain.id]: http(),
  [xLayerChain.id]: http(),
  [seiChain.id]: http(),
  [bscTestnetChain.id]: http(),
}

export const wagmiConfig = createConfig({
  chains,
  connectors: [
    injected({ target: 'metaMask' }),
    walletConnect({
      projectId: process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID || '',
    }),
  ],
  transports,
  ssr: true, // Enable server-side rendering
})
