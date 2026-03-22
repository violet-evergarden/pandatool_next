// 屃息合 contract-check 数据 夻 utils/data-processor.ts
// Data processing utilities for contract check

// 用于 transform GoPlus API data into display format

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type TFunction = (key: string, params?: Record<string, any>) => string

// Types
export interface ContractData {
  chain_name: string
  token_name?: string
  token_symbol?: string
  total_supply?: string
  creator_address?: string
  owner_address?: string
  is_open_source?: string
  buy_tax?: string
  sell_tax?: string
  is_honeypot?: string
  is_mintable?: string
  is_proxy?: string
  trading_cooldown?: string
  transfer_pausable?: string
  is_whitelisted?: string
  is_blacklisted?: string
  selfdestruct?: string
  can_take_back_ownership?: string
  holders?: HolderItem[]
  holder_count?: string
  lp_holders?: MarketInfoItem[]
  lp_holder_count?: string
  dex?: Array<{ name: string; liquidity: string; pair: string }>
  is_panda_tool?: boolean
}

export interface BaseInfoItem {
  name: string
  value: string
  tags?: string
  color?: 'success' | 'danger' | 'orange' | 'default'
}

export interface SecurityInfoItem {
  name: string
  value: string
  color?: 'success' | 'danger' | 'orange' | 'default'
}

export interface HolderItem {
  address: string
  tag: string
  is_contract: number
  balance: string
  percent: string
  is_locked: number
  locked_detail?: Array<{
    amount: string
    end_time: string
    opt_time: string
  }>
}

export type MarketInfoItem = HolderItem

// 处理基本信息
export function handleBaseInfo(data: ContractData, t: TFunction): BaseInfoItem[] {
  const res: BaseInfoItem[] = []

  res.push({
    name: t('labels.network'),
    value: '',
    tags: data.chain_name,
  })

  if (data.token_name) {
    res.push({
      name: t('labels.tokenName'),
      value: '',
      tags: data.token_name,
    })
  }

  if (data.token_symbol) {
    res.push({
      name: t('labels.tokenSymbol'),
      value: '',
      tags: data.token_symbol,
    })
  }

  if (data.total_supply) {
    res.push({
      name: t('labels.totalSupply'),
      value: '',
      tags: data.total_supply,
    })
  }

  if (data.creator_address) {
    const subAddr =
      data.creator_address.substring(0, 6) +
      '...' +
      data.creator_address.substring(36, 42)
    res.push({
      name: t('labels.creatorAddress'),
      value: data.creator_address,
      tags: subAddr,
    })
  }

  if (data.owner_address) {
    const isRenounced =
      data.owner_address === '0x000000000000000000000000000000000000dead' ||
      data.owner_address === '0x0000000000000000000000000000000000000000' ||
      data.owner_address === ''
    res.push({
      name: t('labels.ownerAddress'),
      value: '',
      tags: isRenounced ? t('values.ownershipRenounced') : t('values.ownershipNotRenounced'),
      color: isRenounced ? 'success' : 'danger',
    })
  }

  if (data.is_open_source) {
    const isOpen = data.is_open_source === '1'
    res.push({
      name: t('labels.isOpenSource'),
      value: '',
      tags: isOpen ? t('values.openSource') : t('values.notOpenSource'),
      color: isOpen ? 'success' : 'danger',
    })
  }

  return res
}

// 处理安全信息
export function handleSecurityInfo(data: ContractData, t: TFunction): SecurityInfoItem[] {
  const res: SecurityInfoItem[] = []
  const isPandaTool = data.is_panda_tool || false

  // 买入费率
  if (data.buy_tax !== undefined) {
    const tax = Number(data.buy_tax) * 100
    res.push({
      name: t('labels.buyTax'),
      value: `${tax}%`,
      color: 'default',
    })
  }

  // 卖出费率
  if (data.sell_tax !== undefined) {
    const tax = Number(data.sell_tax) * 100
    res.push({
      name: t('labels.sellTax'),
      value: `${tax}%`,
      color: 'default',
    })
  }

  // 是否貔貅盘
  if (data.is_honeypot !== undefined) {
    const isHoneypot = data.is_honeypot === '1'
    res.push({
      name: t('labels.isHoneypot'),
      value: isPandaTool ? t('values.safe') : (isHoneypot ? t('values.honeypot') : t('values.safe')),
      color: isPandaTool || !isHoneypot ? 'success' : 'danger',
    })
  }

  // 是否可增发
  if (data.is_mintable !== undefined) {
    const isMintable = data.is_mintable === '1'
    res.push({
      name: t('labels.isMintable'),
      value: isMintable ? t('values.mintable') : t('values.notMintable'),
      color: isMintable ? 'danger' : 'success',
    })
  }

  // 是否代理合约
  if (data.is_proxy !== undefined) {
    const isProxy = data.is_proxy === '1'
    res.push({
      name: t('labels.isProxy'),
      value: isProxy ? t('values.proxy') : t('values.notProxy'),
      color: isProxy ? 'danger' : 'success',
    })
  }

  // 是否交易冷却
  if (data.trading_cooldown !== undefined) {
    const hasCooldown = data.trading_cooldown === '1'
    res.push({
      name: t('labels.tradingCooldown'),
      value: hasCooldown ? t('values.cooldown') : t('values.noCooldown'),
      color: hasCooldown ? 'danger' : 'success',
    })
  }

  // 是否暂停交易
  if (data.transfer_pausable !== undefined) {
    const isPausable = data.transfer_pausable === '1'
    res.push({
      name: t('labels.transferPausable'),
      value: isPandaTool ? t('values.safe') : (isPausable ? t('values.pausable') : t('values.safe')),
      color: isPandaTool || !isPausable ? 'success' : 'danger',
    })
  }

  // 是否有白名单
  if (data.is_whitelisted !== undefined) {
    const hasWhitelist = data.is_whitelisted === '1'
    res.push({
      name: t('labels.isWhitelisted'),
      value: isPandaTool ? t('values.safe') : (hasWhitelist ? t('values.hasWhitelist') : t('values.noWhitelist')),
      color: isPandaTool || !hasWhitelist ? 'success' : 'orange',
    })
  }

  // 是否有黑名单
  if (data.is_blacklisted !== undefined) {
    const hasBlacklist = data.is_blacklisted === '1'
    res.push({
      name: t('labels.isBlacklisted'),
      value: isPandaTool ? t('values.safe') : (hasBlacklist ? t('values.hasBlacklist') : t('values.noBlacklist')),
      color: isPandaTool || !hasBlacklist ? 'success' : 'orange',
    })
  }

  // 合约能否自毁
  if (data.selfdestruct !== undefined) {
    const canSelfDestruct = data.selfdestruct === '1'
    res.push({
      name: t('labels.selfDestruct'),
      value: canSelfDestruct ? t('values.canSelfDestruct') : t('values.cannotSelfDestruct'),
      color: canSelfDestruct ? 'danger' : 'success',
    })
  }

  // 是否能找回权限
  if (data.can_take_back_ownership !== undefined) {
    const canTakeBack = data.can_take_back_ownership === '1'
    res.push({
      name: t('labels.canTakeBackOwnership'),
      value: canTakeBack ? t('values.canTakeBack') : t('values.cannotTakeBack'),
      color: canTakeBack ? 'danger' : 'success',
    })
  }

  return res
}

// 处理做市信息
export function handleMarketInfo(data: ContractData): MarketInfoItem[] | null {
  return data.lp_holders || null
}

// 处理持币信息
export function handleHolderInfo(data: ContractData): HolderItem[] | null {
  return data.holders || null
}

// 计算持有者 TOP10 百分比
export function getHolderTop10Percent(holders: HolderItem[] | undefined): number {
  if (!holders || holders.length === 0) return 0
  return holders.slice(0, 10).reduce((sum, holder) => sum + Number(holder.percent) * 1, 0) * 100
}

// 检查是否放弃所有权
export function isOwnershipRenounced(ownerAddress: string | undefined): boolean {
  return (
    ownerAddress === '0x000000000000000000000000000000000000dead' ||
    ownerAddress === '0x0000000000000000000000000000000000000000' ||
    ownerAddress === ''
  )
}
