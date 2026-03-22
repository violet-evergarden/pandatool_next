/**
 * Logo 通知 API 代理路由
 */
import { NextRequest, NextResponse } from 'next/server'

const API_NOTIFY = 'https://notifybot.pandatool.org/sendBot'
const API_KEY = process.env.LOGO_API_KEY || '9192fd41-ac91-438d-8cde-ec7408015c7d'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    const response = await fetch(API_NOTIFY, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-API-Key': API_KEY,
      },
      body: JSON.stringify(body),
    })

    const result = await response.json()
    return NextResponse.json(result)
  } catch (error) {
    console.error('Logo notify error:', error)
    return NextResponse.json({ error: 'Notify failed' }, { status: 500 })
  }
}
