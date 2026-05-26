import { en } from './locales/en';
import { zh } from './locales/zh';

export type SupportedLocale = 'en' | 'zh';

/**
 * 翻译解析函数，从对应的语言字典中安全提取文案。
 * 如果找不到 key 对应的翻译，按照编码规范，禁止兜底或静默处理，而是直接抛出 Error 以尽早发现漏翻的 UI 文案。
 * 
 * @param key 翻译键名，支持点号分隔 (例如 'nav.home')
 * @param lang 目标语言，目前支持 'en' 和 'zh'
 * @returns 对应的翻译字符串
 */
export function t(key: string, lang: string | null | undefined): string {
  if (!key) {
    throw new Error('i18n: 必须提供非空的翻译 key！');
  }

  // 严格处理参数缺失，不能随便猜测或默认
  if (!lang) {
    throw new Error(`i18n: 必须提供有效的目标语言(locale)参数，当前传入值为 "${String(lang)}"，无法进行翻译！`);
  }

  const normalizedLang = lang.toLowerCase();
  if (normalizedLang !== 'en' && normalizedLang !== 'zh') {
    throw new Error(`i18n: 不支持的目标语言 "${lang}"，当前仅支持 "en" 和 "zh"！`);
  }

  const dict = normalizedLang === 'zh' ? zh : en;
  const keys = key.split('.');
  
  let current: any = dict;
  for (const k of keys) {
    if (current && typeof current === 'object' && k in current) {
      current = current[k];
    } else {
      throw new Error(`i18n: 找不到语言 "${normalizedLang}" 下对应的翻译键名 "${key}"！请在字典中配置该项！`);
    }
  }

  if (typeof current !== 'string') {
    throw new Error(`i18n: 翻译键名 "${key}" 对应的解析结果不是一个字符串类型！`);
  }

  return current;
}

/**
 * 帮助函数，将当前带有语言参数的 URL 进行更新，或者用于在路由跳转时自动携带当前语言参数
 * 
 * @param href 基础跳转 URL 链接
 * @param lang 当前所处的语言参数
 */
export function getHrefWithLang(href: string, lang: string | null | undefined): string {
  if (!href) {
    throw new Error('getHrefWithLang: 必须提供跳转链接 href！');
  }
  if (!lang) {
    return href; // 若无语言参数，不作追加
  }
  
  // 仅在 lang 存在且为有效语种时追加
  const cleanLang = lang.toLowerCase();
  if (cleanLang !== 'en' && cleanLang !== 'zh') {
    throw new Error(`getHrefWithLang: 不支持的语言参数 "${lang}"！`);
  }

  if (href.includes('?')) {
    const parts = href.split('?');
    const params = new URLSearchParams(parts[1]);
    params.set('lang', cleanLang);
    return `${parts[0]}?${params.toString()}`;
  }

  return `${href}?lang=${cleanLang}`;
}
