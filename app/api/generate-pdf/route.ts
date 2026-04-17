import { NextRequest, NextResponse } from 'next/server'
import chromium from '@sparticuz/chromium'
import puppeteer from 'puppeteer-core'

// 本地开发 fallback：macOS Chrome 路径
const LOCAL_CHROME_PATH =
  '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome'

export async function POST(request: NextRequest) {
  const body = await request.json()
  const { html } = body

  if (!html) {
    return NextResponse.json({ error: 'Missing html' }, { status: 400 })
  }

  let browser

  try {
    // Vercel 环境用 @sparticuz/chromium，本地开发用系统 Chrome
    const isVercel = !!process.env.VERCEL
    const executablePath = isVercel
      ? await chromium.executablePath()
      : LOCAL_CHROME_PATH

    browser = await puppeteer.launch({
      args: isVercel ? chromium.args : ['--no-sandbox', '--disable-setuid-sandbox'],
      defaultViewport: { width: 794, height: 1123 },
      executablePath,
      headless: true,
    })

    const page = await browser.newPage()
    await page.setContent(html, { waitUntil: 'networkidle0' })

    const pdfBuffer = await page.pdf({
      format: 'a4',
      printBackground: true,
      margin: { top: '10mm', bottom: '10mm', left: '10mm', right: '10mm' },
    })

    await browser.close()

    return new NextResponse(Buffer.from(pdfBuffer), {
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': 'attachment; filename="audit_report.pdf"',
      },
    })
  } catch (error) {
    console.error('PDF generation error:', error)
    if (browser) await browser.close()
    return NextResponse.json(
      { error: 'PDF generation failed' },
      { status: 500 }
    )
  }
}
