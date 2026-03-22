/**
 * Logo 上传 API 代理路由
 */
import { NextRequest, NextResponse } from 'next/server'

const API_UPLOAD = 'https://notifybot.pandatool.org/upload_logo_meta'
const API_KEY = process.env.LOGO_API_KEY || '9192fd41-ac91-438d-8cde-ec7408015c7d'

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()

    const response = await fetch(API_UPLOAD, {
      method: 'POST',
      headers: {
        'X-API-Key': API_KEY,
      },
      body: formData,
    })

    const result = await response.json()
    return NextResponse.json(result)
  } catch (error) {
    console.error('Logo upload error:', error)
    return NextResponse.json({ error: 'Upload failed' }, { status: 500 })
  }
}
