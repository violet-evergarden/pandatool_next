import { getRequestConfig } from 'next-intl/server';
import { routing } from './routing';

// 动态加载模块化的翻译文件
async function loadMessages(locale: string) {
  const messages: Record<string, unknown> = {};

  // 定义要加载的模块
  const modules = ['common', 'home', 'navigation', 'wallet', 'network', 'user', 'errors', 'metadata'];

  // 并行加载所有模块
  const loadedModules = await Promise.all(
    modules.map(async (module) => {
      try {
        const mod = await import(`../messages/${locale}/${module}.json`);
        return { module, data: mod.default };
      } catch {
        console.warn(`Missing translation module: ${locale}/${module}.json`);
        return { module, data: {} };
      }
    })
  );

  // 合并所有模块
  for (const { module, data } of loadedModules) {
    messages[module] = data;
  }

  return messages;
}

export default getRequestConfig(async ({ requestLocale }) => {
  // This typically corresponds to the `[locale]` segment
  let locale = await requestLocale;

  // Ensure that a valid locale is used
  if (!locale || !routing.locales.includes(locale as 'en' | 'zh')) {
    locale = routing.defaultLocale;
  }

  return {
    locale,
    messages: await loadMessages(locale)
  };
});
