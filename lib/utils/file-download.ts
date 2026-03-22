/**
 * 文件下载工具
 */

/**
 * 下载文本文件
 * @param content - 文件内容
 * @param filename - 文件名
 * @param mimeType - MIME 类型
 */
export const downloadTextFile = (
  content: string,
  filename: string,
  mimeType: string = 'text/plain;charset=utf-8;'
): void => {
  const blob = new Blob([content], { type: mimeType })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = filename
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  URL.revokeObjectURL(url)
}

/**
 * 构建 CSV 内容 (带 UTF-8 BOM)
 * @param headers - 表头
 * @param rows - 数据行
 * @returns CSV 字符串
 */
export const buildCsvContent = (
  headers: string[],
  rows: Array<Record<string, string | number>>
): string => {
  const escapeValue = (val: string | number): string => {
    const str = String(val).replace(/"/g, '""')
    return /[",\n]/.test(str) ? `"${str}"` : str
  }

  const lines = [headers.join(','), ...rows.map((row) => headers.map((h) => escapeValue(row[h] ?? '')).join(','))]

  // 添加 UTF-8 BOM，防止 Excel 中文乱码
  return '\uFEFF' + lines.join('\n')
}

/**
 * 生成带时间戳的文件名
 * @param prefix - 文件名前缀
 * @param extension - 文件扩展名
 * @returns 文件名
 */
export const generateTimestampFilename = (prefix: string, extension: string): string => {
  const timestamp = new Date().toISOString().slice(0, 19).replace(/[:T]/g, '-')
  return `${prefix}_${timestamp}.${extension}`
}
