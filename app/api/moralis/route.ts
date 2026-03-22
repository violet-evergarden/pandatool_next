/**
 * Moralis API 代理路由
 * 保护 API Key 不暴露到客户端
 */
import { NextRequest, NextResponse } from 'next/server'

const MORALIS_API_KEY = process.env.MORALIS_API_KEY || ''

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const endpoint = searchParams.get('endpoint') // 'holders' | 'metadata' | 'owners'
  const chain = searchParams.get('chain')
  const address = searchParams.get('address')

  if (!endpoint || !chain || !address) {
    return NextResponse.json({ error: 'Missing required parameters' }, { status: 400 })
  }

  // 验证地址格式
  if (!/^0x[0-9a-fA-F]{40}$/.test(address)) {
    return NextResponse.json({ error: 'Invalid address format' }, { status: 400 })
  }

  if (!MORALIS_API_KEY) {
    return NextResponse.json({ error: 'Moralis API key not configured' }, { status: 500 })
  }

  let url: string
  switch (endpoint) {
    case 'holders':
      url = `https://deep-index.moralis.io/api/v2.2/erc20/${address}/holders?chain=${chain}`
      break
    case 'metadata':
      url = `https://deep-index.moralis.io/api/v2.2/erc20/metadata?addresses=${address}&chain=${chain}`
      break
    case 'owners':
      url = `https://deep-index.moralis.io/api/v2.2/erc20/${address}/owners?chain=${chain}&order=DESC`
      // 支持分页参数
      const pageSize = searchParams.get('pageSize')
      const cursor = searchParams.get('cursor')
      if (pageSize) url += `&page_size=${pageSize}`
      if (cursor) url += `&cursor=${encodeURIComponent(cursor)}`
      break
    default:
      return NextResponse.json({ error: 'Invalid endpoint' }, { status: 400 })
  }

  try {
    const response = await fetch(url, {
      headers: {
        accept: 'application/json',
        'X-API-Key': MORALIS_API_KEY,
      },
    })

    if (!response.ok) {
      return NextResponse.json({ error: 'Moralis API error' }, { status: response.status })
    }

    const data = await response.json()
    return NextResponse.json(data)
  } catch (error) {
    console.error('Moralis API error:', error)
    return NextResponse.json({ error: 'Failed to fetch from Moralis API' }, { status: 500 })
  }
}
