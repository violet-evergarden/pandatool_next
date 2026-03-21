'use client'

import { useState, useEffect } from 'react'
import { formatEther } from 'ethers'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import {
  useEthersSigner,
  useEthersProvider,
  useEthersAdapter,
} from '@/hooks/use-ethers-adapter'
import { useAccount } from 'wagmi'

// 示例 1: 基础信息展示
function AccountInfo() {
  const { isConnected, address, chain } = useAccount()
  const { signer, provider } = useEthersAdapter()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  // 服务端渲染时显示加载状态，避免水合错误
  if (!mounted) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>账户信息</CardTitle>
          <CardDescription>加载中...</CardDescription>
        </CardHeader>
      </Card>
    )
  }

  if (!isConnected) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>账户信息</CardTitle>
          <CardDescription>请先连接钱包</CardDescription>
        </CardHeader>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>账户信息</CardTitle>
        <CardDescription>当前连接的账户详情</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid gap-2">
          <Label className="text-muted-foreground">地址</Label>
          <code className="text-sm bg-muted p-2 rounded break-all">
            {address}
          </code>
        </div>
        <div className="grid gap-2">
          <Label className="text-muted-foreground">链</Label>
          <code className="text-sm bg-muted p-2 rounded">
            {chain?.name} (ID: {chain?.id})
          </code>
        </div>
        <div className="grid gap-2">
          <Label className="text-muted-foreground">Signer 状态</Label>
          <code className="text-sm bg-muted p-2 rounded">
            {signer ? '✅ 已就绪' : '❌ 未就绪'}
          </code>
        </div>
        <div className="grid gap-2">
          <Label className="text-muted-foreground">Provider 状态</Label>
          <code className="text-sm bg-muted p-2 rounded">
            {provider ? '✅ 已就绪' : '❌ 未就绪'}
          </code>
        </div>
      </CardContent>
    </Card>
  )
}

// 示例 2: 签名消息
function SignMessage() {
  const signer = useEthersSigner()
  const [message, setMessage] = useState('Hello, Ethers.js!')
  const [signature, setSignature] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const handleSign = async () => {
    if (!signer) {
      toast.error('请先连接钱包')
      return
    }

    setIsLoading(true)
    try {
      const sig = await signer.signMessage(message)
      setSignature(sig)
      toast.success('消息签名成功')
    } catch (error) {
      console.error(error)
      toast.error('签名失败: ' + (error as Error).message)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>签名消息</CardTitle>
        <CardDescription>使用 ethers.js Signer 签名消息</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid gap-2">
          <Label htmlFor="message">消息内容</Label>
          <Input
            id="message"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="输入要签名的消息"
          />
        </div>
        <Button onClick={handleSign} disabled={!signer || isLoading}>
          {isLoading ? '签名中...' : '签名消息'}
        </Button>
        {signature && (
          <div className="grid gap-2">
            <Label className="text-muted-foreground">签名结果</Label>
            <code className="text-xs bg-muted p-2 rounded break-all">
              {signature}
            </code>
          </div>
        )}
      </CardContent>
    </Card>
  )
}

// 示例 3: 读取余额
function ReadBalance() {
  const provider = useEthersProvider()
  const { address } = useAccount()
  const [targetAddress, setTargetAddress] = useState('')
  const [balance, setBalance] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const handleGetBalance = async () => {
    if (!provider) {
      toast.error('Provider 未就绪')
      return
    }

    const addr = targetAddress || address
    if (!addr) {
      toast.error('请输入地址')
      return
    }

    setIsLoading(true)
    try {
      const bal = await provider.getBalance(addr)
      setBalance(formatEther(bal))
      toast.success('余额获取成功')
    } catch (error) {
      console.error(error)
      toast.error('获取余额失败: ' + (error as Error).message)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>读取余额</CardTitle>
        <CardDescription>使用 ethers.js Provider 读取账户余额</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid gap-2">
          <Label htmlFor="address">目标地址 (留空则查询当前账户)</Label>
          <Input
            id="address"
            value={targetAddress}
            onChange={(e) => setTargetAddress(e.target.value)}
            placeholder="输入以太坊地址 (留空查询当前账户)"
          />
        </div>
        <Button onClick={handleGetBalance} disabled={!provider || isLoading}>
          {isLoading ? '查询中...' : '查询余额'}
        </Button>
        {balance && (
          <div className="grid gap-2">
            <Label className="text-muted-foreground">余额 (ETH)</Label>
            <code className="text-sm bg-muted p-2 rounded">{balance}</code>
          </div>
        )}
      </CardContent>
    </Card>
  )
}

// 示例 4: 发送交易
function SendTransaction() {
  const signer = useEthersSigner()
  const [toAddress, setToAddress] = useState('')
  const [amount, setAmount] = useState('0.001')
  const [txHash, setTxHash] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const handleSend = async () => {
    if (!signer) {
      toast.error('请先连接钱包')
      return
    }

    if (!toAddress) {
      toast.error('请输入接收地址')
      return
    }

    setIsLoading(true)
    try {
      const tx = await signer.sendTransaction({
        to: toAddress,
        value: BigInt(Math.floor(parseFloat(amount) * 1e18)),
      })
      setTxHash(tx.hash)
      toast.success('交易已发送')
    } catch (error) {
      console.error(error)
      toast.error('发送失败: ' + (error as Error).message)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>发送交易</CardTitle>
        <CardDescription>使用 ethers.js Signer 发送 ETH</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid gap-2">
          <Label htmlFor="to">接收地址</Label>
          <Input
            id="to"
            value={toAddress}
            onChange={(e) => setToAddress(e.target.value)}
            placeholder="0x..."
          />
        </div>
        <div className="grid gap-2">
          <Label htmlFor="amount">金额 (ETH)</Label>
          <Input
            id="amount"
            type="number"
            step="0.0001"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="0.001"
          />
        </div>
        <Button onClick={handleSend} disabled={!signer || isLoading}>
          {isLoading ? '发送中...' : '发送交易'}
        </Button>
        {txHash && (
          <div className="grid gap-2">
            <Label className="text-muted-foreground">交易哈希</Label>
            <code className="text-xs bg-muted p-2 rounded break-all">
              {txHash}
            </code>
          </div>
        )}
      </CardContent>
    </Card>
  )
}

// 示例 5: 获取区块信息
function GetBlockInfo() {
  const provider = useEthersProvider()
  const [blockNumber, setBlockNumber] = useState('')
  const [blockInfo, setBlockInfo] = useState<Record<string, unknown>>()
  const [isLoading, setIsLoading] = useState(false)

  const handleGetBlock = async () => {
    if (!provider) {
      toast.error('Provider 未就绪')
      return
    }

    setIsLoading(true)
    try {
      const block = await provider.getBlock(
        blockNumber ? parseInt(blockNumber) : 'latest'
      )
      if (block) {
        setBlockInfo({
          number: block.number,
          hash: block.hash,
          timestamp: new Date(Number(block.timestamp) * 1000).toLocaleString(),
          transactions: block.transactions.length,
          gasUsed: block.gasUsed.toString(),
          gasLimit: block.gasLimit.toString(),
        })
        toast.success('区块信息获取成功')
      }
    } catch (error) {
      console.error(error)
      toast.error('获取区块失败: ' + (error as Error).message)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>区块信息</CardTitle>
        <CardDescription>使用 ethers.js Provider 获取区块信息</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid gap-2">
          <Label htmlFor="block">区块号 (留空则查询最新区块)</Label>
          <Input
            id="block"
            type="number"
            value={blockNumber}
            onChange={(e) => setBlockNumber(e.target.value)}
            placeholder="latest"
          />
        </div>
        <Button onClick={handleGetBlock} disabled={!provider || isLoading}>
          {isLoading ? '查询中...' : '查询区块'}
        </Button>
        {blockInfo && (
          <div className="grid gap-2">
            <Label className="text-muted-foreground">区块详情</Label>
            <pre className="text-xs bg-muted p-2 rounded overflow-auto">
              {JSON.stringify(blockInfo, null, 2)}
            </pre>
          </div>
        )}
      </CardContent>
    </Card>
  )
}

// 主页面组件
export default function EthersAdapterPage() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold">Ethers.js Adapter</h1>
        <p className="text-muted-foreground mt-2">
          将 viem/wagmi 客户端转换为 ethers.js Signer 和 Provider，
          方便与只支持 ethers.js 的 SDK 集成。
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <AccountInfo />
        <SignMessage />
        <ReadBalance />
        <SendTransaction />
        <GetBlockInfo />
      </div>

      <Card>
        <CardHeader>
          <CardTitle>使用方法</CardTitle>
          <CardDescription>在项目中使用 ethers adapter hooks</CardDescription>
        </CardHeader>
        <CardContent>
          <pre className="text-xs bg-muted p-4 rounded overflow-auto">
{`import { useEthersSigner, useEthersProvider, useEthersAdapter } from '@/hooks/use-ethers-adapter'

// 方式 1: 分别获取 signer 和 provider
const signer = useEthersSigner()
const provider = useEthersProvider({ chainId: 1 })

// 方式 2: 使用组合 hook
const { signer, provider, isConnected } = useEthersAdapter()

// 与 ethers 兼容的 SDK 集成
import { Contract } from 'ethers'
const contract = new Contract(address, abi, signer)`}
          </pre>
        </CardContent>
      </Card>
    </div>
  )
}
