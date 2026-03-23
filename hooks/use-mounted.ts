/**
 * 客户端挂载状态 Hook
 * 使用 useSyncExternalStore 替代 useEffect + useState 模式
 * 避免 React 19 的 "setState within effect" 警告
 */
import { useSyncExternalStore } from 'react'

// 空的 subscribe 函数，因为我们只需要在客户端返回 true
const subscribe = () => () => {}

// 服务端快照：始终返回 false
const getServerSnapshot = () => false

// 客户端快照：始终返回 true
const getClientSnapshot = () => true

/**
 * 检测组件是否已在客户端挂载
 * 用于避免 SSR 水合错误
 */
export function useMounted(): boolean {
  return useSyncExternalStore(subscribe, getClientSnapshot, getServerSnapshot)
}
