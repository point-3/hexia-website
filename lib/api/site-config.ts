import { readItems } from '@directus/sdk';
import {
  directus,
  directusFileField,
  type PageLayout,
  type SeoPage,
  type SiteSettings,
} from '../directus';
import { DEFAULT_SITE_SETTINGS, DEFAULT_SITE_TRANSLATIONS } from '../site-defaults';

export type SitePageKey = 'home' | 'products' | 'service' | 'about' | 'contact' | 'news';

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

export async function getSiteSettings(): Promise<SiteSettings> {
  try {
    const response = (await directus.request(
      readItems('site_settings', {
        fields: [
          'id',
          'status',
          'site_title',
          'theme_primary',
          'theme_primary_dark',
          'theme_accent',
          'theme_bg_page',
          'theme_bg_card',
          'theme_text_body',
          'theme_border',
          'theme_bg_muted',
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
          'social_links',
          'quick_links',
          'analytics_settings',
          directusFileField('logo'),
          directusFileField('footer_logo'),
          directusFileField('favicon'),
          {
            translations: [
              'id',
              'languages_code',
              'site_name',
              'browser_title_prefix',
              'brand_highlight_name',
              'why_choose_title_suffix',
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

    return items?.[0] ?? DEFAULT_SITE_SETTINGS;
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
              'title_suffix_en',
              'title_suffix_zh',
              'background_color',
              'text_color',
              'stat_card_background_color',
              'content_en',
              'content_zh',
              'cta_label_en',
              'cta_href_en',
              'cta_label_zh',
              'cta_href_zh',
              'feature_cards_en',
              'feature_cards_zh',
              'stat_cards_en',
              'stat_cards_zh',
              'home_service_cards_en',
              'home_service_cards_zh',
              'service_overview_cards_en',
              'service_overview_cards_zh',
              'partner_items_en',
              'partner_items_zh',
              'presence_cards_en',
              'presence_cards_zh',
              'contact_cards_en',
              'contact_cards_zh',
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
                  'feature_cards',
                  'stat_cards',
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
