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

## 功能特性

### 🌐 国际化支持
- 支持中文 (zh) 和英文 (en)
- 基于 URL 的语言切换 (`/zh/...`, `/en/...`)
- 完整的导航和菜单翻译

### 🔗 Web3 集成
- 钱包连接
- 多链支持 (Ethereum, Polygon, Arbitrum, Optimism, Base)
- 网络切换

### 🔧 Ethers.js Adapters
提供 viem 到 ethers.js 的转换 hooks，方便与只支持 ethers.js 的 SDK 集成：

```tsx
import { useEthersSigner, useEthersProvider, useEthersAdapter } from '@/hooks/use-ethers-adapter'

// 获取 ethers Signer
const signer = useEthersSigner()

// 获取 ethers Provider
const provider = useEthersProvider({ chainId: 1 })

// 组合使用
const { signer, provider, isConnected } = useEthersAdapter()
```

### 🎨 UI 组件
- 响应式侧边栏导航
- 团队切换器
- 语言切换器
- Toast 通知 (Sonner)
- 完整的 shadcn/ui 组件库

## 快速开始

### 安装依赖

支持多种包管理器：

```bash
# pnpm (推荐)
pnpm install

# npm
npm install

# yarn
yarn install

# bun
bun install
```

### 环境变量

创建 `.env.local` 文件：

```env
NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID=your_project_id
```

### 开发模式

```bash
# pnpm
pnpm dev

# npm
npm run dev

# yarn
yarn dev

# bun
bun dev
```

访问 [http://localhost:3000](http://localhost:3000)

### 构建生产版本

```bash
# pnpm
pnpm build
pnpm start

# npm
npm run build
npm run start

# yarn
yarn build
yarn start

# bun
bun run build
bun run start
```

## 项目结构

```
pandatool_next/
├── app/
│   └── [locale]/           # 国际化路由
│       ├── layout.tsx      # 根布局
│       ├── page.tsx        # 首页
│       └── examples/       # 示例页面
│           ├── page.tsx    # UI 组件示例
│           └── ethers-adapter/  # Ethers.js Adapter 示例
├── components/
│   ├── ui/                 # shadcn/ui 组件
│   ├── app-sidebar.tsx     # 应用侧边栏
│   ├── nav-main.tsx        # 主导航
│   ├── team-switcher.tsx   # 团队切换
│   ├── locale-switcher.tsx # 语言切换
│   └── site-header.tsx     # 站点头部
├── hooks/
│   ├── use-mobile.ts       # 移动端检测
│   └── use-ethers-adapter.ts  # Ethers.js 适配器
├── lib/
│   ├── nav-data.ts         # 导航数据
│   ├── wagmi-config.ts     # Wagmi 配置
│   └── utils.ts            # 工具函数
├── messages/
│   ├── zh/                 # 中文翻译
│   └── en/                 # 英文翻译
└── i18n/
    └── routing.ts          # 国际化路由配置
```

## 示例页面

| 路径 | 描述 |
|------|------|
| `/zh/examples` | UI 组件示例 (Button, Toast, Dialog 等) |
| `/zh/examples/ethers-adapter` | Ethers.js Adapter 使用示例 |

## 开发命令

| 命令 | 描述 | pnpm | npm | yarn | bun |
|------|------|------|-----|------|-----|
| dev | 启动开发服务器 | `pnpm dev` | `npm run dev` | `yarn dev` | `bun dev` |
| build | 构建生产版本 | `pnpm build` | `npm run build` | `yarn build` | `bun run build` |
| start | 启动生产服务器 | `pnpm start` | `npm run start` | `yarn start` | `bun run start` |
| lint | 运行 ESLint | `pnpm lint` | `npm run lint` | `yarn lint` | `bun run lint` |

## 许可证

MIT
