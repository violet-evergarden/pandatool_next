/**
 * Etherscan API 代理路由
 * 保护 API Key 不暴露到客户端
 */
import { NextRequest, NextResponse } from 'next/server'

const ETHERSCAN_API_KEY = process.env.ETHERSCAN_API_KEY || 'KHB45GZ3M8A252H6FNGE9ADCBP3JNNPUQG'

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const chainId = searchParams.get('chainId')
  const address = searchParams.get('address')
  const action = searchParams.get('action') || 'getsourcecode'

  if (!chainId || !address) {
    return NextResponse.json({ error: 'Missing chainId or address' }, { status: 400 })
  }

  // 验证地址格式
  if (!/^0x[0-9a-fA-F]{40}$/.test(address)) {
    return NextResponse.json({ error: 'Invalid address format' }, { status: 400 })
  }

  try {
    const url = new URL('https://api.etherscan.io/v2/api')
    url.searchParams.set('module', 'contract')
    url.searchParams.set('action', action)
    url.searchParams.set('chainid', chainId)
    url.searchParams.set('address', address)
    url.searchParams.set('apikey', ETHERSCAN_API_KEY)

    const response = await fetch(url.toString(), {
      headers: {
        'Content-Type': 'application/json',
      },
    })

    if (!response.ok) {
      return NextResponse.json({ error: 'Etherscan API error' }, { status: response.status })
    }

    const data = await response.json()
    return NextResponse.json(data)
  } catch (error) {
    console.error('Etherscan API error:', error)
    return NextResponse.json({ error: 'Failed to fetch from Etherscan API' }, { status: 500 })
  }
}
