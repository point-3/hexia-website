import { en } from './locales/en';
import { zh } from './locales/zh';
import { Article, Product } from './directus';

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

/**
 * 提取产品对应当前语言的翻译标题与描述。
 * 按照规范，禁止任何降级或默认值兜底，匹配不到翻译时直接抛出 Error！
 * 
 * @param product 产品数据对象
 * @param lang 语种参数 ('zh' | 'en')
 */
export function getProductTranslation(
  product: Product,
  lang: string | null | undefined
): { product_title: string; product_description: string } {
  if (!product) {
    throw new Error('getProductTranslation: 必须提供非空 product 对象进行翻译解析！');
  }
  if (!lang) {
    throw new Error(`getProductTranslation: 必须提供有效的目标语言参数，当前传入值为 "${String(lang)}"，无法翻译产品 "${product.slug}"！`);
  }

  const normalizedLang = lang.toLowerCase();
  let targetLangCode = '';
  if (normalizedLang === 'zh') {
    targetLangCode = 'zh-CN';
  } else if (normalizedLang === 'en') {
    targetLangCode = 'en-US';
  } else {
    throw new Error(`getProductTranslation: 不支持的目标语言 "${lang}"！当前仅支持 "zh" 和 "en"`);
  }

  if (!product.translations || !Array.isArray(product.translations)) {
    throw new Error(`getProductTranslation: 产品 "${product.slug}" 缺少 translations 关联数组，无法解析翻译！`);
  }

  const translation = product.translations.find(t => t.languages_code === targetLangCode);
  if (!translation) {
    throw new Error(`getProductTranslation: 找不到产品 "${product.slug}" 对应的语言为 "${targetLangCode}" 的翻译记录！`);
  }

  // 严格要求 product_title 必须存在，防止出现白屏或空文字
  if (!translation.product_title || !translation.product_title.trim()) {
    throw new Error(`getProductTranslation: 产品 "${product.slug}" 对应的语言 "${targetLangCode}" 翻译标题(product_title)为空！`);
  }

  return {
    product_title: translation.product_title,
    product_description: translation.product_description || ''
  };
}

export type ArticleCopy = {
  title: string;
  excerpt: string;
  content: string;
  category: string;
};

function resolveArticleLangCode(lang: string | null | undefined, slug: string): string {
  if (!lang) {
    throw new Error(
      `resolveArticleTranslation: 必须提供有效的目标语言，当前为 "${String(lang)}"，文章 "${slug}"！`,
    );
  }
  const normalizedLang = lang.toLowerCase();
  if (normalizedLang === 'zh') return 'zh-CN';
  if (normalizedLang === 'en') return 'en-US';
  throw new Error(`resolveArticleTranslation: 不支持的目标语言 "${lang}"！`);
}

/**
 * 解析文章当前语言文案。缺少该语言翻译或标题为空时返回 null（供页面走 404 / 列表过滤）。
 * translations 结构异常时仍抛出 Error。
 */
export function resolveArticleTranslation(
  article: Article,
  lang: string | null | undefined,
): ArticleCopy | null {
  if (!article) {
    throw new Error('resolveArticleTranslation: 必须提供非空 article 对象！');
  }

  const targetLangCode = resolveArticleLangCode(lang, article.slug);

  if (!article.translations || !Array.isArray(article.translations)) {
    throw new Error(`resolveArticleTranslation: 文章 "${article.slug}" 缺少 translations 关联数组！`);
  }

  const translation = article.translations.find((t) => {
    const code =
      typeof t.languages_code === 'string'
        ? t.languages_code
        : t.languages_code &&
            typeof t.languages_code === 'object' &&
            'code' in t.languages_code &&
            typeof (t.languages_code as { code: string }).code === 'string'
          ? (t.languages_code as { code: string }).code
          : null;
    return code === targetLangCode;
  });
  if (!translation || !translation.title?.trim()) {
    return null;
  }

  return {
    title: translation.title,
    excerpt: translation.excerpt || '',
    content: translation.content || '',
    category: translation.category || '',
  };
}

/**
 * 提取文章对应当前语言的标题、摘要、正文与分类（必须有可用翻译，否则抛错）。
 */
export function getArticleTranslation(
  article: Article,
  lang: string | null | undefined,
): ArticleCopy {
  const copy = resolveArticleTranslation(article, lang);
  if (!copy) {
    const targetLangCode = resolveArticleLangCode(lang, article.slug);
    throw new Error(
      `getArticleTranslation: 文章 "${article.slug}" 缺少可用的 "${targetLangCode}" 翻译！`,
    );
  }
  return copy;
}
