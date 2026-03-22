# PandaTool Next

一个基于 Next.js 16 的 Web3 工具集项目，支持多语言和钱包连接。

## 技术栈

- **框架**: Next.js 16.2.0 (App Router)
- **React**: 19.2.4
- **样式**: Tailwind CSS v4
- **国际化**: next-intl
- **Web3**: wagmi + viem + ethers.js
- **UI 组件**: shadcn/ui + Radix UI
- **图标**: Lucide React
- **通知**: Sonner

## 快速开始

### 安装依赖

```bash
pnpm install
```

### 环境变量

创建 `.env.local` 文件：

```env
NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID=your_project_id
```

### 开发命令

```bash
pnpm dev      # 启动开发服务器
pnpm build    # 构建生产版本
pnpm start    # 启动生产服务器
pnpm lint     # 运行 ESLint
```

---

## 项目结构

```
pandatool_next/
├── app/
│   └── [locale]/                    # 国际化路由
│       ├── layout.tsx               # 根布局
│       ├── page.tsx                 # 首页
│       ├── examples/                # 示例页面
│       │   ├── page.tsx
│       │   └── ethers-adapter/
│       └── tool/                    # 工具页面
│           ├── logo/                # Logo 提交工具
│           │   ├── page.tsx
│           │   └── _components/
│           └── snapshot-token/      # 代币快照工具
│               └── page.tsx
├── components/
│   ├── ui/                          # shadcn/ui 组件
│   ├── providers/                   # Context Providers
│   ├── app-sidebar.tsx              # 应用侧边栏
│   ├── nav-main.tsx                 # 主导航
│   ├── team-switcher.tsx            # 团队切换
│   ├── locale-switcher.tsx          # 语言切换
│   └── site-header.tsx              # 站点头部
├── hooks/
│   ├── use-mobile.ts                # 移动端检测
│   └── use-ethers-adapter.ts        # Ethers.js 适配器
├── lib/
│   ├── nav-data.ts                  # 导航数据配置
│   ├── wagmi-config.ts              # Wagmi 配置
│   └── utils.ts                     # 工具函数 (cn 等)
├── messages/
│   ├── zh/                          # 中文翻译
│   │   ├── common.json
│   │   ├── navigation.json
│   │   ├── token-logo.json
│   │   └── snapshot-token.json
│   └── en/                          # 英文翻译
│       ├── common.json
│       ├── navigation.json
│       ├── token-logo.json
│       └── snapshot-token.json
├── i18n/
│   ├── request.ts                   # i18n 请求配置
│   └── routing.ts                   # 国际化路由配置
└── public/                          # 静态资源
```

---

## 开发规范

### 1. 页面开发规范

#### 1.1 新增页面流程

1. **创建页面目录**

```
app/[locale]/tool/{tool-name}/
├── page.tsx              # 主页面
└── _components/          # 页面私有组件 (可选)
    └── xxx-uploader.tsx
```

2. **创建翻译文件**

```json
// messages/zh/{tool-name}.json
{
  "title": "工具名称",
  "description": "工具描述",
  "errors": {
    "invalidInput": "输入无效"
  }
}

// messages/en/{tool-name}.json
{
  "title": "Tool Name",
  "description": "Tool description",
  "errors": {
    "invalidInput": "Invalid input"
  }
}
```

3. **注册翻译模块**

```typescript
// i18n/request.ts
const modules = ['common', 'navigation', '{tool-name}']
```

4. **添加导航菜单**

```typescript
// lib/nav-data.ts
{
  titleKey: "tool",
  url: "/tool",
  icon: Wrench,
  items: [
    {
      titleKey: "{toolName}",  // 对应 navigation.json 中的键
      url: "/tool/{tool-name}",
    },
  ],
}
```

5. **更新导航翻译**

```json
// messages/zh/navigation.json
{
  "menu": {
    "{toolName}": "工具中文名"
  }
}
```

#### 1.2 页面组件模板

```tsx
'use client'

import { useTranslations } from 'next-intl'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { toast } from 'sonner'

export default function ToolPage() {
  const t = useTranslations('{tool-name}')

  const handleSubmit = async () => {
    try {
      // 业务逻辑
      toast.success(t('success'))
    } catch (error) {
      toast.error(t('errors.failed'))
    }
  }

  return (
    <div className="flex justify-center py-8">
      <Card className="w-full max-w-3xl">
        <CardHeader>
          <CardTitle className="text-center text-2xl">{t('title')}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* 表单内容 */}
          <Button onClick={handleSubmit}>{t('submit')}</Button>
        </CardContent>
      </Card>
    </div>
  )
}
```

### 2. 组件开发规范

#### 2.1 组件目录结构

```
components/
├── ui/                    # shadcn/ui 基础组件 (不要手动修改)
│   ├── button.tsx
│   ├── card.tsx
│   └── ...
├── providers/             # Context Providers
│   └── wagmi-provider.tsx
└── xxx-component.tsx      # 业务组件
```

#### 2.2 组件命名规范

| 类型 | 命名规范 | 示例 |
|------|----------|------|
| 页面组件 | `XxxPage` | `TokenLogoPage` |
| 业务组件 | `XxxUploader` | `LogoUploader` |
| UI 组件 | 小写 kebab-case | `button.tsx` |
| Hook | `use-xxx.ts` | `use-ethers-adapter.ts` |

#### 2.3 组件导入规范

```tsx
// ✅ 推荐：使用 @ 别名
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { toast } from 'sonner'

// ❌ 避免：相对路径
import { Button } from '../../components/ui/button'
```

### 3. 国际化规范

#### 3.1 翻译键命名规范

```json
{
  "title": "页面标题",
  "description": "描述",
  "label": "标签",
  "placeholder": "占位符",
  "button": "按钮文字",
  "errors": {
    "invalidAddress": "地址无效",
    "networkError": "网络错误"
  },
  "success": {
    "submitted": "提交成功"
  }
}
```

#### 3.2 使用翻译

```tsx
import { useTranslations } from 'next-intl'

// 在组件中使用
const t = useTranslations('{module-name}')

// 基础用法
<h1>{t('title')}</h1>

// 嵌套键
<p>{t('errors.invalidAddress')}</p>

// 带参数
<p>{t('greeting', { name: 'User' })}</p>
```

### 4. Web3 开发规范

#### 4.1 钱包连接

```tsx
import { useAccount, useConnect, useDisconnect } from 'wagmi'

export function WalletButton() {
  const { address, isConnected } = useAccount()
  const { connect, connectors } = useConnect()
  const { disconnect } = useDisconnect()

  if (isConnected) {
    return (
      <Button onClick={() => disconnect()}>
        {address?.slice(0, 6)}...{address?.slice(-4)}
      </Button>
    )
  }

  return (
    <Button onClick={() => connect({ connector: connectors[0] })}>
      Connect Wallet
    </Button>
  )
}
```

#### 4.2 合约交互

```tsx
import { useReadContract, useWriteContract } from 'wagmi'
import { parseUnits } from 'viem'

const ERC20_ABI = [
  {
    inputs: [{ name: 'account', type: 'address' }],
    name: 'balanceOf',
    outputs: [{ name: '', type: 'uint256' }],
    stateMutability: 'view',
    type: 'function',
  },
] as const

// 读取合约
const { data: balance } = useReadContract({
  address: '0x...',
  abi: ERC20_ABI,
  functionName: 'balanceOf',
  args: [userAddress],
})

// 写入合约
const { writeContract } = useWriteContract()

const handleTransfer = () => {
  writeContract({
    address: '0x...',
    abi: ERC20_ABI,
    functionName: 'transfer',
    args: [toAddress, parseUnits('100', 18)],
  })
}
```

### 5. 样式规范

#### 5.1 Tailwind CSS 使用

```tsx
// ✅ 推荐：使用 cn() 工具函数处理条件样式
import { cn } from '@/lib/utils'

<div className={cn(
  'base-class',
  isActive && 'active-class',
  className
)}>

// ❌ 避免：内联样式
<div style={{ color: 'red' }}>
```

#### 5.2 响应式设计

```tsx
// 移动端优先
<div className="
  flex flex-col           // 默认：纵向排列
  sm:flex-row             // sm 及以上：横向排列
  gap-2 sm:gap-4          // 间距
  p-4 sm:p-6              // 内边距
">
```

### 6. 代码提交规范

#### 6.1 Commit Message 格式

```
<type>(<scope>): <subject>

<body>

Co-Authored-By: Claude Opus 4.6 <noreply@anthropic.com>
```

#### 6.2 Type 类型

| Type | 描述 |
|------|------|
| `feat` | 新功能 |
| `fix` | Bug 修复 |
| `refactor` | 重构 |
| `style` | 样式修改 |
| `docs` | 文档更新 |
| `chore` | 构建/工具变动 |

#### 6.3 示例

```bash
feat(tool): 添加 Token Snapshot 快照工具

- 支持多链选择：BSC, Ethereum, Base, Polygon, Arbitrum
- 快速筛选 TOP100-10000
- 导出格式 CSV/TXT
- 使用 Moralis API 获取数据

Co-Authored-By: Claude Opus 4.6 <noreply@anthropic.com>
```

### 7. API 密钥管理

```typescript
// ✅ 推荐：使用环境变量
const API_KEY = process.env.NEXT_PUBLIC_API_KEY

// ⚠️ 注意：敏感 API 不要暴露到客户端
// 使用 NEXT_PUBLIC_ 前缀的变量会暴露到浏览器

// ❌ 避免：硬编码密钥
const API_KEY = 'sk-xxxxx'  // 不要这样做！
```

---

## 页面路由

| 路径 | 描述 |
|------|------|
| `/` | 首页 |
| `/{locale}/examples` | UI 组件示例 |
| `/{locale}/examples/ethers-adapter` | Ethers.js Adapter 示例 |
| `/{locale}/tool/logo` | Token Logo 提交工具 |
| `/{locale}/tool/snapshot-token` | Token 持有者快照工具 |

---

## 许可证

MIT
