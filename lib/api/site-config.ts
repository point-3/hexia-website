import { readItems } from '@directus/sdk';
import {
  directus,
  directusFileField,
  type PageLayout,
  type SeoPage,
  type SiteSettings,
  type SiteSettingsTranslation,
} from '../directus';

export type SitePageKey = 'home' | 'products' | 'service' | 'about' | 'contact' | 'news';

const DEFAULT_SITE_TRANSLATIONS: SiteSettingsTranslation[] = [
  {
    id: 0,
    site_settings_id: 0,
    languages_code: 'en-US',
    company_name: 'Hexia (Suzhou) Biotechnology Co., Ltd.',
    company_short_description:
      'Professional supplier of feed additives, food additives, vitamins, amino acids and nutritional raw materials.',
    company_address: 'Suzhou, China',
    quote_button_text: 'Get a Quote',
    footer_copyright: 'Copyright © 2026 Hexia (Suzhou) Biotechnology Co., Ltd. All Rights Reserved.',
    default_meta_title:
      'HexiaBio | Morehope Group, Feed Additives, Food Additives & Nutritional Raw Materials Supplier',
    default_meta_keywords: 'feed additives, food additives, vitamins, amino acids, nutritional raw materials',
    default_meta_description:
      'Suzhou Hexia Biotechnology is a professional supplier of feed additives, food additives, vitamins, amino acids and health nutrition raw materials. OEM & ODM premix service, global export from China.',
  },
  {
    id: 0,
    site_settings_id: 0,
    languages_code: 'zh-CN',
    company_name: '和夏（苏州）生物科技有限公司',
    company_short_description: '饲料添加剂、食品添加剂、维生素、氨基酸和营养原料供应商。',
    company_address: '中国苏州',
    quote_button_text: '获取报价',
    footer_copyright: 'Copyright © 2026 和夏（苏州）生物科技有限公司 版权所有。',
    default_meta_title: '和夏生物 | 饲料添加剂、食品添加剂与营养原料供应商',
    default_meta_keywords: '饲料添加剂, 食品添加剂, 维生素, 氨基酸, 营养原料',
    default_meta_description: '和夏（苏州）生物科技有限公司专注饲料添加剂、食品添加剂、维生素、氨基酸和营养原料供应。',
  },
];

export const DEFAULT_SITE_SETTINGS: SiteSettings = {
  id: 0,
  status: 'published',
  primary_color: '#1B4D3E',
  cta_color: '#E9B35F',
  body_background: '#FDFBF7',
  heading_text_color: '#1B4D3E',
  body_text_color: '#636E72',
  font_family: 'Inter',
  header_background_color: '#2D6A4F',
  header_background_opacity: 100,
  header_text_color: '#1B4D3E',
  header_hover_text_color: '#E9B35F',
  quote_button_enabled: true,
  language_switch_enabled: true,
  footer_background_color: '#1B4D3E',
  footer_text_color: '#FFFFFF',
  footer_link_color: '#E9B35F',
  email: 'justin@hexiabio.com',
  phone: '',
  whatsapp: '',
  social_links: {},
  quick_links: [
    { label: 'Home', href: '/', enabled: true },
    { label: 'Products', href: '/products', enabled: true },
    { label: 'Service', href: '/service', enabled: true },
    { label: 'About Us', href: '/about', enabled: true },
    { label: 'Contact Us', href: '/contact', enabled: true },
  ],
  analytics_settings: {},
  translations: DEFAULT_SITE_TRANSLATIONS,
};

function warnCmsFallback(scope: string, error: unknown): void {
  if (process.env.NODE_ENV === 'production') return;
  const message = error instanceof Error ? error.message : String(error);
  console.warn(`[site-config] ${scope} fallback: ${message}`);
}

function fallbackSeoPage(pageKey: SitePageKey, siteSettings: SiteSettings): SeoPage {
  const translations = (siteSettings.translations ?? DEFAULT_SITE_TRANSLATIONS).map((translation, index) => ({
    id: 0,
    seo_pages_id: 0,
    languages_code: translation.languages_code,
    title: translation.default_meta_title || translation.company_name,
    keywords: translation.default_meta_keywords || '',
    description: translation.default_meta_description || translation.company_short_description || '',
  }));

  return {
    id: 0,
    page_key: pageKey,
    status: 'published',
    sort: 0,
    translations,
  };
}

export function fallbackPageLayout(pageKey: SitePageKey): PageLayout {
  return {
    id: 0,
    page_key: pageKey,
    name: pageKey,
    status: 'published',
    sort: 0,
    is_template: false,
    sections: [],
  };
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return Boolean(value) && typeof value === 'object' && !Array.isArray(value);
}

function itemString(item: Record<string, unknown>, key: string): string {
  const value = item[key];
  return typeof value === 'string' ? value.trim() : '';
}

function itemEnabled(item: Record<string, unknown>): boolean {
  return item.enabled !== false;
}

function parseSettingValue(value: string): string | number | boolean {
  const normalized = value.trim().toLowerCase();
  if (['true', '1', 'yes', 'on'].includes(normalized)) return true;
  if (['false', '0', 'no', 'off'].includes(normalized)) return false;
  if (/^-?\d+(\.\d+)?$/.test(value.trim())) return Number(value);
  return value;
}

function normalizeSiteSettings(settings: SiteSettings): SiteSettings {
  const normalized: SiteSettings = { ...settings };

  if (Array.isArray(settings.brand_assets)) {
    for (const asset of settings.brand_assets) {
      if (!asset?.asset_type || !asset.file) continue;
      if (asset.asset_type === 'logo') normalized.logo = asset.file;
      if (asset.asset_type === 'footer_logo') normalized.footer_logo = asset.file;
      if (asset.asset_type === 'favicon') normalized.favicon = asset.file;
    }
  }

  if (Array.isArray(settings.style_settings)) {
    for (const item of settings.style_settings) {
      if (!isRecord(item) || !itemEnabled(item)) continue;
      const key = itemString(item, 'key');
      const value = itemString(item, 'value');
      if (!key || !value) continue;
      (normalized as unknown as Record<string, unknown>)[key] = parseSettingValue(value);
    }
  }

  if (Array.isArray(settings.contact_methods)) {
    for (const item of settings.contact_methods) {
      if (!isRecord(item) || !itemEnabled(item)) continue;
      const type = itemString(item, 'type');
      const value = itemString(item, 'value');
      if (!type || !value) continue;
      if (type === 'email') normalized.email = value;
      if (type === 'phone') normalized.phone = value;
      if (type === 'whatsapp') normalized.whatsapp = value;
    }
  }

  return normalized;
}

export async function getSiteSettings(): Promise<SiteSettings> {
  try {
    const response = (await directus.request(
      readItems('site_settings', {
        fields: [
          'id',
          'status',
          'primary_color',
          'cta_color',
          'body_background',
          'heading_text_color',
          'body_text_color',
          'font_family',
          'header_background_color',
          'header_background_opacity',
          'header_text_color',
          'header_hover_text_color',
          'quote_button_enabled',
          'language_switch_enabled',
          'footer_background_color',
          'footer_text_color',
          'footer_link_color',
          'email',
          'phone',
          'whatsapp',
          'style_settings',
          'contact_methods',
          'social_links',
          'quick_links',
          'analytics_settings',
          directusFileField('logo'),
          directusFileField('footer_logo'),
          directusFileField('favicon'),
          {
            brand_assets: [
              'id',
              'asset_type',
              'sort',
              {
                file: [
                  'id',
                  'filename_download',
                  'modified_on',
                  'uploaded_on',
                  'filesize',
                  'type',
                ],
              },
            ],
          },
          {
            translations: [
              'id',
              'languages_code',
              'company_name',
              'company_short_description',
              'company_address',
              'quote_button_text',
              'footer_copyright',
              'default_meta_title',
              'default_meta_keywords',
              'default_meta_description',
            ],
          },
        ],
        filter: { status: { _eq: 'published' } },
        sort: ['id'],
        limit: 1,
      }),
    )) as unknown;
    const items = Array.isArray(response) ? response : response ? [response as SiteSettings] : [];

    return items?.[0] ? normalizeSiteSettings(items[0]) : DEFAULT_SITE_SETTINGS;
  } catch (error) {
    warnCmsFallback('site_settings', error);
    return DEFAULT_SITE_SETTINGS;
  }
}

export async function getSeoPage(pageKey: SitePageKey, siteSettings = DEFAULT_SITE_SETTINGS): Promise<SeoPage> {
  try {
    const items = (await directus.request(
      readItems('seo_pages', {
        fields: [
          'id',
          'page_key',
          'status',
          'sort',
          { translations: ['id', 'languages_code', 'title', 'keywords', 'description'] },
        ],
        filter: {
          page_key: { _eq: pageKey },
          status: { _eq: 'published' },
        },
        limit: 1,
      }),
    )) as unknown as SeoPage[];

    return items?.[0] ?? fallbackSeoPage(pageKey, siteSettings);
  } catch (error) {
    warnCmsFallback(`seo_pages.${pageKey}`, error);
    return fallbackSeoPage(pageKey, siteSettings);
  }
}

export async function getPageLayout(pageKey: SitePageKey): Promise<PageLayout> {
  try {
    const items = (await directus.request(
      readItems('page_layouts', {
        fields: [
          'id',
          'page_key',
          'name',
          'status',
          'sort',
          'is_template',
          {
            sections: [
              'id',
              'section_key',
              'section_type',
              'status',
              'sort',
              'is_system',
              'background_color',
              'text_color',
              'settings',
              directusFileField('image'),
              {
                translations: [
                  'id',
                  'languages_code',
                  'eyebrow',
                  'title',
                  'subtitle',
                  'content',
                  'cta_label',
                  'cta_href',
                  'content_json',
                ],
              },
            ],
          },
        ],
        filter: {
          page_key: { _eq: pageKey },
          status: { _eq: 'published' },
          is_template: { _eq: false },
        },
        deep: {
          sections: {
            _filter: { status: { _eq: 'published' } },
            _sort: ['sort'],
          },
        },
        sort: ['sort'],
        limit: 1,
      }),
    )) as unknown as PageLayout[];

    return items?.[0] ?? fallbackPageLayout(pageKey);
  } catch (error) {
    warnCmsFallback(`page_layouts.${pageKey}`, error);
    return fallbackPageLayout(pageKey);
  }
}

export async function getSiteConfig(pageKey: SitePageKey = 'home') {
  const siteSettings = await getSiteSettings();
  const [seoPage, pageLayout] = await Promise.all([
    getSeoPage(pageKey, siteSettings),
    getPageLayout(pageKey),
  ]);

  return {
    siteSettings,
    seoPage,
    pageLayout,
  };
}
