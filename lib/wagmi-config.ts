import { http, createConfig } from 'wagmi'
import { mainnet, bsc, arbitrum, base, polygon } from 'wagmi/chains'
import { injected, walletConnect } from '@wagmi/connectors'
import { defineChain } from 'viem'

// Define custom chains using viem's defineChain
const coreChain = defineChain({
  id: 1116,
  name: 'Core Mainnet',
  nativeCurrency: { name: 'CORE', symbol: 'CORE', decimals: 18 },
  rpcUrls: {
    default: { http: ['https://rpc.coredao.org'] },
  },
  blockExplorers: {
    default: { name: 'CoreScan', url: 'https://scan.coredao.org' }
  },
})

const xLayer = defineChain({
  id: 196,
  name: 'X Layer',
  nativeCurrency: { name: 'OKB', symbol: 'OKB', decimals: 18 },
  rpcUrls: {
    default: { http: ['https://rpc.ankr.com/xlayer'] },
  },
  blockExplorers: {
    default: { name: 'OKLink', url: 'https://www.oklink.com/x-layer' }
  },
})
const sei = defineChain({
  id: 1329,
  name: 'Sei Network',
  nativeCurrency: { name: 'SEI', symbol: 'SEI', decimals: 18 },
  rpcUrls: {
    default: { http: ['https://evm-rpc.sei-apis.com'] },
  },
  blockExplorers: {
    default: { name: 'SeiScan', url: 'https://seistream.app' }
  },
})
const bscTestnet = defineChain({
  id: 97,
  name: 'BSC Testnet',
  nativeCurrency: { name: 'TBNB', symbol: 'TBNB', decimals: 18 },
  rpcUrls: {
    default: { http: ['https://data-seed-prebsc-2-s1.binance.org:8545'] }
  },
  blockExplorers: {
    default: { name: 'BSCScan', url: 'https://testnet.bscscan.com' }
  },
})
// All chains
const chains = [
  mainnet,
  bsc,
  arbitrum,
  base,
  polygon,
  coreChain,
  xLayer,
  sei,
  bscTestnet,
] as const

// Configure transports
const transports = chains.reduce((acc, chain) => {
  acc[chain.id] = http()
  return acc
}, {} as Record<number, ReturnType<typeof http>>)

export const wagmiConfig = createConfig({
  chains,
  connectors: [
    injected(),
    walletConnect({
      projectId: process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID || '',
    }),
  ],
  transports,
  ssr: true, // Enable server-side rendering
})
