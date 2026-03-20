import { NextRequest, NextResponse } from 'next/server';
import createMiddleware from 'next-intl/middleware';
import { routing } from './i18n/routing';

/**
 * Next.js 16 Proxy (formerly Middleware)
 *
 * 迁移说明：
 * - middleware.ts → proxy.ts
 * - export function middleware → export function proxy
 * - matcher 配置保持不变
 *
 * 功能：
 * - 国际化路由处理 (next-intl)
 * - 自动语言检测和重定向
 */

// 创建 next-intl 中间件实例
const intlMiddleware = createMiddleware(routing);

/**
 * 代理函数 - 处理所有传入请求
 *
 * @param request - Next.js 请求对象
 * @returns NextResponse - 响应对象
 */
export function proxy(request: NextRequest): NextResponse {
  // 调用 next-intl 中间件处理国际化路由
  return intlMiddleware(request);
}

/**
 * 配置 - 定义哪些路径需要经过 proxy
 *
 * 排除以下路径：
 * - /api - API 路由
 * - /_next - Next.js 内部资源
 * - /_vercel - Vercel 平台资源
 * - 包含点的文件（如 favicon.ico, 图片等静态资源）
 */
export const config = {
  matcher: [
    // 匹配所有路径，排除 api、_next、_vercel 和静态文件
    '/((?!api|_next|_vercel|.*\\..*).*)'
  ]
};
