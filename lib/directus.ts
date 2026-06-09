import { createDirectus, rest, type DirectusClient, type RestClient } from '@directus/sdk';
import { CMS_REVALIDATE_TAGS, cmsFetchNextOptions } from '@/lib/cms-cache';

export interface DirectusFile {
  id: string;
  filename_disk?: string;
  filename_download?: string;
  title?: string;
  type?: string;
  /** 文件元数据，用于拼接缓存破坏参数（后台换图后强制浏览器重新拉取） */
  modified_on?: string;
  uploaded_on?: string;
  filesize?: number | string;
}

export interface Category {
  id: number;
  name: string;
  name_cn: string;
  slug: string;
  image?: string | DirectusFile | null;
  sort?: number;
  status: 'published' | 'draft';
}

export interface Subcategory {
  id: number;
  name: string;
  name_cn: string;
  slug: string;
  category_id: number | Category;
  sort?: number;
}

export interface ProductTranslation {
  id: number;
  products_id?: number | Product;
  languages_code: string;
  product_title: string;
  product_description?: string;
}

export interface Product {
  id: number;
  slug: string;
  image?: string | DirectusFile | null;
  category_id?: number | Category | null;
  subcategory_id?: number | Subcategory | null;
  sort?: number;
  status: 'published' | 'draft' | 'archived';
  translations?: ProductTranslation[] | null;
}

export interface ArticleTranslation {
  id: number;
  articles_id?: number | Article;
  languages_code: string;
  title: string;
  excerpt?: string;
  content?: string;
  category?: string;
}

export interface Article {
  id: number;
  slug: string;
  image?: string | DirectusFile | null;
  is_featured?: boolean;
  status: 'published' | 'draft';
  date_published?: string;
  translations?: ArticleTranslation[] | null;
}

export interface Banner {
  id: number;
  image: string | DirectusFile;
  sort?: number;
  status: 'published' | 'draft';
}

export interface Inquiry {
  id: number;
  name: string;
  email: string;
  country?: string;
  product_interest?: string;
  quantity?: string;
  message: string;
  source_page?: string;
  source_product_slug?: string;
  status: 'new' | 'processing' | 'replied' | 'closed';
}

export type JsonValue = string | number | boolean | null | JsonValue[] | { [key: string]: JsonValue };

export interface SiteSettingsTranslation {
  id: number;
  site_settings_id?: number | SiteSettings;
  languages_code: string;
  company_name: string;
  company_short_description?: string;
  company_address?: string;
  quote_button_text?: string;
  footer_copyright?: string;
  default_meta_title?: string;
  default_meta_keywords?: string;
  default_meta_description?: string;
}

export interface SiteBrandAsset {
  id: number;
  site_settings_id?: number | SiteSettings;
  asset_type: 'logo' | 'footer_logo' | 'favicon';
  file?: string | DirectusFile | null;
  sort?: number;
}

export interface SiteSettings {
  id: number;
  status: 'published' | 'draft';
  logo?: string | DirectusFile | null;
  footer_logo?: string | DirectusFile | null;
  favicon?: string | DirectusFile | null;
  primary_color?: string;
  cta_color?: string;
  body_background?: string;
  heading_text_color?: string;
  body_text_color?: string;
  font_family?: string;
  header_background_color?: string;
  header_background_opacity?: number;
  header_text_color?: string;
  header_hover_text_color?: string;
  quote_button_enabled?: boolean;
  language_switch_enabled?: boolean;
  footer_background_color?: string;
  footer_text_color?: string;
  footer_link_color?: string;
  email?: string;
  phone?: string;
  whatsapp?: string;
  brand_assets?: SiteBrandAsset[] | null;
  style_settings?: JsonValue;
  contact_methods?: JsonValue;
  social_links?: JsonValue;
  quick_links?: JsonValue;
  analytics_settings?: JsonValue;
  translations?: SiteSettingsTranslation[] | null;
}

export interface SeoPageTranslation {
  id: number;
  seo_pages_id?: number | SeoPage;
  languages_code: string;
  title: string;
  keywords?: string;
  description?: string;
}

export interface SeoPage {
  id: number;
  page_key: string;
  status: 'published' | 'draft';
  sort?: number;
  translations?: SeoPageTranslation[] | null;
}

export interface PageSectionTranslation {
  id: number;
  page_sections_id?: number | PageSection;
  languages_code: string;
  eyebrow?: string;
  title?: string;
  subtitle?: string;
  content?: string;
  cta_label?: string;
  cta_href?: string;
  content_json?: JsonValue;
}

export interface PageSection {
  id: number;
  page_layout_id?: number | PageLayout;
  section_key: string;
  section_type: string;
  status: 'published' | 'draft';
  sort?: number;
  is_system?: boolean;
  background_color?: string;
  text_color?: string;
  image?: string | DirectusFile | null;
  settings?: JsonValue;
  translations?: PageSectionTranslation[] | null;
}

export interface PageLayout {
  id: number;
  page_key: string;
  name: string;
  status: 'published' | 'draft';
  sort?: number;
  is_template?: boolean;
  sections?: PageSection[] | null;
}

export interface Schema {
  categories: Category[];
  subcategories: Subcategory[];
  products: Product[];
  products_translations: ProductTranslation[];
  articles: Article[];
  articles_translations: ArticleTranslation[];
  banners: Banner[];
  inquiries: Inquiry[];
  site_settings: SiteSettings[];
  site_brand_assets: SiteBrandAsset[];
  site_settings_translations: SiteSettingsTranslation[];
  seo_pages: SeoPage[];
  seo_pages_translations: SeoPageTranslation[];
  page_layouts: PageLayout[];
  page_sections: PageSection[];
  page_sections_translations: PageSectionTranslation[];
}

export function getDirectusUrl(): string {
  const directusUrl = process.env.DIRECTUS_URL;
  if (!directusUrl) {
    throw new Error('DIRECTUS_URL 环境变量未配置，请检查您的 .env 文件！');
  }
  return directusUrl;
}

export const DIRECTUS_FILE_FIELDS = [
  'id',
  'filename_download',
  'modified_on',
  'uploaded_on',
  'filesize',
  'type',
] as const;

export function directusFileField(field: string) {
  return { [field]: [...DIRECTUS_FILE_FIELDS] } as any;
}

type DirectusRestClient = DirectusClient<Schema> & RestClient<Schema>;

let directusClient: DirectusRestClient | null = null;

function getDirectusClient() {
  if (!directusClient) {
    directusClient = createDirectus<Schema>(getDirectusUrl()).with(
      rest({
        onRequest: (options) => {
          if (process.env.NODE_ENV === 'development') {
            return { ...options, cache: 'no-store' as RequestCache };
          }
          return {
            ...options,
            next: cmsFetchNextOptions([
              CMS_REVALIDATE_TAGS.siteConfig,
              CMS_REVALIDATE_TAGS.products,
              CMS_REVALIDATE_TAGS.articles,
            ]),
          };
        },
      }),
    ) as DirectusRestClient;
  }
  return directusClient;
}

export const directus = new Proxy({} as DirectusRestClient, {
  get(_target, prop) {
    return Reflect.get(getDirectusClient(), prop);
  },
});

function getFileVersionToken(image: DirectusFile): string | null {
  const parts = [image.modified_on, image.uploaded_on, image.filesize, image.filename_download];
  const token = parts
    .filter((part) => part !== undefined && part !== null && String(part).trim() !== '')
    .join('-');
  return token || null;
}

type CmsImageFormat = 'auto' | 'jpg' | 'png' | 'webp' | 'tiff';
type CmsImageFit = 'cover' | 'contain' | 'inside' | 'outside';

type CmsImageTransformOptions = {
  width?: number;
  height?: number;
  quality?: number;
  format?: CmsImageFormat;
  fit?: CmsImageFit;
};

const DEFAULT_CMS_IMAGE_TRANSFORM: CmsImageTransformOptions = {
  width: 1600,
  quality: 80,
  format: 'webp',
};

const BANNER_IMAGE_TRANSFORM: CmsImageTransformOptions = {
  width: 1920,
  quality: 80,
  format: 'webp',
};

function appendImageTransformParams(
  params: URLSearchParams,
  transform: CmsImageTransformOptions,
): void {
  Object.entries(transform).forEach(([key, value]) => {
    if (value !== undefined && value !== null) {
      params.set(key, String(value));
    }
  });
}

/**
 * 返回站内代理后的 CMS 图片 URL（避免 Directus /assets 默认长期缓存）。
 * 同时附加 Directus 图片转换参数，在访问时输出压缩后的 WebP 版本。
 *
 * @param image 图像 UUID 或 Directus 文件对象（推荐传对象以携带 modified_on / filesize）
 */
export function getFileUrl(
  image: string | DirectusFile | null | undefined,
  transform: CmsImageTransformOptions = DEFAULT_CMS_IMAGE_TRANSFORM,
): string {
  if (!image) return '';
  const id = typeof image === 'object' ? image.id : image;
  if (!id) return '';

  const params = new URLSearchParams();
  const version = typeof image === 'object' ? getFileVersionToken(image) : null;
  if (version) {
    params.set('v', version);
  }
  appendImageTransformParams(params, transform);
  const query = params.toString();
  const path = `/api/cms-assets/${id}`;
  if (!query) {
    return path;
  }
  return `${path}?${query}`;
}

/** 原始资源 URL：用于 SVG Logo、favicon、证书图标等不应强制转 WebP 的资源。 */
export function getRawFileUrl(image: string | DirectusFile | null | undefined): string {
  if (!image) return '';
  const id = typeof image === 'object' ? image.id : image;
  if (!id) return '';

  const params = new URLSearchParams();
  const version = typeof image === 'object' ? getFileVersionToken(image) : null;
  if (version) {
    params.set('v', version);
  }
  const query = params.toString();
  const path = `/api/cms-assets/${id}`;
  return query ? `${path}?${query}` : path;
}

/** 轮播图 URL（使用文件 modified_on / filesize 等元数据破坏缓存） */
export function getBannerImageUrl(banner: { image: Banner['image'] }): string {
  return getFileUrl(banner.image, BANNER_IMAGE_TRANSFORM);
}
