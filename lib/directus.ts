import { createDirectus, rest } from '@directus/sdk';

export interface DirectusFile {
  id: string;
  filename_disk: string;
  filename_download: string;
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
  products_id: number | Product;
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
  articles_id: number | Article;
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

export interface Schema {
  categories: Category[];
  subcategories: Subcategory[];
  products: Product[];
  products_translations: ProductTranslation[];
  articles: Article[];
  articles_translations: ArticleTranslation[];
  banners: Banner[];
  inquiries: Inquiry[];
}

const directusUrl = process.env.NEXT_PUBLIC_DIRECTUS_URL;
if (!directusUrl) {
  // 禁止兜底默认值，必须抛出错误暴露缺失
  throw new Error('NEXT_PUBLIC_DIRECTUS_URL 环境变量未配置，请检查您的 .env 文件！');
}

export { directusUrl };

/** CMS 内容读取：开发环境不缓存；生产环境 ISR 60 秒，后台更新后较快反映到前台 */
const cmsFetchRevalidateSeconds = 60;

export const directus = createDirectus<Schema>(directusUrl).with(
  rest({
    onRequest: (options) => {
      if (process.env.NODE_ENV === 'development') {
        return { ...options, cache: 'no-store' as RequestCache };
      }
      return {
        ...options,
        next: { revalidate: cmsFetchRevalidateSeconds },
      };
    },
  }),
);

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

/** 轮播图 URL（使用文件 modified_on / filesize 等元数据破坏缓存） */
export function getBannerImageUrl(banner: { image: Banner['image'] }): string {
  return getFileUrl(banner.image, BANNER_IMAGE_TRANSFORM);
}
