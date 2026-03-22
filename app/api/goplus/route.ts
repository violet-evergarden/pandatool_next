/**
 * GoPlus API 代理路由
 * 保护 API Key 不暴露到客户端
 */
import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const chainId = searchParams.get('chainId')
  const address = searchParams.get('address')

  if (!chainId || !address) {
    return NextResponse.json({ error: 'Missing chainId or address' }, { status: 400 })
  }

  // 验证地址格式
  if (!/^0x[0-9a-fA-F]{40}$/.test(address)) {
    return NextResponse.json({ error: 'Invalid address format' }, { status: 400 })
  }

  try {
    const response = await fetch(
      `https://api.gopluslabs.io/api/v1/token_security/${chainId}?contract_addresses=${address}`,
      {
        headers: {
          'Content-Type': 'application/json',
        },
      }
    )

    if (!response.ok) {
      return NextResponse.json({ error: 'GoPlus API error' }, { status: response.status })
    }

    const data = await response.json()
    return NextResponse.json(data)
  } catch (error) {
    console.error('GoPlus API error:', error)
    return NextResponse.json({ error: 'Failed to fetch from GoPlus API' }, { status: 500 })
  }
}
