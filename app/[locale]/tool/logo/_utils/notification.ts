/**
 * Logo 页面通知消息工具
 */

import { EXPLORER_URL } from '@/lib/constants/chains'

/** 构建订单通知消息 */
export function buildOrderMessage(
  platform: string,
  txHash: string,
  metaUri: string,
  chainId: number
): string {
  return `
<b>📣📣📣  LOGO业务订单  📣📣📣</b>
<b>平台:</b>\n<code>${platform}</code>\n
<b>付款哈希:</b>\n${EXPLORER_URL[chainId] + txHash} \n
<b>资料：</b>\n${metaUri} \n`
}
