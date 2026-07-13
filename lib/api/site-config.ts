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

const SITE_SETTINGS_TOP_LEVEL_FIELDS = [
  'id',
  'status',
  'site_title',
  'site_name_display_enabled',
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
  'header_navigation_links',
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
] as const;

const SITE_SETTINGS_TOP_LEVEL_FIELDS_WITHOUT_SITE_NAME_DISPLAY =
  SITE_SETTINGS_TOP_LEVEL_FIELDS.filter((field) => field !== 'site_name_display_enabled');
const SITE_SETTINGS_TOP_LEVEL_FIELDS_WITHOUT_HEADER_NAVIGATION =
  SITE_SETTINGS_TOP_LEVEL_FIELDS.filter((field) => field !== 'header_navigation_links');
const LEGACY_SITE_SETTINGS_TOP_LEVEL_FIELDS =
  SITE_SETTINGS_TOP_LEVEL_FIELDS.filter(
    (field) => field !== 'site_name_display_enabled' && field !== 'header_navigation_links',
  );

const SITE_SETTINGS_TRANSLATION_FIELDS = [
  'id',
  'languages_code',
  'site_name',
  'browser_title_prefix',
  'brand_highlight_name',
  'why_choose_title_suffix',
  'company_name',
  'company_short_description',
  'hq_title',
  'company_address',
  'quote_button_text',
  'footer_copyright',
  'default_meta_title',
  'default_meta_keywords',
  'default_meta_description',
] as const;

const SITE_SETTINGS_TRANSLATION_FIELDS_WITHOUT_HQ_TITLE =
  SITE_SETTINGS_TRANSLATION_FIELDS.filter((field) => field !== 'hq_title');

const SITE_SETTINGS_FIELDS = [
  ...SITE_SETTINGS_TOP_LEVEL_FIELDS,
  {
    translations: SITE_SETTINGS_TRANSLATION_FIELDS,
  },
] as const;

const SITE_SETTINGS_FIELDS_WITHOUT_HQ_TITLE = [
  ...SITE_SETTINGS_TOP_LEVEL_FIELDS,
  {
    translations: SITE_SETTINGS_TRANSLATION_FIELDS_WITHOUT_HQ_TITLE,
  },
] as const;

const SITE_SETTINGS_FIELDS_WITHOUT_SITE_NAME_DISPLAY = [
  ...SITE_SETTINGS_TOP_LEVEL_FIELDS_WITHOUT_SITE_NAME_DISPLAY,
  {
    translations: SITE_SETTINGS_TRANSLATION_FIELDS,
  },
] as const;

const SITE_SETTINGS_FIELDS_WITHOUT_HEADER_NAVIGATION = [
  ...SITE_SETTINGS_TOP_LEVEL_FIELDS_WITHOUT_HEADER_NAVIGATION,
  {
    translations: SITE_SETTINGS_TRANSLATION_FIELDS,
  },
] as const;

const LEGACY_SITE_SETTINGS_FIELDS = [
  ...LEGACY_SITE_SETTINGS_TOP_LEVEL_FIELDS,
  {
    translations: SITE_SETTINGS_TRANSLATION_FIELDS_WITHOUT_HQ_TITLE,
  },
] as const;

type SiteSettingsFieldSet =
  | typeof SITE_SETTINGS_FIELDS
  | typeof SITE_SETTINGS_FIELDS_WITHOUT_HQ_TITLE
  | typeof SITE_SETTINGS_FIELDS_WITHOUT_SITE_NAME_DISPLAY
  | typeof SITE_SETTINGS_FIELDS_WITHOUT_HEADER_NAVIGATION
  | typeof LEGACY_SITE_SETTINGS_FIELDS;

function errorMessage(error: unknown): string {
  if (error instanceof Error) return error.message;
  if (typeof error === 'string') return error;
  if (!error || typeof error !== 'object') return String(error);

  const messages: string[] = [];
  const record = error as Record<string, unknown>;

  if (typeof record.message === 'string') {
    messages.push(record.message);
  }

  if (Array.isArray(record.errors)) {
    for (const item of record.errors) {
      if (!item || typeof item !== 'object') continue;
      const errorItem = item as Record<string, unknown>;
      if (typeof errorItem.message === 'string') {
        messages.push(errorItem.message);
      }
      const extensions = errorItem.extensions;
      if (extensions && typeof extensions === 'object') {
        const reason = (extensions as Record<string, unknown>).reason;
        if (typeof reason === 'string') {
          messages.push(reason);
        }
      }
    }
  }

  return messages.join(' ') || String(error);
}

function warnCmsFallback(scope: string, error: unknown): void {
  if (process.env.NODE_ENV === 'production') return;
  console.warn(`[site-config] ${scope} fallback: ${errorMessage(error)}`);
}

function isMissingSiteSettingsCompatibilityFieldError(error: unknown): boolean {
  const message = errorMessage(error);
  return (
    message.includes('site_name_display_enabled') ||
    message.includes('header_navigation_links') ||
    message.includes('hq_title')
  );
}

function siteSettingsFallbackFieldSets(error: unknown): SiteSettingsFieldSet[] {
  const message = errorMessage(error);
  const fieldSets: SiteSettingsFieldSet[] = [];

  if (message.includes('hq_title')) {
    fieldSets.push(SITE_SETTINGS_FIELDS_WITHOUT_HQ_TITLE);
  }
  if (message.includes('site_name_display_enabled')) {
    fieldSets.push(SITE_SETTINGS_FIELDS_WITHOUT_SITE_NAME_DISPLAY);
  }
  if (message.includes('header_navigation_links')) {
    fieldSets.push(SITE_SETTINGS_FIELDS_WITHOUT_HEADER_NAVIGATION);
  }

  fieldSets.push(LEGACY_SITE_SETTINGS_FIELDS);
  return fieldSets;
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
  const readSiteSettings = async (fields: SiteSettingsFieldSet) => {
    const response = (await directus.request(
      readItems('site_settings', {
        fields,
        filter: { status: { _eq: 'published' } },
        sort: ['id'],
        limit: 1,
      }),
    )) as unknown;
    const items = Array.isArray(response) ? response : response ? [response as SiteSettings] : [];

    const siteSettings = items?.[0] ?? DEFAULT_SITE_SETTINGS;
    return {
      ...siteSettings,
      site_name_display_enabled: siteSettings.site_name_display_enabled ?? true,
      header_navigation_links: siteSettings.header_navigation_links ?? DEFAULT_SITE_SETTINGS.header_navigation_links,
    };
  };

  try {
    return await readSiteSettings(SITE_SETTINGS_FIELDS);
  } catch (error) {
    if (isMissingSiteSettingsCompatibilityFieldError(error)) {
      let lastError = error;
      for (const fields of siteSettingsFallbackFieldSets(error)) {
        try {
          return await readSiteSettings(fields);
        } catch (fallbackError) {
          lastError = fallbackError;
          if (!isMissingSiteSettingsCompatibilityFieldError(fallbackError)) {
            break;
          }
        }
      }

      warnCmsFallback('site_settings', lastError);
      return DEFAULT_SITE_SETTINGS;
    }

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
