'use client'

import { BrowserProvider, FallbackProvider, JsonRpcProvider, JsonRpcSigner } from 'ethers'
import { useMemo } from 'react'
import type { Account, Chain, Client, Transport } from 'viem'
import { type Config, useClient, useConnectorClient } from 'wagmi'

// ============================================
// Types
// ============================================

export type { JsonRpcSigner as EthersSigner }

export type EthersProvider = JsonRpcProvider | FallbackProvider

// ============================================
// Client to Signer (ethers v6)
// ============================================

export function clientToSigner(client: Client<Transport, Chain, Account>): JsonRpcSigner {
  const { account, chain, transport } = client
  const network = {
    chainId: chain.id,
    name: chain.name,
    ensAddress: chain.contracts?.ensRegistry?.address,
  }
  const provider = new BrowserProvider(transport, network)
  const signer = new JsonRpcSigner(provider, account.address)
  return signer
}

/** Hook to convert viem Wallet Client to ethers.js Signer */
export function useEthersSigner({ chainId }: { chainId?: number } = {}) {
  const { data: client } = useConnectorClient<Config>({ chainId })
  return useMemo(
    () => (client ? clientToSigner(client) : undefined),
    [client]
  )
}

// ============================================
// Client to Provider (ethers v6)
// ============================================

export function clientToProvider(client: Client<Transport, Chain>): EthersProvider {
  const { chain, transport } = client
  const network = {
    chainId: chain.id,
    name: chain.name,
    ensAddress: chain.contracts?.ensRegistry?.address,
  }

  // 处理 fallback transport（多 RPC 节点）
  if (transport.type === 'fallback') {
    const providers = (transport.transports as ReturnType<Transport>[]).map(
      ({ value }) => new JsonRpcProvider(value?.url, network)
    )
    if (providers.length === 1) return providers[0]
    return new FallbackProvider(providers)
  }

  return new JsonRpcProvider(transport.url, network)
}

/** Hook to convert viem Client to ethers.js Provider */
export function useEthersProvider({ chainId }: { chainId?: number } = {}) {
  const client = useClient<Config>({ chainId })
  return useMemo(
    () => (client ? clientToProvider(client) : undefined),
    [client]
  )
}

// ============================================
// Combined Hook (便捷导出)
// ============================================

export function useEthersAdapter({ chainId }: { chainId?: number } = {}) {
  const signer = useEthersSigner({ chainId })
  const provider = useEthersProvider({ chainId })

  return useMemo(
    () => ({
      signer,
      provider,
      // 便捷方法：检查是否已连接
      isConnected: !!signer,
    }),
    [signer, provider]
  )
}
